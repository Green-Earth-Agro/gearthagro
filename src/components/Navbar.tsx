import { useState } from 'react';
import logo from '../assets/logo/agro_logo.svg';

const NAV_LINKS = [
  ['#what-we-do', 'What We Do'],
  ['#model', 'Our Model'],
  ['#biomass', 'Biomass'],
  ['#impact', 'Impact'],
  ['#contact', 'Contact'],
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="bg-agro-surface agro-nav-shell sticky top-0 z-50"
      style={{ borderBottom: '1px solid var(--color-agro-surface-a30)' }}
    >
      <div className="max-w-280 mx-auto px-[4%] flex items-center justify-between gap-3 py-3.5 sm:py-4.5">
        <a
          href="/"
          className="flex items-center gap-3 min-w-0"
        >
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

        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex gap-6 text-sm font-semibold"
            style={{ color: 'var(--color-agro-text-secondary)' }}
          >
            {NAV_LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="agro-nav-link"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.25 p-2 -mr-2"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span
              className="block w-5 h-0.5 rounded-full transition-transform origin-center"
              style={{
                background: 'var(--color-agro-primary-a10)',
                transform: open ? 'translateY(7px) rotate(45deg)' : undefined,
              }}
            />
            <span
              className="block w-5 h-0.5 rounded-full transition-opacity"
              style={{
                background: 'var(--color-agro-primary-a10)',
                opacity: open ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-0.5 rounded-full transition-transform origin-center"
              style={{
                background: 'var(--color-agro-primary-a10)',
                transform: open ? 'translateY(-7px) rotate(-45deg)' : undefined,
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="lg:hidden"
          style={{ borderTop: '1px solid var(--color-agro-surface-a30)' }}
        >
            {NAV_LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="block px-[4%] py-3.5 text-sm font-semibold transition-colors hover:text-agro-primary"
                style={{
                  color: 'var(--color-agro-text-secondary)',
                  borderBottom: '1px solid var(--color-agro-surface-a30)',
              }}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
