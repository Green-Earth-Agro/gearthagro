import { useEffect, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImage1 from '../assets/hero/image_1.jpg';
import heroImage2 from '../assets/hero/image_2.jpg';
import heroImage3 from '../assets/hero/image_3.jpg';
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
      className="min-h-[78vh] flex flex-col items-center justify-between"
      style={{
        background: [
          `linear-gradient(var(--agro-hero-overlay), var(--agro-hero-overlay))`,
          `url('${activeImage.src}') center/cover no-repeat`,
        ].join(', '),
      }}
    >
      <div className="max-w-280 mx-auto w-full px-[4%] flex-1 flex items-center">
        <div className="grid w-full items-center gap-10 py-22.5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.7fr)]">
          <div className="max-w-215">
            <span
              className="inline-block mb-5 px-3.5 py-2 rounded-full text-sm font-semibold tracking-[0.4px]"
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
              className="font-bold leading-[1.02] mb-6"
              style={{
                ...staggerDelay(90),
                fontSize: 'clamp(48px, 6.5vw, 80px)',
                color: 'var(--color-agro-heading-on-dark)',
              }}
              data-reveal="line"
            >
              Creating value from agricultural supply chains in Ghana.
            </h1>

            <p
              className="text-[1.2rem] leading-[1.7] mb-9"
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

            <div className="flex flex-wrap gap-4" style={staggerDelay(270)} data-reveal="line">
              <a href="#what-we-do" className="btn-gold">Explore What We Do</a>
              <a href="#contact" className="btn-outline-white">Contact Us</a>
            </div>

            <div className="mt-8 flex items-center gap-3" style={staggerDelay(360)} data-reveal="line">
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

          <div className="hidden lg:grid gap-4">
            <figure
              className="agro-media agro-hero-floating rounded-[24px] overflow-hidden"
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
                className="block h-56 w-full object-cover"
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
                className="block h-44 w-full object-cover"
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
