import Link from 'next/link';
import { css } from '@/styled-system/css';
import { getAllPosts, getCategoriesWithCount } from '@/lib/posts';

export default function CategoryPage() {
  const posts = getAllPosts();
  const categories = Object.entries(getCategoriesWithCount(posts)).sort((a, b) => b[1] - a[1]);

  return (
    <section className={css({ display: 'flex', flexDir: 'column', gap: '1rem' })}>
      <h1 className={css({ fontSize: '1.875rem', fontWeight: '900', letterSpacing: '-0.025em' })}>카테고리 모아보기</h1>
      <ul className={css({ display: 'grid', gap: '0.75rem', gridTemplateColumns: { base: '1fr', md: 'repeat(2, minmax(0, 1fr))' } })}>
        {categories.map(([category, count]) => (
          <li key={category}>
            <Link
              href={`/category/${encodeURIComponent(category)}`}
              className={css({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '0.75rem', border: '1px solid #2a2b31', bg: 'white', px: '1rem', py: '0.75rem', transition: 'all 0.15s ease', _hover: { bg: '#ffddca', boxShadow: '4px 4px 0 0 #2a2b31' } })}
            >
              <span className={css({ fontWeight: '600' })}>{category}</span>
              <span className={css({ fontFamily: 'FiraCode-Medium, monospace', fontSize: '0.875rem', color: '#6b7280' })}>{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

