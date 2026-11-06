import type { Metadata } from 'next';
import { SpreadsheetPracticeLab } from '@/components/spreadsheet-practice-lab';
import { Tr } from '@/components/tr';

const title = 'Excel Data Cleaning & PDF-to-Excel Services: Practice Lab';
const description = 'Practise Excel data cleaning, PDF-to-Excel checking and business reports with fictional source data, downloadable PDF and CSV, and explicit missing-value checks.';
const canonical = 'https://desofec.com/business-launchpad/spreadsheet-lab';
export const metadata: Metadata = {
  title, description, alternates: { canonical },
  openGraph: { title, description, url: canonical, type: 'website' },
  twitter: { card: 'summary', title, description }
};
export default function SpreadsheetLabPage() {
  return <section className="section"><div className="container">
    <div className="section-head">
      <span className="eyebrow"><Tr>AI Business Launchpad</Tr></span>
      <h1><Tr>{'Excel Data Cleaning & PDF-to-Excel Services'}</Tr></h1>
      <p><Tr>Three checked spreadsheet exercises: clean data, reconcile a PDF transcription and prepare an honest business report. Paid AI is optional.</Tr></p>
    </div>
    <SpreadsheetPracticeLab />
  </div></section>;
}
