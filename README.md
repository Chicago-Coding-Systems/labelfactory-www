# labelfactory.app

The public website for Label Factory, served by GitHub Pages at
[labelfactory.app](https://labelfactory.app). The app itself runs at
[app.labelfactory.app](https://app.labelfactory.app). Its code is in the private
`Chicago-Coding-Systems/labelfactory-app` repository.

Plain static files with no build step:

| Path | What |
|---|---|
| `index.html` | the page |
| `404.html` | shown for unknown paths |
| `assets/site.css` | styles (light and dark) |
| `assets/archivo-latin-wdth.woff2` | Archivo, variable width ([OFL](assets/OFL-Archivo.txt)), the same font file the app uses |
| `favicon.*`, `apple-touch-icon.png`, `og-image.jpg` | copied from the app's `webapp/static/brand/` |

Asset paths are relative, so the page also works from a subfolder.

## Preview

```bash
python -m http.server 8796 --bind 127.0.0.1
```

Then open http://localhost:8796.

## Publishing

Pages deploys the `main` branch from the repository root. `.nojekyll` turns off
Jekyll processing. Until labelfactory.app moves here from the app, the site has
no custom domain, so preview it at
https://chicago-coding-systems.github.io/labelfactory-www/. At cutover, a
`CNAME` file containing `labelfactory.app` sets the custom domain. The DNS
records live in Cloudflare.

App links (Sign in, Start free) point to `https://app.labelfactory.app`.
