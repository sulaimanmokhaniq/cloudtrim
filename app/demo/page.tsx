"use client";

import { useEffect, useState } from "react";
import { CountUp, TiltCard } from "@/components/Interactive";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { WhatsAppModal, waAlertTypes, type WaSubscription } from "@/components/WhatsAppAlerts";
import {
  type Finding,
  byService,
  company,
  findings,
  monthlyTrend,
  providers,
  readOnlyPermissions,
  riskLabel,
  sar,
  totalSavings,
} from "@/lib/data";

type Tab = "overview" | "findings" | "connect" | "alerts" | "audit";
type AuditEntry = { time: string; actor: string; event: string };

const tabs: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "findings", label: "Recommendations" },
  { id: "connect", label: "Cloud accounts" },
  { id: "alerts", label: "Alerts" },
  { id: "audit", label: "Audit log" },
];

const initialAudit: AuditEntry[] = [
  { time: "09:12", actor: "CloudTrim Agent", event: "Scan complete: 342 resources, 7 savings found" },
  { time: "09:12", actor: "CloudTrim Agent", event: "WhatsApp alert sent to Sara (engineering lead)" },
  { time: "08:00", actor: "System", event: "Connection verified: read-only ✓" },
];

function now() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export default function Demo() {
  const [tab, setTab] = useState<Tab>("overview");
  const [done, setDone] = useState<Set<string>>(new Set());
  const [audit, setAudit] = useState<AuditEntry[]>(initialAudit);
  const [approving, setApproving] = useState<Finding | null>(null);
  const [consultOpen, setConsultOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState(company.name);
  const [waOpen, setWaOpen] = useState(false);
  const [waSub, setWaSub] = useState<WaSubscription | null>(null);

  useEffect(() => {
    const name = new URLSearchParams(window.location.search).get("company")?.trim();
    if (name) setCompanyName(name.slice(0, 60));
  }, []);

  const realized = findings.filter((f) => done.has(f.id)).reduce((s, f) => s + f.monthlySavings, 0);

  function log(event: string, actor = "Sara") {
    setAudit((a) => [{ time: now(), actor, event }, ...a]);
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-bg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 pt-3 md:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className=" border border-amber/40 bg-amber-soft px-2.5 py-0.5 text-xs text-amber">Demo data</span>
          </div>
          <div className="flex w-full flex-wrap items-center gap-2 text-sm sm:w-auto">
            <span className="hidden text-muted sm:inline">{companyName}</span>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") window.print();
              }}
              className="btn-ghost border border-line whitespace-nowrap px-3 py-2 text-xs font-semibold text-ink flex items-center gap-1.5"
            >
              <span>📄 PDF Report</span>
            </button>
            <button
              type="button"
              onClick={() => setWaOpen(true)}
              className={`btn-ghost border whitespace-nowrap px-3 py-2 text-xs font-semibold flex items-center gap-1.5 ${
                waSub ? "border-brand/50 bg-brand-soft text-brand" : "border-line text-ink"
              }`}
            >
              <span>{waSub ? "✓ WhatsApp alerts on" : "💬 WhatsApp alerts"}</span>
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-x-1 px-4 sm:flex-nowrap sm:overflow-x-auto md:px-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-2.5 py-3 text-[13px] transition-colors sm:px-3 sm:text-sm ${ tab === t.id ? "border-brand text-ink" : "border-transparent text-muted hover:text-ink-2" }`}
            >
              {t.label}
              {t.id === "findings" && (
                <span className="num ml-1.5 bg-brand-soft px-1.5 text-xs text-brand">{findings.length - done.size}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        {tab === "overview" && <Overview realized={realized} goFindings={() => setTab("findings")} />}
        {tab === "findings" && (
          <Findings done={done} onApprove={(f) => setApproving(f)} onExplain={(f) => log(`Asked AI to explain: ${f.title}`)} />
        )}
        {tab === "connect" && <Connect />}
        {tab === "alerts" && (
          <Alerts
            onSent={(m) => {
              log(m, "CloudTrim Agent");
              flash(m);
            }}
          />
        )}
        {tab === "audit" && <Audit entries={audit} />}
      </main>

      {approving && (
        <ApproveModal
          finding={approving}
          onClose={() => setApproving(null)}
          onStep={(e, actor) => log(e, actor)}
          onDone={() => {
            setDone((d) => new Set(d).add(approving.id));
            flash(`Done: saving ${sar(approving.monthlySavings)} per month`);
          }}
        />
      )}
      {consultOpen && (
        <ConsultModal
          onClose={() => setConsultOpen(false)}
          onSubmit={() => {
            setConsultOpen(false);
            log("Requested a FinOps engineer");
            flash("Request sent. A FinOps engineer will reach out within one business day.");
          }}
        />
      )}
      {waOpen && (
        <WhatsAppModal
          current={waSub}
          onClose={() => setWaOpen(false)}
          onSubscribe={(sub) => {
            setWaSub(sub);
            log(`Subscribed ${sub.phone} to WhatsApp alerts: ${sub.types.map((t) => waAlertTypes.find((x) => x.id === t)?.label).join(", ")}`);
            flash("WhatsApp alerts are on (demo: no real message is sent)");
          }}
          onUnsubscribe={() => {
            if (waSub) log(`Unsubscribed ${waSub.phone} from WhatsApp alerts`);
            setWaSub(null);
            setWaOpen(false);
            flash("WhatsApp alerts are off");
          }}
        />
      )}
      {toast && (
        <div className="rise fixed bottom-6 left-1/2 z-50 -translate-x-1/2 border border-brand/40 bg-card px-5 py-3 text-sm">
          <span className="mr-2 text-brand">✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

/* ---------- Overview ---------- */

function Overview({ realized, goFindings }: { realized: number; goFindings: () => void }) {
  const forecast = monthlyTrend[monthlyTrend.length - 1].value;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="This month's bill" value={company.monthlySpend} sub="+7.3% vs last month" />
        <Kpi label="Waste found / month" value={totalSavings} sub={`${Math.round((totalSavings / company.monthlySpend) * 100)}% of the bill`} amber />
        <Kpi label="Savings realized" value={realized} sub="After your approval" accent />
        <Kpi label="Next month forecast" value={forecast} sub="If nothing changes" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" title="Monthly spend (SAR)">
          <TrendChart />
        </Card>
        <Card className="lg:col-span-2" title="Spend by service · September">
          <ServiceBars />
        </Card>
      </div>

      <Card
        title="Top savings"
        action={
          <button onClick={goFindings} className="-my-2 py-2.5 text-sm font-medium text-brand hover:underline">
            View all
          </button>
        }
      >
        <ul className="divide-y divide-line">
          {findings.slice(0, 4).map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-muted">{f.resource}</p>
              </div>
              <span className="num shrink-0 font-semibold text-brand">{sar(f.monthlySavings)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-center text-xs text-muted">
        Last scan {company.lastScan} · <span className="num">{company.resourcesScanned}</span> resources · region{" "}
        <span className="num">{company.region}</span>
      </p>
    </div>
  );
}

function TrendChart() {
  const [hover, setHover] = useState<number | null>(null);
  const max = 100000;
  const W = 560;
  const H = 230;
  const pad = { top: 16, bottom: 34, left: 52, right: 8 };
  const slot = (W - pad.left - pad.right) / monthlyTrend.length;
  const barW = Math.min(46, slot * 0.58);
  const y = (v: number) => pad.top + (H - pad.top - pad.bottom) * (1 - v / max);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Monthly spend for the last six months with October forecast">
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" className="fill-brand-soft" />
            <line x1="0" y1="0" x2="0" y2="6" className="stroke-brand" strokeWidth="2" />
          </pattern>
        </defs>
        {[0, 25000, 50000, 75000, 100000].map((g) => (
          <g key={g}>
            <line x1={pad.left} x2={W - pad.right} y1={y(g)} y2={y(g)} className="stroke-line" strokeWidth="1" />
            <text x={pad.left - 8} y={y(g) + 5} fontSize="15" className="fill-muted" textAnchor="end">
              {g === 0 ? "0" : `${g / 1000}k`}
            </text>
          </g>
        ))}
        {monthlyTrend.map((m, i) => {
          const cx = pad.left + slot * (i + 0.5);
          const top = y(m.value);
          return (
            <g key={m.month} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={cx - slot / 2} y={pad.top} width={slot} height={H - pad.top - pad.bottom} fill="transparent" />
              <path
                d={`M${cx - barW / 2},${y(0)} V${top + 4} q0,-4 4,-4 H${cx + barW / 2 - 4} q4,0 4,4 V${y(0)} Z`}
                fill={m.forecast ? "url(#hatch)" : "var(--color-brand)"}
                opacity={hover === null || hover === i ? 1 : 0.45}
                style={{ transition: "opacity .2s" }}
              />
              <text x={cx} y={H - 10} fontSize="16" className="fill-ink-2" textAnchor="middle">
                {m.month}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-2 right-2 border border-line bg-bg-2 px-3 py-2 text-sm">
          <p className="text-muted">
            {monthlyTrend[hover].month}
            {monthlyTrend[hover].forecast ? " (forecast)" : ""}
          </p>
          <p className="num font-semibold">{sar(monthlyTrend[hover].value)}</p>
        </div>
      )}
      <p className="mt-2 flex items-center gap-2 text-xs text-muted">
        <span className="inline-block h-3 w-3" style={{ background: "repeating-linear-gradient(45deg,var(--color-brand) 0 2px,var(--color-brand-soft) 2px 5px)" }} />
        October is the AI agent&apos;s forecast
      </p>
    </div>
  );
}

function ServiceBars() {
  const max = Math.max(...byService.map((s) => s.value));
  return (
    <ul className="space-y-3.5">
      {byService.map((s) => (
        <li key={s.name} title={sar(s.value)}>
          <div className="flex justify-between text-sm">
            <span className="text-ink-2">{s.name}</span>
            <span className="num">{sar(s.value)}</span>
          </div>
          <div className="mt-1.5 h-2 bg-bg-2">
            <div className="h-2 bg-brand" style={{ width: `${(s.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Findings ---------- */

function Findings({ done, onApprove, onExplain }: { done: Set<string>; onApprove: (f: Finding) => void; onExplain: (f: Finding) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl font-semibold">AI recommendations</h1>
          <p className="mt-1 text-sm text-muted">Nothing runs without your approval. The connection is read-only.</p>
        </div>
        <p className="text-sm text-ink-2">
          Total potential: <span className="num font-semibold text-brand">{sar(totalSavings)}</span> / month
        </p>
      </div>
      {findings.map((f) => (
        <FindingCard key={f.id} f={f} done={done.has(f.id)} onApprove={() => onApprove(f)} onExplain={() => onExplain(f)} />
      ))}
    </div>
  );
}

function FindingCard({ f, done, onApprove, onExplain }: { f: Finding; done: boolean; onApprove: () => void; onExplain: () => void }) {
  const [explanation, setExplanation] = useState<{ text: string; source: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function explain() {
    if (explanation) return setExplanation(null);
    setLoading(true);
    onExplain();
    try {
      const res = await fetch("/api/explain", { method: "POST", body: JSON.stringify({ id: f.id }) });
      setExplanation(await res.json());
    } catch {
      setExplanation({ text: f.explanation, source: "cached" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className={` border bg-card p-5 transition-colors ${done ? "border-brand/50" : "border-line hover:border-muted"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className=" border border-line px-2 py-0.5 text-ink-2">{f.category}</span>
            <RiskBadge risk={f.risk} />
          </div>
          <h3 className="mt-2.5 text-lg font-semibold">{f.title}</h3>
          <p className="mt-1 font-mono text-sm text-ink-2">{f.resource}</p>
          <p className="mt-1 text-sm text-muted">{f.detail}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted">Monthly saving</p>
          <p className="num font-display text-2xl font-semibold text-brand">{sar(f.monthlySavings)}</p>
        </div>
      </div>

      <div className="mt-4 bg-bg-2 p-3 text-sm">
        <span className="font-medium">Proposed action: </span>
        <span className="text-ink-2">{f.action}</span>
      </div>

      {explanation && (
        <div className="rise mt-3 border border-brand/30 bg-brand-soft p-4 text-sm leading-6">
          <p className="mb-1 text-xs font-semibold text-brand">AI agent explanation {explanation.source === "live" ? "· live" : ""}</p>
          {explanation.text}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {done ? (
          <span className=" bg-brand-soft px-4 py-2 text-sm font-semibold text-brand">✓ Applied</span>
        ) : (
          <button onClick={onApprove} className="btn-primary  bg-brand px-4 py-2 text-sm font-semibold text-onbrand">
            Review & approve
          </button>
        )}
        <button onClick={explain} className="btn-ghost  border border-line px-4 py-2 text-sm">
          {loading ? "Analyzing..." : explanation ? "Hide explanation" : "Why? Explain"}
        </button>
      </div>
    </article>
  );
}

function RiskBadge({ risk }: { risk: Finding["risk"] }) {
  const cls = { low: "bg-brand-soft text-brand", medium: "bg-amber-soft text-amber", high: "bg-bad/15 text-bad" }[risk];
  const icon = { low: "●", medium: "▲", high: "■" }[risk];
  return (
    <span className={` px-2 py-0.5 ${cls}`}>
      {icon} {riskLabel[risk]}
    </span>
  );
}

/* ---------- Approval ---------- */

const execSteps = ["Grant scoped temporary permission (15 min)", "Apply safeguards", "Execute the action", "Revoke permission and verify"];

function ApproveModal({
  finding,
  onClose,
  onStep,
  onDone,
}: {
  finding: Finding;
  onClose: () => void;
  onStep: (e: string, actor: string) => void;
  onDone: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [step, setStep] = useState(-1);

  async function run() {
    onStep(`Approved: ${finding.title}`, "Sara");
    for (let i = 0; i < execSteps.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 900));
      onStep(`${execSteps[i]} · ${finding.title}`, "CloudTrim Agent");
    }
    setStep(execSteps.length);
    onDone();
  }

  const running = step >= 0 && step < execSteps.length;
  const finished = step === execSteps.length;

  return (
    <Modal onClose={running ? undefined : onClose}>
      <h2 className="font-display text-2xl font-semibold">Review before applying</h2>
      <p className="mt-1 text-sm text-muted">{finding.title}</p>

      {step === -1 && (
        <>
          <dl className="mt-5 space-y-3 text-sm">
            <Row k="Resource" v={<span className="font-mono">{finding.resource}</span>} />
            <Row k="Action" v={finding.action} />
            <Row k="Monthly saving" v={<span className="num font-semibold text-brand">{sar(finding.monthlySavings)}</span>} />
          </dl>
          <div className="mt-5 border border-amber/40 bg-amber-soft p-4 text-sm">
            <p className="font-semibold text-amber">Temporary permission required</p>
            <p className="mt-1 font-mono text-xs text-ink-2">{finding.permission}</p>
            <p className="mt-2 text-xs text-muted">Expires automatically after 15 minutes, then the connection returns to read-only.</p>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm">
            {finding.safeguards.map((s) => (
              <li key={s} className="flex gap-2">
                <span className="text-brand">✓</span>
                {s}
              </li>
            ))}
          </ul>
          <label className="mt-5 flex items-center gap-2.5 text-sm">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="h-4 w-4 accent-brand" />
            I reviewed this action and approve it
          </label>
          <div className="mt-6 flex gap-2">
            <button
              disabled={!confirmed}
              onClick={run}
              className="btn-primary  bg-brand px-5 py-2.5 font-semibold text-onbrand enabled: disabled:opacity-40"
            >
              Approve & apply
            </button>
            <button onClick={onClose} className="btn-ghost  border border-line px-5 py-2.5">
              Cancel
            </button>
          </div>
        </>
      )}

      {step >= 0 && (
        <>
          <ol className="mt-6 space-y-3.5">
            {execSteps.map((s, i) => {
              const ok = i < step || finished;
              return (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-7 w-7 items-center justify-center text-xs ${ ok ? "bg-brand text-onbrand" : i === step ? "animate-pulse bg-brand-soft text-brand" : "bg-bg-2 text-muted" }`}
                  >
                    {ok ? "✓" : <span className="num">{i + 1}</span>}
                  </span>
                  <span className={i <= step || finished ? "" : "text-muted"}>{s}</span>
                </li>
              );
            })}
          </ol>
          {finished && (
            <div className="rise mt-6">
              <p className=" bg-brand-soft p-3 text-sm text-brand">Done. The action is in the audit log and can be rolled back at any time.</p>
              <button onClick={onClose} className="mt-4 bg-ink px-5 py-2.5 font-semibold text-bg">
                Close
              </button>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}

/* ---------- Connect ---------- */

function Connect() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold">Cloud accounts</h1>
        <p className="mt-1 text-sm text-muted">Every provider connects read-only. Nothing can change without a separate approval.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <TiltCard key={p.name} max={6} className={` border bg-card p-5 ${p.status === "connected" ? "border-brand/50 glow" : "border-line"}`}>
            <p className="font-display text-lg font-semibold">{p.name}</p>
            <p className={`mt-1 text-sm ${p.status === "connected" ? "text-brand" : "text-muted"}`}>
              {p.status === "connected" ? "✓ " : ""}
              {p.note}
            </p>
          </TiltCard>
        ))}
      </div>
      <Card title="AWS permissions we request (read-only)">
        <p className="mb-4 text-sm text-ink-2">
          A one-click CloudFormation template creates the IAM role. This is the complete list, and none of it can modify or
          delete anything:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {readOnlyPermissions.map((p) => (
            <li key={p} className=" bg-bg-2 px-3 py-2 font-mono text-xs text-ink-2">
              {p}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ---------- Alerts ---------- */

function Alerts({ onSent }: { onSent: (msg: string) => void }) {
  const [sending, setSending] = useState(false);
  const top = [...findings].sort((a, b) => b.monthlySavings - a.monthlySavings).slice(0, 3);

  async function send() {
    setSending(true);
    try {
      const res = await fetch("/api/alert", { method: "POST" });
      const data = await res.json();
      onSent(data.sent ? "Telegram alert sent" : "Test alert sent (simulated)");
    } catch {
      onSent("Test alert sent (simulated)");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-3xl font-semibold">Instant alerts</h1>
        <p className="mt-3 leading-7 text-ink-2">
          Instead of waiting for the end-of-month invoice, your engineering lead gets a WhatsApp or Telegram message the
          moment waste is found, with a direct link to approve.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-ink-2">
          <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 bg-brand" />Real-time alerts for big waste or sudden spend spikes</li>
          <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 bg-brand" />Weekly summary of savings realized</li>
          <li className="flex gap-2.5"><span className="mt-2 h-1.5 w-1.5 bg-brand" />Monthly PDF report for finance</li>
        </ul>
        <button onClick={send} disabled={sending} className="btn-primary mt-7 bg-brand px-5 py-2.5 font-semibold text-onbrand disabled:opacity-50">
          {sending ? "Sending..." : "Send a test alert"}
        </button>
      </div>

      <TiltCard max={8} className="mx-auto w-full max-w-sm border-[7px] border-[#33242a] bg-[#130c0e]">
        <div className=" bg-[#4a2228] px-5 py-3.5">
          <p className="font-semibold">CloudTrim</p>
          <p className="text-xs text-ink-2">Verified business account</p>
        </div>
        <div className="space-y-3 p-4 pb-8 text-sm">
          <div className="max-w-[90%] bg-[#21171a] p-3.5">
            <p className="font-semibold text-brand">Savings alert</p>
            <p className="mt-1 text-ink-2">
              We found <span className="num font-semibold text-ink">{sar(totalSavings)}</span> per month in savings on your AWS account:
            </p>
            <ul className="mt-2 space-y-1 text-ink-2">
              {top.map((f) => (
                <li key={f.id}>
                  • {f.title}: <span className="num text-ink">{sar(f.monthlySavings)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-brand underline">Review & approve</p>
            <p className="num mt-1 text-right text-[10px] text-muted">09:12</p>
          </div>
          <div className="ml-auto max-w-[70%] bg-[#4a2228] p-3.5">
            Approved stopping dev at night 👍
            <p className="num mt-1 text-right text-[10px] text-ink-2">09:20</p>
          </div>
        </div>
      </TiltCard>
    </div>
  );
}

/* ---------- Audit ---------- */

function Audit({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-3xl font-semibold">Audit log</h1>
        <p className="mt-1 text-sm text-muted">Every recommendation, approval and action, with time and actor, ready for NCA and ISO 27001 reviews.</p>
      </div>
      <div className="overflow-x-auto border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-bg-2 text-left text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Actor</th>
              <th className="px-4 py-3 font-medium">Event</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {entries.map((e, i) => (
              <tr key={i}>
                <td className="num px-4 py-3 text-muted">{e.time}</td>
                <td className="whitespace-nowrap px-4 py-3">{e.actor}</td>
                <td className="px-4 py-3 text-ink-2">{e.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Consult ---------- */

function ConsultModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const input = "w-full border border-line bg-bg-2 px-3.5 py-2.5 placeholder:text-muted focus:border-brand focus:outline-none";
  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-2xl font-semibold">Talk to a FinOps engineer</h2>
      <p className="mt-1 text-sm text-muted">For complex decisions: commitment plans, re-architecture, cost governance.</p>
      <form
        className="mt-5 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input required placeholder="Name" className={input} />
        <input required type="email" placeholder="Work email" className={input} />
        <textarea placeholder="What do you need help with?" rows={3} className={input} />
        <div className="flex gap-2 pt-2">
          <button className="btn-primary  bg-brand px-5 py-2.5 font-semibold text-onbrand">Send request</button>
          <button type="button" onClick={onClose} className="btn-ghost  border border-line px-5 py-2.5">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Shared ---------- */

function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="rise max-h-[90vh] w-full max-w-lg overflow-y-auto border border-line bg-card p-7" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Card({ title, children, className = "", action }: { title: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={` border border-line bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Kpi({ label, value, sub, accent, amber }: { label: string; value: number; sub: string; accent?: boolean; amber?: boolean }) {
  return (
    <TiltCard max={6} className={` border p-4 ${accent ? "border-brand/50 bg-brand-soft glow" : "border-line bg-card"}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className={`font-display mt-1 text-xl font-semibold sm:text-2xl ${accent ? "text-brand" : amber ? "text-amber" : ""}`}>
        <CountUp value={value} prefix="SAR " />
      </p>
      <p className="mt-1 text-xs text-ink-2">{sub}</p>
    </TiltCard>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-right">{v}</dd>
    </div>
  );
}
