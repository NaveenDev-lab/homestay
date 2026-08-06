/**
 * booking.config.js
 * Central configuration for the booking system.
 *
 * To switch submission methods (WhatsApp → Email), update
 * SUBMISSION_METHOD and fill in the relevant credentials below.
 * No other files need to change.
 */

export const BOOKING_CONFIG = {
  // ── Submission method ──────────────────────────────────────────
  // 'api' | 'whatsapp' (whatsapp kept for reference, not used)
  // The frontend now always submits via the booking API endpoint.
  SUBMISSION_METHOD: 'api',

  // ── Contact details ────────────────────────────────────────────
  // WhatsApp number (country code + number, no spaces or +)
  WHATSAPP_NUMBER: '917306239291',

  // Villa contact phone numbers
  PHONE_MATHEW: '+91 94476 64261',
  PHONE_SANJAY: '+91 97784 54869',

  // ── Email (future use) ─────────────────────────────────────────
  // TODO: replace with real admin email before switching to email mode
  ADMIN_EMAIL: 'admin@jeevikahaven.com',   // placeholder

  // Email service provider (e.g. 'emailjs', 'formspree', 'custom-api')
  // TODO: set this when email submission is implemented
  EMAIL_SERVICE: null,

  // ── reCAPTCHA v2 Invisible ─────────────────────────────────────
  // Public site key — safe to expose in the frontend.
  // Get it from: https://www.google.com/recaptcha/admin
  // Set type to "reCAPTCHA v2 — Invisible reCAPTCHA badge"
  // TODO: replace with your real site key
  RECAPTCHA_SITE_KEY: null,   // placeholder — set before going live

  // ── Misc ───────────────────────────────────────────────────────
  // Human-readable villa name used in messages
  VILLA_NAME: 'Jeevika Haven',
};
