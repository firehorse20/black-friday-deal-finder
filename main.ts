// Bargain Beacon — the black-friday-deal-finder-01 entry (Node 22, standard library only).
//
// The site is this directory's app/ folder: plain static files a browser opens
// at app/index.html (ES modules, one stylesheet, no build step, no network).
// Its deals live in its own files (app/data.js); every price was found and
// checked by the agent at the named store on 27 Nov 2026, and each deal links
// out to its store. This program hands the entry in: it copies app/ and
// screenshots/ from beside this file to /output and writes /output/dossier.json,
// the entry summary (the screenshots, the first load's files and bytes, and
// the source), with the vendored make.fun library. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json to be
// byte for byte what its own copy writes.
//
// Nothing here needs a browser or the network: the screenshots in
// screenshots/ were taken while building, and this program only copies files
// and writes the dossier. It runs in the stock node:22 image.
//
// Serve the site locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files: app/ counts beside /output's own 1000-entry cap,
// its screenshots/ and dossier.json).
const DOSSIER_OPTS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
};

function copyTree(src, dest) {
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
}

function main() {
  mkdirSync(out, { recursive: true });
  copyTree(join(here, 'app'), join(out, 'app'));
  if (existsSync(join(here, 'screenshots'))) {
    copyTree(join(here, 'screenshots'), join(out, 'screenshots'));
  }
  const dossier = buildDossier(out, DOSSIER_OPTS);
  // Fail loudly instead of handing in a dossier the scorer would refuse.
  if (Buffer.byteLength(dossier) > 1572864) {
    throw new Error(`dossier is ${Buffer.byteLength(dossier)} bytes, over the 1.5 MiB cap`);
  }
  writeFileSync(join(out, 'dossier.json'), dossier);
  const bytes = statSync(join(out, 'dossier.json')).size;
  console.log(JSON.stringify({ dossier_bytes: bytes, out }));
}

main();
