const goalData = [
  {
    id: 'learn-ai',
    name: 'Learn AI',
    description: 'Understand AI basics, prompts, and real-world workflows that improve everyday work.',
    badge: 'AI'
  },
  {
    id: 'build-website',
    name: 'Build a website',
    description: 'Learn the basics of design and publishing so you can launch a simple online presence.',
    badge: 'Web'
  },
  {
    id: 'automate-work',
    name: 'Automate my work',
    description: 'Use practical no-code workflows to handle repetitive tasks and save time.',
    badge: 'Workflow'
  },
  {
    id: 'learn-coding',
    name: 'Learn coding',
    description: 'Start with beginner-friendly coding tools and tiny real-world project ideas.',
    badge: 'Coding'
  },
  {
    id: 'learn-ml',
    name: 'Learn machine learning',
    description: 'Understand the foundations of ML, experiments, and data-driven learning.',
    badge: 'ML'
  },
  {
    id: 'design-cad',
    name: 'Use CAD and design tools',
    description: 'Explore beginner-friendly design, 3D, and product design tools for creative work.',
    badge: 'Design'
  },
  {
    id: 'build-app',
    name: 'Build an app',
    description: 'Turn a product idea into a real first step with a simple app-building roadmap.',
    badge: 'App'
  },
  {
    id: 'no-code',
    name: 'Use no-code tools',
    description: 'Build faster with tools that help you automate, organize, and launch without code.',
    badge: 'No-code'
  },
  {
    id: 'ai-productivity',
    name: 'Improve AI productivity',
    description: 'Learn how AI can help with research, writing, planning, and smarter daily workflows.',
    badge: 'Productivity'
  }
];

const toolData = [
  { id: 'chatgpt', name: 'ChatGPT', category: 'AI', skill: 'Beginner', description: 'Useful for prompt writing, brainstorming, research, and learning how AI works in practice.', badge: 'AI' },
  { id: 'claude', name: 'Claude', category: 'AI', skill: 'Beginner', description: 'Good for long-form writing, summarization, and understanding complex ideas more clearly.', badge: 'AI' },
  { id: 'perplexity', name: 'Perplexity', category: 'AI', skill: 'Beginner', description: 'Helpful for research, answers, and fast learning across many topics and questions.', badge: 'AI' },
  { id: 'notion-ai', name: 'Notion AI', category: 'AI', skill: 'Beginner', description: 'Great for notes, summaries, planning, and improving personal and team productivity.', badge: 'Productivity' },
  { id: 'vscode', name: 'VS Code', category: 'Coding', skill: 'Beginner', description: 'The most common editor for learning code, building small apps, and exploring coding projects.', badge: 'Code' },
  { id: 'git', name: 'GitHub', category: 'Coding', skill: 'Beginner', description: 'Essential for storing code, managing versions, and collaborating on projects.', badge: 'Code' },
  { id: 'python', name: 'Python', category: 'Coding', skill: 'Beginner', description: 'A practical language for learning coding, automation, and data-driven projects.', badge: 'Code' },
  { id: 'figma', name: 'Figma', category: 'Design', skill: 'Beginner', description: 'Great for UI design, mockups, concept exploration, and simple product layout work.', badge: 'Design' },
  { id: 'canva', name: 'Canva', category: 'Design', skill: 'Beginner', description: 'Useful for posters, presentations, visual content, and beginners exploring design quickly.', badge: 'Design' },
  { id: 'zapier', name: 'Zapier', category: 'Automation', skill: 'Beginner', description: 'Connect apps and automate repetitive tasks without needing to write code.', badge: 'Automation' },
  { id: 'make', name: 'Make', category: 'Automation', skill: 'Beginner', description: 'A visual builder for connecting tools and simplifying digital workflows.', badge: 'Automation' },
  { id: 'n8n', name: 'n8n', category: 'Automation', skill: 'Intermediate', description: 'A flexible automation platform for more advanced workflows and custom integrations.', badge: 'Automation' },
  { id: 'colab', name: 'Google Colab', category: 'ML', skill: 'Beginner', description: 'An easy environment for trying notebooks, data analysis, and ML experiments.', badge: 'ML' },
  { id: 'kaggle', name: 'Kaggle', category: 'ML', skill: 'Beginner', description: 'A beginner-friendly place to learn, practice, and explore real datasets and models.', badge: 'ML' },
  { id: 'fusion-360', name: 'Fusion 360', category: 'Design', skill: 'Intermediate', description: 'Helpful for CAD, product thinking, and 3D modeling for concept exploration.', badge: 'CAD' }
];

const pathData = [
  {
    id: 'ai-beginner',
    title: 'AI for Beginners',
    level: 'Beginner',
    description: 'Learn the basics of AI, prompts, and useful daily workflows before going deeper.',
    badge: 'AI'
  },
  {
    id: 'no-code-automation',
    title: 'No-Code Automation',
    level: 'Beginner',
    description: 'Explore practical automation ideas that save time and make your digital work easier.',
    badge: 'Automation'
  },
  {
    id: 'web-starter',
    title: 'Website Starter',
    level: 'Beginner',
    description: 'Learn the fundamentals of web structure, content, and publishing a simple online project.',
    badge: 'Web'
  },
  {
    id: 'coding-foundations',
    title: 'Coding Foundations',
    level: 'Beginner',
    description: 'Set up your environment, learn core concepts, and build tiny projects with confidence.',
    badge: 'Code'
  },
  {
    id: 'ml-foundations',
    title: 'ML Foundations',
    level: 'Beginner',
    description: 'Understand the core ideas behind ML, data patterns, and small practical experiments.',
    badge: 'ML'
  },
  {
    id: 'ai-productivity',
    title: 'AI Productivity Path',
    level: 'Beginner',
    description: 'Use AI to improve writing, planning, research, and everyday productivity tasks.',
    badge: 'Productivity'
  }
];

const starterPacks = [
  { id: 'ai-prompt-pack', title: 'Beginner AI Starter Pack', description: 'Useful prompt templates, AI workflow ideas, and quick wins for getting started.', level: 'Beginner' },
  { id: 'automation-kit', title: 'No-Code Automation Kit', description: 'Workflow examples and practical steps for automating everyday tasks.', level: 'Beginner' },
  { id: 'website-bundle', title: 'Website Starter Bundle', description: 'A simple toolkit for building and publishing a small online project.', level: 'Beginner' },
  { id: 'coding-basics-kit', title: 'Coding Basics Kit', description: 'A starter set of learning tasks, concepts, and mini project ideas.', level: 'Beginner' },
  { id: 'ml-workbook', title: 'ML Foundations Workbook', description: 'A beginner-friendly workbook for learning ML concepts and small experiments.', level: 'Beginner' },
  { id: 'productivity-boost', title: 'AI Productivity Boost', description: 'Use AI to simplify writing, planning, research, and everyday job tasks.', level: 'Beginner' }
];

const recommendationMap = {
  'learn-ai': {
    title: 'AI for Beginners',
    summary: 'Start with AI basics, prompt writing, and simple real-world workflows before moving into deeper tool usage.',
    tools: ['chatgpt', 'perplexity', 'notion-ai'],
    starters: ['ai-prompt-pack', 'productivity-boost']
  },
  'build-website': {
    title: 'Website Builder Path',
    summary: 'Learn the essential steps for designing, creating, and publishing a simple website without feeling lost.',
    tools: ['figma', 'vscode', 'git'],
    starters: ['website-bundle']
  },
  'automate-work': {
    title: 'Automation Starter',
    summary: 'Use a few beginner-friendly tools to reduce repetitive tasks and improve the way you work.',
    tools: ['zapier', 'make', 'notion-ai'],
    starters: ['automation-kit']
  },
  'learn-coding': {
    title: 'Coding Foundations',
    summary: 'Learn the basics of coding and use small projects to build confidence before deeper learning.',
    tools: ['python', 'vscode', 'git'],
    starters: ['coding-basics-kit']
  },
  'learn-ml': {
    title: 'Machine Learning Foundations',
    summary: 'Understand the big ideas behind ML, data patterns, and beginner-friendly experiments.',
    tools: ['python', 'colab', 'kaggle'],
    starters: ['ml-workbook']
  },
  'design-cad': {
    title: 'Design and CAD Path',
    summary: 'Use design thinking and simple CAD tools to build creative ideas and prototypes with confidence.',
    tools: ['figma', 'fusion-360', 'canva'],
    starters: ['website-bundle']
  },
  'build-app': {
    title: 'App Building Path',
    summary: 'Start with simple app ideas, product thinking, and the tools that help you build a first version.',
    tools: ['vscode', 'figma', 'python'],
    starters: ['coding-basics-kit']
  },
  'no-code': {
    title: 'No-Code Starter',
    summary: 'Use easy tools to build workflows and small digital systems without needing to write code.',
    tools: ['notion-ai', 'zapier', 'make'],
    starters: ['automation-kit']
  },
  'ai-productivity': {
    title: 'AI Productivity Path',
    summary: 'Learn how AI can support writing, planning, research, and daily work in a practical way.',
    tools: ['chatgpt', 'perplexity', 'notion-ai'],
    starters: ['productivity-boost', 'ai-prompt-pack']
  }
};

function renderGoalCards() {
  const grid = document.querySelector('#goal-grid');
  if (!grid) return;

  grid.innerHTML = goalData.map((goal) => `
    <article class="goal-card">
      <span class="goal-badge">${goal.badge}</span>
      <h3>${goal.name}</h3>
      <p>${goal.description}</p>
      <div class="card-cta">
        <a class="btn btn-secondary" href="./onboarding.html?goal=${goal.id}">Start here</a>
      </div>
    </article>
  `).join('');
}

function renderFeatureList() {
  const list = document.querySelector('#home-feature-list');
  if (!list) return;

  const top = [
    { title: 'Find your direction', text: 'Choose a goal and get a clear path instead of guessing which tool to use.' },
    { title: 'Learn with confidence', text: 'Follow beginner-friendly steps that turn confusion into simple, practical actions.' },
    { title: 'Build with support', text: 'Use starter packs, prompts, and workflow ideas to take action quickly.' }
  ];

  list.innerHTML = top.map((item) => `
    <article class="feature-card">
      <h3>${item.title}</h3>
      <p>${item.text}</p>
    </article>
  `).join('');
}

function renderPathCards() {
  const grid = document.querySelector('#path-grid');
  if (!grid) return;

  grid.innerHTML = pathData.map((path) => `
    <article class="path-card">
      <div class="card-row">
        <span class="path-badge">${path.badge}</span>
        <span class="skill-chip">${path.level}</span>
      </div>
      <h3>${path.title}</h3>
      <p>${path.description}</p>
      <div class="card-cta">
        <a class="btn btn-secondary" href="./onboarding.html?goal=${path.id}">View path</a>
      </div>
    </article>
  `).join('');
}

function renderToolCards() {
  const grid = document.querySelector('#tool-grid');
  const directory = document.querySelector('#tools-directory');

  const featured = toolData.slice(0, 6);
  if (grid) {
    grid.innerHTML = featured.map((tool) => `
      <article class="tool-card">
        <div class="tool-meta">
          <span class="tool-tag">${tool.badge}</span>
          <span class="skill-chip">${tool.skill}</span>
        </div>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="./tools.html">Learn more</a>
        </div>
      </article>
    `).join('');
  }

  if (directory) {
    directory.innerHTML = toolData.map((tool) => `
      <article class="tool-card">
        <div class="tool-meta">
          <span class="tool-tag">${tool.badge}</span>
          <span class="skill-chip">${tool.skill}</span>
        </div>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="./onboarding.html?goal=${tool.id}">Explore</a>
        </div>
      </article>
    `).join('');
  }
}

function renderStarterPacks() {
  const grid = document.querySelector('#starter-grid');
  const directory = document.querySelector('#starter-directory');

  const featured = starterPacks.slice(0, 4);
  if (grid) {
    grid.innerHTML = featured.map((pack) => `
      <article class="starter-card">
        <div class="tool-meta">
          <span class="tool-tag">Starter</span>
          <span class="skill-chip">${pack.level}</span>
        </div>
        <h3>${pack.title}</h3>
        <p>${pack.description}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="./starter-packs.html">Open pack</a>
        </div>
      </article>
    `).join('');
  }

  if (directory) {
    directory.innerHTML = starterPacks.map((pack) => `
      <article class="starter-card">
        <div class="tool-meta">
          <span class="tool-tag">Starter</span>
          <span class="skill-chip">${pack.level}</span>
        </div>
        <h3>${pack.title}</h3>
        <p>${pack.description}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="./starter-packs.html">Open pack</a>
        </div>
      </article>
    `).join('');
  }
}

function renderPathDirectory() {
  const directory = document.querySelector('#paths-directory');
  if (!directory) return;

  directory.innerHTML = pathData.map((path) => `
    <article class="path-card">
      <div class="card-row">
        <span class="path-badge">${path.badge}</span>
        <span class="skill-chip">${path.level}</span>
      </div>
      <h3>${path.title}</h3>
      <p>${path.description}</p>
      <div class="card-cta">
        <a class="btn btn-secondary" href="./onboarding.html?goal=${path.id}">Take this path</a>
      </div>
    </article>
  `).join('');
}

function renderRecommendation() {
  const summary = document.querySelector('#result-summary');
  const toolsContainer = document.querySelector('#result-tools');
  const startersContainer = document.querySelector('#result-starters');
  const titleNode = document.querySelector('#results-title');

  if (!summary && !toolsContainer && !startersContainer) return;

  const params = new URLSearchParams(window.location.search);
  const goalKey = params.get('goal') || 'learn-ai';
  const selected = recommendationMap[goalKey] || recommendationMap['learn-ai'];

  if (titleNode) titleNode.textContent = selected.title;

  if (summary) {
    summary.innerHTML = `
      <article class="result-card">
        <h3>Recommended next step</h3>
        <p>${selected.summary}</p>
      </article>
    `;
  }

  const toolHtml = selected.tools.map((toolId) => {
    const tool = toolData.find((entry) => entry.id === toolId);
    if (!tool) return '';

    return `
      <article class="result-card">
        <div class="tool-meta">
          <span class="tool-tag">${tool.badge}</span>
          <span class="skill-chip">${tool.skill}</span>
        </div>
        <h3>${tool.name}</h3>
        <p>${tool.description}</p>
      </article>
    `;
  }).join('');

  const packHtml = selected.starters.map((packId) => {
    const pack = starterPacks.find((entry) => entry.id === packId);
    if (!pack) return '';

    return `
      <article class="result-card">
        <h3>${pack.title}</h3>
        <p>${pack.description}</p>
      </article>
    `;
  }).join('');

  if (toolsContainer) toolsContainer.innerHTML = toolHtml;
  if (startersContainer) startersContainer.innerHTML = packHtml;
}

function handleOnboardingSubmit() {
  const form = document.querySelector('#onboarding-form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const goal = formData.get('goal') || 'learn-ai';
    window.location.href = `./results.html?goal=${goal}`;
  });
}

function initPage() {
  renderGoalCards();
  renderFeatureList();
  renderPathCards();
  renderToolCards();
  renderStarterPacks();
  renderPathDirectory();
  renderRecommendation();
  handleOnboardingSubmit();

  const form = document.querySelector('.newsletter-form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const button = form.querySelector('button');
      const input = form.querySelector('input');
      if (button) button.textContent = 'Subscribed';
      if (input) input.value = '';
    });
  }
}

document.addEventListener('DOMContentLoaded', initPage);
