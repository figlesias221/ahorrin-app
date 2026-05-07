/**
 * Editorial sweep: stamp `lastReviewed` on every blog post.
 *
 * Usage: `npx tsx scripts/mark-posts-reviewed.ts [YYYY-MM-DD]`
 *
 * Without an argument, uses today's date. Idempotent — overwrites the
 * existing `lastReviewed` field if present, leaves all other frontmatter
 * keys untouched.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dir = path.join(process.cwd(), 'content/blog');
const arg = process.argv[2];
const reviewed = arg && /^\d{4}-\d{2}-\d{2}$/.test(arg)
  ? arg
  : new Date().toISOString().slice(0, 10);

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));

let updated = 0;
for (const file of files) {
  const full = path.join(dir, file);
  const raw = fs.readFileSync(full, 'utf8');
  const parsed = matter(raw);
  const next = { ...parsed.data, lastReviewed: reviewed };
  const out = matter.stringify(parsed.content, next);
  if (out !== raw) {
    fs.writeFileSync(full, out);
    updated++;
  }
}

console.log(`Stamped lastReviewed=${reviewed} on ${updated}/${files.length} posts.`);
