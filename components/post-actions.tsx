'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function PostActions() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return `https://suu3.github.io${pathname}`;
    }

    return window.location.href;
  }, [pathname]);

  const translateUrl = `https://translate.google.com/translate?hl=ko&sl=auto&tl=en&u=${encodeURIComponent(shareUrl)}`;

  const onShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="mt-4 rounded-lg border border-[var(--line)] bg-[var(--surface)] p-2">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onShare}
          className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--theme-soft)] px-3 text-xs font-semibold transition hover:-translate-y-0.5"
        >
          {copied ? '링크 복사됨!' : '공유하기'}
        </button>
        <a
          href={translateUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--line)] bg-[var(--theme-soft)] px-3 text-xs font-semibold transition hover:-translate-y-0.5"
        >
          Translate
        </a>
      </div>
    </div>
  );
}
