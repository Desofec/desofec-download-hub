export type TutorialStep = {
  id: string;
  title: string;
  explanation: string[];
  file?: string;
  code?: string;
  check: string;
  aiPrompt: string;
};

const htmlCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Task Tracker</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main>
    <h1>My Task Tracker</h1>
    <form id="task-form">
      <input id="task-input" type="text" placeholder="What do you need to do?" maxlength="120">
      <button type="submit">Add task</button>
    </form>
    <ul id="task-list"></ul>
  </main>
  <script src="script.js"></script>
</body>
</html>`;

const cssCode = `body {
  font-family: Arial, sans-serif;
  background: #f4f6fb;
  margin: 0;
}

main {
  max-width: 480px;
  margin: 40px auto;
  padding: 24px;
  background: white;
  border-radius: 12px;
}

form {
  display: flex;
  gap: 8px;
}

input[type="text"] {
  flex: 1;
  padding: 8px;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

li span {
  flex: 1;
}

.done {
  text-decoration: line-through;
  color: #6b7280;
}`;

const addTasksCode = `const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');

let tasks = [];

function render() {
  list.innerHTML = '';
  tasks.forEach(function (task) {
    const item = document.createElement('li');
    item.textContent = task.title;
    list.appendChild(item);
  });
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const title = input.value.trim();
  if (title === '') return;
  tasks.push({ id: Date.now(), title: title, done: false });
  input.value = '';
  render();
});`;

const completeRemoveCode = `const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');

let tasks = [];

function render() {
  list.innerHTML = '';
  tasks.forEach(function (task) {
    const item = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', function () {
      task.done = checkbox.checked;
      render();
    });

    const label = document.createElement('span');
    label.textContent = task.title;
    if (task.done) label.className = 'done';

    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.addEventListener('click', function () {
      tasks = tasks.filter(function (other) {
        return other.id !== task.id;
      });
      render();
    });

    item.append(checkbox, label, remove);
    list.appendChild(item);
  });
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const title = input.value.trim();
  if (title === '') return;
  tasks.push({ id: Date.now(), title: title, done: false });
  input.value = '';
  render();
});`;

const saveCode = `const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
  list.innerHTML = '';
  tasks.forEach(function (task) {
    const item = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', function () {
      task.done = checkbox.checked;
      save();
      render();
    });

    const label = document.createElement('span');
    label.textContent = task.title;
    if (task.done) label.className = 'done';

    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.addEventListener('click', function () {
      tasks = tasks.filter(function (other) {
        return other.id !== task.id;
      });
      save();
      render();
    });

    item.append(checkbox, label, remove);
    list.appendChild(item);
  });
}

form.addEventListener('submit', function (event) {
  event.preventDefault();
  const title = input.value.trim();
  if (title === '') return;
  tasks.push({ id: Date.now(), title: title, done: false });
  input.value = '';
  save();
  render();
});

render();`;

export const taskTrackerSteps: TutorialStep[] = [
  {
    id: 'create-project',
    title: 'Create your project',
    explanation: [
      'You will build this app with three files: one for the page (HTML), one for the look (CSS), and one for the behavior (JavaScript). Replit runs them in your browser, so there is nothing to install.',
      'Create a free account at replit.com, start a new project, and choose the HTML, CSS, JS template. You should see three files named index.html, style.css and script.js.'
    ],
    check: 'You can see index.html, style.css and script.js in the file list, and a preview panel.',
    aiPrompt:
      'I am a beginner. Explain what HTML, CSS and JavaScript each do in a web page, using a task list as the example. Keep it short.'
  },
  {
    id: 'page-structure',
    title: 'Add the page structure',
    explanation: [
      'HTML describes what is on the page. This page has a heading, a form with a text box and a button, and an empty list where tasks will appear.',
      'The ids (like task-input) are name tags. Later, your JavaScript uses them to find these elements.'
    ],
    file: 'index.html',
    code: htmlCode,
    check: 'The preview shows a heading, a text box and an Add task button. Nothing happens yet when you click it, and that is expected.',
    aiPrompt: 'Explain this index.html line by line like I am a beginner. Do not change it.'
  },
  {
    id: 'style',
    title: 'Make it look good',
    explanation: [
      'CSS controls colors, spacing and layout. Each block starts with a selector, such as main or li, that says which elements to style, followed by the rules inside curly braces.',
      'The .done rule is not used yet. In a later step, completed tasks will get that class so they appear crossed out.'
    ],
    file: 'style.css',
    code: cssCode,
    check: 'The page now has a light background and a white card centered on it.',
    aiPrompt: 'Explain what the "main" and "li" rules in this CSS do. Then suggest one small change I can try, such as a new color.'
  },
  {
    id: 'add-tasks',
    title: 'Add tasks',
    explanation: [
      'Now the app starts to think. The tasks variable holds your data: a list of tasks. The render function redraws the list on screen from that data.',
      'When you submit the form, the code reads the text box, ignores empty text, adds a new task to the list, and calls render. Notice it uses textContent, not innerHTML, to show your text. That keeps unexpected characters from being treated as code.'
    ],
    file: 'script.js',
    code: addTasksCode,
    check: 'Type a task and press Add task. It appears in the list and the text box clears. Submitting an empty box does nothing.',
    aiPrompt: 'Explain how the render function and the submit handler work together in this script.js. Use a simple analogy.'
  },
  {
    id: 'complete-remove',
    title: 'Complete and remove tasks',
    explanation: [
      'Each task now gets a checkbox and a Remove button. The checkbox flips the task\u2019s done value. Remove keeps every task except the one you clicked.',
      'This code replaces everything in script.js. The only new part is inside render, where the checkbox and remove button are created.'
    ],
    file: 'script.js',
    code: completeRemoveCode,
    check: 'Tick a task and it is crossed out. Untick it and it returns to normal. Remove deletes only that task.',
    aiPrompt: 'Explain how the Remove button deletes only one task, using the filter function in this code.'
  },
  {
    id: 'save-tasks',
    title: 'Save your tasks',
    explanation: [
      'Right now your tasks vanish when you reload. The browser has a small storage area called localStorage that can keep text between visits.',
      'The save function turns your task list into text (JSON) and stores it. At startup, the code reads it back. The final render() call at the bottom draws any saved tasks.'
    ],
    file: 'script.js',
    code: saveCode,
    check: 'Add two tasks, tick one, then reload the preview. Both tasks are still there and the tick is remembered.',
    aiPrompt: 'Explain what JSON.stringify and JSON.parse do in this code, and why we need both.'
  },
  {
    id: 'test-improve',
    title: 'Test it and plan version 2',
    explanation: [
      'Good builders try to break their own apps. Test these cases: an empty task, only spaces, a very long task, many tasks, and a task with symbols like < or &.',
      'Then choose one small improvement for version 2, such as a task counter, a filter for finished tasks, or a due date. Build it alone first. Add the next idea only after it works.'
    ],
    check: 'You tried every case above, fixed anything that broke, and wrote down one improvement for version 2.',
    aiPrompt:
      'Here is my script.js. Suggest 5 test cases that could break it, then help me add a counter showing how many tasks are left. Explain each change.'
  }
];
