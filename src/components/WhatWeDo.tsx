import { Check } from 'lucide-react';
import processingImage from '../assets/what_we_do/agro_processing.svg';
import biomassImage from '../assets/what_we_do/biomass.svg';
import farmImage from '../assets/what_we_do/farm.svg';
import { staggerDelay } from '../lib/motion';

interface ServiceCardProps {
  image: string;
  imageFallback: string;
  title: string;
  description: string;
  bullets: string[];
}

function ServiceCard({ image, imageFallback, title, description, bullets }: ServiceCardProps) {
  return (
    <div
      className="agro-card-lift bg-agro-surface rounded-[18px] overflow-hidden"
      style={{ border: '1px solid var(--color-agro-surface-a30)', boxShadow: 'var(--agro-shadow-card)' }}
    >
      <figure className="agro-media h-48 sm:h-52.5" style={{ background: imageFallback }}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-cover"
        />
      </figure>
      <div className="p-5 sm:p-7">
        <h3
          className="text-[1.35rem] sm:text-2xl font-bold mb-3"
          style={{ color: 'var(--color-agro-primary-a10)' }}
        >
          {title}
        </h3>
        <p className="mb-4 text-base sm:text-[1rem] text-agro-muted leading-relaxed">{description}</p>
        <ul className="space-y-2">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: 'var(--color-agro-text-secondary)' }}>
              <Check
                size={13}
                strokeWidth={3}
                className="shrink-0 mt-[3px]"
                style={{ color: 'var(--color-agro-primary-a30)' }}
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function WhatWeDo() {
  const services: ServiceCardProps[] = [
    {
      image: farmImage,
      imageFallback: 'linear-gradient(145deg, oklch(83% 0.05 131), oklch(66% 0.078 131))',
      title: 'Farming & Sourcing',
      description: 'We cultivate our own farms while sourcing additional raw materials from local smallholder farmers.',
      bullets: ['Own farming operations', 'Smallholder farmer network', 'Pre-financing opportunities', 'Stable market access'],
    },
    {
      image: processingImage,
      imageFallback: 'linear-gradient(145deg, oklch(87% 0.028 131), oklch(83% 0.05 131))',
      title: 'Agro Processing',
      description: 'We transform agricultural raw materials into higher-value products for local and regional markets.',
      bullets: ['Palm-based processing', 'Cooking oil production', 'Cassava processing', 'Value-added products'],
    },
    {
      image: biomassImage,
      imageFallback: 'linear-gradient(145deg, oklch(95% 0.019 130), oklch(87% 0.028 131))',
      title: 'Biomass',
      description: 'We utilize agricultural by-products and waste streams to create additional value through biomass solutions.',
      bullets: ['Palm Kernel Shells', 'Bamboo chips', 'Biomass materials', 'Pyrolysis initiatives'],
    },
  ];

  return (
    <section id="what-we-do" className="py-16 sm:py-20.5" style={{ background: 'var(--agro-bg)' }}>
      <div className="max-w-280 mx-auto px-[4%]">
        <div className="max-w-190 mb-11" data-reveal="line">
          <span
            className="text-sm font-bold uppercase tracking-[1.2px]"
            style={{ color: 'var(--color-agro-primary-a30)' }}
          >
            What We Do
          </span>
          <h2
            className="font-bold leading-[1.1] mt-3"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--color-agro-primary-a0)' }}
          >
            Farming, processing, and circular biomass solutions.
          </h2>
          <p className="mt-3 text-lg text-agro-muted">
            We operate across the agricultural value chain, from raw material sourcing to
            processing and by-product utilization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {services.map((s, index) => (
            <div key={s.title} data-reveal="image" style={staggerDelay(index * 90)}>
              <ServiceCard {...s} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
