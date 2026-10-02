"use client";

import { useEffect, useRef } from "react";

// Flat illustrated horizons between page bands (clouds, dunes, waves), drawn in solid
// colors. Each one has a back and a front layer that slide at different speeds while
// the visitor scrolls, which gives the page its layered parallax depth.

/** Sets --s on the element: -1 when it enters at the bottom of the screen, 1 when it leaves at the top. */
export function useScrollVar<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const s = 1 - ((r.top + r.height / 2) / vh) * 2;
      el.style.setProperty("--s", Math.max(-1.5, Math.min(1.5, s)).toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return ref;
}

const shift = (x: number, y = 0): React.CSSProperties => ({
  transform: `translate3d(calc(var(--s, 0) * ${x}px), calc(var(--s, 0) * ${y}px), 0)`,
  willChange: "transform",
});

// A row of overlapping circles sitting on a base: reads as a cloud bank
function bank(seed: number, base: number, rMin: number, rMax: number) {
  const out: { cx: number; cy: number; r: number }[] = [];
  let x = -60;
  let k = seed;
  while (x < 1560) {
    k = (k * 9301 + 49297) % 233280;
    const r = rMin + (k / 233280) * (rMax - rMin);
    out.push({ cx: x, cy: base, r });
    x += r * 1.35;
  }
  return out;
}

const BACK_CLOUDS = bank(7, 112, 46, 82);
const FRONT_CLOUDS = bank(23, 140, 34, 64);
const SMALL_CLOUDS = [
  [120, 196, 0.5],
  [380, 214, 0.38],
  [640, 190, 0.6],
  [930, 210, 0.42],
  [1210, 192, 0.55],
] as const;

function CloudShape({ x, y, s, fill }: { x: number; y: number; s: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} style={{ fill }}>
      <circle cx="-34" cy="0" r="26" />
      <circle cx="0" cy="-14" r="34" />
      <circle cx="34" cy="0" r="24" />
      <rect x="-60" y="0" width="118" height="22" />
    </g>
  );
}

type Props = {
  kind: "clouds" | "dunes" | "waves";
  /** Color of the band above (fills the top of the horizon) */
  from: string;
  /** Color of the band below (the front layer) */
  to: string;
  /** Color of the back layer */
  back: string;
  /** Color of the small floating shapes under the clouds */
  accent?: string;
};

export function Horizon({ kind, from, to, back, accent }: Props) {
  const ref = useScrollVar<HTMLDivElement>();
  const h = kind === "clouds" ? 240 : 150;

  return (
    <div ref={ref} className="relative -my-px overflow-hidden" style={{ background: from }} aria-hidden>
      <svg
        viewBox={`0 0 1440 ${h}`}
        preserveAspectRatio="xMidYMax slice"
        className={`block w-full ${kind === "clouds" ? "h-[clamp(120px,16vw,240px)]" : "h-[clamp(80px,10vw,150px)]"}`}
      >
        {kind === "clouds" && (
          <>
            <g style={{ ...shift(-40, 10), fill: back }}>
              {BACK_CLOUDS.map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
              ))}
              <rect x="-60" y="112" width="1620" height={h} />
            </g>
            <g style={{ ...shift(50, -6), fill: to }}>
              {FRONT_CLOUDS.map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
              ))}
              <rect x="-60" y="140" width="1620" height={h} />
            </g>
            {accent && (
              <g style={shift(90, -16)}>
                {SMALL_CLOUDS.map(([x, y, s], i) => (
                  <CloudShape key={i} x={x} y={y} s={s} fill={accent} />
                ))}
              </g>
            )}
          </>
        )}

        {kind === "dunes" && (
          <>
            <path
              style={{ ...shift(-60, 6), fill: back }}
              d="M-100 70 C 120 10, 300 10, 520 60 S 900 120, 1120 50 S 1420 0, 1560 50 V 150 H -100 Z"
            />
            <path
              style={{ ...shift(70, -4), fill: to }}
              d="M-100 110 C 160 60, 380 70, 600 105 S 980 140, 1200 90 S 1440 70, 1560 95 V 150 H -100 Z"
            />
          </>
        )}

        {kind === "waves" && (
          <>
            <path
              style={{ ...shift(-50, 4), fill: back }}
              d={`M-100 80 ${Array.from({ length: 34 }, () => "q 25 -24 50 0").join(" ")} V 150 H -100 Z`}
            />
            <path
              style={{ ...shift(60, -4), fill: to }}
              d={`M-100 104 ${Array.from({ length: 34 }, () => "q 25 22 50 0").join(" ")} V 150 H -100 Z`}
            />
          </>
        )}
      </svg>
    </div>
  );
}
