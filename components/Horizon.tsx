"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

// Flat illustrated horizons between page bands (clouds, mountains, waves), drawn in solid
// colors. Each one has layers that slide at different speeds while the visitor scrolls,
// which gives the page its layered parallax depth. The motion eases toward the scroll
// position instead of jumping with it, so it stays slow and smooth.

/**
 * Eases a CSS variable on the element toward `target()` on every scroll.
 * `ease` is the share of the remaining distance covered each frame (smaller = slower).
 */
export function useEasedVar<T extends HTMLElement>(
  name: string,
  target: (el: T) => number,
  onFrame?: (value: number) => void,
  ease = 0.06,
) {
  const ref = useRef<T>(null);
  const targetRef = useRef(target);
  const frameRef = useRef(onFrame);
  useLayoutEffect(() => {
    targetRef.current = target;
    frameRef.current = onFrame;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let value = targetRef.current(el);
    let raf = 0;
    const write = () => {
      el.style.setProperty(name, value.toFixed(4));
      frameRef.current?.(value);
    };
    const step = () => {
      const goal = targetRef.current(el);
      value += (goal - value) * ease;
      if (Math.abs(goal - value) < 0.0005) value = goal;
      write();
      raf = value === goal ? 0 : requestAnimationFrame(step);
    };
    const onScroll = () => {
      if (reduce) {
        value = targetRef.current(el);
        write();
      } else if (!raf) {
        raf = requestAnimationFrame(step);
      }
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [name, ease]);

  return ref;
}

/** --s on the element: -1 when it enters at the bottom of the screen, 1 when it leaves at the top. */
function viewportPos(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const s = 1 - ((r.top + r.height / 2) / window.innerHeight) * 2;
  return Math.max(-1.5, Math.min(1.5, s));
}

const shift = (x: number, y = 0): React.CSSProperties => ({
  transform: `translate3d(calc(var(--s, 0) * ${x}px), calc(var(--s, 0) * ${y}px), 0)`,
  willChange: "transform",
});

// Small seeded random so the shapes are the same on the server and the client
function rng(seed: number) {
  let k = seed;
  return () => {
    k = (k * 9301 + 49297) % 233280;
    return k / 233280;
  };
}

type Puff = { cx: number; cy: number; r: number };

// A cumulus bank: big puffs of uneven height, each with smaller puffs on its shoulders
function bank(seed: number, base: number, rMin: number, rMax: number): Puff[] {
  const rand = rng(seed);
  const out: Puff[] = [];
  let x = -80;
  while (x < 1580) {
    const r = rMin + rand() * (rMax - rMin);
    const cy = base + (rand() - 0.5) * 18;
    out.push({ cx: x, cy, r });
    if (rand() > 0.35) out.push({ cx: x - r * 0.45, cy: cy - r * 0.55, r: r * (0.42 + rand() * 0.12) });
    if (rand() > 0.5) out.push({ cx: x + r * 0.5, cy: cy - r * 0.45, r: r * (0.36 + rand() * 0.12) });
    x += r * (1.1 + rand() * 0.4);
  }
  return out;
}

const BACK_CLOUDS = bank(7, 128, 44, 74);
const FRONT_CLOUDS = bank(23, 160, 34, 58);

// Our own flat cloud shapes (in the style of the reference): domes on a rounded base,
// with a fold line inside. Three variants, placed many times at different sizes.
type Variant = { puffs: Puff[]; base: [number, number]; fold?: [number, number, number] };
const VARIANTS: Variant[] = [
  { puffs: [{ cx: -18, cy: -10, r: 30 }, { cx: 20, cy: -2, r: 22 }, { cx: -44, cy: 6, r: 14 }, { cx: 42, cy: 8, r: 12 }], base: [-58, 114], fold: [-14, 10, 18] },
  { puffs: [{ cx: -14, cy: -8, r: 28 }, { cx: 18, cy: -16, r: 22 }, { cx: 38, cy: 0, r: 16 }, { cx: -40, cy: 4, r: 16 }], base: [-56, 112], fold: [14, 2, 16] },
  { puffs: [{ cx: -26, cy: -2, r: 18 }, { cx: 4, cy: -8, r: 24 }, { cx: 30, cy: 0, r: 16 }], base: [-52, 102], fold: [2, 8, 12] },
];

// [x, y, scale, variant]
type Spot = readonly [number, number, number, number];
// Plain clouds drifting in the sky above the cloud bank
const SKY_CLOUDS: Spot[] = [
  [110, 70, 0.6, 2], [330, 44, 0.85, 0], [590, 80, 0.5, 1], [840, 40, 0.75, 2], [1060, 74, 0.55, 0], [1290, 46, 0.9, 1],
];
// Burgundy clouds with a light outline, floating below the bank
const LOW_CLOUDS: Spot[] = [
  [40, 262, 0.55, 2], [170, 236, 0.8, 0], [300, 300, 1.15, 1], [420, 228, 0.5, 2], [520, 262, 0.9, 2],
  [660, 312, 1.4, 0], [780, 236, 0.7, 1], [890, 286, 0.85, 2], [1000, 232, 0.6, 0], [1120, 304, 1.3, 1],
  [1240, 246, 0.8, 0], [1350, 290, 0.65, 2], [1420, 230, 0.45, 1],
];

// Arc inside a cloud, drawn in the sky color, like the fold lines in a flat illustration
function fold(cx: number, cy: number, r: number) {
  const a0 = (205 * Math.PI) / 180;
  const a1 = (325 * Math.PI) / 180;
  const p = (a: number) => `${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`;
  return `M${p(a0)} A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${p(a1)}`;
}

function Cloud({ spot, fill, line, outline }: { spot: Spot; fill: string; line: string; outline?: string }) {
  const [x, y, s, v] = spot;
  const { puffs, base, fold: f } = VARIANTS[v];
  const shape = (
    <>
      {puffs.map((p, i) => (
        <circle key={i} cx={p.cx} cy={p.cy} r={p.r} />
      ))}
      <rect x={base[0]} y="0" width={base[1]} height="24" rx="12" />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {outline && <g style={{ fill: outline, stroke: outline }} strokeWidth="12">{shape}</g>}
      <g style={{ fill }}>{shape}</g>
      {f && <path d={fold(f[0], f[1], f[2])} fill="none" stroke={line} strokeWidth="4" />}
    </g>
  );
}

// A row of curling waves (like a woodblock print): from each crest a long slope runs
// down into a round hollow, and the far side of the hollow rises and curls back over it.
const WAVE = 72;
/** k scales the whole curl, so each row can have its own size and thickness */
function curls(top: number, offset: number, h: number, k = 1) {
  let d = `M-200 ${h} L-200 ${top}`;
  for (let x = -200 + offset; x < 1640; x += WAVE * k) {
    const X = (n: number) => (x + n * k).toFixed(1);
    const t = (n: number) => (top + n * k).toFixed(1);
    d += ` L${X(0)} ${t(0)}`;
    d += ` C${X(14)} ${t(4)} ${X(28)} ${t(12)} ${X(36)} ${t(22)}`;
    d += ` C${X(41)} ${t(30)} ${X(48)} ${t(36)} ${X(58)} ${t(36)}`;
    d += ` C${X(72)} ${t(36)} ${X(82)} ${t(26)} ${X(80)} ${t(14)}`;
    d += ` C${X(79)} ${t(7)} ${X(76)} ${t(2)} ${X(WAVE)} ${t(0)}`;
  }
  return `${d} L1640 ${h} Z`;
}

// A jagged mountain ridge: alternating peaks and valleys, each peak with a snow cap on
// its left face and a shadow facet on its right face (flat two-tone shading)
type Pt = [number, number];
function ridge(seed: number, top: [number, number], valley: [number, number], step: [number, number]) {
  const rand = rng(seed);
  const pts: Pt[] = [[-120, valley[0] + rand() * (valley[1] - valley[0])]];
  let x = -120;
  while (x < 1560) {
    x += step[0] + rand() * (step[1] - step[0]);
    pts.push([x, top[0] + rand() * (top[1] - top[0])]);
    x += step[0] + rand() * (step[1] - step[0]);
    pts.push([x, valley[0] + rand() * (valley[1] - valley[0])]);
  }
  return pts;
}

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const poly = (pts: Pt[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

function Ridge({ pts, h, body, snow, shade }: { pts: Pt[]; h: number; body: string; snow: string; shade: string }) {
  const peaks = pts.map((p, i) => i).filter((i) => i % 2 === 1 && i + 1 < pts.length);
  return (
    <>
      <polygon points={poly([[-120, h], ...pts, [pts[pts.length - 1][0], h]])} style={{ fill: body }} />
      {peaks.map((i) => {
        const [l, p, r] = [pts[i - 1], pts[i], pts[i + 1]];
        const ls = lerp(p, l, 0.5);
        const rs = lerp(p, r, 0.38);
        const notch = lerp(ls, rs, 0.45);
        return (
          <g key={i}>
            <polygon points={poly([p, r, lerp(r, l, 0.22)])} style={{ fill: shade }} />
            <polygon
              points={poly([p, rs, lerp(ls, rs, 0.7), [notch[0], notch[1] + 7], ls])}
              style={{ fill: snow }}
            />
          </g>
        );
      })}
    </>
  );
}

const BACK_RIDGE = ridge(11, [34, 62], [92, 110], [70, 120]);
const FRONT_RIDGE = ridge(5, [70, 110], [150, 170], [90, 170]);

type Props = {
  kind: "clouds" | "mountains" | "waves";
  /** Color of the band above (fills the top of the horizon) */
  from: string;
  /** Color of the band below (the front layer) */
  to: string;
  /** Color of the back layer */
  back: string;
  /** Waves only: color of the middle swell */
  mid?: string;
  /** Clouds: color of the small floating clouds. Mountains: color of the snow caps */
  accent?: string;
};

const HEIGHT = { clouds: 350, mountains: 200, waves: 190 };

export function Horizon({ kind, from, to, back, mid, accent }: Props) {
  const ref = useEasedVar<HTMLDivElement>("--s", viewportPos);
  const h = HEIGHT[kind];

  return (
    <div ref={ref} className="relative -my-px overflow-hidden" style={{ background: from }} aria-hidden>
      {/* Height follows the width so the tops are never cut; on phones a minimum height crops the sides instead */}
      <svg
        viewBox={`0 0 1440 ${h}`}
        preserveAspectRatio="xMidYMax slice"
        className={`block h-auto w-full ${kind === "clouds" ? "min-h-[150px]" : "min-h-[90px]"}`}
      >
        {kind === "clouds" && (
          <>
            <g style={shift(-14, 8)}>
              {SKY_CLOUDS.map((c, i) => (
                <Cloud key={i} spot={c} fill={back} line={from} />
              ))}
            </g>
            <g style={{ ...shift(-24, 6), fill: back }}>
              {BACK_CLOUDS.map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
              ))}
              <rect x="-80" y="128" width="1640" height={h} />
            </g>
            <g style={{ ...shift(30, -4), fill: to }}>
              {FRONT_CLOUDS.map((c, i) => (
                <circle key={i} cx={c.cx} cy={c.cy} r={c.r} />
              ))}
              <rect x="-80" y="160" width="1640" height={h} />
            </g>
            {accent && (
              <g style={shift(50, -8)}>
                {LOW_CLOUDS.map((c, i) => (
                  <Cloud key={i} spot={c} fill={accent} line={to} outline={to} />
                ))}
              </g>
            )}
          </>
        )}

        {kind === "mountains" && (
          <>
            <g style={shift(-18, 4)}>
              <Ridge pts={BACK_RIDGE} h={h} body={back} snow={accent ?? from} shade={mid ?? back} />
            </g>
            <g style={shift(22, -3)}>
              <Ridge pts={FRONT_RIDGE} h={h} body={to} snow={accent ?? from} shade={mid ?? back} />
            </g>
          </>
        )}

        {kind === "waves" && (
          <>
            {/* Like boy-coy: each row slides sideways on scroll; the outer rows curl and
                move one way, the middle row is mirrored and moves the other way */}
            <path style={{ ...shift(-50, 6), fill: back }} d={curls(20, 0, h, 0.7)} />
            <g style={shift(60, 3)}>
              <path transform="translate(1440 0) scale(-1 1)" style={{ fill: mid ?? back }} d={curls(52, 30, h, 1)} />
            </g>
            <path style={{ ...shift(-70, 0), fill: to }} d={curls(98, 18, h, 1.4)} />
          </>
        )}
      </svg>
    </div>
  );
}
