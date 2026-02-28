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

    const onScroll = () => {
      const candidates = ids
        .map((id) => {
          const element = document.getElementById(id);
          if (!element) {
            return null;
          }
          return { id, top: element.getBoundingClientRect().top };
        })
        .filter((value): value is { id: string; top: number } => value !== null);

      const passed = candidates.filter((item) => item.top <= 120);

      if (passed.length) {
        setActiveId(passed[passed.length - 1].id);
      } else if (candidates.length) {
        setActiveId(candidates[0].id);
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [ids]);

  if (!headings.length) {
    return <p className="text-xs text-gray-500">표시할 목차가 없습니다.</p>;
  }

  return (
    <ul className="space-y-2 text-sm table-of-contents">
      {headings.map((heading) => (
        <li key={heading.id} className={heading.level === 3 ? 'pl-3' : ''}>
          <a
            href={`#${heading.id}`}
            className={`transition hover:text-[#ff6737] hover:underline ${
              activeId === heading.id ? 'font-semibold text-[#ff6737]' : 'text-gray-700'
            }`}
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  );
}
