/**
 * Post-build audit for the GSC optimisation pass (npm run check:seo).
 * Verifies the built HTML against what the Search Console findings asked for:
 * indexable homepages + topic pages, noindex legal pages, query-aligned
 * headings, consolidated www canonicals / hreflang, complete TouristAttraction
 * schema (without unverified opening hours) and the mobile Google Maps / call
 * CTAs.
 */
import fs from 'node:fs';
import path from 'node:path';

const LANGS = ['en', 'th', 'zh'];
const DOMAIN = 'https://www.paicanyon.com';
const LEGAL = ['privacy-policy', 'terms-of-service', 'cookie-settings'];
const TOPICS = ['entrance-fee', 'sunset', 'hiking-guide', 'how-to-get-there'];

const HEADING_TOKENS = {
  en: [
    'Pai Canyon Entrance Fee & Parking',
    'Pai Canyon Opening Hours',
    'How to Get to Pai Canyon & Location',
    'Pai Canyon Hiking & Sunset Safety Tips',
  ],
  zh: [
    '拜县大峡谷门票与停车',
    '拜县大峡谷开放时间',
    '拜县大峡谷怎么去',
    '拜县大峡谷徒步与日落安全提示',
  ],
  th: [
    'ค่าเข้าและที่จอดรถปายแคนยอน',
    'เวลาเปิด-ปิดปายแคนยอน',
    'วิธีเดินทางไปปายแคนยอนและที่ตั้ง',
    'ความปลอดภัยในการเดินป่าและชมพระอาทิตย์ตก',
  ],
};

const problems = [];
const notes = [];
const fail = (m) => problems.push(m);

const read = (rel) => fs.readFileSync(path.join('dist', rel), 'utf8');
const attr = (html, re) => (html.match(re) || [])[1];
const unescape = (s) => (s ? s.replace(/&amp;/g, '&') : s);
const jsonLdBlocks = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);

// ── homepages ────────────────────────────────────────────────────────────────
for (const lang of LANGS) {
  const rel = `${lang}/index.html`;
  const html = read(rel);
  const tag = `/${lang}/`;

  const title = unescape(attr(html, /<title>([\s\S]*?)<\/title>/));
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = attr(html, /<meta name="robots" content="([^"]*)"/);

  if (!title || !desc) fail(`${tag} missing title/description`);
  if (robots !== 'index,follow') fail(`${tag} robots should be index,follow, got "${robots}"`);
  if (canonical !== `${DOMAIN}${tag}`) fail(`${tag} canonical mismatch: ${canonical}`);
  if (canonical && !canonical.endsWith('/')) fail(`${tag} canonical without trailing slash`);

  for (const [hl, href] of [['th', '/th/'], ['en', '/en/'], ['zh-Hans', '/zh/'], ['x-default', '/en/']]) {
    if (!html.includes(`hreflang="${hl}" href="${DOMAIN}${href}"`)) fail(`${tag} hreflang ${hl} → ${href} missing`);
  }

  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail(`${tag} expected exactly 1 <h1>, found ${h1s}`);

  const ld = jsonLdBlocks(html)
    .map((raw) => {
      try {
        return JSON.parse(raw);
      } catch (err) {
        fail(`${tag} JSON-LD does not parse: ${err.message}`);
        return {};
      }
    })
    .flatMap((j) => j['@graph'] ?? [j]);
  const attraction = ld.find((n) => n['@type'] === 'TouristAttraction');
  const faq = ld.find((n) => n['@type'] === 'FAQPage');

  if (!attraction) fail(`${tag} TouristAttraction node missing`);
  else {
    const need = {
      '@id': `${DOMAIN}/#attraction`,
      telephone: '+66861137373',
      'address.postalCode': '58130',
      'address.streetAddress': '8F43+F22',
      'geo.latitude': 19.3061375,
      'geo.longitude': 98.4525156,
      hasMap: 'https://maps.app.goo.gl/DiyqAjPXo86mCB5c9',
      isAccessibleForFree: true,
      'aggregateRating.ratingValue': 4.5,
      'aggregateRating.reviewCount': '8414',
    };
    const got = {
      '@id': attraction['@id'],
      telephone: attraction.telephone,
      'address.postalCode': attraction.address?.postalCode,
      'address.streetAddress': attraction.address?.streetAddress?.split(',')[0],
      'geo.latitude': attraction.geo?.latitude,
      'geo.longitude': attraction.geo?.longitude,
      hasMap: attraction.hasMap,
      isAccessibleForFree: attraction.isAccessibleForFree,
      'aggregateRating.ratingValue': attraction.aggregateRating?.ratingValue,
      'aggregateRating.reviewCount': attraction.aggregateRating?.reviewCount,
    };
    for (const [k, v] of Object.entries(need)) if (got[k] !== v) fail(`${tag} schema ${k}: expected ${v}, got ${got[k]}`);
    if (attraction.openingHoursSpecification) {
      fail(`${tag} schema must not claim official openingHoursSpecification (unverified gate hours)`);
    }
  }

  const visibleFaqs = (html.match(/<details/g) || []).length;
  const schemaFaqs = faq?.mainEntity?.length ?? 0;
  if (visibleFaqs !== schemaFaqs) fail(`${tag} FAQ mismatch: ${visibleFaqs} visible <details> vs ${schemaFaqs} in FAQPage`);

  for (const token of HEADING_TOKENS[lang]) {
    if (!html.includes(token) && !html.includes(token.replace(/&/g, '&amp;'))) fail(`${tag} heading missing: ${token}`);
  }

  if (!html.includes(`href="https://maps.app.goo.gl/DiyqAjPXo86mCB5c9"`)) fail(`${tag} no Google Maps anchor`);
  if (!html.includes('href="tel:+66861137373"')) fail(`${tag} no tel: anchor`);
  if (!html.includes('id="w-days"') && !/id\s*=\s*["']?w-days/.test(html)) fail(`${tag} weather module markers missing`);

  // topic links on the homepage (internal linking to the long-tail guides)
  for (const slug of TOPICS) {
    if (!html.includes(`href="/${lang}/${slug}/"`)) fail(`${tag} missing topic link to /${lang}/${slug}/`);
  }

  notes.push(`${tag} title(${title.length}): ${title}`);
  notes.push(`${tag} desc(${desc.length}): ${desc.slice(0, 70)}…`);
  if (lang === 'en' && title.length > 65) fail(`/en/ title too long (${title.length})`);
  if (lang === 'zh' && title.length > 40) fail(`/zh/ title too long (${title.length})`);
  if (lang === 'th' && title.length > 90) fail(`/th/ title too long (${title.length})`);
}

// ── topic pages ──────────────────────────────────────────────────────────────
for (const lang of LANGS) {
  for (const slug of TOPICS) {
    const rel = `${lang}/${slug}/index.html`;
    if (!fs.existsSync(path.join('dist', rel))) {
      fail(`${rel} not built`);
      continue;
    }
    const html = read(rel);
    const tag = `/${lang}/${slug}/`;

    const title = unescape(attr(html, /<title>([\s\S]*?)<\/title>/));
    const desc = attr(html, /<meta name="description" content="([^"]*)"/);
    const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
    const robots = attr(html, /<meta name="robots" content="([^"]*)"/);

    if (!title || !desc) fail(`${tag} missing title/description`);
    if (robots !== 'index,follow') fail(`${tag} robots should be index,follow, got "${robots}"`);
    if (canonical !== `${DOMAIN}${tag}`) fail(`${tag} canonical mismatch: ${canonical}`);

    for (const [hl, href] of [['th', `/th/${slug}/`], ['en', `/en/${slug}/`], ['zh-Hans', `/zh/${slug}/`], ['x-default', `/en/${slug}/`]]) {
      if (!html.includes(`hreflang="${hl}" href="${DOMAIN}${href}"`)) fail(`${tag} hreflang ${hl} → ${href} missing`);
    }

    const h1s = (html.match(/<h1[\s>]/g) || []).length;
    if (h1s !== 1) fail(`${tag} expected exactly 1 <h1>, found ${h1s}`);

    const ld = jsonLdBlocks(html)
      .map((raw) => {
        try {
          return JSON.parse(raw);
        } catch (err) {
          fail(`${tag} JSON-LD does not parse: ${err.message}`);
          return {};
        }
      })
      .flatMap((j) => j['@graph'] ?? [j]);
    const faq = ld.find((n) => n['@type'] === 'FAQPage');
    if (!faq) fail(`${tag} FAQPage node missing`);
    else {
      const visibleFaqs = (html.match(/<details/g) || []).length;
      const schemaFaqs = faq.mainEntity?.length ?? 0;
      if (visibleFaqs !== schemaFaqs) fail(`${tag} FAQ mismatch: ${visibleFaqs} visible <details> vs ${schemaFaqs} in FAQPage`);
    }
    if (!ld.some((n) => n['@type'] === 'TouristAttraction')) fail(`${tag} TouristAttraction node missing`);
    if (!ld.some((n) => n['@type'] === 'BreadcrumbList')) fail(`${tag} BreadcrumbList node missing`);
    if (!html.includes(`href="https://maps.app.goo.gl/DiyqAjPXo86mCB5c9"`)) fail(`${tag} no Google Maps anchor`);

    // internal links to the other three topic guides
    for (const other of TOPICS.filter((s) => s !== slug)) {
      if (!html.includes(`href="/${lang}/${other}/"`)) fail(`${tag} missing cross-link to /${lang}/${other}/`);
    }
    notes.push(`${tag} title(${title.length}): ${title}`);
  }
}

// ── legal pages: noindex + trailing slash canonical ──────────────────────────
for (const lang of LANGS) {
  for (const page of LEGAL) {
    const rel = `${lang}/${page}/index.html`;
    if (!fs.existsSync(path.join('dist', rel))) {
      fail(`${rel} not built`);
      continue;
    }
    const html = read(rel);
    const robots = attr(html, /<meta name="robots" content="([^"]*)"/);
    const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
    if (robots !== 'noindex, follow') fail(`/${lang}/${page}/ robots should be noindex,follow, got "${robots}"`);
    if (canonical !== `${DOMAIN}/${lang}/${page}/`) fail(`/${lang}/${page}/ canonical mismatch: ${canonical}`);
  }
}

// ── sitemap / redirects / robots ─────────────────────────────────────────────
const sitemap = read('sitemap.xml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expandedSlugs = [...fs.readFileSync('src/lib/expandedGuides.ts', 'utf8').matchAll(/\bslug: '([a-z0-9-]+)'/g)].map((m) => m[1]);
const expectedUrls = LANGS.length * (2 + TOPICS.length + expandedSlugs.length);
if (locs.length !== expectedUrls) fail(`sitemap should list ${expectedUrls} URLs, got ${locs.length}`);
for (const lang of LANGS) {
  for (const slug of ['guides', ...expandedSlugs.map((s) => `guides/${s}`)]) {
    const route = `${lang}/${slug}/index.html`;
    if (!fs.existsSync(path.join('dist', route))) { fail(`${route} not built`); continue; }
    const html = read(route);
    if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${route} requires one h1`);
    if (!html.includes(`rel="canonical" href="${DOMAIN}/${lang}/${slug}/"`)) fail(`${route} canonical mismatch`);
    if (!locs.includes(`${DOMAIN}/${lang}/${slug}/`)) fail(`${route} missing sitemap loc`);
  }
}
for (const page of LEGAL) if (sitemap.includes(`/${page}`)) fail(`sitemap still lists ${page}`);
for (const loc of locs) if (!loc.startsWith(`${DOMAIN}/`)) fail(`sitemap URL off canonical domain: ${loc}`);
if (!sitemap.includes(`hreflang="x-default" href="${DOMAIN}/en/"`)) fail('sitemap x-default should be /en/');

const redirects = read('_redirects');
if (!/^\/ \/en\/ 301$/m.test(redirects)) fail('_redirects root rule should 301 → /en/');
for (const lang of LANGS) {
  for (const page of LEGAL) {
    if (!redirects.includes(`/${lang}/${page} /${lang}/${page}/ 301`)) fail(`_redirects missing slash rule for /${lang}/${page}`);
  }
}

const root = read('index.html');
if (!/url=\.?\/?en\//.test(root) && !/\/en\//.test(root)) fail('root index.html does not point to /en/');

// ── report ───────────────────────────────────────────────────────────────────
console.log(notes.join('\n'));
console.log(
  problems.length
    ? `\n${problems.length} problem(s):\n- ${problems.join('\n- ')}`
    : `\nSEO audit PASS — ${LANGS.length} homepages, ${expectedUrls} sitemap URLs, ${LANGS.length * LEGAL.length} noindex legal pages, ${LANGS.length * TOPICS.length} topic pages, schema + headings + CTAs verified`
);
process.exit(problems.length ? 1 : 0);
