/* =========================================================
   EL PROGRESO — Finca Ganadera
   JavaScript: navegación, scroll reveal, formulario simulado
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Año dinámico en el footer ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Header sólido al hacer scroll ---------- */
  const header = document.getElementById('header');
  const toTopBtn = document.getElementById('to-top');

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('scrolled', scrolled);
    toTopBtn.classList.toggle('visible', window.scrollY > 500);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Menú móvil ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  /* Cerrar el menú móvil al elegir una opción */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Resaltar enlace activo según la sección visible ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- Animación de aparición al hacer scroll ---------- */
  const revealItems = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealItems.forEach(item => revealObserver.observe(item));

  /* ---------- Formulario de contacto (simulado, sin backend) ---------- */
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        feedback.textContent = 'Por favor completa los campos obligatorios.';
        feedback.style.color = '#A3452B';
        return;
      }

      const nombre = form.querySelector('#nombre').value.trim();

      feedback.style.color = '';
      feedback.textContent = `¡Gracias, ${nombre}! Tu mensaje fue recibido. Te contactaremos pronto.`;
      form.reset();
    });
  }

});
