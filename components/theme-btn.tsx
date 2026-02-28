'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { css, cx } from '@/styled-system/css';

export default function ThemeBtn() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={css({ w: '78px', h: '46px' })} />;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={css({
        position: 'relative',
        w: '78px',
        h: '46px',
        p: '6px 8px',
        borderRadius: '99px',
        border: '1px solid var(--line)',
        bg: isDark ? 'var(--color-bg-surface)' : '#ffffff',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        overflow: 'hidden',
      })}
      aria-label="테마 변경"
    >
      <div className={css({
        position: 'relative',
        w: 'full',
        h: 'full',
        borderRadius: '99px',
        bg: isDark ? '#3d3937' : '#d9d9d9',
        transition: 'background-color 0.2s ease',
      })}>
        <motion.div
          animate={{ x: isDark ? 30 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className={css({
            position: 'absolute',
            top: '0',
            left: '0',
            w: '34px',
            h: '34px',
            borderRadius: '50%',
            border: '1px solid var(--line)',
            bg: isDark ? '#ff8b66' : '#ff740f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          })}
        >
          {isDark ? '🌙' : '☀️'}
        </motion.div>
      </div>
    </button>
  );
}
