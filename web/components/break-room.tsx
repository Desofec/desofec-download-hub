'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BubblePop } from '@/components/bubble-pop';
import { DoodlePad } from '@/components/doodle-pad';
import { MemoryGame } from '@/components/memory-game';
import { MindMap } from '@/components/mind-map';
import { useTr } from '@/components/tr';
import { closeMusic, MUSIC_OPENED_EVENT, openMusic } from '@/lib/break-window';
import { createBreathSound, type BreathSound } from '@/lib/breath-sound';
import { breakMinuteOptions, saveBreakSettings, useBreakSettings, type BreakMinutes } from '@/lib/break-settings';

const PHASES = ['Breathe in', 'Hold', 'Breathe out', 'Hold'] as const;
const STRETCHES = [
  'Stand up and roll your shoulders back 10 times.',
  'Look at something far away for 20 seconds to rest your eyes.',
  'Gently tilt your head to each side and hold for 15 seconds.',
  'Stretch your wrists and fingers.',
  'Drink a glass of water.'
];
const PLAYLISTS = [
  { label: 'Lo-fi study beats', href: 'https://www.youtube.com/results?search_query=lofi+study+music' },
  { label: 'Calm piano', href: 'https://www.youtube.com/results?search_query=calm+piano+music' },
  { label: 'Nature sounds', href: 'https://www.youtube.com/results?search_query=nature+sounds+relaxing' },
  { label: 'Focus playlists on Spotify', href: 'https://open.spotify.com/search/focus' }
];
const BREAK_SECONDS = 5 * 60;

function Settings() {
  const tr = useTr();
  const settings = useBreakSettings();

  return (
    <div className="break-card">
      <h2>{tr('Break reminders')}</h2>
      <p>{tr('The timer runs only in this browser and counts time you are active on the site.')}</p>
      <label className="break-check">
        <input
          type="checkbox"
          checked={settings.enabled}
          onChange={(event) => saveBreakSettings({ ...settings, enabled: event.target.checked })}
        />
        {tr('Remind me to take a break')}
      </label>
      <label htmlFor="break-minutes">{tr('Remind me after')}</label>
      <select
        id="break-minutes"
        className="theme-select"
        value={settings.minutes}
        disabled={!settings.enabled}
        onChange={(event) => saveBreakSettings({ ...settings, minutes: Number(event.target.value) as BreakMinutes })}
      >
        {breakMinuteOptions.map((option) => (
          <option key={option} value={option}>{tr('{minutes} minutes', { minutes: option })}</option>
        ))}
      </select>
    </div>
  );
}

function BreakCountdown() {
  const tr = useTr();
  const [left, setLeft] = useState<number | null>(null);
  const running = left !== null && left > 0;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setLeft((value) => (value === null ? null : Math.max(0, value - 1))), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  useEffect(() => {
    if (left === 0) closeMusic();
  }, [left]);

  // Opening music starts the break clock if it is not already running.
  useEffect(() => {
    const start = () => setLeft((value) => (value === null || value === 0 ? BREAK_SECONDS : value));
    window.addEventListener(MUSIC_OPENED_EVENT, start);
    return () => window.removeEventListener(MUSIC_OPENED_EVENT, start);
  }, []);

  const minutes = Math.floor((left ?? BREAK_SECONDS) / 60);
  const seconds = String((left ?? BREAK_SECONDS) % 60).padStart(2, '0');

  return (
    <div className="break-card">
      <h2>{tr('5-minute break timer')}</h2>
      <p className="break-time" aria-live="off">{minutes}:{seconds}</p>
      {left === 0 && (
        <p role="status">
          {tr('Break over. Ready to go back to your project?')}{' '}
          {tr('If a music tab is still open, close it to come back here.')}{' '}
          <Link href="/my-progress">{tr('Back to my progress')}</Link>
        </p>
      )}
      <button className="btn btn-primary" type="button" onClick={() => setLeft(BREAK_SECONDS)}>
        {running ? tr('Restart') : tr('Start break')}
      </button>
    </div>
  );
}

function Breathing() {
  const tr = useTr();
  const [phase, setPhase] = useState<number | null>(null);
  const [sound, setSound] = useState(true);
  const timer = useRef<number | undefined>(undefined);
  const audio = useRef<BreathSound | null>(null);

  function stopAudio() {
    audio.current?.close();
    audio.current = null;
  }

  useEffect(
    () => () => {
      window.clearInterval(timer.current);
      audio.current?.close();
    },
    []
  );

  function toggle() {
    window.clearInterval(timer.current);
    if (phase !== null) {
      stopAudio();
      setPhase(null);
      return;
    }
    if (sound) {
      audio.current = createBreathSound();
      audio.current?.play(0);
    }
    setPhase(0);
    let current = 0;
    timer.current = window.setInterval(() => {
      current = (current + 1) % PHASES.length;
      audio.current?.play(current);
      setPhase(current);
    }, 4000);
  }

  function changeSound(on: boolean) {
    setSound(on);
    if (!on) stopAudio();
  }

  return (
    <div className="break-card">
      <h2>{tr('Box breathing')}</h2>
      <p>{tr('Breathe in, hold, breathe out, hold. Four seconds each.')}</p>
      <div
        className={`breath-circle${phase === 0 || phase === 1 ? ' is-big' : ''}`}
        role="status"
        aria-live="polite"
      >
        {phase === null ? tr('Ready') : tr(PHASES[phase])}
      </div>
      <label className="break-check">
        <input type="checkbox" checked={sound} onChange={(event) => changeSound(event.target.checked)} />
        {tr('Play soft Mozart-style music')}
      </label>
      <p className="account-note">{tr('Made in your browser, rising notes as you breathe in and falling notes as you breathe out.')}</p>
      <button className="btn btn-secondary" type="button" onClick={toggle}>
        {phase === null ? tr('Start breathing') : tr('Stop')}
      </button>
    </div>
  );
}

function Stretches() {
  const tr = useTr();
  const [done, setDone] = useState<number[]>([]);

  return (
    <div className="break-card">
      <h2>{tr('Quick reset checklist')}</h2>
      <ul className="break-checklist">
        {STRETCHES.map((text, index) => (
          <li key={text}>
            <label className="break-check">
              <input
                type="checkbox"
                checked={done.includes(index)}
                onChange={(event) =>
                  setDone((list) => (event.target.checked ? [...list, index] : list.filter((item) => item !== index)))
                }
              />
              {tr(text)}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Music() {
  const tr = useTr();

  return (
    <div className="break-card">
      <h2>{tr('Music for your break')}</h2>
      <p>{tr('These links open another website in a new tab. Desofec does not control their content.')}</p>
      <p>{tr('We try to close that tab when your 5-minute break ends. Some sites or browsers may not allow it.')}</p>
      <ul className="break-checklist">
        {PLAYLISTS.map((playlist) => (
          <li key={playlist.href}>
            <a
              href={playlist.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                event.preventDefault();
                openMusic(playlist.href);
              }}
            >
              {tr(playlist.label)} ↗
            </a>
          </li>
        ))}
      </ul>
      <button className="btn btn-secondary" type="button" onClick={closeMusic}>
        {tr('Close music and return')}
      </button>
    </div>
  );
}

export function BreakRoom() {
  return (
    <div className="break-grid">
      <BreakCountdown />
      <Breathing />
      <MemoryGame />
      <BubblePop />
      <DoodlePad />
      <MindMap />
      <Stretches />
      <Music />
      <Settings />
    </div>
  );
}
