'use client';

import { useEffect, useMemo, useState } from 'react';

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type Props = {
  items: TocItem[];
};

export default function PostToc({ items }: Props) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  useEffect(() => {
    setActiveId(items[0]?.id ?? '');
  }, [items]);

  useEffect(() => {
    if (!itemIds.length) {
      return;
    }

    const headingElements = itemIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!headingElements.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]?.target.id) {
          setActiveId(visibleEntries[0].target.id);
          return;
        }

        const nextHeading = headingElements.find((heading) => heading.getBoundingClientRect().top > 120);

        if (nextHeading) {
          setActiveId(nextHeading.id);
          return;
        }

        setActiveId(headingElements[headingElements.length - 1].id);
      },
      {
        rootMargin: '-20% 0px -65% 0px',
        threshold: [0.1, 0.35, 0.65],
      },
    );

    headingElements.forEach((heading) => observer.observe(heading));

    return () => observer.disconnect();
  }, [itemIds]);

  if (!items.length) {
    return null;
  }

  return (
    <aside className="sticky top-24 hidden h-fit rounded-xl border border-[#2a2b31] bg-[#fff8f4] p-4 shadow-[4px_4px_0_0_#2a2b31] xl:block">
      <p className="mb-3 font-mono text-xs font-bold tracking-wide text-[#6b7280]">Table of Contents</p>
      <nav aria-label="문서 목차">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <li key={item.id} className={item.level === 3 ? 'pl-3' : ''}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`block rounded-md border px-2 py-1 text-sm transition ${
                    isActive
                      ? 'border-[#2a2b31] bg-[#ffddca] font-semibold text-[#111827] shadow-[2px_2px_0_0_#2a2b31]'
                      : 'border-transparent text-[#4b5563] hover:border-[#f4b297] hover:bg-[#fff1ea]'
                  }`}
                >
                  {item.text}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
