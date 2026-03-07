import Image from 'next/image';
import { css, cx } from '@/styled-system/css';

type Props = {
  compact?: boolean;
};

export default function BioCard({ compact = false }: Props) {
  return (
    <div
      className={cx(
        'neo-frame',
        css({
          overflow: 'hidden',
          borderRadius: compact ? '1rem' : '1.125rem',
          border: '2px solid var(--line)',
          bg: 'var(--surface)',
        }),
      )}
    >
      <div
        className={css({
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '2px solid var(--line)',
          bg: 'var(--theme-soft)',
          px: compact ? '0.875rem' : '1rem',
          py: compact ? '0.75rem' : '0.875rem',
        })}
      >
        <Image
          src="/images/profile.gif"
          alt="Suu3 profile"
          width={64}
          height={64}
          unoptimized
          className={css({
            h: compact ? '3rem' : '4rem',
            w: compact ? '3rem' : '4rem',
            borderRadius: 'full',
            border: '2px solid var(--line)',
            objectFit: 'cover',
            bg: 'var(--surface)',
          })}
        />
        <div
          className={css({
            display: 'flex',
            flexDir: 'column',
            gap: '0.25rem',
            fontFamily: 'FiraCode-Medium, monospace',
          })}
        >
          <span className={css({ fontSize: compact ? '0.875rem' : '1rem', fontWeight: '700', color: 'var(--text)' })}>@Suu3</span>
          <span className={css({ fontSize: '0.75rem', fontWeight: '700', color: 'var(--theme)' })}>Developer</span>
        </div>
      </div>
      <p
        className={css({
          px: compact ? '0.875rem' : '1rem',
          py: compact ? '0.75rem' : '0.875rem',
          fontSize: compact ? '0.75rem' : '0.875rem',
          color: 'var(--muted)',
        })}
      >
        그림과 음악이 좋은 프론트엔드 개발자
      </p>
    </div>
  );
}
