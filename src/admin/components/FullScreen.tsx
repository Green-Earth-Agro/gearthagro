import type { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

// Calm full-page state for loading / boundary messages.
export function FullScreen({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-agro-surface-a10 px-6">
      <div className="flex flex-col items-center gap-3 text-agro-text-muted">
        <Loader2 className="size-6 animate-spin" strokeWidth={2} />
        <p className="font-agro-sans text-agro-sm">{children}</p>
      </div>
    </div>
  );
}
