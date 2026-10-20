# Label Factory SLAM promo

A 25-second promo for Label Factory SLAM, 1920x1080 at 30 fps, with no audio.

| File | What |
|---|---|
| `index.html` | the animation. Open it in a browser to watch it loop live. |
| `render.mjs` | renders `index.html` frame by frame to `label-factory-slam.mp4` |
| `label-factory-slam.mp4` | the rendered video |

It uses `../assets/archivo-latin-wdth.woff2` and `../assets/slam-line.jpg` from this site.

## Editing

All of the editing happens in `index.html`:

- **Copy:** the text is in the `<section class="scene">` blocks. `data-at="x y"` sets where an element sits on the 1920x1080 frame, and `data-anchor="l"` anchors its left edge instead of its center.
- **Scene cuts:** `SCENES` lists each scene with its start and end time in seconds.
- **Timing and impact:** `CUES` lists `[element, time, entrance, options]`. The entrances are `slam`, `stamp`, `pop`, `up`, `left` and `right`. `kick` sets how hard the camera shakes, `flash` sets the white flash, `from` sets the starting scale and `rot` sets the final tilt.
- **Continuous motion:** `MOTION` holds the moving parts: the boxes on the belt, the slow zoom on the screenshot and the dimming of earlier letters.
- **Length:** `DURATION` sets the total length.

## Rendering

You need Node, Chrome or Edge, and ffmpeg on PATH (or set `FFMPEG=path`).

```bash
npm install
node render.mjs                      # writes label-factory-slam.mp4
node render.mjs --stills 2.6,8.6     # writes PNG stills at those times, for checking
node render.mjs --fps 60 --out slam-60.mp4
```

Note: GitHub Pages serves this repository from its root, so committing this folder publishes it at labelfactory.app/promo/.
