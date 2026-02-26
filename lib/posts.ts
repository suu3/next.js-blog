import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

type FrontMatter = {
  title?: string;
  date?: string;
  description?: string;
  category?: string;
  tag?: string[];
  thumbnail?: string;
};

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  description: string;
  category: string;
  tags: string[];
  thumbnail: string;
};

export type PostDetail = PostSummary & {
  content: string;
};

function getMarkdownFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const resolvedPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      return getMarkdownFiles(resolvedPath);
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      return [resolvedPath];
    }

    return [];
  });
}

function createSlug(filePath: string): string {
  return path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/').replace(/\.md$/, '');
}

function parsePost(filePath: string): PostDetail {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = data as FrontMatter;

  return {
    slug: createSlug(filePath),
    title: frontmatter.title ?? path.basename(filePath, '.md'),
    date: frontmatter.date ?? '1970-01-01',
    description: frontmatter.description ?? '',
    category: frontmatter.category ?? '미분류',
    tags: frontmatter.tag ?? [],
    thumbnail: frontmatter.thumbnail?.startsWith('http') || frontmatter.thumbnail?.startsWith('/')
      ? frontmatter.thumbnail
      : '/images/dummy.jpg',
    content,
  } satisfies PostDetail;
}

export function getAllPosts(): PostSummary[] {
  return getMarkdownFiles(CONTENT_DIR)
    .map(parsePost)
    .map(({ content: _content, ...summary }) => summary)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): PostDetail | null {
  const matchedPath = getMarkdownFiles(CONTENT_DIR).find((filePath) => createSlug(filePath) === slug);

  if (!matchedPath) {
    return null;
  }

  return parsePost(matchedPath);
}

export function getCategoriesWithCount(posts: PostSummary[]) {
  return posts.reduce<Record<string, number>>((acc, post) => {
    acc[post.category] = (acc[post.category] ?? 0) + 1;
    return acc;
  }, {});
}

