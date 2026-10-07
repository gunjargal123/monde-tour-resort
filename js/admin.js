// ─── Monde Tour Resort — Admin JavaScript ───

const ADMIN_PASSWORD = 'admin123';
let currentData = null;

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
});

function initAdminAuth() {
  const loginDiv = document.getElementById('admin-login');
  const appDiv = document.getElementById('admin-app');
  const loginForm = document.getElementById('login-form');
  const logoutBtn = document.getElementById('logout-btn');

  const isLoggedIn = sessionStorage.getItem('mondeTourAdmin') === 'true';

  if (isLoggedIn) {
    showAdminApp();
  }

  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('admin-password').value;
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('mondeTourAdmin', 'true');
      showAdminApp();
    } else {
      showToast('Нууц үг буруу байна.', 'error');
    }
  });

  logoutBtn?.addEventListener('click', () => {
    sessionStorage.removeItem('mondeTourAdmin');
    window.location.reload();
  });
}

function showAdminApp() {
  document.getElementById('admin-login').classList.add('hidden');
  document.getElementById('admin-app').classList.remove('hidden');
  currentData = getData();
  initAdminNav();
  initSettingsForm();
  initResetData();
  renderDashboard();
  renderBookings();
  renderRoomsTable();
  renderPackagesTable();
  renderMenuTable();
  renderEventsTable();
  renderGalleryTable();
}

function initAdminNav() {
  document.querySelectorAll('.admin-nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      switchSection(section);

      document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function switchSection(section) {
  document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
  document.getElementById('section-' + section).classList.add('active');

  const titles = {
    dashboard: 'Хяналтын самбар',
    bookings: 'Захиалгууд',
    rooms: 'Өрөө',
    packages: 'Багц',
    menu: 'Меню',
    events: 'Event',
    gallery: 'Зургийн цомог',
    settings: 'Тохиргоо'
  };
  document.getElementById('admin-section-title').textContent = titles[section];
}

function initResetData() {
  document.getElementById('reset-data-btn').addEventListener('click', () => {
    if (confirm('Бүх өгөгдлийг анхны байдалд авах уу? Энэ үйлдлийг буцаах боломжгүй.')) {
      resetData();
      currentData = getData();
      renderAll();
      showToast('Өгөгдөл анхны байдалд орлоо.');
    }
  });
}

function renderAll() {
  renderDashboard();
  renderBookings();
  renderRoomsTable();
  renderPackagesTable();
  renderMenuTable();
  renderEventsTable();
  renderGalleryTable();
  initSettingsForm();
}

// ─── Dashboard ───
function renderDashboard() {
  const data = currentData;
  document.getElementById('dash-room-count').textContent = data.rooms.length;
  document.getElementById('dash-package-count').textContent = data.packages.length;
  document.getElementById('dash-new-bookings').textContent = data.bookings.filter(b => b.status === 'new').length;
  document.getElementById('dash-total-bookings').textContent = data.bookings.length;

  const recent = data.bookings.slice(0, 5);
  const container = document.getElementById('dash-recent-bookings');
  if (recent.length === 0) {
    container.innerHTML = '<p class="text-muted">Одоогоор захиалга байхгүй.</p>';
    return;
  }

  container.innerHTML = `<table class="admin-table">
    <thead><tr><th>Огноо</th><th>Нэр</th><th>Үйлчилгээ</th><th>Төлөв</th></tr></thead>
    <tbody>${recent.map(b => `
      <tr>
        <td>${new Date(b.createdAt).toLocaleDateString('mn-MN')}</td>
        <td>${escapeHtml(b.name)}</td>
        <td>${serviceLabel(b.serviceType)}</td>
        <td>${statusBadge(b.status)}</td>
      </tr>
    `).join('')}</tbody>
  </table>`;
}

// ─── Bookings ───
function renderBookings() {
  const tbody = document.getElementById('bookings-table');
  const bookings = currentData.bookings;

  if (bookings.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center">Одоогоор захиалга байхгүй.</td></tr>';
    return;
  }

  tbody.innerHTML = bookings.map(b => `
    <tr>
      <td>${new Date(b.createdAt).toLocaleDateString('mn-MN')}</td>
      <td>${escapeHtml(b.name)}</td>
      <td><a href="tel:${b.phone.replace(/\s/g, '')}">${escapeHtml(b.phone)}</a></td>
      <td>${serviceLabel(b.serviceType)}</td>
      <td>${b.arrivalDate || '-'}</td>
      <td>${b.people || '-'}</td>
      <td>${statusBadge(b.status)}</td>
      <td>
        <select onchange="updateBookingStatus('${b.id}', this.value)" class="form-select" style="min-width:140px;font-size:0.875rem;padding:0.5rem">
          <option value="new" ${b.status === 'new' ? 'selected' : ''}>Шинэ</option>
          <option value="contacted" ${b.status === 'contacted' ? 'selected' : ''}>Холбогдсон</option>
          <option value="confirmed" ${b.status === 'confirmed' ? 'selected' : ''}>Баталгаажсан</option>
          <option value="cancelled" ${b.status === 'cancelled' ? 'selected' : ''}>Цуцлагдсан</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function updateBookingStatus(id, status) {
  const booking = currentData.bookings.find(b => b.id === id);
  if (booking) {
    booking.status = status;
    saveData(currentData);
    renderDashboard();
    showToast('Төлөв шинэчлэгдлээ.');
  }
}

function serviceLabel(type) {
  const labels = {
    room: 'Өрөө', package: 'Багц', corporate: 'Байгууллагын event',
    wedding: 'Хурим', family: 'Гэр бүлийн баяр', other: 'Бусад'
  };
  return labels[type] || type;
}

function statusBadge(status) {
  const labels = { new: 'Шинэ', contacted: 'Холбогдсон', confirmed: 'Баталгаажсан', cancelled: 'Цуцлагдсан' };
  return `<span class="status-badge status-${status}">${labels[status]}</span>`;
}

// ─── Rooms ───
function renderRoomsTable() {
  const container = document.getElementById('rooms-table');
  container.innerHTML = `<table class="admin-table">
    <thead><tr><th>Нэр</th><th>Багтаамж</th><th>Ор</th><th>Үнэ</th><th>Онцлох</th><th></th></tr></thead>
    <tbody>${currentData.rooms.map(r => `
      <tr>
        <td>${escapeHtml(r.name)}</td>
        <td>${r.capacity} хүн</td>
        <td>${escapeHtml(r.beds)}</td>
        <td>${formatPrice(r.price)}</td>
        <td>${r.featured ? '✓' : ''}</td>
        <td class="admin-actions">
          <button class="btn btn-secondary btn-sm" onclick="editRoom('${r.id}')">Засах</button>
          <button class="btn btn-secondary btn-sm" onclick="deleteRoom('${r.id}')" style="color:#991b1b;border-color:#fecaca">Устгах</button>
        </td>
      </tr>
    `).join('')}</tbody>
  </table>`;
}

function openRoomModal(roomId = null) {
  const room = roomId ? currentData.rooms.find(r => r.id === roomId) : {};
  const isEdit = !!roomId;

  const modalHtml = `
    <div id="room-modal" style="position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:1rem">
      <div class="booking-form" style="width:100%;max-width:560px;max-height:90vh;overflow-y:auto">
        <h3 style="margin-bottom:1.25rem">${isEdit ? 'Өрөө засах' : 'Шинэ өрөө нэмэх'}</h3>
        <form id="room-form" class="admin-form">
          <input type="hidden" name="id" value="${room.id || ''}">
          <div class="form-group">
            <label class="form-label">Нэр</label>
            <input type="text" name="name" class="form-input" value="${escapeHtml(room.name || '')}" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Багтаамж</label>
              <input type="number" name="capacity" class="form-input" value="${room.capacity || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Үнэ</label>
              <input type="number" name="price" class="form-input" value="${room.price || ''}" required>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Ор</label>
            <input type="text" name="beds" class="form-input" value="${escapeHtml(room.beds || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Богино тайлбар</label>
            <input type="text" name="shortDesc" class="form-input" value="${escapeHtml(room.shortDesc || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Дэлгэрэнгүй тайлбар</label>
            <textarea name="description" class="form-textarea" rows="3">${escapeHtml(room.description || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Тохижилт (таслалаар)</label>
            <input type="text" name="facilities" class="form-input" value="${escapeHtml((room.facilities || []).join(', '))}">
          </div>
          <div class="form-group">
            <label class="form-label">Зурагны замууд (мөрөөр)</label>
            <textarea name="images" class="form-textarea" rows="2">${escapeHtml((room.images || []).join('\n'))}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:0.5rem">
              <input type="checkbox" name="featured" ${room.featured ? 'checked' : ''}> Онцлох
            </label>
          </div>
          <div class="flex gap-3" style="justify-content:flex-end">
            <button type="button" class="btn btn-secondary" onclick="closeModal('room-modal')">Болих</button>
            <button type="submit" class="btn btn-primary">Хадгалах</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.getElementById('room-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newRoom = {
      id: form.id.value || 'room-' + Date.now(),
      name: form.name.value,
      capacity: parseInt(form.capacity.value),
      price: parseInt(form.price.value),
      priceUnit: 'өдөр',
      beds: form.beds.value,
      shortDesc: form.shortDesc.value,
      description: form.description.value,
      facilities: form.facilities.value.split(',').map(s => s.trim()).filter(Boolean),
      images: form.images.value.split('\n').map(s => s.trim()).filter(Boolean),
      featured: form.featured.checked
    };

    if (isEdit) {
      const idx = currentData.rooms.findIndex(r => r.id === room.id);
      currentData.rooms[idx] = newRoom;
    } else {
      currentData.rooms.push(newRoom);
    }
    saveData(currentData);
    closeModal('room-modal');
    renderRoomsTable();
    renderDashboard();
    showToast('Өрөө хадгалагдлаа.');
  });
}

function editRoom(id) {
  openRoomModal(id);
}

function deleteRoom(id) {
  if (confirm('Энэ өрөөг устгах уу?')) {
    currentData.rooms = currentData.rooms.filter(r => r.id !== id);
    saveData(currentData);
    renderRoomsTable();
    renderDashboard();
    showToast('Өрөө устгагдлаа.');
  }
}

// ─── Packages ───
function renderPackagesTable() {
  const container = document.getElementById('packages-table');
  container.innerHTML = `<table class="admin-table">
    <thead><tr><th>Нэр</th><th>Хүн</th><th>Хугацаа</th><th>Үнэ</th><th>Төрөл</th><th></th></tr></thead>
    <tbody>${currentData.packages.map(p => `
      <tr>
        <td>${escapeHtml(p.name)}</td>
        <td>${escapeHtml(p.people)}</td>
        <td>${escapeHtml(p.duration)}</td>
        <td>${formatPrice(p.price)}</td>
        <td>${escapeHtml(p.type)}</td>
        <td class="admin-actions">
          <button class="btn btn-secondary btn-sm" onclick="editPackage('${p.id}')">Засах</button>
          <button class="btn btn-secondary btn-sm" onclick="deletePackage('${p.id}')" style="color:#991b1b;border-color:#fecaca">Устгах</button>
        </td>
      </tr>
    `).join('')}</tbody>
  </table>`;
}

function openPackageModal(packageId = null) {
  const pkg = packageId ? currentData.packages.find(p => p.id === packageId) : {};
  const isEdit = !!packageId;

  const modalHtml = `
    <div id="package-modal" style="position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:1rem">
      <div class="booking-form" style="width:100%;max-width:560px;max-height:90vh;overflow-y:auto">
        <h3 style="margin-bottom:1.25rem">${isEdit ? 'Багц засах' : 'Шинэ багц нэмэх'}</h3>
        <form id="package-form" class="admin-form">
          <input type="hidden" name="id" value="${pkg.id || ''}">
          <div class="form-group">
            <label class="form-label">Нэр</label>
            <input type="text" name="name" class="form-input" value="${escapeHtml(pkg.name || '')}" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Хүний тоо</label>
              <input type="text" name="people" class="form-input" value="${escapeHtml(pkg.people || '')}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Хугацаа</label>
              <input type="text" name="duration" class="form-input" value="${escapeHtml(pkg.duration || '')}" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Үнэ</label>
              <input type="number" name="price" class="form-input" value="${pkg.price || ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Үнийн нэгж</label>
              <input type="text" name="priceUnit" class="form-input" value="${escapeHtml(pkg.priceUnit || 'багц')}">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Төрөл</label>
            <select name="type" class="form-select">
              <option value="family" ${pkg.type === 'family' ? 'selected' : ''}>Гэр бүлийн</option>
              <option value="couple" ${pkg.type === 'couple' ? 'selected' : ''}>Хосуудын</option>
              <option value="corporate" ${pkg.type === 'corporate' ? 'selected' : ''}>Байгууллагын</option>
              <option value="event" ${pkg.type === 'event' ? 'selected' : ''}>Event</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Богино тайлбар</label>
            <input type="text" name="shortDesc" class="form-input" value="${escapeHtml(pkg.shortDesc || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Дэлгэрэнгүй тайлбар</label>
            <textarea name="description" class="form-textarea" rows="3">${escapeHtml(pkg.description || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Багцад багтсан (таслалаар)</label>
            <input type="text" name="includes" class="form-input" value="${escapeHtml((pkg.includes || []).join(', '))}">
          </div>
          <div class="form-group">
            <label class="form-label">Зурагны зам</label>
            <input type="text" name="image" class="form-input" value="${escapeHtml(pkg.image || '')}">
          </div>
          <div class="form-group">
            <label class="form-label" style="display:flex;align-items:center;gap:0.5rem">
              <input type="checkbox" name="featured" ${pkg.featured ? 'checked' : ''}> Онцлох
            </label>
          </div>
          <div class="flex gap-3" style="justify-content:flex-end">
            <button type="button" class="btn btn-secondary" onclick="closeModal('package-modal')">Болих</button>
            <button type="submit" class="btn btn-primary">Хадгалах</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.getElementById('package-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newPackage = {
      id: form.id.value || 'pkg-' + Date.now(),
      name: form.name.value,
      people: form.people.value,
      duration: form.duration.value,
      price: parseInt(form.price.value),
      priceUnit: form.priceUnit.value,
      type: form.type.value,
      shortDesc: form.shortDesc.value,
      description: form.description.value,
      includes: form.includes.value.split(',').map(s => s.trim()).filter(Boolean),
      image: form.image.value,
      featured: form.featured.checked
    };

    if (isEdit) {
      const idx = currentData.packages.findIndex(p => p.id === pkg.id);
      currentData.packages[idx] = newPackage;
    } else {
      currentData.packages.push(newPackage);
    }
    saveData(currentData);
    closeModal('package-modal');
    renderPackagesTable();
    renderDashboard();
    showToast('Багц хадгалагдлаа.');
  });
}

function editPackage(id) {
  openPackageModal(id);
}

function deletePackage(id) {
  if (confirm('Энэ багцыг устгах уу?')) {
    currentData.packages = currentData.packages.filter(p => p.id !== id);
    saveData(currentData);
    renderPackagesTable();
    renderDashboard();
    showToast('Багц устгагдлаа.');
  }
}

// ─── Menu ───
function renderMenuTable() {
  const container = document.getElementById('menu-table');
  container.innerHTML = `<table class="admin-table">
    <thead><tr><th>Нэр</th><th>Ангилал</th><th>Тайлбар</th><th>Үнэ</th><th></th></tr></thead>
    <tbody>${currentData.menu.items.map(item => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(getCategoryName(item.category))}</td>
        <td>${escapeHtml(item.description)}</td>
        <td>${formatPrice(item.price)}</td>
        <td class="admin-actions">
          <button class="btn btn-secondary btn-sm" onclick="editMenuItem('${item.id}')">Засах</button>
          <button class="btn btn-secondary btn-sm" onclick="deleteMenuItem('${item.id}')" style="color:#991b1b;border-color:#fecaca">Устгах</button>
        </td>
      </tr>
    `).join('')}</tbody>
  </table>`;
}

function getCategoryName(catId) {
  const cat = currentData.menu.categories.find(c => c.id === catId);
  return cat ? cat.name : catId;
}

function openMenuModal(itemId = null) {
  const item = itemId ? currentData.menu.items.find(i => i.id === itemId) : {};
  const isEdit = !!itemId;

  const modalHtml = `
    <div id="menu-modal" style="position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:1rem">
      <div class="booking-form" style="width:100%;max-width:480px">
        <h3 style="margin-bottom:1.25rem">${isEdit ? 'Хоол засах' : 'Шинэ хоол нэмэх'}</h3>
        <form id="menu-form" class="admin-form">
          <input type="hidden" name="id" value="${item.id || ''}">
          <div class="form-group">
            <label class="form-label">Нэр</label>
            <input type="text" name="name" class="form-input" value="${escapeHtml(item.name || '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Ангилал</label>
            <select name="category" class="form-select">
              ${currentData.menu.categories.map(c => `<option value="${c.id}" ${item.category === c.id ? 'selected' : ''}>${escapeHtml(c.name)}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Тайлбар</label>
            <input type="text" name="description" class="form-input" value="${escapeHtml(item.description || '')}">
          </div>
          <div class="form-group">
            <label class="form-label">Үнэ</label>
            <input type="number" name="price" class="form-input" value="${item.price || ''}" required>
          </div>
          <div class="flex gap-3" style="justify-content:flex-end">
            <button type="button" class="btn btn-secondary" onclick="closeModal('menu-modal')">Болих</button>
            <button type="submit" class="btn btn-primary">Хадгалах</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.getElementById('menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newItem = {
      id: form.id.value || 'm-' + Date.now(),
      name: form.name.value,
      category: form.category.value,
      description: form.description.value,
      price: parseInt(form.price.value)
    };

    if (isEdit) {
      const idx = currentData.menu.items.findIndex(i => i.id === item.id);
      currentData.menu.items[idx] = newItem;
    } else {
      currentData.menu.items.push(newItem);
    }
    saveData(currentData);
    closeModal('menu-modal');
    renderMenuTable();
    showToast('Меню хадгалагдлаа.');
  });
}

function editMenuItem(id) {
  openMenuModal(id);
}

function deleteMenuItem(id) {
  if (confirm('Энэ хоолыг устгах уу?')) {
    currentData.menu.items = currentData.menu.items.filter(i => i.id !== id);
    saveData(currentData);
    renderMenuTable();
    showToast('Хоол устгагдлаа.');
  }
}

// ─── Events ───
function renderEventsTable() {
  const container = document.getElementById('events-table');
  container.innerHTML = `<table class="admin-table">
    <thead><tr><th>Гарчиг</th><th>Ангилал</th><th>Тайлбар</th><th></th></tr></thead>
    <tbody>${currentData.events.map(evt => `
      <tr>
        <td>${escapeHtml(evt.title)}</td>
        <td>${escapeHtml(evt.category)}</td>
        <td>${escapeHtml(evt.description)}</td>
        <td class="admin-actions">
          <button class="btn btn-secondary btn-sm" onclick="editEvent('${evt.id}')">Засах</button>
          <button class="btn btn-secondary btn-sm" onclick="deleteEvent('${evt.id}')" style="color:#991b1b;border-color:#fecaca">Устгах</button>
        </td>
      </tr>
    `).join('')}</tbody>
  </table>`;
}

function openEventModal(eventId = null) {
  const evt = eventId ? currentData.events.find(e => e.id === eventId) : {};
  const isEdit = !!eventId;

  const modalHtml = `
    <div id="event-modal" style="position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:1rem">
      <div class="booking-form" style="width:100%;max-width:560px">
        <h3 style="margin-bottom:1.25rem">${isEdit ? 'Event засах' : 'Шинэ event нэмэх'}</h3>
        <form id="event-form" class="admin-form">
          <input type="hidden" name="id" value="${evt.id || ''}">
          <div class="form-group">
            <label class="form-label">Гарчиг</label>
            <input type="text" name="title" class="form-input" value="${escapeHtml(evt.title || '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Ангилал</label>
            <select name="category" class="form-select">
              <option value="corporate" ${evt.category === 'corporate' ? 'selected' : ''}>Байгууллагын</option>
              <option value="wedding" ${evt.category === 'wedding' ? 'selected' : ''}>Хурим</option>
              <option value="family" ${evt.category === 'family' ? 'selected' : ''}>Гэр бүлийн</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Тайлбар</label>
            <textarea name="description" class="form-textarea" rows="3">${escapeHtml(evt.description || '')}</textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Онцлог (таслалаар)</label>
            <input type="text" name="features" class="form-input" value="${escapeHtml((evt.features || []).join(', '))}">
          </div>
          <div class="form-group">
            <label class="form-label">Зурагны зам</label>
            <input type="text" name="image" class="form-input" value="${escapeHtml(evt.image || '')}">
          </div>
          <div class="flex gap-3" style="justify-content:flex-end">
            <button type="button" class="btn btn-secondary" onclick="closeModal('event-modal')">Болих</button>
            <button type="submit" class="btn btn-primary">Хадгалах</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newEvent = {
      id: form.id.value || 'evt-' + Date.now(),
      title: form.title.value,
      category: form.category.value,
      description: form.description.value,
      features: form.features.value.split(',').map(s => s.trim()).filter(Boolean),
      image: form.image.value
    };

    if (isEdit) {
      const idx = currentData.events.findIndex(e => e.id === evt.id);
      currentData.events[idx] = newEvent;
    } else {
      currentData.events.push(newEvent);
    }
    saveData(currentData);
    closeModal('event-modal');
    renderEventsTable();
    showToast('Event хадгалагдлаа.');
  });
}

function editEvent(id) {
  openEventModal(id);
}

function deleteEvent(id) {
  if (confirm('Энэ event-ийг устгах уу?')) {
    currentData.events = currentData.events.filter(e => e.id !== id);
    saveData(currentData);
    renderEventsTable();
    showToast('Event устгагдлаа.');
  }
}

// ─── Gallery ───
function renderGalleryTable() {
  const container = document.getElementById('gallery-table');
  container.innerHTML = `<table class="admin-table">
    <thead><tr><th>Зураг</th><th>Гарчиг</th><th>Ангилал</th><th></th></tr></thead>
    <tbody>${currentData.gallery.map(img => `
      <tr>
        <td><img src="${escapeHtml(img.src)}" alt="" style="width:80px;height:50px;object-fit:cover;border-radius:var(--radius-sm)"></td>
        <td>${escapeHtml(img.title)}</td>
        <td>${escapeHtml(img.category)}</td>
        <td class="admin-actions">
          <button class="btn btn-secondary btn-sm" onclick="editGalleryItem('${img.id}')">Засах</button>
          <button class="btn btn-secondary btn-sm" onclick="deleteGalleryItem('${img.id}')" style="color:#991b1b;border-color:#fecaca">Устгах</button>
        </td>
      </tr>
    `).join('')}</tbody>
  </table>`;
}

function openGalleryModal(itemId = null) {
  const img = itemId ? currentData.gallery.find(g => g.id === itemId) : {};
  const isEdit = !!itemId;

  const modalHtml = `
    <div id="gallery-modal" style="position:fixed;inset:0;z-index:3000;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;padding:1rem">
      <div class="booking-form" style="width:100%;max-width:480px">
        <h3 style="margin-bottom:1.25rem">${isEdit ? 'Зураг засах' : 'Шинэ зураг нэмэх'}</h3>
        <form id="gallery-form" class="admin-form">
          <input type="hidden" name="id" value="${img.id || ''}">
          <div class="form-group">
            <label class="form-label">Зурагны зам</label>
            <input type="text" name="src" class="form-input" value="${escapeHtml(img.src || '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Гарчиг</label>
            <input type="text" name="title" class="form-input" value="${escapeHtml(img.title || '')}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Ангилал</label>
            <select name="category" class="form-select">
              <option value="resort" ${img.category === 'resort' ? 'selected' : ''}>Амралтын газар</option>
              <option value="nature" ${img.category === 'nature' ? 'selected' : ''}>Байгаль</option>
              <option value="rooms" ${img.category === 'rooms' ? 'selected' : ''}>Өрөө</option>
              <option value="food" ${img.category === 'food' ? 'selected' : ''}>Хоол</option>
              <option value="events" ${img.category === 'events' ? 'selected' : ''}>Event</option>
              <option value="services" ${img.category === 'services' ? 'selected' : ''}>Үйлчилгээ</option>
            </select>
          </div>
          <div class="flex gap-3" style="justify-content:flex-end">
            <button type="button" class="btn btn-secondary" onclick="closeModal('gallery-modal')">Болих</button>
            <button type="submit" class="btn btn-primary">Хадгалах</button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  document.getElementById('gallery-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const newImg = {
      id: form.id.value || 'g-' + Date.now(),
      src: form.src.value,
      title: form.title.value,
      category: form.category.value
    };

    if (isEdit) {
      const idx = currentData.gallery.findIndex(g => g.id === img.id);
      currentData.gallery[idx] = newImg;
    } else {
      currentData.gallery.push(newImg);
    }
    saveData(currentData);
    closeModal('gallery-modal');
    renderGalleryTable();
    showToast('Зураг хадгалагдлаа.');
  });
}

function editGalleryItem(id) {
  openGalleryModal(id);
}

function deleteGalleryItem(id) {
  if (confirm('Энэ зургийг устгах уу?')) {
    currentData.gallery = currentData.gallery.filter(g => g.id !== id);
    saveData(currentData);
    renderGalleryTable();
    showToast('Зураг устгагдлаа.');
  }
}

// ─── Settings ───
function initSettingsForm() {
  const form = document.getElementById('settings-form');
  if (!form) return;

  const s = currentData.settings;
  form.siteName.value = s.siteName;
  form.phone.value = s.phone;
  form.email.value = s.email;
  form.businessHours.value = s.businessHours;
  form.address.value = s.address;
  form.facebook.value = s.facebook;
  form.instagram.value = s.instagram;
  form.tagline.value = s.tagline;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    currentData.settings = {
      ...s,
      siteName: form.siteName.value,
      phone: form.phone.value,
      email: form.email.value,
      businessHours: form.businessHours.value,
      address: form.address.value,
      facebook: form.facebook.value,
      instagram: form.instagram.value,
      tagline: form.tagline.value
    };
    saveData(currentData);
    showToast('Тохиргоо хадгалагдлаа.');
  });
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.remove();
}
