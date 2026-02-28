import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllPosts, getPostsByTag } from '@/lib/posts';
import { splitSlugToSegments } from '@/lib/slug';

type Props = {
  params: Promise<{ tag: string }>;
};

export async function generateStaticParams() {
  const tags = new Set<string>();
  getAllPosts().forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return [...tags].map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export default async function TagDetailPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);

  if (!posts.length) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-black tracking-tight">#{decodedTag}</h1>
      <p className="text-sm text-[var(--muted)]">총 {posts.length}개 포스트</p>
      <ul className="space-y-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${splitSlugToSegments(post.slug).join('/')}`}
              className="block rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 transition hover:bg-[var(--theme-soft)]"
            >
              <p className="font-semibold">{post.title}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{post.date} · {post.category}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
