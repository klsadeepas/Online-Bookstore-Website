/* ============================================================
   BookNest — Filters, Sort, Search Results, Pagination (filter.js)
   Powers books.html. Reads URL params ?q= & ?category=
   ============================================================ */

const PER_PAGE = 8;
const state = { q: '', categories: [], maxPrice: 70, minRating: 0, languages: [], availability: 'all', sort: 'popular', page: 1 };

function buildFilters() {
  const params = new URLSearchParams(location.search);
  state.q = params.get('q') || '';
  const preCat = params.get('category');
  if (preCat) state.categories = [preCat];

  // Category checkboxes
  const catBox = document.getElementById('fCategories');
  catBox.innerHTML = CATEGORIES.map(c => `<label><input type="checkbox" value="${c.name}" ${state.categories.includes(c.name) ? 'checked' : ''}> ${c.icon} ${c.name}</label>`).join('');
  catBox.querySelectorAll('input').forEach(i => i.onchange = () => {
    state.categories = [...catBox.querySelectorAll('input:checked')].map(x => x.value);
    state.page = 1; apply();
  });

  // Languages
  const langs = [...new Set(BOOKS.map(b => b.language))];
  const langBox = document.getElementById('fLanguages');
  langBox.innerHTML = langs.map(l => `<label><input type="checkbox" value="${l}"> ${l}</label>`).join('');
  langBox.querySelectorAll('input').forEach(i => i.onchange = () => {
    state.languages = [...langBox.querySelectorAll('input:checked')].map(x => x.value);
    state.page = 1; apply();
  });

  // Price range
  const price = document.getElementById('fPrice');
  const priceVal = document.getElementById('priceVal');
  price.oninput = () => { state.maxPrice = +price.value; priceVal.textContent = money(price.value); state.page = 1; apply(); };

  // Rating
  document.querySelectorAll('input[name=fRating]').forEach(r => r.onchange = () => { state.minRating = +r.value; state.page = 1; apply(); });

  // Availability
  document.querySelectorAll('input[name=fStock]').forEach(r => r.onchange = () => { state.availability = r.value; state.page = 1; apply(); });

  // Sort
  document.getElementById('sortBy').onchange = (e) => { state.sort = e.target.value; state.page = 1; apply(); };

  // Search box on page
  const sb = document.getElementById('shopSearch');
  if (sb) { sb.value = state.q; sb.oninput = () => { state.q = sb.value; state.page = 1; apply(); }; }

  // Reset
  document.getElementById('resetFilters').onclick = () => {
    Object.assign(state, { q: '', categories: [], maxPrice: 70, minRating: 0, languages: [], availability: 'all', sort: 'popular', page: 1 });
    history.replaceState({}, '', '/books.html');
    buildFilters(); apply();
  };
}

function applyFilters() {
  let list = BOOKS.slice();
  if (state.q) { const q = state.q.toLowerCase(); list = list.filter(b => [b.title,b.author,b.category,b.publisher,b.language].some(f => f.toLowerCase().includes(q))); }
  if (state.categories.length) list = list.filter(b => state.categories.includes(b.category));
  if (state.languages.length) list = list.filter(b => state.languages.includes(b.language));
  list = list.filter(b => b.price <= state.maxPrice);
  if (state.minRating) list = list.filter(b => b.rating >= state.minRating);
  if (state.availability === 'in') list = list.filter(b => b.stock > 0);
  if (state.availability === 'low') list = list.filter(b => b.stock > 0 && b.stock <= 15);

  switch (state.sort) {
    case 'newest': list.sort((a,b)=>new Date(b.published)-new Date(a.published)); break;
    case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
    case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
    case 'rating': list.sort((a,b)=>b.rating-a.rating); break;
    default: list.sort((a,b)=>b.reviews-a.reviews);
  }
  return list;
}

function apply() {
  const list = applyFilters();
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  state.page = Math.min(state.page, pages);
  const slice = list.slice((state.page-1)*PER_PAGE, state.page*PER_PAGE);

  document.getElementById('resultCount').textContent = `${total} book${total!==1?'s':''} found`;
  const heading = document.getElementById('shopHeading');
  if (heading) heading.textContent = state.q ? `Results for “${state.q}”` : (state.categories.length === 1 ? state.categories[0] : 'All Books');

  renderBooks(slice, 'books');

  // Pagination
  const pag = document.getElementById('pagination');
  if (pages <= 1) { pag.innerHTML = ''; }
  else {
    let html = `<button ${state.page===1?'disabled':''} onclick="gotoPage(${state.page-1})">‹</button>`;
    for (let i=1;i<=pages;i++) html += `<button class="${i===state.page?'active':''}" onclick="gotoPage(${i})">${i}</button>`;
    html += `<button ${state.page===pages?'disabled':''} onclick="gotoPage(${state.page+1})">›</button>`;
    pag.innerHTML = html;
  }
}

function gotoPage(p) { state.page = p; apply(); window.scrollTo({ top: document.getElementById('shopTop').offsetTop - 90, behavior: 'smooth' }); }

document.addEventListener('DOMContentLoaded', () => { buildFilters(); apply(); });
