import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPostMetadata {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  lastReviewed?: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
  };
  keywords: string[];
  slug?: string;
}

export interface BlogPost extends BlogPostMetadata {
  slug: string;
  content: string;
}

/**
 * Get all blog post slugs
 */
export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  const files = fs.readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''));
}

/**
 * Get metadata for a single post
 */
export function getPostMetadata(slug: string): BlogPostMetadata | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      ...data,
      slug,
    } as BlogPostMetadata;
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error);
    return null;
  }
}

/**
 * Get metadata for all posts
 */
export function getAllPostsMetadata(): BlogPostMetadata[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map((slug) => getPostMetadata(slug))
    .filter((post): post is BlogPostMetadata => post !== null)
    .sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  return posts;
}

/**
 * Convert a category name to a URL-safe slug.
 * Example: "Bancos y Tarjetas" -> "bancos-y-tarjetas"
 */
export function categoryToSlug(category: string): string {
  return category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Get all unique categories with post counts and slugs.
 */
export function getAllCategories(): { name: string; slug: string; count: number }[] {
  const posts = getAllPostsMetadata();
  const counts = posts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([name, count]) => ({ name, slug: categoryToSlug(name), count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Get all posts in a given category by slug.
 */
export function getPostsByCategorySlug(slug: string): BlogPostMetadata[] {
  return getAllPostsMetadata().filter(
    (p) => categoryToSlug(p.category) === slug
  );
}

/**
 * Get the category metadata (name, slug) given a slug.
 */
export function getCategoryBySlug(
  slug: string
): { name: string; slug: string; count: number } | null {
  return getAllCategories().find((c) => c.slug === slug) || null;
}

/**
 * Get up to `limit` posts related to the given slug.
 * Priority: same category first, then most recent posts.
 */
export function getRelatedPosts(slug: string, limit = 3): BlogPostMetadata[] {
  const all = getAllPostsMetadata();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.filter((p) => p.slug !== slug).slice(0, limit);

  const sameCategory = all.filter(
    (p) => p.slug !== slug && p.category === current.category
  );
  const others = all.filter(
    (p) => p.slug !== slug && p.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, limit);
}

/**
 * Get full post data including content
 */
export function getPostBySlug(slug: string) {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      metadata: {
        ...data,
        slug,
      } as BlogPostMetadata,
      content, // Return raw content string for MDXRemote RSC
    };
  } catch (error) {
    console.error(`Error loading post ${slug}:`, error);
    return null;
  }
}
