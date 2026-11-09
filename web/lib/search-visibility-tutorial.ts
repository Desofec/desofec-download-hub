import type { TutorialStep } from '@/lib/task-tracker-tutorial';

export const searchVisibilityResources = {
  googleProperty: {
  label: 'Add a property in Search Console',
  url: 'https://support.google.com/webmasters/answer/34592?hl=en'
  },
  googleSitemap: {
    label: 'Build and submit a sitemap to Google',
    url: 'https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap'
  },
  googleRecrawl: {
  label: 'Ask Google to recrawl a URL',
  url: 'https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl'
  },
  bingGettingStarted: {
  label: 'Bing Webmaster Tools getting-started checklist',
  url: 'https://www.bing.com/webmasters/help/getting-started-checklist-66a806de?lang=en'
  },
  bingPortal: {
    label: 'Open Bing Webmaster Tools',
    url: 'https://www.bing.com/webmasters/about?cc=en'
  }
};

export const searchVisibilitySteps: TutorialStep[] = [
  {
    id: 'choose-canonical-origin',
    title: 'Choose one public website address',
    explanation: [
      'Pick one HTTPS hostname as the canonical address, for example https://www.example.com. Check both the www and non-www versions of the homepage and one inner page. The alternate hostname should redirect one way to the canonical version, preserving the page path.',
      'Use the same canonical host in page metadata, sitemap URLs and links you submit to search tools. For this app the configured canonical origin is https://www.desofec.com. Do not change DNS or hosting redirects unless you control them.'
    ],
    check: 'You can record one preferred HTTPS hostname, confirm the alternate redirects to it, and see the same hostname in the page canonical and sitemap.',
    aiPrompt: 'Help me check that one website hostname is canonical. Ask me to compare the www and non-www page addresses and the page canonical. Do not ask for passwords, verification tokens or DNS access.',
    resources: [searchVisibilityResources.googleProperty]
  },
  {
    id: 'verify-google-property',
    title: 'Verify your site in Google Search Console',
    explanation: [
      'Sign in to Search Console and add a Domain property for your root domain (for example example.com). Domain properties cover protocols and subdomains. Google will provide a DNS TXT record; add it at the domain provider only if you control that DNS, then use Verify. A URL-prefix property is an alternative if you can only verify that specific prefix.',
      'If the property is already verified, keep using it; do not create duplicate properties just for www and non-www. Never share passwords or verification tokens in a chat.'
    ],
    check: 'Search Console shows the correct domain property and your account has access. If ownership is verified already, record that and continue.',
    aiPrompt: 'Explain Google Search Console Domain property verification in beginner-friendly steps. Remind me to use the exact DNS TXT value shown by Google and never paste credentials or verification tokens into chat.',
    resources: [searchVisibilityResources.googleProperty]
  },
  {
    id: 'submit-google-sitemap',
    title: 'Check or submit the canonical sitemap to Google',
    explanation: [
      'Open the verified property and select Sitemaps. First check whether the full canonical sitemap URL, such as https://www.example.com/sitemap.xml, is already listed. Submit it only if it is absent; otherwise keep the existing submission and check its status.',
      'If processing is pending, allow time rather than submitting the same sitemap again. Investigate reported errors and check that the sitemap contains the public page URLs you want discovered. A sitemap helps Google discover URLs; it does not force indexing.'
    ],
    check: 'The submitted sitemap shows a successful processing status and its URL begins with your canonical HTTPS hostname.',
    aiPrompt: 'Help me interpret the status in the Search Console Sitemaps report. Ask for the status text only; do not request login details.',
    resources: [searchVisibilityResources.googleSitemap]
  },
  {
    id: 'inspect-google-url',
    title: 'Test and inspect an important page in Google',
    explanation: [
      'Paste the exact canonical page URL into the Search Console inspection box. Check both the indexed status and, when needed, Test Live URL. In live-test details, confirm page fetch succeeded, crawling and indexing are allowed, and User-declared canonical matches the URL you chose.',
      'If the page is available but not indexed, request indexing once for that canonical URL. Google says crawling may take days or weeks and a request does not guarantee inclusion; repeated requests do not speed it up.'
    ],
    check: 'You can distinguish “available to Google” from “on Google,” and your tested page declares the expected canonical hostname.',
    aiPrompt: 'Explain this Search Console status in plain language: [paste non-sensitive status text]. Separate live availability from current indexing. Do not claim a request guarantees search results.',
    resources: [searchVisibilityResources.googleRecrawl]
  },
  {
    id: 'set-up-bing-webmaster',
    title: 'Check or verify your site in Bing Webmaster Tools',
    explanation: [
      'Bing Webmaster Tools is the service for Bing search; Microsoft Edge is only a web browser. Open Bing Webmaster Tools and sign in with an available account. First check whether the canonical site is already listed. If it is, use the existing entry and verify it only if needed. If it is absent, use Bing’s import option for an already verified Search Console property when offered, or add the site and complete a verification method shown there.',
      'Check whether the same canonical sitemap URL, for example https://www.example.com/sitemap.xml, is already listed. Submit it only if absent; if the sitemap is pending, monitor the existing submission rather than submitting it again. Follow current Bing guidance for errors and use its available URL inspection tools for important new pages.'
    ],
    check: 'Bing Webmaster Tools lists your verified site and the canonical sitemap, with no unresolved verification or sitemap error.',
    aiPrompt: 'Guide me through the official Bing Webmaster Tools getting-started checklist one screen at a time. Ask what option I see. Do not ask for passwords, verification tokens or DNS credentials.',
    resources: [searchVisibilityResources.bingPortal, searchVisibilityResources.bingGettingStarted]
  },
  {
    id: 'monitor-indexing',
    title: 'Monitor calmly and fix the reported cause',
    explanation: [
      'Check Google’s Pages report and Bing’s site and sitemap reports periodically. An unindexed URL can be normal; use the exact reason shown (such as redirect, blocked crawl, duplicate canonical or discovery pending) to choose a fix. Inspect redirect destinations and canonical tags before requesting another crawl.',
      'Keep pages useful, original, accessible and clearly written for people. Search tools can discover and evaluate pages, but no configuration guarantees indexing, ranking, visitors, or mentions in AI answers.'
    ],
    check: 'You have recorded one actual issue or confirmed none, identified its source, and avoided repeated requests for the same unchanged URL.',
    aiPrompt: 'Help me understand this non-sensitive Search Console or Bing Webmaster Tools issue. Explain what it says, what evidence is missing, and one safe next check. Do not promise rankings or indexing.',
    resources: [searchVisibilityResources.bingPortal, searchVisibilityResources.bingGettingStarted, searchVisibilityResources.googleRecrawl]
  }
];
