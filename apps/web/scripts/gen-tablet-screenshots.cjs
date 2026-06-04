#!/usr/bin/env node
/**
 * Generate Play Store tablet screenshots for LiftTrack from phone screens.
 *
 * Output:
 *   ~/Productivity/hustle/liftfuel/play-assets/tablet-7in/0X-*.png   1200x1920
 *   ~/Productivity/hustle/liftfuel/play-assets/tablet-10in/0X-*.png  1600x2560
 */
const { Resvg } = require('@resvg/resvg-js');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const PLAY_ASSETS = path.join(os.homedir(), 'Productivity/hustle/liftfuel/play-assets');
const SCREEN_SRC = path.join(os.homedir(), 'Projects/liftfuel/apps/web/public/screenshots');

const SHOTS = [
  {
    file: 'today.png',
    title: 'Today, in one tap',
    sub: 'Routine, streak, macro rings, active workout — all on the home tab.',
  },
  {
    file: 'workout.png',
    title: 'Log every rep',
    sub: 'Decimal weights, drop sets, kg / lb. Rest timer auto-fires after every working set.',
  },
  {
    file: 'meal-camera.png',
    title: 'Snap the meal',
    sub: 'AI returns calories + protein + carbs + fat. No food-database lookups.',
  },
  {
    file: 'stats.png',
    title: 'Insights that read themselves',
    sub: 'Volume trends, PR detection, plateau radar, recovery patterns.',
  },
];

function render(svg, outFile, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { loadSystemFonts: true, defaultFontFamily: 'Helvetica' },
  });
  const png = resvg.render().asPng();
  fs.writeFileSync(outFile, png);
  return png.length;
}

function template({ phoneBase64, title, sub }) {
  const phoneW = 540;
  const phoneH = Math.round((phoneW * 1800) / 810);
  const phoneX = 80;
  const phoneY = (1920 - phoneH) / 2;
  const textX = phoneX + phoneW + 80;
  const textY = 480;

  const bullets = [
    'Workouts + AI meal macros in one app',
    'Decimal weights, drop sets, PR detection',
    'Private — no ads, no analytics SDKs',
    'Free forever',
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1920" viewBox="0 0 1200 1920" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="1920" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#0F1115"/>
      <stop offset="45%" stop-color="#0D9488"/>
      <stop offset="100%" stop-color="#14B8A6"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.7" cy="0.2" r="0.8">
      <stop offset="0%" stop-color="#F97316" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="#F97316" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="30" flood-color="#000000" flood-opacity="0.55"/>
    </filter>
    <clipPath id="phoneClip">
      <rect x="${phoneX}" y="${phoneY}" width="${phoneW}" height="${phoneH}" rx="36"/>
    </clipPath>
  </defs>

  <rect width="1200" height="1920" fill="url(#bg)"/>
  <rect width="1200" height="1920" fill="url(#glow)"/>

  <g stroke="#FFFFFF" stroke-opacity="0.05" stroke-width="1">
    ${Array.from({ length: 19 })
      .map((_, i) => `<line x1="${i * 64}" y1="0" x2="${i * 64}" y2="1920"/>`)
      .join('')}
    ${Array.from({ length: 30 })
      .map((_, i) => `<line x1="0" y1="${i * 64}" x2="1200" y2="${i * 64}"/>`)
      .join('')}
  </g>

  <g transform="translate(80, 80)" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif">
    <text x="0" y="0" font-weight="700" font-size="56" letter-spacing="-1.5">LiftTrack</text>
    <text x="0" y="40" fill-opacity="0.7" font-weight="500" font-size="22" letter-spacing="-0.2">Train smart. Eat smarter.</text>
  </g>

  <g filter="url(#shadow)">
    <rect x="${phoneX}" y="${phoneY}" width="${phoneW}" height="${phoneH}" rx="36" fill="#0A0A0A"/>
    <image href="data:image/png;base64,${phoneBase64}" x="${phoneX + 6}" y="${phoneY + 6}" width="${phoneW - 12}" height="${phoneH - 12}" preserveAspectRatio="xMidYMid slice" clip-path="url(#phoneClip)"/>
  </g>

  <g transform="translate(${textX}, ${textY})" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif">
    <text x="0" y="0" font-weight="700" font-size="58" letter-spacing="-1.5">${escapeXml(title)}</text>
    <foreignObject x="0" y="40" width="500" height="200">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Helvetica,Arial,sans-serif;font-size:24px;line-height:1.45;color:#FFFFFFE5;font-weight:500;">${escapeXml(sub)}</div>
    </foreignObject>
    ${bullets
      .map(
        (b, i) =>
          `<g transform="translate(0, ${260 + i * 56})">
            <circle cx="14" cy="14" r="6" fill="#F97316"/>
            <text x="36" y="20" font-weight="500" font-size="22" fill-opacity="0.9">${escapeXml(b)}</text>
          </g>`,
      )
      .join('')}
  </g>

  <g transform="translate(80, 1800)">
    <rect width="320" height="64" rx="32" fill="#FFFFFF" fill-opacity="0.18"/>
    <text x="160" y="42" text-anchor="middle" fill="#FFFFFF" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="22">Get on Google Play</text>
  </g>
</svg>`;
}

function escapeXml(s) {
  return s.replace(/[<>&"']/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]),
  );
}

async function main() {
  for (const dir of [
    path.join(PLAY_ASSETS, 'tablet-7in'),
    path.join(PLAY_ASSETS, 'tablet-10in'),
  ]) {
    fs.mkdirSync(dir, { recursive: true });
  }

  for (const [i, shot] of SHOTS.entries()) {
    const src = path.join(SCREEN_SRC, shot.file);
    if (!fs.existsSync(src)) {
      console.error(`MISSING: ${src}`);
      continue;
    }
    const phoneBase64 = fs.readFileSync(src).toString('base64');
    const svg = template({ ...shot, phoneBase64 });

    const idx = String(i + 1).padStart(2, '0');
    const slug = shot.file.replace(/\.png$/, '');

    const out7 = path.join(PLAY_ASSETS, 'tablet-7in', `${idx}-${slug}-tablet7.png`);
    const size7 = render(svg, out7, 1200);
    console.log(`  wrote ${path.relative(PLAY_ASSETS, out7)} (${(size7 / 1024).toFixed(0)} KB)`);

    const out10 = path.join(PLAY_ASSETS, 'tablet-10in', `${idx}-${slug}-tablet10.png`);
    const size10 = render(svg, out10, 1600);
    console.log(`  wrote ${path.relative(PLAY_ASSETS, out10)} (${(size10 / 1024).toFixed(0)} KB)`);
  }

  console.log('\ndone');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
