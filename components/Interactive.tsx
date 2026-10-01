"use client";

import { useEffect, useRef, useState } from "react";

/* 3D tilt that follows the pointer. */
export function TiltCard({ children, className = "", max = 10 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  function onMove(e: React.PointerEvent) {
    const r = ref.current!.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setStyle({
      transform: `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateZ(0)`,
      ["--gx" as string]: `${(px + 0.5) * 100}%`,
      ["--gy" as string]: `${(py + 0.5) * 100}%`,
    });
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setStyle({ transform: "perspective(900px) rotateX(0) rotateY(0)" })}
      style={{ transition: "transform 0.25s ease-out", transformStyle: "preserve-3d", ...style }}
      className={`group relative ${className}`}
    >
      {children}
    </div>
  );
}

/* Animated number that counts toward its target. */
export function CountUp({ value, prefix = "", className = "" }: { value: number; prefix?: string; className?: string }) {
  const [shown, setShown] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / 500);
      const v = a + (value - a) * (1 - Math.pow(1 - k, 3));
      setShown(v);
      if (k < 1) raf = requestAnimationFrame(step);
      else from.current = value;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return (
    <span className={`num ${className}`}>
      {prefix}
      {Math.round(shown).toLocaleString("en-US")}
    </span>
  );
}

/* Savings estimator: drag the monthly bill, see a conservative recoverable range. */
export function SavingsCalculator() {
  const [bill, setBill] = useState(85000);
  const low = bill * 0.12;
  const high = bill * 0.25;
  const pct = ((bill - 10000) / (500000 - 10000)) * 100;

  return (
    <div className="grid gap-8 border border-line bg-card p-6 md:grid-cols-2 md:p-10">
      <div>
        <p className="text-sm font-medium text-brand">Savings estimator</p>
        <h3 className="font-display mt-2 text-3xl font-semibold">How much could you trim?</h3>
        <p className="mt-3 text-ink-2">
          Drag to your monthly cloud bill. We use a conservative 12 to 25% recoverable range, below the roughly 27%
          that companies report wasting (Flexera State of the Cloud).
        </p>
        <label className="mt-8 block text-sm text-muted" htmlFor="bill">
          Monthly cloud bill
        </label>
        <p className="font-display mt-1 text-4xl font-semibold">
          <CountUp value={bill} prefix="SAR " />
        </p>
        <input
          id="bill"
          type="range"
          min={10000}
          max={500000}
          step={5000}
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
          className="mt-5 h-2 w-full cursor-pointer appearance-none accent-[#f5b83d]"
          style={{ background: `linear-gradient(90deg, #f5b83d ${pct}%, #2e241c ${pct}%)` }}
        />
        <div className="mt-2 flex justify-between text-xs text-muted">
          <span>SAR 10k</span>
          <span>SAR 500k</span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-4">
        <div className=" border border-line bg-bg-2 p-5">
          <p className="text-sm text-muted">Recoverable every month</p>
          <p className="font-display mt-1 text-3xl font-semibold text-brand">
            <CountUp value={low} prefix="SAR " /> – <CountUp value={high} />
          </p>
        </div>
        <div className=" border border-line bg-bg-2 p-5">
          <p className="text-sm text-muted">Recoverable every year</p>
          <p className="font-display mt-1 text-3xl font-semibold text-amber">
            <CountUp value={low * 12} prefix="SAR " /> – <CountUp value={high * 12} />
          </p>
        </div>
        <Bars bill={bill} low={low} high={high} />
      </div>
    </div>
  );
}

function Bars({ bill, low, high }: { bill: number; low: number; high: number }) {
  const mid = (low + high) / 2;
  const keep = ((bill - mid) / bill) * 100;
  return (
    <div>
      <div className="flex h-3 overflow-hidden">
        <div className="bg-[#3a2f26] transition-all duration-500" style={{ width: `${keep}%` }} />
        <div className="ml-0.5 bg-brand transition-all duration-500" style={{ width: `${100 - keep}%` }} />
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>Needed spend</span>
        <span className="text-brand">Waste CloudTrim targets</span>
      </div>
    </div>
  );
}

/* Human-in-the-loop flow that steps through itself and can be clicked. */
const flow = [
  { t: "Read-only scan", d: "IAM role can read costs and resources. It cannot change anything." },
  { t: "AI recommendation", d: "Each saving comes with evidence, risk level and a plain-language reason." },
  { t: "Human approval", d: "Your engineer reviews and approves with one click, on web or WhatsApp." },
  { t: "Scoped, temporary access", d: "A permission limited to that single action is granted for 15 minutes." },
  { t: "Safe execution", d: "Snapshot first, stop rather than delete, one-click rollback." },
  { t: "Revoke & audit", d: "Access returns to read-only and every step is logged for NCA and ISO audits." },
];

export function SafetyFlow() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % flow.length), 2200);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]" onMouseLeave={() => setPaused(false)}>
      <ol className="relative space-y-2">
        <span className="absolute top-4 bottom-4 left-[19px] w-px bg-line" aria-hidden />
        {flow.map((s, i) => (
          <li key={s.t}>
            <button
              onMouseEnter={() => {
                setPaused(true);
                setActive(i);
              }}
              onClick={() => setActive(i)}
              className={`relative flex w-full items-center gap-4 px-1 py-2.5 text-left transition-colors ${ active === i ? "text-ink" : "text-muted hover:text-ink-2" }`}
            >
              <span
                className={`num relative z-10 flex h-10 w-10 shrink-0 items-center justify-center border text-sm font-semibold transition-all ${ active === i ? "border-brand bg-brand text-bg" : i < active ? "border-brand/50 bg-card text-brand" : "border-line bg-card" }`}
              >
                {i + 1}
              </span>
              <span className="font-medium">{s.t}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="relative flex min-h-64 items-center overflow-hidden border border-line bg-card p-8">
        <div className="grid-bg absolute inset-0 opacity-60" aria-hidden />
        <div key={active} className="rise relative">
          <p className="num text-sm text-brand">Step {active + 1} of {flow.length}</p>
          <h3 className="font-display mt-2 text-2xl font-semibold">{flow[active].t}</h3>
          <p className="mt-3 leading-7 text-ink-2">{flow[active].d}</p>
          <div className="mt-6 flex gap-1.5">
            {flow.map((_, i) => (
              <span key={i} className={`h-1 flex-1 transition-colors ${i <= active ? "bg-brand" : "bg-line"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
