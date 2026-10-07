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
  initLanguage();
  initAuthUI();
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

// ─── Internationalization ───
function getLang() {
  const data = getData();
  return data.settings.lang || 'mn';
}

function setLang(lang) {
  const data = getData();
  data.settings.lang = lang;
  saveData(data);
  applyTranslations();
  updateLangSwitcher();
}

function t(key) {
  const data = getData();
  const lang = getLang();
  return (data.i18n[lang] && data.i18n[lang][key]) || data.i18n.mn[key] || key;
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = t(key);
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.placeholder !== undefined) el.placeholder = value;
    } else if (el.tagName === 'BUTTON' || el.tagName === 'A') {
      // Keep child elements if any, otherwise set text
      if (el.children.length === 0) el.textContent = value;
    } else {
      el.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });

  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });

  // Update HTML lang attribute
  document.documentElement.lang = getLang();
}

function initLanguage() {
  applyTranslations();
  updateLangSwitcher();
}

function updateLangSwitcher() {
  const lang = getLang();
  document.querySelectorAll('.lang-switch').forEach(sw => {
    sw.textContent = lang.toUpperCase();
  });
}

// ─── Auth ───
function getCurrentUser() {
  const data = getData();
  return data.currentUser || null;
}

function setCurrentUser(user) {
  const data = getData();
  data.currentUser = user ? { id: user.id, name: user.name, phone: user.phone } : null;
  saveData(data);
  initAuthUI();
}

function registerUser(name, phone, password) {
  const data = getData();
  if (data.users.find(u => u.phone === phone)) {
    return { success: false, message: t('phone_registered') };
  }
  const user = { id: 'user-' + Date.now(), name, phone, password };
  data.users.push(user);
  saveData(data);
  setCurrentUser(user);
  return { success: true };
}

function loginUser(phone, password) {
  const data = getData();
  const user = data.users.find(u => u.phone === phone && u.password === password);
  if (!user) {
    return { success: false, message: t('invalid_credentials') };
  }
  setCurrentUser(user);
  return { success: true };
}

function logoutUser() {
  setCurrentUser(null);
}

function initAuthUI() {
  const user = getCurrentUser();
  const headerAction = document.getElementById('header-auth-action');
  const mobileAuth = document.getElementById('mobile-auth-action');

  if (headerAction) {
    if (user) {
      headerAction.innerHTML = `
        <div class="user-menu">
          <button class="user-menu-toggle">${escapeHtml(user.name)} ▾</button>
          <div class="user-dropdown">
            <a href="profile.html" data-i18n="profile">Профайл</a>
            <a href="my-bookings.html" data-i18n="nav_my_bookings">Миний захиалгууд</a>
            <button class="logout-btn" data-i18n="logout">Гарах</button>
          </div>
        </div>
      `;
      headerAction.querySelector('.logout-btn').addEventListener('click', logoutUser);
    } else {
      headerAction.innerHTML = `<button class="btn btn-primary btn-sm" onclick="openAuthModal('login')" data-i18n="login">Нэвтрэх</button>`;
    }
    applyTranslations();
  }

  if (mobileAuth) {
    if (user) {
      mobileAuth.innerHTML = `
        <a href="my-bookings.html" class="btn btn-secondary" data-i18n="nav_my_bookings">Миний захиалгууд</a>
        <button class="btn btn-primary" onclick="logoutUser()" data-i18n="logout">Гарах</button>
      `;
    } else {
      mobileAuth.innerHTML = `<button class="btn btn-primary" onclick="openAuthModal('login')" data-i18n="login" style="width:100%">Нэвтрэх</button>`;
    }
    applyTranslations();
  }

  // Update hero CTA if on home
  const heroCta = document.getElementById('hero-cta');
  if (heroCta) {
    heroCta.innerHTML = user
      ? `<a href="booking.html" class="btn btn-primary btn-lg" data-i18n="book_now">Захиалга өгөх</a>
         <a href="packages.html" class="btn btn-light btn-lg" data-i18n="view_packages">Багц үзэх</a>`
      : `<button class="btn btn-primary btn-lg" onclick="openAuthModal('login')" data-i18n="login">Нэвтрэх</button>
         <a href="packages.html" class="btn btn-light btn-lg" data-i18n="view_packages">Багц үзэх</a>`;
  }

  // Update mobile CTA
  const mobileCta = document.querySelector('.mobile-cta-bar');
  if (mobileCta) {
    const data = getData();
    if (user) {
      mobileCta.innerHTML = `
        <a href="my-bookings.html" class="btn btn-secondary" style="flex:1" data-i18n="nav_my_bookings">Миний захиалгууд</a>
        <a href="booking.html" class="btn btn-primary" style="flex:1.5" data-i18n="book_now">Захиалга өгөх</a>
      `;
    } else {
      mobileCta.innerHTML = `
        <button class="btn btn-secondary" style="flex:1" onclick="openAuthModal('login')" data-i18n="login">Нэвтрэх</button>
        <a href="tel:${data.settings.phone.replace(/\s/g, '')}" class="btn btn-primary" style="flex:1.5" data-i18n="phone">Утас</a>
      `;
    }
    applyTranslations();
  }
}

function openAuthModal(mode = 'login') {
  const existing = document.getElementById('auth-modal');
  if (existing) existing.remove();

  const isLogin = mode === 'login';
  const modalHtml = `
    <div id="auth-modal" style="position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:1rem">
      <div class="booking-form" style="width:100%;max-width:420px">
        <div class="flex justify-between items-center mb-4">
          <h3 style="margin:0" data-i18n="${isLogin ? 'login' : 'register'}">${isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}</h3>
          <button onclick="closeModal('auth-modal')" style="background:none;border:none;font-size:1.25rem">✕</button>
        </div>
        <form id="auth-form" class="admin-form">
          <div class="form-group">
            <label class="form-label" data-i18n="name">Нэр</label>
            <input type="text" name="name" class="form-input" ${isLogin ? '' : 'required'}>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="phone">Утас</label>
            <input type="tel" name="phone" class="form-input" required>
          </div>
          <div class="form-group">
            <label class="form-label" data-i18n="password">Нууц үг</label>
            <input type="password" name="password" class="form-input" required>
          </div>
          ${!isLogin ? `
          <div class="form-group">
            <label class="form-label" data-i18n="confirm_password">Нууц үг давтах</label>
            <input type="password" name="confirmPassword" class="form-input" required>
          </div>
          ` : ''}
          <button type="submit" class="btn btn-primary" style="width:100%" data-i18n="${isLogin ? 'login' : 'register'}">${isLogin ? 'Нэвтрэх' : 'Бүртгүүлэх'}</button>
        </form>
        <p class="text-center mt-4" style="font-size:0.9375rem">
          ${isLogin
            ? `<a href="#" onclick="openAuthModal('register')" data-i18n="no_account">Бүртгэлгүй юу? Бүртгүүлэх</a>`
            : `<a href="#" onclick="openAuthModal('login')" data-i18n="have_account">Бүртгэлтэй юу? Нэвтрэх</a>`}
        </p>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  applyTranslations();

  document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const phone = form.phone.value;
    const password = form.password.value;

    if (isLogin) {
      const result = loginUser(phone, password);
      if (result.success) {
        closeModal('auth-modal');
        showToast(t('welcome') + '!');
        // If on booking page and not logged in, redirect not needed
      } else {
        showToast(result.message, 'error');
      }
    } else {
      const name = form.name.value;
      const confirmPassword = form.confirmPassword.value;
      if (password !== confirmPassword) {
        showToast(t('password_mismatch'), 'error');
        return;
      }
      const result = registerUser(name, phone, password);
      if (result.success) {
        closeModal('auth-modal');
        showToast(t('welcome') + ', ' + name + '!');
      } else {
        showToast(result.message, 'error');
      }
    }
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
  if (!form || form.id === 'contact-form') return;

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

    const user = getCurrentUser();
    if (!user) {
      showToast(t('login_required'), 'error');
      openAuthModal('login');
      return;
    }

    const formData = new FormData(form);
    const data = getData();

    const booking = {
      id: 'bk-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userPhone: user.phone,
      name: formData.get('name') || user.name,
      phone: formData.get('phone') || user.phone,
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

    showToast(t('booking_saved'));
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
  const lang = getLang();

  return `
    <header class="header">
      <div class="container header-inner">
        <a href="index.html" class="logo">
          <img src="images/camp-logo.jpg" alt="Monde Tour logo">
          <span>${escapeHtml(settings.siteName)}</span>
        </a>
        <nav class="nav">
          <a href="about.html" class="nav-link" data-i18n="nav_about">Бидний тухай</a>
          <a href="rooms.html" class="nav-link" data-i18n="nav_rooms">Байрлах өрөө</a>
          <a href="packages.html" class="nav-link" data-i18n="nav_packages">Багц</a>
          <a href="food.html" class="nav-link" data-i18n="nav_food">Хоолны үйлчилгээ</a>
          <a href="events.html" class="nav-link" data-i18n="nav_events">Арга хэмжээ</a>
          <a href="gallery.html" class="nav-link" data-i18n="nav_gallery">Зургийн цомог</a>
        </nav>
        <div class="header-actions">
          <button class="lang-switch" onclick="toggleLanguage()" title="Switch language">${lang.toUpperCase()}</button>
          <div id="header-auth-action"></div>
          <button class="mobile-menu-btn" data-i18n-aria="menu_open" aria-label="Цэс нээх">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
    <div class="mobile-menu">
      <button class="mobile-menu-close" data-i18n-aria="menu_close" aria-label="Цэс хаах">✕</button>
      <a href="about.html" data-i18n="nav_about">Бидний тухай</a>
      <a href="rooms.html" data-i18n="nav_rooms">Байрлах өрөө</a>
      <a href="packages.html" data-i18n="nav_packages">Багц</a>
      <a href="food.html" data-i18n="nav_food">Хоолны үйлчилгээ</a>
      <a href="events.html" data-i18n="nav_events">Арга хэмжээ</a>
      <a href="gallery.html" data-i18n="nav_gallery">Зургийн цомог</a>
      <div id="mobile-auth-action" class="mobile-menu-cta"></div>
    </div>
  `;
}

function toggleLanguage() {
  const current = getLang();
  setLang(current === 'mn' ? 'en' : 'mn');
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
            <h4 class="footer-title" data-i18n="nav_home">Цэс</h4>
            <ul class="footer-links">
              <li><a href="index.html" data-i18n="nav_home">Нүүр</a></li>
              <li><a href="about.html" data-i18n="nav_about">Бидний тухай</a></li>
              <li><a href="rooms.html" data-i18n="nav_rooms">Байрлах өрөө</a></li>
              <li><a href="packages.html" data-i18n="nav_packages">Багц</a></li>
              <li><a href="food.html" data-i18n="nav_food">Хоолны үйлчилгээ</a></li>
              <li><a href="events.html" data-i18n="nav_events">Арга хэмжээ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-title" data-i18n="services">Үйлчилгээ</h4>
            <ul class="footer-links">
              <li><a href="events.html#corporate" data-i18n="corporate_events">Байгууллагын арга хэмжээ</a></li>
              <li><a href="events.html#wedding" data-i18n="weddings">Хурим</a></li>
              <li><a href="events.html#family" data-i18n="family_celebrations">Гэр бүлийн баяр</a></li>
              <li><a href="gallery.html" data-i18n="nav_gallery">Зургийн цомог</a></li>
              <li><a href="location.html" data-i18n="location_title">Байршил</a></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-title" data-i18n="nav_contact">Холбогдох</h4>
            <div class="footer-contact">
              <a href="tel:${s.phone.replace(/\s/g, '')}">📞 ${escapeHtml(s.phone)}</a>
              <a href="mailto:${escapeHtml(s.email)}">✉️ ${escapeHtml(s.email)}</a>
              <a href="location.html">📍 ${escapeHtml(s.address)}</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} ${escapeHtml(s.siteName)}. ${t('rights_reserved')}.</span>
          <span><a href="admin.html" style="color:var(--green-400)" data-i18n="admin">Admin</a></span>
        </div>
      </div>
    </footer>
  `;
}

// Render mobile CTA bar
function renderMobileCTA() {
  return `<div class="mobile-cta-bar"></div>`;
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
  initAuthUI();
}

// Wait for data and inject components
document.addEventListener('DOMContentLoaded', () => {
  injectSharedComponents();
});
