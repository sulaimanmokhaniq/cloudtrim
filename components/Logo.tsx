import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="font-display flex items-center gap-2.5 text-lg font-semibold tracking-tight">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" fill="#17110d" stroke="#f5b83d55" />
        <rect x="7" y="17" width="4" height="8" fill="#f5b83d" />
        <rect x="14" y="11" width="4" height="14" fill="#f5b83d" />
        <rect x="21" y="19" width="4" height="6" fill="#e8684a" />
        <path d="M5.5 8.5h21" stroke="#f3f1ea" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="2 3" />
      </svg>
      CloudTrim
    </Link>
  );
}
