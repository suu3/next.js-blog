'use client';

import { useEffect, useRef } from 'react';

type Props = {
  issueTerm: string;
};

export default function PostComments({ issueTerm }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

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
  }, [issueTerm]);

  return (
    <section className="mt-10 border-t border-[#2a2b31] pt-8">
      <h2 className="mb-4 text-xl font-black">댓글</h2>
      <div ref={containerRef} />
    </section>
  );
}
