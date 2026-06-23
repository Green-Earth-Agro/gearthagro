export function Footer() {
  return (
    <footer
      className="py-6 text-sm"
      style={{
        background: 'var(--agro-footer-bg)',
        color: 'var(--agro-footer-text)',
      }}
    >
      <div className="max-w-280 mx-auto px-[4%] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span>
          © {new Date().getFullYear()} GreenEarth Agro Industries Limited. All rights reserved.
        </span>
        <nav className="flex items-center gap-5">
          <a
            href="#/terms"
            className="font-semibold transition-opacity hover:opacity-80 hover:underline"
          >
            Terms of Service
          </a>
          <a
            href="#/privacy"
            className="font-semibold transition-opacity hover:opacity-80 hover:underline"
          >
            Privacy Policy
          </a>
        </nav>
      </div>
    </footer>
  );
}
