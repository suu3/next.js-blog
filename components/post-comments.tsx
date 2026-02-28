'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  issueTerm: string;
};

export default function PostComments({ issueTerm }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

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
    script.setAttribute('theme', 'github-light');
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

  return (
    <section className="mt-10 border-t border-[#2a2b31] pt-8">
      <h2 className="mb-4 text-xl font-black">댓글</h2>
      {!loaded && <p className="mb-3 text-sm text-[#6b7280]">댓글 위젯을 불러오는 중...</p>}
      <div ref={containerRef} className="min-h-[180px]" />
    </section>
  );
}
