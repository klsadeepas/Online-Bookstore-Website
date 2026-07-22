/* ============================================================
   BookNest — Search (search.js)
   Live nav suggestions + query helpers. Title/Author/Category/
   Publisher/Language. Instant, client-side only.
   ============================================================ */

function searchBooks(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return BOOKS.filter(b =>
    b.title.toLowerCase().includes(q) ||
    b.author.toLowerCase().includes(q) ||
    b.category.toLowerCase().includes(q) ||
    b.publisher.toLowerCase().includes(q) ||
    b.language.toLowerCase().includes(q)
  );
}

function initSearch() {
  const input = document.getElementById('navSearch');
  const box = document.getElementById('suggestions');
  if (!input || !box) return;

  const render = () => {
    const results = searchBooks(input.value).slice(0, 6);
    if (!results.length) { box.classList.add('hidden'); return; }
    box.innerHTML = results.map(b => `
      <a href="/details.html?id=${b.id}">
        <span class="s-cover" style="background:${coverGradient(b.category)}"></span>
        <span><span class="s-title">${b.title}</span><br><span class="s-auth">${b.author} · ${b.category}</span></span>
      </a>`).join('') +
      `<a href="/books.html?q=${encodeURIComponent(input.value)}" style="justify-content:center;color:var(--primary);font-weight:600">See all results →</a>`;
    box.classList.remove('hidden');
  };

  input.addEventListener('input', render);
  input.addEventListener('focus', () => { if (input.value) render(); });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && input.value.trim()) location.href = `/books.html?q=${encodeURIComponent(input.value)}`;
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) box.classList.add('hidden');
  });
}
