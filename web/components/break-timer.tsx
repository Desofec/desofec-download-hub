'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTr } from '@/components/tr';
import { saveBreakSettings, useBreakSettings } from '@/lib/break-settings';

const SNOOZE_MS = 10 * 60 * 1000;
const IDLE_MS = 5 * 60 * 1000;
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;

// Counts active time on the site in memory only (nothing is sent anywhere) and shows a gentle nudge.
export function BreakTimer() {
  const tr = useTr();
  const settings = useBreakSettings();
  const [due, setDue] = useState(false);
  const activeSeconds = useRef(0);
  const lastActivity = useRef(0);
  const snoozeUntil = useRef(0);

  const { enabled, minutes } = settings;

  useEffect(() => {
    if (!enabled) return;
    lastActivity.current = Date.now();
    const markActive = () => {
      lastActivity.current = Date.now();
    };
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, markActive, { passive: true }));

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      const now = Date.now();
      // Being away or on the break room counts as rest, so the clock starts over.
      if (now - lastActivity.current > IDLE_MS || window.location.pathname === '/break-room') {
        activeSeconds.current = 0;
        setDue(false);
        return;
      }
      activeSeconds.current += 1;
      if (activeSeconds.current >= minutes * 60 && now >= snoozeUntil.current) setDue(true);
    }, 1000);

    return () => {
      window.clearInterval(timer);
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, markActive));
    };
  }, [enabled, minutes]);

  if (!enabled || !due) return null;

  return (
    <div className="break-nudge" role="status" aria-live="polite">
      <p>
        <strong>{tr('Time for a short break')}</strong>
        <br />
        {tr('You have been learning for {minutes} minutes. A few minutes away helps you remember more.', { minutes })}
      </p>
      <div className="break-nudge-actions">
        <Link className="btn btn-primary" href="/break-room" onClick={() => setDue(false)}>
          {tr('Take a break')}
        </Link>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => {
            snoozeUntil.current = Date.now() + SNOOZE_MS;
            setDue(false);
          }}
        >
          {tr('Snooze 10 min')}
        </button>
        <button className="btn btn-secondary" type="button" onClick={() => saveBreakSettings({ enabled: false, minutes })}>
          {tr('Turn off reminders')}
        </button>
      </div>
    </div>
  );
}
