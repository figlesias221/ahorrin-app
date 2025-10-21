import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const logo = readFileSync(join(__dirname, '../public/logo.svg'));

// Generate different sizes for favicon
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

Promise.all(
  sizes.map(({ size, name }) =>
    sharp(logo)
      .resize(size, size)
      .png({ quality: 95 })
      .toFile(join(__dirname, '../public', name))
      .then(() => console.log(`✅ ${name} generated (${size}x${size})`))
  )
).then(() => {
  console.log('✅ All favicons generated successfully');
}).catch(err => {
  console.error('❌ Error generating favicons:', err);
  process.exit(1);
});
