export function Footer() {
  return (
    <footer
      className="py-6 text-sm"
      style={{
        background: 'var(--agro-footer-bg)',
        color: 'var(--agro-footer-text)',
      }}
    >
      <div className="max-w-280 mx-auto px-[4%]" data-reveal="line">
        © {new Date().getFullYear()} GreenEarth Agro Industries Limited. All rights reserved.
      </div>
    </footer>
  );
}
