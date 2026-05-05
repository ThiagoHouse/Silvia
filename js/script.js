/* =============================================================
   SILVIA SANTOS ? Campaign Site JavaScript
   ============================================================= */

'use strict';

// ??? Navbar scroll effect ???????????????????????????????????????
const navbar    = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close menu on nav link click
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !navToggle.contains(e.target)) {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

// ??? Particles ????????????????????????????????????????????????
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 22; i++) {
    const p    = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 70 + 18;
    Object.assign(p.style, {
      width:                  size + 'px',
      height:                 size + 'px',
      left:                   Math.random() * 100 + '%',
      animationDuration:      (Math.random() * 18 + 14) + 's',
      animationDelay:         (Math.random() * -22) + 's',
      opacity:                String(Math.random() * 0.25 + 0.03),
    });
    container.appendChild(p);
  }
})();

// ??? Intersection Observer ? appear animations ?????????????????
const appearObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('[data-aos]');
      let delay = 0;
      siblings.forEach((el, idx) => {
        if (!el.classList.contains('visible')) return;
        el.style.transitionDelay = idx * 0.1 + 's';
      });
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach(el => appearObserver.observe(el));

// ??? Counter animation ?????????????????????????????????????????
function animateCounter(el, target) {
  const duration = Math.min(2400, 600 + target / 20);
  const step     = target / (duration / 16);
  let   current  = 0;

  const tick = () => {
    current += step;
    if (current >= target) {
      el.textContent = target.toLocaleString('pt-BR');
    } else {
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = parseInt(entry.target.dataset.count, 10);
      animateCounter(entry.target, target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter[data-count]').forEach(el => counterObserver.observe(el));

// ??? Active nav link on scroll ?????????????????????????????????
const sections  = Array.from(document.querySelectorAll('section[id]'));
const navLinks  = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));

function updateActiveLink() {
  const scrollY = window.scrollY + 90;
  let active = null;

  sections.forEach(section => {
    if (section.offsetTop <= scrollY) {
      active = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    const matches = link.getAttribute('href') === '#' + active;
    link.style.color = matches ? 'var(--secondary)' : '';
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ??? Contact form (simulated) ??????????????????????????????????
const contatoForm  = document.getElementById('contatoForm');
const formSuccess  = document.getElementById('formSuccess');

if (contatoForm) {
  contatoForm.addEventListener('submit', e => {
    e.preventDefault();

    // Basic validation
    const required = contatoForm.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = '#dc2626';
        valid = false;
      }
    });
    if (!valid) return;

    const btn = contatoForm.querySelector('button[type="submit"]');
    const originalHTML = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    btn.disabled = true;

    // Simulate network request
    setTimeout(() => {
      formSuccess.hidden = false;
      contatoForm.reset();
      btn.innerHTML = originalHTML;
      btn.disabled  = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Hide success message after 6 s
      setTimeout(() => { formSuccess.hidden = true; }, 6000);
    }, 1600);
  });

  // Clear error color on input
  contatoForm.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('input', () => { field.style.borderColor = ''; });
  });
}

// ??? Galeria lightbox (simple version) ?????????????????????????
document.querySelectorAll('.galeria-item').forEach(item => {
  item.addEventListener('click', () => {
    const label = item.querySelector('.galeria-overlay p')?.textContent ?? '';
    if (!label) return;

    // Build simple overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = [
      'position:fixed', 'inset:0', 'background:rgba(7,15,26,.85)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'z-index:2000', 'backdrop-filter:blur(6px)', 'cursor:zoom-out',
    ].join(';');

    const box = document.createElement('div');
    box.style.cssText = [
      'background:' + getComputedStyle(item).background,
      'width:min(680px,90vw)', 'height:380px', 'border-radius:16px',
      'display:flex', 'align-items:flex-end', 'padding:28px',
      'box-shadow:0 30px 80px rgba(0,0,0,.5)',
    ].join(';');

    const text = document.createElement('p');
    text.textContent = label;
    text.style.cssText = 'color:#fff;font-weight:600;font-size:1.1rem;font-family:Inter,sans-serif';

    box.appendChild(text);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const close = () => {
      overlay.remove();
      document.body.style.overflow = '';
    };
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); }, { once: true });
  });
});

// ??? Smooth scroll polyfill for older browsers ????????????????
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});
