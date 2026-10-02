import Link from "next/link";
import { ParallaxHero } from "@/components/ParallaxHero";
import { Horizon } from "@/components/Horizon";
import { Reveal } from "@/components/Reveal";
import { SafetyFlow, SavingsCalculator, TiltCard } from "@/components/Interactive";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { TEAM_NAME, company, findings, sar, totalSavings } from "@/lib/data";

const problems = [
  { stat: "27%", title: "of cloud spend is wasted on idle and oversized resources" },
  { stat: "3", title: "local clouds (STC, SCCC, CNTXT) that global FinOps tools leave out" },
  { stat: "1", title: "wrong click on an automated fix can take production down" },
  { stat: "12", title: "month contracts that put enterprise FinOps tools out of reach for SMEs" },
];

// Placeholder until the team sets real prices
const PRICE_PER_RESOURCE = "SAR 15";
const CTA = "Run free scan";
const GITHUB_URL = "https://github.com/sulaimanmokhaniq/cloudtrim";

const steps = [
  { n: "01", title: "Create account", body: "Name, work email and company. One minute, no credit card." },
  { n: "02", title: "Connect via API", body: "Paste a read-only API key or create a read-only role. CloudTrim can read costs and resources, and nothing else." },
  { n: "03", title: "Analyze by AI", body: "The AI agent scans every resource, finds waste and ranks savings by value and risk." },
  { n: "04", title: "Stats & feedback", body: "Your dashboard shows the numbers and plain-language feedback on what to fix first." },
];

const providers = ["STC Cloud", "SCCC Alibaba", "CNTXT", "AWS", "Azure", "Google Cloud"];
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
              {CTA}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero: pinned while the cloud layers drift and the bill gets trimmed on scroll */}
      <ParallaxHero>
        <div className="max-w-xl">
          <p className="rise micro text-brand">AI FinOps · Saudi Arabia & GCC</p>
          <h1 className="rise-2 font-display mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.02em] md:text-7xl">
            Every riyal of your <span className="text-brand">cloud</span>, working. Every action, <span className="text-amber">approved</span>.
          </h1>
          <p className="rise-3 mt-6 max-w-[50ch] text-base leading-7 text-muted md:text-lg">
            CloudTrim&apos;s AI agent scans your clouds with read-only access, finds the waste, and waits for your
            team&apos;s one-click approval before anything changes.
          </p>
          <div className="rise-4 mt-9 flex flex-wrap gap-3">
            <Link href="/start" className="btn-primary arrow bg-brand px-7 py-3.5 font-semibold text-onbrand">
              {CTA}
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
      </ParallaxHero>

      {/* Tagline strip + provider badges */}
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-7 md:px-6 lg:flex-row lg:items-center lg:justify-between">
          <Reveal>
            <p className="font-display text-xl font-bold tracking-tight sm:text-2xl whitespace-nowrap">
              Scan, <span className="text-brand">Explain,</span> Approve, <span className="text-amber">Save.</span>
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Works with">
              <li className="micro text-muted">Works with</li>
              {providers.map((p) => (
                <li key={p} className="font-display text-base font-semibold tracking-tight text-muted">
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionTitle kicker="The problem" title="Why cloud spend gets out of control." />
          <div className="mt-12 md:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {problems.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <TiltCard className="h-full border border-line bg-card p-6 md:p-7 text-center flex flex-col items-center justify-center">
                  <p className="font-display text-4xl font-semibold text-brand">{p.stat}</p>
                  <h3 className="mt-3 font-medium text-ink leading-snug">{p.title}</h3>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Dunes lead into the deeper sand band */}
      <Horizon kind="mountains" from="var(--color-bg)" back="var(--color-ridge)" mid="var(--color-band-shade)" accent="var(--color-snow)" to="var(--color-band)" />
      <div style={{ background: "var(--color-band)" }}>
      {/* Safety */}
      <section id="safety" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
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
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
            <div>
              <p className="micro text-brand">Compliance</p>
              <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">Aligned with Saudi rules from day one.</h2>
              <p className="mt-5 text-base leading-8 text-ink-2">
                Data stays in the Kingdom, and our controls are designed to align with Saudi cybersecurity and data
                protection rules. These are the frameworks we align with; CloudTrim does not claim certification.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {compliance.map((c) => (
                <TiltCard key={c.k} className="border border-line bg-card p-6">
                  <p className="text-xs text-muted">Aligned with</p>
                  <p className="font-display mt-1 text-xl font-semibold text-ink">{c.k}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{c.v}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      </div>

      {/* Waves lead into the dark band that holds pricing and the footer */}
      <Horizon kind="waves" from="var(--color-band)" back="var(--color-wave-1)" mid="var(--color-wave-2)" to="var(--color-wave-3)" />
      <div data-band="sea" className="bg-bg text-ink">
      {/* Pricing */}
      <section id="pricing" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionTitle kicker="Pricing" title="Start free, then pay per resource." />
          <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3">
            <PriceCard title="First scan" price="Free" unit="one-time, no card" cta={CTA} href="/start" items={["Connect multi cloud account", "Full waste report as PDF", "Top savings with expected value"]} />
            <PriceCard
              title="Usage-based"
              price={`From ${PRICE_PER_RESOURCE}`}
              unit="per managed resource / month"
              highlight
              cta={CTA}
              href="/start"
              items={["Continuous scanning and bill forecast", "WhatsApp & Telegram alerts", "One-click remediation with audit log", "Only pay for what we manage"]}
            />
            <PriceCard title="FinOps consulting" price="Quoted" unit="per engagement" cta="See the demo" href="/demo" items={["Dedicated FinOps engineer", "Commitment and reservation plans", "Cost governance across teams"]} />
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="border-b border-line py-20 md:py-24">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold tracking-[-0.015em] sm:text-4xl md:text-5xl">See what your cloud is wasting.</h2>
          <p className="mt-4 max-w-[48ch] text-base leading-7 text-ink-2">
            Connect a read-only key and get your first waste report free. Nothing changes without your approval.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/start" className="btn-primary arrow bg-brand px-7 py-3.5 font-semibold text-onbrand">
              {CTA}
            </Link>
            <Link href="/demo" className="border border-line-strong px-7 py-3.5 font-semibold text-ink hover:border-ink-2">
              See the demo
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="bg-bg py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted md:flex-row md:px-6">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            <Link href="/demo" className="hover:text-ink">Demo</Link>
            <Link href="/start" className="hover:text-ink">Sign up</Link>
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <a href={GITHUB_URL} className="hover:text-ink">GitHub</a>
          </nav>
          <span>{TEAM_NAME} · VentureX 2026</span>
        </div>
      </footer>
      </div>
    </main>
  );
}

function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  return (
    <Reveal className="max-w-5xl">
      <p className="micro text-brand">{kicker}</p>
      <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.015em] sm:text-4xl md:text-5xl">{title}</h2>
    </Reveal>
  );
}

function Dot() {
  return <span className="h-1 w-1 bg-brand" aria-hidden />;
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

function PriceCard({
  title,
  price,
  unit,
  items,
  cta,
  href,
  highlight,
}: {
  title: string;
  price: string;
  unit: string;
  items: string[];
  cta: string;
  href: string;
  highlight?: boolean;
}) {
  return (
    <TiltCard className={`flex h-full flex-col border p-7 ${highlight ? "border-brand/50 bg-card glow" : "border-line bg-card"}`} max={6}>
      {highlight && <span className="btn-primary absolute top-5 right-5 bg-brand px-2.5 py-0.5 text-xs font-semibold text-onbrand">Core</span>}
      <h3 className="text-ink-2">{title}</h3>
      <p className="font-display mt-2 text-3xl font-semibold">{price}</p>
      <p className="mt-1 text-sm text-muted">{unit}</p>
      <ul className="mt-6 mb-8 space-y-2.5 text-sm text-ink-2">
        {items.map((i) => (
          <li key={i} className="flex gap-2.5">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: "var(--color-brand-text)" }} />
            {i}
          </li>
        ))}
      </ul>
      <Link
        href={href}
        className={`mt-auto px-5 py-3 text-center text-sm font-semibold ${highlight ? "btn-primary bg-brand text-onbrand" : "border border-line-strong text-ink hover:border-ink-2"}`}
      >
        {cta}
      </Link>
    </TiltCard>
  );
}
