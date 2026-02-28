import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostMarkdown from '@/components/post-markdown';
import PostToc from '@/components/post-toc';
import PostComments from '@/components/post-comments';
import { extractHeadings } from '@/lib/markdown';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

type Props = {
  params: Promise<{ slug: string[] }>;
};

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

type Block =
  | { type: 'heading'; level: 2 | 3; text: string; id: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'code'; code: string };

function toHeadingId(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[~`!@#$%^&*()+={}[\]|\\:;"'<>,.?/]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function createUniqueHeadingId(text: string, idCountMap: Map<string, number>) {
  const normalized = toHeadingId(text) || 'section';
  const count = (idCountMap.get(normalized) ?? 0) + 1;
  idCountMap.set(normalized, count);

  if (count === 1) {
    return normalized;
  }

  return `${normalized}-${count}`;
}

function formatInlineMarkdown(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}

function parseMarkdown(content: string): { blocks: Block[]; headings: Heading[] } {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  const headings: Heading[] = [];
  const idCountMap = new Map<string, number>();

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      blocks.push({ type: 'code', code: codeLines.join('\n') });
      i += 1;
      continue;
    }

    if (line.startsWith('# ')) {
      const text = line.replace(/^#\s+/, '').trim();
      const id = createUniqueHeadingId(text, idCountMap);
      headings.push({ id, text, level: 2 });
      blocks.push({ type: 'heading', level: 2, text, id });
      i += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      const text = line.replace(/^##\s+/, '').trim();
      const id = createUniqueHeadingId(text, idCountMap);
      headings.push({ id, text, level: 2 });
      blocks.push({ type: 'heading', level: 2, text, id });
      i += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      const text = line.replace(/^###\s+/, '').trim();
      const id = createUniqueHeadingId(text, idCountMap);
      headings.push({ id, text, level: 3 });
      blocks.push({ type: 'heading', level: 3, text, id });
      i += 1;
      continue;
    }

    if (line.startsWith('- ') || /^\d+\.\s+/.test(line.trimStart())) {
      const ordered = /^\d+\.\s+/.test(line.trimStart());
      const items: string[] = [];

      while (
        i < lines.length &&
        lines[i].trim() &&
        (lines[i].trimStart().startsWith('- ') || /^\d+\.\s+/.test(lines[i].trimStart()))
      ) {
        const currentLine = lines[i].trimStart();
        items.push(ordered ? currentLine.replace(/^\d+\.\s+/, '') : currentLine.replace(/^-\s+/, ''));
        i += 1;
      }

      blocks.push({ type: 'list', ordered, items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('# ') &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !lines[i].startsWith('```') &&
      !lines[i].trimStart().startsWith('- ') &&
      !/^\d+\.\s+/.test(lines[i].trimStart())
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
    }

    if (!paragraphLines.length) {
      i += 1;
      continue;
    }

    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }

  return { blocks, headings };
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({
    slug: post.slug.split('/').map(encodeURIComponent),
  }));
}

export default async function PostDetailPage({ params }: Props) {
  const { slug: slugSegments } = await params;
  const slug = slugSegments.map(decodeURIComponent).join('/');
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const headings = extractHeadings(post.content);

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
      <article className="rounded-xl border border-[#2a2b31] bg-white p-6 shadow-[4px_4px_0_0_#2a2b31] md:p-8">
        <p className="mb-3 inline-block rounded-md bg-[#ffddca] px-2 py-1 font-mono text-xs">{post.category}</p>
        <h1 className="text-3xl font-black tracking-tight text-[#111827]">{post.title}</h1>
        <p className="mt-2 text-sm text-gray-500">{post.date}</p>
        <p className="mt-4 text-lg leading-8 text-gray-700">{post.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {(post.tags.length ? post.tags : ['없음']).map((tag) => (
            <span key={tag} className="rounded-md border border-[#2a2b31] bg-[#fff8f4] px-2 py-1 text-xs font-semibold text-[#374151]">
              #{tag}
            </span>
          ))}
        </div>

        <hr className="my-6 border-[#2a2b31]" />

        <div className="markdown-body">
          <PostMarkdown content={post.content} />
        </div>

        <Link
          href="/"
          prefetch={false}
          className="mt-8 inline-flex items-center rounded-md border border-[#2a2b31] bg-[#fff8f4] px-3 py-2 text-sm font-semibold transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#ffddca] hover:shadow-[3px_3px_0_0_#2a2b31]"
        >
          ← 목록으로
        </Link>

        <PostComments issueTerm={post.slug} />
      </article>

      <PostToc items={headings} />
    </section>
  );
}
