import { publicPageMetadata } from '@/lib/public-page-metadata';
import Link from 'next/link';
import { Tr } from '@/components/tr';

export const metadata = publicPageMetadata('/business-launchpad/freelance-portfolio', {
  title: 'Freelance Portfolio & Case Study Builder',
  description: 'Build a beginner freelance practice portfolio: write case studies, select saved evidence and use a print-ready layout to save as PDF.'
});

export default function FreelancePortfolioPage() {
  return <section className="section">
    <div className="container narrow-container">
      <div className="section-head">
        <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
        <h1><Tr>{'Freelance Portfolio & Case Study Builder'}</Tr></h1>
        <p><Tr>Turn saved practice into an honest work sample, not an invented client success story.</Tr></p>
      </div>
      <ol className="journey-stages">
        <li><h2><Tr>Choose one saved practice project</Tr></h2><p><Tr>Start with content, automation, video, spreadsheets, CAD concepts, micro-SaaS validation or adult education. Record actual evidence and unresolved checks first.</Tr></p></li>
        <li><h2><Tr>Write your case study and select evidence</Tr></h2><p><Tr>Explain the problem, your contribution, observed outcome and limitations. Select saved tests explicitly; whole-project gaps stay visible even when tests are omitted.</Tr></p></li>
        <li><h2><Tr>Review, print and share manually</Tr></h2><p><Tr>Save your draft, inspect the private preview and acknowledge sensitive-data review. Download text or use your browser to print or save as PDF. No public portfolio page, AI generation or automatic sharing.</Tr></p></li>
      </ol>
      <p><Tr>Case studies are clearly labelled fictional practice and self-recorded evidence. They do not certify skills or promise clients, employment or income.</Tr></p>
      <Link className="btn btn-primary" href="/business-launchpad/projects"><Tr>Open the Pilot Project Workspace</Tr></Link>
    </div>
  </section>;
}
