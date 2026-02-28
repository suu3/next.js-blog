'use client';

import { useEffect, useState } from 'react';
import { css } from '@/styled-system/css';

export default function MobileScrollControls() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 260);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  if (!show) {
    return null;
  }

  return (
    <div className={css({ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 30, display: { base: 'flex', md: 'none' }, flexDir: 'column', gap: '0.5rem' })}>
      <button
        type="button"
        onClick={scrollTop}
        className={css({ borderRadius: '9999px', border: '2px solid var(--line)', bg: 'var(--surface)', px: '0.75rem', py: '0.5rem', fontSize: '0.75rem', fontWeight: '900', boxShadow: '2px 2px 0 0 var(--line)' })}
        aria-label="맨 위로 이동"
      >
        TOP
      </button>
      <button
        type="button"
        onClick={scrollBottom}
        className={css({ borderRadius: '9999px', border: '2px solid var(--line)', bg: 'var(--surface)', px: '0.75rem', py: '0.5rem', fontSize: '0.75rem', fontWeight: '900', boxShadow: '2px 2px 0 0 var(--line)' })}
        aria-label="맨 아래로 이동"
      >
        BOT
      </button>
    </div>
  );
}

