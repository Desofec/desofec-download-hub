import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="section narrow-section">
      <div className="container small-container center-head">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p>We could not find that page. Try browsing the learning paths instead.</p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/paths">
            Browse learning paths
          </Link>
          <Link className="btn btn-secondary" href="/">
            Go home
          </Link>
        </div>
      </div>
    </section>
  );
}
