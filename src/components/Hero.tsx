import { ChevronDown } from 'lucide-react';
import { staggerDelay } from '../lib/motion';

const HERO_PROOF_POINTS = [
  '1,000+ farmer relationships',
  '1,500 acres in production',
  '47+ jobs created',
] as const;

export function Hero() {
  return (
    <section
      className="min-h-[calc(100svh-76px)] sm:min-h-[calc(100svh-84px)] flex flex-col items-center justify-between"
      style={{
        background: [
          'radial-gradient(circle at top right, rgba(241, 205, 117, 0.12), transparent 28%)',
          'linear-gradient(180deg, rgba(255, 255, 255, 0.035), transparent 26%)',
          'linear-gradient(var(--agro-hero-overlay), var(--agro-hero-overlay))',
        ].join(', '),
      }}
    >
      <div className="max-w-280 mx-auto w-full px-[4%] flex-1 flex items-center">
        <div className="grid w-full items-center gap-8 md:gap-10 py-14 sm:py-18 lg:py-22">
          <div className="max-w-none lg:max-w-215">
            <span
              className="inline-block mb-5 max-w-full px-3.5 py-2 rounded-full text-[13px] sm:text-sm leading-snug font-semibold tracking-[0.4px]"
              style={{
                ...staggerDelay(0),
                background: 'var(--agro-overlay-pill-bg)',
                border: '1px solid var(--agro-overlay-pill-border)',
                color: 'var(--color-agro-text-inverse)',
              }}
              data-reveal="line"
            >
              Agro Processing · Farmer Networks · Biomass Solutions
            </span>

            <h1
              className="font-bold leading-[0.94] sm:leading-[0.98] mb-5 sm:mb-6"
              style={{
                ...staggerDelay(90),
                fontSize: 'clamp(3.1rem, 10vw, 5.45rem)',
                color: 'var(--color-agro-heading-on-dark)',
                letterSpacing: '-0.025em',
              }}
              data-reveal="line"
            >
              Creating value from agricultural supply chains in Ghana.
            </h1>

            <p
              className="text-lg sm:text-[1.2rem] leading-[1.72] sm:leading-[1.76] mb-8 sm:mb-9"
              style={{
                ...staggerDelay(180),
                color: 'var(--color-agro-text-on-dark)',
                maxWidth: '720px',
              }}
              data-reveal="line"
            >
              GreenEarth Agro combines farming operations, smallholder sourcing,
              value-added processing, and biomass utilization into one integrated supply chain.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3.5 sm:gap-4 max-w-sm sm:max-w-none" style={staggerDelay(270)} data-reveal="line">
              <a href="#what-we-do" className="btn-gold w-full sm:w-auto text-center">Explore What We Do</a>
              <a href="#contact" className="btn-outline-white w-full sm:w-auto text-center">Contact Us</a>
            </div>

            <div
              className="mt-8 sm:mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-5"
              style={staggerDelay(360)}
              data-reveal="line"
            >
              {HERO_PROOF_POINTS.map((item) => (
                <span
                  key={item}
                  className="agro-proof-chip"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <a
        href="#what-we-do"
        className="agro-scroll-cue mb-7"
        aria-label="Scroll to What We Do"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.22em]">
          Explore
        </span>
        <ChevronDown size={20} strokeWidth={1.9} />
      </a>
    </section>
  );
}
