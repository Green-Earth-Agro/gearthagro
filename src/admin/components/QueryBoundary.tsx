import type { ReactNode } from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

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
    return (
      <Centered>
        <AlertCircle className="size-7 text-agro-danger-a10" strokeWidth={1.75} />
        <div>
          <p className="font-agro-sans text-agro-base font-semibold text-agro-text-primary">
            Could not load this
          </p>
          <p className="mt-1 font-agro-sans text-agro-sm text-agro-text-muted">{error}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg border border-agro-surface-a40 px-4 py-2 font-agro-sans text-agro-sm font-medium text-agro-text-secondary transition-colors hover:bg-agro-surface-a20"
          >
            Try again
          </button>
        )}
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
