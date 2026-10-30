const content = window.desofecContent || {
  goals: [],
  tools: [],
  paths: [],
  starterPacks: [],
  recommendationMap: {}
};

const { goals, tools, paths, starterPacks, recommendationMap } = content;

function renderGoalCards() {
  const grid = document.querySelector('#goal-grid');
  if (!grid || !goals.length) return;

  grid.innerHTML = goals.map((goal) => `
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
  if (!grid || !paths.length) return;

  grid.innerHTML = paths.map((path) => `
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

  const featured = tools.slice(0, 6);
  if (grid && featured.length) {
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

  if (directory && tools.length) {
    directory.innerHTML = tools.map((tool) => `
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
  if (grid && featured.length) {
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

  if (directory && starterPacks.length) {
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
  if (!directory || !paths.length) return;

  directory.innerHTML = paths.map((path) => `
    <article class="path-card">
      <div class="card-row">
        <span class="path-badge">${path.badge}</span>
        <span class="skill-chip">${path.level}</span>
      </div>
      <h3>${path.title}</h3>
      <p>${path.description}</p>
      <ul class="mini-checklist">
        ${path.steps.map((step) => `<li>${step}</li>`).join('')}
      </ul>
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
        <ul class="mini-checklist">
          ${selected.steps.map((step) => `<li>${step}</li>`).join('')}
        </ul>
      </article>
    `;
  }

  const toolHtml = (selected.tools || []).map((toolId) => {
    const tool = tools.find((entry) => entry.id === toolId);
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

  const packHtml = (selected.starters || []).map((packId) => {
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
