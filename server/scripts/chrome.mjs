// Draws files in Google Chrome without a window and returns PNG screenshots. Talks to Chrome over
// its DevTools pipe, so it needs no npm packages and no port. Used by scripts/check-drawings.mjs.
//
//   const chrome = await Chrome.launch();
//   const png = await chrome.screenshot("file:///.../drawing.svg", { width: 160, height: 29, scale: 2 });
//   await chrome.close();
//
// Chrome is looked for in /Applications, then CHROME (a path to the browser's executable).
import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const CANDIDATES = [
  process.env.CHROME,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/opt/pw-browsers/chromium/chrome-linux64/chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

export function findChrome() {
  const found = CANDIDATES.find((p) => existsSync(p));
  if (!found) throw new Error(`Google Chrome was not found. Install it, or set CHROME to its executable. Looked in: ${CANDIDATES.join(", ")}`);
  return found;
}

export class Chrome {
  static async launch({ path = findChrome() } = {}) {
    const profile = mkdtempSync(join(tmpdir(), "check-drawings-chrome-"));
    const proc = spawn(path, [
      "--headless=new", "--remote-debugging-pipe", `--user-data-dir=${profile}`,
      "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--hide-scrollbars",
      "--force-color-profile=srgb", "--allow-file-access-from-files", "--disable-background-networking",
      "--mute-audio", "about:blank",
    ], { stdio: ["ignore", "ignore", "pipe", "pipe", "pipe"] });
    const chrome = new Chrome(proc, profile);
    await chrome.#attach();
    return chrome;
  }

  #proc; #profile; #next = 1; #pending = new Map(); #waiters = []; #session = null; #buffer = ""; #stderr = "";

  constructor(proc, profile) {
    this.#proc = proc;
    this.#profile = profile;
    proc.stderr.on("data", (d) => { this.#stderr = (this.#stderr + d).slice(-4000); });
    proc.stdio[4].on("data", (d) => {
      this.#buffer += d.toString("utf8");
      let end;
      while ((end = this.#buffer.indexOf("\0")) >= 0) {
        const msg = JSON.parse(this.#buffer.slice(0, end));
        this.#buffer = this.#buffer.slice(end + 1);
        if (msg.id && this.#pending.has(msg.id)) {
          const { resolve, reject, method } = this.#pending.get(msg.id);
          this.#pending.delete(msg.id);
          msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result);
        } else if (msg.method) {
          this.#waiters = this.#waiters.filter((w) => !(w.method === msg.method && w.resolve(msg.params) !== false));
        }
      }
    });
    proc.on("exit", (code) => {
      for (const { reject } of this.#pending.values()) reject(new Error(`Chrome quit (${code}): ${this.#stderr.trim().slice(-500)}`));
      this.#pending.clear();
    });
  }

  send(method, params = {}, session = this.#session) {
    const id = this.#next++;
    const msg = { id, method, params };
    if (session) msg.sessionId = session;
    return new Promise((resolve, reject) => {
      this.#pending.set(id, { resolve, reject, method });
      this.#proc.stdio[3].write(JSON.stringify(msg) + "\0");
    });
  }

  #event(method, ms) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.#waiters = this.#waiters.filter((w) => w !== waiter); reject(new Error(`timed out waiting for ${method}`)); }, ms);
      const waiter = { method, resolve: (p) => { clearTimeout(timer); resolve(p); } };
      this.#waiters.push(waiter);
    });
  }

  async #attach() {
    const { targetId } = await this.send("Target.createTarget", { url: "about:blank" }, null);
    const { sessionId } = await this.send("Target.attachToTarget", { targetId, flatten: true }, null);
    this.#session = sessionId;
    await this.send("Page.enable");
    await this.send("Emulation.setDefaultBackgroundColorOverride", { color: { r: 0, g: 0, b: 0, a: 0 } });
  }

  /**
   * A PNG of the top-left `width` x `height` CSS pixels of the page at `url`, at `scale` pixels per
   * CSS pixel, on a transparent background. Waits for the page's pictures and fonts.
   */
  async screenshot(url, { width, height, scale = 2, timeout = 30000 }) {
    await this.send("Emulation.setDeviceMetricsOverride", { width: Math.ceil(width), height: Math.ceil(height), deviceScaleFactor: scale, mobile: false });
    const loaded = this.#event("Page.loadEventFired", timeout);
    await this.send("Page.navigate", { url });
    await loaded;
    await this.send("Runtime.evaluate", { expression: "document.fonts ? document.fonts.ready.then(() => 1) : 1", awaitPromise: true });
    const { data } = await this.send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width, height, scale: 1 }, fromSurface: true });
    return Buffer.from(data, "base64");
  }

  async close() {
    try { await Promise.race([this.send("Browser.close", {}, null), new Promise((r) => setTimeout(r, 3000))]); } catch {}
    this.#proc.kill();
    try { rmSync(this.#profile, { recursive: true, force: true }); } catch {}
  }
}
