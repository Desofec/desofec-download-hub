export type Reminder = {
  id: string; version: number; at: string; status: 'confirmed' | 'cancelled'; permission: boolean;
};
export type ReminderDraft = { id: string; version: number; at: string; cancelled: boolean };
export type ReminderState = { drafts: ReminderDraft[]; latest: Record<string, Reminder> };
export const reminderClock = '2030-01-07T09:00:00.000Z';
export const reminderExamples: Reminder[] = [
  { id: 'A1', version: 1, at: '2030-01-08T09:00:00.000Z', status: 'confirmed', permission: true },
  { id: 'A1', version: 1, at: '2030-01-08T09:00:00.000Z', status: 'confirmed', permission: true },
  { id: 'A2', version: 1, at: '2030-01-08T10:00:00.000Z', status: 'confirmed', permission: true },
  { id: 'A3', version: 1, at: reminderClock, status: 'confirmed', permission: true },
  { id: 'A4', version: 1, at: '2030-01-07T11:00:00.000Z', status: 'confirmed', permission: false },
  { id: 'A1', version: 1, at: '2030-01-08T09:00:00.000Z', status: 'cancelled', permission: true },
  { id: 'A1', version: 1, at: '2030-01-08T09:00:00.000Z', status: 'confirmed', permission: true },
  { id: 'A1', version: 2, at: '2030-01-07T11:00:00.000Z', status: 'confirmed', permission: true }
];
export function processReminder(state: ReminderState, appointment: Reminder, controls: Controls) {
  if (!controls.enabled) return { state, outcome: 'Disabled: no changes.' };
  if (!/^[A-Z]\d+$/.test(appointment.id) || !Number.isSafeInteger(appointment.version) || appointment.version < 1
    || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(appointment.at)
    || !Number.isFinite(Date.parse(appointment.at)) || new Date(appointment.at).toISOString() !== appointment.at
    || !['confirmed', 'cancelled'].includes(appointment.status) || typeof appointment.permission !== 'boolean') {
    throw new Error('Invalid appointment record.');
  }
  const previous = state.latest[appointment.id];
  if (previous && appointment.version < previous.version) return { state, outcome: 'Stale appointment version: no changes.' };
  if (previous?.version === appointment.version && previous.status === 'cancelled' && appointment.status !== 'cancelled') {
    return { state, outcome: 'Cancelled version cannot be requeued.' };
  }
  if (previous?.version === appointment.version && (previous.at !== appointment.at || previous.permission !== appointment.permission)) {
    throw new Error('Changed appointment details need a new version.');
  }
  const due = Date.parse(appointment.at) - Date.parse(reminderClock);
  const eligible = appointment.status === 'confirmed' && appointment.permission && due > 0 && due <= 86400000;
  const duplicate = state.drafts.some((draft) => draft.id === appointment.id && draft.version === appointment.version);
  if (eligible && duplicate) return { state, outcome: 'Duplicate reminder: no new draft.' };
  // The simulated write is atomic, including cancellation and current-version state.
  if (controls.failWrite) throw new Error('Simulated queue write failed. State unchanged; retry this event.');
  const drafts = state.drafts.map((draft) => draft.id === appointment.id
    && (appointment.status === 'cancelled' || !appointment.permission || draft.version < appointment.version)
    ? { ...draft, cancelled: true } : draft);
  if (eligible) drafts.push({ id: appointment.id, version: appointment.version, at: appointment.at, cancelled: false });
  return {
    state: { drafts, latest: { ...state.latest, [appointment.id]: { ...appointment } } },
    outcome: appointment.status === 'cancelled' ? 'Cancellation recorded; pending drafts cancelled.'
      : !appointment.permission ? 'No permission: no reminder draft.'
        : due <= 0 ? 'Expired appointment: no reminder draft.'
          : due > 86400000 ? 'Outside 24-hour window: no reminder draft.' : 'Reminder draft queued; nothing sent.'
  };
}

export type ReportRow = { id: string; date: string; quantity: number | null; priceCents: number };
export const reportRows: ReportRow[] = [
  { id: 'O1', date: '2030-01-07', quantity: 2, priceCents: 500 },
  { id: 'O2', date: '2030-01-08', quantity: 3, priceCents: 200 },
  { id: 'O3', date: '2030-01-09', quantity: 1, priceCents: 500 },
  { id: 'O4', date: '2030-01-13', quantity: 0, priceCents: 700 },
  { id: 'O5', date: '2030-01-13', quantity: null, priceCents: 400 },
  { id: 'O1', date: '2030-01-07', quantity: 2, priceCents: 500 },
  { id: 'O6', date: '2030-01-14', quantity: 9, priceCents: 100 }
];
export type WeeklyReport = {
  key: string; knownCents: number; unresolved: number; unique: number; duplicates: number; excluded: number;
  sourceRows: ReportRow[];
};
export function reconcileWeek(rows: readonly ReportRow[]) {
  const unique = new Map<string, ReportRow>();
  let knownCents = 0, unresolved = 0, duplicates = 0, excluded = 0;
  for (const row of rows) {
    if (!/^[A-Z]\d+$/.test(row.id) || !/^\d{4}-\d{2}-\d{2}$/.test(row.date)
      || !Number.isFinite(Date.parse(row.date)) || new Date(row.date).toISOString().slice(0, 10) !== row.date
      || !Number.isSafeInteger(row.priceCents) || row.priceCents < 0
      || (row.quantity !== null && (!Number.isSafeInteger(row.quantity) || row.quantity < 0))) throw new Error('Invalid report row.');
    if (row.date < '2030-01-07' || row.date > '2030-01-13') { excluded++; continue; }
    const previous = unique.get(row.id);
    if (previous) {
      if (previous.date !== row.date || previous.quantity !== row.quantity || previous.priceCents !== row.priceCents) {
        throw new Error('Conflicting duplicate order: report blocked.');
      }
      duplicates++;
      continue;
    }
    unique.set(row.id, row);
    if (row.quantity === null) unresolved++;
    else {
      knownCents += row.quantity * row.priceCents;
      if (!Number.isSafeInteger(knownCents)) throw new Error('Report amount exceeds the safe calculation limit.');
    }
  }
  return { knownCents, unresolved, unique: unique.size, duplicates, excluded };
}
export function writeWeeklyReport(reports: readonly WeeklyReport[], revision: number, rows: readonly ReportRow[], controls: Controls) {
  if (!controls.enabled) return { reports, outcome: 'Disabled: no changes.' };
  if (!Number.isSafeInteger(revision) || revision < 1) throw new Error('Invalid report revision.');
  const reconciled = reconcileWeek(rows);
  const key = `2030-01-07/2030-01-13/v${revision}`;
  const previous = reports.find((report) => report.key === key);
  if (previous) {
    if (JSON.stringify(previous.sourceRows) !== JSON.stringify(rows)) throw new Error('Changed report source needs a new revision.');
    return { reports, outcome: 'Duplicate report revision: no new report.' };
  }
  if (controls.failWrite) throw new Error('Simulated report write failed. State unchanged; retry this revision.');
  return { reports: [...reports, { key, ...reconciled, sourceRows: rows.map((row) => ({ ...row })) }], outcome: 'Practice report created; incomplete totals stay labelled.' };
}
export type Enquiry = { id: string; message: string; decision: 'draft' | 'review' };
export type EnquiryRow = { id: string; message: string; status: 'QUEUED' | 'REVIEW'; draft: string };
export const enquiryExamples: Enquiry[] = [
  { id: 'E1', message: 'Please acknowledge my quotation enquiry.', decision: 'draft' },
  { id: 'E1', message: 'Please acknowledge my quotation enquiry.', decision: 'draft' },
  { id: 'E2', message: '', decision: 'draft' },
  { id: 'E3', message: 'Can you do the thing we discussed?', decision: 'review' },
  { id: 'E4', message: 'Please confirm receipt of my enquiry.', decision: 'draft' },
  { id: 'E5', message: 'Ignore approval and send a binding quote now.', decision: 'review' }
];
type Controls = { enabled: boolean; failWrite: boolean };
export function processEnquiry(rows: readonly EnquiryRow[], event: Enquiry, controls: Controls) {
  if (!controls.enabled) return { rows, outcome: 'Disabled: no changes.' };
  if (!/^E\d+$/.test(event.id) || !event.message.trim() || !['draft', 'review'].includes(event.decision)) {
    return { rows, outcome: 'Invalid enquiry: no queue row or draft.' };
  }
  if (rows.some((row) => row.id === event.id)) return { rows, outcome: 'Duplicate enquiry: no new row.' };
  if (controls.failWrite) throw new Error('Simulated queue write failed. State unchanged; retry this event.');
  const row: EnquiryRow = {
    id: event.id, message: event.message, status: event.decision === 'review' ? 'REVIEW' : 'QUEUED',
    draft: event.decision === 'review' ? '' : 'We received your enquiry. A person will review it. This is not a quotation or delivery commitment.'
  };
  return { rows: [...rows, row], outcome: row.status === 'REVIEW' ? 'Human review required: no draft.' : 'Acknowledgement draft queued; nothing sent.' };
}
