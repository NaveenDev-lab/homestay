/* =============================================================
   Jeevika Haven — main.js
   Requires: GSAP + ScrollTrigger + Flatpickr (loaded via CDN)
============================================================= */

gsap.registerPlugin(ScrollTrigger);

/* -----------------------------------------------------------------
   1. NAVBAR — scroll-aware background + colour swap
----------------------------------------------------------------- */
const navbar      = document.getElementById('navbar');
const navbarLogo  = document.getElementById('navbar-logo');
const navLinks    = document.querySelectorAll('.navbar-link');
const hamburger   = document.getElementById('menu-open');

function applyNavbarState(scrolled) {
  if (scrolled) {
    navbar.classList.add('bg-ivory', 'shadow-md');
    navbar.classList.remove('bg-transparent');
    navLinks.forEach(el => el.classList.replace('text-white', 'text-forest'));
    hamburger.classList.replace('text-white', 'text-forest');
    // Solid background — no drop-shadow needed on logo
    if (navbarLogo) navbarLogo.style.filter = 'none';
  } else {
    navbar.classList.remove('bg-ivory', 'shadow-md');
    navbar.classList.add('bg-transparent');
    navLinks.forEach(el => el.classList.replace('text-forest', 'text-white'));
    hamburger.classList.replace('text-forest', 'text-white');
    // Transparent over hero — drop-shadow keeps logo legible
    if (navbarLogo) navbarLogo.style.filter = 'drop-shadow(0 1px 6px rgba(0,0,0,0.35))';
  }
}

// Set initial transparent state
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
  dots[prev].classList.remove('bg-emerald');
  dots[prev].classList.add('bg-white/40');
  dots[prev].setAttribute('aria-selected', 'false');

  dots[next].classList.remove('bg-white/40');
  dots[next].classList.add('bg-emerald');
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
   Submission is delegated to src/booking.js so the method can
   be switched (WhatsApp → Email) by changing booking.config.js only.
============================================================= */

import {
  fmtDate,
  collectBookingData,
  validateBookingData,
  submitBooking,
  handleSubmitSuccess,
  handleSubmitError,
  setButtonLoading,
  setButtonReady,
} from './booking.js';

/* -----------------------------------------------------------------
   Booking state — single source of truth
----------------------------------------------------------------- */
const DEFAULT_STATE = {
  arrival:      null,   // ISO date string 'YYYY-MM-DD' or null
  departure:    null,
  adults:       2,
  children:     0,
  childrenAges: [],     // array of numbers or null per child, e.g. [8, null, 3]
  name:         '',
  phone:        '',
  request:      '',
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
const childrenAgesContainer = document.getElementById('children-ages-container');
const nameInput      = document.getElementById('modal-name');
const phoneInput     = document.getElementById('modal-phone');
const requestInput   = document.getElementById('modal-request');
const errorMsg       = document.getElementById('modal-error');
const agesError      = document.getElementById('ages-error');
const submitBtn      = document.getElementById('modal-submit');

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
  // Ensure childrenAges array is correctly sized for restored state
  if (!Array.isArray(bookingState.childrenAges)) {
    bookingState.childrenAges = [];
  }
  while (bookingState.childrenAges.length < bookingState.children) {
    bookingState.childrenAges.push(null);
  }
  renderChildrenAges();
}
hydrateUI();

/* -----------------------------------------------------------------
   Children age inputs — rendered dynamically when children > 0.
   Preserves existing age values when count changes: trimming from
   the end on decrement, appending null on increment.
----------------------------------------------------------------- */

// Returns true if a stored age value is the unselected placeholder (null / '' / undefined)
function isAgeMissing(val) {
  return val === null || val === undefined || val === '';
}

function renderChildrenAges() {
  const count = bookingState.children;
  childrenAgesContainer.innerHTML = '';
  agesError.classList.add('hidden');

  if (count === 0) return;

  for (let i = 0; i < count; i++) {
    const selectId = `child-age-${i}`;
    const savedAge = bookingState.childrenAges[i];

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col gap-1.5';

    const label = document.createElement('label');
    label.htmlFor     = selectId;
    label.className   = 'text-charcoal text-sm font-medium';
    label.textContent = `Child ${i + 1} Age`;

    const select = document.createElement('select');
    select.id        = selectId;
    select.className = 'w-40 px-4 py-2.5 rounded-xl border border-charcoal/20 bg-white ' +
                       'text-charcoal text-sm ' +
                       'focus:outline-none focus:ring-2 focus:ring-forest/30 focus:border-forest ' +
                       'transition-colors duration-150 cursor-pointer';

    // Placeholder option
    const placeholder = document.createElement('option');
    placeholder.value    = '';
    placeholder.disabled = true;
    placeholder.selected = (savedAge === null || savedAge === undefined || savedAge === '');
    placeholder.textContent = 'Select age';
    select.appendChild(placeholder);

    // Age options 0–17
    for (let age = 0; age <= 17; age++) {
      const opt = document.createElement('option');
      opt.value = age;
      opt.textContent = age === 0 ? '0 (Under 1)' : `${age}`;
      if (savedAge !== null && savedAge !== undefined && savedAge !== '' && Number(savedAge) === age) {
        opt.selected = true;
      }
      select.appendChild(opt);
    }

    select.addEventListener('change', () => {
      const val = select.value;
      bookingState.childrenAges[i] = val === '' ? null : Number(val);
      saveState(bookingState);
      // Clear error border and hide error once a valid selection is made
      select.classList.remove('border-red-500');
      select.classList.add('border-charcoal/20');
      const anyMissing = bookingState.childrenAges
        .slice(0, bookingState.children)
        .some(a => isAgeMissing(a));
      if (!anyMissing) agesError.classList.add('hidden');
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    childrenAgesContainer.appendChild(wrapper);
  }
}

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
    // Trim the ages array from the end — preserved values for remaining children
    bookingState.childrenAges = bookingState.childrenAges.slice(0, bookingState.children);
    childrenCount.textContent = bookingState.children;
    renderChildrenAges();
    saveState(bookingState);
  }
});
childrenInc.addEventListener('click', () => {
  if (bookingState.children < 10) {
    bookingState.children++;
    // Extend the array with null for the new child — existing values untouched
    if (bookingState.childrenAges.length < bookingState.children) {
      bookingState.childrenAges.push(null);
    }
    childrenCount.textContent = bookingState.children;
    renderChildrenAges();
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
  agesError.classList.add('hidden');
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
   Submit — collect → validate → POST to API (via booking.js)
   Guards against duplicate submissions with an in-flight flag.
   On success: clears localStorage, resets state, redirects.
   On error:   restores button, preserves all data.
----------------------------------------------------------------- */

// In-flight guard — prevents duplicate API calls from multiple clicks
let isSubmitting = false;

/**
 * Resets bookingState to defaults and re-hydrates the UI.
 * Passed as a callback to handleSubmitSuccess() so the state
 * object is wiped before the page navigates away.
 */
function resetBookingState() {
  bookingState = Object.assign({}, DEFAULT_STATE, { childrenAges: [] });
}

submitBtn.addEventListener('click', async () => {
  // Guard: ignore clicks while a request is already in flight
  if (isSubmitting) return;

  // 1. Collect
  const data = collectBookingData(bookingState);

  // 2. Client-side validation — failures never touch isSubmitting
  const { valid, errorType } = validateBookingData(data, bookingState);

  if (!valid) {
    if (errorType === 'required') {
      errorMsg.classList.remove('hidden');
      errorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else if (errorType === 'ages') {
      agesError.classList.remove('hidden');
      agesError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      const agesArr = Array.isArray(bookingState.childrenAges) ? bookingState.childrenAges : [];
      childrenAgesContainer.querySelectorAll('select').forEach((sel, i) => {
        const missing = agesArr[i] === null || agesArr[i] === undefined || agesArr[i] === '';
        if (missing) {
          sel.classList.add('border-red-500');
          sel.classList.remove('border-charcoal/20');
        }
      });
    }
    return;
  }

  // Hide all inline messages before each attempt
  errorMsg.classList.add('hidden');
  agesError.classList.add('hidden');
  document.getElementById('modal-success')?.classList.add('hidden');
  document.getElementById('modal-api-error')?.classList.add('hidden');

  // 3. Lock submission + show loading state
  isSubmitting = true;
  setButtonLoading(submitBtn);

  // 4. Submit to API
  try {
    await submitBooking(data);
    // On success: clear localStorage, reset state, redirect.
    // Button is intentionally NOT restored here — the page is navigating away.
    handleSubmitSuccess(data, resetBookingState);
  } catch (err) {
    // On failure: show error, restore button, unlock for retry.
    handleSubmitError(err);
    setButtonReady(submitBtn);
    isSubmitting = false;
  }
  // No finally block — success leaves button disabled until redirect completes.
});


/* =============================================================
   REVIEWS SECTION — data + render + scroll animation
============================================================= */

const reviews = [
  {
    name: "Prathush Kp",
    initials: "PK",
    avatarColor: "#1B4332",
    context: null,
    rating: 5,
    text: "We had a wonderful stay at this homestay. The place was clean, comfortable, and thoughtfully maintained, making it feel like a home away from home. The hosts were extremely warm, helpful, and always available whenever we needed anything. The surroundings were peaceful and perfect for relaxing, and the overall experience was calm and refreshing. Highly recommended for anyone looking for a cozy, welcoming stay. Would definitely love to visit again.",
    videoType: null,
    videoUrl: null,
  },
  {
    name: "Pushpa Poulose",
    initials: "PP",
    avatarColor: "#B5744A",
    context: null,
    rating: 5,
    text: "Escape to serenity! This hidden gem blends old-world charm with modern luxury, nestled in lush greenery yet just a stone's throw from the city. Imagine unwinding in spacious rooms with attic views, lounging by the sparkling pool, or soaking in the tranquility. The ambience of the place, food arrangements, services extended, and the great company of our friends made it a perfect weekend getaway from the chaos — book now and experience bliss!",
    videoType: null,
    videoUrl: null,
  },
  {
    name: "Vinuja Xavier",
    initials: "VX",
    avatarColor: "#5C7A5C",
    context: "Holiday · Family",
    rating: 5,
    text: "It's a great place to stay with family and friends. We had the best experience staying there. Location is beautiful and close to nature. This place is very well maintained. We had complementary breakfast and food was yummy. Rooms were spacious and comfortable. The owner was extremely friendly and we will definitely want to come back. I would highly recommend this place.",
    videoType: null,
    videoUrl: null,
  },
  {
    name: "Chitra Muralidharan",
    initials: "CM",
    avatarColor: "#8B6F47",
    context: "Holiday · Friends",
    rating: 5,
    text: "An absolutely serene and picturesque escape, perfect for a relaxing getaway with friends or family. The quiet atmosphere, coupled with beautiful surroundings, makes it an ideal spot to unwind and recharge. Highly recommend for a tranquil, memorable staycation where you can truly connect with nature and loved ones.",
    videoType: null,
    videoUrl: null,
  },
  {
    name: "Raji Joseph",
    initials: "RJ",
    avatarColor: "#3A7D44",
    context: "Holiday · Friends",
    rating: 5,
    text: "I recently stayed at Jeevika Haven and it exceeded my expectations! The homestay was perfect for a fun get-together with friends and family. The pool was a highlight, and delicious homely food topped it up. Spacious rooms offered a comfortable stay amidst nature's serenity. A must-visit to unwind and rejuvenate, highly recommended!",
    videoType: null,
    videoUrl: null,
  },
  {
    name: "Mathew Varghese",
    initials: "MV",
    avatarColor: "#6B4F3A",
    context: "Holiday · Family",
    rating: 5,
    text: "Jeevika Haven – The Perfect Blend of Family Fun & Serenity. For those looking for an ideal spot for a family get-together or a peaceful retreat, Jeevika Haven offers both. With cozy accommodations and a warm atmosphere, it's perfect for making lasting memories. Plus, explore stunning scenic spots within just 3 km — nature's beauty is right at your doorstep.",
    videoType: "placeholder",
    videoUrl: null,
  },
];

/* -----------------------------------------------------------------
   Build one filled-star SVG string (forest green)
----------------------------------------------------------------- */
function starSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
              fill="#1B4332" class="w-4 h-4" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 0 0 .95.69h4.169
             c.969 0 1.371 1.24.588 1.81l-3.374 2.452a1 1 0 0 0-.364 1.118l1.286 3.966
             c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.352 2.436c-.784.57-1.838-.197-1.539-1.118
             l1.286-3.966a1 1 0 0 0-.364-1.118L2.657 9.393c-.783-.57-.38-1.81.588-1.81h4.169
             a1 1 0 0 0 .95-.69l1.285-3.966Z"/>
  </svg>`;
}

/* -----------------------------------------------------------------
   renderReviews — carousel: builds cards, wires arrows + dots
----------------------------------------------------------------- */
function renderReviews() {
  const track    = document.getElementById('reviews-track');
  const dotsWrap = document.getElementById('reviews-dots');
  const prevBtn  = document.getElementById('reviews-prev');
  const nextBtn  = document.getElementById('reviews-next');
  const header   = document.getElementById('reviews-header');
  const wrap     = document.getElementById('reviews-carousel-wrap');

  if (!track) return;

  // Card width: 340px on desktop, ~85vw on mobile (so ~1.1 cards peek)
  const CARD_W_PX  = 340;
  const CARD_GAP   = 20; // gap-5 = 20px
  const cardStep   = CARD_W_PX + CARD_GAP;

  track.innerHTML   = '';
  dotsWrap.innerHTML = '';

  /* ---- Build cards ---- */
  reviews.forEach((review, idx) => {
    const li = document.createElement('li');
    li.className = 'review-card bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col ' +
                   'transition-[box-shadow] duration-300 ease-out hover:shadow-xl shrink-0';
    li.style.cssText = `width: min(${CARD_W_PX}px, 85vw); scroll-snap-align: start;`;

    if (review.videoType === 'placeholder') {
      li.innerHTML = `
        <div class="relative flex items-center justify-center h-48"
             style="background: linear-gradient(135deg,#1B4332 0%,#3A7D44 100%);">
          <div class="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                 class="w-7 h-7 ml-1" fill="#fff" aria-hidden="true">
              <path d="M8 5.14v14l11-7-11-7Z"/>
            </svg>
          </div>
        </div>
        <div class="p-6 flex flex-col items-center text-center flex-1 justify-center gap-3">
          <div class="w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-bold text-white text-sm"
               style="background-color:${review.avatarColor};">${review.initials}</div>
          <div>
            <p class="text-charcoal font-semibold text-sm">${review.name}</p>
            ${review.context ? `<p class="text-charcoal/50 text-xs mt-0.5">${review.context}</p>` : ''}
          </div>
          <p class="text-charcoal/50 text-xs italic">Video review coming soon</p>
        </div>`;
    } else {
      const stars = Array.from({ length: review.rating }, () => starSVG()).join('');
      li.innerHTML = `
        <div class="p-6 flex flex-col gap-4 flex-1">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-full flex items-center justify-center shrink-0
                        font-bold text-white text-sm leading-none"
                 style="background-color:${review.avatarColor};">${review.initials}</div>
            <div class="min-w-0">
              <p class="text-charcoal font-semibold text-sm leading-snug">${review.name}</p>
              ${review.context ? `<p class="text-charcoal/50 text-xs mt-0.5">${review.context}</p>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-0.5" role="img" aria-label="${review.rating} out of 5 stars">
            ${stars}
          </div>
          <p class="text-charcoal/70 text-sm leading-relaxed flex-1">${review.text}</p>
        </div>`;
    }

    track.appendChild(li);

    /* ---- Dot ---- */
    const dot = document.createElement('button');
    dot.dataset.dot = idx;
    dot.setAttribute('aria-label', `Go to review ${idx + 1}`);
    dot.className = 'w-2 h-2 rounded-full transition-all duration-300 ' +
                    (idx === 0 ? 'bg-forest scale-125' : 'bg-charcoal/20');
    dot.addEventListener('click', () => {
      track.scrollTo({ left: idx * cardStep, behavior: 'smooth' });
    });
    dotsWrap.appendChild(dot);
  });

  /* ---- Arrow state helper ---- */
  function updateArrows() {
    if (!prevBtn || !nextBtn) return;
    prevBtn.disabled = track.scrollLeft <= 4;
    // Account for sub-pixel rounding with a small threshold
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    nextBtn.disabled = atEnd;
  }

  /* ---- Active dot helper ---- */
  function updateDots() {
    const idx = Math.round(track.scrollLeft / cardStep);
    dotsWrap.querySelectorAll('button').forEach((d, i) => {
      if (i === idx) {
        d.classList.remove('bg-charcoal/20');
        d.classList.add('bg-forest', 'scale-125');
      } else {
        d.classList.remove('bg-forest', 'scale-125');
        d.classList.add('bg-charcoal/20');
      }
    });
  }

  /* ---- Scroll listener ---- */
  track.addEventListener('scroll', () => {
    updateArrows();
    updateDots();
  }, { passive: true });

  /* ---- Arrow clicks ---- */
  if (prevBtn) prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -cardStep, behavior: 'smooth' });
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: cardStep, behavior: 'smooth' });
  });

  // Initial arrow state
  updateArrows();

  /* ---- Section entrance animation (header + carousel as one unit) ---- */
  [header, wrap].forEach(el => {
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.85,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '#reviews',
          start: 'top 85%',
          toggleActions: 'play reverse play reverse',
        },
      }
    );
  });
}

renderReviews();
