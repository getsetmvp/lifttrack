#!/usr/bin/env node
/**
 * Generate LiftTrack mobile app icons from inline SVG.
 *
 * Outputs to ~/Projects/liftfuel/apps/mobile/assets/images/:
 *   - icon.png            1024x1024  full mark (gradient bg + barbell)
 *   - adaptive-icon.png   1024x1024  foreground only (barbell, transparent bg)
 *   - favicon.png         48x48      icon scaled
 *   - splash-icon.png     1024x1024  centered mark for splash screen
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const OUT = path.join(os.homedir(), 'Projects/liftfuel/apps/mobile/assets/images');

const ICON_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#14B8A6"/>
      <stop offset="100%" stop-color="#F97316"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.2" r="0.7">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.16"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" rx="240" fill="url(#bg)"/>
  <rect width="1024" height="1024" rx="240" fill="url(#glow)"/>
  ${barbell(512, 512, 1)}
</svg>`;

const ADAPTIVE_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  ${barbell(512, 512, 0.85)}
</svg>`;

const SPLASH_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="1024" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#14B8A6"/>
      <stop offset="100%" stop-color="#F97316"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="240" fill="url(#bg)"/>
  ${barbell(512, 512, 1)}
</svg>`;

function barbell(cx, cy, scale) {
  // Center barbell + plates, white, drawn around (cx, cy)
  const s = scale;
  const barW = 460 * s;
  const barH = 68 * s;
  const plate1W = 76 * s;
  const plate1H = 280 * s;
  const plate2W = 56 * s;
  const plate2H = 180 * s;
  const gap = 18 * s;

  const barX = cx - barW / 2;
  const barY = cy - barH / 2;

  const leftP1X = barX - plate1W;
  const leftP2X = leftP1X - plate2W - gap;
  const rightP1X = barX + barW;
  const rightP2X = rightP1X + plate1W + gap;

  return `
    <!-- Bar -->
    <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="${barH / 2}" fill="#FFFFFF"/>
    <!-- Inner plates (left + right) -->
    <rect x="${leftP1X}" y="${cy - plate1H / 2}" width="${plate1W}" height="${plate1H}" rx="${24 * s}" fill="#FFFFFF"/>
    <rect x="${rightP1X}" y="${cy - plate1H / 2}" width="${plate1W}" height="${plate1H}" rx="${24 * s}" fill="#FFFFFF"/>
    <!-- Outer plates (left + right) -->
    <rect x="${leftP2X}" y="${cy - plate2H / 2}" width="${plate2W}" height="${plate2H}" rx="${20 * s}" fill="#FFFFFF" fill-opacity="0.92"/>
    <rect x="${rightP2X}" y="${cy - plate2H / 2}" width="${plate2W}" height="${plate2H}" rx="${20 * s}" fill="#FFFFFF" fill-opacity="0.92"/>
  `;
}

function render(svg, outFile, width) {
  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: width } });
  const png = resvg.render().asPng();
  fs.writeFileSync(outFile, png);
  return png.length;
}

const TARGETS = [
  { name: 'icon.png', svg: ICON_SVG, w: 1024 },
  { name: 'adaptive-icon.png', svg: ADAPTIVE_SVG, w: 1024 },
  { name: 'favicon.png', svg: ICON_SVG, w: 48 },
  { name: 'splash-icon.png', svg: SPLASH_SVG, w: 1024 },
];

for (const t of TARGETS) {
  const out = path.join(OUT, t.name);
  const size = render(t.svg, out, t.w);
  console.log(`  wrote ${out} (${(size / 1024).toFixed(0)} KB, ${t.w}x${t.w})`);
}
console.log('done');
