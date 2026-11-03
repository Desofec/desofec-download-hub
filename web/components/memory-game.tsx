'use client';

import { useEffect, useRef, useState } from 'react';
import { useTr } from '@/components/tr';

const SYMBOLS = ['🚀', '💡', '🧠', '🎯', '🌱', '🔧'];

type Card = { key: number; symbol: string };

function shuffledDeck(): Card[] {
  const deck = [...SYMBOLS, ...SYMBOLS].map((symbol, key) => ({ key, symbol }));
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// The deck is only shuffled after the player presses Start, so server and browser render the same HTML.
export function MemoryGame() {
  const tr = useTr();
  const [deck, setDeck] = useState<Card[] | null>(null);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const hideTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  function start() {
    window.clearTimeout(hideTimer.current);
    setDeck(shuffledDeck());
    setOpen([]);
    setMatched([]);
    setMoves(0);
  }

  function flip(index: number) {
    if (!deck || open.length === 2 || open.includes(index) || matched.includes(deck[index].symbol)) return;
    const next = [...open, index];
    setOpen(next);
    if (next.length < 2) return;

    setMoves((count) => count + 1);
    if (deck[next[0]].symbol === deck[next[1]].symbol) {
      setMatched((list) => [...list, deck[next[0]].symbol]);
      setOpen([]);
    } else {
      hideTimer.current = window.setTimeout(() => setOpen([]), 800);
    }
  }

  const won = deck !== null && matched.length === SYMBOLS.length;

  return (
    <div className="break-card">
      <h2>{tr('Memory match')}</h2>
      <p>{tr('Find all the matching pairs in as few moves as you can.')}</p>
      {deck && (
        <>
          <div className="memory-grid">
            {deck.map((card, index) => {
              const shown = open.includes(index) || matched.includes(card.symbol);
              return (
                <button
                  key={card.key}
                  type="button"
                  className={`memory-card${shown ? ' is-open' : ''}`}
                  onClick={() => flip(index)}
                  aria-label={shown ? card.symbol : tr('Hidden card')}
                >
                  {shown ? card.symbol : '?'}
                </button>
              );
            })}
          </div>
          <p role="status">
            {won ? tr('You won in {moves} moves. Nice work!', { moves }) : tr('Moves: {moves}', { moves })}
          </p>
        </>
      )}
      <button className="btn btn-secondary" type="button" onClick={start}>
        {deck ? tr('New game') : tr('Start game')}
      </button>
    </div>
  );
}
