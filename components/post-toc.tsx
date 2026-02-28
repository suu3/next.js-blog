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

export default function PostToc({ headings }: Props) {
  const ids = useMemo(() => headings.map((heading) => heading.id), [headings]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (!ids.length) {
      return;
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
        rootMargin: '-96px 0px -70% 0px',
        threshold: [0, 0.2, 1],
      },
    );

    ids.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    const first = document.getElementById(ids[0]);
    if (first) {
      setActiveId(first.id);
    }

    return () => observer.disconnect();
  }, [ids]);

  const moveToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    setActiveId(id);
  };

  if (!headings.length) {
    return <p className="text-xs text-gray-500">표시할 목차가 없습니다.</p>;
  }

  return (
    <ul className="space-y-2 text-sm table-of-contents">
      {headings.map((heading) => (
        <li key={heading.id} className={heading.level === 3 ? 'pl-3' : ''}>
          <a
            href={`#${heading.id}`}
            onClick={(event) => {
              event.preventDefault();
              moveToHeading(heading.id);
            }}
            className={`transition hover:text-[var(--theme)] hover:underline ${
              activeId === heading.id ? 'font-semibold text-[var(--theme)]' : 'text-gray-700'
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
