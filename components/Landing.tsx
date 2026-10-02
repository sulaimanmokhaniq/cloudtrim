import Link from "next/link";
import { ParallaxHero } from "@/components/ParallaxHero";
import { Horizon } from "@/components/Horizon";
import { NavSpy } from "@/components/NavSpy";
import { Reveal } from "@/components/Reveal";
import { SafetyFlow, TiltCard } from "@/components/Interactive";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { TEAM_NAME } from "@/lib/data";
import type { LandingCopy } from "@/lib/landing-copy";

const GITHUB_URL = "https://github.com/sulaimanmokhaniq/cloudtrim";
// [label shown here, provider name preselected on the /start connect step]
const providers = [
  ["STC Cloud", "STC Cloud"],
  ["SCCC Alibaba", "SCCC (Alibaba Cloud)"],
  ["CNTXT", "CNTXT"],
  ["AWS", "AWS"],
  ["Azure", "Microsoft Azure"],
  ["Google Cloud", "Google Cloud"],
] as const;

/* The landing page, rendered in English at / and in Arabic (right to left) at /ar. */
export function Landing({ t }: { t: LandingCopy }) {
  const [h0, h1, h2, h3, h4] = t.hero.title;
  const [s0, s1, s2, s3] = t.tagline;
  return (
    <main className="overflow-x-clip" lang={t.lang} dir={t.dir}>
      {/* Floating capsule nav */}
      <header className="fixed inset-x-0 top-4 z-30 px-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between border border-line/80 bg-card py-2 ps-5 pe-2">
          <Logo />
          <NavSpy
            items={[
              { id: "problem", label: t.nav.problem },
              { id: "safety", label: t.nav.safety },
              { id: "compliance", label: t.nav.compliance },
              { id: "pricing", label: t.nav.pricing },
            ]}
          />
          <div className="flex items-center gap-2">
            <Link href={t.switchHref} lang={t.lang === "en" ? "ar" : "en"} className="px-2 py-2 text-sm text-ink-2 hover:text-ink">
              {t.switchLabel}
            </Link>
            <ThemeToggle />
            <span className="hidden sm:block">
              <Link href="/start" className="btn-primary arrow whitespace-nowrap bg-brand px-4 py-2 text-sm font-semibold text-onbrand">
                {t.cta}
              </Link>
            </span>
          </div>
        </div>
      </header>

      {/* Hero: the copy and the bill card drift while the cloud layers move on scroll */}
      <ParallaxHero card={t.card} currency={t.currency} currencyAfter={t.currencyAfter}>
        <div className="max-w-2xl">
          <p className="rise micro text-brand">{t.hero.kicker}</p>
          <h1 className="rise-2 font-display mt-5 text-5xl font-bold leading-[1.02] tracking-[-0.02em] md:text-7xl">
            {h0}<span className="text-brand">{h1}</span>{h2}<span className="text-amber">{h3}</span>{h4}
          </h1>
          <p className="rise-3 mt-6 max-w-[50ch] text-base leading-7 text-muted md:text-lg">{t.hero.body}</p>
          <div className="rise-4 mt-9 flex flex-wrap gap-3">
            <Link href="/start" className="btn-primary arrow bg-brand px-7 py-3.5 font-semibold text-onbrand">
              {t.cta}
            </Link>
          </div>
        </div>
      </ParallaxHero>

      {/* Tagline strip + providers */}
      <section className="border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-8 text-center md:px-6">
          <Reveal>
            <p className="font-display text-xl font-bold tracking-tight sm:text-2xl whitespace-nowrap">
              {s0}<span className="text-brand">{s1}</span>{s2}<span className="text-amber">{s3}</span>
            </p>
          </Reveal>
          <Reveal delay={120}>
            <ul className="flex flex-wrap items-center justify-center gap-2" aria-label={t.worksWith}>
              <li className="micro me-2 text-muted">{t.worksWith}</li>
              {providers.map(([label, name]) => (
                <li key={label}>
                  <Link
                    href={`/start?provider=${encodeURIComponent(name)}`}
                    className="inline-flex items-center rounded-full border border-line-strong bg-card px-4 py-2 font-display text-sm font-semibold tracking-tight text-ink-2 transition-colors hover:border-brand hover:text-ink"
                  >
                    <span dir="ltr">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Problem */}
      <section id="problem" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionTitle kicker={t.problem.kicker} title={t.problem.title} />
          <div className="mt-12 md:mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.problem.items.map((p, i) => (
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
          <SectionTitle kicker={t.safety.kicker} title={t.safety.title} />
          <p className="mt-4 max-w-2xl text-base leading-7 text-ink-2">{t.safety.body}</p>
          <Reveal className="mt-12 md:mt-14">
            <SafetyFlow steps={t.safety.steps} stepLabel={t.safety.step} />
          </Reveal>
        </div>
      </section>

      {/* Local / Compliance */}
      <section id="compliance" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 items-center">
            <div>
              <p className="micro text-brand">{t.compliance.kicker}</p>
              <h2 className="font-display mt-3 text-4xl font-bold tracking-tight md:text-5xl">{t.compliance.title}</h2>
              <p className="mt-5 text-base leading-8 text-ink-2">{t.compliance.body}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {t.compliance.items.map((c) => (
                <TiltCard key={c.k} className="border border-line bg-card p-6">
                  <p className="text-xs text-muted">{t.compliance.aligned}</p>
                  <p className="font-display mt-1 text-xl font-semibold text-ink">{c.k}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{c.v}</p>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison with other tool types */}
      <section id="compare" className="border-b border-line py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <SectionTitle kicker={t.compare.kicker} title={t.compare.title} />
          <div className="mt-12 overflow-x-auto border border-line bg-card">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-line text-start">
                  <th className="p-4" />
                  {t.compare.cols.map((c, i) => (
                    <th key={c} className={`p-4 text-center font-semibold ${i === 0 ? "text-brand" : "text-ink-2"}`}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.compare.rows.map((r) => (
                  <tr key={r.label} className="border-b border-line last:border-0">
                    <th scope="row" className="p-4 text-start font-medium text-ink">{r.label}</th>
                    {r.v.map((v, i) => (
                      <td key={i} className="p-4 text-center">
                        <Mark v={v} label={t.compare.legend[v as keyof typeof t.compare.legend]} strong={i === 0} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
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
          <SectionTitle kicker={t.pricing.kicker} title={t.pricing.title} />
          <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3">
            {t.pricing.plans.map((p, i) => (
              <PriceCard
                key={p.title}
                {...p}
                highlight={i === 1}
                badge={t.pricing.core}
                cta={i === 2 ? t.demo : t.cta}
                href={i === 2 ? "/demo" : "/start"}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-ink-2">{t.pricing.cap}</p>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="border-b border-line py-20 md:py-24">
        <Reveal className="mx-auto flex max-w-3xl flex-col items-center px-4 text-center md:px-6">
          <h2 className="font-display text-3xl font-bold tracking-[-0.015em] sm:text-4xl md:text-5xl">{t.closing.title}</h2>
          <p className="mt-4 max-w-[48ch] text-base leading-7 text-ink-2">{t.closing.body}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/start" className="btn-primary arrow bg-brand px-7 py-3.5 font-semibold text-onbrand">
              {t.cta}
            </Link>
            <Link href="/demo" className="rounded-full border border-line-strong px-7 py-3.5 font-semibold text-ink hover:border-ink-2">
              {t.demo}
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="bg-bg py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-muted md:flex-row md:px-6">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            <Link href="/demo" className="hover:text-ink">{t.footer.demo}</Link>
            <Link href="/start" className="hover:text-ink">{t.footer.signup}</Link>
            <Link href="/privacy" className="hover:text-ink">{t.footer.privacy}</Link>
            <a href={GITHUB_URL} className="hover:text-ink">{t.footer.github}</a>
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

function Mark({ v, label, strong }: { v: string; label: string; strong?: boolean }) {
  const shape =
    v === "yes" ? (
      <path d="M4 10.5 8 14.5 16 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    ) : v === "some" ? (
      <path d="M5 10h10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    ) : (
      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    );
  return (
    <span className={`inline-flex items-center gap-1.5 ${v === "yes" ? (strong ? "text-brand" : "text-ink") : "text-muted"}`}>
      <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden>
        {shape}
      </svg>
      <span className="text-xs">{label}</span>
    </span>
  );
}

function PriceCard({
  title,
  price,
  unit,
  items,
  cta,
  href,
  badge,
  highlight,
}: {
  title: string;
  price: string;
  unit: string;
  items: string[];
  cta: string;
  href: string;
  badge: string;
  highlight?: boolean;
}) {
  return (
    <TiltCard className={`flex h-full flex-col border p-7 ${highlight ? "border-brand/50 bg-card glow" : "border-line bg-card"}`} max={6}>
      {highlight && <span className="btn-primary absolute top-5 end-5 bg-brand px-2.5 py-0.5 text-xs font-semibold text-onbrand">{badge}</span>}
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
        className={`mt-auto px-5 py-3 text-center text-sm font-semibold ${highlight ? "btn-primary bg-brand text-onbrand" : "rounded-full border border-line-strong text-ink hover:border-ink-2"}`}
      >
        {cta}
      </Link>
    </TiltCard>
  );
}
