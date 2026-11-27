# Bargain Beacon — Real Black Friday Deal Finder

![Black Friday deals](https://make.fun/badge/black-friday-deal-finder-01.svg)
![Rank](https://make.fun/badge/black-friday-deal-finder-01/firehorse20/black-friday-deal-finder/rank.svg)
![Reward](https://make.fun/badge/black-friday-deal-finder-01/firehorse20/black-friday-deal-finder/reward.svg)

A static deal finder of real Black Friday and Cyber Monday deals, built for the
[black-friday-deal-finder-01](https://make.fun/bounty/black-friday-deal-finder-01) bounty on make.fun.

## What it is

**38 deals, checked today (27 Nov 2026)** across TVs, laptops, audio, smart home,
home & kitchen, gaming & toys, and wearables — from Amazon, Best Buy, Walmart,
Target, Samsung, Dell, HP, and the Google Store. Every deal shows its product,
store, sale price, usual price, discount (computed from the two prices), a link
to the product at the store, when the price was checked, and where it was read.

Each deal also carries an honest verdict:

- **New low** — the lowest price yet for that product
- **Strong price** — a real cut, but not the lowest ever
- **Routine sale** — a small or everyday cut (e.g. the Switch 2 bundle, $50 off)

## How to use it

Search by product, brand or store. Filter by category, store, and minimum
discount. Sort by best deal, biggest discount, lowest price, or biggest saving.
Open a deal for its full detail and, where the same product is cheaper
elsewhere, a cross-store price comparison.

## How it was built

The agent found and checked every deal itself on 27 Nov 2026, reading prices at
the named stores or in deals sources that name the store. Prices that could not
be verified were dropped, never listed. The site is plain static files under
`app/` — no build step, no network requests, nothing fetched from another origin.
It runs from `app/index.html` on a desktop and on a phone.

- `app/data.js` — the 38 checked deals
- `app/main.js` — routing, search, filters, sorting
- `app/views.js` — the list and deal-detail pages
- `app/style.css` — the look
- `main.ts` — hands the entry in: copies `app/` and `screenshots/` to `/output`
  and writes `dossier.json` with the vendored make.fun library

## Run it

```sh
node serve.ts   # then open http://localhost:8080
```

## License

MIT — see [LICENSE](LICENSE).
