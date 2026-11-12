import fs from 'node:fs';

const file = 'dist/sitemap.xml';
const source = fs.readFileSync('src/lib/expandedGuides.ts', 'utf8');
const slugs = [...source.matchAll(/\bslug: '([a-z0-9-]+)'/g)].map((m) => m[1]);
if (slugs.length < 30 || new Set(slugs).size !== slugs.length) throw new Error(`Expected at least 30 distinct guides, got ${slugs.length}`);
const langs = ['en', 'th', 'zh'];
const base = 'https://www.paicanyon.com';
const urls = ['guides', ...slugs.map((slug) => `guides/${slug}`)];
let xml = fs.readFileSync(file, 'utf8');
const entries = urls.flatMap((slug) => langs.map((lang) => `  <url>
    <loc>${base}/${lang}/${slug}/</loc>
    <lastmod>2026-11-12</lastmod>
    <xhtml:link rel="alternate" hreflang="th" href="${base}/th/${slug}/"/>
    <xhtml:link rel="alternate" hreflang="en" href="${base}/en/${slug}/"/>
    <xhtml:link rel="alternate" hreflang="zh-Hans" href="${base}/zh/${slug}/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${base}/en/${slug}/"/>
    <changefreq>monthly</changefreq><priority>0.7</priority>
  </url>`)).join('\n');
xml = xml.replace('</urlset>', `${entries}\n</urlset>`);
fs.writeFileSync(file, xml);
console.log(`Extended sitemap with ${urls.length * langs.length} localized URLs`);
