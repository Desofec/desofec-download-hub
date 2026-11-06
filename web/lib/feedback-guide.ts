export const feedbackFields = [
  { key: 'sample', label: 'What fictional work sample will you share?' },
  { key: 'context', label: 'What should the reviewer know about its purpose and limits?' },
  { key: 'questions', label: 'Which specific questions would you like answered?' },
  { key: 'response', label: 'What feedback did you actually receive?' },
  { key: 'decision', label: 'What will you change, defer or ask about? Why?' },
  { key: 'check', label: 'How will you check the change, and what remains unresolved?' }
] as const;
export type FeedbackField = typeof feedbackFields[number]['key'];
export type FeedbackDraft = Record<FeedbackField, string>;
export const emptyFeedbackDraft = (): FeedbackDraft => ({
  sample: '', context: '', questions: '', response: '', decision: '', check: ''
});

export function feedbackReport(draft: FeedbackDraft, part: 'request' | 'revision', tr: (text: string) => string) {
  const keys: readonly FeedbackField[] = part === 'request'
    ? ['sample', 'context', 'questions'] : ['sample', 'response', 'decision', 'check'];
  return [
    tr(part === 'request' ? 'FICTIONAL PRACTICE - FEEDBACK REQUEST DRAFT' : 'FICTIONAL PRACTICE - SELF-RECORDED REVISION PLAN'),
    tr(part === 'request'
      ? 'This request is not sent by the app. Share only if you choose, and review the contents first.'
      : 'This is a learner record, not proof of independent review or approval. No project changes were applied.'),
    ...feedbackFields.filter((field) => keys.includes(field.key)).map((field) =>
      `${tr(field.label)}\n${draft[field.key].trim() || tr('[TO CONFIRM]')}`)
  ].join('\n\n');
}
