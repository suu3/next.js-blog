import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const PUBLIC_ASSET_DIR = path.join(process.cwd(), 'public', 'content-assets');

let assetsPrepared = false;

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

function syncDirectoryAssets(sourceDir: string, targetDir: string) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const entries = fs.readdirSync(sourceDir, { withFileTypes: true });

  entries.forEach((entry) => {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      syncDirectoryAssets(sourcePath, targetPath);
      return;
    }

    if (!entry.name.endsWith('.md')) {
      fs.copyFileSync(sourcePath, targetPath);
    }
  });
}

function ensureContentAssets() {
  if (assetsPrepared) {
    return;
  }

  syncDirectoryAssets(CONTENT_DIR, PUBLIC_ASSET_DIR);
  assetsPrepared = true;
}

function createSlug(filePath: string): string {
  return path.relative(CONTENT_DIR, filePath).replace(/\\/g, '/').replace(/\.md$/, '');
}

function normalizeMarkdownImagePath(rawPath: string, postSlug: string): string {
  if (!rawPath) {
    return rawPath;
  }

  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('/')) {
    return rawPath;
  }

  const slugSegments = postSlug.split('/');
  slugSegments.pop();
  const baseDir = slugSegments.join('/');
  const resolvedPath = path.posix.normalize(path.posix.join(baseDir, rawPath));

  return `/content-assets/${resolvedPath}`;
}

function normalizeContentImages(content: string, postSlug: string): string {
  return content.replace(/!\[([^\]]*)\]\(([^\s\)]+)(?:\s+"([^"]+)")?\)/g, (_m, alt, imagePath, title) => {
    const normalizedPath = normalizeMarkdownImagePath(imagePath, postSlug);

    if (title) {
      return `![${alt}](${normalizedPath} "${title}")`;
    }

    return `![${alt}](${normalizedPath})`;
  });
}

function parsePost(filePath: string): PostDetail {
  ensureContentAssets();

  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const frontmatter = data as FrontMatter;
  const slug = createSlug(filePath);

  return {
    slug,
    title: frontmatter.title ?? path.basename(filePath, '.md'),
    date: frontmatter.date ?? '1970-01-01',
    description: frontmatter.description ?? '',
    category: frontmatter.category ?? '미분류',
    tags: frontmatter.tag ?? [],
    thumbnail: frontmatter.thumbnail?.startsWith('http') || frontmatter.thumbnail?.startsWith('/')
      ? frontmatter.thumbnail
      : '/images/dummy.jpg',
    content: normalizeContentImages(content, slug),
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
