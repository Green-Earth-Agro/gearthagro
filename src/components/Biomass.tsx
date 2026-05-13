import { staggerDelay } from '../lib/motion';

const BIOMASS_SECTION_IMAGE =
  'https://commons.wikimedia.org/wiki/Special:FilePath/Bamboo%20cutter.jpg';

export function Biomass() {
  return (
    <section id="biomass" className="py-16 sm:py-20.5" style={{ background: 'var(--agro-bg)' }}>
      <div className="max-w-280 mx-auto px-[4%] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-11 items-center">
        <figure
          className="agro-media min-h-[320px] sm:min-h-[430px] overflow-hidden rounded-[22px]"
          style={{
            ...staggerDelay(40),
            background: 'linear-gradient(145deg, oklch(87% 0.028 131), oklch(83% 0.05 131))',
            boxShadow: 'var(--agro-shadow-image)',
          }}
          data-reveal="left"
        >
          <img
            src={BIOMASS_SECTION_IMAGE}
            alt="Worker cutting bamboo in Ghana for biomass-related use"
            loading="lazy"
            decoding="async"
            className="block h-[320px] sm:h-[430px] w-full object-cover"
          />
        </figure>

        <div style={staggerDelay(140)} data-reveal="right">
          <span
            className="text-sm font-bold uppercase tracking-[1.2px] block mb-3"
            style={{ color: 'var(--color-agro-primary-a30)' }}
          >
            Biomass
          </span>
          <h2
            className="font-bold leading-[1.1] mb-5"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--color-agro-primary-a0)' }}
          >
            Turning agricultural by-products into useful biomass materials.
          </h2>
          <p className="text-base sm:text-lg text-agro-muted mb-4 leading-relaxed">
            Our biomass division focuses on utilizing by-products and agricultural waste streams
            that would otherwise be underused or discarded.
          </p>
          <p className="text-base sm:text-lg text-agro-muted mb-7 leading-relaxed">
            This includes palm kernel shells, bamboo chips, biomass materials, and pyrolysis
            initiatives that support a more circular agricultural ecosystem.
          </p>
          <a href="#contact" className="btn-gold w-full sm:w-auto text-center">Discuss Biomass Supply</a>
        </div>
      </div>
    </section>
  );
}
