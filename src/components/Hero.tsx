import { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage1 from '../assets/hero/image_1.svg';
import heroImage2 from '../assets/hero/image_2.svg';
import heroImage3 from '../assets/hero/image_3.svg';
import { staggerDelay } from '../lib/motion';

const HERO_IMAGES = [
  {
    src: heroImage1,
    alt: 'Field team members standing among maize crops at GreenEarth Agro',
  },
  {
    src: heroImage2,
    alt: 'Cassava and plantain crops on GreenEarth Agro farmland',
  },
  {
    src: heroImage3,
    alt: 'Cultivated farmland with banana and cassava growth under a stormy sky',
  },
] as const;

function wrapIndex(index: number) {
  return (index + HERO_IMAGES.length) % HERO_IMAGES.length;
}

export function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => wrapIndex(currentIndex + 1));
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const activeImage = HERO_IMAGES[activeIndex];
  const secondaryImage = HERO_IMAGES[wrapIndex(activeIndex + 1)];
  const tertiaryImage = HERO_IMAGES[wrapIndex(activeIndex + 2)];

  return (
    <section
      className="min-h-[88svh] md:min-h-[78vh] flex flex-col items-center justify-between"
      style={{
        background: [
          `linear-gradient(var(--agro-hero-overlay), var(--agro-hero-overlay))`,
          `url('${activeImage.src}') center/cover no-repeat`,
        ].join(', '),
      }}
    >
      <div className="max-w-280 mx-auto w-full px-[4%] flex-1 flex items-center">
        <div className="grid w-full items-center gap-8 md:gap-10 py-16 sm:py-20 lg:py-22.5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
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
              className="font-bold leading-[0.98] sm:leading-[1.02] mb-5 sm:mb-6"
              style={{
                ...staggerDelay(90),
                fontSize: 'clamp(2.8rem, 10vw, 5rem)',
                color: 'var(--color-agro-heading-on-dark)',
              }}
              data-reveal="line"
            >
              Creating value from agricultural supply chains in Ghana.
            </h1>

            <p
              className="text-lg sm:text-[1.2rem] leading-[1.65] sm:leading-[1.7] mb-8 sm:mb-9"
              style={{
                ...staggerDelay(180),
                color: 'var(--color-agro-text-on-dark)',
                maxWidth: '680px',
              }}
              data-reveal="line"
            >
              GreenEarth Agro combines own farming operations, smallholder sourcing,
              value-added processing, and biomass utilization into one integrated supply chain.
            </p>

            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3.5 sm:gap-4 max-w-sm sm:max-w-none" style={staggerDelay(270)} data-reveal="line">
              <a href="#what-we-do" className="btn-gold w-full sm:w-auto text-center">Explore What We Do</a>
              <a href="#contact" className="btn-outline-white w-full sm:w-auto text-center">Contact Us</a>
            </div>

            <div className="mt-7 sm:mt-8 flex flex-wrap items-center gap-3" style={staggerDelay(360)} data-reveal="line">
              <button
                type="button"
                aria-label="Show previous hero image"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                style={{
                  background: 'var(--agro-overlay-pill-bg)',
                  border: '1px solid var(--agro-overlay-pill-border)',
                  color: 'var(--color-agro-text-inverse)',
                }}
                onClick={() => setActiveIndex((currentIndex) => wrapIndex(currentIndex - 1))}
              >
                <ChevronLeft size={18} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                aria-label="Show next hero image"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full"
                style={{
                  background: 'var(--agro-overlay-pill-bg)',
                  border: '1px solid var(--agro-overlay-pill-border)',
                  color: 'var(--color-agro-text-inverse)',
                }}
                onClick={() => setActiveIndex((currentIndex) => wrapIndex(currentIndex + 1))}
              >
                <ChevronRight size={18} strokeWidth={2.2} />
              </button>
              <span
                className="text-sm font-semibold tracking-[0.24em] uppercase"
                style={{ color: 'var(--color-agro-text-on-dark)' }}
              >
                {String(activeIndex + 1).padStart(2, '0')} / {String(HERO_IMAGES.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          <div className="grid max-w-2xl mx-auto w-full grid-cols-2 gap-3 sm:gap-4 lg:max-w-none lg:grid-cols-1">
            <figure
              className="agro-media agro-hero-floating col-span-2 lg:col-span-1 rounded-[24px] overflow-hidden"
              style={{
                ...staggerDelay(200),
                background: 'var(--agro-card-overlay-bg)',
                border: '1px solid var(--agro-card-overlay-border)',
                boxShadow: 'var(--agro-shadow-image)',
              }}
              data-reveal="right"
            >
              <img
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                loading="lazy"
                decoding="async"
                className="block h-44 sm:h-56 w-full object-cover"
              />
            </figure>
            <figure
              className="agro-media agro-hero-floating rounded-[24px] overflow-hidden"
              style={{
                ...staggerDelay(320),
                background: 'var(--agro-card-overlay-bg)',
                border: '1px solid var(--agro-card-overlay-border)',
                boxShadow: 'var(--agro-shadow-image)',
              }}
              data-reveal="right"
            >
              <img
                src={tertiaryImage.src}
                alt={tertiaryImage.alt}
                loading="lazy"
                decoding="async"
                className="block h-36 sm:h-44 w-full object-cover"
              />
            </figure>
          </div>
        </div>
      </div>

      <div className="pb-8 text-agro-on-dark opacity-60" aria-hidden="true">
        <ChevronDown size={24} strokeWidth={1.5} />
      </div>
    </section>
  );
}
