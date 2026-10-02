import Link from "next/link";

/** wordClassName lets a cramped header hide the name on very narrow phones */
export function Logo({ wordClassName = "" }: { wordClassName?: string }) {
  return (
    <Link href="/" className="font-display flex items-center gap-2.5 text-lg font-semibold tracking-tight">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" className="fill-card stroke-brand" />
        <rect x="7" y="17" width="4" height="8" className="fill-brand-text" />
        <rect x="14" y="11" width="4" height="14" className="fill-brand-text" />
        <rect x="21" y="19" width="4" height="6" fill="#c9a46e" />
        <path d="M5.5 8.5h21" className="stroke-ink" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 3" />
      </svg>
      <span className={wordClassName}>CloudTrim</span>
    </Link>
  );
}
