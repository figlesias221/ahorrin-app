import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const screenshotsDir = join(__dirname, '../public/screenshots');

// Get all PNG files in screenshots directory
const files = readdirSync(screenshotsDir)
  .filter(file => file.endsWith('.png'))
  .map(file => join(screenshotsDir, file));

console.log(`Found ${files.length} screenshots to optimize`);

// Optimize each screenshot
Promise.all(
  files.map(async (file) => {
    const originalSize = statSync(file).size;
    const outputFile = file.replace('.png', '.webp');

    await sharp(file)
      .webp({ quality: 85, effort: 6 })
      .toFile(outputFile);

    const webpSize = statSync(outputFile).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(`✅ ${file.split('/').pop()}: ${(originalSize / 1024).toFixed(0)}KB → ${(webpSize / 1024).toFixed(0)}KB (${savings}% smaller)`);
  })
).then(() => {
  console.log('\n✅ All screenshots optimized to WebP format');
  console.log('💡 Tip: Use OptimizedImage component to serve these images');
}).catch(err => {
  console.error('❌ Error optimizing screenshots:', err);
  process.exit(1);
});
