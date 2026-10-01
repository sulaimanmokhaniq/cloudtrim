import Link from "next/link";
import CloudGlow3D from "@/components/CloudGlow3D";
import { Reveal } from "@/components/Reveal";
import { SafetyFlow, SavingsCalculator, TiltCard } from "@/components/Interactive";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { TEAM_NAME, company, findings, sar, totalSavings } from "@/lib/data";

const problems = [
  {
    stat: "~27%",
    title: "of cloud spend is wasted",
  },
  {
    stat: "Local",
    title: "clouds left out by global tools",
  },
  {
    stat: "1 click",
    title: "can cause downtime",
  },
  {
    stat: "Fixed",
    title: "enterprise subscriptions",
  },
];

const steps = [
  { n: "01", title: "Create account", body: "Name, work email and company. One minute, no credit card." },
  { n: "02", title: "Connect via API", body: "Paste a read-only API key or create a read-only role. CloudTrim can read costs and resources, and nothing else." },
  { n: "03", title: "Analyze by AI", body: "The AI agent scans every resource, finds waste and ranks savings by value and risk." },
  { n: "04", title: "Stats & feedback", body: "Your dashboard shows the numbers and plain-language feedback on what to fix first." },
];

const providers = [
  { name: "STC Cloud", color: "var(--color-amber)" },
  { name: "SCCC Alibaba", color: "var(--color-sage)" },
  { name: "CNTXT", color: "var(--color-brand-text)" },
  { name: "AWS", color: "var(--color-brand-text)" },
  { name: "Azure", color: "var(--color-sage)" },
  { name: "Google Cloud", color: "var(--color-amber)" },
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
            <a href="#safety" className="hover:text-ink">Safety</a>
            <a href="#compliance" className="hover:text-ink">Compliance</a>
            <a href="#pricing" className="hover:text-ink">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/demo" className="hidden px-3 py-2 text-sm text-ink-2 hover:text-ink sm:block">
              Dashboard
            </Link>
            <ThemeToggle />
            <Link href="/start" className="btn-primary arrow bg-brand px-4 py-2 text-sm font-semibold text-onbrand">
              Start
            </Link>
          </div>
        </div>
      </header>

      {/* Hero: the 3D scene bleeds across the whole section */}
      <section className="relative min-h-[100svh] overflow-hidden border-b border-line">
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
              <Link href="/start" className="btn-primary arrow bg-brand px-7 py-3.5 font-semibold text-onbrand">
                Start now
              </Link>
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
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Reveal>
            <p className="font-display text-xl font-bold tracking-tight sm:text-2xl whitespace-nowrap">
              Scan, <span className="text-brand">Explain,</span> Approve, <span className="text-amber">Save.</span>
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-wrap items-center gap-2">
            {providers.map((p) => (
              <span key={p.name} className="lift flex items-center gap-1.5 border border-line bg-card px-3 py-1.5 text-xs text-ink-2">
                <CloudIcon color={p.color} />
                {p.name}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle kicker="The problem" title="Why cloud spend gets out of control." />
          <div className="mt-12 md:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <TiltCard className="h-full border border-line bg-card p-6 md:p-7 text-center flex flex-col items-center justify-center">
                  <p className="font-display text-4xl font-semibold text-amber">{p.stat}</p>
                  <h3 className="mt-3 font-semibold text-ink leading-snug">{p.title}</h3>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Safety */}
      <section id="safety" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle kicker="Safety first" title="AI recommends. Humans decide." />
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-2">
            The connection is read-only by default. Changes need a separate, opt-in permission scoped to one action, that
            expires on its own.
          </p>
          <Reveal className="mt-12 md:mt-14">
            <SafetyFlow />
          </Reveal>
        </div>
      </section>

      {/* Local / Compliance */}
      <section id="compliance" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
            <div>
              <p className="micro text-brand">Compliance</p>
              <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">Every cloud you use, in one dashboard.</h2>
              <p className="mt-5 text-base leading-8 text-ink-2">
                Local and global providers side by side, with data kept in the Kingdom and controls designed around Saudi
                cybersecurity and data protection rules.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {compliance.map((c) => (
                <TiltCard key={c.k} className="border border-line bg-card p-6">
                  <p className="font-display text-xl font-semibold text-ink">{c.k}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{c.v}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <SectionTitle kicker="Pricing" title="Pay as you go" />
          <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3">
            <PriceCard title="First scan" price="Free" items={["Connect multi cloud account", "Full waste report as PDF", "Top savings with expected value"]} />
            <PriceCard
              title="Usage-based"
              price="Per managed resource"
              highlight
              items={["Continuous scanning and bill forecast", "WhatsApp & Telegram alerts", "One-click remediation with audit log", "Only pay for what we manage"]}
            />
            <PriceCard title="FinOps consulting" price="Per engagement" items={["Dedicated FinOps engineer", "Commitment and reservation plans", "Cost governance across teams"]} />
          </div>
        </div>
      </section>

      <footer className="bg-bg py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted md:flex-row md:px-6">
          <Logo />
          <span>{TEAM_NAME} · VentureX 2026</span>
        </div>
      </footer>
    </main>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal className="max-w-5xl">
      <p className="micro text-brand">{kicker}</p>
      <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.03em] sm:text-4xl md:text-5xl">{title}</h2>
    </Reveal>
  );
}

function Dot() {
  return <span className="h-1 w-1 bg-brand" aria-hidden />;
}

function CloudIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="12" viewBox="0 0 24 16" aria-hidden>
      <path d="M6 15a5 5 0 0 1-.6-10A6.5 6.5 0 0 1 17.8 4 4.5 4.5 0 0 1 18.5 15Z" style={{ fill: color }} />
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
      {highlight && <span className="btn-primary absolute top-5 right-5 bg-brand px-2.5 py-0.5 text-xs font-semibold text-onbrand">Core</span>}
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
