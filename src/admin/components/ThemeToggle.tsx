import type { ComponentType } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../lib/useTheme';
import type { ThemeMode } from '../lib/useTheme';

const OPTIONS: { mode: ThemeMode; label: string; Icon: ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { mode: 'light', label: 'Light', Icon: Sun },
  { mode: 'dark', label: 'Dark', Icon: Moon },
  { mode: 'system', label: 'System', Icon: Monitor },
];

// Icon-only segmented control in the sidebar footer, above Sign out.
export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme"
      className="mb-1 flex items-center gap-1 rounded-lg border border-agro-surface-a40 p-1"
    >
      {OPTIONS.map(({ mode: m, label, Icon }) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={[
              'flex flex-1 items-center justify-center rounded-md py-1.5 transition-colors',
              active
                ? 'bg-agro-surface-a20 text-agro-text-primary'
                : 'text-agro-text-muted hover:text-agro-text-primary',
            ].join(' ')}
          >
            <Icon size={16} strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}
