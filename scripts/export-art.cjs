// One-time production export, not an image generator. Requires sharp installed locally.
// Usage: NODE_PATH=/path/to/node_modules node scripts/export-art.cjs /path/to/generated_images/session
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');
const manifest = require('../public/art/generation.json');
const out = path.join(__dirname, '../public/art');
const source = (key) => path.join(process.argv[2], manifest[key].source);

async function sprites(key, names, size, format) {
  const { data, info } = await sharp(source(key)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const labels = new Int32Array(info.width * info.height);
  const components = [];
  let label = 0;
  for (let p = 0; p < labels.length; p++) {
    if (labels[p] || data[p * 4 + 3] < 100) continue;
    const stack = [p];
    labels[p] = ++label;
    let count = 0, left = info.width, top = info.height, right = 0, bottom = 0;
    while (stack.length) {
      const q = stack.pop(), x = q % info.width, y = Math.floor(q / info.width);
      count++; left = Math.min(left, x); right = Math.max(right, x);
      top = Math.min(top, y); bottom = Math.max(bottom, y);
      for (const v of [x > 0 ? q - 1 : -1, x < info.width - 1 ? q + 1 : -1, q - info.width, q + info.width]) {
        if (v >= 0 && v < labels.length && !labels[v] && data[v * 4 + 3] >= 100) {
          labels[v] = label; stack.push(v);
        }
      }
    }
    if (count > 500) components.push({ label, left, top, width: right - left + 1, height: bottom - top + 1 });
  }
  // Sort atlas reading order; generated icons aren't a mechanically aligned grid.
  components.sort((a, b) => Math.floor(a.top / (info.height / 2)) - Math.floor(b.top / (info.height / 2)) || a.left - b.left);
  if (components.length !== names.length) throw new Error(`Unexpected ${key} atlas components`);
  for (const [i, box] of components.entries()) {
    const pixels = Buffer.from(data);
    for (let p = 0; p < labels.length; p++) {
      // Keep antialiased fringes adjoining this component, remove neighboring sprites.
      let keep = labels[p] === box.label;
      for (let dy = -2; !keep && dy <= 2; dy++) for (let dx = -2; !keep && dx <= 2; dx++) {
        const x = p % info.width + dx, y = Math.floor(p / info.width) + dy;
        keep = x >= 0 && x < info.width && y >= 0 && y < info.height && labels[y * info.width + x] === box.label;
      }
      if (!keep) pixels[p * 4 + 3] = 0;
    }
    const { label: unused, ...crop } = box;
    await sharp(pixels, { raw: info }).extract(crop)
      .resize(size, size, { fit: 'contain', background: '#00000000' })
      .toFormat(format, { quality: 90 }).toFile(path.join(out, `${names[i]}.${format}`));
  }
}
(async () => {
  for (const key of ['paper', 'hero']) await sharp(source(key)).webp({ quality: 85 }).toFile(path.join(out, `${key}.webp`));
  for (const key of ['idle', 'hover', 'pressed', 'primary']) {
    await sharp(source(key)).extract({ left: 22, top: 312, width: 1493, height: 362 })
      .resize(900, 218).webp({ quality: 88 }).toFile(path.join(out, `plaque-${key}.webp`));
  }
  await sprites('icons', ['icon-sword', 'icon-book', 'icon-sun', 'icon-cards', 'icon-gear', 'icon-dice', 'icon-sound', 'icon-ember'], 128, 'webp');
  await sprites('cursors', ['cursor', 'pointer'], 32, 'png');
})();
