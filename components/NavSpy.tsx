"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Item = { id: string; label: string };

/** Section links in the top nav. A burgundy pill slides behind the link of the section in view. */
export function NavSpy({ items }: { items: Item[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // The active section is the last one whose top has passed 40% of the screen height
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  // Move the pill under the active link
  useLayoutEffect(() => {
    const measure = () => {
      const link = navRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
      setPill(link ? { left: link.offsetLeft, width: link.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <nav ref={navRef} className="relative hidden items-center gap-1 text-sm text-ink-2 md:flex">
      <span
        aria-hidden
        className="absolute inset-y-0 rounded-full bg-brand transition-all duration-300 ease-out"
        style={{ left: pill?.left ?? 0, width: pill?.width ?? 0, opacity: pill ? 1 : 0 }}
      />
      {items.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          data-id={id}
          aria-current={active === id ? "true" : undefined}
          className={`relative rounded-full px-4 py-1.5 transition-colors duration-300 ${
            active === id ? "text-onbrand" : "hover:text-ink"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
