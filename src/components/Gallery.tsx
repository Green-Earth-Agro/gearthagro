import gallery1 from '../assets/gallery/IMG_20251120_101353.jpg';
import gallery2 from '../assets/gallery/IMG_20251120_101503.jpg';
import gallery3 from '../assets/gallery/IMG_20251120_101509.jpg';
import gallery4 from '../assets/gallery/IMG_20251120_101519.jpg';
import gallery5 from '../assets/gallery/IMG_20251120_101637.jpg';
import gallery6 from '../assets/gallery/IMG_20251120_102536.jpg';
import gallery7 from '../assets/gallery/IMG_20251120_102650.jpg';
import gallery8 from '../assets/gallery/IMG_20251120_102714.jpg';
import gallery9 from '../assets/gallery/IMG_20260512_143331.jpg';
import gallery10 from '../assets/gallery/IMG_20260512_143357.jpg';
import gallery11 from '../assets/gallery/IMG_20260512_143437.jpg';
import gallery12 from '../assets/gallery/IMG_20260512_143527.jpg';
import { staggerDelay } from '../lib/motion';

const GALLERY_ITEMS = [
  { src: gallery1, label: 'Palm oil processing area at GreenEarth Agro' },
  { src: gallery2, label: 'Palm kernel shells prepared beside processing equipment' },
  { src: gallery3, label: 'Palm oil expeller machinery inside the processing facility' },
  { src: gallery4, label: 'GreenEarth Agro team members in a maize field' },
  { src: gallery5, label: 'Farmer group standing in cultivated farmland' },
  { src: gallery6, label: 'Field team members standing among maize crops' },
  { src: gallery7, label: 'Agricultural processing workspace with shell handling equipment' },
  { src: gallery8, label: 'GreenEarth Agro processing setup and machinery' },
  { src: gallery9, label: 'Processing machinery and shell handling equipment on site' },
  { src: gallery10, label: 'Palm kernel shell sorting and processing workspace' },
  { src: gallery11, label: 'Oil expeller and workshop equipment inside the processing facility' },
  { src: gallery12, label: 'Facility view with shell stockpiles and processing tools' },
];

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(145deg, oklch(83% 0.05 131), oklch(66% 0.078 131))',
  'linear-gradient(145deg, oklch(66% 0.078 131), oklch(50% 0.092 131))',
  'linear-gradient(145deg, oklch(87% 0.028 131), oklch(83% 0.05 131))',
  'linear-gradient(145deg, oklch(50% 0.092 131), oklch(43% 0.088 146))',
  'linear-gradient(145deg, oklch(95% 0.019 130), oklch(87% 0.028 131))',
  'linear-gradient(145deg, oklch(43% 0.088 146), oklch(34% 0.094 146))',
  'linear-gradient(145deg, oklch(83% 0.05 131), oklch(87% 0.028 131))',
  'linear-gradient(145deg, oklch(34% 0.094 146), oklch(27% 0.09 146))',
  'linear-gradient(145deg, oklch(79% 0.148 84), oklch(63% 0.128 66))',
  'linear-gradient(145deg, oklch(90% 0.09 87), oklch(79% 0.148 84))',
  'linear-gradient(145deg, oklch(58% 0.014 146), oklch(34% 0.094 146))',
  'linear-gradient(145deg, oklch(87% 0.028 131), oklch(58% 0.014 146))',
];

export function Gallery() {
  return (
    <section className="py-20.5" style={{ background: 'var(--color-agro-surface-a0)' }}>
      <div className="max-w-280 mx-auto px-[4%]">
        <div className="max-w-190 mb-11" data-reveal="line">
          <span
            className="text-sm font-bold uppercase tracking-[1.2px]"
            style={{ color: 'var(--color-agro-primary-a30)' }}
          >
            Gallery
          </span>
          <h2
            className="font-bold leading-[1.1] mt-3"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--color-agro-primary-a0)' }}
          >
            Our operations on the ground.
          </h2>
          <p className="mt-3 text-lg text-agro-muted">
            A look at our farms, processing facilities, and people across Ghana.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          {GALLERY_ITEMS.map(({ src, label }, i) => (
            <figure
              key={label}
              className="agro-media agro-card-lift h-52.5 overflow-hidden rounded-2xl"
              style={{ ...staggerDelay(i * 70), background: PLACEHOLDER_GRADIENTS[i] }}
              data-reveal="image"
            >
              <img
                src={src}
                alt={label}
                loading="lazy"
                decoding="async"
                className="block h-full w-full object-cover"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
