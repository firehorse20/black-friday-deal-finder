// HTML for each page, built from the deal data. Every value is escaped before it goes into the page.

import { discountPct, VERDICT_LABEL } from './data.js';

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const fmtChecked = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZoneName: 'short', timeZone: 'UTC' });
};

export function dealCard(d) {
  const off = discountPct(d);
  const save = d.was - d.price;
  const compare = d.compare?.length
    ? `<p class="compare">Also at: ${d.compare.map((c) => `<b>${escape(c.store)}</b> ${usd(c.price)}`).join(' · ')}</p>`
    : '';
  return `<article class="card">
  <div class="meta">
    <span class="chip">${escape(d.store)}</span>
    <span class="chip">${escape(d.category)}</span>
    <span class="chip verdict-${escape(d.verdict)}">${escape(VERDICT_LABEL[d.verdict])}</span>
  </div>
  <h2><a href="#/deal/${escape(d.id)}">${escape(d.title)}</a></h2>
  <div class="prices">
    <span class="price">${usd(d.price)}</span>
    <span class="was">${usd(d.was)}</span>
    <span class="off">${off}% off</span>
  </div>
  <p class="save">You save ${usd(save)}</p>
  <p class="evidence">${escape(d.evidence)}</p>
  <p class="checked">Price checked ${escape(fmtChecked(d.checked))} · Source: ${escape(d.source)}</p>
  ${compare}
  <p class="cta"><a href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a></p>
</article>`;
}

export function listView(list, total) {
  if (!list.length) {
    return `<p class="empty">No deals match those filters. Try clearing the search or lowering the minimum discount.</p>`;
  }
  const shown = list.length === total ? `${total} deals` : `${list.length} of ${total} deals`;
  return `<p class="count">Showing ${shown} — sorted best deals first. Prices checked 27 Nov 2026.</p>
<div class="grid">${list.map(dealCard).join('\n')}</div>`;
}

export function detailView(d) {
  const off = discountPct(d);
  const save = d.was - d.price;
  const rows = [{ store: d.store, price: d.price }, ...(d.compare ?? [])]
    .map((c) => `<tr><td>${escape(c.store)}</td><td>${usd(c.price)}</td><td>${c.store === d.store ? 'This deal' : ''}</td></tr>`)
    .join('\n');
  const compareTable = d.compare?.length
    ? `<h3>Same product at other stores</h3>
<table class="compare-table"><thead><tr><th>Store</th><th>Price</th><th>Note</th></tr></thead><tbody>${rows}</tbody></table>`
    : '';
  return `<article class="detail">
  <a class="back" href="#/">&larr; All deals</a>
  <div class="meta">
    <span class="chip">${escape(d.store)}</span>
    <span class="chip">${escape(d.category)}</span>
    <span class="chip verdict-${escape(d.verdict)}">${escape(VERDICT_LABEL[d.verdict])}</span>
  </div>
  <h2>${escape(d.title)}</h2>
  <div class="prices">
    <span class="price">${usd(d.price)}</span>
    <span class="was">${usd(d.was)}</span>
    <span class="off">${off}% off</span>
  </div>
  <p class="save">You save ${usd(save)} off the usual price of ${usd(d.was)}.</p>
  <p><strong>Is it really a deal?</strong> ${escape(VERDICT_LABEL[d.verdict])} — ${escape(d.evidence)}</p>
  <p>Price checked ${escape(fmtChecked(d.checked))}. Source: ${escape(d.source)}</p>
  ${compareTable}
  <p class="cta"><a href="${escape(d.url)}" target="_blank" rel="noopener">View at ${escape(d.store)} &rarr;</a></p>
</article>`;
}

export function notFoundView() {
  return `<p class="empty">That deal is not on the board. <a href="#/">Back to all deals</a>.</p>`;
}
