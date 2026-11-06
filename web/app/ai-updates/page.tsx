import type { Metadata } from 'next';
import Link from 'next/link';
import { Tr } from '@/components/tr';
import { getPublishedAiDigests } from '@/lib/ai-digest-content';

export const metadata: Metadata = {
  title: 'AI Updates for Practical Learning',
  description: 'Source-linked AI announcements with beginner relevance, limitations and a small practice activity. Only reviewed editions are published.',
  alternates: { canonical: '/ai-updates' }
};

export default function AiUpdatesPage() {
  const digests = getPublishedAiDigests();
  return <section className="section ai-updates"><div className="container first-app-project">
    <div className="section-head">
      <span className="eyebrow"><Tr>AI updates</Tr></span>
      <h1><Tr>Understand the news. Try one useful thing.</Tr></h1>
      <p><Tr>Short, source-linked editions connecting AI announcements to practical learning. Every published edition requires editorial review.</Tr></p>
      <p><Tr>Vendor announcements are not independent tests or endorsements. Availability, prices and capabilities can change; check the original source before using a tool.</Tr></p>
      <p><Tr>Editorial text is currently English. Interface labels follow your language.</Tr></p>
    </div>
    <details className="journey-portfolio">
      <summary><Tr>How we review AI updates</Tr></summary>
      <p><Tr>We check primary sources, separate vendor claims from our observations, explain access limits and suggest fictional practice. We correct or withdraw inaccurate editions through reviewed changes.</Tr></p>
      <p><Tr>Only approved editions appear here. There is no automatic publishing or digest email sending. Twice-weekly scheduling is not active.</Tr></p>
      <p><Tr>Drafts are reviewed in GitHub, not in private learner accounts. Repository drafts must never contain confidential information.</Tr></p>
    </details>
    {digests.length === 0 ? <div className="path-card">
      <h2><Tr>No reviewed editions yet</Tr></h2>
      <p><Tr>The first digest is awaiting source checks and editorial approval. We do not fill gaps with invented news.</Tr></p>
      <Link className="btn btn-primary" href="/start-here"><Tr>Start here</Tr></Link>
    </div> : <div className="journey-stages">
      {digests.map((digest) => <article className="path-card" key={digest.id} id={digest.id}>
        <h2><a href={`#${digest.id}`}>{digest.title}</a></h2>
        <p><Tr>Published</Tr>: <time dateTime={digest.publishedOn}>{digest.publishedOn}</time>
          {' · '}<Tr>Sources reviewed</Tr>: <time dateTime={digest.review.reviewedOn}>{digest.review.reviewedOn}</time></p>
        <p>{digest.summary}</p>
        {digest.items.map((item) => <section key={item.source.url} aria-label={item.title}>
          <h3>{item.title}</h3>
          <dl>
            <dt><strong><Tr>What the source announced</Tr></strong></dt><dd>{item.announcement}</dd>
            <dt><strong><Tr>Why it may matter</Tr></strong></dt><dd>{item.relevance}</dd>
            <dt><strong><Tr>Limits and unknowns</Tr></strong></dt><dd>{item.limitations}</dd>
            <dt><strong><Tr>Try a small fictional exercise</Tr></strong></dt><dd>{item.practice}</dd>
          </dl>
          <p><Tr>Primary source</Tr>: <a href={item.source.url} target="_blank" rel="noopener noreferrer">
            {item.source.title} <Tr>(opens in a new tab)</Tr>
          </a>{' — '}{item.source.publisher}{' · '}<Tr>Source date</Tr>: <time dateTime={item.source.publishedOn}>{item.source.publishedOn}</time></p>
          <Link className="text-link" href={item.practiceHref}><Tr>Open related practice</Tr></Link>
        </section>)}
      </article>)}
    </div>}
    <p><Tr>Use fictional information only. Do not upload client files or personal data to an external AI tool for these exercises.</Tr></p>
    <Link className="text-link" href="/contact"><Tr>Report an issue with an edition</Tr></Link>
  </div></section>;
}
