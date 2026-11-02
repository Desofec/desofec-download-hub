import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Desofec AI Studio team.'
};

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container legal">
        <h1>Contact us</h1>
        <p>Questions, feedback or a tool we should add? We would love to hear from you.</p>
        <p>
          Email: <a href="mailto:support@desofec.com">support@desofec.com</a>
        </p>
        <p>We usually reply within a few business days.</p>
      </div>
    </section>
  );
}
