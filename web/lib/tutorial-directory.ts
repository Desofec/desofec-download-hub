export const tutorialTopics = [
  { id: 'ai', label: 'AI and productivity' },
  { id: 'coding', label: 'Coding and websites' },
  { id: 'automation', label: 'Automation and no-code' },
  { id: 'business', label: 'Business and commerce' },
  { id: 'data', label: 'Data and spreadsheets' },
  { id: 'design', label: 'Design and video' },
  { id: 'education', label: 'Education and careers' }
] as const;

export type TutorialTopic = typeof tutorialTopics[number]['id'];

const topicTutorials: Record<TutorialTopic, readonly string[]> = {
  ai: ['ai-beginner', 'ai-productivity', 'research-with-ai', 'ml-foundations', 'ai-workflows-agents', 'content-creation', 'ai-privacy-fact-checking', 'ai-multilingual-work', 'ai-meeting-notes'],
  coding: ['first-app', 'coding-foundations', 'ai-assisted-coding', 'advanced-web-dev-ai',
    'ai-website-builder', 'web-starter', 'first-website-challenge', 'search-visibility', 'micro-saas-validation'],
  automation: ['no-code-automation', 'no-code-builder', 'advanced-no-code-automation',
    'ai-workflows-agents', 'ai-automation-services', 'auto-data-analysis'],
  business: ['ai-online-retail', 'ai-marketplace-model', 'ai-logistics-services', 'ai-small-business',
    'ai-content-services', 'ai-automation-services', 'ai-spreadsheets', 'ai-video-business',
    'ai-cad-services', 'micro-saas-validation', 'ai-education-services', 'freelance-client-discovery',
    'shopify-guide', 'sharetribe-guide', 'zoho-inventory-guide', 'shippo-guide', 'zendesk-guide', 'looker-studio-guide'],
  data: ['origin-data-analysis', 'auto-data-analysis', 'advanced-measurement-analysis',
    'data-visualization', 'ai-spreadsheets', 'ml-foundations', 'looker-studio-guide', 'zoho-inventory-guide'],
  design: ['design-basics', 'ai-cad-services', 'ai-video-creation', 'ai-video-business', 'content-creation'],
  education: ['ai-for-education', 'ai-education-services', 'ai-career-skills']
};

export function tutorialTopicIds(id: string): TutorialTopic[] {
  const topics = tutorialTopics.filter((topic) => topicTutorials[topic.id].includes(id)).map((topic) => topic.id);
  if (!topics.length) throw new Error(`Missing tutorial directory topic: ${id}`);
  return topics;
}

export function matchesTutorialFilters(
  item: { topics: readonly TutorialTopic[]; level?: string; searchText: readonly string[] },
  query: string,
  topic: TutorialTopic | 'all',
  level: string
) {
  if (topic !== 'all' && !item.topics.includes(topic)) return false;
  if (level !== 'All' && item.level !== level) return false;
  const needle = query.trim().toLocaleLowerCase();
  return !needle || item.searchText.some((text) => text.toLocaleLowerCase().includes(needle));
}
