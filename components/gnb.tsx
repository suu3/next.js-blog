'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
  { href: '/category', label: 'Category' },
  { href: '/tag', label: 'Tag' },
];

export default function Gnb() {
  const pathname = usePathname();

  return (
    <nav className="neo-gnb flex items-center gap-2 text-sm font-semibold">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`neo-gnb-link ${active ? 'is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="neo-gnb-link-label">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
