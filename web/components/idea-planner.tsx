'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useLanguage } from '@/components/language';
import { matchGoals } from '@/lib/idea-planner';
import { useTr } from '@/components/tr';

type PlannerGoal = { id: string; name: string; description: string };
type PlannerPath = { id: string; title: string; goal: string; steps: string[]; tutorialHref?: string };

type RecognitionResult = { 0: { transcript: string }; isFinal: boolean };
type RecognitionEvent = { resultIndex: number; results: ArrayLike<RecognitionResult> };
type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionConstructor = new () => Recognition;

const speechLocales = { en: 'en-US', fr: 'fr-FR', de: 'de-DE', es: 'es-ES' } as const;
const MAX_LENGTH = 500;

function getRecognition(): RecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const scope = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

export function IdeaPlanner({ goals, paths }: { goals: PlannerGoal[]; paths: PlannerPath[] }) {
  const language = useLanguage();
  const tr = useTr();
  const [idea, setIdea] = useState('');
  const [submitted, setSubmitted] = useState('');
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const recognition = useRef<Recognition | null>(null);

  useEffect(() => () => recognition.current?.stop(), []);

  const matches = useMemo(() => matchGoals(submitted), [submitted]);
  const supportsVoice = useSyncExternalStore(
    () => () => {},
    () => getRecognition() !== null,
    () => false
  );

  const toggleVoice = () => {
    if (listening) {
      recognition.current?.stop();
      return;
    }
    const Ctor = getRecognition();
    if (!Ctor) return;

    const instance = new Ctor();
    instance.lang = speechLocales[language];
    instance.continuous = false;
    instance.interimResults = true;
    let base = idea.trim();
    instance.onresult = (event) => {
      let spoken = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) spoken += event.results[index][0].transcript;
      setIdea(`${base} ${spoken}`.trim().slice(0, MAX_LENGTH));
    };
    instance.onerror = () => setVoiceNote(tr('Voice input did not work. Check microphone permission, or type your idea.'));
    instance.onend = () => {
      setListening(false);
      base = '';
    };
    recognition.current = instance;
    setVoiceNote('');
    setListening(true);
    instance.start();
  };

  return (
    <div className="planner">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(idea.trim());
        }}
      >
        <label htmlFor="idea-input" className="planner-label">
          {tr('What would you like to build or learn?')}
        </label>
        <textarea
          id="idea-input"
          className="planner-input"
          rows={4}
          maxLength={MAX_LENGTH}
          value={idea}
          onChange={(event) => setIdea(event.target.value)}
          placeholder={tr('Example: I want to build a website for my bakery and automate my orders.')}
        />
        <div className="cta-row">
          <button type="submit" className="btn btn-primary" disabled={idea.trim().length < 3}>
            {tr('Make my plan')}
          </button>
          {supportsVoice && (
            <button type="button" className="btn btn-secondary" onClick={toggleVoice} aria-pressed={listening}>
              {listening ? tr('Stop listening') : tr('Speak your idea')}
            </button>
          )}
        </div>
        <p className="planner-note" aria-live="polite">
          {voiceNote ||
            (supportsVoice
              ? tr('Voice input uses your browser’s speech service, which may send audio to the browser provider. You can always type instead.')
              : tr('Voice input is not available in this browser, so please type your idea.'))}
        </p>
      </form>

      {submitted && (
        <div className="planner-results" aria-live="polite">
          {matches.length === 0 ? (
            <p>
              {tr('We could not match that yet. Try adding words such as website, app, automation, coding, design or AI, or')}{' '}
              <Link href="/onboarding">{tr('pick a goal')}</Link>.
            </p>
          ) : (
            <>
              <h2>{tr('Your plan')}</h2>
              <ol className="planner-plan">
                {matches.map((match, index) => {
                  const goal = goals.find((entry) => entry.id === match.goalId);
                  const path = paths.find((entry) => entry.goal === match.goalId);
                  if (!goal) return null;
                  return (
                    <li key={goal.id} className="planner-card">
                      <h3>
                        {index === 0 ? tr('Start here:') : tr('Then:')} {tr(goal.name)}
                      </h3>
                      <p>{tr(goal.description)}</p>
                      {path && (
                        <p>
                          {tr('First steps in')} <strong>{tr(path.title)}</strong>: {path.steps.slice(0, 3).map((step) => tr(step)).join(' → ')}
                        </p>
                      )}
                      <div className="cta-row">
                        {path?.tutorialHref && (
                          <Link className="btn btn-primary" href={path.tutorialHref}>
                            {tr('Start the tutorial')}
                          </Link>
                        )}
                        <Link className="btn btn-secondary" href={`/results/${encodeURIComponent(goal.id)}`}>
                          {tr('See tools and starter packs')}
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )}
        </div>
      )}
    </div>
  );
}
