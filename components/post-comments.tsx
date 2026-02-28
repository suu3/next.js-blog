'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  issueTerm: string;
};

type Theme = 'light' | 'dark';

const toUtterancesTheme = (theme: Theme) => (theme === 'dark' ? 'github-dark' : 'github-light');

const getCurrentTheme = (): Theme => {
  const bodyTheme = document.body.dataset.theme;

  if (bodyTheme === 'dark' || document.body.classList.contains('dark')) {
    return 'dark';
  }

  return 'light';
};

export default function PostComments({ issueTerm }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    setTheme(getCurrentTheme());

    const onThemeChange = (event: Event) => {
      const customEvent = event as CustomEvent<Theme>;
      if (customEvent.detail === 'light' || customEvent.detail === 'dark') {
        setTheme(customEvent.detail);
        return;
      }

      setTheme(getCurrentTheme());
    };

    window.addEventListener('themechange', onThemeChange);

    return () => {
      window.removeEventListener('themechange', onThemeChange);
    };
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
    script.setAttribute('theme', toUtterancesTheme(theme));
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
  }, [issueTerm]);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    const iframe = containerRef.current?.querySelector('iframe.utterances-frame') as HTMLIFrameElement | null;

    if (!iframe?.contentWindow) {
      return;
    }

    iframe.contentWindow.postMessage(
      {
        type: 'set-theme',
        theme: toUtterancesTheme(theme),
      },
      'https://utteranc.es',
    );
  }, [loaded, theme]);

  return (
    <section className="mt-10 border-t border-[var(--line)] pt-8">
      <h2 className="mb-4 text-xl font-black">댓글</h2>
      {!loaded && <p className="mb-3 text-sm text-[var(--muted)]">댓글 위젯을 불러오는 중...</p>}
      <div ref={containerRef} className="min-h-[180px]" />
    </section>
  );
}
