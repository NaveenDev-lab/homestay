/**
 * server/routes/booking.route.js
 * Express route — delegates to the same handleBooking() core
 * used by the Vercel serverless function.
 *
 * Mounted at POST /api/booking by server/index.js.
 */

'use strict';

const express = require('express');
const router  = express.Router();
const { handleBooking } = require('../../api/booking');

router.post('/', async (req, res) => {
  // CORS headers — restrict to your domain in production via ALLOWED_ORIGIN env var
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');

  try {
    const { status, body } = await handleBooking(req.body || {});
    return res.status(status).json(body);
  } catch (err) {
    console.error('[Booking Route] Unexpected error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// CORS preflight
router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res.status(204).end();
});

module.exports = router;
