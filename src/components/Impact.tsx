import { staggerDelay } from '../lib/motion';

const METRICS = [
  {
    value: '1,000+',
    label: 'Farmer network',
    desc: 'Direct sourcing relationships with smallholder farmers across Ghana\'s production regions.',
  },
  {
    value: '1,500',
    label: 'Acres managed',
    desc: 'Own-operated and contracted farming land actively in the production cycle.',
  },
  {
    value: '47+',
    label: 'Jobs supported',
    desc: 'Direct employment at processing facilities, farms, and transport operations.',
  },
  {
    value: '3',
    label: 'Core business lines',
    desc: 'Farming, processing, and biomass — each generating standalone value.',
  },
];

export function Impact() {
  return (
    <section id="impact" className="py-20.5 bg-agro-sage">
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
          {METRICS.map(({ value, label, desc }, index) => (
            <div
              key={label}
              className="py-8 grid grid-cols-1 md:grid-cols-[220px_1fr] gap-3 md:gap-16 items-baseline"
              style={{
                ...staggerDelay(index * 70),
                borderBottom: '1px solid var(--color-agro-surface-a50)',
              }}
              data-reveal="line"
            >
              <div
                className="font-bold leading-none"
                style={{
                  fontSize: 'clamp(52px, 5vw, 68px)',
                  fontFamily: 'var(--font-agro-heading)',
                  color: 'var(--color-agro-text-primary)',
                  letterSpacing: '-0.02em',
                }}
              >
                {value}
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
