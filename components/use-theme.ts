'use client';

import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';

function resolveSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(theme);
  document.body.dataset.theme = theme;
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const nextTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : resolveSystemTheme();

    setTheme(nextTheme);
    applyTheme(nextTheme);
    setMounted(true);

    if (!storedTheme) {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const systemTheme = resolveSystemTheme();
        setTheme(systemTheme);
        applyTheme(systemTheme);
      };

      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    return undefined;
  }, []);

  const setAppTheme = useCallback((nextTheme: Theme) => {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    window.dispatchEvent(new CustomEvent('themechange', { detail: nextTheme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setAppTheme(theme === 'light' ? 'dark' : 'light');
  }, [setAppTheme, theme]);

  return {
    theme,
    mounted,
    setTheme: setAppTheme,
    toggleTheme,
  };
}
