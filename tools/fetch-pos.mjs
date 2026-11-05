// Netlify build step for kiro-web: puts the KIRO POS app into web/site/app from the kiro-pos repository at the
// exact release tag in pos-version.txt (a reviewed, versioned dependency instead of a copied file).
// Usage: node tools/fetch-pos.mjs            (Netlify runs this before publishing web/site)
//        KIRO_POS_DIR=../kiro-pos node tools/fetch-pos.mjs   (local: copy from a checkout instead)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tag = fs.readFileSync(path.join(root, 'pos-version.txt'), 'utf8').trim();
const out = path.join(root, 'web/site/app');
const FILES = ['index.html', 'sw.js'];
fs.mkdirSync(out, { recursive: true });

if (process.env.KIRO_POS_DIR) {
  for (const f of FILES) fs.copyFileSync(path.join(process.env.KIRO_POS_DIR, 'app', f), path.join(out, f));
  console.log(`POS app copied from ${process.env.KIRO_POS_DIR} (local, not pinned)`);
} else {
  for (const f of FILES) {
    const url = `https://raw.githubusercontent.com/kirotick/kiro-pos/${tag}/app/${f}`;
    const r = await fetch(url);
    if (!r.ok) { console.error(`Could not download ${url}: HTTP ${r.status}`); process.exit(1); }
    fs.writeFileSync(path.join(out, f), Buffer.from(await r.arrayBuffer()));
  }
  console.log(`POS app ${tag} downloaded from kirotick/kiro-pos`);
}
const html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
if (!/<title>KIRO POS<\/title>/.test(html)) { console.error('Downloaded file is not the KIRO POS app'); process.exit(1); }