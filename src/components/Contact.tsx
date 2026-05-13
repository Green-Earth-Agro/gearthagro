import { Building2, Mail, Phone } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { staggerDelay } from '../lib/motion';

interface ContactItemProps {
  Icon: LucideIcon;
  label: string;
  children: React.ReactNode;
}

function ContactItem({ Icon, label, children }: ContactItemProps) {
  return (
    <div>
      <strong
        className="flex items-center gap-2 mb-2 text-sm font-bold uppercase tracking-[1px]"
        style={{ color: 'var(--color-agro-gold-a20)' }}
      >
        <Icon size={14} strokeWidth={2.5} />
        {label}
      </strong>
      <div style={{ color: 'var(--color-agro-text-on-dark)' }} className="leading-relaxed">
        {children}
      </div>
    </div>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      className="overflow-hidden py-16 sm:py-20.5"
      style={{ background: 'var(--color-agro-primary-a0)' }}
    >
      <div className="max-w-280 mx-auto px-[4%]">
        <div className="max-w-190 mb-11" data-reveal="line">
          <span
            className="text-sm font-bold uppercase tracking-[1.2px]"
            style={{ color: 'var(--color-agro-gold-a30)' }}
          >
            Contact
          </span>
          <h2
            className="font-bold leading-[1.1] mt-3"
            style={{
              fontSize: 'clamp(32px, 4vw, 48px)',
              color: 'var(--color-agro-heading-on-dark)',
            }}
          >
            Work with GreenEarth Agro.
          </h2>
          <p
            className="mt-3 text-base sm:text-lg leading-relaxed"
            style={{ color: 'var(--color-agro-text-on-dark)' }}
          >
            Contact us for agro-processing partnerships, raw material supply, biomass supply,
            farmer sourcing, or general enquiries.
          </p>
        </div>

        <div
          className="rounded-[18px] p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
          style={{
            ...staggerDelay(80),
            background: 'var(--agro-card-overlay-bg)',
            border: '1px solid var(--agro-card-overlay-border)',
          }}
          data-reveal="image"
        >
          <div data-reveal="line" style={staggerDelay(160)}>
            <ContactItem Icon={Building2} label="Company">
              GreenEarth Agro Industries Limited<br />
              Ghana &amp; Luxembourg
            </ContactItem>
          </div>

          <div data-reveal="line" style={staggerDelay(240)}>
            <ContactItem Icon={Mail} label="Email">
              <a
                href="mailto:info@gearthagro.com"
                className="hover:underline"
                style={{ color: 'var(--color-agro-text-on-dark)' }}
              >
                info@gearthagro.com
              </a>
            </ContactItem>
          </div>

          <div data-reveal="line" style={staggerDelay(320)} className="sm:col-span-2 lg:col-span-1">
            <ContactItem Icon={Phone} label="Phone">
              <a
                href="tel:+233249495654"
                className="hover:underline"
                style={{ color: 'var(--color-agro-text-on-dark)' }}
              >
                +233 249495654
              </a>
              <br />
              {/* +352 [Insert Number] */}
            </ContactItem>
          </div>
        </div>
      </div>
    </section>
  );
}
