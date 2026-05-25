import { Check, FileText, MapPin, Sprout } from 'lucide-react';
import { staggerDelay } from '../lib/motion';

const LEASE_POINTS = [
  {
    title: 'Land Review',
    description: 'We assess location, access, soil condition, water availability, and basic land documentation.',
    Icon: MapPin,
  },
  {
    title: 'Clear Lease Terms',
    description: 'Landowners get agreed lease terms before GreenEarth Agro begins any farming activity.',
    Icon: FileText,
  },
  {
    title: 'Productive Use',
    description: 'Suitable land is put into structured farming operations managed by GreenEarth Agro.',
    Icon: Sprout,
  },
];

export function LandLeasing() {
  return (
    <section id="land-leasing" className="py-16 sm:py-20.5 bg-agro-sage">
      <div className="max-w-280 mx-auto px-[4%] grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-11 items-start">
        <div className="max-w-160" style={staggerDelay(40)} data-reveal="left">
          <span
            className="text-sm font-bold uppercase tracking-[1.2px] block mb-3"
            style={{ color: 'var(--color-agro-primary-a30)' }}
          >
            Land Leasing
          </span>
          <h2
            className="font-bold leading-[1.1] mb-5"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--color-agro-primary-a0)' }}
          >
            Lease farmland to GreenEarth Agro.
          </h2>
          <p className="text-base sm:text-lg text-agro-muted mb-4 leading-relaxed">
            Farmers and landowners with access to suitable farming land can lease that land to
            GreenEarth Agro for managed agricultural production.
          </p>
          <p className="text-base sm:text-lg text-agro-muted mb-7 leading-relaxed">
            We review each site, agree terms with the landowner, and use approved land for crop
            production linked to our processing and sourcing needs.
          </p>
          <a href="#contact" className="btn-gold w-full sm:w-auto text-center">Discuss Land Leasing</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4" style={staggerDelay(140)} data-reveal="right">
          {LEASE_POINTS.map(({ title, description, Icon }, index) => (
            <div
              key={title}
              className="agro-card-lift bg-agro-surface rounded-2xl p-5 sm:p-6"
              style={{ ...staggerDelay(index * 80), border: '1px solid var(--color-agro-surface-a40)' }}
            >
              <div className="flex items-start gap-4">
                <span
                  className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--color-agro-primary-a10)' }}
                >
                  <Icon size={18} strokeWidth={2.4} style={{ color: 'var(--color-agro-text-inverse)' }} />
                </span>
                <div>
                  <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-agro-primary-a10)' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed text-agro-muted">{description}</p>
                </div>
              </div>
            </div>
          ))}

          <div
            className="bg-agro-surface rounded-2xl p-5 sm:p-6"
            style={{ border: '1px solid var(--color-agro-surface-a40)' }}
          >
            <h3 className="text-base font-bold mb-3" style={{ color: 'var(--color-agro-primary-a10)' }}>
              Useful Details To Share
            </h3>
            <ul className="space-y-2">
              {['Land location', 'Approximate acreage', 'Current land use', 'Access road condition'].map((item) => (
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
      </div>
    </section>
  );
}
