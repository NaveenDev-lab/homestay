/**
 * server/email/interface.js
 * Email Service Interface — the only contract the booking system
 * ever talks to. No provider-specific code lives outside of
 * server/email/providers/*.
 *
 * Usage:
 *   const emailService = require('./interface');
 *   await emailService.sendAdminBookingNotification(booking);
 *
 * To swap providers: change the require() line below.
 * Nothing else needs to change anywhere.
 */

'use strict';

// ── Active provider ───────────────────────────────────────────────
// To switch providers, change this single require():
//   './providers/resend'   — Resend API (current)
//   './providers/smtp'     — Nodemailer SMTP (future)
//   './providers/zoho'     — Zoho Mail (future)
//   './providers/ses'      — AWS SES (future)
const provider = require('./providers/resend');

/**
 * Sends the admin booking notification email.
 *
 * @param {object} booking  - normalised booking object from validateBooking.js
 * @returns {Promise<void>} - resolves on success, throws on failure
 */
async function sendAdminBookingNotification(booking) {
  return provider.sendAdminBookingNotification(booking);
}

module.exports = { sendAdminBookingNotification };
