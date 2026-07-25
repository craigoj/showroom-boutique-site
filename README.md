# The Showroom Boutique — website

Linda Bradfield's site, 3801 W Third St, Dayton OH. Built under the MVUL Dayton
Digital program (CTRL TECH / Craig Johnson).

## How to edit this site

Everything on the site (words, photos) lives in one file:
[`src/data/content.json`](src/data/content.json). You do not need to know code
to change it — use the visual editor at **`/admin`** on the live site, or
locally:

```bash
npm install
npm run dev                       # site at http://localhost:5173
```

Then, in a Chromium-based browser (Chrome, Edge, Brave — this needs the File
System Access API, so not Safari or Firefox), open
`http://localhost:5173/admin/index.html` and click "Work with Local
Repository." Pick this project's folder when the browser asks for permission.
No proxy server, no GitHub account needed for this path — changes write
straight to `content.json` on disk, and you commit them yourself with git
when you're happy.

Once the GitHub OAuth app exists (see `netlify/functions/auth.js`) and this
repo is transferred to your own GitHub account, `/admin` on the live site
works the same way — no local setup needed, and every save becomes a real
commit that redeploys the site automatically.

## Launching for real

The whole site runs off one Netlify environment variable, `SITE_URL`. Unset,
it builds as a noindex preview. Set it to the real domain
(`SITE_URL=https://showroomboutique.example`) and redeploy, and every
canonical link, the sitemap, robots.txt, and the CMS's sign-in link all update
themselves. Nothing else needs to be hand-edited at launch. See the comment
block at the top of `vite.config.js`.

## Scope, on purpose

Marketing site only — no online store, no forms that collect customer
information (Craig, 2026-07-22). Photos are owner-maintained through the CMS;
there was no professional photo shoot for this build. Before uploading a
photo: no third-party brand names or logos in any image, filename, or
caption, and no identifiable customer's face without that person's written
permission.

---

_Scaffolded with Vite + React._
