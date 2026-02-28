'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { css, cx } from '@/styled-system/css';

const items = [
  { href: '/category', label: 'Category' },
  { href: '/tag', label: 'Tag' },
];

export default function Gnb() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleDocumentClick = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <nav
      ref={navRef}
      className={cx(
        'neo-gnb',
        open && 'is-open',
        css({
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.875rem',
          fontWeight: '600',
        }),
      )}
      aria-label="Global navigation"
    >
      <button
        type="button"
        className="neo-gnb-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
        aria-expanded={open}
        aria-controls="neo-gnb-menu"
      >
        <span className="neo-gnb-toggle-bar" />
        <span className="neo-gnb-toggle-bar" />
        <span className="neo-gnb-toggle-bar" />
      </button>

      <div id="neo-gnb-menu" className="neo-gnb-menu">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cx('neo-gnb-link', active && 'is-active')}
              aria-current={active ? 'page' : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="neo-gnb-link-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
