// A small on/off switch. Knob travel is rem-based (left-0.5 + translate-x-5) so it
// stays seated in the track regardless of the page's root font size. The knob is a
// faintly tinted off-white (never #fff) with a soft shadow, legible on both the green
// (on) and gray (off) tracks in light and dark.
export function Switch({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-agro-primary-a0' : 'bg-agro-surface-a40'
      }`}
    >
      <span
        style={{ boxShadow: '0 1px 2px rgb(0 0 0 / 0.3)' }}
        className={`absolute left-0.5 top-0.5 size-5 rounded-full bg-[oklch(98%_0.01_146)] transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
