import type { CSSProperties } from 'react';

export function staggerDelay(delayMs: number): CSSProperties {
  return {
    '--reveal-delay': `${delayMs}ms`,
  } as CSSProperties;
}
