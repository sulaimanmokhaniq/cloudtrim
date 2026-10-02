"use client";

import { Horizon, useEasedVar } from "@/components/Horizon";

// Hero as a flat "sky" band (inspired by boy-coy.com): solid burgundy, the copy and the
// bill card drift at different speeds while scrolling, and a cloud bank at the bottom
// leads into the sand-colored page. The card shows six months of a bill: three before
// CloudTrim and three after, with the trimmed part outlined. Solid colors only.

const BEFORE = 85400;
const AFTER = 62300;
// Monthly bill in SAR for six months; CloudTrim connects after the third
const BILLS = [83900, 84700, 85400, 66800, 63500, 62300];
const SKY = "#8e2f3c";
const SKY_DEEP = "#74242f";
const sar = (n: number) => n.toLocaleString("en-US");

export type BillCardCopy = {
  title: string;
  before: string;
  after: string;
  withUs: string;
  saved: string;
  was: string;
  months: string[];
};

const CARD_EN: BillCardCopy = {
  title: "Monthly cloud bill (SAR)",
  before: "Before",
  after: "After",
  withUs: "With CloudTrim",
  saved: "Saved every month",
  was: "Was",
  months: ["Apr", "May", "Jun", "Jul", "Aug", "Sep"],
};

export function ParallaxHero({
  children,
  card = CARD_EN,
  currency = "SAR",
  currencyAfter = false,
}: {
  children: React.ReactNode;
  card?: BillCardCopy;
  /** Currency label, and whether it follows the number (as in Arabic "62,300 ريال") */
  currency?: string;
  currencyAfter?: boolean;
}) {
  const money = (n: number) => (currencyAfter ? `${sar(n)} ${currency}` : `${currency} ${sar(n)}`);
  // --p eases toward how far the hero has scrolled away (0 to 1), so the layers glide
  const section = useEasedVar<HTMLElement>("--p", (el) =>
    Math.min(1, Math.max(0, window.scrollY / Math.max(1, el.offsetHeight))),
  );

  return (
    <section ref={section} className="relative" style={{ ["--p" as string]: 0, background: SKY }}>
      <div className="relative mx-auto grid min-h-[80svh] max-w-6xl items-center gap-10 px-4 pt-32 pb-6 md:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:pt-32">
        {/* Copy: moves a little slower than the page */}
        <div data-band="sky" style={{ transform: "translate3d(0, calc(var(--p) * 90px), 0)" }}>
          {children}
        </div>

        {/* The bill card: floats a little faster, like a nearer layer */}
        <div className="hidden lg:block" style={{ transform: "translate3d(0, calc(var(--p) * -45px), 0)" }}>
          <div className="border border-line bg-card p-6 text-ink">
            <div className="flex items-baseline justify-between text-xs text-muted">
              <span>{card.title}</span>
              <span className="flex items-center gap-3">
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 bg-line-strong" />{card.before}</span>
                <span className="flex items-center gap-1.5"><i className="h-2 w-2 bg-brand" />{card.withUs}</span>
              </span>
            </div>
            <div className="mt-5 flex h-44 items-end gap-2.5">
              {BILLS.map((v, i) => {
                const after = i >= 3;
                return (
                <div key={i} className="relative flex-1" style={{ height: "100%" }}>
                  {after && <div className="absolute inset-0 border border-dashed border-brand" title={`${card.was} ${money(BEFORE)}`} />}
                  <div
                    className={`absolute inset-x-0 bottom-0 ${after ? "bg-brand" : "rounded-t-[14px] bg-line-strong"}`}
                    style={{ height: `${(v / BEFORE) * 100}%` }}
                  />
                </div>
                );
              })}
            </div>
            <div className="mt-2 flex gap-2.5 text-center text-xs text-muted">
              {card.months.map((m) => (
                <span key={m} className="flex-1">{m}</span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line pt-3">
              <div>
                <p className="text-xs text-muted">{card.before}</p>
                <p className="num mt-1 font-semibold">{money(BEFORE)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">{card.after}</p>
                <p className="num mt-1 font-semibold">{money(AFTER)}</p>
              </div>
              <div className="col-span-2 flex items-baseline justify-between border-t border-line pt-3">
                <p className="text-xs text-muted">{card.saved}</p>
                <p className="num font-display whitespace-nowrap text-2xl font-semibold text-brand">{money(BEFORE - AFTER)}</p>
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
