// Flat one-color illustrations of devices connected to the cloud. Shapes use the
// --color-art token; `cut` is the section background, used for cut-out details.

type Props = { cut: string; className?: string };

const art = { fill: "var(--color-art)" };
const wire = { fill: "none", stroke: "var(--color-art)", strokeWidth: 6, strokeLinecap: "round" as const };

function Cloud({ x, y, s = 1, cut }: { x: number; y: number; s?: number; cut: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-30" cy="10" r="24" style={art} />
      <circle cx="4" cy="-4" r="34" style={art} />
      <circle cx="40" cy="14" r="22" style={art} />
      <rect x="-62" y="10" width="126" height="26" rx="13" style={art} />
      <path d="M-44 30 A20 20 0 0 1 -8 24" style={{ fill: "none", stroke: cut, strokeWidth: 4, strokeLinecap: "round" }} />
    </g>
  );
}

/** A laptop plugged into a cloud, its screen showing a falling bill */
export function LaptopCloud({ cut, className }: Props) {
  return (
    <svg viewBox="0 0 280 250" className={className} aria-hidden>
      <Cloud x={180} y={46} cut={cut} />
      <path d="M180 82 C180 120 250 112 246 156 C243 190 214 200 196 202" style={wire} />
      <rect x="186" y="194" width="14" height="16" rx="3" style={art} />
      <rect x="40" y="122" width="150" height="96" rx="10" style={art} />
      <rect x="51" y="133" width="128" height="74" rx="4" style={{ fill: cut }} />
      <rect x="66" y="152" width="18" height="44" rx="4" style={art} />
      <rect x="94" y="164" width="18" height="32" rx="4" style={art} />
      <rect x="122" y="176" width="18" height="20" rx="4" style={{ fill: "var(--color-brand)" }} />
      <rect x="150" y="184" width="18" height="12" rx="4" style={{ fill: "var(--color-brand)" }} />
      <path d="M22 222 H208 L200 236 H30 Z" style={art} />
    </svg>
  );
}

/** An idle server tower, asleep, wired to a cloud: money spent on nothing */
export function IdleServer({ cut, className }: Props) {
  return (
    <svg viewBox="0 0 280 250" className={className} aria-hidden>
      <Cloud x={70} y={48} s={0.8} cut={cut} />
      <path d="M70 78 C70 110 120 96 128 124" style={wire} />
      <path d="M60 80 c-14 10 -2 22 -14 30 c-12 8 -2 20 -14 26" style={{ ...wire, strokeWidth: 4 }} />
      <rect x="106" y="112" width="104" height="128" rx="12" style={art} />
      {[130, 166, 202].map((y) => (
        <g key={y}>
          <rect x="120" y={y} width="56" height="20" rx="4" style={{ fill: cut }} />
          <circle cx="192" cy={y + 10} r="6" style={{ fill: cut }} />
        </g>
      ))}
      <circle cx="192" cy="140" r="6" style={{ fill: "var(--color-brand)" }} />
      <text x="214" y="104" style={{ ...art, font: "700 26px var(--font-display)" }}>z</text>
      <text x="234" y="78" style={{ ...art, font: "700 34px var(--font-display)" }}>z</text>
      <text x="252" y="46" style={{ ...art, font: "700 42px var(--font-display)" }}>z</text>
    </svg>
  );
}

/** A phone asking for approval, connected to a cloud */
export function PhoneApprove({ cut, className }: Props) {
  return (
    <svg viewBox="0 0 280 250" className={className} aria-hidden>
      <Cloud x={200} y={50} s={0.85} cut={cut} />
      <path d="M200 82 C200 130 140 120 136 150" style={wire} />
      <rect x="70" y="96" width="96" height="150" rx="16" style={art} />
      <rect x="80" y="112" width="76" height="112" rx="6" style={{ fill: cut }} />
      <rect x="90" y="124" width="56" height="8" rx="4" style={art} />
      <rect x="90" y="138" width="40" height="8" rx="4" style={art} />
      <circle cx="118" cy="186" r="22" style={{ fill: "var(--color-brand)" }} />
      <path d="M107 186 l8 8 l14 -15" style={{ fill: "none", stroke: cut, strokeWidth: 6, strokeLinecap: "round", strokeLinejoin: "round" }} />
      <rect x="106" y="232" width="24" height="5" rx="2.5" style={{ fill: cut }} />
    </svg>
  );
}
