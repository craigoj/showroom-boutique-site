import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import content from './src/data/content.json' with { type: 'json' }

const __dirname = dirname(fileURLToPath(import.meta.url))

/*
  ONE variable controls everything that has to change at launch: SITE_URL.

  This exists because this program has shipped the same bugs before, and each one
  came from a launch-time value being hand-edited in its own separate file:

    • Lyons Dynasty (P55) — deployed to the real domain from a staging build, so every
      canonical still named the throwaway preview subdomain.
    • Lawrence Insurance (P10) — went live still carrying noindex, invisible to Google.

  So none of it is hand-edited at launch. Set SITE_URL and rebuild:

    Preview (default):  no SITE_URL set  -> preview URL, noindex, robots.txt Disallow
    Launch:             SITE_URL=https://<realdomain>  -> real canonicals, indexable

  Set it as a Netlify env var (Site configuration > Environment variables) named
  SITE_URL. Nothing else needs to change.
*/

const PREVIEW_URL = 'https://showroom-boutique-dayton.netlify.app'
const SITE_URL = (process.env.SITE_URL || PREVIEW_URL).replace(/\/$/, '')
const IS_LIVE = SITE_URL !== PREVIEW_URL

const b = content.business

// Marketing-site-only scope (Craig, 2026-07-22): no ecommerce, no online store,
// no data-collecting forms. This build never grows a Product/Offer schema block.
// No aggregateRating — no ratings have been collected by us. No openingHours
// until business.hoursConfirmed is true — a guessed "Open now" in Google is
// worse than none.
function schema() {
  const s = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: b.name,
    image: `${SITE_URL}${content.hero.image}`,
    telephone: b.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: b.street,
      addressLocality: b.city,
      addressRegion: 'OH',
      postalCode: b.cityStateZip.match(/\d{5}/)?.[0] || '',
      addressCountry: 'US',
    },
    areaServed: `${b.city}, Ohio`,
    sameAs: [b.instagramUrl].filter(Boolean),
  }
  if (b.hoursConfirmed && b.openingHoursSchema) s.openingHours = b.openingHoursSchema
  return s
}

function esc(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')
}

function launchPlugin() {
  return {
    name: 'showroom-boutique-launch-config',

    transformIndexHtml(html) {
      const head = [
        IS_LIVE
          ? '<meta name="robots" content="index, follow" />'
          : '<meta name="robots" content="noindex, nofollow" />',
        `<link rel="canonical" href="${SITE_URL}/" />`,
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="${esc(b.name)}" />`,
        `<meta property="og:title" content="${esc(b.name)} | ${esc(b.neighborhood)}, ${esc(b.city)}" />`,
        `<meta property="og:description" content="${esc(content.hero.body)}" />`,
        `<meta property="og:url" content="${SITE_URL}/" />`,
        `<meta property="og:image" content="${SITE_URL}${content.hero.image}" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<script type="application/ld+json">${JSON.stringify(schema())}</script>`,
      ].join('\n    ')

      // Replace the placeholder robots tag rather than appending a second one.
      return html.replace(/<meta name="robots"[^>]*\/?>/, head)
    },

    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: IS_LIVE
          ? `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
          : 'User-agent: *\nDisallow: /\n',
      })

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          `  <url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>\n` +
          '</urlset>\n',
      })

      // The /admin CMS must never be indexed, on any domain, ever.
      this.emitFile({
        type: 'asset',
        fileName: '_headers',
        source: IS_LIVE
          ? '/admin/*\n  X-Robots-Tag: noindex, nofollow\n'
          : '/*\n  X-Robots-Tag: noindex, nofollow\n',
      })
    },

    // The CMS config is copied verbatim from public/, so its URLs are substituted
    // here rather than by hand. If base_url is left pointing at the preview after
    // the domain moves, the owner's "Sign in with GitHub" popup authenticates
    // against the wrong origin and the editor simply stops working for her.
    closeBundle() {
      const cfg = resolve(__dirname, 'dist/admin/config.yml')
      if (!existsSync(cfg)) return
      let text = readFileSync(cfg, 'utf8').replaceAll('__SITE_URL__', SITE_URL)
      // "Work with Local Repository" only does anything when `npm run dev` plus the
      // Sveltia proxy server are running locally. Leaving it in the live build just
      // gives a second sign-in button that does nothing useful.
      if (IS_LIVE) text = text.replace(/^local_backend:\s*true\n\n?/m, '')
      writeFileSync(cfg, text)
    },
  }
}

export default defineConfig({
  plugins: [react(), launchPlugin()],
})
