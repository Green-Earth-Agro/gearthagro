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
    title: 'Acceptance of Terms',
    body: (
      <p>
        By accessing or using the app, you confirm that you have read, understood, and agree to be
        bound by these Terms and by our Privacy Policy. These Terms apply to every person who uses the
        services, whether as a farmer or as staff.
      </p>
    ),
  },
  {
    title: 'Eligibility',
    body: (
      <p>
        You must be at least 18 years old, or the age of legal majority where you live, and able to
        enter into a binding contract to use the services. By using the app you represent that you meet
        these requirements and that the information you provide is accurate.
      </p>
    ),
  },
  {
    title: 'Your Account',
    body: (
      <>
        <p>When you create an account, you agree to:</p>
        <Bullets
          items={[
            'Provide accurate and current information and keep it up to date',
            'Keep your login credentials and one-time codes confidential',
            'Take responsibility for all activity that happens under your account',
            'Tell us promptly if you suspect unauthorized use of your account',
          ]}
        />
      </>
    ),
  },
  {
    title: 'Using the Services',
    body: (
      <p>
        The app includes features such as farm support, land leasing, a produce market, and learning
        content. We grant you a personal, limited, non-transferable, and revocable licence to use the
        app for these purposes. We may add, change, or remove features at any time.
      </p>
    ),
  },
  {
    title: 'Farm Support',
    body: (
      <p>
        Farm support features let you request assistance, but submitting a request does not guarantee
        approval. Every request is subject to an eligibility review, our assessment, and the specific
        program terms presented to you, which you must accept separately. You are responsible for
        meeting your obligations under any agreement you accept.
      </p>
    ),
  },
  {
    title: 'Land Leasing and Produce Market',
    body: (
      <p>
        The land leasing and produce market features connect you with opportunities and other parties.
        Unless we state otherwise in writing, any lease or sale is an agreement between you and the
        other party. You are responsible for confirming the details, quality, price, and suitability of
        any arrangement before you commit.
      </p>
    ),
  },
  {
    title: 'Acceptable Use',
    body: (
      <>
        <p>You agree not to:</p>
        <Bullets
          items={[
            'Use the services for any unlawful, fraudulent, or harmful purpose',
            'Provide false information or impersonate another person',
            'Interfere with, disrupt, or attempt to gain unauthorized access to the services',
            'Copy, scrape, or misuse content or data from the app',
          ]}
        />
      </>
    ),
  },
  {
    title: 'Content and Intellectual Property',
    body: (
      <p>
        The app, its content, and its branding belong to us or our licensors and are protected by law.
        Content you submit remains yours, but you grant us a licence to use it as needed to operate and
        improve the services. You are responsible for the content you provide and must have the right to
        share it.
      </p>
    ),
  },
  {
    title: 'Third-Party Services',
    body: (
      <p>
        The app may rely on or link to third-party services, such as payment, messaging, or hosting
        providers. Their own terms and privacy practices apply, and we are not responsible for them.
      </p>
    ),
  },
  {
    title: 'Disclaimers',
    body: (
      <p>
        The services are provided on an "as is" and "as available" basis without warranties of any kind,
        whether express or implied. We do not guarantee that the services will be uninterrupted,
        error-free, or secure, or that any result, including approval of a support request or a
        successful sale, will be achieved.
      </p>
    ),
  },
  {
    title: 'Limitation of Liability',
    body: (
      <p>
        To the fullest extent permitted by law, we are not liable for any indirect, incidental, or
        consequential loss, or for loss of profit, data, or goodwill, arising from your use of the
        services. Nothing in these Terms excludes liability that cannot be excluded under applicable law.
      </p>
    ),
  },
  {
    title: 'Suspension and Termination',
    body: (
      <p>
        We may suspend or close your account if you breach these Terms, if required by law, or to protect
        the services and other users. You may stop using the app and request that we delete your account
        at any time. Some provisions, by their nature, survive termination.
      </p>
    ),
  },
  {
    title: 'Changes to the Services and These Terms',
    body: (
      <p>
        We may update these Terms from time to time. When we do, we will post the current version on this
        page with a new effective date. If you continue to use the services after a change takes effect,
        you accept the updated Terms.
      </p>
    ),
  },
  {
    title: 'Governing Law',
    body: (
      <p>
        These Terms are governed by the laws of the Republic of Ghana, and any dispute relating to them
        or to the services is subject to the jurisdiction of the courts of Ghana.
      </p>
    ),
  },
  {
    title: 'Contact Us',
    body: (
      <p>
        If you have any questions about these Terms, you may contact us at{' '}
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

export function TermsOfService() {
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
            Terms of Service
          </h1>
          <p className="mt-3 text-sm font-semibold" style={{ color: 'var(--color-agro-text-muted)' }}>
            Effective {EFFECTIVE_DATE}
          </p>

          <p
            className="mt-7 text-lg leading-relaxed"
            style={{ color: 'var(--color-agro-text-secondary)' }}
          >
            These Terms of Service ("Terms") govern your use of the GreenEarth Agro mobile app and
            related services operated by GreenEarth Agro Industries Limited ("we", "our", or "us"). By
            creating an account or using the app, you agree to these Terms. If you do not agree, please
            do not use the services.
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
