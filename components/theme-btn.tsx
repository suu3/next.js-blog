'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import styles from './theme-btn.module.css';

export default function ThemeBtn() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ width: 78, height: 46 }} aria-hidden />;
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';
  const spring = {
    type: 'spring',
    stiffness: 700,
    damping: 30,
  } as const;

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={styles.wrapper}
      data-theme={isDark ? 'dark' : 'light'}
      animate={isDark ? 'dark' : 'light'}
      initial={false}
      variants={{
        light: { backgroundColor: '#ffffff', color: 'var(--color-bg-surface)' },
        dark: { backgroundColor: 'var(--color-bg-surface)', color: '#ffffff' },
      }}
      aria-label="테마 변경"
      aria-pressed={isDark}
    >
      <motion.div
        className={styles.inner}
        layout
        transition={spring}
        animate={isDark ? 'dark' : 'light'}
        initial={false}
        variants={{
          light: { backgroundColor: '#d9d9d9' },
          dark: { backgroundColor: '#3d3937' },
        }}
      >
        <motion.div
          role="presentation"
          animate={{ x: isDark ? 30 : 0 }}
          transition={spring}
          className={styles.btn}
          style={{ backgroundColor: isDark ? '#ff8b66' : '#ff740f' }}
        >
          <Image
            src={isDark ? '/images/moon.svg' : '/images/sun.svg'}
            alt=""
            width={16}
            height={16}
            aria-hidden
          />
        </motion.div>
      </motion.div>
    </motion.button>
  );
}
