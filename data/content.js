window.desofecContent = {
  goals: [
    {
      id: 'learn-ai',
      name: 'Learn AI',
      description: 'Understand AI basics, prompts, and practical workflows that improve everyday work.',
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
      description: 'Use no-code workflows to handle repetitive tasks and save time in your day.',
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
      description: 'Understand the foundations of ML, data patterns, and practical experiments.',
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
      description: 'Learn how AI can help with research, writing, planning, and smarter daily tasks.',
      badge: 'Productivity'
    }
  ],

  tools: [
    { id: 'chatgpt', name: 'ChatGPT', category: 'AI', skill: 'Beginner', description: 'Helpful for prompt writing, brainstorming, research, and learning how AI works in practice.', badge: 'AI' },
    { id: 'claude', name: 'Claude', category: 'AI', skill: 'Beginner', description: 'Good for long-form writing, summarization, and understanding complex ideas more clearly.', badge: 'AI' },
    { id: 'perplexity', name: 'Perplexity', category: 'AI', skill: 'Beginner', description: 'Useful for research, fast answers, and learning across many topics quickly.', badge: 'AI' },
    { id: 'notion-ai', name: 'Notion AI', category: 'AI', skill: 'Beginner', description: 'Great for notes, summaries, planning, and personal productivity work.', badge: 'Productivity' },
    { id: 'vscode', name: 'VS Code', category: 'Coding', skill: 'Beginner', description: 'The most common editor for learning code and building small projects.', badge: 'Code' },
    { id: 'git', name: 'GitHub', category: 'Coding', skill: 'Beginner', description: 'Essential for storing code, tracking progress, and collaborating on projects.', badge: 'Code' },
    { id: 'python', name: 'Python', category: 'Coding', skill: 'Beginner', description: 'A practical language for coding, automation, and data-focused beginner learning.', badge: 'Code' },
    { id: 'figma', name: 'Figma', category: 'Design', skill: 'Beginner', description: 'Great for UI design, mockups, concept exploration, and simple product layout work.', badge: 'Design' },
    { id: 'canva', name: 'Canva', category: 'Design', skill: 'Beginner', description: 'Useful for posters, presentations, simple visuals, and design-learning projects.', badge: 'Design' },
    { id: 'zapier', name: 'Zapier', category: 'Automation', skill: 'Beginner', description: 'Connect apps and automate repetitive tasks without writing code.', badge: 'Automation' },
    { id: 'make', name: 'Make', category: 'Automation', skill: 'Beginner', description: 'A visual builder for connecting tools and simplifying everyday digital workflows.', badge: 'Automation' },
    { id: 'n8n', name: 'n8n', category: 'Automation', skill: 'Intermediate', description: 'A flexible automation platform for more advanced workflows and custom integrations.', badge: 'Automation' },
    { id: 'colab', name: 'Google Colab', category: 'ML', skill: 'Beginner', description: 'An easy environment for notebooks, data analysis, and beginner ML experiments.', badge: 'ML' },
    { id: 'kaggle', name: 'Kaggle', category: 'ML', skill: 'Beginner', description: 'A beginner-friendly place to learn from datasets, notebooks, and real examples.', badge: 'ML' },
    { id: 'fusion-360', name: 'Fusion 360', category: 'Design', skill: 'Intermediate', description: 'Helpful for CAD, product thinking, and 3D modeling for conceptual projects.', badge: 'CAD' }
  ],

  paths: [
    {
      id: 'ai-beginner',
      title: 'AI for Beginners',
      level: 'Beginner',
      description: 'Learn what AI is, how prompts work, and how to use AI in practical day-to-day ways.',
      badge: 'AI',
      steps: ['Learn the core idea of AI', 'Understand prompt writing', 'Use AI in real tasks', 'Build a small workflow']
    },
    {
      id: 'no-code-automation',
      title: 'No-Code Automation',
      level: 'Beginner',
      description: 'Explore practical automation ideas that save time and reduce repetitive work.',
      badge: 'Automation',
      steps: ['Understand workflows', 'Connect simple tools', 'Automate a task', 'Review results and improve']
    },
    {
      id: 'web-starter',
      title: 'Website Starter',
      level: 'Beginner',
      description: 'Learn the fundamentals of web structure, publishing, and creating a simple online project.',
      badge: 'Web',
      steps: ['Learn web basics', 'Design the layout', 'Build a simple page', 'Publish and share']
    },
    {
      id: 'coding-foundations',
      title: 'Coding Foundations',
      level: 'Beginner',
      description: 'Set up your environment, learn core concepts, and build tiny projects with confidence.',
      badge: 'Code',
      steps: ['Learn setup and tools', 'Understand basic logic', 'Build small scripts', 'Practice real examples']
    },
    {
      id: 'ml-foundations',
      title: 'ML Foundations',
      level: 'Beginner',
      description: 'Understand the key ideas behind ML, data patterns, and small practical experiments.',
      badge: 'ML',
      steps: ['Learn the basics of ML', 'Understand data and patterns', 'Try a notebook', 'Practice with examples']
    },
    {
      id: 'ai-productivity',
      title: 'AI Productivity Path',
      level: 'Beginner',
      description: 'Use AI to improve writing, planning, research, and everyday productivity tasks.',
      badge: 'Productivity',
      steps: ['Identify useful tasks', 'Define a prompt system', 'Apply AI routines', 'Review and optimize']
    }
  ],

  starterPacks: [
    { id: 'ai-prompt-pack', title: 'Beginner AI Starter Pack', description: 'Helpful prompts, examples, and quick AI workflow ideas for getting started fast.', level: 'Beginner' },
    { id: 'automation-kit', title: 'No-Code Automation Kit', description: 'Workflow templates and practical steps for saving time and reducing repetitive work.', level: 'Beginner' },
    { id: 'website-bundle', title: 'Website Starter Bundle', description: 'A practical toolkit for building and publishing a small online project.', level: 'Beginner' },
    { id: 'coding-basics-kit', title: 'Coding Basics Kit', description: 'A starter set of learning tasks, concepts, and mini-project ideas.', level: 'Beginner' },
    { id: 'ml-workbook', title: 'ML Foundations Workbook', description: 'A beginner-friendly workbook for ML concepts, data thinking, and small experiments.', level: 'Beginner' },
    { id: 'productivity-boost', title: 'AI Productivity Boost', description: 'Use AI to simplify writing, planning, research, and daily task management.', level: 'Beginner' }
  ],

  recommendationMap: {
    'learn-ai': {
      title: 'AI for Beginners',
      summary: 'Start with AI basics, prompt writing, and simple real-world workflows before moving into deeper tool usage.',
      tools: ['chatgpt', 'perplexity', 'notion-ai'],
      starters: ['ai-prompt-pack', 'productivity-boost'],
      steps: ['Understand AI basics', 'Learn prompt writing', 'Use AI in daily tasks', 'Build a small practical project']
    },
    'build-website': {
      title: 'Website Builder Path',
      summary: 'Learn the essential steps for designing, creating, and publishing a simple website without feeling lost.',
      tools: ['figma', 'vscode', 'git'],
      starters: ['website-bundle'],
      steps: ['Learn structure and design', 'Create a simple layout', 'Publish your first page', 'Refine and share']
    },
    'automate-work': {
      title: 'Automation Starter',
      summary: 'Use beginner-friendly tools to reduce repetitive tasks and improve the way you work.',
      tools: ['zapier', 'make', 'notion-ai'],
      starters: ['automation-kit'],
      steps: ['Identify a repetitive task', 'Choose a workflow tool', 'Connect two or three tools', 'Test and adjust']
    },
    'learn-coding': {
      title: 'Coding Foundations',
      summary: 'Learn the basics of coding and use small projects to build confidence before deeper learning.',
      tools: ['python', 'vscode', 'git'],
      starters: ['coding-basics-kit'],
      steps: ['Set up your workspace', 'Learn basic logic', 'Build a simple script', 'Practice with mini projects']
    },
    'learn-ml': {
      title: 'Machine Learning Foundations',
      summary: 'Understand the big ideas behind ML, data patterns, and beginner-friendly experiments.',
      tools: ['python', 'colab', 'kaggle'],
      starters: ['ml-workbook'],
      steps: ['Learn key ML concepts', 'Work with data', 'Try a notebook', 'Practice and review']
    },
    'design-cad': {
      title: 'Design and CAD Path',
      summary: 'Use design thinking and simple CAD tools to build creative ideas and prototypes with confidence.',
      tools: ['figma', 'fusion-360', 'canva'],
      starters: ['website-bundle'],
      steps: ['Learn design basics', 'Explore a tool', 'Create simple concepts', 'Refine and share']
    },
    'build-app': {
      title: 'App Building Path',
      summary: 'Start with simple app ideas, product thinking, and the tools that help you build a first version.',
      tools: ['vscode', 'figma', 'python'],
      starters: ['coding-basics-kit'],
      steps: ['Define the idea', 'Sketch the user flow', 'Create a prototype', 'Test and improve']
    },
    'no-code': {
      title: 'No-Code Starter',
      summary: 'Use easy tools to build workflows and small systems without needing to write code.',
      tools: ['notion-ai', 'zapier', 'make'],
      starters: ['automation-kit'],
      steps: ['Choose a simple problem', 'Map the flow', 'Build the workflow', 'Review and improve']
    },
    'ai-productivity': {
      title: 'AI Productivity Path',
      summary: 'Learn how AI can support writing, planning, research, and daily work in a practical way.',
      tools: ['chatgpt', 'perplexity', 'notion-ai'],
      starters: ['productivity-boost', 'ai-prompt-pack'],
      steps: ['Identify daily repetitive tasks', 'Create reusable prompts', 'Apply AI to real work', 'Review and improve results']
    }
  }
};

if (typeof window !== 'undefined') {
  window.desofecData = window.desofecContent;
}
