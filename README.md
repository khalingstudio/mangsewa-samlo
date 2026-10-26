# Mangsewa Samlo — website

- `docs/` — the redesigned website (plain HTML, CSS, JavaScript; no database, no build tools). Same forest-green and gold colours as the app, a different layout: hero page, bhajan cards, a book-style reading page with an index rail, Nepali / Nepanglish switch, light / dark, text size, favourites, copy and print, search (title, lyrics or number).
- `site/` — the older direct export of the app (needs special headers); kept as a backup only.

## Try it
`node serve.mjs`, then open http://localhost:8080 (phone on the same Wi-Fi: http://<PC address>:8080). Double-clicking docs/index.html does not work; it needs a server.

## Update after the bhajan text changes
Change the content in `Kirat Bhajan Book` as usual, then here run `node build-data.mjs` (rewrites docs/data.json from the published bhajans and quotes) and refresh the browser.

## Put it online
Upload the `docs/` folder to any static host (Netlify, Cloudflare Pages, GitHub Pages). No special settings needed.
