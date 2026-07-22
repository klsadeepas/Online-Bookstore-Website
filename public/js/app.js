/* ============================================================
   BookNest — Core App (app.js)
   Shared: storage, cart, wishlist, nav/footer, theme, toast,
   scroll reveal, counters, back-to-top, ripple. LocalStorage only.
   ============================================================ */

/* ---------- Storage helpers ---------- */
const Store = {
  get(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};
const KEYS = { cart: 'bn_cart', wish: 'bn_wish', recent: 'bn_recent', theme: 'bn_theme', orders: 'bn_orders', popup: 'bn_popup' };

/* ---------- Cart (global, used on every page) ---------- */
function getCart() { return Store.get(KEYS.cart, []); }
function setCart(c) { Store.set(KEYS.cart, c); updateBadges(); }
function cartCount() { return getCart().reduce((n, i) => n + i.qty, 0); }
function addToCart(id, qty = 1) {
  const cart = getCart();
  const item = cart.find(i => i.id === Number(id));
  if (item) item.qty += qty; else cart.push({ id: Number(id), qty });
  setCart(cart);
  const b = getBook(id);
  toast(`\"${b.title}\" added to cart`, 'success');
  bumpBadge('cart-badge');
}
function removeFromCart(id) { setCart(getCart().filter(i => i.id !== Number(id))); }
function updateQty(id, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === Number(id));
  if (item) { item.qty = Math.max(1, qty); setCart(cart); }
}
function cartSubtotal() { return getCart().reduce((s, i) => s + getBook(i.id).price * i.qty, 0); }

/* ---------- Wishlist ---------- */
function getWishlist() { return Store.get(KEYS.wish, []); }
function isWished(id) { return getWishlist().includes(Number(id)); }
function toggleWishlist(id, btn) {
  id = Number(id);
  let list = getWishlist();
  const b = getBook(id);
  if (list.includes(id)) { list = list.filter(x => x !== id); toast(`Removed from wishlist`, 'warn'); }
  else { list.push(id); toast(`\"${b.title}\" saved to wishlist`, 'success'); bumpBadge('wish-badge'); }
  Store.set(KEYS.wish, list);
  updateBadges();
  if (btn) btn.classList.toggle('active', list.includes(id));
  document.querySelectorAll(`.wish-btn[onclick*="toggleWishlist(${id},"]`).forEach(el => el.classList.toggle('active', list.includes(id)));
  if (typeof renderWishlistPage === 'function') renderWishlistPage();
}

/* ---------- Recently viewed ---------- */
function addRecent(id) {
  id = Number(id);
  let r = Store.get(KEYS.recent, []).filter(x => x !== id);
  r.unshift(id); r = r.slice(0, 8);
  Store.set(KEYS.recent, r);
}
function getRecent() { return Store.get(KEYS.recent, []).map(getBook).filter(Boolean); }

/* ---------- Badges ---------- */
function updateBadges() {
  const cc = cartCount(), wc = getWishlist().length;
  document.querySelectorAll('#cart-badge').forEach(b => { b.textContent = cc; b.style.display = cc ? 'grid' : 'none'; });
  document.querySelectorAll('#wish-badge').forEach(b => { b.textContent = wc; b.style.display = wc ? 'grid' : 'none'; });
}
function bumpBadge(id) { const b = document.getElementById(id); if (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } }

/* ---------- Theme ---------- */
function initTheme() {
  const saved = Store.get(KEYS.theme, 'light');
  document.documentElement.setAttribute('data-theme', saved);
}
function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', cur);
  Store.set(KEYS.theme, cur);
  updateThemeIcon();
}
function updateThemeIcon() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.querySelectorAll('.theme-ico').forEach(i => i.textContent = dark ? '☀️' : '🌙');
}

/* ---------- Toast ---------- */
function toast(msg, type = 'success') {
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toast-wrap'; document.body.appendChild(wrap); }
  const icons = { success: '✅', error: '⛔', warn: '⚠️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateX(40px)'; setTimeout(() => t.remove(), 300); }, 2600);
}

/* ---------- Nav + Footer injection (DRY across pages) ---------- */
const NAV_LINKS = [
  { href: '/index.html', label: 'Home' },
  { href: '/books.html', label: 'Books' },
  { href: '/categories.html', label: 'Categories' },
  { href: '/about.html', label: 'About' },
  { href: '/contact.html', label: 'Contact' },
  { href: '/faq.html', label: 'FAQ' }
];
function renderNav() {
  const mount = document.getElementById('nav-placeholder');
  if (!mount) return;
  const path = location.pathname.endsWith('/') ? '/index.html' : location.pathname;
  const links = NAV_LINKS.map(l => `<a href="${l.href}" class="${path === l.href ? 'active' : ''}">${l.label}</a>`).join('');
  mount.innerHTML = `<nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a class="logo" href="/index.html"><span class="logo-mark">📚</span>Book<span>Nest</span></a>
      <div class="nav-links" id="navLinks">${links}</div>
      <div class="nav-search">
        <span class="search-ico">🔍</span>
        <input type="text" id="navSearch" placeholder="Search books, authors..." autocomplete="off" aria-label="Search">
        <div class="suggestions hidden" id="suggestions"></div>
      </div>
      <div class="nav-actions">
        <button class="icon-btn" onclick="toggleTheme()" aria-label="Toggle dark mode"><span class="theme-ico">🌙</span></button>
        <a class="icon-btn" href="/wishlist.html" aria-label="Wishlist">♡<span class="badge" id="wish-badge">0</span></a>
        <a class="icon-btn" href="/cart.html" aria-label="Cart">🛒<span class="badge" id="cart-badge">0</span></a>
        <button class="icon-btn hamburger" onclick="document.getElementById('navLinks').classList.toggle('mobile-open')" aria-label="Menu">☰</button>
      </div>
    </div>
  </nav>`;
}
function renderFooter() {
  const mount = document.getElementById('footer-placeholder');
  if (!mount) return;
  const cats = CATEGORIES.slice(0, 6).map(c => `<a href="/books.html?category=${encodeURIComponent(c.name)}">${c.name}</a>`).join('');
  mount.innerHTML = `<footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div>
          <a class="logo" href="/index.html"><span class="logo-mark">📚</span>BookNest</a>
          <p style="color:#94a3b8;max-width:280px">Your cozy corner of the internet for discovering, collecting and loving great books.</p>
          <div class="socials">
            <a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Twitter">𝕏</a>
            <a href="#" aria-label="Instagram">◉</a><a href="#" aria-label="YouTube">▶</a>
          </div>
        </div>
        <div><h5>Quick Links</h5>
          <a href="/index.html">Home</a><a href="/books.html">All Books</a>
          <a href="/wishlist.html">Wishlist</a><a href="/cart.html">Cart</a><a href="/about.html">About Us</a>
        </div>
        <div><h5>Categories</h5>${cats}</div>
        <div><h5>Customer Service</h5>
          <a href="/contact.html">Contact</a><a href="/faq.html">FAQ</a>
          <a href="/faq.html">Shipping</a><a href="/faq.html">Returns</a><a href="/faq.html">Track Order</a>
        </div>
      </div>
      <div class="footer-bottom">© ${new Date().getFullYear()} BookNest — Online Bookstore. Crafted with ❤ for book lovers.</div>
    </div>
  </footer>`;
}

/* ---------- Scroll reveal ---------- */
let _revealObserver;
function observeReveal() {
  if (!_revealObserver) {
    _revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); _revealObserver.unobserve(e.target); } });
    }, { threshold: 0.12 });
  }
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => _revealObserver.observe(el));
}

/* ---------- Counter animation ---------- */
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.dataset.count; const dur = 1400; const start = performance.now();
    const suffix = el.dataset.suffix || '';
    function step(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.floor(p * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    const io = new IntersectionObserver((ents) => { if (ents[0].isIntersecting) { requestAnimationFrame(step); io.disconnect(); } });
    io.observe(el);
  });
}

/* ---------- Back to top + progress + navbar shadow ---------- */
function initScrollUI() {
  const bt = document.createElement('button');
  bt.className = 'back-top'; bt.innerHTML = '↑'; bt.setAttribute('aria-label', 'Back to top');
  bt.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(bt);
  const pb = document.createElement('div'); pb.className = 'progress-bar'; document.body.appendChild(pb);
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
    bt.classList.toggle('show', window.scrollY > 400);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    pb.style.width = (window.scrollY / h * 100) + '%';
  });
}

/* ---------- Ripple effect on buttons ---------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const r = document.createElement('span'); r.className = 'ripple';
  const rect = btn.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
  r.style.width = r.style.height = size + 'px';
  r.style.left = (e.clientX - rect.left - size / 2) + 'px';
  r.style.top = (e.clientY - rect.top - size / 2) + 'px';
  btn.appendChild(r); setTimeout(() => r.remove(), 600);
});

/* ---------- Newsletter popup (once per session) ---------- */
function maybeNewsletterPopup() {
  if (sessionStorage.getItem(KEYS.popup)) return;
  setTimeout(() => {
    if (sessionStorage.getItem(KEYS.popup)) return;
    const o = document.createElement('div');
    o.className = 'modal-overlay';
    o.innerHTML = `<div class="modal" style="max-width:440px;text-align:center">
      <button class="modal-close" aria-label="Close">✕</button>
      <div style="font-size:2.6rem">📩</div>
      <h2 style="margin:10px 0">Get 15% Off</h2>
      <p style="color:var(--text-light);margin-bottom:18px">Join the BookNest newsletter for exclusive deals and reading picks.</p>
      <form class="nl-pop"><input class="field" style="width:100%;padding:12px 14px;border-radius:50px;border:1px solid var(--border);background:var(--surface);color:var(--text-dark);margin-bottom:12px" type="email" placeholder="Your email" required>
      <button class="btn btn-primary btn-block" type="submit">Claim Offer</button></form>
    </div>`;
    document.body.appendChild(o);
    requestAnimationFrame(() => o.classList.add('open'));
    const close = () => { o.classList.remove('open'); sessionStorage.setItem(KEYS.popup, '1'); setTimeout(() => o.remove(), 300); };
    o.querySelector('.modal-close').onclick = close;
    o.onclick = (e) => { if (e.target === o) close(); };
    o.querySelector('.nl-pop').onsubmit = (e) => { e.preventDefault(); close(); toast('Coupon WELCOME15 unlocked!', 'success'); };
  }, 6000);
}

/* ---------- Generic newsletter form handler ---------- */
function bindNewsletter() {
  document.querySelectorAll('form[data-newsletter]').forEach(f => {
    f.onsubmit = (e) => { e.preventDefault(); f.reset(); toast('Subscribed! Check your inbox 🎉', 'success'); };
  });
}

/* ---------- Page loader ---------- */
function hideLoader() {
  const l = document.querySelector('.page-loader');
  if (l) setTimeout(() => l.classList.add('hide'), 350);
}

/* ---------- Boot ---------- */
initTheme();
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderFooter();
  updateThemeIcon();
  updateBadges();
  initScrollUI();
  observeReveal();
  animateCounters();
  bindNewsletter();
  hideLoader();
  if (typeof initSearch === 'function') initSearch();
});
window.addEventListener('load', () => { observeReveal(); });
