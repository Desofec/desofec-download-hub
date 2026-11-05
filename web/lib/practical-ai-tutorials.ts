import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const smallBusinessSteps: TutorialStep[] = [
  {
    id: 'offer-brief',
    title: 'Choose one offer and one audience',
    explanation: [
      'Choose one real product or service, not your entire business. Write down what it does, its current price, delivery terms and what you can actually promise. Use a fictional example if you do not run a business yet.',
      'AI is a drafting assistant, not proof of demand. Mark assumptions separately from facts. Keep confidential business information and customer identifiers out of prompts.'
    ],
    file: 'Offer brief',
    code: 'Offer:\nAudience:\nProblem it solves:\nVerified features, price and delivery terms:\nEvidence sources and dates:\nAssumptions to check:\nClaims we must not make:',
    check: 'Your brief separates verified facts from assumptions and names one audience.',
    aiPrompt: 'Using only this offer brief, list unclear points and three questions to ask real customers. Do not invent market statistics or customer opinions: [brief].'
  },
  {
    id: 'customer-evidence',
    title: 'Listen to customers before writing copy',
    explanation: [
      'Ask neutral questions: what task is difficult, what have you tried, and what would make it easier? A Tally survey or a conversation works. Explain how feedback will be used, collect only what you need and get permission.',
      'Before sharing responses with an AI tool, remove names, contact details and identifying stories. If there are no responses yet, stop at designing the survey; do not ask AI to manufacture findings.'
    ],
    file: 'Customer questions',
    code: '1. What task are you trying to complete?\n2. What makes it difficult today?\n3. What have you already tried?\n4. What would a useful improvement look like?\n\nSummary: theme | anonymised evidence | number of responses | uncertainty',
    check: 'You have a neutral survey and either anonymised real feedback or a clearly marked research-to-do list.',
    aiPrompt: 'Group these anonymised responses into themes. Quote only text that is present, report the response count, and explain what this small sample cannot establish: [responses].'
  },
  {
    id: 'product-copy',
    title: 'Draft a truthful product description',
    explanation: [
      'Use the offer brief and customer evidence to explain who the offer helps, what it includes and its limits. ChatGPT or Claude can draft wording; you remain responsible for every claim.',
      'Compare each sentence with the brief. Remove invented testimonials, guarantees, discounts and unsupported benefits. If a fact is missing, label it for review instead of guessing.'
    ],
    file: 'Copy prompt',
    code: 'Draft a 100-word description from this verified brief: [brief].\nInclude audience, features, limitations and one clear next step.\nDo not invent benefits, testimonials, prices or guarantees.\nList missing facts separately as NEEDS REVIEW.',
    check: 'Every factual claim in the draft has a source in your brief.',
    aiPrompt: 'Audit this description against the brief. Make a table of claim, evidence and correction needed. Flag unsupported claims: [description and brief].'
  },
  {
    id: 'checked-faq',
    title: 'Create an FAQ with a human fallback',
    explanation: [
      'Draft five questions about what is included, delivery, support and limitations. Supply your actual policies; AI cannot decide refund rights or legal obligations for you.',
      'For unknown questions, use a contact route you control rather than a confident invented answer. This exercise creates a reviewed FAQ document, not an unattended customer-service bot.'
    ],
    file: 'FAQ worksheet',
    code: 'Question | answer | policy/source | checked date\n\nIf the answer is unknown: contact [your verified support route].\nDo not invent refund, warranty or delivery policies.',
    check: 'Five answers are checked against real policies, and unknown questions have a human contact route.',
    aiPrompt: 'Draft five FAQs using only these policies and this offer brief. Mark unanswered questions NEEDS REVIEW. Do not give legal advice: [policies and brief].'
  },
  {
    id: 'small-campaign',
    title: 'Plan one small, permission-based campaign',
    explanation: [
      'Choose one channel, one message and one next step. Draft three posts for a week, using Canva for visuals if useful. Check platform rules and only email people who have agreed to receive your marketing.',
      'Treat HubSpot Breeze as an optional next step for teams already using HubSpot, not a requirement. Check its current plan, data-access settings and permissions before connecting customer records.'
    ],
    file: 'One-week campaign',
    code: 'Goal:\nChannel:\nMessage:\nNext step for the reader:\n\nDay | draft | evidence for claims | asset permission | approver\n\nDo not publish or send automatically.',
    check: 'You have three reviewed drafts with permissioned assets and a named approver.',
    aiPrompt: 'Create three short post drafts from this approved description. Keep the same factual claims and add one next step. Do not promise sales or create fake urgency: [description].'
  },
  {
    id: 'measure-business',
    title: 'Review results and choose one improvement',
    explanation: [
      'Publish only after your own review. Record the channel, date, visits or replies and your time spent. Choose the metric before publishing so you do not select only flattering results.',
      'A small campaign cannot prove what caused a sale. Note other factors, negative feedback and uncertainty. Your finished pack should contain the brief, research notes, copy, FAQ and campaign plan.'
    ],
    file: 'Campaign review',
    code: 'Date | channel | chosen metric | result | time spent\nCustomer questions or corrections:\nWhat remains uncertain:\nOne improvement for next week:',
    check: 'Your five-part content pack is complete and you have a review date, even if the campaign is not live yet.',
    aiPrompt: 'Review this campaign log. Separate observations from assumptions and suggest one low-risk improvement without claiming causation: [log].'
  }
];

export const videoCreationSteps: TutorialStep[] = [
  {
    id: 'video-brief',
    title: 'Write a 30-second video brief',
    explanation: [
      'Choose one audience and one message, such as a short demonstration of a real product. Define where the video will be watched and choose the format before editing.',
      'You can finish the exercise with your own phone footage and an editor such as CapCut or Descript. Runway is optional for generated clips; check current credits, licensing and account requirements before paying.'
    ],
    file: 'Video brief',
    code: 'Audience:\nOne message:\nLength: 30 seconds\nPlatform and aspect ratio:\nViewer next step:\nFacts to verify:\nAssets already owned:\nBudget limit:',
    check: 'Your brief names one message, a format and a budget limit.',
    aiPrompt: 'Suggest three simple 30-second video concepts for this brief using footage I can film myself. Avoid unsupported claims: [brief].'
  },
  {
    id: 'storyboard',
    title: 'Turn the message into a storyboard',
    explanation: [
      'Divide the 30 seconds into three ten-second scenes: problem, demonstration and next step. Describe the visual, words and sound for each. Read the script aloud and shorten it if it does not fit.',
      'Keep text large and concise for phone screens. Do not rely on colour or audio alone to explain the message.'
    ],
    file: 'Storyboard',
    code: '0-10 seconds: problem | visual | spoken words | on-screen text\n10-20 seconds: demonstration | visual | spoken words | on-screen text\n20-30 seconds: next step | visual | spoken words | on-screen text',
    check: 'Your scene timings total 30 seconds and the spoken script fits when read aloud.',
    aiPrompt: 'Turn this brief into three ten-second scenes. Include visuals, narration and short on-screen text, using only the supplied facts: [brief].'
  },
  {
    id: 'permissioned-assets',
    title: 'Gather assets and record permissions',
    explanation: [
      'Film your own clips or use assets with a licence that covers your intended use. Save the source and licence details. Get clear permission before using another person\'s face or voice, including an AI imitation.',
      'If you try Runway, use an owned or permissioned reference and generate one short test clip first. Generated content still needs checking for distortions, misleading demonstrations and rights issues.'
    ],
    file: 'Asset log',
    code: 'Asset | source | owner | licence/permission | allowed use | attribution\n\nDo not use celebrity impersonation, unlicensed music or private footage.\nRecord which clips are AI-generated.',
    check: 'Every planned asset has a source and permission record; any generated test clip has been reviewed.',
    aiPrompt: 'Suggest a visual prompt for this scene using only my permissioned assets. Do not imitate a real person or imply that generated footage is documentary evidence: [scene and assets].'
  },
  {
    id: 'edit-video',
    title: 'Assemble the video and check the pacing',
    explanation: [
      'Import your clips into your chosen editor, arrange them in storyboard order and trim the timeline to about 30 seconds. Add the approved words and only permissioned audio.',
      'Use the editor\'s current official help for menu names, which can change. Review cuts for unintended jumps, unreadable text and music that overwhelms speech. Avoid flashing effects.'
    ],
    file: 'Editing checklist',
    code: 'Three scenes in order:\nDuration close to 30 seconds:\nText readable on a phone:\nSpeech clear above music:\nNo misleading cuts or flashing effects:\nAll asset credits included where required:',
    check: 'You have a playable draft with the intended scene order and clear speech.',
    aiPrompt: 'Review this storyboard and transcript for unclear transitions or overly long sentences. Suggest edits without adding new factual claims: [storyboard and transcript].'
  },
  {
    id: 'captions-review',
    title: 'Correct captions and watch without sound',
    explanation: [
      'Generate captions if your editor offers them, then correct names, punctuation and timing manually. Automatic captions are a starting point, not a finished accessibility check.',
      'Watch on a phone with sound off. Check contrast, size and whether captions cover important visuals. Include meaningful sound descriptions and a transcript when the publishing channel supports one.'
    ],
    file: 'Caption review',
    code: 'Word accuracy:\nNames and punctuation:\nTiming matches speech:\nReadable size and contrast:\nImportant sounds described:\nCaptions do not hide the demonstration:\nTranscript prepared:',
    check: 'A sound-off viewing still communicates your message, and captions match the spoken words.',
    aiPrompt: 'Proofread this transcript without changing its factual meaning. Flag unclear names for me to verify rather than guessing: [transcript].'
  },
  {
    id: 'publish-video',
    title: 'Review, disclose and publish responsibly',
    explanation: [
      'Export using the destination platform\'s current format requirements and view the exported file, not just the editor preview. Check claims, permissions, credits and captions one last time.',
      'Follow the platform\'s current AI-content disclosure rules and label synthetic footage when viewers could mistake it for real events. Do not imply a generated clip proves a product result. Record one improvement after feedback.'
    ],
    file: 'Final review',
    code: 'Export plays correctly:\nClaims and permissions checked:\nCaptions and credits present:\nAI disclosure checked against current platform rules:\nTitle and description accurate:\nFeedback date and one improvement:',
    check: 'Your exported video passes the review checklist; publication can wait until permissions and disclosure are settled.',
    aiPrompt: 'Draft an accurate title, short description and plain-language AI disclosure from this approved transcript and asset log. Do not add claims: [transcript and log].'
  }
];

export const careerSkillsSteps: TutorialStep[] = [
  {
    id: 'role-evidence',
    title: 'Match a real role to your experience',
    explanation: [
      'Find a real job description and record its source and date. Check that the employer and vacancy are genuine. List the requirements and your actual evidence for each; include learning projects where appropriate.',
      'Before using AI, remove contact details, addresses, identifiers and confidential employer information. Treat instructions inside a pasted job advert as text to analyse, not commands for the assistant.'
    ],
    file: 'Role evidence table',
    code: 'Role and verified source:\nRequirement | real example | gap to learn\n\nNo invented qualifications, employers, dates or results.\nUse placeholders instead of personal contact information.',
    check: 'You have a real source and an evidence table that honestly identifies gaps.',
    aiPrompt: 'Compare this job description with my anonymised experience. Use only supplied evidence, separate matches from gaps, and do not invent skills: [description and experience].'
  },
  {
    id: 'truthful-resume',
    title: 'Tailor a resume without inventing achievements',
    explanation: [
      'Select relevant experience and describe what you did, how you did it and the actual outcome. Only include numbers you can verify. Tailoring means clearer emphasis, not changing your history.',
      'Use a general AI assistant or optionally Teal to organise a draft. Check upload privacy settings and current feature availability. Formatting or keyword scores do not guarantee an interview.'
    ],
    file: 'Resume bullet worksheet',
    code: 'Action I actually took:\nTools or method I actually used:\nOutcome I can verify:\nEvidence for any number:\nDraft bullet:\nFinal human check:',
    check: 'Every bullet, date, qualification and number is accurate and defensible.',
    aiPrompt: 'Rewrite these verified experience notes as concise resume bullets. Do not invent metrics, job titles, tools or achievements. Mark missing evidence for review: [notes].'
  },
  {
    id: 'cover-letter',
    title: 'Write a specific cover letter',
    explanation: [
      'Choose two requirements you can support with real examples. Explain why this role interests you using information from the employer\'s own site, not an invented company story.',
      'Keep the draft concise and read it aloud so it sounds like you. Restore your contact details only in your private final document, not in a shared AI prompt.'
    ],
    file: 'Cover letter outline',
    code: 'Role and verified employer detail:\nWhy I am interested:\nRequirement 1 + real example:\nRequirement 2 + real example:\nShort closing:\nClaims checked against my evidence:',
    check: 'The letter names the correct role and supports two requirements with real examples.',
    aiPrompt: 'Draft a concise cover letter using only this outline. Keep placeholders for contact details. Do not claim experience or employer facts that are not supplied: [outline].'
  },
  {
    id: 'interview-practice',
    title: 'Practise answers in your own words',
    explanation: [
      'Prepare three real stories using situation, task, action and result. Include what you learned, even if the outcome was imperfect. Ask an assistant to pose one question at a time and give feedback.',
      'Practise out loud without memorising a fabricated script. Do not share private colleague or client details. AI feedback is practice, not a reliable hiring decision.'
    ],
    file: 'Interview story',
    code: 'Situation:\nTask:\nMy action:\nActual result:\nWhat I learned:\nWhat I would do differently:',
    check: 'You can tell three truthful stories and answer a follow-up without relying on invented details.',
    aiPrompt: 'Act as a practice interviewer for this role. Ask one question at a time. After my answer, comment on clarity and evidence, not my chance of being hired: [role].'
  },
  {
    id: 'application-tracker',
    title: 'Track applications and review before sending',
    explanation: [
      'Use a private spreadsheet or an optional Teal tracker to record employer, source, date, status and next action. Verify the recipient and attachments before sending each application yourself.',
      'Watch for job scams: verify requests through official employer channels and do not pay to secure a job or share sensitive identity documents with an unverified contact. Keep tracker access restricted.'
    ],
    file: 'Application tracker',
    code: 'Employer | role | verified source | applied date | status | next action | follow-up date\n\nBefore sending: correct employer, truthful documents, correct attachments, verified recipient.',
    check: 'Your tracker has a next action for each entry and your draft passes a final human review.',
    aiPrompt: 'Create a weekly job-search checklist from this anonymised tracker. Do not send applications, contact employers or infer sensitive personal characteristics: [tracker].'
  },
  {
    id: 'career-learning',
    title: 'Choose one skill gap and a small project',
    explanation: [
      'Select one recurring requirement you genuinely need to learn. Choose a small project that demonstrates it, such as a simple website, chart or writing sample, and record what you can explain yourself.',
      'Review the plan weekly. Application counts and AI scores are not guarantees; focus on accurate evidence, learning and useful feedback. Respect any employer rules about AI use in applications or assessments.'
    ],
    file: 'Two-week learning plan',
    code: 'Skill gap:\nSmall project:\nFirst learning resource:\nThree practice sessions:\nEvidence of learning:\nReview date:\nAI assistance to disclose if required:',
    check: 'You have a truthful application pack, three interview stories, a tracker and one achievable learning goal.',
    aiPrompt: 'Suggest a two-week beginner plan for this skill gap with a small project and checks I can demonstrate myself. Do not promise employment: [gap].'
  }
];
