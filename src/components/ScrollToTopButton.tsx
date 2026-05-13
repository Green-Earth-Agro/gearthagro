import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

const SHOW_AFTER_SCROLL = 420;

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > SHOW_AFTER_SCROLL);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      aria-label="Scroll back to top"
      onClick={scrollToTop}
      className="fixed right-4 bottom-4 sm:right-6 sm:bottom-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 focus:outline-none"
      style={{
        background: 'var(--color-agro-primary-a10)',
        color: 'var(--color-agro-text-inverse)',
        boxShadow: '0 16px 30px rgba(24, 38, 24, 0.18)',
        border: '1px solid rgba(255, 255, 255, 0.24)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.92)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <ChevronUp size={20} strokeWidth={2.5} />
    </button>
  );
}
