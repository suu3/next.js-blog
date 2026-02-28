'use client';

import { useEffect, useMemo, useState } from 'react';
import { css, cx } from '@/styled-system/css';

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

type Props = {
  items: TocItem[];
};

export default function PostToc({ items }: Props) {
  const [tocItems, setTocItems] = useState<TocItem[]>(items);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    if (items.length) {
      setTocItems(items);
      setActiveId(items[0]?.id ?? '');
      return;
    }

    // 서버에서 목차가 추출되지 않은 경우, 클라이언트에서 DOM 기반으로 보조 목차를 생성합니다.
    const headingElements = Array.from(
      document.querySelectorAll<HTMLElement>('.markdown-body h2[id], .markdown-body h3[id]'),
    );

    if (!headingElements.length) {
      setTocItems([]);
      return;
    }

    const derivedItems: TocItem[] = headingElements.map((el) => ({
      id: el.id,
      text: el.innerText.trim(),
      level: el.tagName === 'H2' ? 2 : 3,
    }));

    setTocItems(derivedItems);
    setActiveId(derivedItems[0]?.id ?? '');
  }, [items]);

  const itemIds = useMemo(() => tocItems.map((item) => item.id), [tocItems]);

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

  return (
    <aside
      className={css({
        position: 'sticky',
        top: '6rem',
        display: 'block',
        h: 'fit-content',
        borderRadius: '0.75rem',
        border: '1px solid var(--line)',
        bg: 'var(--surface)',
        p: '1rem',
        boxShadow: '4px 4px 0 0 var(--line)',
      })}
    >
      <p className={css({ mb: '0.75rem', fontFamily: 'FiraCode-Medium, monospace', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.025em', color: 'var(--muted)' })}>Table of Contents</p>
      <nav aria-label="문서 목차">
        <ul className={css({ display: 'flex', flexDir: 'column', gap: '0.25rem' })}>
          {tocItems.map((item) => {
            const isActive = activeId === item.id;

            return (
              <li key={item.id} className={item.level === 3 ? css({ pl: '0.75rem' }) : undefined}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={cx(
                    css({
                      display: 'block',
                      borderRadius: '0.375rem',
                      border: '1px solid transparent',
                      px: '0.5rem',
                      py: '0.25rem',
                      fontSize: '0.875rem',
                      transition: 'all 0.15s ease',
                    }),
                    isActive
                      ? css({ borderColor: 'var(--line)', bg: 'var(--theme-soft)', fontWeight: '600', color: 'var(--text)', boxShadow: '2px 2px 0 0 var(--line)' })
                      : css({ color: 'var(--muted)', _hover: { borderColor: 'var(--line)', bg: 'var(--theme-soft)' } }),
                  )}
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

