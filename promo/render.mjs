// Renders index.html to an MP4, frame by frame, with headless Chrome and ffmpeg.
//   node render.mjs                     -> label-factory-slam.mp4 (1920x1080, 30 fps)
//   node render.mjs --stills 1.5,8.6    -> still-1.5.png, still-8.6.png (for checking a moment)
//   node render.mjs --fps 60 --out x.mp4
// Needs: npm install (playwright-core), Chrome or Edge installed, ffmpeg on PATH (or FFMPEG=path).
import { chromium } from "playwright-core";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const arg = (name, def) => { const i = process.argv.indexOf("--" + name); return i > 0 ? process.argv[i + 1] : def; };
const fps = Number(arg("fps", 30));
const out = path.resolve(here, arg("out", "label-factory-slam.mp4"));
const stills = arg("stills", null);

const browsers = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = browsers.find(p => existsSync(p));
if (!executablePath) throw new Error("No Chrome/Edge found; set CHROME=path/to/chrome");

const browser = await chromium.launch({ executablePath, args: ["--allow-file-access-from-files"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on("console", m => { if (m.type() === "warning" || m.type() === "error") console.log("page:", m.text()); });
page.on("pageerror", e => { console.error("page error:", e.message); process.exitCode = 1; });
await page.goto(pathToFileURL(path.join(here, "index.html")).href + "?render=1");
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every(i => i.complete));
const frame = page.locator("#frame");

if (stills) {
  for (const t of stills.split(",").map(Number)) {
    await page.evaluate(t => window.renderAt(t), t);
    await frame.screenshot({ path: path.join(here, `still-${t}.png`) });
    console.log("wrote", `still-${t}.png`);
  }
} else {
  const duration = await page.evaluate(() => window.DURATION);
  const total = Math.round(duration * fps);
  const ffmpeg = spawn(process.env.FFMPEG || "ffmpeg", [
    "-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-",
    "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out,
  ], { stdio: ["pipe", "inherit", "inherit"] });
  for (let f = 0; f < total; f++) {
    await page.evaluate(t => window.renderAt(t), f / fps);
    const png = await frame.screenshot({ type: "png" });
    if (!ffmpeg.stdin.write(png)) await new Promise(r => ffmpeg.stdin.once("drain", r));
    if (f % fps === 0) process.stdout.write(`\r${f}/${total} frames`);
  }
  ffmpeg.stdin.end();
  await new Promise((res, rej) => ffmpeg.on("close", c => c === 0 ? res() : rej(new Error("ffmpeg exited " + c))));
  console.log(`\nwrote ${out}`);
}
await browser.close();
