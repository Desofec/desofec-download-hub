'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'desofec:first-app:tasks';
const CHANGE_EVENT = 'desofec-first-app-change';
const MAX_TASKS = 100;
const MAX_TITLE_LENGTH = 120;

type Task = { id: string; title: string; done: boolean };

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function getSnapshot() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? '[]';
  } catch {
    return '[]';
  }
}

function parseTasks(snapshot: string): Task[] {
  try {
    const saved: unknown = JSON.parse(snapshot);
    if (!Array.isArray(saved)) return [];
    return saved
      .filter(
        (task): task is Task =>
          typeof task === 'object' &&
          task !== null &&
          typeof task.id === 'string' &&
          typeof task.title === 'string' &&
          typeof task.done === 'boolean'
      )
      .slice(0, MAX_TASKS);
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function FirstAppLab() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => '[]');
  const [notice, setNotice] = useState('');
  const tasks = parseTasks(snapshot);
  const remaining = tasks.filter((task) => !task.done).length;

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem('task');
    if (!(input instanceof HTMLInputElement)) return;

    const title = input.value.trim();
    if (!title) {
      input.setCustomValidity('Enter a task before adding it.');
      input.reportValidity();
      input.setCustomValidity('');
      return;
    }

    if (title.length > MAX_TITLE_LENGTH || tasks.length >= MAX_TASKS) return;

    const next = [...tasks, { id: crypto.randomUUID(), title, done: false }];
    if (!saveTasks(next)) {
      setNotice('Your browser could not save this task. Check the browser storage settings and try again.');
      return;
    }
    setNotice('');
    form.reset();
    input.focus();
  }, [tasks]);

  const updateTask = useCallback((id: string, update: Partial<Pick<Task, 'done'>>) => {
    setNotice(
      saveTasks(tasks.map((task) => task.id === id ? { ...task, ...update } : task))
        ? ''
        : 'Your browser could not save this change. Check the browser storage settings and try again.'
    );
  }, [tasks]);

  const removeTask = useCallback((id: string) => {
    setNotice(
      saveTasks(tasks.filter((task) => task.id !== id))
        ? ''
        : 'Your browser could not save this change. Check the browser storage settings and try again.'
    );
  }, [tasks]);

  return (
    <section className="first-app-lab" aria-labelledby="task-tracker-title">
      <div className="first-app-lab-header">
        <div>
          <span className="eyebrow">Your first app</span>
          <h2 id="task-tracker-title">Tiny Task Tracker</h2>
        </div>
        <span className="first-app-count" aria-live="polite">
          {remaining} left
        </span>
      </div>
      <form className="first-app-task-form" onSubmit={handleSubmit}>
        <label htmlFor="first-app-task">What do you need to do?</label>
        <div className="first-app-task-input">
          <input
            id="first-app-task"
            name="task"
            type="text"
            maxLength={MAX_TITLE_LENGTH}
            placeholder="e.g. Sketch my app idea"
            aria-describedby="first-app-task-hint"
            required
          />
          <button className="btn btn-primary" type="submit" disabled={tasks.length >= MAX_TASKS}>
            Add task
          </button>
        </div>
        <p id="first-app-task-hint" className="first-app-hint">
          Keep it small—up to {MAX_TITLE_LENGTH} characters.
        </p>
      </form>

      {tasks.length === 0 ? (
        <p className="first-app-empty">Your list is empty. Add one small task to try the app.</p>
      ) : (
        <ul className="first-app-task-list" aria-label="Your tasks">
          {tasks.map((task) => (
            <li className={task.done ? 'is-complete' : undefined} key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => updateTask(task.id, { done: !task.done })}
                />
                <span>{task.title}</span>
              </label>
              <button
                type="button"
                className="first-app-remove"
                aria-label={`Remove ${task.title}`}
                onClick={() => removeTask(task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {tasks.length >= MAX_TASKS && <p className="first-app-hint">This demo is limited to {MAX_TASKS} tasks.</p>}
      {notice && <p className="first-app-hint" role="status">{notice}</p>}
      <p className="first-app-storage-note">Saved on this device in this browser.</p>
    </section>
  );
}
