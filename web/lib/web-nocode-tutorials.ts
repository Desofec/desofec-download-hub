import type { TutorialStep } from '@/lib/task-tracker-tutorial';

const pageCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Me</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; color: #1f2937; }
    header { background: #2563eb; color: white; padding: 40px 20px; text-align: center; }
    main { max-width: 640px; margin: 0 auto; padding: 24px 20px; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <header>
    <h1>Hi, I am Your Name</h1>
    <p>I am learning to build for the web.</p>
  </header>
  <main>
    <h2>About me</h2>
    <p>Write two sentences about yourself here.</p>
    <h2>My interests</h2>
    <ul>
      <li>Interest one</li>
      <li>Interest two</li>
    </ul>
    <h2>Contact</h2>
    <p><a href="mailto:you@example.com">Email me</a></p>
  </main>
</body>
</html>`;

export const webStarterSteps: TutorialStep[] = [
  {
    id: 'web-basics',
    title: 'Learn web basics',
    explanation: [
      'Every web page is built from three layers. HTML is the content and structure, CSS is the style, and JavaScript is the behavior. Today you only need HTML and a little CSS.',
      'Your page lives in a file called index.html. A browser reads that file and draws the page. Open any website, right-click, and choose "View page source" to see real HTML.'
    ],
    check: 'You opened View page source on a website and found a heading tag such as <h1> or <h2>.',
    aiPrompt: 'Explain HTML, CSS and JavaScript using a house as an analogy. Keep it to 6 sentences.'
  },
  {
    id: 'design-layout',
    title: 'Design the layout',
    explanation: [
      'Before coding, sketch the page on paper or in Figma or Canva. A simple personal page needs a header with your name, an about section, a short list and a contact link.',
      'Keep it simple. One column, readable text and one main color. You can always add more later.'
    ],
    check: 'You have a quick sketch with four labeled blocks: header, about, interests and contact.',
    aiPrompt: 'Suggest a simple one-page layout for a personal page for a beginner, and explain why each section is there.'
  },
  {
    id: 'build-page',
    title: 'Build a simple page',
    explanation: [
      'Create a free account on replit.com (or use VS Code), make a new HTML project and open index.html. Replace everything in it with the code below, then change the text to be about you.',
      'The <style> block holds the CSS. Try changing the color #2563eb to another color and watch the preview change.'
    ],
    file: 'index.html',
    replaceAll: true,
    code: pageCode,
    check: 'The preview shows a colored header with your name and the sections below it. Your own words replaced the placeholders.',
    aiPrompt: 'Explain this index.html line by line for a beginner. Do not change it.'
  },
  {
    id: 'publish-share',
    title: 'Publish and share',
    explanation: [
      'Publishing means putting your file on a server so anyone can open it with a link. A free way is GitHub Pages: create a GitHub account, make a new public repository, upload index.html, then open Settings, then Pages, and choose to deploy from the main branch.',
      'After a minute or two, GitHub shows your page address. Open it on your phone as well. Only share what you are happy for the whole world to see, and never publish private details like your home address.'
    ],
    check: 'You opened your public link on another device and shared it with one person.',
    aiPrompt: 'Walk me through publishing a single index.html file with GitHub Pages, one step at a time.'
  }
];

export const noCodeBuilderSteps: TutorialStep[] = [
  {
    id: 'pick-problem',
    title: 'Pick a simple problem to solve',
    explanation: [
      'The best first project is a small problem you really have: tracking books you want to read, job applications, client requests or event sign-ups.',
      'Write one sentence in this form: "I want to track ___ so I can ___." Keep the first version tiny.'
    ],
    file: 'Chat prompt',
    code: `I want to build a small no-code tool to track [your idea]. Suggest the simplest possible version: what information to store, what it should do automatically and what to leave out for version 1.`,
    check: 'You wrote your one-sentence problem and chose 4 to 6 pieces of information to track.',
    aiPrompt: 'Help me shrink this idea so a beginner can build it in one afternoon.'
  },
  {
    id: 'organize-data',
    title: 'Organize your data in a table',
    explanation: [
      'A table is rows and columns. Each row is one item, such as one book. Each column is one fact about it, such as title, status or date. Create a free Airtable account and make a new base with one table.',
      'Give each column a type that fits: text, date, checkbox or a single select for status like "To do", "Doing" and "Done". Add five real rows.'
    ],
    check: 'Your table has 4 to 6 columns and 5 real rows, and Status is a single-select column.',
    aiPrompt: 'Suggest column names and column types for a table that tracks [your idea].'
  },
  {
    id: 'connect-automation',
    title: 'Connect an automation to it',
    explanation: [
      'An automation says: when this happens, do that. For example, when a row changes to "Done", send yourself an email. Zapier and Make both connect to Airtable, and each has a free tier. Check the current free limits before you start.',
      'Build the smallest one: a trigger that fires when a record is created or updated, and one action. Test it with a real row before turning it on.'
    ],
    file: 'Chat prompt',
    code: `I use Airtable and want an automation in [Zapier or Make]. When a row's Status becomes "Done", send me an email with the row's title. Give me the setup steps in order, using the current screen names if you know them.`,
    check: 'You changed a row to Done and the email arrived. If not, check the automation run history for the error.',
    aiPrompt: 'My automation did not run. Here is what I see: [describe it]. What are the 3 most likely causes?'
  },
  {
    id: 'share-improve',
    title: 'Share it and improve it',
    explanation: [
      'Share your table with one trusted person and ask them to add a row without your help. Watch where they get confused. That tells you what to improve.',
      'Make one improvement at a time, such as a view that hides finished items or a form for adding rows. Never put private or sensitive data into a shared tool.'
    ],
    check: 'Someone else used your tool, and you made one improvement based on what they said.',
    aiPrompt: 'Give me 5 questions to ask a first-time user of my tool, and how to turn their answers into improvements.'
  }
];

export const noCodeAutomationSteps: TutorialStep[] = [
  {
    id: 'understand-workflows',
    title: 'Understand workflows',
    explanation: [
      'A workflow is a series of steps that run in order. Every automation has a trigger (what starts it), one or more actions (what it does) and sometimes conditions (only if something is true).',
      'Think of a repetitive job you do every week, then write it as: When ___ happens, if ___, then do ___.'
    ],
    file: 'Chat prompt',
    code: `Explain triggers, actions and conditions with 3 everyday examples. Then ask me about a repetitive task I do, and help me write it as a workflow in one sentence.`,
    check: 'You wrote one workflow sentence with a trigger and at least one action.',
    aiPrompt: 'What makes a task a good candidate for automation, and what makes it a bad one?'
  },
  {
    id: 'connect-tools',
    title: 'Connect simple tools',
    explanation: [
      'Automation tools such as Zapier, Make and n8n connect apps you already use. Zapier and Make are hosted and beginner friendly. n8n can be self-hosted, which suits people comfortable with technical setup.',
      'Create a free account on one of them and connect two apps, for example Gmail and Google Sheets. Grant only the permissions you need, and review them later.'
    ],
    check: 'Two apps are connected in your automation tool and show as connected.',
    aiPrompt: 'Compare Zapier, Make and n8n for a complete beginner in 6 lines. Mention free-tier limits I should check.'
  },
  {
    id: 'automate-task',
    title: 'Automate a task',
    explanation: [
      'Build your first automation from your workflow sentence. A great starter: when a form is submitted, add a row to a spreadsheet and send a thank-you message.',
      'Run a test with fake data first. Check that the result is correct before you turn the automation on for real.'
    ],
    check: 'A test run completed successfully and the result appeared where you expected.',
    aiPrompt: 'Here is my workflow: [paste it]. Give me the setup steps for [Zapier, Make or n8n], and list what could go wrong.'
  },
  {
    id: 'review-improve',
    title: 'Review results and improve',
    explanation: [
      'Every automation can fail quietly. Check the run history after a few days. Look for errors, duplicates and steps that give odd results.',
      'Add a safety step for important tasks, such as an email to yourself when something fails. If an automation does not save time, switch it off.'
    ],
    check: 'You reviewed the run history, fixed or removed anything that failed and noted the time saved.',
    aiPrompt: 'What are the most common mistakes in no-code automations, and how do I prevent them?'
  }
];
