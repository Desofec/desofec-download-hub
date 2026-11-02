import Link from 'next/link';
import { Tr } from '@/components/tr';

export default function NotFound() {
  return (
    <section className="section narrow-section">
      <div className="container small-container center-head">
        <span className="eyebrow">404</span>
        <h1><Tr>Page not found</Tr></h1>
        <p><Tr>We could not find that page. Try browsing the learning paths instead.</Tr></p>
        <div className="cta-row">
          <Link className="btn btn-primary" href="/paths">
            <Tr>Browse learning paths</Tr>
          </Link>
          <Link className="btn btn-secondary" href="/">
            <Tr>Go home</Tr>
          </Link>
        </div>
      </div>
    </section>
  );
}
