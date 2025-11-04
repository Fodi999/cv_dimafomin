// Script to generate PNG icons from SVG
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

const sizes = [180, 192, 512, 1024];

const svgTemplate = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#3BC864;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C5E98A;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#1E1A41"/>
  <text x="50%" y="${size * 0.42}" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size * 0.35}" font-weight="bold" fill="url(#grad)">DF</text>
  <text x="50%" y="${size * 0.68}" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="${size * 0.12}" fill="#C5E98A" opacity="0.9">CHEF</text>
</svg>`;

const publicDir = path.join(__dirname, '..', 'public');

sizes.forEach(size => {
  const svg = svgTemplate(size);
  const filename = `icon-${size}x${size}.svg`;
  fs.writeFileSync(path.join(publicDir, filename), svg);
  console.log(`✅ Created ${filename}`);
});

console.log('\n📝 To convert to PNG, install sharp and run:');
console.log('npm install sharp');
console.log('node scripts/convert-to-png.js\n');
