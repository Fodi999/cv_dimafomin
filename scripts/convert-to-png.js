// Convert SVG icons to PNG
// Run with: node scripts/convert-to-png.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [180, 192, 512, 1024];
const publicDir = path.join(__dirname, '..', 'public');

async function convertToPng() {
  for (const size of sizes) {
    const svgFile = path.join(publicDir, `icon-${size}x${size}.svg`);
    const pngFile = path.join(publicDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgFile)
        .resize(size, size)
        .png({ quality: 100, compressionLevel: 9 })
        .toFile(pngFile);
      
      console.log(`✅ Converted icon-${size}x${size}.png`);
    } catch (error) {
      console.error(`❌ Error converting ${size}x${size}:`, error.message);
    }
  }
  
  console.log('\n🎉 All PNG icons created successfully!');
}

convertToPng();
