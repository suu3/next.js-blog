import Link from 'next/link';
import { css } from '@/styled-system/css';
import { getAllPosts } from '@/lib/posts';
import { splitSlugToSegments } from '@/lib/slug';

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateStaticParams() {
  const categories = [...new Set(getAllPosts().map((post) => post.category))];
  return categories.map((category) => ({ category: encodeURIComponent(category) }));
}

export default async function CategoryDetailPage({ params }: Props) {
  const { category: categoryParam } = await params;
  const category = decodeURIComponent(categoryParam);
  const posts = getAllPosts().filter((post) => post.category === category);

  return (
    <section className={css({ display: 'flex', flexDir: 'column', gap: '1rem' })}>
      <h1 className={css({ fontSize: '1.875rem', fontWeight: '900', letterSpacing: '-0.025em' })}>{category}</h1>
      <p className={css({ fontSize: '0.875rem', color: '#6b7280' })}>{posts.length}개의 포스트</p>
      <ul className={css({ display: 'flex', flexDir: 'column', gap: '0.5rem' })}>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/posts/${splitSlugToSegments(post.slug).join('/')}`}
              className={css({ display: 'block', borderRadius: '0.5rem', border: '1px solid #2a2b31', bg: 'white', px: '1rem', py: '0.75rem', _hover: { bg: '#ffddca' } })}
            >
              <p className={css({ fontWeight: '600' })}>{post.title}</p>
              <p className={css({ mt: '0.25rem', fontSize: '0.875rem', color: '#6b7280' })}>{post.date}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/category" className={css({ display: 'inline-block', w: 'fit-content', borderRadius: '0.25rem', border: '1px solid #2a2b31', px: '0.75rem', py: '0.5rem', fontSize: '0.875rem', _hover: { bg: '#ffddca' } })}>
        ← 카테고리 목록
      </Link>
    </section>
  );
}

