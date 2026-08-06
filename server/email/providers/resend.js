/**
 * server/email/providers/resend.js
 * Resend email provider implementation.
 *
 * Implements the Email Service Interface contract:
 *   sendAdminBookingNotification(booking) → Promise<void>
 *
 * To replace with another provider, create a new file in this
 * directory that exports the same function and update interface.js.
 * This file should NEVER be imported directly by booking logic.
 *
 * Environment variables required:
 *   RESEND_API_KEY  — your Resend API key (re_xxxxxxxxxx)
 *   ADMIN_EMAIL     — the address that receives booking notifications
 *   FROM_EMAIL      — (optional) sender address, defaults to
 *                     onboarding@resend.dev for testing
 */

'use strict';

const { buildAdminBookingEmail } = require('../templates/adminBooking');

// Resend API endpoint
const RESEND_API_URL = 'https://api.resend.com/emails';

/**
 * Sends the admin booking notification via Resend.
 *
 * @param {object} booking - normalised booking object
 * @returns {Promise<void>}
 */
async function sendAdminBookingNotification(booking) {
  const apiKey    = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!apiKey) {
    throw new Error('[Resend] RESEND_API_KEY environment variable is not set.');
  }
  if (!adminEmail) {
    throw new Error('[Resend] ADMIN_EMAIL environment variable is not set.');
  }

  const { subject, html, text } = buildAdminBookingEmail(booking);

  // FROM_EMAIL: use your verified Resend sender domain in production.
  // During development, Resend allows "onboarding@resend.dev" as sender.
  const from = process.env.FROM_EMAIL || 'Jeevika Haven <onboarding@resend.dev>';

  const payload = {
    from,
    to:      [adminEmail],
    subject,
    html,
    text,
  };

  const response = await fetch(RESEND_API_URL, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type':  'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const errBody = await response.json();
      detail = errBody.message || JSON.stringify(errBody);
    } catch (_) {
      detail = `HTTP ${response.status}`;
    }
    throw new Error(`[Resend] Email delivery failed: ${detail}`);
  }

  const result = await response.json();
  console.log('[Resend] Email sent successfully. ID:', result.id);
}

module.exports = { sendAdminBookingNotification };
