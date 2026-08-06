/**
 * api/booking.js
 * Serverless API endpoint — Vercel function format.
 *
 * Validates the incoming booking payload, sends an admin notification
 * email via the Email Service Interface, and returns a JSON response.
 *
 * This file never imports a provider directly — all email delivery is
 * delegated to server/email/interface.js so the provider can be swapped
 * without touching this file.
 *
 * Deployment:
 *   Vercel  — loaded automatically from the /api directory
 *   Hostinger — same handler is re-used via server/routes/booking.route.js
 */

'use strict';

const { validatePayload, normalisePayload } = require('../server/middleware/validateBooking');
const emailService = require('../server/email/interface');

// ── reCAPTCHA verification ────────────────────────────────────────
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

/**
 * Verifies a reCAPTCHA token with Google's server-side API.
 * Returns true on success, false on failure.
 * If RECAPTCHA_SECRET_KEY is not set, verification is skipped (dev mode).
 *
 * @param {string|null} token
 * @returns {Promise<boolean>}
 */
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  // No secret key configured → skip verification (dev/test mode)
  if (!secretKey) {
    console.warn('[reCAPTCHA] RECAPTCHA_SECRET_KEY not set. Skipping verification.');
    return true;
  }

  // Token must be present when secret key is configured
  if (!token) {
    console.warn('[reCAPTCHA] Token missing from request.');
    return false;
  }

  try {
    const params = new URLSearchParams({
      secret:   secretKey,
      response: token,
    });

    const res  = await fetch(`${RECAPTCHA_VERIFY_URL}?${params}`, { method: 'POST' });
    const json = await res.json();

    if (!json.success) {
      console.warn('[reCAPTCHA] Verification failed. Error codes:', json['error-codes']);
    }
    return json.success === true;
  } catch (err) {
    console.error('[reCAPTCHA] Verification request failed:', err.message);
    return false;
  }
}

/**
 * Core booking handler — framework-agnostic.
 */
async function handleBooking(payload) {
  // 1. Validate booking data
  const validationError = validatePayload(payload);
  if (validationError) {
    return { status: 400, body: { success: false, message: validationError } };
  }

  // 2. Verify reCAPTCHA token (skipped in dev if RECAPTCHA_SECRET_KEY not set)
  const tokenValid = await verifyRecaptcha(payload.recaptchaToken || null);
  if (!tokenValid) {
    return {
      status: 400,
      body: { success: false, message: 'Verification failed. Please try again.' },
    };
  }

  // 3. Normalise
  const booking = normalisePayload(payload);
  console.log('[Booking API] Request received:', JSON.stringify(booking, null, 2));

  // 4. Send admin notification email
  try {
    await emailService.sendAdminBookingNotification(booking);
  } catch (emailErr) {
    console.error('[Booking API] Email delivery failed:', emailErr.message);
    return {
      status: 500,
      body: { success: false, message: 'Unable to send booking request.' },
    };
  }

  return {
    status: 200,
    body: { success: true, message: 'Booking submitted successfully.' },
  };
}

// ── Vercel serverless function handler ───────────────────────────
module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const payload = req.body || {};
    const { status, body } = await handleBooking(payload);
    return res.status(status).json(body);
  } catch (err) {
    console.error('[Booking API] Unexpected error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

module.exports.handleBooking = handleBooking;
