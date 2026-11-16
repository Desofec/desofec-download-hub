export const complaintPracticeFields = [
  {
    key: 'business',
    label: 'Fictional business',
    hint: 'Use an invented business name, not a real company or person.',
    missing: '[Add a fictional business name]',
    rows: 1
  },
  {
    key: 'issue',
    label: 'What happened?',
    hint: 'Describe the problem without adding facts you do not know.',
    missing: '[Describe the fictional problem]',
    rows: 3
  },
  {
    key: 'timeline',
    label: 'Key dates and events',
    hint: 'List the fictional order and delivery events in the order they happened.',
    missing: '[Add the fictional timeline]',
    rows: 3
  },
  {
    key: 'contact',
    label: 'Earlier contact before starting this tracker',
    hint: 'Summarize earlier fictional contact, or say that none has happened yet. Add new attempts in the dated contact log below.',
    missing: '[Add previous contact or say there has been none]',
    rows: 3
  },
  {
    key: 'outcome',
    label: 'What would you like the business to do?',
    hint: 'State the requested action; this tool does not determine your rights or the outcome.',
    missing: '[Add the fictional action requested]',
    rows: 3
  }
] as const;

export const complaintEvidenceOptions = [
  { id: 'order', label: 'Order confirmation or receipt' },
  { id: 'payment', label: 'Proof of payment' },
  { id: 'delivery', label: 'Promised delivery details' },
  { id: 'messages', label: 'Previous messages with the business' }
] as const;

export const complaintContactChannels = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'web-form', label: 'Website form' },
  { value: 'in-person', label: 'In person' },
  { value: 'other', label: 'Other' }
] as const;

export const complaintOutcomeOptions = [
  { value: 'unresolved', label: 'Not resolved yet' },
  { value: 'reply-received', label: 'Reply received; issue not resolved' },
  { value: 'action-promised', label: 'Action promised; not confirmed complete' },
  { value: 'resolved', label: 'I consider the issue resolved' }
] as const;

export type ComplaintPracticeField = (typeof complaintPracticeFields)[number]['key'];
export type ComplaintEvidenceId = (typeof complaintEvidenceOptions)[number]['id'];
export type ComplaintContactChannel = (typeof complaintContactChannels)[number]['value'];
export type ComplaintOutcome = (typeof complaintOutcomeOptions)[number]['value'];
export type ComplaintPracticeInputs = Record<ComplaintPracticeField, string>;
export type ComplaintContactInput = {
  date: string;
  channel: ComplaintContactChannel;
  summary: string;
};
export type ComplaintContact = ComplaintContactInput & { id: number };

export function isComplaintContactChannel(value: string): value is ComplaintContactChannel {
  return complaintContactChannels.some((option) => option.value === value);
}

export function isComplaintOutcome(value: string): value is ComplaintOutcome {
  return complaintOutcomeOptions.some((option) => option.value === value);
}

export type ComplaintPracticeState = {
  inputs: ComplaintPracticeInputs;
  editedSampleFields: Partial<Record<ComplaintPracticeField | 'nextAction', boolean>>;
  evidence: Record<ComplaintEvidenceId, boolean>;
  contacts: ComplaintContact[];
  nextContactId: number;
  nextAction: string;
  reviewDate: string;
  outcome: ComplaintOutcome;
  reviewed: boolean;
};

export type ComplaintPracticeAction =
  | { type: 'edit'; field: ComplaintPracticeField; value: string }
  | { type: 'evidence'; id: ComplaintEvidenceId; checked: boolean }
  | { type: 'add-contact'; contact: ComplaintContactInput }
  | { type: 'remove-contact'; id: number }
  | { type: 'follow-up'; field: 'nextAction' | 'reviewDate'; value: string }
  | { type: 'localize-sample'; previous: ComplaintPracticeState; next: ComplaintPracticeState }
  | { type: 'outcome'; value: ComplaintOutcome }
  | { type: 'review'; checked: boolean }
  | { type: 'reset'; practice?: ComplaintPracticeState };

export function initialComplaintPractice(): ComplaintPracticeState {
  return {
    inputs: {
      business: 'Example Home Store',
      issue: 'A shelving order for a home-improvement project has not arrived.',
      timeline: '6 May: ordered the shelves.\n20 May: delivery was expected.',
      contact: '',
      outcome: 'Please arrange delivery or explain how to cancel the order.'
    },
    editedSampleFields: {},
    evidence: { order: false, payment: false, delivery: false, messages: false },
    contacts: [],
    nextContactId: 1,
    nextAction: 'Contact the business for an update.',
    reviewDate: '',
    outcome: 'unresolved',
    reviewed: false
  };
}

export function missingComplaintPracticeFields(inputs: ComplaintPracticeInputs) {
  return complaintPracticeFields.filter(({ key }) => !inputs[key].trim());
}

export function canAddComplaintContact(contact: ComplaintContactInput) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(contact.date) || !contact.summary.trim()) return false;
  const parsedDate = new Date(`${contact.date}T00:00:00.000Z`);
  return Number.isFinite(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === contact.date;
}

export function complaintPracticeReducer(
  state: ComplaintPracticeState,
  action: ComplaintPracticeAction
): ComplaintPracticeState {
  switch (action.type) {
    case 'edit':
      return {
        ...state,
        inputs: { ...state.inputs, [action.field]: action.value },
        editedSampleFields: { ...state.editedSampleFields, [action.field]: true },
        reviewed: false
      };
    case 'evidence':
      return {
        ...state,
        evidence: { ...state.evidence, [action.id]: action.checked },
        reviewed: false
      };
    case 'add-contact':
      if (!canAddComplaintContact(action.contact)) return state;
      return {
        ...state,
        contacts: [...state.contacts, { ...action.contact, id: state.nextContactId }],
        nextContactId: state.nextContactId + 1,
        reviewed: false
      };
    case 'remove-contact':
      return {
        ...state,
        contacts: state.contacts.filter(({ id }) => id !== action.id),
        reviewed: false
      };
    case 'follow-up':
      return {
        ...state,
        [action.field]: action.value,
        editedSampleFields: action.field === 'nextAction'
          ? { ...state.editedSampleFields, nextAction: true }
          : state.editedSampleFields,
        reviewed: false
      };
    case 'localize-sample': {
      const inputs = { ...state.inputs };
      for (const field of ['issue', 'timeline', 'outcome'] as const) {
        if (!state.editedSampleFields[field] && inputs[field] === action.previous.inputs[field]) {
          inputs[field] = action.next.inputs[field];
        }
      }
      return {
        ...state,
        inputs,
        nextAction: !state.editedSampleFields.nextAction && state.nextAction === action.previous.nextAction
          ? action.next.nextAction
          : state.nextAction,
        reviewed: false
      };
    }
    case 'outcome':
      return {
        ...state,
        outcome: action.value,
        reviewed: false
      };
    case 'review':
      return {
        ...state,
        reviewed: action.checked && missingComplaintPracticeFields(state.inputs).length === 0
      };
    case 'reset':
      return action.practice ?? initialComplaintPractice();
  }
}

export function canDownloadComplaintPractice(state: ComplaintPracticeState) {
  return state.reviewed && missingComplaintPracticeFields(state.inputs).length === 0;
}

export function buildComplaintCasePack(state: ComplaintPracticeState, translate: (text: string) => string = (text) => text) {
  const tr = translate;
  const { inputs, evidence } = state;
  const value = (key: ComplaintPracticeField) => {
    const field = complaintPracticeFields.find((entry) => entry.key === key);
    if (!field) throw new Error(`Unknown complaint practice field: ${key}`);
    return inputs[key].trim() || tr(field.missing);
  };
  const contacts = [...state.contacts].sort((left, right) =>
    left.date.localeCompare(right.date) || left.id - right.id
  );
  const marked = complaintEvidenceOptions.filter(({ id }) => evidence[id]).map(({ label }) => tr(label));
  const unmarked = complaintEvidenceOptions.filter(({ id }) => !evidence[id]).map(({ label }) => tr(label));
  const channelLabel = (channel: ComplaintContactChannel) => {
    const option = complaintContactChannels.find((entry) => entry.value === channel);
    if (!option) throw new Error(`Unknown complaint contact channel: ${channel}`);
    return tr(option.label);
  };
  const outcomeLabel = (outcome: ComplaintOutcome) => {
    const option = complaintOutcomeOptions.find((entry) => entry.value === outcome);
    if (!option) throw new Error(`Unknown complaint outcome: ${outcome}`);
    return tr(option.label);
  };

  return [
    tr('FICTIONAL PRACTICE CASE PACK - DO NOT SEND'),
    tr('This exercise is not legal advice. No documents have been uploaded or verified.'),
    '',
    tr('CASE DETAILS'),
    `${tr('Fictional business')}: ${value('business')}`,
    `${tr('Problem')}:\n${value('issue')}`,
    `${tr('Timeline')}:\n${value('timeline')}`,
    `${tr('Previous contact and response')}:\n${value('contact')}`,
    `${tr('Requested action')}:\n${value('outcome')}`,
    '',
    tr('FOLLOW-UP CONTACT LOG'),
    ...(contacts.length
      ? contacts.map(({ date, channel, summary }) => `${date} | ${channelLabel(channel)} | ${summary.trim()}`)
      : [tr('No follow-up contacts recorded in this exercise.')]),
    '',
    tr('MANUAL FOLLOW-UP PLAN'),
    `${tr('Current status selected by the user')}: ${outcomeLabel(state.outcome)}`,
    `${tr('Next action chosen by the user')}: ${state.nextAction.trim() || tr('[No next action chosen]')}`,
    `${tr('Personal review date chosen by the user')}: ${state.reviewDate || tr('[Not set]')}`,
    tr('This date is not a legal deadline. No reminder or contact will be sent.'),
    '',
    tr('POSSIBLE EVIDENCE TO CHECK'),
    `${tr('Marked in this exercise')}: ${marked.length ? marked.join('; ') : tr('None marked')}`,
    `${tr('Not marked in this exercise')}: ${unmarked.length ? unmarked.join('; ') : tr('None')}`,
    tr('Selections are not attachments, proof of possession or legal requirements.'),
    '',
    tr('DRAFT LETTER - FICTIONAL PRACTICE ONLY'),
    `${tr('Hello')} ${value('business')},`,
    '',
    tr('I am writing about the following problem:'),
    value('issue'),
    '',
    tr('The relevant events are:'),
    value('timeline'),
    '',
    `${tr('Previous contact and response')}:`,
    value('contact'),
    '',
    tr('The action I am requesting is:'),
    value('outcome'),
    '',
    tr('Please let me know the next steps.'),
    tr('Thank you.')
  ].join('\n');
}
