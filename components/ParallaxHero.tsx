"use client";

import { useEffect, useRef, useState } from "react";

// Scroll-driven hero: a tall section with a pinned stage. As the visitor scrolls, flat
// cloud layers drift at different speeds (parallax), the bill bar gets trimmed and the
// savings counter fills up. Everything is driven by one CSS variable, --p (0 to 1).
// Solid colors only: no glow, no gradients.

const SAVED = 9202;

function Cloud({ className = "", style, fill }: { className?: string; style?: React.CSSProperties; fill: string }) {
  return (
    <svg viewBox="0 0 200 110" className={className} style={{ ...style, fill }} aria-hidden>
      <circle cx="62" cy="68" r="38" />
      <circle cx="108" cy="48" r="46" />
      <circle cx="152" cy="70" r="34" />
      <rect x="24" y="68" width="162" height="42" />
    </svg>
  );
}

// Each layer moves by p * speed pixels up, plus an optional sideways drift
const layer = (speed: number, drift = 0, scale = 0): React.CSSProperties => ({
  transform: `translate3d(calc(var(--p) * ${drift}px), calc(var(--p) * ${-speed}px), 0) scale(calc(1 + var(--p) * ${scale}))`,
  willChange: "transform",
});

const BARS = [52, 60, 64, 70, 76, 86];

export function ParallaxHero({ children }: { children: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, travel)));
      el.style.setProperty("--p", p.toFixed(4));
      if (counter.current) {
        const k = Math.min(1, p / 0.7);
        counter.current.textContent = Math.round(SAVED * k).toLocaleString("en-US");
      }
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

  // The bill bar loses its waste share (about 11%) over the first 70% of the scroll
  const trim = "min(1, calc(var(--p) / 0.7))";

  return (
    <section
      ref={section}
      className={`relative border-b border-line ${still ? "" : "h-[230svh]"}`}
      style={{ ["--p" as string]: 0 }}
    >
      <div className={`${still ? "relative" : "sticky top-0"} h-[100svh] min-h-[620px] overflow-hidden`}>
        {/* Back layer: small distant clouds */}
        <div className="absolute inset-0" style={layer(60, -20)}>
          <Cloud fill="var(--color-line-strong)" className="absolute top-[16%] left-[58%] w-[10vw] min-w-16" />
          <Cloud fill="var(--color-line-strong)" className="absolute top-[28%] left-[86%] w-[8vw] min-w-14" />
          <Cloud fill="var(--color-line-strong)" className="absolute top-[64%] left-[6%] w-[7vw] min-w-12 opacity-70" />
        </div>

        {/* Middle layer: sand clouds (desktop only, keeps the phone view calm) */}
        <div className="absolute inset-0 hidden md:block" style={layer(170, 30)}>
          <Cloud fill="var(--color-amber)" className="absolute top-[44%] left-[54%] w-[15vw] min-w-24 opacity-80" />
          <Cloud fill="var(--color-amber)" className="absolute top-[66%] left-[84%] w-[12vw] min-w-20 opacity-80" />
        </div>

        {/* The bill: six months of bars, the last one gets trimmed as you scroll */}
        <div className="absolute top-[22%] right-[6%] z-20 hidden w-[30vw] max-w-[440px] lg:block" style={layer(110)}>
          <div className="border border-line bg-card p-5">
            <div className="flex items-baseline justify-between text-xs text-muted">
              <span>Monthly cloud bill</span>
              <span className="num">SAR 85,400</span>
            </div>
            <div className="mt-4 flex h-40 items-end gap-2.5">
              {BARS.map((h, i) => {
                const last = i === BARS.length - 1;
                return (
                  <div key={i} className="relative flex-1" style={{ height: `${h}%` }}>
                    {last && <div className="absolute inset-0 border border-dashed border-brand" />}
                    <div
                      className={`absolute inset-x-0 bottom-0 ${last ? "bg-brand" : "bg-line-strong"}`}
                      style={{ height: last ? `calc(100% - ${trim} * 11%)` : "100%" }}
                    />
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
              <span className="text-xs text-muted">Trimmed by CloudTrim</span>
              <span className="font-display text-2xl font-semibold text-brand">
                SAR <span ref={counter} className="num">{still ? SAVED.toLocaleString("en-US") : "0"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Front layer: one big burgundy cloud rising past the text */}
        <div className="absolute inset-0" style={layer(260, 0, 0.1)}>
          <Cloud
            fill="var(--color-brand)"
            className="absolute top-[80%] left-[42%] w-[62vw] lg:top-[72%] lg:left-[46%] lg:w-[28vw]"
          />
        </div>

        {/* Copy: lifts and fades as the scene takes over */}
        <div
          className="relative z-10 mx-auto flex h-full max-w-6xl items-center px-4 md:px-6"
          style={{
            transform: "translate3d(0, calc(var(--p) * -140px), 0)",
            opacity: "calc(1 - var(--p) * 1.6)",
          }}
        >
          {children}
        </div>

        {/* Outro: the result fades in once the text has gone */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[24%] z-10 mx-auto max-w-6xl px-4 md:px-6 lg:top-[36%]"
          style={{
            opacity: "clamp(0, calc((var(--p) - 0.55) * 3), 1)",
            transform: "translate3d(0, calc((1 - var(--p)) * 60px), 0)",
          }}
        >
          <p className="micro text-brand">The result</p>
          <p className="font-display mt-3 max-w-md text-4xl font-bold leading-tight tracking-[-0.03em] md:text-5xl">
            SAR 9,202 trimmed every month.
          </p>
          <p className="mt-4 max-w-sm text-ink-2">Found by the AI agent, approved by your team. Nothing changed without a click.</p>
        </div>

        {/* Scroll hint */}
        {!still && (
          <p
            className="micro absolute bottom-6 left-1/2 -translate-x-1/2 text-muted"
            style={{ opacity: "calc(1 - var(--p) * 4)" }}
          >
            Scroll
          </p>
        )}
      </div>
    </section>
  );
}
