// A gentle, Mozart-style phrase in C major, synthesized with the Web Audio API.
// It is an original arrangement made in the browser, so no recordings or audio files are involved.
const NOTE = { C4: 261.63, E4: 329.63, G4: 392.0, C5: 523.25, E5: 659.25 };

// One phrase per breathing phase: in (rising), hold, out (falling), hold.
const PHRASES: { freq: number; start: number; length: number }[][] = [
  [
    { freq: NOTE.C4, start: 0, length: 1.4 },
    { freq: NOTE.E4, start: 1, length: 1.4 },
    { freq: NOTE.G4, start: 2, length: 1.4 },
    { freq: NOTE.C5, start: 3, length: 1.8 }
  ],
  [
    { freq: NOTE.G4, start: 0, length: 4 },
    { freq: NOTE.E5, start: 0, length: 4 }
  ],
  [
    { freq: NOTE.E5, start: 0, length: 1.4 },
    { freq: NOTE.C5, start: 1, length: 1.4 },
    { freq: NOTE.G4, start: 2, length: 1.4 },
    { freq: NOTE.E4, start: 3, length: 1.8 }
  ],
  [
    { freq: NOTE.C4, start: 0, length: 4 },
    { freq: NOTE.G4, start: 0, length: 4 }
  ]
];

const VOLUME = 0.07;

export type BreathSound = {
  play: (phase: number) => void;
  close: () => void;
};

export function createBreathSound(): BreathSound | null {
  const Context = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return null;
  const context = new Context();

  return {
    play(phase) {
      if (context.state === 'suspended') void context.resume();
      const now = context.currentTime;
      for (const note of PHRASES[phase] ?? []) {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const begin = now + note.start;
        const end = begin + note.length;
        oscillator.type = 'sine';
        oscillator.frequency.value = note.freq;
        gain.gain.setValueAtTime(0.0001, begin);
        gain.gain.exponentialRampToValueAtTime(VOLUME, begin + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.0001, end);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(begin);
        oscillator.stop(end + 0.05);
      }
    },
    close() {
      void context.close();
    }
  };
}
