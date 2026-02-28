import Image from 'next/image';
import { css, cx } from '@/styled-system/css';
import PostSearch from '@/components/post-search';
import { getAllPosts } from '@/lib/posts';

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <section className={css({ display: 'flex', flexDir: 'column', gap: '1.5rem' })}>
      <div
        className={cx(
          'y2k-hero',
          css({
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '1rem',
            border: '1px solid #2a2b31',
            bg: 'white',
            px: { base: '1rem', md: '1.5rem' },
            py: '1.25rem',
          }),
        )}
      >
        <Image src="/images/icon.png" alt="decorative icon" width={48} height={48} className="hero-icon-left" />
        <Image src="/images/home.svg" alt="decorative home" width={38} height={38} className="hero-icon-right" />
        <div className="y2k-stars" aria-hidden />
        <div className={css({ position: 'relative', zIndex: 10, display: 'flex', flexDir: 'column', gap: '0.5rem' })}>
          <p className={css({ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#6b7280' })}>Suu3 Archive</p>
          <h1 className={cx('y2k-title', css({ fontSize: { base: '1.875rem', md: '2.25rem' }, fontWeight: '900', letterSpacing: '-0.025em' }))}>기록하고 공유합니다</h1>
          <p className={css({ fontSize: '0.875rem', color: '#4b5563' })}>Neo Brutalism 무드로 정리한 개발 기록</p>
        </div>
      </div>
      <PostSearch posts={posts} />
    </section>
  );
}

