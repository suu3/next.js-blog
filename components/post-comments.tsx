'use client';

import { useEffect, useRef, useState } from 'react';
import { Theme } from '@/components/use-theme';

type Props = {
  issueTerm: string;
};

function getTheme(): Theme {
  if (typeof document === 'undefined') {
    return 'light';
  }

  return document.body.dataset.theme === 'dark' ? 'dark' : 'light';
}

export default function PostComments({ issueTerm }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(getTheme());

    const handleThemeChange = () => {
      setTheme(getTheme());
    };

    window.addEventListener('themechange', handleThemeChange);
    return () => window.removeEventListener('themechange', handleThemeChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    setLoaded(false);
    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('repo', 'suu3/suu3.github.io');
    script.setAttribute('issue-term', issueTerm);
    script.setAttribute('theme', theme === 'dark' ? 'github-dark' : 'github-light');
    script.setAttribute('label', 'comment');

    container.appendChild(script);

    const observer = new MutationObserver(() => {
      const iframe = container.querySelector('iframe.utterances-frame');
      if (iframe) {
        setLoaded(true);
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, [issueTerm, theme]);

  return (
    <section className="mt-10 border-t border-[var(--line)] pt-8">
      <h2 className="mb-4 text-xl font-black">댓글</h2>
      {!loaded && <p className="mb-3 text-sm text-[var(--muted)]">댓글 위젯을 불러오는 중...</p>}
      <div ref={containerRef} className="min-h-[180px]" />
    </section>
  );
}
