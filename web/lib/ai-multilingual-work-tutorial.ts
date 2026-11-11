import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const aiMultilingualWorkSteps: TutorialStep[] = [
  {
    id: 'translation-brief',
    title: 'Define the audience and translation task',
    explanation: [
      'Practise with Harbor Learning Centre, a fictional organisation. Translate its fictional workshop notice from English into Spanish for a general audience. Use the same exercise even if your tutorial language is French, German or Spanish; no real notice or contact information is needed.',
      'Identify the target audience, language and purpose before drafting. For real work, ask the intended audience about region, tone and accessibility; arrange a qualified human reviewer for high-stakes material. AI is optional and a fluent answer is not proof of accuracy.'
    ],
    file: 'Translation brief',
    code: `Practice only: Harbor Learning Centre is fictional.
Source language: English | target language: Spanish
Audience: general readers | purpose: understand a workshop notice
M1: Harbor Learning Centre offers a free digital skills workshop.
M2: It takes place on 2030-06-14 from 14:00 to 15:00 UTC in Room B.
M3: Registration closes on 2030-06-12; there are 20 seats.
M4: Materials are provided.
Real recipient or publication: none`,
    check: 'Your brief identifies English as the source, Spanish as the target and the intended audience, and keeps the fictional notice private.',
    aiPrompt: 'Help me make a translation brief for a general Spanish-speaking audience. List questions about region, tone and accessibility without guessing the answers.'
  },
  {
    id: 'translation-prepare',
    title: 'Prepare only permitted, non-sensitive text',
    explanation: [
      'Use only the fictional notice above. For real work, confirm you have permission to translate the material and remove names, contacts and confidential or sensitive details that the task does not need. Keep the original in an approved place.',
      'Before using any external AI or translation service, check its current availability, charges, data handling and organisational rules yourself. A free tier or private processing is not assumed. If the text cannot be shared, use an approved alternative or work offline.'
    ],
    file: 'Permission and privacy check',
    code: `Source: fictional workshop notice M1-M4
Permission for this fictional exercise: practice text provided here
Real personal or confidential details in prompt: 0
Real source rights and permission: check before using real material
External service availability, cost and data handling checked: YES / NO / NOT USING
Original and practice draft: private`,
    check: 'You use only the fictional notice, keep private information out and check permission and service terms before any real use.',
    aiPrompt: 'Give me a checklist for deciding whether a document may be translated or sent to an external tool. Do not ask me to paste the document or any secrets.'
  },
  {
    id: 'translation-glossary',
    title: 'Build a small, traceable glossary',
    explanation: [
      'Make a glossary so important terms stay consistent. For this exercise, use Spanish “gratuito” for free, “inscripción” for registration and “plazas” for seats; keep the organisation name and UTC unchanged.',
      'Keep the exact dates, times, count and room from the English source. A glossary is a starting point, not a substitute for checking meaning in context. Record regional or terminology uncertainty for a human reviewer instead of inventing an answer.'
    ],
    file: 'Glossary and protected facts',
    code: `English | Spanish | note
free | gratuito | no charge
registration | inscripción | registration, not attendance
seats | plazas | capacity, not confirmed attendees
Harbor Learning Centre | Harbor Learning Centre | keep name
UTC | UTC | keep time zone
Protected facts: 2030-06-14 | 14:00-15:00 UTC | Room B | 2030-06-12 | 20 seats
Regional preference: UNKNOWN - ask a reviewer`,
    check: 'Your glossary keeps the name, UTC and all dates, times, room and 20 seats; it flags unknown regional preferences.',
    aiPrompt: 'Suggest a small English-to-Spanish glossary for this fictional notice. Preserve names, dates, times, numbers and UTC; mark uncertain terminology rather than guessing: [M1-M4].'
  },
  {
    id: 'translation-draft',
    title: 'Draft a translation by source segment',
    explanation: [
      'Translate one numbered source segment at a time. This makes omissions and additions easier to find. You may draft yourself or ask an approved AI tool to suggest wording; neither method replaces a human meaning check.',
      'Compare each Spanish segment with M1-M4. The example below is a draft, not an approved message. Do not add a location, fee, deadline time, attendee list or promise that the source does not contain.'
    ],
    file: 'Spanish draft',
    code: `M1: Harbor Learning Centre ofrece un taller gratuito de competencias digitales.
M2: Se celebra el 2030-06-14 de 14:00 a 15:00 UTC en la sala B.
M3: La inscripción se cierra el 2030-06-12; hay 20 plazas.
M4: Se proporcionan los materiales.
Draft status: NOT APPROVED; private practice only`,
    check: 'Your four Spanish segments match M1-M4 and do not add a fee, deadline time or other unsupported detail.',
    aiPrompt: 'Translate the fictional source M1-M4 into Spanish for general readers. Return one matching ID per segment, preserve every fact and UTC, and flag ambiguity without adding details: [M1-M4].'
  },
  {
    id: 'translation-check',
    title: 'Find and correct changed facts',
    explanation: [
      'A confident translation may change numbers or omit a condition. Compare the candidate below with the source, segment by segment. It incorrectly changes M2 to 15:00-16:00 UTC and M3 to 30 seats; correct them to 14:00-15:00 UTC and 20 seats.',
      'Also check that “free” stays free, registration closes on 2030-06-12, Room B and provided materials remain, and the date is not silently converted to another time zone. Back-translation can help spot issues but does not prove a translation is correct.'
    ],
    file: 'Comparison and correction',
    code: `Candidate M2: 2030-06-14 | 15:00-16:00 UTC | sala B -> WRONG TIME
Correct M2: 2030-06-14 | 14:00-15:00 UTC | sala B
Candidate M3: 2030-06-12 | 30 plazas -> WRONG COUNT
Correct M3: 2030-06-12 | 20 plazas
M1: gratuito | M4: materiales proporcionados
Open terminology or audience questions: record, do not guess`,
    check: 'You identify the two changed facts and restore 14:00-15:00 UTC and 20 seats while checking the other source details.',
    aiPrompt: 'Compare this candidate with M1-M4 only. List differences and quote the source for each; do not silently correct, invent facts or claim human approval: [source and candidate].'
  },
  {
    id: 'translation-handover',
    title: 'Record review and handover honestly',
    explanation: [
      'Keep the source IDs, draft, glossary and correction notes together. Ask a competent speaker to check meaning, tone, accessibility and suitability for the actual audience. For legal, medical or other high-stakes work, use an appropriately qualified professional and follow local rules.',
      'This exercise has no real reviewer or recipient. Record approval as BLOCKED and feedback as NOT COLLECTED. Keep the draft private: do not send or publish it. A checked exercise is not a certified translation or a guarantee.'
    ],
    file: 'Private handover',
    code: `Source: fictional M1-M4 | target: Spanish
Checked facts: 2030-06-14 | 14:00-15:00 UTC | Room B | 2030-06-12 | 20 seats
Free workshop; materials provided
Reviewer approval: BLOCKED - no real reviewer
Audience feedback: NOT COLLECTED
Status: private; do not send or publish
Certification: not claimed`,
    check: 'Your handover records the checked facts, BLOCKED approval and NOT COLLECTED feedback, and keeps the exercise private.',
    aiPrompt: 'Review this fictional handover for missing checks. Do not invent a reviewer, approval, feedback, certification or permission to publish: [handover].'
  }
];
