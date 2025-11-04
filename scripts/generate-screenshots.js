// Generate placeholder screenshots for PWA
// Run with: node scripts/generate-screenshots.js

const sharp = require('sharp');
const path = require('path');

const screenshotsDir = path.join(__dirname, '..', 'public', 'screenshots');

// iPhone 14 Pro Max dimensions
const width = 1284;
const height = 2778;

const generateScreenshot = async (filename, title, subtitle) => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#1E1A41;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2B6A79;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#3BC864;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#C5E98A;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <rect width="${width}" height="${height}" fill="url(#bg)"/>
      
      <rect y="0" width="${width}" height="120" fill="#1E1A41" opacity="0.5"/>
      
      <g transform="translate(${width/2}, ${height * 0.3})">
        <circle r="140" fill="url(#accent)" opacity="0.2"/>
        <text 
          text-anchor="middle" 
          y="20" 
          font-family="Arial, sans-serif" 
          font-size="120" 
          font-weight="bold" 
          fill="url(#accent)">
          DF
        </text>
      </g>
      
      <text 
        x="${width/2}" 
        y="${height * 0.55}" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="80" 
        font-weight="bold" 
        fill="#FEF9F5">
        ${title}
      </text>
      
      <text 
        x="${width/2}" 
        y="${height * 0.62}" 
        text-anchor="middle" 
        font-family="Arial, sans-serif" 
        font-size="48" 
        fill="#C5E98A">
        ${subtitle}
      </text>
      
      <rect 
        y="${height - 200}" 
        width="${width}" 
        height="200" 
        fill="url(#accent)" 
        opacity="0.1"/>
    </svg>
  `;

  const buffer = Buffer.from(svg);
  
  await sharp(buffer)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(path.join(screenshotsDir, filename));
  
  console.log(`✅ Created ${filename}`);
};

async function generateScreenshots() {
  try {
    await generateScreenshot(
      'home-mobile.png',
      'Dima Fomin',
      'Professional Chef'
    );
    
    await generateScreenshot(
      'dashboard-mobile.png',
      'Culinary Academy',
      'Courses Dashboard'
    );
    
    console.log('\n🎉 All screenshots created successfully!');
  } catch (error) {
    console.error('❌ Error generating screenshots:', error);
  }
}

generateScreenshots();
