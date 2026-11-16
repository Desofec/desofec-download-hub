'use client';

import { useEffect, useReducer, useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '@/components/language';
import { useComplaintTr } from '@/components/complaint-tr';
import {
  buildComplaintCasePack,
  canAddComplaintContact,
  canDownloadComplaintPractice,
  complaintContactChannels,
  complaintEvidenceOptions,
  complaintOutcomeOptions,
  complaintPracticeFields,
  complaintPracticeReducer,
  initialComplaintPractice,
  isComplaintContactChannel,
  isComplaintOutcome,
  missingComplaintPracticeFields,
  type ComplaintContactInput,
  type ComplaintPracticeAction
} from '@/lib/complaint-case-pack';
import { downloadPilotText } from '@/lib/pilot-download';
import { translateComplaintPack } from '@/lib/complaint-pack-translations';

function localizedPractice(language: ReturnType<typeof useLanguage>) {
  const practice = initialComplaintPractice();
  const tr = (text: string) => translateComplaintPack(text, language);
  return {
    ...practice,
    inputs: {
      ...practice.inputs,
      issue: tr(practice.inputs.issue),
      timeline: tr(practice.inputs.timeline),
      outcome: tr(practice.inputs.outcome)
    },
    nextAction: tr(practice.nextAction)
  };
}

export function ComplaintCasePack() {
  const language = useLanguage();
  const tr = useComplaintTr();
  const [practice, dispatch] = useReducer(complaintPracticeReducer, language, localizedPractice);
  const [reviewedLanguage, setReviewedLanguage] = useState<typeof language | null>(null);
  const previousLanguage = useRef(language);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [contactError, setContactError] = useState('');
  const [contactDraft, setContactDraft] = useState<ComplaintContactInput>({
    date: '',
    channel: 'email',
    summary: ''
  });
  const missing = missingComplaintPracticeFields(practice.inputs);
  const pack = buildComplaintCasePack(practice, (text) => translateComplaintPack(text, language));
  const canDownload = canDownloadComplaintPractice(practice) && reviewedLanguage === language;

  useEffect(() => {
    if (previousLanguage.current !== language) {
      const previous = previousLanguage.current;
      previousLanguage.current = language;
      setReviewedLanguage(null);
      dispatch({
        type: 'localize-sample',
        previous: localizedPractice(previous),
        next: localizedPractice(language)
      });
    }
  }, [language]);

  function update(action: ComplaintPracticeAction) {
    setNotice('');
    setError('');
    setContactError('');
    dispatch(action);
  }

  function addContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canAddComplaintContact(contactDraft)) {
      setContactError('Enter a date and a short fictional note before adding this contact.');
      return;
    }
    update({ type: 'add-contact', contact: contactDraft });
    setContactDraft({ date: '', channel: 'email', summary: '' });
    setNotice('Fictional contact added to the timeline.');
  }

  function reset() {
    if (!window.confirm(tr('Reset the fictional sample? Your practice edits and evidence selections will be cleared. Downloaded files remain on your device.'))) return;
    update({ type: 'reset', practice: localizedPractice(language) });
    setContactDraft({ date: '', channel: 'email', summary: '' });
    setNotice('The fictional sample has been reset.');
  }

  function download() {
    if (!canDownload) return;
    setNotice('');
    setError('');
    try {
      downloadPilotText(pack, 'fictional-complaint-practice.txt');
      setNotice('Download requested. Check your browser downloads for fictional-complaint-practice.txt.');
    } catch {
      setError('Could not download the practice pack. You can select and copy the preview, or try again.');
    }
  }

  return (
    <div className="proposal-builder">
      <div className="path-card" role="note">
        <h2>{tr("Fictional practice only")}</h2>
        <p>{tr("Do not enter real names, contact details, account numbers, receipts or other personal or confidential information. The example and any changes must be fictional.")}</p>
        <p>{tr("This tool does not upload documents, send messages, use AI or save your entries to an account or browser storage. Entries are held in the page while you practise and are cleared on reload. If you download a pack, the file is saved on your device and contains everything you entered.")}</p>
      </div>

      <fieldset>
        <legend>{tr("1. Describe the fictional case")}</legend>
        <p>{tr("Change the sample if you wish. All five practice fields need text before you can download; this is not a legal requirements checklist.")}</p>
        {complaintPracticeFields.map((field) => (
          <div className="form-group" key={field.key}>
            <label htmlFor={`complaint-${field.key}`}>{tr(field.label)}</label>
            <span id={`complaint-${field.key}-hint`}>{tr(field.hint)}</span>
            <textarea
              id={`complaint-${field.key}`}
              rows={field.rows}
              maxLength={1000}
              value={practice.inputs[field.key]}
              onChange={(event) => update({ type: 'edit', field: field.key, value: event.target.value })}
              aria-describedby={`complaint-${field.key}-hint`}
              aria-required="true"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        ))}
      </fieldset>

      <fieldset>
        <legend>{tr("2. Think about possible evidence")}</legend>
        <p>{tr("Mark only what the fictional case has. Nothing is uploaded or attached. An unmarked item is not necessarily missing or required; check what is relevant separately.")}</p>
        {complaintEvidenceOptions.map((option) => (
          <label className="project-check" key={option.id}>
            <input
              type="checkbox"
              checked={practice.evidence[option.id]}
              onChange={(event) => update({ type: 'evidence', id: option.id, checked: event.target.checked })}
            />
            <span>{tr(option.label)}</span>
          </label>
        ))}
      </fieldset>

      <section className="path-card" aria-labelledby="complaint-gaps-heading">
        <h2 id="complaint-gaps-heading">{tr("3. Check the practice fields")}</h2>
        {missing.length > 0 ? (
          <>
            <p>{tr("Add information to these practice fields, or explicitly say when there has been no previous contact:")}</p>
            <ul>{missing.map((field) => <li key={field.key}>{tr(field.label)}</li>)}</ul>
          </>
        ) : (
          <p>{tr("All five practice fields contain text. This does not verify the facts or evidence, determine legal rights or decide whether a complaint is ready to escalate.")}</p>
        )}
      </section>

      <fieldset>
        <legend>{tr("4. Record follow-up contacts")}</legend>
        <p>{tr("Keep a fictional dated history of calls, emails or other contact. A reply is not the same as a completed action or a resolved problem.")}</p>
        {practice.contacts.length > 0 ? (
          <ol aria-label={tr('Fictional contact timeline')}>
            {[...practice.contacts]
              .sort((left, right) => left.date.localeCompare(right.date) || left.id - right.id)
              .map((contact) => {
                const channel = complaintContactChannels.find((option) => option.value === contact.channel);
                return (
                  <li key={contact.id}>
                    <p><strong>{contact.date} · {tr(channel?.label ?? 'Other')}</strong></p>
                    <p>{contact.summary}</p>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      aria-label={tr('Remove fictional contact from {date}', { date: contact.date })}
                      onClick={() => update({ type: 'remove-contact', id: contact.id })}
                    >{tr("Remove entry")}</button>
                  </li>
                );
              })}
          </ol>
        ) : <p>{tr("No follow-up contacts recorded in this fictional exercise yet.")}</p>}

        <form onSubmit={addContact}>
          <div className="proposal-number-grid">
            <div className="form-group">
              <label htmlFor="complaint-contact-date">{tr("Contact date")}</label>
              <input
                id="complaint-contact-date"
                type="date"
                required
                value={contactDraft.date}
                onChange={(event) => {
                  setContactDraft((current) => ({ ...current, date: event.target.value }));
                  setContactError('');
                }}
              />
            </div>
            <div className="form-group">
              <label htmlFor="complaint-contact-channel">{tr("Contact method")}</label>
              <select
                id="complaint-contact-channel"
                value={contactDraft.channel}
                onChange={(event) => {
                  const channel = event.target.value;
                  if (isComplaintContactChannel(channel)) {
                    setContactDraft((current) => ({ ...current, channel }));
                  }
                }}
              >
                {complaintContactChannels.map((option) => (
                  <option key={option.value} value={option.value}>{tr(option.label)}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="complaint-contact-summary">{tr("What happened or was promised?")}</label>
            <textarea
              id="complaint-contact-summary"
              rows={3}
              maxLength={500}
              required
              value={contactDraft.summary}
              onChange={(event) => {
                setContactDraft((current) => ({ ...current, summary: event.target.value }));
                setContactError('');
              }}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <button type="submit" className="btn btn-secondary">{tr("Add fictional contact")}</button>
          {contactError && <p role="alert" className="proposal-error">{tr(contactError)}</p>}
        </form>
      </fieldset>

      <fieldset>
        <legend>{tr("5. Choose the current outcome and next step")}</legend>
        <p>{tr("Choose the status yourself. Receiving a reply or hearing a promise does not mean the problem is resolved.")}</p>
        <div className="form-group">
          <label htmlFor="complaint-outcome-status">{tr("Current status")}</label>
          <select
            id="complaint-outcome-status"
            value={practice.outcome}
            onChange={(event) => {
              if (isComplaintOutcome(event.target.value)) {
                update({ type: 'outcome', value: event.target.value });
              }
            }}
          >
            {complaintOutcomeOptions.map((option) => (
              <option key={option.value} value={option.value}>{tr(option.label)}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="complaint-next-action">{tr("Next action you choose")}</label>
          <textarea
            id="complaint-next-action"
            rows={2}
            maxLength={500}
            value={practice.nextAction}
            onChange={(event) => update({ type: 'follow-up', field: 'nextAction', value: event.target.value })}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
        <div className="form-group">
          <label htmlFor="complaint-review-date">{tr("Personal review date (optional)")}</label>
          <input
            id="complaint-review-date"
            type="date"
            value={practice.reviewDate}
            onChange={(event) => update({ type: 'follow-up', field: 'reviewDate', value: event.target.value })}
          />
        </div>
        <p>{tr("This date is only a reminder for your own review. It is not a legal deadline. The tool does not send reminders or contact anyone.")}</p>
      </fieldset>

      <fieldset>
        <legend>{tr("6. Review the practice pack")}</legend>
        <p>{tr("The preview combines only the fictional information entered above with a fixed letter template. Edit the fields to change it. The evidence list does not attach or verify documents.")}</p>
        <p>{tr("Pack labels, the letter template and untouched sample text use your selected language. Your own entries are not automatically translated. Review the whole pack before downloading.")}</p>
        <div className="form-group">
          <label htmlFor="complaint-pack-preview">{tr("Fictional case pack and draft letter")}</label>
          <textarea
            id="complaint-pack-preview"
            rows={24}
            value={pack}
            lang={language}
            readOnly
            spellCheck={false}
          />
        </div>
        <label className="project-check">
          <input
            type="checkbox"
            checked={practice.reviewed && reviewedLanguage === language}
            disabled={missing.length > 0}
            onChange={(event) => {
              setReviewedLanguage(event.target.checked ? language : null);
              update({ type: 'review', checked: event.target.checked });
            }}
          />
          <span>{tr("I have reviewed this fictional practice pack. I understand it is not legal advice and must not be sent.")}</span>
        </label>
        <p>{tr("Complete the five practice fields and confirm your review to enable the download. Editing a field or evidence selection clears that confirmation.")}</p>
        <div className="cta-row">
          <button type="button" className="btn btn-primary" disabled={!canDownload} onClick={download}>{tr("Download practice pack (.txt)")}</button>
          <button type="button" className="btn btn-secondary" onClick={reset}>{tr("Reset fictional sample")}</button>
        </div>
        {notice && <p role="status">{tr(notice)}</p>}
        {error && <p role="alert" className="proposal-error">{tr(error)}</p>}
      </fieldset>
    </div>
  );
}
