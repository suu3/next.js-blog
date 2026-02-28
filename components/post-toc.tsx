'use client';

import { useEffect, useMemo, useState } from 'react';

type Heading = {
  id: string;
  text: string;
  level: 2 | 3;
};

type Props = {
  headings: Heading[];
};

const HEADER_OFFSET = 96;

export default function PostToc({ headings }: Props) {
  const ids = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!ids.length) {
      return;
    }

    const hash = decodeURIComponent(window.location.hash.replace('#', ''));
    if (hash && ids.includes(hash)) {
      setActiveId(hash);
    } else {
      setActiveId(ids[0]);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${HEADER_OFFSET}px 0px -65% 0px`,
        threshold: [0, 0.25, 1],
      },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [ids]);

  const moveToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    const top = window.scrollY + element.getBoundingClientRect().top - HEADER_OFFSET;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    history.replaceState(null, '', `#${encodeURIComponent(id)}`);
    setActiveId(id);
  };

  if (!headings.length) {
    return <p className="text-xs text-[var(--muted)]">표시할 목차가 없습니다.</p>;
  }

  return (
    <ul className="table-of-contents space-y-2 text-sm">
      {headings.map((heading) => (
        <li key={heading.id} className={heading.level === 3 ? 'pl-3' : ''}>
          <button
            type="button"
            onClick={() => moveToHeading(heading.id)}
            className={`w-full cursor-pointer text-left transition hover:underline ${
              activeId === heading.id ? 'font-semibold text-[var(--theme)]' : 'text-[var(--text)]'
            }`}
          >
            {heading.text}
          </button>
        </li>
      ))}
    </ul>
  );
}
