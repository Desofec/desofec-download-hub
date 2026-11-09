'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTr } from '@/components/tr';
import { TutorialLink } from '@/components/tutorial-link';
import { downloadPilotText } from '@/lib/pilot-download';
import {
  commerceExercises, commerceResultText, evaluateCommerce, sampleCommerceRows,
  type CommerceTrack, type PracticeResult, type PracticeRow
} from '@/lib/commerce-practice';

const trackPaths: Record<CommerceTrack, string> = {
  retail: 'ai-online-retail', marketplace: 'ai-marketplace-model', logistics: 'ai-logistics-services'
};
const trackTitles: Record<CommerceTrack, string> = {
  retail: 'AI-Powered Online Retail', marketplace: 'AI-Powered Marketplace Business Model', logistics: 'AI-Powered Logistics Services'
};

export function CommercePracticeLab({ initialTrack, projectId }: { initialTrack: CommerceTrack; projectId?: string }) {
  const tr = useTr();
  const [track, setTrack] = useState(initialTrack);
  const [inputs, setInputs] = useState<Record<string, PracticeRow[]>>(() => Object.fromEntries(commerceExercises.map((exercise) => [exercise.id, sampleCommerceRows(exercise.id)])));
  const [results, setResults] = useState<Record<string, PracticeResult>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState('');
  function invalidate(id: string) {
    const ids = id === 'logistics-orders' || id === 'logistics-stock' ? ['logistics-stock', 'logistics-orders'] : [id];
    setResults((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !ids.includes(key))));
    setErrors((current) => Object.fromEntries(Object.entries(current).filter(([key]) => !ids.includes(key))));
    setNotice('');
  }
  function update(id: string, rows: PracticeRow[]) {
    setInputs((current) => ({ ...current, [id]: rows }));
    invalidate(id);
  }
  function run(id: string) {
    invalidate(id);
    try {
      const result = evaluateCommerce(id, inputs[id], id === 'logistics-stock' ? inputs['logistics-orders'] : undefined);
      setResults((current) => ({ ...current, [id]: result }));
    } catch (error: unknown) {
      setErrors((current) => ({ ...current, [id]: error instanceof Error ? error.message : 'Commerce calculation failed.' }));
    }
  }
  function download(id: string) {
    const result = results[id];
    if (!result) return;
    try {
      downloadPilotText(commerceResultText(id, inputs[id], result, id === 'logistics-stock' ? inputs['logistics-orders'] : undefined), `fictional-${id}-worksheet.txt`);
      setNotice('Practice worksheet downloaded. Reopen it and check the source, calculations and unresolved issues.');
    } catch (error: unknown) {
      setErrors((current) => ({ ...current, [id]: error instanceof Error ? error.message : 'Practice download failed.' }));
    }
  }
  return <div className="proposal-builder commerce-practice">
    <p>{tr('Fictional practice only. No uploads, AI model, live accounts, payments or shipments. Edits are temporary and disappear on reload; download your observations explicitly.')}</p>
    <p>{tr('Editable worksheets, calculation results and validation messages are English; navigation follows your language.')}</p>
    <div className="filter-chips" role="group" aria-label={tr('Choose a commerce practice track')}>
      {(['retail', 'marketplace', 'logistics'] as const).map((name) => <button key={name} type="button"
        className={track === name ? 'chip active' : 'chip'} aria-pressed={track === name}
        onClick={() => { setTrack(name); setNotice(''); }}>{tr(trackTitles[name])}</button>)}
    </div>
    <div className="cta-row">
      <Link className="btn btn-primary" href={projectId ? `/business-launchpad/projects?project=${encodeURIComponent(projectId)}` : `/business-launchpad/projects?path=${trackPaths[track]}`}>
        {tr(projectId ? 'Return to saved practice project' : 'Start a practice project')}
      </Link>
      {projectId && <Link className="btn btn-secondary" href={`/business-launchpad/evidence-workbook?project=${encodeURIComponent(projectId)}`}>
        {tr('Open private evidence workbook')}
      </Link>}
      <TutorialLink className="btn btn-secondary" href={`/tutorials/${trackPaths[track]}`}>{tr('Start the tutorial')}</TutorialLink>
      <Link className="btn btn-secondary" href={`/paths/${trackPaths[track]}`}>{tr('View path')}</Link>
      <Link className="btn btn-secondary" href="/starter-packs/ai-commerce-services-kit">{tr('Open the service kit')}</Link>
    </div>
    {projectId && <p>{tr('This lab does not load or change the linked project. Download selected fictional results, then reload the project workbook and explicitly save your observations there. Existing evidence and tests remain unchanged.')}</p>}
    <p>{tr('Blank values remain unknown. Invalid values and duplicate identifiers require correction. Editing an input clears its previous result; linked receiving and order inputs clear the reservation result together.')}</p>
    {commerceExercises.filter((exercise) => exercise.track === track).map((exercise) => {
      const id = exercise.id, rows = inputs[id], result = results[id];
      return <section key={id} aria-labelledby={`${id}-heading`} data-exercise={id}>
        <h2 id={`${id}-heading`}>{exercise.title}</h2>
        <p>{exercise.explanation}</p>
        <div className="table-scroll" tabIndex={0} role="group" aria-label={`${exercise.title}: editable fictional data`} style={{ overflowX: 'auto' }}>
          <table>
            <caption>{exercise.title}: fictional inputs</caption>
            <thead><tr>{exercise.fields.map((field) => <th scope="col" key={field}>{field}</th>)}<th scope="col">{tr('Row actions')}</th></tr></thead>
            <tbody>{rows.map((row, index) => <tr key={index}>
              {exercise.fields.map((field) => <td key={field}><input
                aria-label={`${exercise.title}, row ${index + 1}: ${field}`} value={row[field]} maxLength={field === 'Claim' ? 300 : 40}
                autoComplete="off" style={{ width: field === 'Claim' ? '18rem' : '8rem' }}
                onChange={(event) => update(id, rows.map((entry, at) => at === index ? { ...entry, [field]: event.target.value } : entry))} /></td>)}
              <td><button type="button" className="btn btn-secondary" disabled={rows.length === 1}
                aria-label={`${tr('Remove row')} ${index + 1}`} onClick={() => update(id, rows.filter((_, at) => at !== index))}>{tr('Remove row')}</button></td>
            </tr>)}</tbody>
          </table>
        </div>
        <div className="cta-row">
          {!['retail-cost', 'logistics-cost', 'logistics-stock'].includes(id) && <button type="button" className="btn btn-secondary"
            disabled={rows.length >= 20} onClick={() => update(id, [...rows, Object.fromEntries(exercise.fields.map((field) => [field, '']))])}>{tr('Add practice row')}</button>}
          <button type="button" className="btn btn-secondary" onClick={() => update(id, sampleCommerceRows(id))}>{tr('Restore sample inputs')}</button>
          {id !== 'logistics-orders' && <button type="button" className="btn btn-primary" onClick={() => run(id)}>{tr('Calculate practice result')}</button>}
        </div>
        {errors[id] && <p role="alert">{errors[id]}</p>}
        {result && <div className="commerce-result">
          <p role="status">{result.summary}</p>
          {result.issues.length > 0 && <div role="alert"><strong>{tr('Unresolved issues')}</strong><ul>{result.issues.map((issue, index) => <li key={index}>{issue}</li>)}</ul></div>}
          <div className="table-scroll" tabIndex={0} role="group" aria-label={`${exercise.title}: calculated worksheet`} style={{ overflowX: 'auto' }}>
            <table><caption>{exercise.title}: calculated fictional worksheet</caption>
              <thead><tr>{result.columns.map((column) => <th scope="col" key={column}>{column}</th>)}</tr></thead>
              <tbody>{result.rows.map((row, index) => <tr key={index}>{row.map((value, at) => <td key={at}>{value}</td>)}</tr>)}</tbody>
            </table>
          </div>
          <button type="button" className="btn btn-secondary" onClick={() => download(id)}>{tr('Download practice worksheet')}</button>
          <details><summary>{tr('Optional AI review prompt')}</summary><p>Audit these fictional inputs and calculated results. Preserve identifiers and unknowns, independently recalculate, flag unsupported claims and explain limitations. Do not invent owner approval, income, deliveries or client results. Use the downloaded worksheet only; never paste confidential or personal data.</p></details>
        </div>}
      </section>;
    })}
    {notice && <p role="status">{tr(notice)}</p>}
    <p>{tr('Real owner approval remains blocked. These limited worksheet checks are not grades, verified client work, forecasts or permission to launch a business.')}</p>
  </div>;
}
