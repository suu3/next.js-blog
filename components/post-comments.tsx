'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from 'next-themes';
import { css } from '@/styled-system/css';

type Props = {
  issueTerm: string;
};

export default function PostComments({ issueTerm }: Props) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = useMemo<'light' | 'dark'>(() => {
    if (theme === 'dark' || theme === 'light') {
      return theme;
    }

    return resolvedTheme === 'dark' ? 'dark' : 'light';
  }, [resolvedTheme, theme]);

  const utterancesTheme = currentTheme === 'dark' ? 'github-dark' : 'github-light';

  useEffect(() => {
    if (!mounted || !containerRef.current) {
      return;
    }

    const container = containerRef.current;

    // 기존 위젯이 있다면 제거
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('repo', 'suu3/suu3.github.io');
    script.setAttribute('issue-term', issueTerm);
    script.setAttribute('label', 'comment');
    script.setAttribute('theme', utterancesTheme);

    container.appendChild(script);
  }, [mounted, issueTerm, utterancesTheme]);

  return (
    <section className={css({ mt: '2.5rem', borderTop: '1px solid var(--line)', pt: '2rem' })}>
      <h2 className={css({ mb: '1rem', fontSize: '1.25rem', fontWeight: '900' })}>댓글</h2>
      {!mounted && (
        <p className={css({ mb: '0.75rem', fontSize: '0.875rem', color: 'var(--muted)' })}>
          댓글 위젯을 불러오는 중...
        </p>
      )}
      <div ref={containerRef} className={css({ minH: '180px' })} />
    </section>
  );
}
