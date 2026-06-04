#!/usr/bin/env node
/**
 * Generate the 1024×500 Play Store feature graphic for LiftTrack.
 *
 *   node apps/web/scripts/gen-play-feature-graphic.cjs
 *
 * Output:
 *   ~/Productivity/hustle/liftfuel/play-assets/feature-graphic-1024x500.png
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1024" y2="500" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F1115"/>
      <stop offset="45%" stop-color="#14B8A6"/>
      <stop offset="100%" stop-color="#F97316"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.3" r="0.7">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="500" fill="url(#bg)"/>
  <rect width="1024" height="500" fill="url(#glow)"/>

  <g stroke="#FFFFFF" stroke-opacity="0.06" stroke-width="1">
    ${Array.from({ length: 16 })
      .map((_, i) => `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="500"/>`)
      .join('')}
    ${Array.from({ length: 8 })
      .map((_, i) => `<line x1="0" y1="${i * 64}" x2="1024" y2="${i * 64}"/>`)
      .join('')}
  </g>

  <g fill="#FFFFFF" fill-opacity="0.7">
    <circle cx="900" cy="80" r="3"/>
    <circle cx="940" cy="120" r="2"/>
    <circle cx="970" cy="60" r="4"/>
    <circle cx="850" cy="100" r="2"/>
  </g>

  <g transform="translate(80, 170)">
    <rect width="160" height="160" rx="32" fill="#FFFFFF"/>
    <g transform="translate(80, 80)">
      <rect x="-36" y="-5" width="72" height="10" rx="5" fill="#14B8A6"/>
      <rect x="-44" y="-22" width="12" height="44" rx="4" fill="#14B8A6"/>
      <rect x="32" y="-22" width="12" height="44" rx="4" fill="#14B8A6"/>
      <rect x="-56" y="-14" width="8" height="28" rx="3" fill="#F97316"/>
      <rect x="48" y="-14" width="8" height="28" rx="3" fill="#F97316"/>
    </g>
  </g>

  <g transform="translate(280, 210)" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif">
    <text x="0" y="0" font-weight="700" font-size="78" letter-spacing="-2">LiftTrack</text>
    <text x="0" y="60" fill-opacity="0.92" font-weight="500" font-size="34" letter-spacing="-0.5">Train smart. Eat smarter.</text>
    <text x="0" y="105" fill-opacity="0.7" font-weight="400" font-size="20">Workouts + AI meal macros, in one app</text>
  </g>

  <g transform="translate(720, 380)">
    <rect width="220" height="48" rx="24" fill="#FFFFFF" fill-opacity="0.18"/>
    <text x="110" y="32" text-anchor="middle" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="18">Free · Private · India-hosted</text>
  </g>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1024 },
  font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica' },
});

const png = resvg.render().asPng();
const out = path.join(
  os.homedir(),
  'Productivity/hustle/liftfuel/play-assets/feature-graphic-1024x500.png',
);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, png);
console.log(`Wrote ${out} (${png.length} bytes, 1024×500)`);
