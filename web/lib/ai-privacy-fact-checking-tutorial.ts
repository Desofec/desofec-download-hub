import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const aiPrivacyFactCheckingSteps: TutorialStep[] = [
  {
    id: 'privacy-map',
    title: 'Spot private information before you prompt',
    explanation: [
      'Practise with Riverside Library, a fictional library, and a fictional volunteer note. Every name, address and number in this exercise is invented; do not use real messages or real people while you practise.',
      'Before pasting text into any AI tool, mark each detail as PRIVATE or OK TO USE. The note contains four private items: a name, an email address, a phone number and a health detail. Only the meeting date 2030-03-14, the time 18:00 and Room B are needed for the task.'
    ],
    file: 'Privacy map',
    code: 'Fictional note (practice only):\n"Hi, this is Alex Example (alex@example.test, +00 0000 0000). The volunteer meeting is on 2030-03-14 at 18:00 in Room B. I may be late because of a medical appointment."\n\nDetail | decision\nAlex Example | PRIVATE - name\nalex@example.test | PRIVATE - email\n+00 0000 0000 | PRIVATE - phone\nMedical appointment | PRIVATE - health detail\n2030-03-14 | OK TO USE\n18:00 | OK TO USE\nRoom B | OK TO USE\nTask: write a short meeting reminder',
    check: 'Your map marks the name, email, phone and health detail as PRIVATE and keeps only the date, time and room for the task.',
    aiPrompt: 'Do not paste the note yet. Instead ask: Which kinds of details in a message are usually personal or sensitive and should be removed before I ask an AI tool for help? Give categories only.'
  },
  {
    id: 'privacy-redact',
    title: 'Redact names and contact details',
    explanation: [
      'Replace each private item with a neutral placeholder before prompting: [PERSON A], [EMAIL] and [PHONE]. Remove the health detail entirely instead of hinting at it, because the reminder does not need it. Keep the original note private and never paste it into the tool.',
      'Read the redacted text once more and confirm that none of the four private items remains. Check the AI tool’s current privacy settings and terms yourself, such as chat history or training options; this lesson does not verify any tool’s settings and is not legal advice.'
    ],
    file: 'Redacted prompt',
    code: 'Redacted text:\n"[PERSON A] ([EMAIL], [PHONE]) shared that the volunteer meeting is on 2030-03-14 at 18:00 in Room B."\n\nRemoved completely: health detail\nPrivate items left in text: 0 of 4\nTool privacy settings checked by me: YES / NO\nOriginal note: kept private, not pasted',
    check: 'Your redacted text contains none of the four private items, keeps 2030-03-14, 18:00 and Room B, and you checked the tool’s settings yourself.',
    aiPrompt: 'Using only this redacted text, write a two-sentence meeting reminder. Keep the placeholders as they are and do not guess who [PERSON A] is: [redacted text].'
  },
  {
    id: 'claims-list',
    title: 'Split an AI answer into checkable claims',
    explanation: [
      'AI answers can sound confident and still be wrong. Practise with this fictional AI summary of Riverside Library: "Riverside Library is open 7 days a week, including Saturday 10:00-14:00. Membership is free for residents. It lends 50 laptops and was founded in 1952 (source: City Library Report 2029)."',
      'Split the summary into separate claims, one fact per line, and give each an ID from C1 to C5. List the cited source separately as S1. Do not judge anything yet; first make every claim visible so none can hide inside a fluent sentence.'
    ],
    file: 'Claim list',
    code: 'C1 | Open 7 days a week\nC2 | Saturday 10:00-14:00\nC3 | Membership is free for residents\nC4 | Lends 50 laptops\nC5 | Founded in 1952\nS1 | Cited source: City Library Report 2029\nVerdicts: not checked yet',
    check: 'Your list has five claims, C1 to C5, plus the cited source S1, with one fact per line and no verdicts yet.',
    aiPrompt: 'Split this text into a numbered list of separate factual claims, one fact per line. Do not add, judge or correct anything: [AI summary].'
  },
  {
    id: 'claims-sources',
    title: 'Check each claim against a real source',
    explanation: [
      'Compare each claim with the exercise source sheet only: Monday-Friday 09:00-18:00; Saturday 10:00-14:00; closed Sunday; membership free for residents; 12 laptops, 2-hour loans. Record SUPPORTED, CONTRADICTED or NEEDS SOURCE and note the exact evidence.',
      'C2 and C3 are supported. C1 is contradicted because the library is closed on Sunday, and C4 is contradicted because the sheet lists 12 laptops. The source sheet says nothing about 1952, so C5 needs a source. S1 is not in your source pack: mark it CITATION NOT FOUND and never invent or "complete" a citation.'
    ],
    file: 'Source check',
    code: 'Source sheet (fictional exercise):\nMonday-Friday 09:00-18:00 | Saturday 10:00-14:00 | closed Sunday\nMembership free for residents | 12 laptops, 2-hour loans\n\nClaim | evidence | verdict\nC1 Open 7 days | closed Sunday | CONTRADICTED\nC2 Saturday 10:00-14:00 | listed | SUPPORTED\nC3 Free for residents | listed | SUPPORTED\nC4 50 laptops | sheet says 12 | CONTRADICTED\nC5 Founded 1952 | not in sheet | NEEDS SOURCE\nS1 City Library Report 2029 | not in source pack | CITATION NOT FOUND',
    check: 'Your check shows 2 SUPPORTED, 2 CONTRADICTED and 1 NEEDS SOURCE, and S1 is marked CITATION NOT FOUND without an invented replacement.',
    aiPrompt: 'Compare each claim with this source sheet only. For each, quote the matching evidence or say "not in source". Do not use outside knowledge or invent citations: [claims and source sheet].'
  },
  {
    id: 'claims-verdicts',
    title: 'Correct, mark or remove unsupported claims',
    explanation: [
      'Rewrite the summary using only what the source supports. Correct contradicted claims with the source wording: closed on Sunday, and 12 laptops instead of 50. Either remove C5 or keep it clearly marked UNVERIFIED until you find a reliable source.',
      'Remove the citation that could not be found. A shorter, accurate summary is better than a complete-sounding one. Ask AI to help with wording only after the facts are settled, and check that its rewrite has not reintroduced any removed claim.'
    ],
    file: 'Corrected summary',
    code: 'Corrected summary:\n"Riverside Library is open Monday to Friday 09:00-18:00 and Saturday 10:00-14:00; it is closed on Sunday. Membership is free for residents. It lends 12 laptops for 2-hour loans."\n\nC1: corrected | C2: kept | C3: kept | C4: corrected to 12\nC5 founded 1952: UNVERIFIED - removed\nS1 citation: removed - not found\nRewrite rechecked against source: YES / NO',
    check: 'Your corrected summary says closed on Sunday and 12 laptops, leaves out 1952 or marks it UNVERIFIED, and contains no unfound citation.',
    aiPrompt: 'Improve the wording of this corrected summary without adding, removing or changing any fact, number or source: [corrected summary].'
  },
  {
    id: 'privacy-review',
    title: 'Record review honestly before sharing',
    explanation: [
      'Save the privacy map, redacted prompt, claim list, source check and corrected summary together as your practice record. Note what remains uncertain. These checks reduce risk, but they are learning practice, not a guarantee and not legal advice.',
      'Riverside Library is fictional, so there is no real editor to approve sharing. Record approval as BLOCKED, keep the exercise private and do not send or publish it. Leave reader feedback and results as NOT COLLECTED; for real work, follow your organisation’s rules and get actual approval.'
    ],
    file: 'Private review log',
    code: 'Practice record: privacy map | redacted prompt | claim list | source check | corrected summary\nPrivate items in prompts: 0\nClaims: 2 SUPPORTED | 2 CONTRADICTED -> corrected | 1 NEEDS SOURCE -> UNVERIFIED\nCitation S1: not found - removed\nFictional editor approval: BLOCKED - no real editor\nReader feedback: NOT COLLECTED\nExercise status: private; do not send or publish',
    check: 'Your log keeps approval BLOCKED, leaves feedback NOT COLLECTED, lists what is uncertain and keeps the exercise private.',
    aiPrompt: 'Review this practice log for missing checks. Do not invent approval, sources, feedback or results, and do not give legal advice: [practice log].'
  }
];
