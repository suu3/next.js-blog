import Link from 'next/link';
import { notFound } from 'next/navigation';
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

  return (
    <article className="rounded-xl border border-[#2a2b31] bg-white p-6 shadow-[4px_4px_0_0_#2a2b31]">
      <p className="mb-2 inline-block rounded-md bg-[#ffddca] px-2 py-1 font-mono text-xs">{post.category}</p>
      <h1 className="text-3xl font-black tracking-tight">{post.title}</h1>
      <p className="mt-2 text-sm text-gray-500">{post.date}</p>
      <p className="mt-4 leading-7 text-gray-700">{post.description}</p>
      <p className="mt-3 text-sm text-gray-600">태그: {post.tags.join(', ') || '없음'}</p>
      <hr className="my-6 border-[#2a2b31]" />
      <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-gray-100 p-4 text-sm leading-6">{post.content}</pre>
      <Link href="/" className="mt-6 inline-block rounded border border-[#2a2b31] px-3 py-2 text-sm hover:bg-[#ffddca]">
        ← 목록으로
      </Link>
    </article>
  );
}
