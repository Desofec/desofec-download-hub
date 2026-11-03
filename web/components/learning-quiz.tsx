'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/language';
import { useTr } from '@/components/tr';
import { quizQuestions } from '@/lib/quiz-questions';

export function LearningQuiz() {
  const tr = useTr();
  const language = useLanguage();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const total = quizQuestions.length;
  const finished = index >= total;
  const current = quizQuestions[index];

  function choose(option: number) {
    if (picked !== null) return;
    setPicked(option);
    if (option === current.answer) setScore((value) => value + 1);
  }

  function restart() {
    setIndex(0);
    setPicked(null);
    setScore(0);
  }

  return (
    <div className="break-card quiz-card">
      <h2>{tr('AI basics quiz')}</h2>
      {finished ? (
        <>
          <p role="status">{tr('You got {score} of {total}. Nice work!', { score, total })}</p>
          <button className="btn btn-secondary" type="button" onClick={restart}>
            {tr('Play again')}
          </button>
        </>
      ) : (
        <>
          <p>{tr('Question {number} of {total}', { number: index + 1, total })}</p>
          <p className="quiz-question">{current.question[language]}</p>
          <div className="quiz-options">
            {current.options.map((option, i) => {
              const state = picked === null ? '' : i === current.answer ? ' is-right' : i === picked ? ' is-wrong' : '';
              return (
                <button key={i} type="button" className={`quiz-option${state}`} disabled={picked !== null} onClick={() => choose(i)}>
                  {option[language]}
                </button>
              );
            })}
          </div>
          {picked !== null ? (
            <>
              <p role="status">
                {picked === current.answer ? tr('Correct!') : tr('Not quite.')} {current.why[language]}
              </p>
              <button className="btn btn-secondary" type="button" onClick={() => { setIndex(index + 1); setPicked(null); }}>
                {index + 1 === total ? tr('See my score') : tr('Next question')}
              </button>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
