import type { Variants, Transition } from 'motion/react';

// Brand easing: matches --agro-ease-out in src/index.css (ease-out quint).
const EASE_OUT: Transition['ease'] = [0.23, 1, 0.32, 1];

// Subtle content entrance: short, no bounce. Product-register restraint, not flourish.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.26, ease: EASE_OUT } },
};

// Parent that reveals its children in a quick stagger.
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.02 } },
};

// For mounted-once enter animations (cards, panels) without a parent container.
export const enter = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.26, ease: EASE_OUT },
} as const;
