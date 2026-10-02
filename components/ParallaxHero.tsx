"use client";

import { useEffect, useRef } from "react";
import { Horizon } from "@/components/Horizon";

// Hero as a flat "sky" band (inspired by boy-coy.com): solid burgundy, the copy and the
// bill card drift at different speeds while scrolling, and a cloud bank at the bottom
// leads into the sand-colored page. As the hero scrolls away, the bill's last bar is
// trimmed and the savings counter fills up. Solid colors only.

const SAVED = 9202;
const BARS = [52, 60, 64, 70, 76, 86];
const SKY = "#8e2f3c";
const SKY_DEEP = "#74242f";

export function ParallaxHero({ children }: { children: React.ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "0.6");
      if (counter.current) counter.current.textContent = SAVED.toLocaleString("en-US");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, el.offsetHeight)));
      el.style.setProperty("--p", p.toFixed(4));
      if (counter.current) {
        counter.current.textContent = Math.round(SAVED * Math.min(1, p / 0.6)).toLocaleString("en-US");
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

  // The last bar loses the waste share (about 11%) over the first 60% of the scroll
  const trim = "min(1, calc(var(--p) / 0.6))";

  return (
    <section ref={section} className="relative" style={{ ["--p" as string]: 0, background: SKY }}>
      <div className="relative mx-auto grid min-h-[86svh] max-w-6xl items-center gap-10 px-4 pt-32 pb-10 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
        {/* Copy: moves a little slower than the page */}
        <div data-band="sky" style={{ transform: "translate3d(0, calc(var(--p) * 120px), 0)" }}>
          {children}
        </div>

        {/* The bill card: floats a little faster, like a nearer layer */}
        <div className="hidden lg:block" style={{ transform: "translate3d(0, calc(var(--p) * -60px), 0)" }}>
          <div className="border border-line bg-card p-6 text-ink">
            <div className="flex items-baseline justify-between text-xs text-muted">
              <span>Monthly cloud bill</span>
              <span className="num">SAR 85,400</span>
            </div>
            <div className="mt-5 flex h-44 items-end gap-2.5">
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
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-3">
              <span className="text-xs text-muted">Trimmed by CloudTrim</span>
              <span className="font-display text-2xl font-semibold text-brand">
                SAR <span ref={counter} className="num">0</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud bank into the page below; small burgundy clouds float under it */}
      <Horizon kind="clouds" from={SKY} back={SKY_DEEP} to="var(--color-bg)" accent={SKY} />
    </section>
  );
}
