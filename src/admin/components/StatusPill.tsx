export type Tone = 'neutral' | 'process' | 'success' | 'danger' | 'warning' | 'muted';

// Pill backgrounds use the *-a20 tint and labels the *-a0 deep tone; both invert
// correctly in dark mode (see the accent remaps in src/index.css).
const TONE_CLASS: Record<Tone, string> = {
  neutral: 'bg-agro-surface-a20 text-agro-text-secondary',
  process: 'bg-agro-info-a20 text-agro-info-a0',
  success: 'bg-agro-success-a20 text-agro-success-a0',
  danger: 'bg-agro-danger-a20 text-agro-danger-a0',
  warning: 'bg-agro-warning-a20 text-agro-warning-a0',
  muted: 'bg-agro-surface-a20 text-agro-text-muted',
};

export function StatusPill({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-agro-sans text-agro-xs font-medium ${TONE_CLASS[tone]}`}
    >
      {label}
    </span>
  );
}
