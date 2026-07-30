# homestay
# Jeevika Haven Homestay

A single-page website for Jeevika Haven, a private pool villa homestay in Kombanad, Ernakulam, Kerala.

## Tech Stack

- HTML5
- Tailwind CSS v4
- Vanilla JavaScript
- GSAP + ScrollTrigger (scroll animations)
- Flatpickr (booking calendar)

## Getting Started

1. Clone this repository

git clone https://github.com/NaveenDev-lab/homestay.git
cd homestay

2. Install dependencies

npm install

3. Start the Tailwind build (compiles src/input.css to dist/output.css, watches for changes)

npm run build

4. Open index.html in your browser (or use a local server such as live-server for a smoother experience)

## Project Structure

jeevika-haven/
├── index.html          Main site markup
├── src/
│   ├── input.css       Tailwind source + brand theme (@theme block)
│   └── main.js         GSAP animations, booking modal logic, scroll behavior
├── images/             Property photos used across the site
├── dist/               Compiled CSS output (generated, not committed)
└── package.json

## Features

- Fully responsive single-page design (mobile, tablet, desktop)
- GSAP scroll-triggered animations throughout
- Full-bleed hero image slideshow with crossfade
- Image gallery with lightbox
- Booking modal with dual-month calendar, guest steppers, and WhatsApp-based enquiry (no payment processing, availability and booking are confirmed manually by the host)

## Known TODOs

- Replace the placeholder WhatsApp number in src/main.js with the real host number
- Replace the placeholder logo icon with the client's official logo file once provided
- Replace brochure-extracted images with original high-resolution photos if available