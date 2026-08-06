/**
 * server/email/templates/adminBooking.js
 * HTML + plain-text email template for the admin booking notification.
 *
 * Returns { subject, html, text } ready to hand to any email provider.
 * Keep all presentation logic here — providers never build their own markup.
 */

'use strict';

/**
 * Formats an ISO date string (YYYY-MM-DD) as "18 Aug 2026".
 * @param {string} iso
 * @returns {string}
 */
function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

/**
 * Formats the submitted-at timestamp as a readable local string.
 * @returns {string}
 */
function fmtNow() {
  return new Date().toLocaleString('en-IN', {
    timeZone:     'Asia/Kolkata',
    dateStyle:    'long',
    timeStyle:    'short',
  });
}

/**
 * Builds the email subject line.
 * @param {object} booking
 * @returns {string}
 */
function buildSubject(booking) {
  return `New Booking Request | ${booking.name} | Check-in: ${fmtDate(booking.arrival)}`;
}

/**
 * Builds the HTML email body.
 * @param {object} booking
 * @returns {string}
 */
function buildHtml(booking) {
  const arrivalFmt   = fmtDate(booking.arrival);
  const departureFmt = fmtDate(booking.departure);
  const ages         = booking.children > 0 && booking.childrenAges.length
    ? booking.childrenAges.join(', ')
    : '—';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Request</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Inter',Arial,sans-serif;color:#26281F;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;
                      box-shadow:0 2px 12px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#1F6F4F;padding:28px 36px;">
              <p style="margin:0;font-size:12px;text-transform:uppercase;
                        letter-spacing:0.15em;color:rgba(255,255,255,0.7);">
                Jeevika Haven
              </p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:600;color:#ffffff;">
                New Booking Request
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 36px;">

              <!-- Guest Details -->
              <h2 style="margin:0 0 16px;font-size:13px;text-transform:uppercase;
                         letter-spacing:0.12em;color:#1F6F4F;border-bottom:1px solid #e5e5e5;
                         padding-bottom:8px;">
                Guest Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="font-size:14px;line-height:1.6;">
                <tr>
                  <td style="padding:6px 0;color:#6b7280;width:140px;">Name</td>
                  <td style="padding:6px 0;font-weight:600;">${escHtml(booking.name)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;">Phone</td>
                  <td style="padding:6px 0;font-weight:600;">${escHtml(booking.phone)}</td>
                </tr>
              </table>

              <!-- Stay Details -->
              <h2 style="margin:28px 0 16px;font-size:13px;text-transform:uppercase;
                         letter-spacing:0.12em;color:#1F6F4F;border-bottom:1px solid #e5e5e5;
                         padding-bottom:8px;">
                Stay Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="font-size:14px;line-height:1.6;">
                <tr>
                  <td style="padding:6px 0;color:#6b7280;width:140px;">Check-in</td>
                  <td style="padding:6px 0;font-weight:600;">${arrivalFmt}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;">Check-out</td>
                  <td style="padding:6px 0;font-weight:600;">${departureFmt}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;">Adults</td>
                  <td style="padding:6px 0;font-weight:600;">${booking.adults}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;">Children</td>
                  <td style="padding:6px 0;font-weight:600;">${booking.children}</td>
                </tr>
                ${booking.children > 0 ? `
                <tr>
                  <td style="padding:6px 0;color:#6b7280;">Children Ages</td>
                  <td style="padding:6px 0;font-weight:600;">${ages}</td>
                </tr>` : ''}
                <tr>
                  <td style="padding:6px 0;color:#6b7280;vertical-align:top;">
                    Special Request
                  </td>
                  <td style="padding:6px 0;">${escHtml(booking.request)}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;color:#6b7280;">Submitted At</td>
                  <td style="padding:6px 0;">${fmtNow()}</td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:16px 36px;border-top:1px solid #e5e5e5;">
              <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;">
                This is an automated notification from the Jeevika Haven booking system.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

/**
 * Builds the plain-text fallback email body.
 * @param {object} booking
 * @returns {string}
 */
function buildText(booking) {
  const ages = booking.children > 0 && booking.childrenAges.length
    ? booking.childrenAges.join(', ')
    : '—';

  return [
    'NEW BOOKING REQUEST — JEEVIKA HAVEN',
    '====================================',
    '',
    'GUEST DETAILS',
    '-------------',
    `Name:    ${booking.name}`,
    `Phone:   ${booking.phone}`,
    '',
    'STAY DETAILS',
    '------------',
    `Check-in:        ${fmtDate(booking.arrival)}`,
    `Check-out:       ${fmtDate(booking.departure)}`,
    `Adults:          ${booking.adults}`,
    `Children:        ${booking.children}`,
    ...(booking.children > 0 ? [`Children Ages:   ${ages}`] : []),
    `Special Request: ${booking.request}`,
    `Submitted At:    ${fmtNow()}`,
    '',
    '----',
    'Automated notification from the Jeevika Haven booking system.',
  ].join('\n');
}

/**
 * Escapes HTML special characters to prevent injection in email bodies.
 * @param {string} str
 * @returns {string}
 */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Returns the complete email payload for a booking notification.
 * @param {object} booking - normalised booking object
 * @returns {{ subject: string, html: string, text: string }}
 */
function buildAdminBookingEmail(booking) {
  return {
    subject: buildSubject(booking),
    html:    buildHtml(booking),
    text:    buildText(booking),
  };
}

module.exports = { buildAdminBookingEmail };
