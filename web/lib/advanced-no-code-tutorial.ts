import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const advancedNoCodeSteps: TutorialStep[] = [
  {
    id: 'map-the-process',
    title: 'Map the process before you automate it',
    explanation: [
      'Advanced automations fail when the process is unclear. Write down what starts it, what data moves, which decisions are made, who owns each step and what a good result looks like. Automate only steps that are repeated, rule-based and low-risk.',
      'Count the real cost: how often it runs, how long it takes by hand and what a mistake would cost. If a mistake is expensive, plan a human check.'
    ],
    file: 'Process map',
    code: `Process name:
Trigger (event that starts it):
Data in (fields, where from):
Decisions (if this, then that):
Actions (what changes, in which app):
Owner (who fixes it when it breaks):
Runs per week / minutes by hand:
Cost of a mistake (low / medium / high) and human check needed:`,
    check: 'Your map shows the trigger, fields, decisions, actions, an owner and the cost of a mistake.',
    aiPrompt: 'Review this process map. Which steps are safe to automate, which need a human check and what is missing? [paste map]'
  },
  {
    id: 'data-mapping',
    title: 'Clean and map the data',
    explanation: [
      'Most automation bugs are data bugs: empty fields, extra spaces, different date formats, duplicate rows or a name in the wrong column. Decide a standard format for each field and check it at the start of the workflow.',
      'In Zapier, Make or n8n use a formatter or filter step to trim text, standardise dates and stop the run when a required field is missing. Stopping early with a clear message is better than saving bad data.'
    ],
    file: 'Chat prompt',
    code: `I use [Zapier / Make / n8n]. My trigger gives me these fields: [list them with an example value].
Suggest a standard format for each field, the checks to run at the start (required, format, length) and what the workflow should do when a check fails.
Tell me where you are unsure about current menu names.`,
    check: 'The workflow stops with a clear message when a required field is empty or badly formatted.',
    aiPrompt: 'List the ten most common data problems that break no-code automations and how to guard against each one.'
  },
  {
    id: 'branches-and-filters',
    title: 'Add filters, branches and approvals',
    explanation: [
      'Use a filter to continue only when a condition is true, and a branch (router or path) to handle different cases in different ways, such as a high-value order going to a person and a small one being handled automatically.',
      'Always add a default path for "none of the above" so unusual inputs do not disappear. Put an approval step before anything that sends, pays, deletes or publishes.'
    ],
    file: 'Decision table',
    code: `Condition                         -> Action
Amount < 50 and email valid       -> Handle automatically
Amount >= 50                      -> Send to a person for approval
Email missing or invalid          -> Stop and log "bad email"
Anything else (default)           -> Send to a person for review`,
    check: 'Every possible input ends in one of your paths, including a default one.',
    aiPrompt: 'Turn this decision table into step-by-step instructions for [Zapier / Make / n8n], including the default path: [paste table].'
  },
  {
    id: 'duplicates-and-retries',
    title: 'Prevent duplicates and handle retries',
    explanation: [
      'Triggers can fire twice, and failed steps are often retried. If your workflow creates a record or sends a message each time, you may create duplicates. The fix is an idempotency key: a unique ID for each event, saved after it is processed, so a repeat is skipped.',
      'The script below needs only Node.js. It checks required fields, skips events it has already processed and retries a flaky step a limited number of times. Your no-code tool does the same with a lookup step ("find record first") and a retry setting.'
    ],
    file: 'dedupe_demo.js',
    code: `const processed = new Set();
let flakyCalls = 0;

function validate(event) {
  const missing = ["id", "email", "amount"].filter((f) => !event[f]);
  return missing.length ? { ok: false, error: "Missing: " + missing.join(", ") } : { ok: true };
}

function flakyStep() {
  flakyCalls += 1;
  if (flakyCalls < 3) throw new Error("Temporary error " + flakyCalls);
  return "saved";
}

function withRetries(fn, maxTries = 3) {
  for (let attempt = 1; attempt <= maxTries; attempt++) {
    try {
      return fn();
    } catch (err) {
      console.log("  attempt " + attempt + " failed: " + err.message);
      if (attempt === maxTries) throw err;
    }
  }
}

function handle(event) {
  const check = validate(event);
  if (!check.ok) return "rejected (" + check.error + ")";
  if (processed.has(event.id)) return "skipped (duplicate " + event.id + ")";
  const result = withRetries(flakyStep);
  processed.add(event.id);
  return result;
}

const events = [
  { id: "a1", email: "sam@example.com", amount: 20 },
  { id: "a1", email: "sam@example.com", amount: 20 },
  { id: "a2", email: "", amount: 15 },
];

for (const e of events) console.log(e.id + ": " + handle(e));`,
    check: 'Run: node dedupe_demo.js. The first event is saved after two retries, the repeat is skipped and the incomplete one is rejected.',
    aiPrompt: 'Explain dedupe_demo.js line by line, then show how I would do the same in [Zapier / Make / n8n] with a lookup step and a retry setting.'
  },
  {
    id: 'errors-and-alerts',
    title: 'Handle errors and send alerts',
    explanation: [
      'Silent failures are the worst kind. Decide what happens when a step fails: retry a few times, then stop and alert the owner with the step name, the input and the error. Most tools offer error handlers, failed-run notifications or an error route.',
      'Send alerts to somewhere you really look, and make them readable: what failed, for which record and what to do next. Keep personal data out of alert messages where you can.'
    ],
    file: 'Alert template',
    code: `Automation: [name]
Failed step: [step]
Record / event ID: [id]
Error: [message]
Retries used: [n]
What to do: [e.g. fix the field and re-run from the history page]`,
    check: 'You caused a test failure on purpose and the alert reached the owner with enough detail to fix it.',
    aiPrompt: 'Help me design an error-handling plan for this automation: retries, error route, alerts and a manual re-run process: [paste process map].'
  },
  {
    id: 'monitor-and-document',
    title: 'Monitor, document and secure it',
    explanation: [
      'Check run history weekly: failures, skipped runs and time saved. Remove connections you no longer use, give each automation the least access it needs and use a shared or service account rather than a personal one so it keeps working when people change roles.',
      'Write a short runbook: what the automation does, where it runs, who owns it, how to pause it and how to fix the common failures. Never store passwords or API keys in the runbook.'
    ],
    file: 'RUNBOOK.md',
    code: `# Runbook: [automation name]
Purpose:
Owner / backup owner:
Tools and accounts used (names only):
How to pause it:
Common failures and fixes:
Weekly check: failures, skipped runs, minutes saved
Last reviewed:`,
    check: 'A colleague could pause and fix the automation using only your runbook.',
    aiPrompt: 'Review this runbook for missing information a new owner would need, and for anything sensitive that should not be written down: [paste runbook].'
  }
];
