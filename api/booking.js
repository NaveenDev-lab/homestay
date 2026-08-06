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

/**
 * Core booking handler — framework-agnostic.
 * Accepts a plain payload object, validates it, sends the email,
 * and returns a structured { status, body } result.
 *
 * @param {object} payload - raw request body
 * @returns {Promise<{ status: number, body: object }>}
 */
async function handleBooking(payload) {
  // 1. Validate
  const validationError = validatePayload(payload);
  if (validationError) {
    return {
      status: 400,
      body: { success: false, message: validationError },
    };
  }

  // 2. Normalise
  const booking = normalisePayload(payload);
  console.log('[Booking API] Request received:', JSON.stringify(booking, null, 2));

  // 3. Send admin notification email via the Email Service Interface.
  //    The interface decides which provider to use (currently Resend).
  //    To swap providers, update server/email/interface.js only.
  try {
    await emailService.sendAdminBookingNotification(booking);
  } catch (emailErr) {
    // Log the detailed error server-side but return a safe message to the client.
    console.error('[Booking API] Email delivery failed:', emailErr.message);
    return {
      status: 500,
      body: { success: false, message: 'Unable to send booking request.' },
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      message: 'Booking submitted successfully.',
    },
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
