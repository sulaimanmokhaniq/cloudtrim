import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = { title: "Privacy | CloudTrim" };

const points = [
  {
    t: "Read-only by default",
    d: "CloudTrim connects with a read-only key or role. It can read costs and resource settings, and nothing else.",
  },
  {
    t: "Data stays in the Kingdom",
    d: "Billing and resource data is processed and stored in Saudi Arabia, in line with the Personal Data Protection Law (PDPL).",
  },
  {
    t: "No changes without approval",
    d: "Any fix needs a separate, opt-in permission scoped to one action that expires on its own. Every step is logged.",
  },
  {
    t: "This site is a demo",
    d: "The sign-up and dashboard on this site use sample data. Keys typed into the demo are checked for format only and never sent anywhere.",
  },
];

export default function Privacy() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <header className="flex items-center justify-between">
        <Logo />
        <ThemeToggle />
      </header>
      <h1 className="font-display mt-16 text-4xl font-bold tracking-[-0.02em] md:text-5xl">Privacy</h1>
      <p className="mt-4 text-base leading-7 text-ink-2">How CloudTrim treats your cloud data.</p>
      <div className="mt-10 space-y-4">
        {points.map((p) => (
          <section key={p.t} className="border border-line bg-card p-6">
            <h2 className="font-semibold">{p.t}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-2">{p.d}</p>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm">
        <Link href="/" className="text-brand hover:underline">
          Back to home
        </Link>
      </p>
    </main>
  );
}
