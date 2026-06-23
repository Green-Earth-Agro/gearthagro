import type { ReactNode } from 'react';
import { Loader2, AlertCircle, Inbox, WifiOff, ShieldAlert, SearchX } from 'lucide-react';
import { describeError, type ErrorTone } from '../lib/errors';

interface QueryBoundaryProps {
  loading: boolean;
  error: string | null;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  children: ReactNode;
}

function Centered({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center gap-3 py-20 text-center">{children}</div>;
}

// Icon + accent per error category. Network is a recoverable blip (warning tone),
// not the alarm-red of a hard failure; denial is a wall, not a retry.
const TONE: Record<ErrorTone, { Icon: typeof AlertCircle; className: string }> = {
  network: { Icon: WifiOff, className: 'text-agro-warning-a10' },
  denied: { Icon: ShieldAlert, className: 'text-agro-danger-a10' },
  missing: { Icon: SearchX, className: 'text-agro-text-disabled' },
  generic: { Icon: AlertCircle, className: 'text-agro-danger-a10' },
};

// Standard loading / error / empty handling so every workspace behaves the same.
export function QueryBoundary({
  loading,
  error,
  isEmpty,
  emptyTitle = 'Nothing here yet',
  emptyMessage,
  onRetry,
  children,
}: QueryBoundaryProps) {
  if (loading) {
    return (
      <Centered>
        <Loader2 className="size-6 animate-spin text-agro-text-muted" strokeWidth={2} />
        <p className="font-agro-sans text-agro-sm text-agro-text-muted">Loading…</p>
      </Centered>
    );
  }

  if (error) {
    const described = describeError(error);
    const { Icon, className } = TONE[described.tone];
    return (
      <Centered>
        <Icon className={`size-7 ${className}`} strokeWidth={1.75} />
        <div className="max-w-xs">
          <p className="font-agro-sans text-agro-base font-semibold text-agro-text-primary">
            {described.title}
          </p>
          <p className="mt-1 font-agro-sans text-agro-sm text-agro-text-muted">{described.hint}</p>
        </div>
        {onRetry && described.retryable && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-agro-surface-a40 px-4 py-2 font-agro-sans text-agro-sm font-medium text-agro-text-secondary transition-colors hover:bg-agro-surface-a20"
          >
            Try again
          </button>
        )}
        {/* Raw message kept for debugging, out of the user's way. */}
        <details className="mt-1 max-w-xs">
          <summary className="cursor-pointer list-none font-agro-sans text-agro-xs text-agro-text-disabled transition-colors hover:text-agro-text-muted">
            Technical details
          </summary>
          <p className="mt-1 break-words font-agro-sans text-agro-xs text-agro-text-disabled">
            {error}
          </p>
        </details>
      </Centered>
    );
  }

  if (isEmpty) {
    return (
      <Centered>
        <Inbox className="size-7 text-agro-text-disabled" strokeWidth={1.75} />
        <div>
          <p className="font-agro-sans text-agro-base font-semibold text-agro-text-primary">
            {emptyTitle}
          </p>
          {emptyMessage && (
            <p className="mt-1 font-agro-sans text-agro-sm text-agro-text-muted">{emptyMessage}</p>
          )}
        </div>
      </Centered>
    );
  }

  return <>{children}</>;
}
