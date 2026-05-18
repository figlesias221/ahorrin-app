/**
 * One-off cleanup: remove `lastReviewed` from every post that still carries
 * the 2026-05-07 batch stamp. The batch stamp was a signal Google read as
 * "gaming E-E-A-T" — better to admit no recent review than to fake one.
 *
 * After this runs, `lastReviewed` is re-added only by `mark-posts-reviewed.ts`
 * on a per-slug basis, as posts are genuinely reviewed.
 *
 * Usage: `npx tsx scripts/unstamp-batch-reviews.ts`
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BATCH_DATE = '2026-05-07';
const dir = path.join(process.cwd(), 'content/blog');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

let stripped = 0;
let skipped = 0;

for (const file of files) {
  const full = path.join(dir, file);
  const raw = fs.readFileSync(full, 'utf8');
  const parsed = matter(raw);
  const current = parsed.data.lastReviewed;

  if (current !== BATCH_DATE) {
    skipped++;
    continue;
  }

  const { lastReviewed: _unused, ...rest } = parsed.data;
  void _unused;
  const out = matter.stringify(parsed.content, rest);
  fs.writeFileSync(full, out);
  stripped++;
}

console.log(`Stripped batch lastReviewed=${BATCH_DATE} from ${stripped} posts. Skipped ${skipped}.`);
