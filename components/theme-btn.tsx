'use client';

import styles from './theme-btn.module.css';
import { useTheme } from '@/components/use-theme';

export default function ThemeBtn() {
  const { theme, mounted, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.wrapper}
      data-theme={theme}
      aria-label="테마 전환"
      title="테마 전환"
      suppressHydrationWarning
    >
      <span className={styles.inner}>
        <span className={styles.btn}>{mounted && theme === 'dark' ? '🌙' : '☀️'}</span>
      </span>
    </button>
  );
}
