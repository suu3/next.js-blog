import Link from 'next/link';
import { notFound } from 'next/navigation';
import PostActions from '@/components/post-actions';
import PostComments from '@/components/post-comments';
import PostMarkdown from '@/components/post-markdown';
import PostToc from '@/components/post-toc';
import { extractHeadings } from '@/lib/markdown';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

type Props = {
  params: Promise<{ slug: string[] }>;
};

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
      <article className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[4px_4px_0_0_var(--line)] md:p-8">
        <p className="mb-3 inline-block rounded-md bg-[var(--theme-soft)] px-2 py-1 font-mono text-xs">{post.category}</p>
        <h1 className="text-3xl font-black tracking-tight">{post.title}</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{post.date}</p>
        <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{post.description}</p>

        <PostActions />

        <div className="mt-4 flex flex-wrap gap-2">
          {(post.tags.length ? post.tags : ['없음']).map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="rounded-md border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs font-semibold transition hover:bg-[var(--theme-soft)]"
            >
              #{tag}
            </Link>
          ))}
        </div>

        <hr className="my-6 border-[var(--line)]" />

        <div className="markdown-body">
          <PostMarkdown content={post.content} />
        </div>

        <Link
          href="/"
          prefetch={false}
          className="mt-8 inline-flex items-center rounded-md border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[var(--theme-soft)]"
        >
          ← 목록으로
        </Link>

        <PostComments issueTerm={post.slug} />
      </article>

      <PostToc items={headings} />
    </section>
  );
}
