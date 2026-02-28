'use client';

import { useEffect, useRef } from 'react';

export default function PostComments() {
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
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', 'github-light');

    container.appendChild(script);
  }, []);

  return <div className="mt-8" ref={containerRef} />;
}
