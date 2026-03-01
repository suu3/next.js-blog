import Link from 'next/link';
import { css } from '@/styled-system/css';
import { PostSummary } from '@/lib/posts';

type Props = {
  prev: PostSummary | null;
  next: PostSummary | null;
};

export default function PostNavigation({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <div className={css({ mt: '3rem', display: 'grid', gridTemplateColumns: { base: '1fr', md: '1fr 1fr' }, gap: '1rem' })}>
      {prev ? (
        <Link
          href={`/posts/${prev.slug.split('/').map(encodeURIComponent).join('/')}`}
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            p: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--line)',
            bg: 'var(--surface)',
            transition: 'all 0.15s ease',
            _hover: { transform: 'translateY(-2px)', bg: 'var(--theme-soft)' },
            textAlign: 'left',
          })}
        >
          <span className={css({ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600' })}>이전 글</span>
          <span className={css({ fontSize: '1rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={`/posts/${next.slug.split('/').map(encodeURIComponent).join('/')}`}
          className={css({
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            p: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--line)',
            bg: 'var(--surface)',
            transition: 'all 0.15s ease',
            _hover: { transform: 'translateY(-2px)', bg: 'var(--theme-soft)' },
            textAlign: 'right',
          })}
        >
          <span className={css({ fontSize: '0.75rem', color: 'var(--muted)', fontWeight: '600' })}>다음 글</span>
          <span className={css({ fontSize: '1rem', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' })}>{next.title}</span>
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
