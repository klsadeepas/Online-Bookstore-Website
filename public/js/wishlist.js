/* ============================================================
   BookNest — Wishlist Page (wishlist.js)
   Render saved books, remove, move to cart.
   ============================================================ */

function renderWishlistPage() {
  const wrap = document.getElementById('wishGrid');
  const root = document.getElementById('wishRoot');
  if (!wrap) return;
  const ids = getWishlist();
  const books = ids.map(getBook).filter(Boolean);

  if (!books.length) {
    root.innerHTML = `<div class="empty-state"><div class="ico">♡</div><h2>Your wishlist is empty</h2><p>Save books you love to find them easily later.</p><a class="btn btn-primary" href="/books.html" style="margin-top:16px">Discover Books</a></div>`;
    return;
  }

  root.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;flex-wrap:wrap;gap:12px">
      <span style="color:var(--text-light);font-weight:600">${books.length} saved book${books.length!==1?'s':''}</span>
      <button class="btn btn-primary btn-sm" onclick="moveAllToCart()">Move All to Cart</button>
    </div><div class="books-grid" id="wishGrid"></div>`;
  renderBooks(books, 'wishGrid');
}

function moveToCart(id) { addToCart(id); toggleWishlist(id); }
function moveAllToCart() {
  const ids = [...getWishlist()];
  ids.forEach(id => addToCart(id));
  Store.set('bn_wish', []); updateBadges();
  renderWishlistPage();
  toast('All books moved to cart', 'success');
}

document.addEventListener('DOMContentLoaded', renderWishlistPage);
