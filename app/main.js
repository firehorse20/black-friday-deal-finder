// Bargain Beacon: the deal finder. Hash routes, live search and filters, sorting.
//   #/            the list, with search and filters
//   #/deal/<id>   one deal, with a cross-store comparison where one exists
// The deals are in data.js, so the site needs no network to show them; each
// deal links out to its store. Nothing here fetches anything.

import { deals, CATEGORIES, STORES, discountPct, verdictRank } from './data.js';

const app = document.querySelector('#app');
const stats = document.querySelector('#stats');
const q = document.querySelector('#q');
const categorySel = document.querySelector('#category');
const storeSel = document.querySelector('#store');
const mindiscSel = document.querySelector('#mindisc');
const sortSel = document.querySelector('#sort');

const newLows = deals.filter((d) => d.verdict === 'new-low').length;
const maxOff = Math.max(...deals.map(discountPct));
stats.textContent = `${deals.length} deals checked today · ${newLows} at new-low prices · up to ${maxOff}% off`;

function fillSelect(sel, values, allLabel) {
  sel.innerHTML = `<option value="">${allLabel}</option>` + values.map((v) => `<option value="${v}">${v}</option>`).join('');
}
fillSelect(categorySel, CATEGORIES, 'All categories');
fillSelect(storeSel, STORES, 'All stores');

function state() {
  return {
    q: q.value.trim().toLowerCase(),
    category: categorySel.value,
    store: storeSel.value,
    mindisc: Number(mindiscSel.value),
    sort: sortSel.value,
  };
}

function applyFilters(list, s) {
  let out = list.filter((d) => {
    if (s.category && d.category !== s.category) return false;
    if (s.store && d.store !== s.store) return false;
    if (discountPct(d) < s.mindisc) return false;
    if (s.q) {
      const hay = `${d.title} ${d.store} ${d.category} ${d.source}`.toLowerCase();
      if (!s.q.split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  });
  const by = {
    best: (a, b) => verdictRank(a) - verdictRank(b) || discountPct(b) - discountPct(a) || a.price - b.price,
    discount: (a, b) => discountPct(b) - discountPct(a) || a.price - b.price,
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    savings: (a, b) => (b.was - b.price) - (a.was - a.price),
  };
  return out.sort(by[s.sort] ?? by.best);
}

// Imported lazily so the list page never pays for the detail view code.
async function render() {
  const hash = location.hash || '#/';
  const views = await import('./views.js');
  if (hash.startsWith('#/deal/')) {
    const d = deals.find((x) => x.id === hash.slice(7));
    app.innerHTML = d ? views.detailView(d) : views.notFoundView();
    return;
  }
  app.innerHTML = views.listView(applyFilters(deals, state()), deals.length);
}

for (const el of [q, categorySel, storeSel, mindiscSel, sortSel]) {
  el.addEventListener('input', () => { if (!(location.hash || '#/').startsWith('#/deal/')) render(); });
  el.addEventListener('change', () => { if (!(location.hash || '#/').startsWith('#/deal/')) render(); });
}
window.addEventListener('hashchange', render);
render();
