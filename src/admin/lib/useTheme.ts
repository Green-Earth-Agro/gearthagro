import { useEffect, useState } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'agro-admin-theme';

function getInitialMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
  } catch {
    /* localStorage unavailable */
  }
  return 'system';
}

// 'light'/'dark' pin the brand's manual data-theme override; 'system' removes it so the
// `@media (prefers-color-scheme: dark)` block in src/index.css takes over (and keeps
// tracking the OS live, no JS needed).
function applyMode(mode: ThemeMode) {
  const el = document.documentElement;
  if (mode === 'system') el.removeAttribute('data-theme');
  else el.setAttribute('data-theme', mode);
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode);

  useEffect(() => {
    applyMode(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  return { mode, setMode };
}
