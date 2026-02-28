'use client';

import { useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { css } from '@/styled-system/css';

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
    <div className={css({ mt: '1rem', borderRadius: '0.5rem', border: '1px solid var(--line)', bg: 'var(--surface)', p: '0.5rem' })}>
      <div className={css({ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' })}>
        <button
          type="button"
          onClick={onShare}
          className={css({ display: 'inline-flex', h: '2.25rem', alignItems: 'center', justifyContent: 'center', borderRadius: '0.375rem', border: '1px solid var(--line)', bg: 'var(--theme-soft)', px: '0.75rem', fontSize: '0.75rem', fontWeight: '600', transition: 'all 0.15s ease', _hover: { transform: 'translateY(-2px)' } })}
        >
          {copied ? '링크 복사됨' : '공유하기'}
        </button>
        <a
          href={translateUrl}
          target="_blank"
          rel="noreferrer"
          className={css({ display: 'inline-flex', h: '2.25rem', alignItems: 'center', justifyContent: 'center', borderRadius: '0.375rem', border: '1px solid var(--line)', bg: 'var(--theme-soft)', px: '0.75rem', fontSize: '0.75rem', fontWeight: '600', transition: 'all 0.15s ease', _hover: { transform: 'translateY(-2px)' } })}
        >
          Translate
        </a>
      </div>
    </div>
  );
}

