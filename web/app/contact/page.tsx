import Link from 'next/link';
import { Tr } from '@/components/tr';
import { publicPageMetadata } from '@/lib/public-page-metadata';

export const metadata = publicPageMetadata('/contact', {
  title: 'Contact',
  description: 'Get in touch with the Desofec AI Studio team.'
});

export default function ContactPage() {
  return (
    <section className="section">
      <div className="container legal">
        <h1><Tr>Contact us</Tr></h1>
        <p><Tr>Questions, feedback or a tool we should add? We would love to hear from you.</Tr></p>
        <p><Tr>Tell us which page you were using, what you wanted to do and where you got stuck.</Tr></p>
        <p><Tr>Please do not send passwords, API keys, sign-in links or confidential project or client details.</Tr></p>
        <p>
          <Tr>Email:</Tr>{' '}<a href="mailto:support@desofec.com">support@desofec.com</a>
        </p>
        <p><Tr>This opens your email app. Review your message before sending; nothing is sent automatically.</Tr></p>
        <p><Tr>Response times can vary.</Tr></p>
        <p><Link href="/start-here"><Tr>Need a starting point? Open the beginner guide.</Tr></Link></p>
      </div>
    </section>
  );
}
