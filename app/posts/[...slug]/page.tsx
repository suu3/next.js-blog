import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostComments from '@/components/post-comments';
import PostToc from '@/components/post-toc';
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

  const { blocks, headings } = parseMarkdown(post.content);

  return (
    <section className="grid gap-6 md:grid-cols-[minmax(0,1fr)_220px]">
      <article className="rounded-xl border-[2px] border-[var(--line)] bg-[var(--surface)] p-6 shadow-[2px_2px_0_0_var(--line)]">
        <p className="mb-2 inline-block rounded-md bg-[var(--theme-soft)] px-2 py-1 font-mono text-xs">{post.category}</p>
        <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">{post.title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{post.date}</p>
        <p className="mt-4 leading-7 text-[color:color-mix(in_oklab,var(--text)_85%,white)]">{post.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-1 text-sm text-[var(--muted)]">
          <span>태그:</span>
          {post.tags.length ? (
            post.tags.map((tag) => (
              <span key={tag} className="rounded border-[2px] border-[var(--line)] bg-[var(--theme-soft)] px-2 py-0.5 text-xs text-[var(--text)]">
                #{tag}
              </span>
            ))
          ) : (
            <span>없음</span>
          )}
        </div>
        <hr className="my-6 border-[var(--line)]" />

        <div className="space-y-4 prose prose-neutral max-w-none prose-a:text-[var(--theme)] prose-strong:text-[var(--text)]">
          {blocks.map((block, index) => {
            if (block.type === 'heading') {
              if (block.level === 2) {
                return (
                  <h2
                    key={`${block.id}-${index}`}
                    id={block.id}
                    className="mt-6 scroll-mt-24 text-2xl font-black tracking-tight text-[var(--text)]"
                  >
                    {block.text}
                  </h2>
                );
              }

              return (
                <h3
                  key={`${block.id}-${index}`}
                  id={block.id}
                  className="mt-4 scroll-mt-24 text-xl font-bold tracking-tight text-[var(--text)]"
                >
                  {block.text}
                </h3>
              );
            }

            if (block.type === 'list') {
              if (block.ordered) {
                return (
                  <ol key={`olist-${index}`} className="list-decimal space-y-1 pl-5 text-[var(--text)]">
                    {block.items.map((item, itemIndex) => (
                      <li key={`${item}-${itemIndex}`} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                    ))}
                  </ol>
                );
              }

              return (
                <ul key={`ulist-${index}`} className="list-disc space-y-1 pl-5 text-[var(--text)]">
                  {block.items.map((item, itemIndex) => (
                    <li key={`${item}-${itemIndex}`} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
                  ))}
                </ul>
              );
            }

            if (block.type === 'code') {
              return (
                <pre
                  key={`code-${index}`}
                  className="overflow-x-auto rounded-lg border-[2px] border-[var(--line)] bg-[var(--bg)] p-4 text-sm leading-6 text-[var(--text)]"
                >
                  {block.code}
                </pre>
              );
            }

            return (
              <p
                key={`p-${index}`}
                className="leading-8 text-[var(--text)]"
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(block.text) }}
              />
            );
          })}
        </div>

        <PostComments />

        <Link
          href="/"
          className="mt-8 inline-block rounded border-[2px] border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)] hover:bg-[var(--theme-soft)]"
        >
          ← 목록으로
        </Link>
      </article>

      <aside className="hidden md:block">
        <div className="sticky top-24 rounded-xl border-[2px] border-[var(--line)] bg-[var(--surface)] p-4 shadow-[2px_2px_0_0_var(--line)]">
          <p className="mb-3 text-sm font-black text-[var(--text)]">Index</p>
          <PostToc headings={headings} />
        </div>
      </aside>
    </section>
  );
}
