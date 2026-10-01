"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { CountUp } from "@/components/Interactive";
import { company, findings, providers, readOnlyPermissions, sar, totalSavings } from "@/lib/data";

// Simulated onboarding: create account -> connect cloud read-only -> AI analysis -> dashboard.
// Nothing is sent anywhere; it walks the judges through the real product flow.

const STEPS = ["Create account", "Connect cloud", "AI analysis", "Your dashboard"];

export default function Start() {
  const [step, setStep] = useState(0);
  const [account, setAccount] = useState({ name: "", email: "", company: "" });

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-bg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 md:px-6">
          <Logo />
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-sm text-muted hover:text-ink">
              Skip to demo dashboard
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 md:px-6">
        <Stepper step={step} />
        <div className="mt-10">
          {step === 0 && (
            <CreateAccount
              value={account}
              onChange={setAccount}
              onNext={() => setStep(1)}
            />
          )}
          {step === 1 && <ConnectCloud onBack={() => setStep(0)} onNext={() => setStep(2)} />}
          {step === 2 && <Analysis onDone={() => setStep(3)} />}
          {step === 3 && <Results company={account.company || company.name} name={account.name} />}
        </div>
      </main>
    </div>
  );
}

function Stepper({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4 border border-line">
      {STEPS.map((s, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li
            key={s}
            className={`flex items-center gap-3 border-line px-3 py-3 md:px-4 ${i > 0 ? "border-l" : ""} ${
              active ? "bg-brand text-onbrand" : done ? "bg-card text-ink" : "bg-bg text-muted"
            }`}
          >
            <span
              className={`num flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-semibold ${
                active ? "border-onbrand" : done ? "border-brand bg-brand text-onbrand" : "border-line"
              }`}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className="hidden text-sm font-semibold sm:inline">{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

function StepHeader({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="max-w-2xl">
      <p className="micro text-brand">Step {n} of 4</p>
      <h1 className="font-display mt-3 text-4xl font-bold tracking-[-0.03em]">{title}</h1>
      <p className="mt-3 leading-7 text-ink-2">{body}</p>
    </div>
  );
}

/* ---------- 1. Create account ---------- */

function CreateAccount({
  value,
  onChange,
  onNext,
}: {
  value: { name: string; email: string; company: string };
  onChange: (v: { name: string; email: string; company: string }) => void;
  onNext: () => void;
}) {
  const [password, setPassword] = useState("");
  const field = "w-full border border-line bg-bg-2 px-4 py-3 placeholder:text-muted focus:border-brand focus:outline-none";
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
      <div>
        <StepHeader n={1} title="Create your free account" body="One minute, no credit card. Your first scan and full waste report are free." />
        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
        >
          <Field label="Full name">
            <input required className={field} placeholder="Sara Al-Qahtani" value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} />
          </Field>
          <Field label="Work email">
            <input required type="email" className={field} placeholder="sara@company.sa" value={value.email} onChange={(e) => onChange({ ...value, email: e.target.value })} />
          </Field>
          <Field label="Company">
            <input required className={field} placeholder="Nakhla Tech" value={value.company} onChange={(e) => onChange({ ...value, company: e.target.value })} />
          </Field>
          <Field label="Password">
            <input required type="password" minLength={8} className={field} placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button className="btn-primary arrow bg-brand px-6 py-3 font-semibold text-onbrand">Create account</button>
            <button
              type="button"
              onClick={() => {
                onChange({ name: "Sara Al-Qahtani", email: "sara@nakhla.sa", company: "Nakhla Tech" });
                setPassword("demo-password");
              }}
              className="text-sm text-muted underline underline-offset-4 hover:text-ink"
            >
              Fill sample details
            </button>
          </div>
        </form>
      </div>
      <aside className="self-start border border-line bg-card p-6">
        <p className="micro text-muted">What you get</p>
        <ul className="mt-4 space-y-3 text-sm text-ink-2">
          {[
            "Full waste report for one cloud account",
            "Bill forecast for next month",
            "Savings ranked by value and risk",
            "Data stays in the Kingdom (PDPL)",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 bg-brand" />
              {t}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-ink-2">{label}</span>
      {children}
    </label>
  );
}

/* ---------- 2. Connect cloud ---------- */

type ConnState = "idle" | "verifying" | "verified";
type Method = "keys" | "role";

const SAMPLE_KEY_ID = "AKIAIOSFODNN7EXAMPLE";
const SAMPLE_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRiCYEXAMPLEKEY";
const REGIONS = [
  { id: "me-central-1", label: "Middle East (UAE) me-central-1" },
  { id: "me-south-1", label: "Middle East (Bahrain) me-south-1" },
  { id: "eu-central-1", label: "Europe (Frankfurt) eu-central-1" },
];

// Demo validation: the value only has to look like an AWS key. Nothing is sent anywhere.
const keyIdOk = (v: string) => /^(AKIA|ASIA)[A-Z0-9]{12,}$/.test(v.trim().toUpperCase());
const secretOk = (v: string) => v.trim().length >= 20;
const arnOk = (v: string) => /^arn:aws:iam::\d{12}:role\/[\w+=,.@-]+$/.test(v.trim());

function ConnectCloud({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [provider, setProvider] = useState("AWS");
  const [method, setMethod] = useState<Method>("keys");
  const [keyId, setKeyId] = useState("");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [region, setRegion] = useState(REGIONS[0].id);
  const [arn, setArn] = useState("");
  const [launching, setLaunching] = useState(false);
  const [state, setState] = useState<ConnState>("idle");
  const [checks, setChecks] = useState(0);
  const [touched, setTouched] = useState(false);

  const ready = method === "keys" ? keyIdOk(keyId) && secretOk(secret) : arnOk(arn);
  const checkList = [
    method === "keys" ? "Keys accepted by AWS STS, account 4829-1037-5516" : "Role found and trust policy valid",
    `${readOnlyPermissions.length} read permissions confirmed`,
    "No write, stop or delete permissions",
    "Cost data accessible for the last 6 months",
  ];

  function reset() {
    setState("idle");
    setChecks(0);
  }

  function launch() {
    setLaunching(true);
    setTimeout(() => {
      setArn("arn:aws:iam::482910375516:role/CloudTrimReadOnly");
      setLaunching(false);
      reset();
    }, 1400);
  }

  function verify() {
    setTouched(true);
    if (!ready) return;
    setState("verifying");
    setChecks(0);
    checkList.forEach((_, i) =>
      setTimeout(() => {
        setChecks(i + 1);
        if (i === checkList.length - 1) setState("verified");
      }, 600 * (i + 1)),
    );
  }

  const field =
    "w-full border border-line bg-bg-2 px-3 py-2.5 font-mono text-sm placeholder:text-muted focus:border-brand focus:outline-none";
  const locked = state !== "idle";

  return (
    <div>
      <StepHeader
        n={2}
        title="Connect your cloud through its API"
        body="Paste a read-only API key, or create a read-only role. CloudTrim can read costs and resources, and it cannot change anything."
      />

      <div className="mt-8 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
        {providers.map((p) => {
          const available = p.status === "connected";
          const selected = provider === p.name;
          return (
            <button
              key={p.name}
              disabled={!available}
              onClick={() => setProvider(p.name)}
              className={`p-4 text-left transition-colors ${
                selected ? "bg-brand text-onbrand" : available ? "bg-card hover:bg-card-2" : "cursor-not-allowed bg-bg text-muted"
              }`}
            >
              <p className="font-semibold">{p.name}</p>
              <p className={`mt-1 text-xs ${selected ? "text-onbrand" : "text-muted"}`}>{available ? "Available now" : "Coming soon"}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="border border-line bg-card p-6">
          <div className="grid grid-cols-2 border border-line text-sm font-semibold">
            {(
              [
                ["keys", "API access key"],
                ["role", "IAM role (recommended)"],
              ] as const
            ).map(([m, label]) => (
              <button
                key={m}
                onClick={() => {
                  setMethod(m);
                  setTouched(false);
                  reset();
                }}
                className={`px-3 py-2.5 transition-colors ${method === m ? "bg-ink text-bg" : "text-ink-2 hover:text-ink"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {method === "keys" ? (
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm text-ink-2">Access key ID</span>
                <input
                  value={keyId}
                  disabled={locked}
                  onChange={(e) => setKeyId(e.target.value)}
                  placeholder="AKIA..."
                  autoComplete="off"
                  spellCheck={false}
                  className={field}
                />
                {touched && !keyIdOk(keyId) && (
                  <span className="mt-1 block text-xs text-bad">Starts with AKIA or ASIA, followed by letters and numbers.</span>
                )}
              </label>
              <label className="block">
                <span className="mb-1.5 flex justify-between text-sm text-ink-2">
                  Secret access key
                  <button type="button" onClick={() => setShowSecret((s) => !s)} className="text-xs text-muted hover:text-ink">
                    {showSecret ? "Hide" : "Show"}
                  </button>
                </span>
                <input
                  type={showSecret ? "text" : "password"}
                  value={secret}
                  disabled={locked}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="40-character secret"
                  autoComplete="off"
                  spellCheck={false}
                  className={field}
                />
                {touched && !secretOk(secret) && <span className="mt-1 block text-xs text-bad">The secret is at least 20 characters.</span>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm text-ink-2">Region</span>
                <select value={region} disabled={locked} onChange={(e) => setRegion(e.target.value)} className={field}>
                  {REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                disabled={locked}
                onClick={() => {
                  setKeyId(SAMPLE_KEY_ID);
                  setSecret(SAMPLE_SECRET);
                }}
                className="text-sm text-muted underline underline-offset-4 hover:text-ink disabled:opacity-40"
              >
                Use sample demo keys
              </button>
              <p className="border-l-2 border-brand bg-brand-soft px-3 py-2 text-xs leading-5 text-ink-2">
                Demo mode: keys stay in this browser and are never sent or stored. In production, keys belong to a user
                with only the read permissions listed below, and we recommend the IAM role instead.
              </p>
            </div>
          ) : (
            <div className="mt-5">
              <p className="text-sm leading-6 text-ink-2">
                One click opens AWS CloudFormation with our template. It creates a role named{" "}
                <span className="font-mono text-ink">CloudTrimReadOnly</span> with no long-lived keys.
              </p>
              <button
                onClick={launch}
                disabled={launching || !!arn}
                className="btn-primary mt-4 bg-brand px-5 py-2.5 text-sm font-semibold text-onbrand"
              >
                {launching ? "Creating role in AWS..." : arn ? "✓ Role created" : "Launch CloudFormation stack"}
              </button>
              <label className="mt-5 block">
                <span className="mb-1.5 block text-sm text-ink-2">Role ARN</span>
                <input
                  value={arn}
                  disabled={locked}
                  onChange={(e) => setArn(e.target.value)}
                  placeholder="arn:aws:iam::<account-id>:role/CloudTrimReadOnly"
                  className={`${field} text-xs`}
                />
                {touched && !arnOk(arn) && <span className="mt-1 block text-xs text-bad">Use the format arn:aws:iam::123456789012:role/Name</span>}
              </label>
            </div>
          )}
        </div>

        <div className="border border-line bg-card p-6">
          <p className="micro text-muted">Read-only permissions requested</p>
          <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {readOnlyPermissions.map((p) => (
              <li key={p} className="bg-bg-2 px-2.5 py-1.5 font-mono text-xs break-all text-ink-2">
                {p}
              </li>
            ))}
          </ul>
          <button
            onClick={verify}
            disabled={state !== "idle"}
            className="btn-ghost mt-6 px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
          >
            {state === "verifying" ? "Testing connection..." : state === "verified" ? "✓ Connected" : "Test connection"}
          </button>
          <ul className="mt-5 space-y-2.5 text-sm">
            {checkList.map((c, i) => (
              <li key={c} className={`flex items-center gap-3 ${i < checks ? "text-ink" : "text-muted"}`}>
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border text-[10px] ${
                    i < checks ? "border-sage bg-sage text-bg" : "border-line"
                  }`}
                >
                  {i < checks ? "✓" : ""}
                </span>
                {c}
              </li>
            ))}
          </ul>
          {state === "verified" && (
            <p className="mt-5 text-sm text-ink-2">
              Connected to AWS in <span className="font-mono text-ink">{method === "keys" ? region : "me-central-1"}</span>.
              Ready for the AI analysis.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8 flex gap-3">
        <button onClick={onBack} className="btn-ghost px-5 py-3 font-semibold">
          Back
        </button>
        <button onClick={onNext} disabled={state !== "verified"} className="btn-primary arrow bg-brand px-6 py-3 font-semibold text-onbrand">
          Start AI analysis
        </button>
      </div>
    </div>
  );
}

/* ---------- 3. AI analysis ---------- */

const PHASES = [
  "Reading 6 months of cost and usage data",
  "Mapping resources across regions",
  "Checking utilization: CPU, network, attachments",
  "Detecting idle, orphaned and oversized resources",
  "Estimating savings and risk for each finding",
  "Writing plain-language explanations",
];

function Analysis({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  const [found, setFound] = useState(0);
  const [scanned, setScanned] = useState(0);
  const done = phase >= PHASES.length;
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    PHASES.forEach((_, i) => setTimeout(() => setPhase(i + 1), 900 * (i + 1)));
    const total = PHASES.length * 900;
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / total);
      setScanned(Math.round(company.resourcesScanned * k));
      setFound(Math.min(findings.length, Math.floor(k * (findings.length + 0.999))));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const savedSoFar = findings.slice(0, found).reduce((s, f) => s + f.monthlySavings, 0);

  return (
    <div>
      <StepHeader
        n={3}
        title={done ? "Analysis complete" : "The AI agent is analyzing your cloud"}
        body="The agent reads your costs and resource metrics, finds waste, and ranks every saving by value and risk."
      />
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="border border-line bg-card p-6">
          <div className="grid grid-cols-3 gap-px bg-line">
            <Metric label="Resources scanned" value={<CountUp value={scanned} />} />
            <Metric label="Findings" value={<CountUp value={found} />} />
            <Metric label="Savings / month" value={<CountUp value={savedSoFar} prefix="SAR " />} accent />
          </div>
          <div className="mt-6 h-2 bg-bg-2">
            <div className="h-2 bg-brand transition-all duration-700" style={{ width: `${(phase / PHASES.length) * 100}%` }} />
          </div>
          <ol className="mt-6 space-y-3 text-sm">
            {PHASES.map((p, i) => (
              <li key={p} className={`flex items-center gap-3 ${i < phase ? "text-ink" : i === phase ? "text-brand" : "text-muted"}`}>
                <span
                  className={`flex h-5 w-5 items-center justify-center border text-[10px] ${
                    i < phase ? "border-brand bg-brand text-onbrand" : i === phase ? "animate-pulse border-brand" : "border-line"
                  }`}
                >
                  {i < phase ? "✓" : ""}
                </span>
                {p}
              </li>
            ))}
          </ol>
        </div>
        <div className="border border-line bg-card p-6">
          <p className="micro text-muted">Live findings</p>
          <ul className="mt-4 divide-y divide-line">
            {findings.slice(0, found).map((f) => (
              <li key={f.id} className="rise flex items-center justify-between gap-4 py-3 text-sm">
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="font-mono text-xs text-muted">{f.resource}</p>
                </div>
                <span className="num shrink-0 font-semibold text-brand">{sar(f.monthlySavings)}</span>
              </li>
            ))}
            {found === 0 && <li className="py-3 text-sm text-muted">Waiting for the first finding...</li>}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <button onClick={onDone} disabled={!done} className="btn-primary arrow bg-brand px-6 py-3 font-semibold text-onbrand">
          See my dashboard
        </button>
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="bg-card p-3">
      <p className="text-xs text-muted">{label}</p>
      <p className={`font-display mt-1 text-xl font-bold ${accent ? "text-brand" : ""}`}>{value}</p>
    </div>
  );
}

/* ---------- 4. Results ---------- */

function Results({ company: companyName, name }: { company: string; name: string }) {
  const top = [...findings].sort((a, b) => b.monthlySavings - a.monthlySavings).slice(0, 3);
  const pct = Math.round((totalSavings / company.monthlySpend) * 100);
  return (
    <div>
      <StepHeader
        n={4}
        title={`${name ? name.split(" ")[0] + ", y" : "Y"}our dashboard is ready`}
        body="Statistics and AI feedback are now in your dashboard. Nothing changes in your cloud until you approve it."
      />
      <div className="mt-8 grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        <Stat label="Monthly bill" value={sar(company.monthlySpend)} />
        <Stat label="Waste found" value={sar(totalSavings)} tone="text-amber" />
        <Stat label="Share of bill" value={`${pct}%`} />
        <Stat label="Yearly savings potential" value={sar(totalSavings * 12)} tone="text-brand" />
      </div>
      <div className="mt-6 border border-line bg-card p-6">
        <p className="micro text-muted">AI feedback · top 3</p>
        <ul className="mt-4 divide-y divide-line">
          {top.map((f) => (
            <li key={f.id} className="grid gap-2 py-4 md:grid-cols-[1fr_auto] md:items-start md:gap-8">
              <div>
                <p className="font-semibold">{f.title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-2">{f.explanation}</p>
              </div>
              <span className="num font-display text-lg font-bold text-brand">{sar(f.monthlySavings)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/demo?company=${encodeURIComponent(companyName)}`} className="btn-primary arrow bg-brand px-6 py-3 font-semibold text-onbrand">
          Open my dashboard
        </Link>
        <Link href="/" className="btn-ghost px-6 py-3 font-semibold">
          Back to home
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="bg-card p-5">
      <p className="text-xs text-muted">{label}</p>
      <p className={`num font-display mt-1 text-2xl font-bold ${tone}`}>{value}</p>
    </div>
  );
}
