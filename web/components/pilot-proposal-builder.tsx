'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PilotProjectTool } from '@/components/pilot-project-tool';
import { useLanguage } from '@/components/language';
import { useTr } from '@/components/tr';
import { downloadPilotText } from '@/lib/pilot-download';
import {
  buildPilotProposal, emptyProposalInputs, formatProposalMoney, proposalCalculations,
  proposalCostFields, proposalDocumentLimit, proposalSource, proposalStorageKey,
  proposalTextFields, proposalTextLimit, readProposalDraft, type ProposalDraft, type ProposalInputs
} from '@/lib/pilot-proposal';

export function PilotProposalBuilder({ projectId }: { projectId?: string }) {
  const tr = useTr();
  const language = useLanguage();
  const [inputs, setInputs] = useState(emptyProposalInputs);
  const [document, setDocument] = useState('');
  const [source, setSource] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const editor = useRef<HTMLTextAreaElement>(null);
  const totals = proposalCalculations(inputs);
  const currentSource = proposalSource(inputs, language);
  const stale = Boolean(source && source !== currentSource);
  const exportReady = Boolean(source && document.trim()) && !stale && totals.errors.length === 0;
  const money = (value: number | null) => value === null ? tr('Not calculated: complete every cost field in this group.') : formatProposalMoney(value, language);
  const loadProjectDraft = useCallback((draft: ProposalDraft) => {
    setInputs(draft.inputs);
    setDocument(draft.document);
    setSource(draft.source);
    setDirty(false);
    setNotice('');
    setError('');
  }, []);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const update = (key: keyof ProposalInputs, value: string) => {
    setInputs((previous) => ({ ...previous, [key]: value }));
    setDirty(true);
    setNotice('');
    setError('');
  };

  const generate = () => {
    if (totals.errors.length) return;
    if (document && !window.confirm(tr('Replace the editable proposal with the current form? Manual changes to the proposal will be lost.'))) return;
    setDocument(buildPilotProposal(inputs, language, tr));
    setSource(currentSource);
    setDirty(true);
    setError('');
    setNotice('Draft generated. Review and edit it before sharing.');
    requestAnimationFrame(() => editor.current?.focus());
  };

  const save = () => {
    setError('');
    setNotice('');
    if (totals.errors.length) {
      setError('Correct the highlighted numbers before saving.');
      return;
    }
    const draft: ProposalDraft = { version: 1, inputs, document, source };
    try {
      localStorage.setItem(proposalStorageKey, JSON.stringify(draft));
      setDirty(false);
      setNotice('Draft saved on this browser only. It does not sync to your account.');
    } catch {
      setError('Could not save this draft. Browser storage may be blocked or full. Keep this page open or download your proposal.');
    }
  };

  const load = () => {
    setError('');
    setNotice('');
    try {
      const raw = localStorage.getItem(proposalStorageKey);
      if (raw === null) {
        setNotice('No saved proposal was found in this browser.');
        return;
      }
      const saved = readProposalDraft(raw);
      if (dirty && !window.confirm(tr('Load the saved draft and replace your unsaved work?'))) return;
      setInputs(saved.inputs);
      setDocument(saved.document);
      setSource(saved.source);
      setDirty(false);
      setNotice('Saved draft loaded. Review it before sharing.');
    } catch {
      setError('Could not load the saved draft. It may be damaged or browser storage may be blocked. Your current work has not changed.');
    }
  };

  const removeSaved = () => {
    if (!window.confirm(tr('Delete the saved proposal from this browser? The form on this page and any downloaded files will remain.'))) return;
    setError('');
    setNotice('');
    try {
      localStorage.removeItem(proposalStorageKey);
      setDirty(true);
      setNotice('Saved copy deleted. Current work is still on this page; downloaded files are unchanged.');
    } catch {
      setError('Could not delete the saved draft. Check browser storage settings and try again.');
    }
  };

  const download = () => {
    if (!exportReady) return;
    setError('');
    setNotice('');
    try {
      downloadPilotText(document, 'pilot-proposal-draft.txt');
      setNotice('Download requested. Check your browser downloads for pilot-proposal-draft.txt.');
    } catch {
      setError('Could not download the proposal. Copy the editable text or try printing instead.');
    }
  };

  return (
    <div className="proposal-builder">
      {projectId !== undefined ? (
        <PilotProjectTool projectId={projectId} kind="proposal" value={{ version: 1, inputs, document, source }}
          dirty={dirty} onLoad={loadProjectDraft} onDirty={() => setDirty(true)} />
      ) : <div className="proposal-controls">
        <p>{tr('Use fictional or anonymised details only. Do not enter credentials, personal data or confidential client information. Nothing you type is sent to AI or saved to our servers.')}</p>
        <p>{tr('Saving is optional and stores one draft in this browser, shared with anyone using this browser profile. It is not encrypted by the app and does not sync when you sign in. Browser clearing may erase it.')}</p>
        <div className="cta-row">
          <button type="button" className="btn btn-secondary" onClick={save}>{tr('Save on this device')}</button>
          <button type="button" className="btn btn-secondary" onClick={load}>{tr('Load saved draft')}</button>
          <button type="button" className="btn btn-secondary" onClick={removeSaved}>{tr('Delete saved copy')}</button>
        </div>
        <p role="status">{notice ? tr(notice) : dirty ? tr('Changes are not saved on this device.') : tr('No automatic saving. Save explicitly if you want to return later.')}</p>
        {error && <p className="proposal-error" role="alert">{tr(error)}</p>}
      </div>}
      {projectId !== undefined && <>
        {notice && <p role="status">{tr(notice)}</p>}
        {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
      </>}

      <form className="proposal-form" onSubmit={(event) => { event.preventDefault(); generate(); }}>
        <fieldset>
          <legend>{tr('1. Describe the pilot')}</legend>
          <p>{tr('Leave unknown details blank. The draft will mark them TO CONFIRM rather than inventing answers.')}</p>
          {proposalTextFields.map((field) => (
            <div className="form-group" key={field.key}>
              <label htmlFor={`proposal-${field.key}`}>{tr(field.label)}</label>
              <textarea
                id={`proposal-${field.key}`}
                rows={field.rows}
                maxLength={proposalTextLimit}
                value={inputs[field.key]}
                onChange={(event) => update(field.key, event.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          ))}
        </fieldset>

        <fieldset>
          <legend>{tr('2. Estimate costs and choose fees (EUR)')}</legend>
          <p id="proposal-number-help">{tr('Use non-negative numbers with up to two decimals (comma or point), without thousands separators. Blank means unknown; enter 0 only for a known zero.')}</p>
          <p>{tr('Internal costs are planning estimates, not profit or a recommended selling price. Include all relevant expenses. Taxes and omitted overhead are not calculated. Proposed service fees are entered separately.')}</p>
          <div className="proposal-number-grid">
            {proposalCostFields.map((field) => {
              const invalid = totals.errors.includes(field.key);
              return (
                <div className="form-group" key={field.key}>
                  <label htmlFor={`proposal-${field.key}`}>{tr(field.label)}</label>
                  <input
                    id={`proposal-${field.key}`}
                    type="text"
                    inputMode="decimal"
                    maxLength={30}
                    autoComplete="off"
                    spellCheck={false}
                    value={inputs[field.key]}
                    aria-invalid={invalid}
                    aria-describedby={`proposal-number-help proposal-${field.key}-limit${invalid ? ` proposal-${field.key}-error` : ''}`}
                    onChange={(event) => update(field.key, event.target.value)}
                  />
                  <span id={`proposal-${field.key}-limit`}>{tr('Maximum:')} {field.max.toLocaleString(language)}</span>
                  {invalid && <span className="proposal-error" id={`proposal-${field.key}-error`}>{tr('Enter a number within the limit, with no minus sign or thousands separators and at most two decimals.')}</span>}
                </div>
              );
            })}
          </div>
          <div className="proposal-totals" aria-live="polite">
            <h2>{tr('Internal cost worksheet (not included in the proposal)')}</h2>
            <p>{tr('Setup cost estimate:')} <strong data-proposal-total="setup">{money(totals.setup)}</strong></p>
            <p>{tr('Setup = hours × internal allowance + labour contingency + other one-off costs. Each stage is rounded to cents.')}</p>
            <p>{tr('Monthly cost estimate:')} <strong data-proposal-total="monthly">{money(totals.monthly)}</strong></p>
            <p>{tr('Monthly = support hours × internal allowance + vendor and other monthly costs. Rounded to cents.')}</p>
          </div>
        </fieldset>
        <div className="cta-row">
          <button type="submit" className="btn btn-primary" disabled={totals.errors.length > 0}>{tr(document ? 'Rebuild proposal from form' : 'Generate editable proposal')}</button>
        </div>
        {totals.errors.length > 0 && <p role="alert" className="proposal-error">{tr('Correct the highlighted numbers before generating or exporting.')}</p>}
      </form>

      <section className="proposal-editor" aria-labelledby="proposal-editor-heading">
        <h2 id="proposal-editor-heading">{tr('3. Review and edit your proposal')}</h2>
        <p>{tr('The generated proposal includes your proposed fees, not the internal cost worksheet. It is a draft, not an agreement. Review unknowns, exclusions, vendor charges, taxes and acceptance checks before sharing.')}</p>
        {stale && <p role="status">{tr('The form or language has changed since generation. Rebuild the proposal before exporting; this replaces manual edits after confirmation.')}</p>}
        <label className="planner-label" htmlFor="proposal-document">{tr('Editable proposal text')}</label>
        <textarea
          ref={editor}
          id="proposal-document"
          rows={22}
          maxLength={proposalDocumentLimit}
          value={document}
          onChange={(event) => { setDocument(event.target.value); setDirty(true); setNotice(''); }}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="cta-row">
          <button type="button" className="btn btn-primary" disabled={!exportReady} onClick={download}>{tr('Download proposal (.txt)')}</button>
          <button type="button" className="btn btn-secondary" disabled={!exportReady} onClick={() => window.print()}>{tr('Print / Save as PDF')}</button>
        </div>
        <p>{tr('Printing opens your browser dialog. Choose Save as PDF if available. Only the proposal text is printed; check the preview and disable browser headers/footers if needed.')}</p>
      </section>
      <div className="proposal-print">
        <pre>{exportReady ? document : tr('Generate and review a current proposal before printing. No proposal is ready to export.')}</pre>
      </div>
    </div>
  );
}
