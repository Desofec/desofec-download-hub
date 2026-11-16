import type { Metadata } from 'next';
import Link from 'next/link';
import { ComplaintCasePack } from '@/components/complaint-case-pack';
import { ComplaintTr } from '@/components/complaint-tr';

const route = '/business-launchpad/complaint-case-pack';

export const metadata: Metadata = {
  title: 'Complaint Case-Pack Practice',
  description: 'Practise organizing a fictional consumer complaint and reviewing a draft. No AI, real customer data or automatic sending.',
  alternates: { canonical: route },
  robots: { index: false, follow: true }
};

export default function ComplaintCasePackPage() {
  return (
    <section className="section">
      <div className="container narrow-container">
        <div className="complaint-practice">
          <div className="section-head">
            <span className="eyebrow"><ComplaintTr>Research prototype</ComplaintTr></span>
            <h1><ComplaintTr>Complaint case-pack practice</ComplaintTr></h1>
            <p><ComplaintTr>Practise turning a fictional delayed home-improvement order in Ireland into a clear case history and a letter you can review. This is an experiment, not an available complaint service.</ComplaintTr></p>
            <div className="cta-row">
              <Link className="btn btn-secondary" href="/business-launchpad"><ComplaintTr>Back to AI Business Launchpad</ComplaintTr></Link>
            </div>
          </div>

          <section className="path-card" aria-labelledby="complaint-guide-heading">
            <h2 id="complaint-guide-heading"><ComplaintTr>How to use the practice</ComplaintTr></h2>
            <ol>
              <li><ComplaintTr>Describe the fictional issue and put the important events in order.</ComplaintTr></li>
              <li><ComplaintTr>Add a fictional previous contact or say that the business has not been contacted.</ComplaintTr></li>
              <li><ComplaintTr>Consider which example documents might help, without uploading anything.</ComplaintTr></li>
              <li><ComplaintTr>Record fictional dated follow-up contacts and note what the business replied or promised.</ComplaintTr></li>
              <li><ComplaintTr>Choose the current outcome, your next action and an optional personal review date.</ComplaintTr></li>
              <li><ComplaintTr>Review the draft and practice pack. You can download it, but do not send it.</ComplaintTr></li>
            </ol>
            <p><ComplaintTr>A reply, a promised action and a resolved problem are separate states. You choose the status; the prototype does not infer a remedy from a message. The review date is for your own planning, not a legal deadline, and no reminder is sent.</ComplaintTr></p>
            <p><ComplaintTr>This fictional example is set in Ireland, not the United Kingdom. It does not explain UK consumer rights. For a real UK issue, check current guidance for the relevant UK nation:</ComplaintTr>{' '}<a className="text-link" href="https://www.gov.uk/consumer-protection-rights"><ComplaintTr>UK consumer protection guidance</ComplaintTr></a>. <ComplaintTr>Requirements and options differ by case and jurisdiction. This prototype does not assess eligibility, set legal deadlines, submit complaints or guarantee a remedy.</ComplaintTr></p>
          </section>

          <ComplaintCasePack />
        </div>
      </div>
    </section>
  );
}
