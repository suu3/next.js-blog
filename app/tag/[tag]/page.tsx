import Link from 'next/link';
import { notFound } from 'next/navigation';
import { css } from '@/styled-system/css';
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
    <section className={css({ display: 'flex', flexDir: 'column', gap: '1rem' })}>
      <h1 className={css({ fontSize: '1.875rem', fontWeight: '900', letterSpacing: '-0.025em' })}>#{decodedTag}</h1>
      <p className={css({ fontSize: '0.875rem', color: 'var(--muted)' })}>총 {posts.length}개 포스트</p>
      <ul className={css({ display: 'flex', flexDir: 'column', gap: '0.5rem' })}>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${splitSlugToSegments(post.slug).join('/')}`}
              className={css({ display: 'block', borderRadius: '0.75rem', border: '1px solid var(--line)', bg: 'var(--surface)', px: '1rem', py: '0.75rem', transition: 'all 0.15s ease', _hover: { bg: 'var(--theme-soft)' } })}
            >
              <p className={css({ fontWeight: '600' })}>{post.title}</p>
              <p className={css({ mt: '0.25rem', fontSize: '0.75rem', color: 'var(--muted)' })}>{post.date} · {post.category}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

