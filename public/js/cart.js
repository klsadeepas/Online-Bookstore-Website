/* ============================================================
   BookNest — Cart Page (cart.js)
   Render cart, qty control, coupons, shipping, tax, totals.
   ============================================================ */

const COUPONS = {
  WELCOME15: { type: 'percent', value: 15, label: '15% off' },
  BOOK10:    { type: 'flat', value: 10, label: '$10 off' },
  FREESHIP:  { type: 'ship', value: 0, label: 'Free shipping' }
};
const SHIP_FLAT = 4.99, FREE_SHIP_MIN = 35, TAX_RATE = 0.08;

function getCoupon() { return Store.get('bn_coupon', null); }
function setCoupon(c) { Store.set('bn_coupon', c); }

function computeTotals() {
  const subtotal = cartSubtotal();
  const coupon = getCoupon();
  let discount = 0, freeShip = false;
  if (coupon && COUPONS[coupon]) {
    const c = COUPONS[coupon];
    if (c.type === 'percent') discount = subtotal * c.value / 100;
    else if (c.type === 'flat') discount = Math.min(c.value, subtotal);
    else if (c.type === 'ship') freeShip = true;
  }
  const afterDisc = Math.max(0, subtotal - discount);
  let shipping = subtotal === 0 || afterDisc >= FREE_SHIP_MIN || freeShip ? 0 : SHIP_FLAT;
  const tax = afterDisc * TAX_RATE;
  const total = afterDisc + shipping + tax;
  return { subtotal, discount, shipping, tax, total, coupon };
}

function renderCartPage() {
  const cart = getCart();
  const wrap = document.getElementById('cartItems');
  const summary = document.getElementById('cartSummary');
  const layout = document.getElementById('cartLayout');
  if (!wrap) return;

  if (!cart.length) {
    layout.innerHTML = `<div class="empty-state" style="grid-column:1/-1"><div class="ico">🛒</div><h2>Your cart is empty</h2><p>Looks like you haven’t added any books yet.</p><a class="btn btn-primary" href="/books.html" style="margin-top:16px">Start Shopping</a></div>`;
    return;
  }

  wrap.innerHTML = cart.map(item => {
    const b = getBook(item.id);
    return `<div class="cart-item">
      <a href="/details.html?id=${b.id}">${coverHTML(b)}</a>
      <div>
        <a href="/details.html?id=${b.id}"><div class="ci-title">${b.title}</div></a>
        <div class="ci-author">by ${b.author} · ${b.category}</div>
        <div style="margin-top:10px"><div class="qty-selector">
          <button onclick="cartQty(${b.id},-1)">−</button><input value="${item.qty}" readonly><button onclick="cartQty(${b.id},1)">+</button>
        </div></div>
        <a class="remove" onclick="cartRemove(${b.id})">🗑 Remove</a>
      </div>
      <div class="ci-price-col" style="text-align:right">
        <div class="price">${money(b.price * item.qty)}</div>
        <div class="old-price">${money(b.oldPrice * item.qty)}</div>
      </div>
    </div>`;
  }).join('');

  const t = computeTotals();
  summary.innerHTML = `
    <h3 style="font-family:var(--font);margin-bottom:14px">Order Summary</h3>
    <div class="coupon-box">
      <input id="couponInput" placeholder="Coupon code" value="${t.coupon || ''}">
      <button class="btn btn-ghost btn-sm" onclick="applyCoupon()">Apply</button>
    </div>
    <small style="color:var(--text-light)">Try: WELCOME15, BOOK10, FREESHIP</small>
    <div style="margin-top:16px">
      <div class="row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      ${t.discount ? `<div class="row" style="color:#22c55e"><span>Discount (${t.coupon})</span><span>−${money(t.discount)}</span></div>` : ''}
      <div class="row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : 'FREE'}</span></div>
      <div class="row"><span>Tax (8%)</span><span>${money(t.tax)}</span></div>
      <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
    </div>
    <a class="btn btn-primary btn-block" href="/checkout.html" style="margin-top:18px">Proceed to Checkout →</a>
    <a class="btn btn-ghost btn-block" href="/books.html" style="margin-top:10px">Continue Shopping</a>`;
}

function cartQty(id, d) { const item = getCart().find(i=>i.id===id); if (item) { updateQty(id, item.qty + d); renderCartPage(); } }
function cartRemove(id) { removeFromCart(id); renderCartPage(); toast('Removed from cart', 'warn'); }
function applyCoupon() {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  if (!code) return;
  if (COUPONS[code]) { setCoupon(code); toast(`Coupon applied: ${COUPONS[code].label}`, 'success'); }
  else { setCoupon(null); toast('Invalid coupon code', 'error'); }
  renderCartPage();
}

document.addEventListener('DOMContentLoaded', renderCartPage);
