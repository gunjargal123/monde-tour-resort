// ─── Monde Tour Resort — Main JavaScript ───

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initCurrentNav();
  initHeaderScroll();
  initSmoothScroll();
  initLightbox();
  initBookingForm();
  initToast();
});

// Header scroll effect
function initHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const update = () => {
    if (window.scrollY > 20) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initHeaderScroll() {
  // alias for compatibility
}

// Mobile menu
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-btn');
  const close = document.querySelector('.mobile-menu-close');
  const menu = document.querySelector('.mobile-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  close.addEventListener('click', () => {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Highlight current page nav
function initCurrentNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// Lightbox for gallery
let lightboxImages = [];
let currentLightboxIndex = 0;

function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox) return;

  const items = document.querySelectorAll('.gallery-item');
  lightboxImages = Array.from(items).map(item => ({
    src: item.dataset.src || item.querySelector('img')?.src,
    title: item.dataset.title || item.querySelector('img')?.alt || ''
  })).filter(img => img.src);

  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
  lightbox.querySelector('.lightbox-next').addEventListener('click', showNextImage);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevImage();
    if (e.key === 'ArrowRight') showNextImage();
  });
}

function openLightbox(index) {
  const lightbox = document.querySelector('.lightbox');
  const img = lightbox.querySelector('img');
  currentLightboxIndex = index;
  img.src = lightboxImages[index].src;
  img.alt = lightboxImages[index].title;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.querySelector('.lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

function showPrevImage() {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

function showNextImage() {
  if (lightboxImages.length === 0) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % lightboxImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const lightbox = document.querySelector('.lightbox');
  const img = lightbox.querySelector('img');
  img.src = lightboxImages[currentLightboxIndex].src;
  img.alt = lightboxImages[currentLightboxIndex].title;
}

// Booking form handling
function initBookingForm() {
  const form = document.querySelector('.booking-form');
  if (!form) return;

  const serviceSelect = form.querySelector('[name="serviceType"]');
  const roomGroup = form.querySelector('.room-select-group');
  const packageGroup = form.querySelector('.package-select-group');

  function updateDynamicFields() {
    const value = serviceSelect?.value;
    if (roomGroup) roomGroup.classList.add('hidden');
    if (packageGroup) packageGroup.classList.add('hidden');

    if (value === 'room' && roomGroup) {
      roomGroup.classList.remove('hidden');
    } else if (value === 'package' && packageGroup) {
      packageGroup.classList.remove('hidden');
    }
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', updateDynamicFields);
    updateDynamicFields();
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = getData();

    const booking = {
      id: 'bk-' + Date.now(),
      name: formData.get('name'),
      phone: formData.get('phone'),
      arrivalDate: formData.get('arrivalDate'),
      departureDate: formData.get('departureDate'),
      people: formData.get('people'),
      serviceType: formData.get('serviceType'),
      room: formData.get('room') || null,
      package: formData.get('package') || null,
      notes: formData.get('notes'),
      status: 'new',
      createdAt: new Date().toISOString()
    };

    data.bookings.unshift(booking);
    saveData(data);

    showToast('Таны захиалгын хүсэлтийг хүлээн авлаа. Манай ажилтан тантай удахгүй холбогдоно.');
    form.reset();
    updateDynamicFields();
  });
}

// Toast notifications
let toastTimeout;

function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.className = 'toast ' + (type === 'error' ? 'error' : '');
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 5000);
}

function initToast() {
  // Toast is created on demand
}

// Render header (shared component)
function renderHeader() {
  const data = getData();
  const settings = data.settings;

  return `
    <header class="header">
      <div class="container header-inner">
        <a href="index.html" class="logo">
          <img src="images/camp-logo.jpg" alt="Monde Tour logo">
          <span>${escapeHtml(settings.siteName)}</span>
        </a>
        <nav class="nav">
          <a href="index.html" class="nav-link">Нүүр</a>
          <a href="about.html" class="nav-link">Бидний тухай</a>
          <a href="rooms.html" class="nav-link">Өрөө</a>
          <a href="packages.html" class="nav-link">Багц</a>
          <a href="food.html" class="nav-link">Хоол</a>
          <a href="events.html" class="nav-link">Event</a>
          <a href="gallery.html" class="nav-link">Зургийн цомог</a>
          <a href="contact.html" class="nav-link">Холбогдох</a>
        </nav>
        <div class="header-actions">
          <span class="lang-switch">MN</span>
          <a href="booking.html" class="btn btn-primary btn-sm">Захиалга өгөх</a>
          <button class="mobile-menu-btn" aria-label="Цэс нээх">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
    <div class="mobile-menu">
      <button class="mobile-menu-close" aria-label="Цэс хаах">✕</button>
      <a href="index.html">Нүүр</a>
      <a href="about.html">Бидний тухай</a>
      <a href="rooms.html">Өрөө</a>
      <a href="packages.html">Багц</a>
      <a href="food.html">Хоол</a>
      <a href="events.html">Event</a>
      <a href="gallery.html">Зургийн цомог</a>
      <a href="contact.html">Холбогдох</a>
      <a href="booking.html" class="btn btn-primary mobile-menu-cta">Захиалга өгөх</a>
    </div>
  `;
}

// Render footer (shared component)
function renderFooter() {
  const data = getData();
  const s = data.settings;

  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="logo">
              <img src="images/camp-logo.jpg" alt="Monde Tour logo">
              <span>${escapeHtml(s.siteName)}</span>
            </a>
            <p>${escapeHtml(s.tagline)}</p>
            <div class="footer-social">
              <a href="${escapeHtml(s.facebook)}" target="_blank" rel="noopener" aria-label="Facebook">FB</a>
              <a href="${escapeHtml(s.instagram)}" target="_blank" rel="noopener" aria-label="Instagram">IG</a>
            </div>
          </div>
          <div>
            <h4 class="footer-title">Цэс</h4>
            <ul class="footer-links">
              <li><a href="index.html">Нүүр</a></li>
              <li><a href="about.html">Бидний тухай</a></li>
              <li><a href="rooms.html">Өрөө</a></li>
              <li><a href="packages.html">Багц</a></li>
              <li><a href="food.html">Хоол</a></li>
              <li><a href="events.html">Event</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-title">Үйлчилгээ</h4>
            <ul class="footer-links">
              <li><a href="events.html#corporate">Байгууллагын event</a></li>
              <li><a href="events.html#wedding">Хурим</a></li>
              <li><a href="events.html#family">Гэр бүлийн баяр</a></li>
              <li><a href="gallery.html">Зургийн цомог</a></li>
              <li><a href="location.html">Байршил</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-title">Холбогдох</h4>
            <div class="footer-contact">
              <a href="tel:${s.phone.replace(/\s/g, '')}">📞 ${escapeHtml(s.phone)}</a>
              <a href="mailto:${escapeHtml(s.email)}">✉️ ${escapeHtml(s.email)}</a>
              <a href="location.html">📍 ${escapeHtml(s.address)}</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${escapeHtml(s.siteName)}. Бүх эрх хуулиар хамгаалагдсан.</span>
          <span><a href="admin.html" style="color:var(--green-400)">Admin</a></span>
        </div>
      </div>
    </footer>
  `;
}

// Render mobile CTA bar
function renderMobileCTA() {
  const data = getData();
  return `
    <div class="mobile-cta-bar">
      <a href="tel:${data.settings.phone.replace(/\s/g, '')}" class="btn btn-secondary" style="flex:1">📞 Залгах</a>
      <a href="booking.html" class="btn btn-primary" style="flex:1.5">Захиалга өгөх</a>
    </div>
  `;
}

// Inject shared components into page
function injectSharedComponents() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');
  const mobileCtaPlaceholder = document.getElementById('mobile-cta-placeholder');

  if (headerPlaceholder) {
    headerPlaceholder.outerHTML = renderHeader();
  }
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = renderFooter();
  }
  if (mobileCtaPlaceholder) {
    mobileCtaPlaceholder.outerHTML = renderMobileCTA();
  }

  // Re-init after injection
  initHeader();
  initMobileMenu();
  initCurrentNav();
  initSmoothScroll();
}

// Wait for data and inject components
document.addEventListener('DOMContentLoaded', () => {
  injectSharedComponents();
});
