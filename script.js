let goals = [];
let tools = [];
let paths = [];
let starterPacks = [];
let recommendationMap = {};

async function loadContent() {
  const files = {
    goals: './data/goals.json',
    tools: './data/tools.json',
    paths: './data/paths.json',
    starterPacks: './data/starter-packs.json',
    recommendationMap: './data/recommendations.json'
  };
  const entries = await Promise.all(Object.entries(files).map(async ([key, path]) => {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Could not load ${path} (${response.status}).`);
    }
    return [key, await response.json()];
  }));
  const content = Object.fromEntries(entries);

  if (!Array.isArray(content.goals) || !Array.isArray(content.tools) ||
      !Array.isArray(content.paths) || !Array.isArray(content.starterPacks) ||
      !content.recommendationMap || typeof content.recommendationMap !== 'object') {
    throw new Error('The product data files have an unexpected format.');
  }

  ({ goals, tools, paths, starterPacks, recommendationMap } = content);
}

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
}

function showContentLoadError(error) {
  console.error('Unable to load Desofec AI Studio content.', error);
  const message = document.createElement('p');
  message.className = 'content-error';
  message.setAttribute('role', 'alert');
  message.textContent = 'We could not load the studio content. Please refresh the page, or try again later.';
  document.querySelector('main')?.prepend(message);
}

function renderGoalCards() {
  const grid = document.querySelector('#goal-grid');
  if (!grid || !goals.length) return;

  grid.innerHTML = goals.map((goal) => `
    <article class="goal-card">
      <span class="goal-badge">${escapeHTML(goal.badge)}</span>
      <h3>${escapeHTML(goal.name)}</h3>
      <p>${escapeHTML(goal.description)}</p>
      <div class="card-cta">
        <a class="btn btn-secondary" href="./onboarding.html?goal=${encodeURIComponent(goal.id)}">Start here</a>
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

function renderGoalOptions() {
  const select = document.querySelector('#goal');
  if (!select) return;

  const requestedGoal = new URLSearchParams(window.location.search).get('goal');
  select.innerHTML = goals.map((goal) => `
    <option value="${escapeHTML(goal.id)}">${escapeHTML(goal.name)}</option>
  `).join('');

  if (goals.some((goal) => goal.id === requestedGoal)) {
    select.value = requestedGoal;
  }
}

function renderPathCards() {
  const grid = document.querySelector('#path-grid');
  if (!grid || !paths.length) return;

  grid.innerHTML = paths.map((path) => `
    <article class="path-card">
      <div class="card-row">
        <span class="path-badge">${escapeHTML(path.badge)}</span>
        <span class="skill-chip">${escapeHTML(path.level)}</span>
      </div>
      <h3>${escapeHTML(path.title)}</h3>
      <p>${escapeHTML(path.description)}</p>
      <div class="card-cta">
        <a class="btn btn-secondary" href="./results.html?goal=${encodeURIComponent(path.goal)}">View path</a>
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
          <span class="tool-tag">${escapeHTML(tool.badge)}</span>
          <span class="skill-chip">${escapeHTML(tool.skill)}</span>
        </div>
        <h3>${escapeHTML(tool.name)}</h3>
        <p>${escapeHTML(tool.description)}</p>
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
          <span class="tool-tag">${escapeHTML(tool.badge)}</span>
          <span class="skill-chip">${escapeHTML(tool.skill)}</span>
        </div>
        <h3>${escapeHTML(tool.name)}</h3>
        <p>${escapeHTML(tool.description)}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="./onboarding.html">Find my path</a>
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
          <span class="skill-chip">${escapeHTML(pack.level)}</span>
        </div>
        <h3>${escapeHTML(pack.title)}</h3>
        <p>${escapeHTML(pack.description)}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="${escapeHTML(encodeURI(pack.file))}" download>Download pack</a>
        </div>
      </article>
    `).join('');
  }

  if (directory && starterPacks.length) {
    directory.innerHTML = starterPacks.map((pack) => `
      <article class="starter-card">
        <div class="tool-meta">
          <span class="tool-tag">Starter</span>
          <span class="skill-chip">${escapeHTML(pack.level)}</span>
        </div>
        <h3>${escapeHTML(pack.title)}</h3>
        <p>${escapeHTML(pack.description)}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="${escapeHTML(encodeURI(pack.file))}" download>Download pack</a>
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
        <span class="path-badge">${escapeHTML(path.badge)}</span>
        <span class="skill-chip">${escapeHTML(path.level)}</span>
      </div>
      <h3>${escapeHTML(path.title)}</h3>
      <p>${escapeHTML(path.description)}</p>
      <ul class="mini-checklist">
        ${path.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}
      </ul>
      <div class="card-cta">
        <a class="btn btn-secondary" href="./path-detail.html?path=${encodeURIComponent(path.id)}">View path</a>
      </div>
    </article>
  `).join('');
}

function renderPathDetail() {
  const detail = document.querySelector('#path-detail');
  if (!detail) return;

  const pathId = new URLSearchParams(window.location.search).get('path');
  const path = paths.find((entry) => entry.id === pathId);
  const notFound = document.querySelector('#path-not-found');
  if (!path) {
    if (notFound) notFound.hidden = false;
    return;
  }

  detail.hidden = false;
  const title = document.querySelector('#path-detail-title');
  const description = document.querySelector('#path-detail-description');
  const meta = document.querySelector('#path-detail-meta');
  const steps = document.querySelector('#path-detail-steps');
  const startLink = document.querySelector('#path-start-link');

  document.title = `${path.title} | Desofec AI Studio`;
  document.querySelector('meta[name="description"]')?.setAttribute('content', path.description);
  if (title) title.textContent = path.title;
  if (description) description.textContent = path.description;
  if (meta) {
    meta.innerHTML = `
      <span class="path-badge">${escapeHTML(path.badge)}</span>
      <span class="skill-chip">${escapeHTML(path.level)}</span>
    `;
  }
  if (steps) {
    steps.innerHTML = path.steps.map((step, index) => `
      <article class="result-card">
        <h3>Step ${index + 1}</h3>
        <p>${escapeHTML(step)}</p>
      </article>
    `).join('');
  }
  if (startLink) {
    startLink.href = `./results.html?goal=${encodeURIComponent(path.goal)}`;
  }

  const recommendation = recommendationMap[path.goal];
  if (!recommendation) return;

  const recommendedTools = (recommendation.tools || [])
    .map((toolId) => tools.find((tool) => tool.id === toolId))
    .filter(Boolean);
  const toolsContainer = document.querySelector('#path-detail-tools');
  const toolsSection = document.querySelector('#path-tools-section');
  if (toolsContainer && recommendedTools.length) {
    toolsContainer.innerHTML = recommendedTools.map((tool) => `
      <article class="result-card">
        <div class="tool-meta">
          <span class="tool-tag">${escapeHTML(tool.badge)}</span>
          <span class="skill-chip">${escapeHTML(tool.skill)}</span>
        </div>
        <h3>${escapeHTML(tool.name)}</h3>
        <p>${escapeHTML(tool.description)}</p>
      </article>
    `).join('');
    if (toolsSection) toolsSection.hidden = false;
  }

  const recommendedPacks = (recommendation.starters || [])
    .map((packId) => starterPacks.find((pack) => pack.id === packId))
    .filter(Boolean);
  const startersContainer = document.querySelector('#path-detail-starters');
  const startersSection = document.querySelector('#path-starters-section');
  if (startersContainer && recommendedPacks.length) {
    startersContainer.innerHTML = recommendedPacks.map((pack) => `
      <article class="result-card">
        <h3>${escapeHTML(pack.title)}</h3>
        <p>${escapeHTML(pack.description)}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="${escapeHTML(encodeURI(pack.file))}" download>Download pack</a>
        </div>
      </article>
    `).join('');
    if (startersSection) startersSection.hidden = false;
  }
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
        <p>${escapeHTML(selected.summary)}</p>
        <ul class="mini-checklist">
          ${selected.steps.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}
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
          <span class="tool-tag">${escapeHTML(tool.badge)}</span>
          <span class="skill-chip">${escapeHTML(tool.skill)}</span>
        </div>
        <h3>${escapeHTML(tool.name)}</h3>
        <p>${escapeHTML(tool.description)}</p>
      </article>
    `;
  }).join('');

  const packHtml = (selected.starters || []).map((packId) => {
    const pack = starterPacks.find((entry) => entry.id === packId);
    if (!pack) return '';

    return `
      <article class="result-card">
        <h3>${escapeHTML(pack.title)}</h3>
        <p>${escapeHTML(pack.description)}</p>
        <div class="card-cta">
          <a class="btn btn-secondary" href="${escapeHTML(encodeURI(pack.file))}" download>Download pack</a>
        </div>
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
    window.location.href = `./results.html?goal=${encodeURIComponent(goal)}`;
  });
}

function renderStats() {
  const counts = { goals: goals.length, tools: tools.length };
  document.querySelectorAll('[data-stat]').forEach((el) => {
    if (el.dataset.stat in counts) el.textContent = counts[el.dataset.stat];
  });
}

function markActiveNav() {
  const sections = {
    home: 'index.html',
    onboarding: 'onboarding.html',
    results: 'onboarding.html',
    tools: 'tools.html',
    paths: 'paths.html',
    'path-detail': 'paths.html',
    'starter-packs': 'starter-packs.html'
  };
  const target = sections[document.body.dataset.page];
  document.querySelectorAll('.main-nav a').forEach((link) => {
    if (link.getAttribute('href') === `./${target}`) link.setAttribute('aria-current', 'page');
  });
}

function initPage() {
  markActiveNav();
  renderStats();
  renderGoalCards();
  renderGoalOptions();
  renderFeatureList();
  renderPathCards();
  renderToolCards();
  renderStarterPacks();
  renderPathDirectory();
  renderPathDetail();
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

loadContent().then(initPage).catch(showContentLoadError);
