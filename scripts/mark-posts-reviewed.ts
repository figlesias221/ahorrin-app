/**
 * Editorial sweep: stamp `lastReviewed` on a SINGLE blog post.
 *
 * Usage: `npx tsx scripts/mark-posts-reviewed.ts <slug> [YYYY-MM-DD]`
 *
 * Example: `npx tsx scripts/mark-posts-reviewed.ts irpf-uruguay-2026-guia-completa-tramos-deducciones 2026-05-22`
 *
 * Per-post by design — batch stamping all posts with the same date is read
 * by Google as "gaming E-E-A-T" and was the likely trigger of the second
 * AdSense rejection. Review each post individually and stamp it with the
 * real review date.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const slug = process.argv[2];
const dateArg = process.argv[3];

if (!slug) {
  console.error('Usage: npx tsx scripts/mark-posts-reviewed.ts <slug> [YYYY-MM-DD]');
  process.exit(1);
}

const reviewed = dateArg && /^\d{4}-\d{2}-\d{2}$/.test(dateArg)
  ? dateArg
  : new Date().toISOString().slice(0, 10);

const dir = path.join(process.cwd(), 'content/blog');
const full = path.join(dir, `${slug}.mdx`);

if (!fs.existsSync(full)) {
  console.error(`Post not found: ${full}`);
  process.exit(1);
}

const raw = fs.readFileSync(full, 'utf8');
const parsed = matter(raw);
const next = { ...parsed.data, lastReviewed: reviewed };
const out = matter.stringify(parsed.content, next);

if (out === raw) {
  console.log(`No change for ${slug} (already at ${reviewed}).`);
} else {
  fs.writeFileSync(full, out);
  console.log(`Stamped lastReviewed=${reviewed} on ${slug}.`);
}
