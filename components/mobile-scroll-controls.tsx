'use client';

import { useEffect, useState } from 'react';

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
    <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-2 md:hidden">
      <button
        type="button"
        onClick={scrollTop}
        className="rounded-full border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-black shadow-[2px_2px_0_0_var(--line)]"
        aria-label="맨 위로 이동"
      >
        TOP
      </button>
      <button
        type="button"
        onClick={scrollBottom}
        className="rounded-full border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-xs font-black shadow-[2px_2px_0_0_var(--line)]"
        aria-label="맨 아래로 이동"
      >
        BOT
      </button>
    </div>
  );
}
