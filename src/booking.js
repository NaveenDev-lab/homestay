/**
 * booking.js
 * Modular booking system — data collection, validation,
 * API submission, loading state, success and error handling.
 *
 * To add email sending later: implement it inside api/booking.js
 * on the server. This file only calls the API endpoint — it never
 * sends email directly.
 *
 * To add reCAPTCHA later: call getRecaptchaToken() before fetch()
 * and attach the token to the payload. No other changes needed here.
 */

import { BOOKING_CONFIG } from './booking.config.js';

// ── API endpoint ──────────────────────────────────────────────────
// Relative path works on both Vercel and Hostinger since the server
// serves the static site from the same origin as the API.
const BOOKING_API_URL = '/api/booking';

// ── Date formatting helper ────────────────────────────────────────
export function fmtDate(isoStr) {
  if (!isoStr) return '—';
  const [y, m, d] = isoStr.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

// ── Booking data collection ───────────────────────────────────────
/**
 * Reads the live booking state and returns a clean normalised object.
 * Also builds the API payload (childrenAges as a numeric array).
 *
 * @param {object} bookingState
 * @returns {object}
 */
export function collectBookingData(bookingState) {
  const { arrival, departure, adults, children, childrenAges, name, phone, request } = bookingState;

  const agesArr = Array.isArray(childrenAges) ? childrenAges : [];

  return {
    // Display-formatted (used in UI)
    arrivalFormatted:   fmtDate(arrival),
    departureFormatted: fmtDate(departure),

    // API payload fields
    arrival,
    departure,
    adults,
    children,
    childrenAges: agesArr.slice(0, children).map(Number),
    name:         (name  || '').trim(),
    phone:        (phone || '').trim(),
    request:      (request || '').trim() || 'None',
  };
}

// ── Form validation ───────────────────────────────────────────────
/**
 * Client-side validation before sending to the API.
 * Returns { valid: boolean, errorType: 'required' | 'ages' | null }
 *
 * @param {object} data      - output of collectBookingData()
 * @param {object} bookingState
 * @returns {{ valid: boolean, errorType: string|null }}
 */
export function validateBookingData(data, bookingState) {
  if (!data.arrival || !data.departure || !data.name || !data.phone) {
    return { valid: false, errorType: 'required' };
  }

  if (bookingState.children > 0) {
    const agesArr = Array.isArray(bookingState.childrenAges)
      ? bookingState.childrenAges : [];
    const anyMissing = Array.from(
      { length: bookingState.children }, (_, i) => agesArr[i]
    ).some(a => a === null || a === undefined || a === '');
    if (anyMissing) return { valid: false, errorType: 'ages' };
  }

  return { valid: true, errorType: null };
}

// ── Loading state helpers ─────────────────────────────────────────
/**
 * Sets the submit button into a loading state.
 * @param {HTMLButtonElement} btn
 */
export function setButtonLoading(btn) {
  btn.disabled = true;
  const label   = btn.querySelector('#modal-submit-label');
  const spinner = btn.querySelector('#modal-submit-spinner');
  if (label)   label.textContent = 'Submitting…';
  if (spinner) spinner.classList.remove('hidden');
}

/**
 * Restores the submit button to its default state.
 * @param {HTMLButtonElement} btn
 */
export function setButtonReady(btn) {
  btn.disabled = false;
  const label   = btn.querySelector('#modal-submit-label');
  const spinner = btn.querySelector('#modal-submit-spinner');
  if (label)   label.textContent = 'Request to Book';
  if (spinner) spinner.classList.add('hidden');
}

// ── API submission ────────────────────────────────────────────────
/**
 * POSTs the booking data to the API endpoint.
 * Returns the parsed JSON response body.
 * Throws on network errors or non-2xx responses.
 *
 * @param {object} data - output of collectBookingData()
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function submitBooking(data) {
  // Build the payload — only fields the API expects
  const payload = {
    arrival:      data.arrival,
    departure:    data.departure,
    adults:       data.adults,
    children:     data.children,
    childrenAges: data.childrenAges,
    name:         data.name,
    phone:        data.phone,
    request:      data.request,
    // reCAPTCHA token will be added here in the next step:
    // recaptchaToken: await getRecaptchaToken(),
  };

  const response = await fetch(BOOKING_API_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  // Try to parse JSON regardless of status code (API always returns JSON)
  let json;
  try {
    json = await response.json();
  } catch (_) {
    throw new Error(`Server returned a non-JSON response (status ${response.status}).`);
  }

  if (!response.ok || !json.success) {
    // Use the server's message if available, otherwise a generic one
    const msg = (json && json.message) || `Server error: ${response.status}`;
    throw new Error(msg);
  }

  return json;
}

// ── Success handler ───────────────────────────────────────────────
/**
 * Called after a successful API response.
 * Clears localStorage, resets the form state, then redirects
 * to the Thank You page. The redirect is intentionally the last
 * step so data is always cleaned up before leaving the page.
 *
 * @param {object} _data - submitted booking data (reserved for future use)
 * @param {Function} resetState - callback from main.js to reset bookingState
 */
export function handleSubmitSuccess(_data, resetState) {
  // 1. Clear persisted booking data
  try {
    localStorage.removeItem('jeevikaBooking');
  } catch (_) { /* ignore storage errors */ }

  // 2. Reset in-memory state via the provided callback
  if (typeof resetState === 'function') resetState();

  // 3. Redirect to the Thank You page
  //    Small delay lets the loading spinner complete its transition
  //    before the page unloads — avoids a jarring instant cut.
  setTimeout(() => {
    window.location.href = 'thank-you.html';
  }, 150);
}

// ── Error handler ─────────────────────────────────────────────────
/**
 * Called when the API call fails (network error or server-side error).
 * Shows the API error message. Preserves all booking data and localStorage.
 *
 * @param {Error} err
 */
export function handleSubmitError(err) {
  console.error('[Booking] Submission failed:', err);
  const apiErrEl  = document.getElementById('modal-api-error');
  const successEl = document.getElementById('modal-success');
  if (apiErrEl)  apiErrEl.classList.remove('hidden');
  if (successEl) successEl.classList.add('hidden');
}

// ── Legacy export (kept for any external reference) ───────────────
// BOOKING_CONFIG re-exported in case other modules need it
export { BOOKING_CONFIG };
