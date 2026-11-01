import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const aiBeginnerSteps: TutorialStep[] = [
  {
    id: 'what-is-ai',
    title: 'Learn the core idea of AI',
    explanation: [
      'Modern AI assistants such as ChatGPT, Claude and Gemini are trained on huge amounts of text. They predict helpful words, one after another. They are powerful helpers, but they can be wrong, so you stay in charge.',
      'Open one assistant (ChatGPT at chatgpt.com, Claude at claude.ai or Gemini at gemini.google.com). A free account is enough. Then send the message below.'
    ],
    file: 'Chat prompt',
    code: `Explain what an AI assistant is in 5 simple sentences, as if I have never used one. Then tell me 3 things it is good at and 3 things I should never blindly trust it with.`,
    check: 'You get a short, clear answer, and you can say in your own words what AI is good and bad at.',
    aiPrompt: 'Now explain it again using an analogy from cooking.'
  },
  {
    id: 'prompt-basics',
    title: 'Understand prompt writing',
    explanation: [
      'A prompt is the message you send to an AI. A strong prompt has four parts: a role (who the AI should be), a task (what to do), context (details it needs) and a format (how to answer).',
      'First send a vague prompt, then send the improved one below. Compare the two answers. The difference is your first big lesson.'
    ],
    file: 'Chat prompt',
    code: `Vague: Tell me about healthy food.

Better: You are a friendly nutritionist. I am a busy student who cooks for one person with a small budget. Suggest 5 healthy dinners I can make in 20 minutes. Answer as a table with the dish, main ingredients and cost level.`,
    check: 'The better prompt gives a more useful, more specific answer. You can name which of the four parts made the difference.',
    aiPrompt: 'Rewrite this prompt of mine so it has a role, task, context and format: "help me study".'
  },
  {
    id: 'real-tasks',
    title: 'Use AI in real tasks',
    explanation: [
      'Pick a real task from your own life this week: an email to write, a topic to learn, a trip to plan or a decision to think through. Real tasks teach more than practice questions.',
      'Always check facts, names, dates and numbers. If the answer is important, ask the AI how you can verify it.'
    ],
    file: 'Chat prompt',
    code: `I want help with this task: [describe your real task here].
Ask me up to 3 questions first, then give me a first draft. After the draft, list anything in it I should double-check.`,
    check: 'You finished one real task with AI help, and you checked at least one fact yourself.',
    aiPrompt: 'What are the most common mistakes AI assistants make, and how can I spot them?'
  },
  {
    id: 'small-workflow',
    title: 'Build a small workflow',
    explanation: [
      'A workflow is a repeatable routine. Instead of writing a new prompt every time, you save a good one and reuse it. Keep saved prompts in a notes app or a document.',
      'Turn the task you just did into a reusable template. Save it somewhere easy to find, then use it again next week.'
    ],
    file: 'Chat prompt',
    code: `Turn the conversation we just had into a reusable prompt template for me. Use [brackets] for the parts I change each time. Add a one-line instruction for double-checking the result.`,
    check: 'You have one saved prompt template and have used it on a second task.',
    aiPrompt: 'Give me 3 other everyday tasks where a reusable prompt template would save me time.'
  }
];

export const aiProductivitySteps: TutorialStep[] = [
  {
    id: 'identify-tasks',
    title: 'Identify useful tasks',
    explanation: [
      'AI helps most with tasks that are repetitive, text-based or need a first draft: emails, summaries, planning, brainstorming and research. It helps least with tasks needing private judgment or perfect accuracy.',
      'Write down five tasks you do every week, then ask an assistant which ones are the best fit. Do not paste passwords, private data or anything confidential.'
    ],
    file: 'Chat prompt',
    code: `Here are 5 tasks I do every week: [list them].
Rank them from best to worst fit for AI help. For each, explain why in one sentence and name what I should still do myself.`,
    check: 'You have a ranked list and picked one or two tasks to improve first.',
    aiPrompt: 'What kinds of information should I never paste into an AI tool?'
  },
  {
    id: 'prompt-system',
    title: 'Define a prompt system',
    explanation: [
      'A prompt system is a small set of reusable prompts for your top tasks. Each one has a name, a template and a "check" line to review the output.',
      'Ask the assistant to build the system with you. Then save the results in a notes app such as Notion, where Notion AI can also help.'
    ],
    file: 'Chat prompt',
    code: `Help me build a small prompt system for these tasks: [your top 2 tasks].
For each, create a prompt template with [brackets] for what changes, a one-line tip for when to use it, and a checklist to review the result.`,
    check: 'You have 2 prompt templates saved in one place, each with a review checklist.',
    aiPrompt: 'Show me how to name and organize my saved prompts so I can find them quickly.'
  },
  {
    id: 'apply-routines',
    title: 'Apply AI routines',
    explanation: [
      'A routine ties a prompt to a time. For example: Monday planning, a daily inbox summary, or a Friday review. A routine turns AI from a toy into a habit.',
      'Try one routine for five working days. Use Perplexity for research questions, because it shows its sources.'
    ],
    file: 'Chat prompt',
    code: `Create a weekly routine for me using AI: a 10-minute Monday planning prompt, a daily 5-minute end-of-day summary prompt and a Friday review prompt. Keep each one short, and include the exact prompt text.`,
    check: 'You wrote down your three routine times and used one of them today.',
    aiPrompt: 'For research, how should I ask a question so that the answer comes with sources I can check?'
  },
  {
    id: 'review-optimize',
    title: 'Review and optimize',
    explanation: [
      'After a week, measure what happened. Which prompts saved time? Which gave poor answers? Improve the weak ones and delete the ones you never use.',
      'Keep a short log: the task, the time it took before, the time it took with AI, and a quality score from 1 to 5.'
    ],
    file: 'Chat prompt',
    code: `Here is my log from this week: [paste your notes]. Tell me which routines to keep, which to improve and which to drop. For each prompt to improve, suggest a better version.`,
    check: 'You kept the useful routines, improved at least one prompt and removed one that did not help.',
    aiPrompt: 'How can I tell whether AI is really saving me time, or just creating more checking work?'
  }
];
