import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://paicanyon.com',
  output: 'static',
  // Canonical/OG/hreflang all use the trailing-slash form; keep routing consistent
  // with public/_redirects, which 301s the non-slash variants.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en', 'zh'],
    routing: {
      prefixDefaultLocale: true,
      // Root is handled by src/pages/index.astro, which redirects to /en/
      // (the locale that carries ~90% of Search Console impressions) instead of
      // Astro's automatic redirect to defaultLocale ('th').
      redirectToDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
