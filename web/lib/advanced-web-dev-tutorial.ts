import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const advancedWebDevSteps: TutorialStep[] = [
  {
    id: 'write-a-spec',
    title: 'Write a small spec before you prompt',
    explanation: [
      'AI coding assistants work best when you give them a clear, small target. Write a one-page spec: who the app is for, the three things it must do, what it must not do and how you will know it works (acceptance checks).',
      'Keep the first version tiny. A spec you can read in two minutes is easier to build, test and fix than a long wish list.'
    ],
    file: 'SPEC.md',
    code: `# Spec: [app name]
Users: [who uses it]
Must do (max 3):
1.
2.
3.
Must not do:
Acceptance checks (how I will test each "must do"):
-
Data it stores and where (never store secrets in the code):
Out of scope for version 1:`,
    check: 'Your spec has at most three "must do" items and a check for each one.',
    aiPrompt: 'Review this app spec. Point out vague requirements, missing edge cases and anything that is too big for a first version: [paste SPEC.md].'
  },
  {
    id: 'project-structure',
    title: 'Set up a clean project with Git',
    explanation: [
      'Create a project folder, start Git, and make one commit before the AI touches anything. Then every AI change can be reviewed and undone. Work on a branch for each feature, and commit small steps with clear messages.',
      'Add a .gitignore so secret files and dependency folders are never committed. Keep keys in environment variables, never in the code or in a prompt.'
    ],
    file: 'Terminal',
    code: `mkdir my-app && cd my-app
git init
printf "node_modules/\\n.env\\n.env.local\\n" > .gitignore
git add . && git commit -m "Start project"
git checkout -b feature/first-feature`,
    check: 'git log shows your first commit and git status shows you are on a feature branch.',
    aiPrompt: 'Explain Git branches, commits and .gitignore with a simple analogy, and why they matter when an AI assistant edits my code.'
  },
  {
    id: 'prompt-in-small-steps',
    title: 'Ask the AI for one small change at a time',
    explanation: [
      'Give the assistant your spec and ask for one small change, with the files it may touch. Small changes are easy to read, test and undo. Large "build the whole app" prompts hide mistakes.',
      'Ask it to explain what it changed and to list assumptions. Commit after every change that works, so a bad change costs you minutes, not hours.'
    ],
    file: 'Chat prompt',
    code: `Here is my spec: [paste SPEC.md].
Make ONE change: [describe it, e.g. "add a function that validates a task title"].
Only edit these files: [list].
Do not add new dependencies without asking.
Then explain what you changed, list your assumptions, and give me a command to test it.`,
    check: 'You asked for one change, read the explanation and committed it after it worked.',
    aiPrompt: 'Give me a checklist for writing small, safe prompts to a coding assistant, including how to limit which files it can edit.'
  },
  {
    id: 'tests-first',
    title: 'Write tests so you can trust the code',
    explanation: [
      'A test is a small program that checks your code gives the right answer. Write the test from your acceptance checks first, watch it fail, then let the AI write code until it passes. This works with plain Node.js and nothing to install.',
      'Create the two files below, then run the test. The first run fails because the function does not exist yet: that is the point. Ask the AI to write validate.js so the tests pass, without editing the test file.'
    ],
    file: 'validate.test.js',
    code: `const test = require('node:test');
const assert = require('node:assert');
const { validateTitle } = require('./validate');

test('accepts a normal title', () => {
  assert.deepStrictEqual(validateTitle('Buy milk'), { ok: true, title: 'Buy milk' });
});

test('trims spaces', () => {
  assert.strictEqual(validateTitle('  Buy milk  ').title, 'Buy milk');
});

test('rejects empty and blank titles', () => {
  assert.strictEqual(validateTitle('').ok, false);
  assert.strictEqual(validateTitle('   ').ok, false);
});

test('rejects titles over 80 characters', () => {
  assert.strictEqual(validateTitle('a'.repeat(81)).ok, false);
});

test('rejects non-text input', () => {
  assert.strictEqual(validateTitle(null).ok, false);
  assert.strictEqual(validateTitle(42).ok, false);
});`,
    check: 'Run: node --test. It fails first. After the AI writes validate.js, all 5 tests pass.',
    aiPrompt: 'Write validate.js so that every test in validate.test.js passes. Do not edit the test file. Then explain each line.'
  },
  {
    id: 'review-ai-code',
    title: 'Review what the AI wrote',
    explanation: [
      'Never merge code you have not read. Check the diff: does it only touch the files you allowed? Are there new dependencies, hard-coded keys, copied code you do not understand or checks that were quietly removed? Do the tests still pass?',
      'Look for the usual risks: user input used without checks, secrets in the code, error messages that reveal internals and tests that were weakened to pass. Ask the AI to review its own change as a sceptical reviewer, then check the important points yourself.'
    ],
    file: 'Terminal',
    code: `git diff
node --test
git diff --stat   # which files changed, and how much?`,
    check: 'You read the diff, confirmed only expected files changed and the tests pass.',
    aiPrompt: 'Act as a sceptical code reviewer. Review this diff for bugs, security risks, secrets, unnecessary dependencies and weakened tests: [paste git diff].'
  },
  {
    id: 'ship-and-maintain',
    title: 'Ship it and keep it healthy',
    explanation: [
      'Merge your branch when the tests pass and you have reviewed the diff, then deploy from the main branch (for example with Vercel). Set secrets as environment variables in the hosting dashboard, and check the live site after each deploy.',
      'Keep a short README with how to run and test the app, update dependencies on a schedule and keep a changelog of what the AI helped build. Record any decision you would otherwise forget.'
    ],
    file: 'README.md',
    code: `# [app name]
What it does (one sentence):
Run it:   [command]
Test it:  node --test
Deploy:   [where, and which branch]
Environment variables (names only, never values):
Known limits and next steps:`,
    check: 'The app is deployed from main, the live site works and the README explains how to run and test it.',
    aiPrompt: 'Give me a short pre-deploy checklist for a small web app: tests, secrets, environment variables, error handling and a rollback plan.'
  }
];
