'use client';

import { useEffect, useState } from 'react';
import styles from './theme-btn.module.css';

type Theme = 'light' | 'dark';

function applyTheme(newTheme: Theme) {
  const body = document.body;
  body.classList.remove('light', 'dark');
  body.classList.add(newTheme);
  body.dataset.theme = newTheme;
  window.localStorage.setItem('theme', newTheme);
  window.dispatchEvent(new CustomEvent('themechange', { detail: newTheme }));
}

function resolveInitialTheme(): Theme {
  const storedTheme = window.localStorage.getItem('theme');
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeBtn() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const initialTheme = resolveInitialTheme();
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={styles.wrapper}
      data-theme={theme}
      aria-label="테마 전환"
      title="테마 전환"
    >
      <span className={styles.inner}>
        <span className={styles.btn}>{theme === 'light' ? '☀️' : '🌙'}</span>
      </span>
    </button>
  );
}
