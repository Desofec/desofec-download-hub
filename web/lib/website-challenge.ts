import { aiWebsiteSteps } from '@/lib/ai-website-tutorial';
import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const websiteChallengeId = 'first-website-challenge';

export const websiteChallengeSteps: TutorialStep[] = [
  ...aiWebsiteSteps.map((step, index) => ({
    ...step,
    title: `Day ${index + 1}: ${step.id === 'publish-for-free' ? 'Choose hosting and publish' : step.title}`,
    ...(step.id === 'publish-for-free' ? {
      explanation: [
        'Choose a hosting service that permits your intended use. A free personal plan may exclude commercial sites; check current terms, pricing and limits rather than assuming it is suitable.',
        'You can upload your index.html through a supported hosting workflow or import a GitHub repository. Follow the service’s current instructions. Open the published address on a phone and check that no private data is visible.'
      ],
      code: 'I have an index.html file for [a personal / commercial] website.\nExplain a suitable publishing route using GitHub and hosting.\nTell me which current plan terms and costs I must check myself.\nInclude checks before publishing, after publishing and if the page shows an error.'
    } : {})
  })),
  {
    id: 'final-project-review',
    title: 'Day 7: Check your finished project',
    explanation: [
      'Use the final project checklist below to review your website, not just tick off time spent. Reopen the live page on a phone, follow its main link and check the title, headings and image descriptions.',
      'Remove all placeholders, confirm your claims and asset permissions, and make sure no passwords, keys or private data are visible. Keep a backup. Ask a trusted person for one specific improvement, then make that change before marking this day complete.'
    ],
    file: 'Final review notes',
    code: 'My live website:\nPhone and main-link check:\nFacts and permissions checked:\nPrivacy and accessibility checks:\nBackup location:\nFeedback received:\nOne improvement made:',
    check: 'The final checklist below is complete, your live site works and you recorded one improvement.',
    aiPrompt: 'Help me review my finished one-page site against this checklist. Flag missing evidence instead of assuming it passed. Do not ask for passwords or private data: [public page text and checklist].'
  }
];
