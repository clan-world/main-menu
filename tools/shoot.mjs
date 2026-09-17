// Headless Chrome screenshot via CDP with a real wait (entry animations, fonts, images).
// Usage: node tools/shoot.mjs <url> <out.png> <width> <height> [waitMs] [mobile]
// Uses the `ws` package (devDependency) for the CDP socket.
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import WebSocket from "ws";

const [url, out, w = "1440", h = "900", waitMs = "2500", mobile = "0"] = process.argv.slice(2);
const port = 9222 + Math.floor(Math.random() * 1000);
const chrome = spawn("google-chrome", [
  "--headless=new", "--no-sandbox", "--disable-gpu", "--hide-scrollbars", "--disable-dev-shm-usage",
  `--remote-debugging-port=${port}`, `--window-size=${w},${h}`, "about:blank",
], { stdio: "ignore" });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let target;
for (let i = 0; i < 50; i++) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/json`);
    const list = await res.json();
    target = list.find((t) => t.type === "page");
    if (target) break;
  } catch {}
  await sleep(200);
}
if (!target) { chrome.kill(); throw new Error("chrome did not start"); }

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = (e) => rej(new Error("ws error " + (e.message || ""))); ws.onclose = (e) => rej(new Error("ws closed " + e.code)); });
let id = 0;
const pending = new Map();
const failures = [];
const consoleErrors = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data.toString());
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  if (msg.method === "Network.loadingFailed") failures.push(msg.params);
  if (msg.method === "Network.responseReceived" && msg.params.response.status >= 400)
    failures.push({ url: msg.params.response.url, status: msg.params.response.status });
  if (msg.method === "Runtime.exceptionThrown") consoleErrors.push(msg.params.exceptionDetails.text);
  if (msg.method === "Log.entryAdded" && msg.params.entry.level === "error") consoleErrors.push(msg.params.entry.text);
};
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });

await send("Network.enable");
await send("Runtime.enable");
await send("Log.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: +w, height: +h, deviceScaleFactor: mobile === "1" ? 2 : 1, mobile: mobile === "1",
});
if (mobile === "1") await send("Emulation.setTouchEmulationEnabled", { enabled: true });
await send("Page.enable");
await send("Page.navigate", { url });
await sleep(+waitMs);
const shot = await send("Page.captureScreenshot", { format: "png" });
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, Buffer.from(shot.result.data, "base64"));
const layout = await send("Runtime.evaluate", { expression: `JSON.stringify({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight, ch: document.documentElement.clientHeight, broken: [...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)})`, returnByValue: true });
console.log("layout", layout.result.result.value);
console.log("network failures", JSON.stringify(failures));
console.log("console errors", JSON.stringify(consoleErrors));
ws.close();
chrome.kill();
