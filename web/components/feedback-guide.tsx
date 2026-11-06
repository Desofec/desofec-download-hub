'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import { emptyFeedbackDraft, feedbackFields, feedbackReport, type FeedbackField } from '@/lib/feedback-guide';

export function FeedbackGuide() {
  const tr = useTr();
  const [draft, setDraft] = useState(emptyFeedbackDraft);
  const [reviewedRequest, setReviewedRequest] = useState(false);
  const [reviewedPlan, setReviewedPlan] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const dirty = Object.values(draft).some((value) => value.length > 0);
  const request = feedbackReport(draft, 'request', tr);
  const plan = feedbackReport(draft, 'revision', tr);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  function edit(key: FeedbackField, value: string) {
    setDraft((current) => ({ ...current, [key]: value }));
    setReviewedRequest(false);
    setReviewedPlan(false);
    setNotice('');
    setError('');
  }
  function download(part: 'request' | 'revision') {
    try {
      downloadPilotText(part === 'request' ? request : plan, part === 'request' ? 'practice-feedback-request.txt' : 'practice-revision-plan.txt');
      setError('');
      setNotice(part === 'request' ? 'Feedback request downloaded. Nothing was sent.' : 'Revision plan downloaded. No project changes were applied.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'The download failed. Please try again.');
    }
  }
  const discard = () => !dirty || window.confirm(tr('Leave this page and discard the temporary feedback draft?'));

  return <div className="proposal-builder">
    <p>{tr('These edits stay in this page only and are lost on reload or navigation. The app does not save, send or upload them. Downloaded files remain on your device until you delete them.')}</p>
    <p>{tr('Use fictional or anonymised material. Do not enter real names, contact details, credentials, confidential information or client files.')}</p>
    <section aria-labelledby="feedback-request">
      <h2 id="feedback-request">{tr('1. Prepare a clear feedback request')}</h2>
      <p>{tr('Ask a consenting person for a small review, not a guarantee or approval. Share only the sample you are comfortable sharing; agree how they can decline or respond.')}</p>
      <p>{tr('Example questions: Is the purpose clear? Which claim needs evidence? What is confusing or missing? Avoid asking for a rating alone.')}</p>
      {feedbackFields.slice(0, 3).map((field) => <div className="form-group" key={field.key}>
        <label htmlFor={`feedback-${field.key}`}>{tr(field.label)}</label>
        <textarea id={`feedback-${field.key}`} rows={3} maxLength={2000} autoComplete="off" value={draft[field.key]} onChange={(event) => edit(field.key, event.target.value)} />
      </div>)}
      <h3>{tr('Preview feedback request')}</h3>
      <pre className="project-portfolio-preview" tabIndex={0} data-feedback-request>{request}</pre>
      <label className="project-check"><input type="checkbox" checked={reviewedRequest} onChange={(event) => setReviewedRequest(event.target.checked)} />
        <span>{tr('I reviewed the request for sensitive information before downloading.')}</span></label>
      <button type="button" className="btn btn-secondary" disabled={!reviewedRequest} onClick={() => download('request')}>{tr('Download feedback request (.txt)')}</button>
    </section>
    <section aria-labelledby="feedback-revision">
      <h2 id="feedback-revision">{tr('2. Turn feedback into a revision plan')}</h2>
      <p>{tr('Record feedback only if you actually received it. If no one has reviewed your work, leave it blank; a self-review is not an independent review.')}</p>
      <p>{tr('Separate observations from suggestions. Choose one small change, note anything you disagree with or cannot verify, and keep blocked items open.')}</p>
      {feedbackFields.slice(3).map((field) => <div className="form-group" key={field.key}>
        <label htmlFor={`feedback-${field.key}`}>{tr(field.label)}</label>
        <textarea id={`feedback-${field.key}`} rows={3} maxLength={2000} autoComplete="off" value={draft[field.key]} onChange={(event) => edit(field.key, event.target.value)} />
      </div>)}
      <h3>{tr('Preview revision plan')}</h3>
      <pre className="project-portfolio-preview" tabIndex={0} data-feedback-plan>{plan}</pre>
      <label className="project-check"><input type="checkbox" checked={reviewedPlan} onChange={(event) => setReviewedPlan(event.target.checked)} />
        <span>{tr('I reviewed the revision plan for sensitive information before downloading.')}</span></label>
      <button type="button" className="btn btn-secondary" disabled={!reviewedPlan} onClick={() => download('revision')}>{tr('Download revision plan (.txt)')}</button>
    </section>
    <p role="status">{tr(notice)}</p>
    {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
    <section aria-labelledby="feedback-next">
      <h2 id="feedback-next">{tr('3. Revise and check your project')}</h2>
      <p>{tr('Open your saved project and make changes yourself in its evidence workbook. In the review centre, select the saved revision and record observations, correction tasks and evidence. A new revision does not automatically close an older review.')}</p>
      <p>{tr('Re-run any relevant tests and record the results. Failed, blocked or unrun checks stay visible; feedback and self-review do not grant publication permission or client approval.')}</p>
      <div className="cta-row">
        <Link className="btn btn-primary" href="/business-launchpad/projects" onNavigate={(event) => { if (!discard()) event.preventDefault(); }}>{tr('Open existing projects')}</Link>
        <a className="btn btn-secondary" href="/downloads/practice-feedback-worksheet.md" download>{tr('Download blank feedback worksheet (.md)')}</a>
      </div>
      <p>{tr('The blank worksheet is English. Open it in a text editor to print or save as PDF. Review your file before sharing; delete any copies separately.')}</p>
    </section>
  </div>;
}
