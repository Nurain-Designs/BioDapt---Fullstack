import { useEffect, useState } from 'react';
import { cn } from '../utils/cn';

// Simple sun/moon toggle for dark mode
export default function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <button
      aria-label="Toggle dark mode"
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
        dark ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
      )}
      onClick={() => setDark(!dark)}
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
