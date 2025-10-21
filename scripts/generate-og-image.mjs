import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svg = readFileSync(join(__dirname, '../public/og-image.svg'));

sharp(svg)
  .resize(1200, 630)
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(join(__dirname, '../public/og-image.png'))
  .then(() => {
    console.log('✅ og-image.png generated successfully (1200x630px)');
  })
  .catch(err => {
    console.error('❌ Error generating og-image.png:', err);
    process.exit(1);
  });
