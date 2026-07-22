/* ============================================================
   BookNest — Book Data + Render Helpers (books.js)
   30 books, categories, cover/card generators. No backend.
   ============================================================ */

/* ---------- Categories ---------- */
const CATEGORIES = [
  { name: 'Programming', icon: '💻', grad: 'linear-gradient(135deg,#2563eb,#3b82f6)' },
  { name: 'Web Development', icon: '🌐', grad: 'linear-gradient(135deg,#0ea5e9,#38bdf8)' },
  { name: 'Data Science', icon: '📊', grad: 'linear-gradient(135deg,#7c3aed,#a855f7)' },
  { name: 'Artificial Intelligence', icon: '🤖', grad: 'linear-gradient(135deg,#4f46e5,#6366f1)' },
  { name: 'Business', icon: '💼', grad: 'linear-gradient(135deg,#0f766e,#14b8a6)' },
  { name: 'Finance', icon: '💰', grad: 'linear-gradient(135deg,#059669,#10b981)' },
  { name: 'Self Help', icon: '🌱', grad: 'linear-gradient(135deg,#d97706,#f59e0b)' },
  { name: 'Psychology', icon: '🧠', grad: 'linear-gradient(135deg,#db2777,#ec4899)' },
  { name: 'History', icon: '🏛️', grad: 'linear-gradient(135deg,#92400e,#b45309)' },
  { name: 'Science', icon: '🔬', grad: 'linear-gradient(135deg,#0891b2,#06b6d4)' },
  { name: 'Children', icon: '🧸', grad: 'linear-gradient(135deg,#f43f5e,#fb7185)' },
  { name: 'Novels', icon: '📖', grad: 'linear-gradient(135deg,#7c2d12,#c2410c)' },
  { name: 'Comics', icon: '💥', grad: 'linear-gradient(135deg,#9333ea,#c026d3)' },
  { name: 'Education', icon: '🎓', grad: 'linear-gradient(135deg,#1d4ed8,#2563eb)' },
  { name: 'Technology', icon: '⚙️', grad: 'linear-gradient(135deg,#334155,#475569)' }
];

/* palette of cover gradients keyed by category for cohesive look */
function coverGradient(cat) {
  const c = CATEGORIES.find(x => x.name === cat);
  return c ? c.grad : 'linear-gradient(135deg,#3b82f6,#2563eb)';
}

/* ---------- Books (30) ---------- */
const BOOKS = [
  { id:1, title:'Clean Code Mastery', author:'Ethan Rowe', category:'Programming', price:34.99, oldPrice:49.99, rating:4.8, reviews:1204, stock:23, publisher:'DevPress', language:'English', pages:412, isbn:'978-1-01-000001', published:'2022-03-14', description:'A hands-on guide to writing readable, maintainable and elegant code that scales with your team and your product.' },
  { id:2, title:'The Pragmatic Coder', author:'Ethan Rowe', category:'Programming', price:29.99, oldPrice:39.99, rating:4.6, reviews:842, stock:15, publisher:'DevPress', language:'English', pages:360, isbn:'978-1-01-000002', published:'2021-09-02', description:'Timeless principles and practical habits for the modern software craftsperson.' },
  { id:3, title:'JavaScript Beyond Basics', author:'Mia Chen', category:'Web Development', price:27.50, oldPrice:36.00, rating:4.7, reviews:990, stock:31, publisher:'WebForge', language:'English', pages:388, isbn:'978-1-02-000003', published:'2023-01-20', description:'Master closures, async patterns, modules and the modern browser platform with real projects.' },
  { id:4, title:'Fullstack Frontiers', author:'Mia Chen', category:'Web Development', price:39.99, oldPrice:54.99, rating:4.5, reviews:610, stock:8, publisher:'WebForge', language:'English', pages:520, isbn:'978-1-02-000004', published:'2022-11-11', description:'Build production-grade apps end to end — from database to responsive UI.' },
  { id:5, title:'CSS Alchemy', author:'Lucas Meyer', category:'Web Development', price:24.00, oldPrice:32.00, rating:4.4, reviews:455, stock:40, publisher:'WebForge', language:'English', pages:300, isbn:'978-1-02-000005', published:'2023-06-05', description:'Turn plain markup into stunning, responsive interfaces with modern CSS techniques.' },
  { id:6, title:'Data Science Handbook', author:'Priya Nair', category:'Data Science', price:44.99, oldPrice:59.99, rating:4.9, reviews:1580, stock:12, publisher:'InsightBooks', language:'English', pages:640, isbn:'978-1-03-000006', published:'2021-05-18', description:'From data wrangling to visualization and modeling — a complete practical reference.' },
  { id:7, title:'Statistics for Analysts', author:'Priya Nair', category:'Data Science', price:32.00, oldPrice:42.00, rating:4.3, reviews:377, stock:19, publisher:'InsightBooks', language:'English', pages:410, isbn:'978-1-03-000007', published:'2020-08-30', description:'Understand the numbers behind the decisions with clear, applied statistics.' },
  { id:8, title:'Deep Learning Unlocked', author:'Samuel Okafor', category:'Artificial Intelligence', price:49.99, oldPrice:69.99, rating:4.8, reviews:1320, stock:6, publisher:'NeuralPress', language:'English', pages:580, isbn:'978-1-04-000008', published:'2023-02-27', description:'Neural networks explained intuitively, then applied to real-world problems.' },
  { id:9, title:'The AI Revolution', author:'Samuel Okafor', category:'Artificial Intelligence', price:36.50, oldPrice:45.00, rating:4.6, reviews:720, stock:22, publisher:'NeuralPress', language:'English', pages:340, isbn:'978-1-04-000009', published:'2024-01-09', description:'How intelligent machines are reshaping industries, work and society.' },
  { id:10, title:'Machine Learning Recipes', author:'Aisha Khan', category:'Artificial Intelligence', price:41.00, oldPrice:52.00, rating:4.5, reviews:512, stock:17, publisher:'NeuralPress', language:'English', pages:460, isbn:'978-1-04-000010', published:'2022-07-14', description:'Practical, copy-and-adapt recipes for common ML tasks and pipelines.' },
  { id:11, title:'Scaling Startups', author:'Daniel Brooks', category:'Business', price:28.99, oldPrice:38.99, rating:4.4, reviews:634, stock:25, publisher:'Summit House', language:'English', pages:320, isbn:'978-1-05-000011', published:'2021-10-01', description:'A founder\'s roadmap to growing a company from garage to global.' },
  { id:12, title:'The Lean Manager', author:'Daniel Brooks', category:'Business', price:26.50, oldPrice:34.00, rating:4.2, reviews:298, stock:33, publisher:'Summit House', language:'English', pages:280, isbn:'978-1-05-000012', published:'2020-04-22', description:'Cut the waste, focus on value, and lead high-performing teams.' },
  { id:13, title:'Money Mindset', author:'Olivia Grant', category:'Finance', price:22.99, oldPrice:29.99, rating:4.7, reviews:1105, stock:44, publisher:'WealthWise', language:'English', pages:260, isbn:'978-1-06-000013', published:'2023-03-30', description:'Reprogram your relationship with money and build lasting wealth.' },
  { id:14, title:'Invest Like a Pro', author:'Olivia Grant', category:'Finance', price:31.00, oldPrice:42.00, rating:4.5, reviews:588, stock:14, publisher:'WealthWise', language:'English', pages:350, isbn:'978-1-06-000014', published:'2022-02-18', description:'Portfolio strategies, risk management and long-term compounding explained simply.' },
  { id:15, title:'Atomic Discipline', author:'Noah Bennett', category:'Self Help', price:19.99, oldPrice:26.99, rating:4.9, reviews:2210, stock:52, publisher:'Mindful Media', language:'English', pages:240, isbn:'978-1-07-000015', published:'2021-01-12', description:'Tiny daily habits that compound into remarkable life change.' },
  { id:16, title:'The Focused Life', author:'Noah Bennett', category:'Self Help', price:21.50, oldPrice:28.00, rating:4.6, reviews:940, stock:38, publisher:'Mindful Media', language:'English', pages:270, isbn:'978-1-07-000016', published:'2022-09-19', description:'Reclaim your attention in a world engineered for distraction.' },
  { id:17, title:'Thinking in Systems', author:'Dr. Elena Ross', category:'Psychology', price:25.99, oldPrice:33.99, rating:4.7, reviews:812, stock:20, publisher:'Cortex Books', language:'English', pages:300, isbn:'978-1-08-000017', published:'2020-11-05', description:'Understand the hidden mental models that drive human behaviour.' },
  { id:18, title:'The Mind Explained', author:'Dr. Elena Ross', category:'Psychology', price:23.00, oldPrice:30.00, rating:4.4, reviews:406, stock:27, publisher:'Cortex Books', language:'English', pages:290, isbn:'978-1-08-000018', published:'2023-05-25', description:'A friendly tour through memory, emotion, bias and decision making.' },
  { id:19, title:'Empires of Time', author:'Marcus Webb', category:'History', price:29.00, oldPrice:39.00, rating:4.6, reviews:517, stock:16, publisher:'Chronicle Press', language:'English', pages:520, isbn:'978-1-09-000019', published:'2019-06-14', description:'The rise and fall of civilizations across three thousand years.' },
  { id:20, title:'The Silk Road Story', author:'Marcus Webb', category:'History', price:27.50, oldPrice:35.00, rating:4.3, reviews:289, stock:21, publisher:'Chronicle Press', language:'English', pages:440, isbn:'978-1-09-000020', published:'2021-08-08', description:'Trade, culture and conquest along the world\'s greatest ancient highway.' },
  { id:21, title:'Cosmos Decoded', author:'Dr. Hana Sato', category:'Science', price:33.99, oldPrice:44.99, rating:4.8, reviews:1010, stock:13, publisher:'Quanta Books', language:'English', pages:400, isbn:'978-1-10-000021', published:'2022-04-02', description:'From quarks to galaxies — the universe told as an unfolding story.' },
  { id:22, title:'The Living Cell', author:'Dr. Hana Sato', category:'Science', price:30.50, oldPrice:40.00, rating:4.5, reviews:445, stock:18, publisher:'Quanta Books', language:'English', pages:380, isbn:'978-1-10-000022', published:'2023-07-21', description:'A vivid journey inside the microscopic machinery of life.' },
  { id:23, title:'The Dragon Who Read', author:'Lily Park', category:'Children', price:14.99, oldPrice:19.99, rating:4.9, reviews:1620, stock:60, publisher:'Little Sprout', language:'English', pages:48, isbn:'978-1-11-000023', published:'2023-09-10', description:'A gentle bedtime tale about a dragon who loved stories more than gold.' },
  { id:24, title:'Adventures of Pip', author:'Lily Park', category:'Children', price:13.50, oldPrice:17.99, rating:4.7, reviews:880, stock:55, publisher:'Little Sprout', language:'English', pages:52, isbn:'978-1-11-000024', published:'2022-12-01', description:'Follow a curious little fox on a big adventure through the enchanted woods.' },
  { id:25, title:'The Midnight Library', author:'Sophie Turner', category:'Novels', price:18.99, oldPrice:24.99, rating:4.8, reviews:3040, stock:29, publisher:'Riverstone', language:'English', pages:330, isbn:'978-1-12-000025', published:'2021-03-03', description:'Between life and death lies a library of the lives you could have lived.' },
  { id:26, title:'Whispers of the Sea', author:'Sophie Turner', category:'Novels', price:17.50, oldPrice:23.00, rating:4.5, reviews:1120, stock:34, publisher:'Riverstone', language:'English', pages:360, isbn:'978-1-12-000026', published:'2022-06-16', description:'A sweeping love story set against a windswept coastal town.' },
  { id:27, title:'Neon Guardians', author:'Kai Rivera', category:'Comics', price:16.99, oldPrice:22.00, rating:4.6, reviews:702, stock:41, publisher:'PixelInk', language:'English', pages:120, isbn:'978-1-13-000027', published:'2023-10-27', description:'A dazzling graphic novel where cyber-heroes defend a luminous city.' },
  { id:28, title:'Legends Reborn', author:'Kai Rivera', category:'Comics', price:15.50, oldPrice:20.00, rating:4.4, reviews:388, stock:37, publisher:'PixelInk', language:'English', pages:110, isbn:'978-1-13-000028', published:'2024-02-14', description:'Ancient myths clash with modern heroes in this action-packed saga.' },
  { id:29, title:'Learn Anything Faster', author:'Grace Hall', category:'Education', price:20.99, oldPrice:27.99, rating:4.5, reviews:560, stock:46, publisher:'BrightPath', language:'English', pages:250, isbn:'978-1-14-000029', published:'2022-08-12', description:'Evidence-based study techniques to learn deeply and remember longer.' },
  { id:30, title:'The Future of Tech', author:'Ryan Cole', category:'Technology', price:35.00, oldPrice:46.00, rating:4.6, reviews:733, stock:11, publisher:'FutureWorks', language:'English', pages:420, isbn:'978-1-15-000030', published:'2024-03-01', description:'Quantum, biotech, robotics and the innovations shaping the next decade.' }
];

/* derived discount % */
BOOKS.forEach(b => { b.discount = Math.round((1 - b.price / b.oldPrice) * 100); });

/* ---------- Utilities ---------- */
const money = n => '$' + Number(n).toFixed(2);
const getBook = id => BOOKS.find(b => b.id === Number(id));
const initials = name => name.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();

function starsHTML(rating, reviews) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let s = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
  return `<div class="stars">${s} ${reviews != null ? `<span class="rev">(${reviews.toLocaleString()})</span>` : `<span class="rev">${rating}</span>`}</div>`;
}

/* Generated CSS book cover */
function coverHTML(book, cls = '') {
  return `<div class="book-cover ${cls}" style="background:${coverGradient(book.category)}">
    <span class="bc-spine"></span>
    <span class="bc-cat">${book.category}</span>
    <div>
      <div class="bc-title">${book.title}</div>
      <div class="bc-author">${book.author}</div>
    </div>
  </div>`;
}

/* Book card */
function bookCardHTML(book) {
  const wished = typeof isWished === 'function' && isWished(book.id);
  return `<article class="book-card reveal" data-id="${book.id}">
    <div class="bc-media hover-zoom">
      ${book.discount > 0 ? `<span class="disc-tag">-${book.discount}%</span>` : ''}
      <button class="wish-btn ${wished ? 'active' : ''}" aria-label="Add to wishlist" onclick="toggleWishlist(${book.id}, this)">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>
      </button>
      <a href="/details.html?id=${book.id}" aria-label="${book.title}">${coverHTML(book)}</a>
    </div>
    <div class="bc-body">
      <span class="cat">${book.category}</span>
      <a href="/details.html?id=${book.id}"><h3 class="title">${book.title}</h3></a>
      <div class="author">by ${book.author}</div>
      ${starsHTML(book.rating, book.reviews)}
      <div class="price-row">
        <span class="price">${money(book.price)}</span>
        <span class="old-price">${money(book.oldPrice)}</span>
      </div>
      <div class="bc-actions">
        <a class="btn btn-ghost btn-sm" href="/details.html?id=${book.id}">View</a>
        <button class="btn btn-primary btn-sm" onclick="addToCart(${book.id})">Add to Cart</button>
      </div>
    </div>
  </article>`;
}

function renderBooks(list, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!list.length) { el.innerHTML = `<div class="empty-state"><div class="ico">📚</div><h3>No books found</h3><p>Try adjusting your search or filters.</p></div>`; return; }
  el.innerHTML = list.map(bookCardHTML).join('');
  if (typeof observeReveal === 'function') observeReveal();
}
