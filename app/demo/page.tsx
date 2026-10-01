"use client";

import Link from "next/link";
import { useState } from "react";
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
  { id: "overview", label: "نظرة عامة" },
  { id: "findings", label: "التوصيات" },
  { id: "connect", label: "ربط السحابة" },
  { id: "alerts", label: "التنبيهات" },
  { id: "audit", label: "سجل التدقيق" },
];

// The scoped, temporary permission each remediation would request.
const scopedPermission: Record<string, string> = {
  "dev-schedule": "ec2:StopInstances, ec2:StartInstances على 8 سيرفرات env=dev",
  "rds-rightsize": "rds:ModifyDBInstance, rds:CreateDBSnapshot على orders-db",
  "idle-ec2": "ec2:StopInstances على staging-api-old",
  "old-snapshots": "ec2:ModifySnapshotTier على 41 snapshot",
  "gp2-gp3": "ec2:ModifyVolume على 23 قرص",
  "orphan-ebs": "ec2:CreateSnapshot, ec2:DeleteVolume على 6 أقراص",
  "unused-eip": "ec2:ReleaseAddress على 3 عناوين",
};

const initialAudit: AuditEntry[] = [
  { time: "09:12", actor: "CloudTrim Agent", event: "اكتمل الفحص: 342 مورد، 7 فرص توفير" },
  { time: "09:12", actor: "CloudTrim Agent", event: "أُرسل تنبيه WhatsApp إلى م. سارة (المسؤولة التقنية)" },
  { time: "08:00", actor: "النظام", event: "تحقق من صلاحية الربط: قراءة فقط ✓" },
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

  const realized = findings.filter((f) => done.has(f.id)).reduce((s, f) => s + f.monthlySavings, 0);

  function log(event: string, actor = "م. سارة") {
    setAudit((a) => [{ time: now(), actor, event }, ...a]);
  }

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }

  function complete(f: Finding) {
    setDone((d) => new Set(d).add(f.id));
    flash(`تم التنفيذ: توفير ${sar(f.monthlySavings)} شهرياً`);
  }

  return (
    <div className="min-h-screen">
      <header className="bg-navy text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold" dir="ltr">CloudTrim</Link>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80">عرض تجريبي</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-white/70 sm:inline">{company.name}</span>
            <button
              onClick={() => setConsultOpen(true)}
              className="rounded-lg border border-white/25 px-3 py-1.5 hover:bg-white/10"
            >
              اطلب مهندس FinOps
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-2.5 text-sm ${
                tab === t.id ? "border-[#5fd3b0] text-white" : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              {t.label}
              {t.id === "findings" && (
                <span className="num mr-1.5 rounded-full bg-white/15 px-1.5 text-xs">{findings.length - done.size}</span>
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {tab === "overview" && <Overview realized={realized} goFindings={() => setTab("findings")} />}
        {tab === "findings" && (
          <Findings done={done} onApprove={(f) => setApproving(f)} onExplain={(f) => log(`طلب شرح AI: ${f.title}`)} />
        )}
        {tab === "connect" && <Connect />}
        {tab === "alerts" && <Alerts onSent={(m) => { log(m, "CloudTrim Agent"); flash(m); }} />}
        {tab === "audit" && <Audit entries={audit} />}
      </main>

      {approving && (
        <ApproveModal
          finding={approving}
          onClose={() => setApproving(null)}
          onStep={(e) => log(e, e.startsWith("وافق") ? "م. سارة" : "CloudTrim Agent")}
          onDone={() => complete(approving)}
        />
      )}
      {consultOpen && (
        <ConsultModal
          onClose={() => setConsultOpen(false)}
          onSubmit={() => {
            setConsultOpen(false);
            log("طلب استشارة مهندس FinOps");
            flash("تم إرسال طلبك، وسيتواصل معك مهندس FinOps خلال يوم عمل");
          }}
        />
      )}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-navy px-4 py-3 text-sm text-white shadow-xl">
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
        <Kpi label="فاتورة الشهر الحالي" value={sar(company.monthlySpend)} sub="+7.3% عن الشهر السابق" />
        <Kpi label="هدر مكتشف شهرياً" value={sar(totalSavings)} sub={`${Math.round((totalSavings / company.monthlySpend) * 100)}% من الفاتورة`} />
        <Kpi label="توفير محقق" value={sar(realized)} sub="بعد موافقتك" accent />
        <Kpi label="توقع الشهر القادم" value={sar(forecast)} sub="إن لم يتغير شيء" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3" title="الإنفاق الشهري (ر.س)">
          <TrendChart />
        </Card>
        <Card className="lg:col-span-2" title="التوزيع حسب الخدمة - سبتمبر">
          <ServiceBars />
        </Card>
      </div>

      <Card
        title="أعلى فرص التوفير"
        action={<button onClick={goFindings} className="text-sm font-semibold text-brand hover:underline">عرض الكل</button>}
      >
        <ul className="divide-y divide-line">
          {findings.slice(0, 4).map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-4 py-3">
              <div>
                <p className="font-medium">{f.title}</p>
                <p className="text-sm text-muted">{f.resource}</p>
              </div>
              <span className="num shrink-0 font-semibold text-good">{sar(f.monthlySavings)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <p className="text-center text-xs text-muted">
        آخر فحص {company.lastScan} · <span className="num">{company.resourcesScanned}</span> مورد · المنطقة{" "}
        <span className="num">{company.region}</span>
      </p>
    </div>
  );
}

function TrendChart() {
  const [hover, setHover] = useState<number | null>(null);
  const max = 100000;
  const W = 560;
  const H = 220;
  const pad = { top: 16, bottom: 28, side: 8, axis: 36 };
  const slot = (W - pad.side - pad.axis) / monthlyTrend.length;
  const barW = Math.min(44, slot * 0.55);
  const y = (v: number) => pad.top + (H - pad.top - pad.bottom) * (1 - v / max);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="الإنفاق الشهري لآخر ستة أشهر مع توقع أكتوبر">
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="6" height="6" fill="#e3f4ef" />
            <line x1="0" y1="0" x2="0" y2="6" stroke="#0f8a6d" strokeWidth="2" />
          </pattern>
        </defs>
        {[0, 25000, 50000, 75000, 100000].map((g) => (
          <g key={g}>
            <line x1={pad.side} x2={W - pad.side} y1={y(g)} y2={y(g)} stroke="#e2e8ef" strokeWidth="1" />
            <text x={W - pad.side} y={y(g) - 4} fontSize="10" fill="#6b7a8a" textAnchor="end" direction="ltr">
              {g === 0 ? "0" : `${g / 1000}k`}
            </text>
          </g>
        ))}
        {/* RTL: first month on the right */}
        {monthlyTrend.map((m, i) => {
          const cx = W - pad.axis - slot * (i + 0.5);
          const top = y(m.value);
          const h = y(0) - top;
          return (
            <g key={m.month} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
              <rect x={cx - slot / 2} y={pad.top} width={slot} height={H - pad.top - pad.bottom} fill="transparent" />
              <path
                d={`M${cx - barW / 2},${y(0)} V${top + 4} q0,-4 4,-4 H${cx + barW / 2 - 4} q4,0 4,4 V${y(0)} Z`}
                fill={m.forecast ? "url(#hatch)" : "#0f8a6d"}
                opacity={hover === null || hover === i ? 1 : 0.55}
              />
              <text x={cx} y={H - 10} fontSize="11" fill="#3c4d5f" textAnchor="middle">
                {m.month}
              </text>
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-2 left-2 rounded-lg border border-line bg-card px-3 py-2 text-sm shadow">
          <p className="text-muted">{monthlyTrend[hover].month}{monthlyTrend[hover].forecast ? " (توقع)" : ""}</p>
          <p className="num font-semibold">{sar(monthlyTrend[hover].value)}</p>
        </div>
      )}
      <p className="mt-2 flex items-center gap-2 text-xs text-muted">
        <span className="inline-block h-3 w-3 rounded-sm" style={{ background: "repeating-linear-gradient(45deg,#0f8a6d 0 2px,#e3f4ef 2px 5px)" }} />
        أكتوبر توقع من الوكيل الذكي
      </p>
    </div>
  );
}

function ServiceBars() {
  const max = Math.max(...byService.map((s) => s.value));
  return (
    <ul className="space-y-3">
      {byService.map((s) => (
        <li key={s.name} title={sar(s.value)}>
          <div className="flex justify-between text-sm">
            <span>{s.name}</span>
            <span className="num text-ink-2">{sar(s.value)}</span>
          </div>
          <div className="mt-1 h-2 rounded-full bg-surface">
            <div className="h-2 rounded-full bg-brand" style={{ width: `${(s.value / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Findings ---------- */

function Findings({
  done,
  onApprove,
  onExplain,
}: {
  done: Set<string>;
  onApprove: (f: Finding) => void;
  onExplain: (f: Finding) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">توصيات الوكيل الذكي</h1>
          <p className="mt-1 text-sm text-muted">لا يُنفّذ أي إجراء إلا بموافقتك. الربط الحالي قراءة فقط.</p>
        </div>
        <p className="text-sm">
          إجمالي التوفير الممكن: <span className="num font-bold text-good">{sar(totalSavings)}</span> شهرياً
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
    <article className={`rounded-xl border bg-card p-5 ${done ? "border-good/40" : "border-line"}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-surface px-2 py-0.5 text-ink-2">{f.category}</span>
            <RiskBadge risk={f.risk} />
          </div>
          <h3 className="mt-2 text-lg font-semibold">{f.title}</h3>
          <p className="mt-1 text-sm text-ink-2">{f.resource}</p>
          <p className="mt-1 text-sm text-muted">{f.detail}</p>
        </div>
        <div className="text-left">
          <p className="text-xs text-muted">توفير شهري</p>
          <p className="num text-2xl font-bold text-good">{sar(f.monthlySavings)}</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-surface p-3 text-sm">
        <span className="font-semibold">الإجراء المقترح: </span>
        {f.action}
      </div>

      {explanation && (
        <div className="mt-3 rounded-lg border border-brand/30 bg-brand-soft p-3 text-sm leading-7">
          <p className="mb-1 text-xs font-semibold text-brand-2">
            شرح الوكيل الذكي {explanation.source === "live" ? "(مباشر)" : ""}
          </p>
          {explanation.text}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {done ? (
          <span className="flex items-center gap-1.5 rounded-lg bg-good/10 px-3 py-2 text-sm font-semibold text-good">
            ✓ تم التنفيذ
          </span>
        ) : (
          <button onClick={onApprove} className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-2">
            راجع ووافق
          </button>
        )}
        <button onClick={explain} className="rounded-lg border border-line px-4 py-2 text-sm hover:bg-surface">
          {loading ? "جارٍ التحليل..." : explanation ? "إخفاء الشرح" : "لماذا؟ اشرح لي"}
        </button>
      </div>
    </article>
  );
}

function RiskBadge({ risk }: { risk: Finding["risk"] }) {
  const cls = { low: "bg-good/10 text-good", medium: "bg-warn/10 text-warn", high: "bg-bad/10 text-bad" }[risk];
  const icon = { low: "●", medium: "▲", high: "■" }[risk];
  return (
    <span className={`rounded-full px-2 py-0.5 ${cls}`}>
      {icon} {riskLabel[risk]}
    </span>
  );
}

/* ---------- Approval ---------- */

const execSteps = [
  "إنشاء صلاحية مؤقتة محدودة (15 دقيقة)",
  "تنفيذ إجراءات الحماية",
  "تنفيذ الإجراء",
  "سحب الصلاحية المؤقتة والتحقق",
];

function ApproveModal({
  finding,
  onClose,
  onStep,
  onDone,
}: {
  finding: Finding;
  onClose: () => void;
  onStep: (e: string) => void;
  onDone: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);
  const [step, setStep] = useState(-1); // -1 = not started, execSteps.length = finished

  async function run() {
    onStep(`وافق على: ${finding.title}`);
    for (let i = 0; i < execSteps.length; i++) {
      setStep(i);
      await new Promise((r) => setTimeout(r, 900));
      onStep(`${execSteps[i]} - ${finding.title}`);
    }
    setStep(execSteps.length);
    onDone();
  }

  const running = step >= 0 && step < execSteps.length;
  const finished = step === execSteps.length;

  return (
    <Modal onClose={running ? undefined : onClose}>
      <h2 className="text-xl font-bold">مراجعة قبل التنفيذ</h2>
      <p className="mt-1 text-sm text-muted">{finding.title}</p>

      {step === -1 && (
        <>
          <dl className="mt-5 space-y-3 text-sm">
            <Row k="المورد" v={<span>{finding.resource}</span>} />
            <Row k="الإجراء" v={finding.action} />
            <Row k="التوفير الشهري" v={<span className="num font-semibold text-good">{sar(finding.monthlySavings)}</span>} />
          </dl>
          <div className="mt-5 rounded-lg border border-warn/30 bg-warn/5 p-3 text-sm">
            <p className="font-semibold">صلاحية مؤقتة مطلوبة</p>
            <p className="mt-1 text-ink-2">{scopedPermission[finding.id]}</p>
            <p className="mt-1 text-xs text-muted">تنتهي تلقائياً بعد 15 دقيقة، ويعود الربط إلى قراءة فقط.</p>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm">
            {finding.safeguards.map((s) => (
              <li key={s} className="flex gap-2"><span className="text-good">✓</span>{s}</li>
            ))}
          </ul>
          <label className="mt-5 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="h-4 w-4 accent-[#0f8a6d]" />
            راجعت الإجراء وأوافق على تنفيذه
          </label>
          <div className="mt-6 flex gap-2">
            <button
              disabled={!confirmed}
              onClick={run}
              className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white enabled:hover:bg-brand-2 disabled:opacity-40"
            >
              وافق ونفّذ
            </button>
            <button onClick={onClose} className="rounded-lg border border-line px-5 py-2.5 hover:bg-surface">إلغاء</button>
          </div>
        </>
      )}

      {step >= 0 && (
        <>
          <ol className="mt-6 space-y-3">
            {execSteps.map((s, i) => (
              <li key={s} className="flex items-center gap-3 text-sm">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    i < step || finished ? "bg-good text-white" : i === step ? "animate-pulse bg-brand-soft text-brand-2" : "bg-surface text-muted"
                  }`}
                >
                  {i < step || finished ? "✓" : <span className="num">{i + 1}</span>}
                </span>
                <span className={i <= step || finished ? "" : "text-muted"}>{s}</span>
              </li>
            ))}
          </ol>
          {finished && (
            <div className="mt-6">
              <p className="rounded-lg bg-good/10 p-3 text-sm text-good">
                تم بنجاح. سُجّل الإجراء في سجل التدقيق، ويمكن التراجع عنه في أي وقت.
              </p>
              <button onClick={onClose} className="mt-4 rounded-lg bg-navy px-5 py-2.5 font-semibold text-white">إغلاق</button>
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
        <h1 className="text-2xl font-bold">ربط السحابة</h1>
        <p className="mt-1 text-sm text-muted">نربط كل مزود بصلاحية قراءة فقط. لا نستطيع تغيير أي شيء دون موافقة منفصلة منك.</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {providers.map((p) => (
          <div key={p.name} className={`rounded-xl border bg-card p-4 ${p.status === "connected" ? "border-brand" : "border-line"}`}>
            <p className="font-semibold" dir="ltr" style={{ textAlign: "right" }}>{p.name}</p>
            <p className={`mt-1 text-sm ${p.status === "connected" ? "text-good" : "text-muted"}`}>
              {p.status === "connected" ? "✓ " : ""}{p.note}
            </p>
          </div>
        ))}
      </div>
      <Card title="الصلاحيات التي نطلبها من AWS (قراءة فقط)">
        <p className="mb-3 text-sm text-ink-2">
          يُنشأ دور IAM عبر قالب CloudFormation بنقرة واحدة. هذه هي كل الصلاحيات، ولا يوجد بينها أي صلاحية تعديل أو حذف:
        </p>
        <ul className="grid gap-2 sm:grid-cols-2" dir="ltr">
          {readOnlyPermissions.map((p) => (
            <li key={p} className="rounded-md bg-surface px-3 py-2 font-mono text-xs">{p}</li>
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
      onSent(data.sent ? "أُرسل تنبيه Telegram بنجاح" : "أُرسل تنبيه تجريبي (محاكاة)");
    } catch {
      onSent("أُرسل تنبيه تجريبي (محاكاة)");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-2">
      <div>
        <h1 className="text-2xl font-bold">التنبيهات الفورية</h1>
        <p className="mt-2 leading-8 text-ink-2">
          بدلاً من انتظار تقرير نهاية الشهر، يصل التنبيه إلى المسؤول التقني على WhatsApp أو Telegram لحظة اكتشاف الهدر،
          مع رابط مباشر للموافقة.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-ink-2">
          <li>• تنبيه فوري عند اكتشاف هدر كبير أو قفزة مفاجئة في الإنفاق</li>
          <li>• ملخص أسبوعي بالتوفير المحقق</li>
          <li>• تقرير PDF شهري للإدارة المالية</li>
        </ul>
        <button
          onClick={send}
          disabled={sending}
          className="mt-6 rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-2 disabled:opacity-50"
        >
          {sending ? "جارٍ الإرسال..." : "أرسل تنبيهاً تجريبياً"}
        </button>
      </div>

      <div className="mx-auto w-full max-w-sm rounded-[2rem] border-8 border-navy bg-[#e5ddd5] shadow-xl">
        <div className="rounded-t-[1.4rem] bg-[#075e54] px-4 py-3 text-white">
          <p className="font-semibold" dir="ltr" style={{ textAlign: "right" }}>CloudTrim</p>
          <p className="text-xs text-white/75">حساب أعمال موثّق</p>
        </div>
        <div className="space-y-3 p-4 pb-8 text-sm">
          <div className="max-w-[90%] rounded-lg rounded-tr-none bg-white p-3 shadow-sm">
            <p className="font-semibold">تنبيه توفير</p>
            <p className="mt-1">
              اكتشفنا فرص توفير بقيمة <span className="num font-semibold">{sar(totalSavings)}</span> شهرياً في حساب AWS:
            </p>
            <ul className="mt-2 space-y-1">
              {top.map((f) => (
                <li key={f.id}>
                  • {f.title}: <span className="num">{sar(f.monthlySavings)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[#075e54] underline">راجع ووافق من لوحة التحكم</p>
            <p className="mt-1 text-left text-[10px] text-muted num">09:12</p>
          </div>
          <div className="mr-auto max-w-[70%] rounded-lg rounded-tl-none bg-[#dcf8c6] p-3 shadow-sm">
            وافقت على إيقاف بيئة التطوير ليلاً 👍
            <p className="mt-1 text-left text-[10px] text-muted num">09:20</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Audit ---------- */

function Audit({ entries }: { entries: AuditEntry[] }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">سجل التدقيق</h1>
        <p className="mt-1 text-sm text-muted">كل توصية وموافقة وتنفيذ مسجل بالوقت والمسؤول، لمتطلبات NCA وISO 27001.</p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-surface text-right text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">الوقت</th>
              <th className="px-4 py-3 font-medium">المنفّذ</th>
              <th className="px-4 py-3 font-medium">الحدث</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {entries.map((e, i) => (
              <tr key={i}>
                <td className="num px-4 py-3 text-ink-2">{e.time}</td>
                <td className="whitespace-nowrap px-4 py-3">{e.actor}</td>
                <td className="px-4 py-3">{e.event}</td>
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
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold">اطلب مهندس FinOps</h2>
      <p className="mt-1 text-sm text-muted">للقرارات المعقدة: خطط الالتزام، إعادة الهيكلة، حوكمة التكاليف.</p>
      <form
        className="mt-5 space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <input required placeholder="الاسم" className="w-full rounded-lg border border-line px-3 py-2.5" />
        <input required type="email" placeholder="البريد الإلكتروني" className="w-full rounded-lg border border-line px-3 py-2.5" dir="ltr" style={{ textAlign: "right" }} />
        <textarea placeholder="ما الذي تحتاج المساعدة فيه؟" rows={3} className="w-full rounded-lg border border-line px-3 py-2.5" />
        <div className="flex gap-2 pt-2">
          <button className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-2">إرسال الطلب</button>
          <button type="button" onClick={onClose} className="rounded-lg border border-line px-5 py-2.5 hover:bg-surface">إلغاء</button>
        </div>
      </form>
    </Modal>
  );
}

/* ---------- Shared ---------- */

function Modal({ children, onClose }: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-navy/60 p-4" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

function Card({ title, children, className = "", action }: { title: string; children: React.ReactNode; className?: string; action?: React.ReactNode }) {
  return (
    <section className={`rounded-xl border border-line bg-card p-5 ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? "border-brand bg-brand-soft" : "border-line bg-card"}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className={`num mt-1 text-xl font-bold sm:text-2xl ${accent ? "text-brand-2" : ""}`}>{value}</p>
      <p className="mt-1 text-xs text-ink-2">{sub}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="text-left">{v}</dd>
    </div>
  );
}
