import Link from 'next/link';
import { notFound } from 'next/navigation';
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
      </article>

      <PostToc items={headings} />
    </section>
  );
}
