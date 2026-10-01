import Link from "next/link";
import CloudGlow3D from "@/components/CloudGlow3D";
import { Reveal } from "@/components/Reveal";
import { SafetyFlow, SavingsCalculator, TiltCard } from "@/components/Interactive";
import { Logo } from "@/components/Logo";
import { TEAM_NAME, company, findings, sar, totalSavings } from "@/lib/data";

const problems = [
  {
    stat: "~27%",
    title: "of cloud spend is wasted",
    body: "Idle servers, orphaned disks and forgotten snapshots are billed every month without anyone noticing.",
    source: "Flexera State of the Cloud",
  },
  {
    stat: "Local",
    title: "clouds left out by global tools",
    body: "No mainstream tool brings STC Cloud, SCCC and CNTXT together with AWS, Azure and Google Cloud in one view.",
  },
  {
    stat: "1 click",
    title: "is all it takes to cause downtime",
    body: "Engineers avoid automation tools because one wrong shutdown can take a critical service offline.",
  },
  {
    stat: "Fixed",
    title: "enterprise subscriptions",
    body: "Global FinOps platforms are priced for large enterprises, not for 50 to 250 person companies.",
  },
];

const steps = [
  { n: "01", title: "Sign up free", body: "One minute, no credit card." },
  { n: "02", title: "Connect read-only", body: "A one-click IAM role that can read costs and resources, and nothing else." },
  { n: "03", title: "AI agent scans", body: "Finds waste, forecasts next month and ranks savings by value and risk." },
  { n: "04", title: "You decide", body: "Get an alert on WhatsApp or Telegram, approve in one click or call a FinOps engineer." },
];

const providers = [
  { name: "STC Cloud", color: "#e8684a" },
  { name: "SCCC Alibaba", color: "#9fd59a" },
  { name: "CNTXT", color: "#f5b83d" },
  { name: "AWS", color: "#f5b83d" },
  { name: "Azure", color: "#9fd59a" },
  { name: "Google Cloud", color: "#e8684a" },
];
const compliance = [
  { k: "NCA ECC", v: "National Cybersecurity Authority controls" },
  { k: "PDPL", v: "Personal Data Protection Law" },
  { k: "ISO 27001", v: "Information security management" },
  { k: "ISO 27017", v: "Cloud security controls" },
];

export default function Home() {
  return (
    <main className="overflow-x-clip">
      {/* Floating capsule nav */}
      <header className="fixed inset-x-0 top-4 z-30 px-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between border border-line/80 bg-card py-2 pr-2 pl-5">
          <Logo />
          <nav className="hidden gap-8 text-sm text-ink-2 md:flex">
            <a href="#problem" className="hover:text-ink">Problem</a>
            <a href="#how" className="hover:text-ink">How it works</a>
            <a href="#safety" className="hover:text-ink">Safety</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
          </nav>
          <div className="flex items-center gap-1">
            <Link href="/demo" className="hidden px-4 py-2 text-sm text-ink-2 hover:text-ink sm:block">
              Dashboard
            </Link>
            <Link href="/demo" className="btn-primary arrow bg-brand px-4 py-2 text-sm font-semibold text-bg">
              Get a demo
            </Link>
          </div>
        </div>
      </header>

      {/* Hero: the 3D scene bleeds across the whole section */}
      <section className="ember-mesh relative min-h-[100svh] overflow-hidden">
        <CloudGlow3D className="absolute inset-0 hidden lg:block" />
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pt-32 md:px-6 lg:flex-row lg:items-center lg:pt-16">
          <div className="max-w-xl">
            <p className="rise micro text-brand">AI FinOps · Saudi Arabia & GCC</p>
            <h1 className="rise-2 font-display mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.035em] md:text-7xl">
              Every riyal of your <span className="text-brand">cloud</span>, working. Every action, <span className="text-amber">approved</span>.
            </h1>
            <p className="rise-3 mt-6 max-w-[50ch] text-base leading-7 text-muted md:text-lg">
              CloudTrim&apos;s AI agent scans your clouds with read-only access, finds the waste, and waits for your
              team&apos;s one-click approval before anything changes.
            </p>
            <div className="rise-4 mt-9 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary arrow bg-brand px-7 py-3.5 font-semibold text-bg">
                Explore the live demo
              </Link>
              <a href="#how" className="btn-ghost border border-line bg-bg px-7 py-3.5 font-semibold">
                How it works
              </a>
            </div>
            <p className="rise-4 mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
              <span>6 cloud providers</span>
              <Dot />
              <span>Read-only by default</span>
              <Dot />
              <span>Every action human-approved</span>
            </p>
          </div>
          <CloudGlow3D className="-mx-4 mt-4 h-[400px] lg:hidden" />
        </div>
      </section>

      {/* Tagline strip + provider badges */}
      <section className="border-y border-line bg-bg-2">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Reveal>
            <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Scan. <span className="text-brand">Explain.</span> Approve. <span className="text-amber">Save.</span>
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-wrap gap-2">
            {providers.map((p) => (
              <span key={p.name} className="lift flex items-center gap-2 border border-line bg-card px-3 py-2 text-sm text-ink-2">
                <CloudIcon color={p.color} />
                {p.name}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="mx-auto max-w-7xl px-4 py-28 md:px-6">
        <SectionTitle kicker="The problem" title="Growing cloud bills, and teams too afraid to automate." />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 90}>
            <TiltCard className="h-full border border-line bg-card p-6">
              <p className="font-display text-4xl font-semibold text-amber">{p.stat}</p>
              <h3 className="mt-2 font-semibold">{p.title}</h3>
              <p className="mt-3 text-sm leading-6 text-ink-2">{p.body}</p>
              {p.source && <p className="mt-4 text-xs text-muted">Source: {p.source}</p>}
            </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Calculator */}
      <section className="mx-auto max-w-7xl px-4 pb-28 md:px-6">
        <Reveal>
          <SavingsCalculator />
        </Reveal>
      </section>

      {/* How it works */}
      <section id="how" className="relative border-y border-line bg-bg-2">
        <div className="mx-auto max-w-7xl px-4 py-28 md:px-6">
          <SectionTitle kicker="How it works" title="From connection to savings in four steps." />
          <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
            <span className="absolute top-6 right-[12%] left-[12%] hidden h-px bg-line md:block" aria-hidden />
            {steps.map((s) => (
              <li key={s.n} className="relative">
                <span className="num font-display relative flex h-12 w-12 items-center justify-center border border-brand/40 bg-card text-sm font-semibold text-brand">
                  {s.n}
                </span>
                <h3 className="mt-5 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink-2">{s.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-16 grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <Feature title="AI agent for the daily work" body="Continuously scans resources and explains each recommendation: why it is waste, what it saves, and what changes." />
              <Feature title="A FinOps engineer when it matters" body="For complex decisions like commitment plans and architecture changes, a human consultant takes over." />
              <Feature title="Alerts where your team already is" body="Critical savings land on WhatsApp or Telegram the moment they are found, with a link to approve." />
            </div>
            <TiltCard className=" border border-line bg-card p-6 glow" max={8}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-2">{company.name}</span>
                <span className=" bg-brand-soft px-2.5 py-0.5 text-xs text-brand">Read-only</span>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3" style={{ transform: "translateZ(30px)" }}>
                <MiniStat label="Monthly bill" value={sar(company.monthlySpend)} />
                <MiniStat label="Savings found" value={sar(totalSavings)} accent />
              </div>
              <ul className="mt-5 divide-y divide-line text-sm" style={{ transform: "translateZ(20px)" }}>
                {findings.slice(0, 4).map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-4 py-3">
                    <span className="text-ink-2">{f.title}</span>
                    <span className="num font-semibold text-brand">{sar(f.monthlySavings)}</span>
                  </li>
                ))}
              </ul>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="mx-auto max-w-7xl px-4 py-28 md:px-6">
        <SectionTitle kicker="Safety first" title="AI recommends. Humans decide." />
        <p className="mt-4 max-w-2xl text-ink-2">
          The connection is read-only by default. Changes need a separate, opt-in permission scoped to one action, that
          expires on its own.
        </p>
        <Reveal className="mt-12">
          <SafetyFlow />
        </Reveal>
      </section>

      {/* Local */}
      <section className="border-y border-line bg-bg-2">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-28 md:px-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-brand">Built for the region</p>
            <h2 className="font-display mt-3 text-4xl font-semibold tracking-tight">Every cloud you use, in one dashboard.</h2>
            <p className="mt-5 leading-8 text-ink-2">
              Local and global providers side by side, with data kept in the Kingdom and controls designed around Saudi
              cybersecurity and data protection rules.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {compliance.map((c) => (
              <TiltCard key={c.k} className=" border border-line bg-card p-5">
                <p className="font-display text-xl font-semibold">{c.k}</p>
                <p className="mt-1 text-sm text-muted">{c.v}</p>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-4 py-28 md:px-6">
        <SectionTitle kicker="Pricing" title="Pay for what you use. No fixed subscription." />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          <PriceCard title="First scan" price="Free" items={["Connect one cloud account", "Full waste report as PDF", "Top savings with expected value"]} />
          <PriceCard
            title="Usage-based"
            price="Per managed resource"
            highlight
            items={["Continuous scanning and bill forecast", "WhatsApp & Telegram alerts", "One-click remediation with audit log", "Only pay for what we manage"]}
          />
          <PriceCard title="FinOps consulting" price="Per engagement" items={["Dedicated FinOps engineer", "Commitment and reservation plans", "Cost governance across teams"]} />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-28 md:px-6">
        <div className="relative overflow-hidden border border-brand/30 bg-card p-10 md:p-14">
          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold md:text-4xl">See CloudTrim working now.</h2>
              <p className="mt-2 text-ink-2">An interactive demo on a fictional Saudi company&apos;s AWS account.</p>
            </div>
            <Link href="/demo" className="btn-primary arrow  bg-brand px-7 py-3.5 font-semibold text-bg">
              Open the live demo
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted md:flex-row md:px-6">
          <Logo />
          <span>{TEAM_NAME} · VentureX 2026</span>
        </div>
      </footer>
    </main>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal className="max-w-3xl">
      <p className="micro text-brand">{kicker}</p>
      <h2 className="font-display mt-3 text-4xl font-bold tracking-[-0.03em] md:text-5xl">{title}</h2>
    </Reveal>
  );
}

function Dot() {
  return <span className="h-1 w-1 bg-brand" aria-hidden />;
}

function CloudIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="12" viewBox="0 0 24 16" aria-hidden>
      <path d="M6 15a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 17.8 4 4.5 4.5 0 0 1 18.5 15Z" fill={color} />
    </svg>
  );
}


function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div className=" border border-line bg-card p-5">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-ink-2">{body}</p>
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={` border p-3.5 ${accent ? "border-brand/40 bg-brand-soft" : "border-line bg-bg-2"}`}>
      <p className="text-xs text-muted">{label}</p>
      <p className={`num font-display mt-1 text-xl font-semibold ${accent ? "text-brand" : ""}`}>{value}</p>
    </div>
  );
}

function PriceCard({ title, price, items, highlight }: { title: string; price: string; items: string[]; highlight?: boolean }) {
  return (
    <TiltCard className={` border p-7 ${highlight ? "border-brand/50 bg-card glow" : "border-line bg-card"}`} max={6}>
      {highlight && <span className="btn-primary absolute top-5 right-5 bg-brand px-2.5 py-0.5 text-xs font-semibold text-bg">Core</span>}
      <h3 className="text-ink-2">{title}</h3>
      <p className="font-display mt-2 text-2xl font-semibold">{price}</p>
      <ul className="mt-6 space-y-2.5 text-sm text-ink-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-brand" />
            {i}
          </li>
        ))}
      </ul>
    </TiltCard>
  );
}
