/**
 * server/middleware/validateBooking.js
 * Shared booking payload validation and normalisation.
 *
 * Used by both:
 *   - api/booking.js          (Vercel serverless)
 *   - server/routes/booking.route.js  (Express / Hostinger)
 *
 * Keep validation logic here only — no framework imports.
 */

'use strict';

/**
 * Validates a raw booking payload.
 * Returns a human-readable error string on failure, or null on success.
 *
 * @param {object} payload
 * @returns {string|null}
 */
function validatePayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return 'Request body is missing or not an object.';
  }

  const { arrival, departure, adults, children, name, phone } = payload;

  if (!arrival || typeof arrival !== 'string') {
    return 'Arrival date is required.';
  }
  if (!departure || typeof departure !== 'string') {
    return 'Departure date is required.';
  }

  // Basic ISO date format check (YYYY-MM-DD)
  const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
  if (!ISO_DATE.test(arrival)) {
    return 'Arrival date must be in YYYY-MM-DD format.';
  }
  if (!ISO_DATE.test(departure)) {
    return 'Departure date must be in YYYY-MM-DD format.';
  }
  if (arrival >= departure) {
    return 'Departure date must be after arrival date.';
  }

  if (typeof adults !== 'number' || adults < 1 || adults > 20) {
    return 'Adults must be a number between 1 and 20.';
  }
  if (typeof children !== 'number' || children < 0 || children > 10) {
    return 'Children must be a number between 0 and 10.';
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return 'A valid name is required.';
  }
  if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
    return 'A valid phone number is required.';
  }

  // If children > 0, ages array must be present and fully filled
  if (children > 0) {
    if (!Array.isArray(payload.childrenAges)) {
      return 'childrenAges must be an array when children > 0.';
    }
    if (payload.childrenAges.length !== children) {
      return `childrenAges must contain exactly ${children} entries.`;
    }
    for (let i = 0; i < payload.childrenAges.length; i++) {
      const age = Number(payload.childrenAges[i]);
      if (!Number.isFinite(age) || age < 0 || age > 17) {
        return `Child ${i + 1} age must be a number between 0 and 17.`;
      }
    }
  }

  return null; // validation passed
}

/**
 * Returns a clean, typed booking object from a validated raw payload.
 * Always call validatePayload() first.
 *
 * @param {object} payload
 * @returns {object}
 */
function normalisePayload(payload) {
  return {
    arrival:      payload.arrival.trim(),
    departure:    payload.departure.trim(),
    adults:       Number(payload.adults),
    children:     Number(payload.children),
    childrenAges: Array.isArray(payload.childrenAges)
      ? payload.childrenAges.map(Number)
      : [],
    name:         payload.name.trim(),
    phone:        payload.phone.trim(),
    request:      (payload.request || '').trim() || 'None',
  };
}

module.exports = { validatePayload, normalisePayload };
