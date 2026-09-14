/** Guards the three locales against key drift (paths and array lengths must match). */
import fs from 'node:fs';

const langs = ['zh', 'en', 'th'];
const data = Object.fromEntries(langs.map((l) => [l, JSON.parse(fs.readFileSync(`src/i18n/${l}.json`, 'utf8'))]));

const walk = (obj, prefix, out) => {
  if (Array.isArray(obj)) {
    out.push(prefix + '[]=' + obj.length);
    return;
  }
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) walk(obj[k], prefix ? prefix + '.' + k : k, out);
    return;
  }
  out.push(prefix);
};

const keys = Object.fromEntries(langs.map((l) => [l, (() => { const o = []; walk(data[l], '', o); return o.sort(); })()]));

let bad = 0;
const base = keys[langs[0]];
for (const l of langs.slice(1)) {
  const diff = base.filter((k) => !keys[l].includes(k)).concat(keys[l].filter((k) => !base.includes(k)));
  if (diff.length) {
    bad += diff.length;
    console.log(`${langs[0]} vs ${l}: ${diff.length} mismatch -> ${diff.slice(0, 12).join(', ')}`);
  }
}

// weather advice library must be complete everywhere
const adviceKeys = Object.keys(data.zh.weather.advice).sort();
for (const l of langs) {
  const missing = adviceKeys.filter((k) => !data[l].weather.advice[k]);
  if (missing.length) {
    bad += missing.length;
    console.log(`${l}: missing advice keys -> ${missing.join(', ')}`);
  }
}

console.log(
  bad
    ? `${bad} i18n mismatch(es)`
    : `i18n parity OK — ${base.length} paths per locale, ${adviceKeys.length} advice keys each`
);
process.exit(bad ? 1 : 0);
