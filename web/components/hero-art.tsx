export function HeroArt() {
  return (
    <svg className="hero-art" viewBox="0 0 320 220" aria-hidden="true">
      <defs>
        <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="0.5" stopColor="#c084fc" />
          <stop offset="1" stopColor="#6ee7b7" />
        </linearGradient>
      </defs>
      <path className="hero-art-path" d="M30 160 C 90 160, 90 60, 160 60 S 230 160, 290 70" fill="none" stroke="url(#hero-line)" strokeWidth="4" strokeLinecap="round" />
      <circle className="hero-art-node n1" cx="30" cy="160" r="14" fill="#7dd3fc" />
      <circle className="hero-art-node n2" cx="160" cy="60" r="14" fill="#c084fc" />
      <circle className="hero-art-node n3" cx="290" cy="70" r="14" fill="#6ee7b7" />
      <g fill="#07111d" fontSize="13" fontWeight="700" textAnchor="middle">
        <text x="30" y="165">1</text>
        <text x="160" y="65">2</text>
        <text x="290" y="75">3</text>
      </g>
    </svg>
  );
}
