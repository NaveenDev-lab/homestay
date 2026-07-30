/* =============================================================
   Jeevika Haven — main.js
   Requires: GSAP + ScrollTrigger + Flatpickr (loaded via CDN)
============================================================= */

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------------------------------------------
   1. NAVBAR — scroll-aware background + colour swap
----------------------------------------------------------------- */
const navbar      = document.getElementById('navbar');
const logoText    = document.querySelectorAll('.navbar-logo-text, .navbar-logo-icon');
const navLinks    = document.querySelectorAll('.navbar-link');
const hamburger   = document.getElementById('menu-open');

function applyNavbarState(scrolled) {
  if (scrolled) {
    navbar.classList.add('bg-ivory', 'shadow-md');
    navbar.classList.remove('bg-transparent');
    logoText.forEach(el => el.classList.replace('text-white', 'text-forest'));
    navLinks.forEach(el => el.classList.replace('text-white', 'text-forest'));
    hamburger.classList.replace('text-white', 'text-forest');
  } else {
    navbar.classList.remove('bg-ivory', 'shadow-md');
    navbar.classList.add('bg-transparent');
    logoText.forEach(el => el.classList.replace('text-forest', 'text-white'));
    navLinks.forEach(el => el.classList.replace('text-forest', 'text-white'));
    hamburger.classList.replace('text-forest', 'text-white');
  }
}

// Set initial transparent state
logoText.forEach(el => el.classList.add('text-white'));
navLinks.forEach(el => el.classList.add('text-white'));
hamburger.classList.add('text-white');
navbar.classList.add('bg-transparent');

window.addEventListener('scroll', () => {
  applyNavbarState(window.scrollY > 80);
}, { passive: true });


/* -----------------------------------------------------------------
   2. MOBILE MENU
----------------------------------------------------------------- */
const mobileMenu  = document.getElementById('mobile-menu');
const menuOpen    = document.getElementById('menu-open');
const menuClose   = document.getElementById('menu-close');
const mobileLinks = document.querySelectorAll('.mobile-nav-link');

function openMenu() {
  mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
  mobileMenu.classList.add('opacity-100');
  menuOpen.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.add('opacity-0', 'pointer-events-none');
  mobileMenu.classList.remove('opacity-100');
  menuOpen.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuOpen.addEventListener('click', openMenu);
menuClose.addEventListener('click', closeMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});


/* -----------------------------------------------------------------
   3. HERO SLIDESHOW — crossfade + slow zoom
----------------------------------------------------------------- */
const slides     = document.querySelectorAll('.hero-slide');
const slideImgs  = document.querySelectorAll('.hero-slide-img');
const dots       = document.querySelectorAll('.slide-dot');
let current      = 0;
let slideTimer   = null;

// GSAP tween references for the active zoom animation
const zoomTweens = new Map();

function startZoom(index) {
  // Kill any existing tween on that image
  if (zoomTweens.has(index)) zoomTweens.get(index).kill();
  gsap.set(slideImgs[index], { scale: 1 });
  const tween = gsap.to(slideImgs[index], {
    scale: 1.07,
    duration: 8,
    ease: 'none',
  });
  zoomTweens.set(index, tween);
}

function stopZoom(index) {
  if (zoomTweens.has(index)) {
    zoomTweens.get(index).kill();
    zoomTweens.delete(index);
  }
  gsap.set(slideImgs[index], { scale: 1 });
}

function goToSlide(next) {
  const prev = current;
  current = next;

  // Cross-fade
  gsap.to(slides[prev], { opacity: 0, duration: 1.2, ease: 'power1.inOut' });
  gsap.to(slides[next], { opacity: 1, duration: 1.2, ease: 'power1.inOut' });

  // Zoom: reset old, start new
  stopZoom(prev);
  startZoom(next);

  // Dots
  dots[prev].classList.remove('bg-gold');
  dots[prev].classList.add('bg-white/40');
  dots[prev].setAttribute('aria-selected', 'false');

  dots[next].classList.remove('bg-white/40');
  dots[next].classList.add('bg-gold');
  dots[next].setAttribute('aria-selected', 'true');
}

function advanceSlide() {
  goToSlide((current + 1) % slides.length);
}

function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(advanceSlide, 5000);
}

// Allow clicking dots to jump to a slide
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.dot, 10);
    if (idx !== current) {
      goToSlide(idx);
      startSlideTimer(); // reset auto-advance timer
    }
  });
});

// Kick off
startZoom(0);
startSlideTimer();


/* -----------------------------------------------------------------
   4. HERO TEXT — GSAP stagger fade-up on load
----------------------------------------------------------------- */
const heroItems = gsap.utils.toArray('.hero-animate');

gsap.fromTo(
  heroItems,
  { y: 28, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.18,
    delay: 0.3,   // brief pause before animation fires
  }
);


/* -----------------------------------------------------------------
   5. NAV UNDERLINE HOVER (CSS-driven, but ensure class is set)
      The gold underline animates via CSS in input.css / Tailwind
      using a scale-x transform trick applied with the class below.
----------------------------------------------------------------- */
// The animation is handled purely via CSS; no extra JS needed.
// See the <style> block added in index.html head (or custom CSS below).


/* -----------------------------------------------------------------
   6. VILLA SECTION — ScrollTrigger fade-up (image + text)
----------------------------------------------------------------- */
gsap.fromTo(
  '#villa-image',
  { y: 40, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#villa-image',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);

gsap.fromTo(
  '#villa-text',
  { y: 40, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'power2.out',
    delay: 0.12,        // slight offset so text follows image in
    scrollTrigger: {
      trigger: '#villa-text',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* -----------------------------------------------------------------
   7. WHY CARDS — staggered ScrollTrigger fade-up
----------------------------------------------------------------- */
gsap.fromTo(
  '.why-card',
  { y: 36, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '#why-grid',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* -----------------------------------------------------------------
   8. ROOMS CARDS — staggered ScrollTrigger fade-up
      (same pattern as Why Cards — one trigger on parent grid)
----------------------------------------------------------------- */
gsap.fromTo(
  '.room-card',
  { y: 36, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.2,
    scrollTrigger: {
      trigger: '#rooms-grid',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* -----------------------------------------------------------------
   9. GALLERY ITEMS — clip-path wipe reveal on scroll
----------------------------------------------------------------- */
gsap.fromTo(
  '.gallery-item',
  { clipPath: 'inset(0 0 100% 0)' },
  {
    clipPath: 'inset(0 0 0% 0)',
    duration: 0.85,
    ease: 'power2.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '#gallery-grid',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* -----------------------------------------------------------------
   10. LIGHTBOX — open / close
----------------------------------------------------------------- */
const lightbox         = document.getElementById('lightbox');
const lightboxImg      = document.getElementById('lightbox-img');
const lightboxCaption  = document.getElementById('lightbox-caption');
const lightboxClose    = document.getElementById('lightbox-close');
const lightboxBackdrop = document.getElementById('lightbox-backdrop');

function openLightbox(src, caption, alt) {
  lightboxImg.src     = src;
  lightboxImg.alt     = alt;
  lightboxCaption.textContent = caption;

  lightbox.classList.remove('pointer-events-none');
  // Slight rAF so the transition fires after display change
  requestAnimationFrame(() => {
    lightbox.style.opacity = '1';
  });
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.style.opacity = '0';
  lightbox.addEventListener('transitionend', () => {
    lightbox.classList.add('pointer-events-none');
    lightboxImg.src = '';
    lightboxImg.alt = '';
    lightboxCaption.textContent = '';
    document.body.style.overflow = '';
  }, { once: true });
}

// Wire up gallery buttons
document.querySelectorAll('#gallery-grid button').forEach(btn => {
  btn.addEventListener('click', () => {
    const src     = btn.dataset.src;
    const caption = btn.dataset.caption;
    const alt     = btn.querySelector('img').alt;
    openLightbox(src, caption, alt);
  });
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxBackdrop.addEventListener('click', closeLightbox);

// Close on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !lightbox.classList.contains('pointer-events-none')) {
    closeLightbox();
  }
});


/* -----------------------------------------------------------------
   11. AMENITIES ICONS — staggered ScrollTrigger fade-up
----------------------------------------------------------------- */
gsap.fromTo(
  '.amenity-item',
  { y: 30, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out',
    stagger: 0.12,
    scrollTrigger: {
      trigger: '#amenities-grid',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* -----------------------------------------------------------------
   12. PERFECT FOR PILLS — staggered ScrollTrigger fade-up
----------------------------------------------------------------- */
gsap.fromTo(
  '.pill-item',
  { y: 20, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.08,
    scrollTrigger: {
      trigger: '#pills-grid',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* -----------------------------------------------------------------
   13. NEARBY CARDS — staggered ScrollTrigger fade-up
----------------------------------------------------------------- */
gsap.fromTo(
  '.nearby-card',
  { y: 36, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.9,
    ease: 'power2.out',
    stagger: 0.1,
    scrollTrigger: {
      trigger: '#nearby-grid',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* -----------------------------------------------------------------
   14. CTA BAND — staggered ScrollTrigger fade-up
----------------------------------------------------------------- */
gsap.fromTo(
  '.cta-animate',
  { y: 30, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'power2.out',
    stagger: 0.18,
    scrollTrigger: {
      trigger: '#cta-band',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* -----------------------------------------------------------------
   15. CONTACT SECTION — fade-up (left col + right col)
----------------------------------------------------------------- */
gsap.fromTo(
  '#contact-left',
  { y: 40, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#contact-left',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);

gsap.fromTo(
  '#contact-right',
  { y: 40, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'power2.out',
    delay: 0.12,
    scrollTrigger: {
      trigger: '#contact-right',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse',
    },
  }
);


/* =============================================================
   BOOKING MODAL — state, Flatpickr, steppers, validation,
   localStorage persistence, WhatsApp deep-link
============================================================= */

// TODO: replace with real host WhatsApp number (include country code, no + or spaces)
const WA_NUMBER = '917306239291';

/* -----------------------------------------------------------------
   Booking state — single source of truth
----------------------------------------------------------------- */
const DEFAULT_STATE = {
  arrival:    null,   // ISO date string 'YYYY-MM-DD' or null
  departure:  null,
  adults:     2,
  children:   0,
  name:       '',
  phone:      '',
  request:    '',
};

function loadState() {
  try {
    const raw = localStorage.getItem('jeevikaBooking');
    if (raw) return Object.assign({}, DEFAULT_STATE, JSON.parse(raw));
  } catch (_) { /* ignore parse errors */ }
  return Object.assign({}, DEFAULT_STATE);
}

function saveState(state) {
  try {
    localStorage.setItem('jeevikaBooking', JSON.stringify(state));
  } catch (_) { /* ignore quota errors */ }
}

let bookingState = loadState();

/* -----------------------------------------------------------------
   DOM refs
----------------------------------------------------------------- */
const modal          = document.getElementById('booking-modal');
const modalPanel     = document.getElementById('modal-panel');
const modalClose     = document.getElementById('modal-close');
const modalArrival   = document.getElementById('modal-arrival');
const modalDeparture = document.getElementById('modal-departure');
const adultsCount    = document.getElementById('adults-count');
const childrenCount  = document.getElementById('children-count');
const adultsDec      = document.getElementById('adults-dec');
const adultsInc      = document.getElementById('adults-inc');
const childrenDec    = document.getElementById('children-dec');
const childrenInc    = document.getElementById('children-inc');
const nameInput      = document.getElementById('modal-name');
const phoneInput     = document.getElementById('modal-phone');
const requestInput   = document.getElementById('modal-request');
const errorMsg       = document.getElementById('modal-error');
const submitBtn      = document.getElementById('modal-submit');

/* -----------------------------------------------------------------
   Date formatting helper
----------------------------------------------------------------- */
function fmtDate(isoStr) {
  if (!isoStr) return '—';
  const [y, m, d] = isoStr.split('-').map(Number);
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

/* -----------------------------------------------------------------
   Flatpickr inline range calendar
   — appendTo forces the calendar DOM to stay inside #fp-calendar
     rather than being appended to <body> (Flatpickr's default when
     the parent container has no layout dimensions at init time,
     which happens because the modal is opacity-0 on page load).
     Without appendTo, the day cells the user clicks belong to a
     body-level element that has no onChange wired to it.
----------------------------------------------------------------- */
const isMobile = () => window.innerWidth < 1024;

const fpCalendarEl = document.getElementById('fp-calendar');

// Helper: convert a JS Date object → 'YYYY-MM-DD' string for storage
function dateToISO(d) {
  const y  = d.getFullYear();
  const m  = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

// Helper: format a JS Date object for display ('18 Aug 2026')
// Used instead of fp.formatDate() which does not exist on fp instances.
function formatDisplayDate(d) {
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// Track showMonths ourselves so we never touch fp.config (unreliable)
let currentShowMonths = isMobile() ? 1 : 2;

// Post-render fix: remove Flatpickr's inline style.width from the month
// header element. Flatpickr writes this inline during init/re-render for
// multi-month sizing — on mobile it creates a wide gap between month name
// and year. Removing it lets our CSS flex rules centre them properly.
function fixMobileMonthHeader() {
  if (window.innerWidth >= 768) return; // desktop: leave Flatpickr's sizing alone
  fpCalendarEl.querySelectorAll('.flatpickr-current-month').forEach(el => {
    el.style.removeProperty('width');
    // Also clear float/width on children Flatpickr may have set
    const curMonth = el.querySelector('.cur-month');
    const numWrap  = el.querySelector('.numInputWrapper');
    if (curMonth) { curMonth.style.removeProperty('width'); curMonth.style.removeProperty('float'); }
    if (numWrap)  { numWrap.style.removeProperty('width');  numWrap.style.removeProperty('float'); }
  });
}

const fp = flatpickr(fpCalendarEl, {
  mode:          'range',
  inline:        true,
  appendTo:      fpCalendarEl,
  minDate:       'today',
  showMonths:    currentShowMonths,
  dateFormat:    'Y-m-d',
  disableMobile: true,
  onReady() {
    if (bookingState.arrival) {
      const dates = bookingState.departure
        ? [bookingState.arrival, bookingState.departure]
        : [bookingState.arrival];
      fp.setDate(dates, false); // false = silent, don't fire onChange
    }
    // After Flatpickr renders, clear the inline style.width it sets on
    // .flatpickr-current-month so our CSS flex layout can take over on mobile.
    // Flatpickr calculates this width for multi-month desktop layouts and
    // writes it directly to element.style — JS is the only reliable way to
    // remove it since inline styles beat even !important in some scenarios.
    fixMobileMonthHeader();
  },
  onChange(selectedDates) {
    // Use native Date methods — fp.formatDate() does not exist on instances
    const newArrival   = selectedDates[0] ? dateToISO(selectedDates[0]) : null;
    // Only set departure when BOTH dates have been picked (length === 2)
    // With only one date selected, departure stays null so box shows "—"
    const newDeparture = selectedDates.length === 2 ? dateToISO(selectedDates[1]) : null;

    bookingState.arrival   = newArrival;
    bookingState.departure = newDeparture;

    modalArrival.textContent   = fmtDate(bookingState.arrival);
    modalDeparture.textContent = fmtDate(bookingState.departure);

    saveState(bookingState);

    if (bookingState.arrival && bookingState.departure) {
      errorMsg.classList.add('hidden');
    }
  },
});

// Adjust month count on resize — use our own tracking var, not fp.config
window.addEventListener('resize', () => {
  const targetMonths = isMobile() ? 1 : 2;
  if (currentShowMonths !== targetMonths) {
    currentShowMonths = targetMonths;
    fp.set('showMonths', targetMonths);
    fixMobileMonthHeader();
    // Restore saved dates silently after re-render
    if (bookingState.arrival) {
      const dates = bookingState.departure
        ? [bookingState.arrival, bookingState.departure]
        : [bookingState.arrival];
      fp.setDate(dates, false);
    }
    modalArrival.textContent   = fmtDate(bookingState.arrival);
    modalDeparture.textContent = fmtDate(bookingState.departure);
  }
});

/* -----------------------------------------------------------------
   Populate UI from saved state
----------------------------------------------------------------- */
function hydrateUI() {
  adultsCount.textContent   = bookingState.adults;
  childrenCount.textContent = bookingState.children;
  nameInput.value           = bookingState.name;
  phoneInput.value          = bookingState.phone;
  requestInput.value        = bookingState.request;
  modalArrival.textContent   = fmtDate(bookingState.arrival);
  modalDeparture.textContent = fmtDate(bookingState.departure);
}
hydrateUI();

/* -----------------------------------------------------------------
   Stepper buttons
----------------------------------------------------------------- */
adultsDec.addEventListener('click', () => {
  if (bookingState.adults > 1) {
    bookingState.adults--;
    adultsCount.textContent = bookingState.adults;
    saveState(bookingState);
  }
});
adultsInc.addEventListener('click', () => {
  if (bookingState.adults < 20) {
    bookingState.adults++;
    adultsCount.textContent = bookingState.adults;
    saveState(bookingState);
  }
});
childrenDec.addEventListener('click', () => {
  if (bookingState.children > 0) {
    bookingState.children--;
    childrenCount.textContent = bookingState.children;
    saveState(bookingState);
  }
});
childrenInc.addEventListener('click', () => {
  if (bookingState.children < 10) {
    bookingState.children++;
    childrenCount.textContent = bookingState.children;
    saveState(bookingState);
  }
});

/* -----------------------------------------------------------------
   Text field sync → state + localStorage
----------------------------------------------------------------- */
nameInput.addEventListener('input', () => {
  bookingState.name = nameInput.value;
  saveState(bookingState);
});
phoneInput.addEventListener('input', () => {
  bookingState.phone = phoneInput.value;
  saveState(bookingState);
});
requestInput.addEventListener('input', () => {
  bookingState.request = requestInput.value;
  saveState(bookingState);
});

/* -----------------------------------------------------------------
   Modal open / close — focus management + fade transition
----------------------------------------------------------------- */
let modalLastTrigger = null; // stores the element that opened the modal

// All focusable elements inside the modal for focus trap
const FOCUSABLE = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

function trapFocus(e) {
  const focusable = Array.from(modal.querySelectorAll(FOCUSABLE));
  if (!focusable.length) return;
  const first = focusable[0];
  const last  = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
}

function openModal() {
  modal.classList.remove('pointer-events-none');
  requestAnimationFrame(() => {
    modal.style.opacity = '1';
  });
  document.body.style.overflow = 'hidden';

  // Update showMonths for current viewport BEFORE restoring dates.
  const targetMonths = isMobile() ? 1 : 2;
  if (currentShowMonths !== targetMonths) {
    currentShowMonths = targetMonths;
    fp.set('showMonths', targetMonths);
    fixMobileMonthHeader();
    if (bookingState.arrival) {
      const dates = bookingState.departure
        ? [bookingState.arrival, bookingState.departure]
        : [bookingState.arrival];
      fp.setDate(dates, false);
    }
  }

  // Sync summary boxes from state
  modalArrival.textContent   = fmtDate(bookingState.arrival);
  modalDeparture.textContent = fmtDate(bookingState.departure);

  // Move focus to first focusable element inside modal (after transition starts)
  requestAnimationFrame(() => {
    const firstFocusable = modal.querySelector(FOCUSABLE);
    if (firstFocusable) firstFocusable.focus();
  });

  // Activate focus trap
  modal.addEventListener('keydown', trapFocus);
}

function closeModal() {
  modal.style.opacity = '0';
  modal.removeEventListener('keydown', trapFocus);
  modal.addEventListener('transitionend', () => {
    modal.classList.add('pointer-events-none');
    document.body.style.overflow = '';
    // Return focus to the element that triggered the modal
    if (modalLastTrigger) {
      modalLastTrigger.focus();
      modalLastTrigger = null;
    }
  }, { once: true });
  errorMsg.classList.add('hidden');
}

// Wire every "Reserve Your Stay" trigger across the page
const reserveTriggers = [
  ...document.querySelectorAll('.navbar-link ~ a[href="#contact"]'),
  ...document.querySelectorAll('nav a[href="#contact"]'),
  ...document.querySelectorAll('#hero-ctas a[href="#contact"]'),
  document.getElementById('cta-reserve-btn'),
  ...document.querySelectorAll('.contact-reserve-btn'),
  document.getElementById('sticky-reserve-btn'),
].filter(Boolean);

reserveTriggers.forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    modalLastTrigger = el; // remember for focus restoration
    openModal();
  });
});

modalClose.addEventListener('click', closeModal);

// Escape key closes modal (not lightbox — lightbox has its own handler)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('pointer-events-none')) {
    closeModal();
  }
});

/* -----------------------------------------------------------------
   Submit — validate → build WhatsApp message → open URL
----------------------------------------------------------------- */
submitBtn.addEventListener('click', () => {
  const { arrival, departure, adults, children, name, phone, request } = bookingState;

  // Validate required fields
  if (!arrival || !departure || !name.trim() || !phone.trim()) {
    errorMsg.classList.remove('hidden');
    errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  errorMsg.classList.add('hidden');

  const msg = [
    'Hello Jeevika Haven,',
    'I would like to check availability.',
    '',
    `Check-in: ${fmtDate(arrival)}`,
    `Check-out: ${fmtDate(departure)}`,
    `Adults: ${adults}`,
    `Children: ${children}`,
    `Name: ${name.trim()}`,
    `Phone: ${phone.trim()}`,
    `Special Request: ${request.trim() || 'None'}`,
    '',
    'Please let me know the availability.',
  ].join('\n');

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});
