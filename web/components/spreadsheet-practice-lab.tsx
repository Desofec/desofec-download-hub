'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTr } from '@/components/tr';
import {
  cleanSpreadsheet, comparePdfRows, extractedPdfRows, messySpreadsheet, spreadsheetCsv,
  spreadsheetReport, spreadsheetSource, type PracticeOrder
} from '@/lib/spreadsheet-practice';

export function SpreadsheetPracticeLab() {
  const tr = useTr();
  const [rows, setRows] = useState<PracticeOrder[]>(extractedPdfRows.map((row) => ({ ...row })));
  const [cleaned, setCleaned] = useState<ReturnType<typeof cleanSpreadsheet> | null>(null);
  const [checked, setChecked] = useState<ReturnType<typeof comparePdfRows> | null>(null);
  const [report, setReport] = useState<ReturnType<typeof spreadsheetReport> | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const attempt = (action: () => void) => {
    setError('');
    setNotice('');
    try { action(); }
    catch (error: unknown) { setError(error instanceof Error ? error.message : 'Practice operation failed.'); }
  };
  const csv = (data: PracticeOrder[], name: string) => attempt(() => {
    const url = URL.createObjectURL(new Blob(['\uFEFF', spreadsheetCsv(data)], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setNotice('CSV downloaded. Open it in Excel or Sheets and check the imported types and blank cells.');
  });
  const table = (data: PracticeOrder[], editable = false) => <div className="table-scroll" tabIndex={0}
    role="group" aria-label={tr(editable ? 'Extracted practice rows to check against the PDF' : 'Fictional order table')}
    style={{ overflowX: 'auto' }}>
    <table>
      <caption>{tr(editable ? 'Extracted practice rows to check against the PDF' : 'Fictional order table')}</caption>
      <thead><tr>{['Order', 'Item', 'Date UTC', 'Quantity', 'Unit price (EUR)'].map((label) => <th scope="col" key={label}>{tr(label)}</th>)}</tr></thead>
      <tbody>{data.map((row, index) => <tr key={index}>
        {(Object.keys(row) as (keyof PracticeOrder)[]).map((field) => <td key={field}>
          {editable && (field === 'quantity' || field === 'price') ? <input
            aria-label={`${row.id}: ${tr(field === 'quantity' ? 'Quantity' : 'Unit price (EUR)')}`}
            value={row[field]} maxLength={20} autoComplete="off" onChange={(event) => {
              setRows((rows) => rows.map((row, at) => at === index ? { ...row, [field]: event.target.value } : row));
              setChecked(null);
              setNotice('');
            }} /> : row[field] || tr('Missing')}
        </td>)}
      </tr>)}</tbody>
    </table>
  </div>;
  return <div className="proposal-builder">
    <p>{tr('Fictional practice only. No uploads, AI model, OCR engine, automatic saving or sending. CSV is Excel-compatible data, not an XLSX workbook. Reopen exported files and check them yourself.')}</p>
    <p>{tr('Source data and the downloadable PDF are English; interface labels follow your language.')}</p>
    <section aria-labelledby="cleaning-lab">
      <h2 id="cleaning-lab">{tr('1. Excel data cleaning')}</h2>
      <p>{tr('Preserve seven raw rows. Trim spaces, standardise only unambiguous dates and remove one identical duplicate. Keep A5 missing quantity and A6 ambiguous date flagged; do not guess either value.')}</p>
      {table(messySpreadsheet)}
      <div className="cta-row">
        <button className="btn btn-primary" type="button" onClick={() => attempt(() => setCleaned(cleanSpreadsheet(messySpreadsheet)))}>{tr('Run sample data cleaning')}</button>
        <button className="btn btn-secondary" type="button" onClick={() => csv(messySpreadsheet, 'fictional-raw-orders.csv')}>{tr('Download raw CSV')}</button>
      </div>
      {cleaned && <>
        <p role="status">{tr('Raw rows')}: {cleaned.rawCount}; {tr('Unique rows')}: {cleaned.rows.length}; {tr('Duplicates removed')}: {cleaned.duplicates}</p>
        {table(cleaned.rows)}
        <ul>{cleaned.issues.map((issue) => <li key={issue.id + issue.field}>{issue.id}: {tr(issue.field === 'date' ? 'Ambiguous date - confirm with source' : 'Missing or invalid numeric value')}</li>)}</ul>
        <button className="btn btn-secondary" type="button" onClick={() => csv(cleaned.rows, 'fictional-cleaned-orders-with-unresolved-values.csv')}>{tr('Download cleaned CSV with unresolved values')}</button>
      </>}
    </section>
    <section aria-labelledby="pdf-lab">
      <h2 id="pdf-lab">{tr('2. PDF-to-Excel conversion checks')}</h2>
      <p>{tr('Download the one-page fictional PDF. The table below is a supplied extraction with two deliberate mistakes, not an automatic PDF conversion. Compare every row and cell with the PDF; correct the quantity errors and leave the source blank empty.')}</p>
      <a className="btn btn-secondary" href="/business-launchpad/spreadsheet-lab/source.pdf">{tr('Download fictional source PDF')}</a>
      {table(rows, true)}
      <div className="cta-row">
        <button className="btn btn-primary" type="button" onClick={() => attempt(() => setChecked(comparePdfRows(rows)))}>{tr('Compare with the fictional PDF source')}</button>
        <button className="btn btn-secondary" type="button" onClick={() => csv(rows, 'fictional-pdf-transcription-unverified.csv')}>{tr('Download current transcription CSV')}</button>
      </div>
      {checked && <div role="status">
        <p>{tr('Source mismatches')}: {checked.length}</p>
        {checked.map((issue) => <p key={issue.id + issue.field}>{issue.id}: {tr(issue.field === 'quantity' ? 'Quantity' : 'Unit price (EUR)')}</p>)}
        {!checked.length && <p>{tr('Matches this fictional source. A5 quantity is still unknown. This does not verify an external PDF or approve client work.')}</p>}
      </div>}
    </section>
    <section aria-labelledby="report-lab">
      <h2 id="report-lab">{tr('3. Excel business reports')}</h2>
      <p>{tr('Report the original five orders for 2030-01-07 through 2030-01-13 UTC. Known subtotal EUR 21; Notebook EUR 15, Pen EUR 6 and Folder unresolved. Show the missing quantity beside the report, not as a zero-valued category.')}</p>
      <button className="btn btn-primary" type="button" onClick={() => attempt(() => setReport(spreadsheetReport(spreadsheetSource)))}>{tr('Build the checked sample report')}</button>
      {report && <>
        <p role="status">{tr('Known subtotal (EUR)')}: {(report.knownCents / 100).toFixed(2)}; {tr('Unresolved rows')}: {report.unresolved}</p>
        <p>{tr('Report total remains incomplete.')}</p>
        <figure>
          <figcaption>{tr('Known order values (EUR); A5 Folder unresolved')}</figcaption>
          <div aria-hidden="true" style={{ borderLeft: '2px solid currentColor', padding: '0.5rem' }}>
            {['Notebook', 'Pen'].map((item) => <div key={item} style={{ marginBlock: '0.75rem' }}>
              <span>{item}: {(report.groups[item].knownCents / 100).toFixed(2)} EUR</span>
              <div style={{ width: `${report.groups[item].knownCents / 1500 * 100}%`, height: '1rem', background: 'currentColor' }} />
            </div>)}
            <span>0 EUR</span>
          </div>
        </figure>
        <table><caption>{tr('Known values and unresolved rows')}</caption><thead><tr><th scope="col">{tr('Item')}</th><th scope="col">{tr('Known subtotal (EUR)')}</th><th scope="col">{tr('Unresolved rows')}</th></tr></thead>
          <tbody>{Object.entries(report.groups).map(([item, group]) => <tr key={item}><th scope="row">{item}</th><td>{group.unresolved ? tr('Unresolved') : (group.knownCents / 100).toFixed(2)}</td><td>{group.unresolved}</td></tr>)}</tbody></table>
        <p>{tr('Use a zero-baseline chart of the known Notebook and Pen values. Keep the unresolved Folder note visible and provide this table as a text alternative. Fictional rows do not establish business trends.')}</p>
      </>}
    </section>
    <p role="status">{tr(notice)}</p>
    {error && <p role="alert">{tr(error)}</p>}
    <p>{tr('Reloading clears lab results. Save your own observations explicitly in a private project, with raw files, corrections and unresolved issues. Lab matches are not grades or owner approval.')}</p>
    <div className="cta-row">
      <Link className="btn btn-primary" href="/business-launchpad/projects?path=ai-spreadsheets">{tr('Start a practice project')}</Link>
      <Link className="btn btn-secondary" href="/tutorials/ai-spreadsheets">{tr('Start the tutorial')}</Link>
      <Link className="btn btn-secondary" href="/starter-packs/ai-spreadsheets-kit">{tr('Open the service kit')}</Link>
    </div>
  </div>;
}
