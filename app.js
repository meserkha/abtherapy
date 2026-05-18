/* ============================================================
   Router + interactions
   - Hash-based route switching between page sections
   - Nav active state
   - Mobile menu toggle
   - Contact form: client-side validation + success state
   ============================================================ */

(function () {
  'use strict';

  const ROUTES = ['home', 'about', 'specialties', 'services', 'investment', 'faq', 'contact'];
  const pages = document.querySelectorAll('[data-route]');
  const nav = document.getElementById('nav');
  const navMenu = document.getElementById('navMenu');

  // ----- Router ----------------------------------------------------------
  function getRoute() {
    const hash = (location.hash || '#home').replace('#', '');
    return ROUTES.includes(hash) ? hash : 'home';
  }

  function setActive(route) {
    // Show/hide sections
    document.querySelectorAll('section.page').forEach(sec => {
      const match = sec.getAttribute('data-route') === route;
      sec.hidden = !match;
    });
    // Update active nav link
    document.querySelectorAll('.nav__links a').forEach(a => {
      a.classList.toggle('is-active', a.getAttribute('data-route') === route);
    });
    // Close mobile menu
    nav.classList.remove('is-open');
    if (navMenu) navMenu.setAttribute('aria-expanded', 'false');
    // Scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    // Update title
    const titleMap = {
      home: 'Dr. John Doe, Ph.D. — Clinical Psychology in Los Angeles',
      about: 'About — Dr. John Doe, Ph.D.',
      specialties: 'Specialties — Dr. John Doe, Ph.D.',
      services: 'Services — Dr. John Doe, Ph.D.',
      investment: 'Investment — Dr. John Doe, Ph.D.',
      faq: 'FAQ — Dr. John Doe, Ph.D.',
      contact: 'Contact — Dr. John Doe, Ph.D.',
    };
    document.title = titleMap[route] || titleMap.home;
  }

  function handleHashChange() {
    setActive(getRoute());
  }

  // Intercept route clicks to ensure clean routing even when clicking
  // the current route (or duplicate links).
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-route]');
    if (!a) return;
    const route = a.getAttribute('data-route');
    if (!ROUTES.includes(route)) return;
    e.preventDefault();
    if (getRoute() === route) {
      setActive(route);
    } else {
      location.hash = route;
    }
  });

  window.addEventListener('hashchange', handleHashChange);

  // ----- Mobile menu ----------------------------------------------------
  if (navMenu) {
    navMenu.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navMenu.setAttribute('aria-expanded', String(open));
    });
  }

  // ----- Contact form ---------------------------------------------------
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form && success) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Basic HTML5 validity check
      if (!form.checkValidity()) {
        // Visually flag invalid fields
        form.querySelectorAll(':invalid').forEach(el => {
          el.classList.add('is-invalid');
          el.addEventListener('input', () => el.classList.remove('is-invalid'), { once: true });
        });
        const firstInvalid = form.querySelector(':invalid');
        if (firstInvalid && typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return;
      }
      // Show success state, hide the form fields
      form.querySelectorAll('.form-row, .field, .checkbox, .form-actions').forEach(el => {
        el.style.display = 'none';
      });
      success.hidden = false;
      success.scrollIntoView ? null : null; // intentionally no scroll-into-view
    });
  }

  // ----- Initial state -------------------------------------------------
  handleHashChange();
})();
