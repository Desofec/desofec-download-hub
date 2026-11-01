import { ImageResponse } from 'next/og';

export const alt = 'Desofec AI Studio: learn the right tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: 80,
          background: 'linear-gradient(135deg, #061020 0%, #0b2545 100%)',
          color: 'white'
        }}
      >
        <div style={{ fontSize: 40, color: '#7dd3fc' }}>Desofec AI Studio</div>
        <div style={{ fontSize: 76, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>
          Learn AI, coding and no-code by building
        </div>
        <div style={{ fontSize: 34, marginTop: 32, color: '#cbd5e1' }}>
          Beginner-friendly tools, learning paths and step-by-step tutorials
        </div>
      </div>
    ),
    size
  );
}
