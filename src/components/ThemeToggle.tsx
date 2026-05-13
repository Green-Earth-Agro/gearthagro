import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import { Moon, Sun } from 'lucide-react';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
  // Theme switching is currently disabled from the main navigation,
  // so the site defaults to light mode instead of following system preference.
  return 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('agro-theme', theme);
}

interface ThemeToggleProps {
  className?: string;
  style?: CSSProperties;
}

export function ThemeToggle({ className = '', style }: ThemeToggleProps = {}) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const toggle = () => {
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <button
      onClick={toggle}
      className={`btn-icon ${className}`.trim()}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      style={style}
    >
      {theme === 'dark' ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
    </button>
  );
}
