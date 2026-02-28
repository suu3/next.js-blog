import Link from 'next/link';
import { notFound } from 'next/navigation';
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
  | { type: 'list'; items: string[] }
  | { type: 'code'; code: string };

function toHeadingId(text: string) {
  return encodeURIComponent(
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[.,!?()[\]{}'"`~:@#$%^&*+=<>/\\|]/g, ''),
  );
}

function parseMarkdown(content: string): { blocks: Block[]; headings: Heading[] } {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  const headings: Heading[] = [];

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

    if (line.startsWith('## ')) {
      const text = line.replace(/^##\s+/, '').trim();
      const id = toHeadingId(text);
      headings.push({ id, text, level: 2 });
      blocks.push({ type: 'heading', level: 2, text, id });
      i += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      const text = line.replace(/^###\s+/, '').trim();
      const id = toHeadingId(text);
      headings.push({ id, text, level: 3 });
      blocks.push({ type: 'heading', level: 3, text, id });
      i += 1;
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trimStart().startsWith('- ')) {
        items.push(lines[i].trimStart().replace(/^-\s+/, ''));
        i += 1;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !lines[i].startsWith('```') &&
      !lines[i].trimStart().startsWith('- ')
    ) {
      paragraphLines.push(lines[i].trim());
      i += 1;
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
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
      <article className="rounded-xl border border-[#2a2b31] bg-white p-6 shadow-[4px_4px_0_0_#2a2b31]">
        <p className="mb-2 inline-block rounded-md bg-[#ffddca] px-2 py-1 font-mono text-xs">{post.category}</p>
        <h1 className="text-3xl font-black tracking-tight">{post.title}</h1>
        <p className="mt-2 text-sm text-gray-500">{post.date}</p>
        <p className="mt-4 leading-7 text-gray-700">{post.description}</p>
        <p className="mt-3 text-sm text-gray-600">태그: {post.tags.join(', ') || '없음'}</p>
        <hr className="my-6 border-[#2a2b31]" />

        <div className="space-y-4">
          {blocks.map((block, index) => {
            if (block.type === 'heading') {
              if (block.level === 2) {
                return (
                  <h2 key={`${block.id}-${index}`} id={block.id} className="mt-6 text-2xl font-black tracking-tight">
                    {block.text}
                  </h2>
                );
              }

              return (
                <h3 key={`${block.id}-${index}`} id={block.id} className="mt-4 text-xl font-bold tracking-tight">
                  {block.text}
                </h3>
              );
            }

            if (block.type === 'list') {
              return (
                <ul key={`list-${index}`} className="list-disc space-y-1 pl-5 text-gray-800">
                  {block.items.map((item, itemIndex) => (
                    <li key={`${item}-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              );
            }

            if (block.type === 'code') {
              return (
                <pre
                  key={`code-${index}`}
                  className="overflow-x-auto rounded-lg border border-[#2a2b31] bg-[#f6f3ef] p-4 text-sm leading-6"
                >
                  {block.code}
                </pre>
              );
            }

            return (
              <p key={`p-${index}`} className="leading-8 text-gray-800">
                {block.text}
              </p>
            );
          })}
        </div>

        <Link href="/" className="mt-8 inline-block rounded border border-[#2a2b31] px-3 py-2 text-sm hover:bg-[#ffddca]">
          ← 목록으로
        </Link>
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-xl border border-[#2a2b31] bg-white p-4 shadow-[4px_4px_0_0_#2a2b31]">
          <p className="mb-3 text-sm font-black">글 제목</p>
          {headings.length === 0 ? (
            <p className="text-xs text-gray-500">표시할 목차가 없습니다.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {headings.map((heading) => (
                <li key={heading.id} className={heading.level === 3 ? 'pl-3' : ''}>
                  <a href={`#${heading.id}`} className="text-gray-700 hover:text-[#ff6737] hover:underline">
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </section>
  );
}
