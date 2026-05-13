import { useEffect, useRef, useState } from 'react';
import { staggerDelay } from '../lib/motion';

const METRICS = [
  {
    value: 1000,
    suffix: '+',
    label: 'Farmer network',
    desc: 'Direct sourcing relationships with smallholder farmers across Ghana\'s production regions.',
  },
  {
    value: 1500,
    suffix: '',
    label: 'Acres managed',
    desc: 'Own-operated and contracted farming land actively in the production cycle.',
  },
  {
    value: 47,
    suffix: '+',
    label: 'Jobs supported',
    desc: 'Direct employment at processing facilities, farms, and transport operations.',
  },
  {
    value: 3,
    suffix: '',
    label: 'Core business lines',
    desc: 'Farming, processing, and biomass — each generating standalone value.',
  },
];

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const countRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element || hasStarted) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setDisplayValue(value);
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setHasStarted(true);
        observer.disconnect();
      },
      {
        threshold: 0.6,
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasStarted, value]);

  useEffect(() => {
    if (!hasStarted) return;

    let frameId = 0;
    let startTime: number | null = null;
    const duration = 1400;

    const tick = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, [hasStarted, value]);

  return (
    <span ref={countRef}>
      {displayValue.toLocaleString()}{suffix}
    </span>
  );
}

export function Impact() {
  return (
    <section id="impact" className="py-16 sm:py-20.5 bg-agro-sage">
      <div className="max-w-280 mx-auto px-[4%]">
        <div className="max-w-160 mb-14" data-reveal="line">
          <span
            className="text-sm font-bold uppercase tracking-[1.2px]"
            style={{ color: 'var(--color-agro-text-secondary)' }}
          >
            Our Impact
          </span>
          <h2
            className="font-bold leading-[1.1] mt-3"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--color-agro-text-primary)' }}
          >
            Built around practical rural value creation.
          </h2>
        </div>

        <div style={{ borderTop: '1px solid var(--color-agro-surface-a50)' }}>
          {METRICS.map(({ value, suffix, label, desc }, index) => (
            <div
              key={label}
              className="py-7 sm:py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-3 lg:gap-16 items-baseline"
              style={{
                ...staggerDelay(index * 70),
                borderBottom: '1px solid var(--color-agro-surface-a50)',
              }}
              data-reveal="line"
            >
              <div
                className="font-bold leading-none"
                style={{
                  fontSize: 'clamp(2.7rem, 9vw, 4.25rem)',
                  fontFamily: 'var(--font-agro-heading)',
                  color: 'var(--color-agro-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                <CountUp value={value} suffix={suffix} />
              </div>
              <div>
                <h3
                  className="font-bold text-lg mb-1.5"
                  style={{ color: 'var(--color-agro-text-primary)' }}
                >
                  {label}
                </h3>
                <p
                  className="leading-relaxed"
                  style={{ color: 'var(--color-agro-text-secondary)' }}
                >
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
