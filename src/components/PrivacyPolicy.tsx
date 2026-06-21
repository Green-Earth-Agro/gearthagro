import { ArrowLeft } from 'lucide-react';
import logo from '../assets/logo/agro_logo.svg';

const EFFECTIVE_DATE = '20 June 2026';

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-agro-gold-a0)] rounded-sm';

function slug(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2 pl-5 list-disc marker:text-agro-gold-a0">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: 'Information We Collect',
    body: (
      <>
        <p>We may collect the following types of information:</p>
        <Bullets
          items={[
            <><strong>Personal Information</strong> (such as name, email address, phone number) if you voluntarily provide it.</>,
            <><strong>Device Information</strong> (such as device type, operating system, and IP address).</>,
            <><strong>Usage Data</strong> (such as pages visited, clicks, and app interactions).</>,
            <><strong>Location Data</strong> (only if you grant permission in the app).</>,
          ]}
        />
      </>
    ),
  },
  {
    title: 'Use of Information',
    body: (
      <>
        <p>We use collected information to:</p>
        <Bullets
          items={[
            'Provide and improve our services',
            'Personalize user experience',
            'Respond to customer support requests',
            'Communicate updates, features, or promotions',
            'Ensure app performance, security, and analytics',
          ]}
        />
      </>
    ),
  },
  {
    title: 'Sharing of Information',
    body: (
      <>
        <p>We do not sell or rent your personal data. We may share information only with:</p>
        <Bullets
          items={[
            'Service providers that support our app (such as analytics or hosting services)',
            'Authorities if required by law',
          ]}
        />
      </>
    ),
  },
  {
    title: 'Data Retention and Protection',
    body: (
      <p>
        We retain your information only as long as necessary for the purposes described in this
        policy. We use reasonable administrative, technical, and physical safeguards to protect your
        data.
      </p>
    ),
  },
  {
    title: 'Cookies and Tracking',
    body: (
      <p>
        We may use cookies or similar technologies to improve user experience and app performance.
        You may disable cookies through your device or browser settings.
      </p>
    ),
  },
  {
    title: 'Children’s Privacy',
    body: (
      <p>
        Our services are not intended for children under 13, and we do not knowingly collect data
        from children.
      </p>
    ),
  },
  {
    title: 'Your Rights',
    body: (
      <>
        <p>Depending on your region, you may have the right to:</p>
        <Bullets
          items={[
            'Request access, correction, or deletion of your data',
            'Withdraw consent at any time',
            'Disable app permissions through your device settings',
          ]}
        />
      </>
    ),
  },
  {
    title: 'Third-Party Links',
    body: (
      <p>
        Our app or website may contain links to external sites. We are not responsible for the
        privacy practices of those websites.
      </p>
    ),
  },
  {
    title: 'Changes to this Policy',
    body: (
      <p>
        We may update this Privacy Policy from time to time. The updated version will be posted on
        this page with a revised effective date.
      </p>
    ),
  },
  {
    title: 'Contact Us',
    body: (
      <p>
        If you have any questions about this Privacy Policy, you may contact us at{' '}
        <a
          href="mailto:info@gearthagro.com"
          className={`font-semibold underline decoration-[color:var(--color-agro-gold-a10)] decoration-2 underline-offset-2 ${focusRing}`}
          style={{ color: 'var(--color-agro-text-primary)' }}
        >
          info@gearthagro.com
        </a>
        .
      </p>
    ),
  },
];

export function PrivacyPolicy() {
  return (
    <div style={{ background: 'var(--agro-bg)' }} className="min-h-screen">
      {/* Top bar — mirrors the site Navbar shell */}
      <header
        className="bg-agro-surface agro-nav-shell sticky top-0 z-50"
        style={{ borderBottom: '1px solid var(--color-agro-surface-a30)' }}
      >
        <div className="max-w-280 mx-auto px-[4%] flex items-center justify-between gap-3 py-3.5 sm:py-4.5">
          <a href="/" className={`flex items-center gap-3 min-w-0 ${focusRing}`}>
            <img
              src={logo}
              alt="GreenEarth Agro logo"
              className="h-11 w-11 shrink-0 object-contain"
            />
            <span
              className="text-[18px] sm:text-[22px] font-extrabold tracking-[0.5px] leading-none"
              style={{ fontFamily: 'var(--font-agro-heading)', color: 'var(--color-agro-primary-a10)' }}
            >
              GreenEarth Agro
            </span>
          </a>

          <a
            href="/"
            className={`agro-nav-link inline-flex items-center gap-1.5 text-sm font-semibold ${focusRing}`}
          >
            <ArrowLeft size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Back to site</span>
          </a>
        </div>
      </header>

      <main className="max-w-280 mx-auto px-[4%] py-12 sm:py-16">
        <article className="max-w-[68ch]">
          {/* Header block */}
          <p
            className="text-sm font-bold uppercase tracking-[1.6px]"
            style={{ color: 'var(--color-agro-text-muted)' }}
          >
            Legal
          </p>
          <h1
            className="font-bold leading-[1.05] mt-2.5"
            style={{
              fontSize: 'clamp(34px, 5vw, 52px)',
              color: 'var(--color-agro-text-primary)',
            }}
          >
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--color-agro-text-muted)' }}>
            Effective {EFFECTIVE_DATE}
          </p>

          <p
            className="mt-7 text-lg leading-relaxed"
            style={{ color: 'var(--color-agro-text-secondary)' }}
          >
            GreenEarth Agro Industries Limited (“we”, “our”, or “us”) operates this mobile application and
            website. This Privacy Policy explains how we collect, use, and protect your information
            when you use our services.
          </p>

          {/* Numbered clauses */}
          <div
            className="mt-12 space-y-11"
            style={{ borderTop: '1px solid var(--color-agro-surface-a30)' }}
          >
            {SECTIONS.map(({ title, body }, i) => (
              <section key={title} id={slug(title)} className="pt-11 first:pt-12">
                <div className="flex items-baseline gap-3.5">
                  <span
                    aria-hidden="true"
                    className="shrink-0 font-bold tabular-nums leading-none"
                    style={{
                      fontFamily: 'var(--font-agro-heading)',
                      fontSize: 'clamp(20px, 2.4vw, 26px)',
                      color: 'var(--color-agro-gold-a0)',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2
                    className="font-bold leading-tight"
                    style={{
                      fontSize: 'clamp(22px, 2.6vw, 30px)',
                      color: 'var(--color-agro-text-primary)',
                    }}
                  >
                    {title}
                  </h2>
                </div>
                <div
                  className="mt-3.5 space-y-3 text-base leading-relaxed"
                  style={{ color: 'var(--color-agro-text-secondary)' }}
                >
                  {body}
                </div>
              </section>
            ))}
          </div>

          <div
            className="mt-14 pt-9 flex flex-wrap items-center gap-4"
            style={{ borderTop: '1px solid var(--color-agro-surface-a30)' }}
          >
            <a href="/" className={`btn-gold ${focusRing}`}>
              Back to GreenEarth Agro
            </a>
            <span className="text-sm" style={{ color: 'var(--color-agro-text-muted)' }}>
              GreenEarth Agro Industries Limited · Ghana
            </span>
          </div>
        </article>
      </main>
    </div>
  );
}
