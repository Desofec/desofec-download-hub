export const automationScenarioIds = ['enquiries', 'appointments', 'weekly-report'] as const;
export type AutomationScenario = typeof automationScenarioIds[number];
export const automationScenarioLabels: Record<AutomationScenario, string> = {
  enquiries: 'Customer enquiry tracking',
  appointments: 'Appointment reminder automation',
  'weekly-report': 'Automated weekly business reports'
};
export const isAutomationScenario = (value: unknown): value is AutomationScenario =>
  automationScenarioIds.some((id) => id === value);

export const automationProjects = {
  appointments: {
    title: 'Your guided appointment reminder project',
    exercise: 'Exercise: fixed UTC appointment records at 2030-01-07 09:00 UTC. Queue reminder drafts only for confirmed, permitted appointments more than 0 and at most 24 hours away. Never send messages.',
    practiceTitle: '2. Practise appointment reminders',
    learn: 'Read the appointment project worksheet. Record the fixed UTC clock, eligibility window, consent and cancellation rules in the brief. Exclude live calendars, contact details and automatic sending.',
    practise: 'Use the lab or paper worksheet to check due, repeated, cancelled, unconsented, expired and rescheduled appointments. Record cancellations in the pending queue. A versioned appointment key is successful only after its draft is queued.',
    handover: 'Keep versioned reminder drafts, UTC timing checks, cancellation and rescheduling evidence, failure/retry notes and the off-switch runbook. Required real owner approval stays blocked; never activate a reminder connector.',
    workbookTitle: 'Appointment reminder rules and queue evidence',
    workbookText: 'FICTIONAL APPOINTMENTS - NO MESSAGES SENT.\n\nClock: 2030-01-07 09:00 UTC.\nWindow: more than 0 and at most 24 hours away; confirmed and permission recorded.\n\nAppointment ID / version / time UTC / consent / status / draft:\n\nDuplicate / cancellation / rescheduling / expired / missing-data observations:\n\nFailed queue write / retry / off switch / manual fallback:\n\nOwner approval and real connector checks: BLOCKED without evidence.',
    checks: [
      { code: 'APPT-1', label: 'Reminder eligibility and UTC boundaries', input: 'At 2030-01-07 09:00 UTC check A1 at +24h, A2 at +25h, and A3 at exactly now.', expected: 'A1 queued once; A2 outside window; A3 expired. Only confirmed appointments with recorded permission can receive a draft; no messages sent.' },
      { code: 'APPT-2', label: 'Reminder duplicates and safe retry', input: 'Repeat a successful A1 version; fail a new queue write, then retry it.', expected: 'No duplicate draft. Failed writes show an error and do not mark the key successful; retry queues exactly once.' },
      { code: 'APPT-3', label: 'Cancellation and rescheduling', input: 'Cancel queued A1 v1, repeat its old event, then reschedule confirmed A1 v2 to +2h with permission.', expected: 'v1 draft remains visibly cancelled and cannot be requeued. One active v2 draft; recheck current appointment version and permission before any hypothetical dispatch.' },
      { code: 'APPT-4', label: 'Missing data and permission', input: 'Check an invalid time, an unconsented appointment and an unsupported status.', expected: 'Invalid records rejected visibly; no reminder draft without permission. No real calendar or contact data used.' },
      { code: 'APPT-5', label: 'Reminder off switch and manual fallback', input: 'Disable the simulation, attempt a queue write and rehearse a manual review route.', expected: 'No state change while disabled. Record a human owner, alert, revocation and manual fallback; simulated controls do not verify a real connector.' },
      { code: 'APPT-6', label: 'Reminder owner approval', input: 'Check whether an authorised customer reviewed scope, permission, timezone and ongoing responsibility.', expected: 'Unavailable real customer approval stays blocked. No automatic sending, attendance promises or invented time savings.' }
    ]
  },
  'weekly-report': {
    title: 'Your guided weekly business report project',
    exercise: 'Exercise: reconcile five unique fictional orders for 2030-01-07 through 2030-01-13 UTC. Known subtotal EUR 21; one missing quantity remains unresolved, never zero. No live data or automatic email.',
    practiceTitle: '2. Practise a checked weekly report',
    learn: 'Read the report project worksheet. Save the inclusive UTC date window, raw/working copies, duplicate-ID rule and missing-value policy. Exclude real records, financial advice and automatic distribution.',
    practise: 'Use the lab or spreadsheet to deduplicate five order IDs and reconcile 10 + 6 + 5 + 0 = EUR 21, with one unresolved quantity. Preserve raw rows, filter outside dates and make rerunning the same report revision idempotent.',
    handover: 'Keep raw and working rows, date filters, duplicate and missing-value notes, the reconciled report, version history and failure/retry runbook. Label the subtotal incomplete. Missing owner review stays blocked; do not email or publish.',
    workbookTitle: 'Weekly report reconciliation and exception log',
    workbookText: 'FICTIONAL WEEKLY REPORT - NOT ACCOUNTING ADVICE.\n\nWindow: 2030-01-07 through 2030-01-13 UTC inclusive.\n\nRaw rows / unique order IDs / excluded dates / duplicate conflicts:\n\nKnown results: 10 + 6 + 5 + 0 = EUR 21.\nOne missing quantity: unresolved, not zero; total incomplete.\n\nReport revision / rerun key / corrected source / reconciliation:\n\nFailed write / retry / off switch / human approval:\n\nNo automatic distribution or verified savings.',
    checks: [
      { code: 'REPORT-1', label: 'Weekly report dates and duplicate IDs', input: 'Filter the inclusive UTC week; repeat an identical order and then change the amount on a repeated ID.', expected: 'Five unique in-window orders; identical duplicate counted once, outside dates excluded. Conflicting duplicate blocks the report visibly.' },
      { code: 'REPORT-2', label: 'Checked subtotal and missing quantity', input: 'Reconcile quantities/prices for O1-O5: 2x5, 3x2, 1x5, 0x7, and missing x4 EUR.', expected: 'Known results EUR 10, 6, 5, 0; subtotal EUR 21. One unresolved row, incomplete total; missing is never replaced with zero.' },
      { code: 'REPORT-3', label: 'Report reruns and versioned corrections', input: 'Rerun the same week/revision, then create a new revision after verifying corrected source rows.', expected: 'Same key creates no duplicate report. Corrections need a new revision and fresh reconciliation; old reports remain labelled, not silently overwritten.' },
      { code: 'REPORT-4', label: 'Report write failure and safe retry', input: 'Fail a new report write before persistence, inspect the alert and retry.', expected: 'Failure creates no report or successful key; retry writes exactly once. No fabricated completion or emailed result.' },
      { code: 'REPORT-5', label: 'Report off switch and manual review', input: 'Disable report generation and rehearse raw/working copies and human reconciliation.', expected: 'No report while disabled. Preserve raw data, exceptions and manual fallback; simulated results do not prove external spreadsheet or connector behavior.' },
      { code: 'REPORT-6', label: 'Weekly report owner approval', input: 'Check whether an authorised owner reviewed source permissions, incomplete totals and distribution rules.', expected: 'Missing actual approval stays blocked. No financial certification, automatic email or invented business results.' }
    ]
  }
} as const;
