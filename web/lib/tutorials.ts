import { aiAssistedCodingSteps } from '@/lib/ai-assisted-coding-tutorial';
import { aiBeginnerSteps, aiProductivitySteps } from '@/lib/ai-everyday-tutorials';
import { designBasicsSteps, mlFoundationsSteps } from '@/lib/ml-design-tutorials';
import { noCodeAutomationSteps, noCodeBuilderSteps, webStarterSteps } from '@/lib/web-nocode-tutorials';
import { autoAnalysisSteps } from '@/lib/auto-analysis-tutorial';
import { originAnalysisSteps } from '@/lib/origin-analysis-tutorial';
import {
  aiEducationSteps,
  dataVisualizationSteps,
  researchPromptingSteps
} from '@/lib/next-paths-tutorials';
import { aiWebsiteSteps } from '@/lib/ai-website-tutorial';
import { aiWorkflowsSteps } from '@/lib/ai-workflows-tutorial';
import { advancedNoCodeSteps } from '@/lib/advanced-no-code-tutorial';
import { advancedWebDevSteps } from '@/lib/advanced-web-dev-tutorial';
import { advancedDataAnalysisSteps } from '@/lib/advanced-data-analysis-tutorial';
import { codingFoundationsSteps } from '@/lib/coding-foundations-tutorial';
import { taskTrackerSteps, type TutorialStep } from '@/lib/task-tracker-tutorial';
import { smallBusinessSteps, videoCreationSteps, careerSkillsSteps } from '@/lib/practical-ai-tutorials';
import { spreadsheetSteps } from '@/lib/spreadsheets-tutorial';
import { websiteChallengeId, websiteChallengeSteps } from '@/lib/website-challenge';
import { automationServicesSteps } from '@/lib/automation-services-tutorial';
import { contentServicesSteps, cadServicesSteps, microSaasSteps, educationServicesSteps } from '@/lib/business-services-tutorials';
import { videoBusinessSteps } from '@/lib/video-business-tutorial';

export type TutorialInfo = {
  pathId: string;
  href: string;
  title: string;
  intro: string;
  time: string;
  steps: TutorialStep[];
  badge?: string;
  level?: string;
  serviceKitId?: string;
};

// Older tutorials keep their original URLs. New ones live under /tutorials/<pathId>.
export const tutorials: TutorialInfo[] = [
  {
    pathId: 'ai-video-business',
    href: '/tutorials/ai-video-business',
    title: 'Create Short-Form Videos with AI for Business',
    intro: 'Create three 15-30-second business videos with scripts, storyboards, corrected captions and permission records. Follow six lessons into a private practice project, proposal, evidence checks and handover. Allow two hours for planning; editing and feedback take additional time. AI generation is optional.',
    time: '120 minutes',
    steps: videoBusinessSteps,
    serviceKitId: 'ai-video-business-kit'
  },
  {
    pathId: 'ai-automation-services',
    href: '/tutorials/ai-automation-services',
    title: 'Prepare your first AI automation service pilot',
    intro: 'Validate one administrative problem, test a fictional enquiry workflow, calculate costs and draft a bounded pilot proposal. Allow about two hours for the worksheets; customer discovery and workflow setup take additional time. No paid tool or income promise.',
    time: '120 minutes',
    steps: automationServicesSteps,
    serviceKitId: 'ai-automation-services-kit'
  },
  {
    pathId: websiteChallengeId,
    href: '/challenges/first-website',
    title: '7-Day First Website Challenge',
    intro: 'Build one small website with a daily task and a final project review. Go at your own pace: there is no deadline or penalty for missing a day. Start with about 15-30 minutes per day; setup may take longer.',
    time: '150 minutes',
    steps: websiteChallengeSteps,
    badge: 'Challenge',
    level: 'Beginner'
  },
  {
    pathId: 'ai-spreadsheets',
    href: '/tutorials/ai-spreadsheets',
    title: 'Make a checked spreadsheet with AI support',
    intro: 'Practise importing, checking, calculating and charting five fictional orders in Excel or Google Sheets. AI features are optional; no paid AI plan is required.',
    time: '45 minutes',
    steps: spreadsheetSteps
  },
  {
    pathId: 'ai-small-business',
    href: '/tutorials/ai-small-business',
    title: 'Build a small business content pack with AI',
    intro: 'Start with real customer evidence, then draft and check product copy, FAQs and a small campaign. No paid tool is required for the exercises.',
    time: '60 minutes',
    steps: smallBusinessSteps
  },
  {
    pathId: 'ai-video-creation',
    href: '/tutorials/ai-video-creation',
    title: 'Create your first responsible AI-assisted video',
    intro: 'Make a 30-second video from a brief and storyboard, using your own or permissioned assets. Optional AI generation may require credits.',
    time: '60 minutes',
    steps: videoCreationSteps
  },
  {
    pathId: 'ai-career-skills',
    href: '/tutorials/ai-career-skills',
    title: 'Prepare a truthful, targeted job application',
    intro: 'Use a real job description and your own experience to draft an application, practise interviews and plan a next learning step. AI cannot guarantee a job.',
    time: '60 minutes',
    steps: careerSkillsSteps
  },
  {
    pathId: 'first-app',
    href: '/projects/first-app/build',
    title: 'Code your own task tracker',
    intro: '',
    time: '60 minutes',
    steps: taskTrackerSteps
  },
  {
    pathId: 'coding-foundations',
    href: '/projects/coding-foundations/build',
    title: 'Learn to code with Python',
    intro: '',
    time: '90 minutes',
    steps: codingFoundationsSteps
  },
  {
    pathId: 'ai-assisted-coding',
    href: '/projects/ai-assisted-coding/build',
    title: 'Code with an AI assistant',
    intro: '',
    time: '60 minutes',
    steps: aiAssistedCodingSteps
  },
  {
    pathId: 'ai-beginner',
    href: '/tutorials/ai-beginner',
    title: 'Your first steps with AI',
    intro:
      'Learn what AI assistants are, how to talk to them well and how to turn a good prompt into a routine. You only need a free account with any AI assistant.',
    time: '30 minutes',
    steps: aiBeginnerSteps
  },
  {
    pathId: 'ai-productivity',
    href: '/tutorials/ai-productivity',
    title: 'Build your AI productivity system',
    intro:
      'Find the tasks AI can help with, build a small set of reusable prompts, turn them into weekly routines and measure what really works.',
    time: '45 minutes',
    steps: aiProductivitySteps
  },
  {
    pathId: 'origin-data-analysis',
    href: '/tutorials/origin-data-analysis',
    title: 'Analyse measurement data with Origin and AI',
    intro:
      'Import sensor and scanner data, make clear graphs, measure how steady a pump runs, integrate with weights and map a scan, using safe practice data and AI prompts.',
    time: '90 minutes',
    steps: originAnalysisSteps
  },
  {
    pathId: 'auto-data-analysis',
    href: '/tutorials/auto-data-analysis',
    title: 'Automate your data analysis with Python and AI',
    intro:
      'Skip the menu settings: run short scripts in a free Colab notebook to analyse pump logs and scanner maps, process many files at once and check the results with AI.',
    time: '60 minutes',
    steps: autoAnalysisSteps
  },
  {
    pathId: 'advanced-measurement-analysis',
    href: '/tutorials/advanced-measurement-analysis',
    title: 'Advanced measurement data analysis',
    intro:
      'Audit raw data, examine pump stability by time window, map scanner mass loading, compare independent runs and create a reproducible report.',
    time: '90 minutes',
    steps: advancedDataAnalysisSteps
  },
  {
    pathId: 'data-visualization',
    href: '/tutorials/data-visualization',
    title: 'Make clear, honest data visualizations',
    intro:
      'Choose the right chart, prepare measurement data, build a visual in Python and explain the result without overstating it.',
    time: '45 minutes',
    steps: dataVisualizationSteps
  },
  {
    pathId: 'research-with-ai',
    href: '/tutorials/research-with-ai',
    title: 'Research with AI and verify your sources',
    intro:
      'Turn a broad topic into a focused question, collect real evidence, compare sources and write a brief you can defend.',
    time: '45 minutes',
    steps: researchPromptingSteps
  },
  {
    pathId: 'ai-for-education',
    href: '/tutorials/ai-for-education',
    title: 'Use AI safely for teaching and learning',
    intro:
      'Practical teacher and student workflows for lesson planning, tutoring and practice, with privacy and academic integrity at the centre.',
    time: '45 minutes',
    steps: aiEducationSteps
  },
  {
    pathId: 'advanced-web-dev-ai',
    href: '/tutorials/advanced-web-dev-ai',
    title: 'Build and ship a web app with an AI coding assistant',
    intro:
      'Write a spec, work in Git, prompt in small steps, write tests first, review the AI\u2019s code and ship safely.',
    time: '90 minutes',
    steps: advancedWebDevSteps
  },
  {
    pathId: 'advanced-no-code-automation',
    href: '/tutorials/advanced-no-code-automation',
    title: 'Build reliable no-code automations',
    intro:
      'Map the process, clean the data, add branches and approvals, prevent duplicates, handle errors and document it with a runbook.',
    time: '75 minutes',
    steps: advancedNoCodeSteps
  },
  {
    pathId: 'ai-workflows-agents',
    href: '/tutorials/ai-workflows-agents',
    title: 'Build AI workflows and simple agents safely',
    intro:
      'Decide between a workflow and an agent, design it with stop rules, build and test it in a no-code tool, and add approvals, limits and guardrails.',
    time: '75 minutes',
    steps: aiWorkflowsSteps
  },
  {
    pathId: 'ai-website-builder',
    href: '/tutorials/ai-website-builder',
    title: 'Build and publish a website with AI',
    intro:
      'Write a short brief, let AI draft a one-page site, review and personalise it, then publish it for free with a live address.',
    time: '60 minutes',
    steps: aiWebsiteSteps
  },
  {
    pathId: 'web-starter',
    href: '/tutorials/web-starter',
    title: 'Build and publish your first web page',
    intro: 'Learn how web pages work, design a simple layout, build it with HTML and publish it for free.',
    time: '60 minutes',
    steps: webStarterSteps
  },
  {
    pathId: 'no-code-builder',
    href: '/tutorials/no-code-builder',
    title: 'Build a small no-code tool',
    intro: 'Turn a real problem into a working tool with a database table and an automation, without writing code.',
    time: '60 minutes',
    steps: noCodeBuilderSteps
  },
  {
    pathId: 'no-code-automation',
    href: '/tutorials/no-code-automation',
    title: 'Automate your first task',
    intro: 'Understand workflows, connect your apps and build an automation that saves you time.',
    time: '45 minutes',
    steps: noCodeAutomationSteps
  },
  {
    pathId: 'ml-foundations',
    href: '/tutorials/ml-foundations',
    title: 'Train your first machine learning model',
    intro: 'Learn the core ideas of machine learning and train a small model in a free Google Colab notebook.',
    time: '45 minutes',
    steps: mlFoundationsSteps
  },
  {
    pathId: 'design-basics',
    href: '/tutorials/design-basics',
    title: 'Design a prototype: from sketch to CAD and AI',
    intro:
      'Learn design basics, turn an idea into a 3D prototype, try text-to-CAD tools and run a first simulation.',
    time: '75 minutes',
    steps: designBasicsSteps
  },
  {
    pathId: 'ai-content-services',
    href: '/tutorials/ai-content-services',
    title: 'Prepare a reviewed AI content service package',
    intro: 'Create three posts and four FAQ answers for a fictional bakery, verify claims and assets, manage revisions and plan an honest service offer. Instructions are currently English; AI drafting is optional. Allow about 90 minutes plus feedback time.',
    time: '90 minutes',
    steps: contentServicesSteps,
    serviceKitId: 'ai-content-services-kit'
  },
  {
    pathId: 'ai-cad-services',
    href: '/tutorials/ai-cad-services',
    title: 'Prepare an AI-assisted CAD concept service',
    intro: 'Create and review a non-functional display-card concept with consistent dimensions and versioned views. Complete Design & CAD Basics first if needed. Instructions are currently English. Allow about 90 minutes; tool setup may take longer. No manufacturing or engineering approval.',
    time: '90 minutes',
    steps: cadServicesSteps,
    serviceKitId: 'ai-cad-services-kit'
  },
  {
    pathId: 'micro-saas-validation',
    href: '/tutorials/micro-saas-validation',
    title: 'Validate a micro-SaaS idea before building subscriptions',
    intro: 'Gather problem evidence, test a local-only project-update formatter and decide what to investigate next. Instructions are currently English. Allow about 90 minutes plus interviews. No paid AI, billing or production launch required.',
    time: '90 minutes',
    steps: microSaasSteps,
    serviceKitId: 'micro-saas-validation-kit'
  },
  {
    pathId: 'ai-education-services',
    href: '/tutorials/ai-education-services',
    title: 'Prepare an original adult AI workshop service',
    intro: 'Create a 15-minute claim-checking workshop with original materials, a checked answer key and accessible delivery. Instructions are currently English. Allow about 75 minutes plus an optional consenting-adult trial. No accreditation or guaranteed learning outcome.',
    time: '75 minutes',
    steps: educationServicesSteps,
    serviceKitId: 'ai-education-services-kit'
  }
];

// The first tutorial predates the registry and keeps its original storage key.
export function tutorialStorageKey(pathId: string) {
  return pathId === 'first-app' ? 'desofec:tutorial:task-tracker' : `desofec:tutorial:${pathId}`;
}

export function getTutorialForPath(pathId: string) {
  return tutorials.find((tutorial) => tutorial.pathId === pathId);
}
