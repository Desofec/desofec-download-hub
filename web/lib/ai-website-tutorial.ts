import type { TutorialStep } from '@/lib/task-tracker-tutorial';

const starterPage = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sam's Bakery – fresh bread in Leeds</title>
  <meta name="description" content="Small neighbourhood bakery. Order fresh bread and cakes for pickup.">
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; line-height: 1.6; color: #1f2933; }
    header, main, footer { max-width: 40rem; margin: 0 auto; padding: 1.25rem; }
    h1 { font-size: 2rem; margin-bottom: 0.25rem; }
    .button { display: inline-block; padding: 0.75rem 1.25rem; background: #8a3b12; color: #fff; border-radius: 0.5rem; text-decoration: none; }
    .button:focus-visible { outline: 3px solid #1f2933; outline-offset: 2px; }
    footer { border-top: 1px solid #d5dbe1; font-size: 0.9rem; }
  </style>
</head>
<body>
  <header>
    <h1>Sam's Bakery</h1>
    <p>Fresh bread and cakes, baked every morning.</p>
    <a class="button" href="mailto:hello@example.com">Order for pickup</a>
  </header>
  <main>
    <section>
      <h2>What we bake</h2>
      <ul>
        <li>Sourdough and seeded loaves</li>
        <li>Birthday and celebration cakes</li>
        <li>Gluten-free options on request</li>
      </ul>
    </section>
    <section>
      <h2>About us</h2>
      <p>Replace this with two or three sentences about you, written in your own words.</p>
    </section>
  </main>
  <footer>
    <p>Open Tuesday to Saturday, 8:00 to 16:00. Replace this with your real details.</p>
  </footer>
</body>
</html>`;

export const aiWebsiteSteps: TutorialStep[] = [
  {
    id: 'write-a-brief',
    title: 'Plan the site and write a brief',
    explanation: [
      'AI builds much better pages when you tell it who the site is for and what one thing visitors should do. Decide this before you open any tool. For a first site, one page with a few sections is plenty.',
      'Gather what you already have: your own text, a logo and photos you have the right to use. Decide which details are public, such as an email address or opening hours, and which are not.'
    ],
    file: 'Chat prompt',
    code: `Help me write a one-page website brief.
About me / my project: [describe in 2 sentences].
Visitors: [who].
The one action I want them to take: [contact me / read / sign up / buy].
Ask me up to 5 questions you need, then produce a brief with: audience, goal, sections, tone and the text I still need to write.`,
    check: 'You have a short brief with an audience, one goal, a list of sections and a tone.',
    aiPrompt: 'Explain what makes a good one-page website for a small business or personal project, with three common mistakes beginners make.'
  },
  {
    id: 'generate-first-draft',
    title: 'Generate a first draft with AI',
    explanation: [
      'You have two easy routes. A chat assistant can write a single index.html file that you save and open in your browser, with no account on a site builder needed. An AI app builder such as Lovable can generate a page from your description and show a live preview.',
      'Either way, paste your brief and ask for placeholder text in square brackets. Treat the result as a first draft. Do not paste passwords, API keys or private data into any AI tool, and read the tool\u2019s terms before using it for a business.'
    ],
    file: 'Chat prompt',
    code: `Using this brief: [paste your brief].
Create a single-page website as one index.html file with embedded CSS.
Use semantic HTML (header, main, section, footer), readable text, good colour contrast and a layout that works on phones.
Use placeholder text in [square brackets] where you do not know the facts. Do not add tracking scripts or external libraries.`,
    check: 'You have a draft page that opens in your browser or in the builder preview.',
    aiPrompt: 'Compare using a chat assistant to write HTML with using an AI website builder. Give pros and cons for a complete beginner.'
  },
  {
    id: 'understand-the-page',
    title: 'Read and understand the page',
    explanation: [
      'You do not need to be a developer, but you should know what is in your page. Below is a small example of the structure a good draft has: a title, a header with one clear button, sections with headings, and a footer.',
      'Save it as index.html, double-click it to open it, then change the words you recognise. Look for the title in the browser tab, the headings, the button link and the footer. Ask AI to explain anything you do not understand, one part at a time.'
    ],
    file: 'index.html',
    replaceAll: true,
    code: starterPage,
    check: 'You can point to the title, the main heading, the button and the footer, and you changed at least three pieces of text.',
    aiPrompt: 'Explain this HTML page line by line for a beginner. Then tell me which three lines I should change to make it mine: [paste your page].'
  },
  {
    id: 'review-and-fix',
    title: 'Review, fix and make it yours',
    explanation: [
      'Now check the draft like an editor. Open it on your phone and on a computer. Is the text easy to read? Do headings go in order? Do links make sense on their own, for example \u201cOrder for pickup\u201d rather than \u201cclick here\u201d? Is every claim true?',
      'Ask AI to review the page, but make the final decisions yourself. Replace every [placeholder], check names, prices and contact details, and only use images you have the right to use.'
    ],
    file: 'Chat prompt',
    code: `Review this page: [paste your HTML].
Check mobile layout, heading order, link text that makes sense out of context, image descriptions, colour contrast and any claim I may not be able to prove.
List the problems first, then suggest the smallest changes that fix them. Do not rewrite the whole page.`,
    check: 'Every placeholder is replaced, the page looks fine on a phone and all details are true.',
    aiPrompt: 'Give me a 10-point checklist to review a small website before publishing, covering content, accessibility, privacy and links.'
  },
  {
    id: 'publish-for-free',
    title: 'Choose hosting and publish',
    explanation: [
      'Choose hosting that permits your intended use. For example, you can import a GitHub repository into Vercel, but its free Hobby plan is for non-commercial personal use. Check current eligibility, terms and costs before choosing a plan.',
      'Menu names and plans change, so follow the service\u2019s current instructions. After publishing, open the live address on your phone, ask a friend to test it and check that nothing private is visible.'
    ],
    file: 'Chat prompt',
    code: `I have an index.html file for my website.
Explain a suitable publishing route using a GitHub repository and hosting, for someone who has never used either.
Ask whether my site is personal or commercial and tell me to check the host's current plan terms and costs.
Tell me what I should check before and after publishing, and what to do if the page shows an error.`,
    check: 'Your site opens at a live web address on your phone and shows your content.',
    aiPrompt: 'Explain what a domain name, hosting and DNS are in simple words, and how much a custom domain usually involves in ongoing cost.'
  },
  {
    id: 'improve-and-share',
    title: 'Improve, share and keep it safe',
    explanation: [
      'Make one small improvement at a time: add a short about section, a better title, a page description for search engines or a photo with a text description. Publish after each change so you can see what worked.',
      'Share the link with the people you wrote it for. Keep your own copy of the files, use strong passwords with two-step verification on your accounts and never put secret keys in the page.'
    ],
    file: 'Chat prompt',
    code: `Here is my published page: [paste your HTML].
Suggest 5 small improvements, ordered by effort (easiest first), for these visitors: [who].
For each, explain the benefit and show the exact change. Do not add tracking or external scripts.`,
    check: 'You made one improvement, republished it and shared the link.',
    aiPrompt: 'Help me write a short, friendly message to share my new website with friends and ask for specific feedback.'
  }
];
