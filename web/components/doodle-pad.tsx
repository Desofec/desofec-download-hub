'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { useTr } from '@/components/tr';

const COLORS = ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399', '#f8fafc'];
const WIDTH = 600;
const HEIGHT = 340;

export function DoodlePad() {
  const tr = useTr();
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [color, setColor] = useState(COLORS[0]);

  function point(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT
    };
  }

  function start(event: PointerEvent<HTMLCanvasElement>) {
    const context = canvas.current?.getContext('2d');
    if (!context) return;
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const { x, y } = point(event);
    context.strokeStyle = color;
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + 0.01, y);
    context.stroke();
  }

  function move(event: PointerEvent<HTMLCanvasElement>) {
    const context = canvas.current?.getContext('2d');
    if (!drawing.current || !context) return;
    const { x, y } = point(event);
    context.lineTo(x, y);
    context.stroke();
  }

  function clear() {
    canvas.current?.getContext('2d')?.clearRect(0, 0, WIDTH, HEIGHT);
  }

  return (
    <div className="break-card">
      <h2>{tr('Doodle pad')}</h2>
      <p>{tr('Draw anything with your finger or mouse. Nothing is saved or uploaded.')}</p>
      <canvas
        ref={canvas}
        className="doodle-canvas"
        width={WIDTH}
        height={HEIGHT}
        aria-label={tr('Drawing area')}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={() => {
          drawing.current = false;
        }}
        onPointerCancel={() => {
          drawing.current = false;
        }}
      />
      <div className="break-row">
        {COLORS.map((value) => (
          <button
            key={value}
            type="button"
            className={`doodle-color${value === color ? ' is-selected' : ''}`}
            style={{ background: value }}
            aria-label={value}
            aria-pressed={value === color}
            onClick={() => setColor(value)}
          />
        ))}
        <button className="btn btn-secondary" type="button" onClick={clear}>
          {tr('Clear')}
        </button>
      </div>
    </div>
  );
}
