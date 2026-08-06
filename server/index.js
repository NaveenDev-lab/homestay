/**
 * server/index.js
 * Express server — for Hostinger / cPanel Node.js deployment.
 *
 * On Vercel, this file is NOT used. Vercel reads api/booking.js directly.
 * On Hostinger, set up a Node.js application pointing to this file.
 *
 * Usage:
 *   npm run server          — start with node
 *   npm run server:dev      — start with nodemon (auto-restart on change)
 *
 * Environment variables (set in .env or Hostinger's env panel):
 *   PORT            — listening port (default 3000)
 *   ALLOWED_ORIGIN  — CORS origin (your production domain)
 *   NODE_ENV        — 'production' | 'development'
 */

'use strict';

// Load .env from the server/ directory in development.
// In production (Hostinger/Vercel), env vars are set in the platform's dashboard.
if (process.env.NODE_ENV !== 'production') {
  try {
    require('dotenv').config({ path: require('path').join(__dirname, '.env') });
  } catch (_) { /* dotenv optional */ }
}

const express      = require('express');
const path         = require('path');
const bookingRoute = require('./routes/booking.route');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ── Serve static site files ───────────────────────────────────────
// Hostinger deployment: serve the whole site from this same process.
app.use(express.static(path.join(__dirname, '..')));

// ── API routes ────────────────────────────────────────────────────
app.use('/api/booking', bookingRoute);

// 404 fallback — return index.html for any unknown route (SPA behaviour)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Server] Jeevika Haven running on http://localhost:${PORT}`);
});

module.exports = app; // exported for testing
