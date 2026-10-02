"use client";

import { Horizon, useEasedVar } from "@/components/Horizon";

// Hero as a flat "sky" band (inspired by boy-coy.com): solid burgundy, the copy and the
// bill card drift at different speeds while scrolling, and a cloud bank at the bottom
// leads into the sand-colored page. The card shows six months of a bill: three before
// CloudTrim and three after, with the trimmed part outlined. Solid colors only.

const BEFORE = 85400;
const AFTER = 62300;
// Monthly bill in SAR; CloudTrim connects after June
const MONTHS: [string, number, boolean][] = [
  ["Apr", 83900, false],
  ["May", 84700, false],
  ["Jun", 85400, false],
  ["Jul", 66800, true],
  ["Aug", 63500, true],
  ["Sep", 62300, true],
];
const SKY = "#8e2f3c";
const SKY_DEEP = "#74242f";
const sar = (n: number) => n.toLocaleString("en-US");

export function ParallaxHero({ children }: { children: React.ReactNode }) {
  // --p eases toward how far the hero has scrolled away (0 to 1), so the layers glide
  const section = useEasedVar<HTMLElement>("--p", (el) =>
    Math.min(1, Math.max(0, window.scrollY / Math.max(1, el.offsetHeight))),
  );

  return (
    <section ref={section} className="relative" style={{ ["--p" as string]: 0, background: SKY }}>
      <div className="relative mx-auto grid min-h-[86svh] max-w-6xl items-center gap-10 px-4 pt-32 pb-10 md:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-24">
        {/* Copy: moves a little slower than the page */}
        <div data-band="sky" style={{ transform: "translate3d(0, calc(var(--p) * 90px), 0)" }}>
          {children}
        </div>

        {/* The bill card: floats a little faster, like a nearer layer */}
        <div className="hidden lg:block" style={{ transform: "translate3d(0, calc(var(--p) * -45px), 0)" }}>
          <div className="border border-line bg-card p-6 text-ink">
            <div className="flex items-baseline justify-between text-xs text-muted">
              <span>Monthly cloud bill (SAR)</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 bg-line-strong" />Before</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 bg-brand" />With CloudTrim</span>
              </span>
            </div>
            <div className="mt-5 flex h-44 items-end gap-2.5">
              {MONTHS.map(([m, v, after]) => (
                <div key={m} className="relative flex-1" style={{ height: "100%" }}>
                  {after && <div className="absolute inset-0 border border-dashed border-brand" title={`Was SAR ${sar(BEFORE)}`} />}
                  <div
                    className={`absolute inset-x-0 bottom-0 ${after ? "bg-brand" : "bg-line-strong"}`}
                    style={{ height: `${(v / BEFORE) * 100}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-2.5 text-center text-xs text-muted">
              {MONTHS.map(([m]) => (
                <span key={m} className="flex-1">{m}</span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 border-t border-line pt-3">
              <div>
                <p className="text-xs text-muted">Before</p>
                <p className="num mt-1 font-semibold">SAR {sar(BEFORE)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">After</p>
                <p className="num mt-1 font-semibold">SAR {sar(AFTER)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">Saved every month</p>
                <p className="num font-display mt-1 whitespace-nowrap text-xl font-semibold text-brand">SAR {sar(BEFORE - AFTER)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud bank into the page below; small burgundy clouds float under it */}
      <Horizon kind="clouds" from={SKY} back={SKY_DEEP} to="var(--color-bg)" accent={SKY} />
    </section>
  );
}
