/**
 * Pai Canyon — Cloudflare Worker edge for the static build in ./dist.
 *
 * Why a worker: Workers Static Assets' _redirects file only supports path-level
 * rules, so the domain-level canonicalisation (apex -> www, http -> https) has to
 * happen here. Google Search Console shows both www and non-www variants of the
 * site indexed, so we consolidate with server-side 301s to the www host that the
 * canonicals, sitemap and robots.txt all point to.
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
}

const CANONICAL_HOST = 'www.paicanyon.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // 1) Canonical host: any other hostname (paicanyon.com, preview hosts, …)
    //    is permanently redirected to https://www.paicanyon.com.
    if (url.hostname.toLowerCase() !== CANONICAL_HOST) {
      url.protocol = 'https:';
      url.hostname = CANONICAL_HOST;
      return Response.redirect(url.toString(), 301);
    }

    // 2) Force HTTPS on the canonical host.
    if (url.protocol !== 'https:') {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    // 3) Root -> global fallback (matches hreflang x-default = /en/).
    if (url.pathname === '/') {
      return Response.redirect(`https://${CANONICAL_HOST}/en/`, 301);
    }

    // 4) Trailing-slash consolidation: Astro builds directory-style URLs, so any
    //    extension-less path without a trailing slash gets one (mirrors _redirects).
    const lastSegment = url.pathname.split('/').pop() ?? '';
    if (!url.pathname.endsWith('/') && !lastSegment.includes('.')) {
      url.pathname = `${url.pathname}/`;
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
