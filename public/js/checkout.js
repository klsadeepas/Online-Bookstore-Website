/* ============================================================
   BookNest — Checkout (checkout.js)
   Order summary, full form validation, place order, save order.
   ============================================================ */

function renderCheckoutSummary() {
  const cart = getCart();
  const box = document.getElementById('checkoutSummary');
  if (!box) return;
  if (!cart.length) { location.href = '/cart.html'; return; }
  const t = computeTotals();
  box.innerHTML = `
    <h3 style="font-family:var(--font);margin-bottom:14px">Your Order</h3>
    <div style="max-height:280px;overflow:auto;margin-bottom:14px">
    ${cart.map(i => { const b = getBook(i.id); return `<div style="display:flex;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
      <div style="width:44px;flex-shrink:0">${coverHTML(b)}</div>
      <div style="flex:1"><div style="font-weight:600;font-size:0.9rem">${b.title}</div><small style="color:var(--text-light)">Qty ${i.qty}</small></div>
      <div style="font-weight:700">${money(b.price*i.qty)}</div></div>`; }).join('')}
    </div>
    <div class="row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    ${t.discount ? `<div class="row" style="color:#22c55e"><span>Discount</span><span>−${money(t.discount)}</span></div>` : ''}
    <div class="row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : 'FREE'}</span></div>
    <div class="row"><span>Tax</span><span>${money(t.tax)}</span></div>
    <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>`;
}

const validators = {
  fullName: v => v.trim().length >= 3 || 'Enter your full name',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address',
  phone: v => /^[0-9+\-\s()]{7,}$/.test(v) || 'Enter a valid phone number',
  address: v => v.trim().length >= 5 || 'Enter your street address',
  city: v => v.trim().length >= 2 || 'Enter your city',
  postal: v => /^[A-Za-z0-9\s\-]{3,10}$/.test(v) || 'Enter a valid postal code',
  country: v => v.trim().length >= 2 || 'Select your country'
};

function validateField(input) {
  const rule = validators[input.name];
  if (!rule) return true;
  const res = rule(input.value);
  const field = input.closest('.field');
  if (res === true) { field.classList.remove('invalid'); return true; }
  field.classList.add('invalid');
  field.querySelector('.err').textContent = res;
  return false;
}

function initCheckout() {
  renderCheckoutSummary();
  const form = document.getElementById('checkoutForm');
  if (!form) return;

  form.querySelectorAll('input[name], select[name]').forEach(inp => {
    inp.addEventListener('blur', () => validateField(inp));
    inp.addEventListener('input', () => { if (inp.closest('.field').classList.contains('invalid')) validateField(inp); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    form.querySelectorAll('input[name], select[name]').forEach(inp => { if (!validateField(inp)) ok = false; });
    if (!ok) { toast('Please fix the highlighted fields', 'error'); return; }

    const t = computeTotals();
    const order = {
      id: 'BN' + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      items: getCart().map(i => { const b = getBook(i.id); return { title: b.title, author: b.author, qty: i.qty, price: b.price }; }),
      totals: t,
      customer: {
        name: form.fullName.value, email: form.email.value, phone: form.phone.value,
        address: form.address.value, city: form.city.value, postal: form.postal.value, country: form.country.value
      },
      payment: form.querySelector('input[name=payment]:checked').value
    };

    // Save + clear cart
    const orders = Store.get('bn_orders', []); orders.push(order); Store.set('bn_orders', orders);
    Store.set('bn_last_order', order);
    Store.set('bn_cart', []); Store.set('bn_coupon', null);

    // Loading spinner then redirect
    const btn = form.querySelector('button[type=submit]');
    btn.innerHTML = '<span class="spinner" style="width:20px;height:20px;margin:0;border-width:3px"></span> Placing order...';
    btn.disabled = true;
    setTimeout(() => location.href = '/success.html', 900);
  });
}

document.addEventListener('DOMContentLoaded', initCheckout);
