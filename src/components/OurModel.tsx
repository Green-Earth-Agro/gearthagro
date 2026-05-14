import { Sprout, Truck, Factory, PackageCheck, Recycle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { staggerDelay } from '../lib/motion';

interface Step {
  label: string;
  Icon: LucideIcon;
}

const STEPS: Step[] = [
  { label: 'Smallholder farmers engagement', Icon: Sprout },
  { label: 'Raw Material Collection', Icon: Truck },
  { label: 'Agro Processing', Icon: Factory },
  { label: 'Value-Added Products', Icon: PackageCheck },
  { label: 'Biomass & Waste Utilization', Icon: Recycle },
];

export function OurModel() {
  return (
    <section id="model" className="py-16 sm:py-20.5 bg-agro-sage">
      <div className="max-w-280 mx-auto px-[4%]">
        <div className="max-w-190 mb-11" data-reveal="line">
          <span
            className="text-sm font-bold uppercase tracking-[1.2px]"
            style={{ color: 'var(--color-agro-primary-a30)' }}
          >
            Our Model
          </span>
          <h2
            className="font-bold leading-[1.1] mt-3"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--color-agro-primary-a0)' }}
          >
            From farmers to finished products.
          </h2>
          <p className="mt-3 text-lg text-agro-muted">
            Our model connects agricultural production, farmer sourcing, processing infrastructure,
            and waste utilization into one practical value chain.
          </p>
        </div>

        {/* Desktop: horizontal flow with arrows */}
        <div className="hidden xl:flex items-stretch gap-0">
          {STEPS.map(({ label, Icon }, i) => (
            <div
              key={label}
              className="flex items-center flex-1 min-w-0"
              style={staggerDelay(i * 80)}
              data-reveal="line"
            >
              <div
                className="agro-card-lift flex-1 bg-agro-surface rounded-2xl flex flex-col items-center justify-center gap-2 text-center min-h-32.5 px-4 py-6"
                style={{ border: '1px solid var(--color-agro-surface-a40)' }}
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: 'var(--color-agro-primary-a10)' }}
                >
                  <Icon size={14} strokeWidth={2.5} style={{ color: 'var(--color-agro-text-inverse)' }} />
                </span>
                <span
                  className="text-[13px] font-bold leading-snug"
                  style={{ color: 'var(--color-agro-primary-a10)' }}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className="shrink-0 px-1.5 font-black text-base"
                  style={{ color: 'var(--color-agro-primary-a40)' }}
                  aria-hidden="true"
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: vertical list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 xl:hidden">
          {STEPS.map(({ label, Icon }, i) => (
            <div
              key={label}
              className="agro-card-lift bg-agro-surface rounded-2xl flex items-center gap-4 px-5 py-4"
              style={{ ...staggerDelay(i * 70), border: '1px solid var(--color-agro-surface-a40)' }}
              data-reveal="line"
            >
              <span
                className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'var(--color-agro-primary-a10)' }}
              >
                <Icon size={15} strokeWidth={2.5} style={{ color: 'var(--color-agro-text-inverse)' }} />
              </span>
              <div>
                <span
                  className="text-xs font-black tabular-nums"
                  style={{ color: 'var(--color-agro-primary-a30)' }}
                >
                  Step {i + 1}
                </span>
                <p
                  className="text-sm font-bold"
                  style={{ color: 'var(--color-agro-primary-a10)' }}
                >
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
