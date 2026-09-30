# CLEA — Christ Love Evangelical Assembly (Reggio Emilia)

Soft, modern, minimalist church website built with **React + Vite + TypeScript**, deployed on **Vercel**.

## Church info
- **Address:** Via Corelli 5 / Via Cilea 4, Area Ex Conchiglia 17, 42121 Reggio nell'Emilia, Italy
- **Phone/WhatsApp:** +39 351 140 8770 · Nigeria: +234 803 040 1694
- **Email:** christloveevangelicalassembly@gmail.com
- **Facebook:** https://www.facebook.com/1806488646340376
- **Blog:** https://cleareggio.blogspot.com/

## Features
- EN 🇬🇧 / IT 🇮🇹 toggle (persisted in localStorage)
- Pages: Home, About, Media, Blog, Visit (Google Maps), Contact, Admin
- **Admin at `/admin`** — password `clea-admin`: manage blog posts, YouTube/Facebook embed links, hero/gallery image URLs (all in localStorage, link-based, no uploads)
- Floating **WhatsApp button** → `wa.me/393511408770`
- Facebook Page timeline embed + video embeds; YouTube embeds added via Admin
- SEO: meta EN+IT, Open Graph, Twitter cards, canonical, JSON-LD `Church` schema, `robots.txt`, `sitemap.xml`, `manifest.webmanifest`, per-page `useSEO` hook

## Local dev
```bash
cd site
npm install
npm run dev
```

## Build
```bash
npm run build   # outputs dist/
```

## Deploy on Vercel
- Import repo `knight-dev01/CLEA` in Vercel, root directory `site/` (or set repo root to `site/`)
- Framework preset: Vite · Build: `npm run build` · Output: `dist`
- `vercel.json` contains SPA rewrite (`/(.*)` → `/index.html`)

## Admin & content workflow
1. Open `/admin`, enter password `clea-admin`
2. Blog: add title/body in EN + IT, date, image URL
3. Media: paste a **YouTube embed URL** (`https://www.youtube.com/embed/VIDEO_ID`) or **Facebook video/page plugin URL**; it plays on `/media` and Home highlights
4. Images: update hero + gallery URLs
5. To reset demo content, clear `localStorage` keys `clea-blog`, `clea-media`, `clea-images`

## SEO / Search Console
- Submit `https://<your-domain>/sitemap.xml` in Google Search Console + Bing Webmaster
- Update `public/sitemap.xml` + canonical in `index.html` with the final domain
- No YouTube channel found for CLEA — when created, paste video embed URLs via Admin; they render instantly
