"use client";

import { useEffect, useRef } from "react";

// Page-wide background: small solid squares drifting slowly upward behind every section.
// Colors come from the theme tokens, so it follows light and dark mode.

type Dot = { x: number; y: number; s: number; v: number; drift: number; c: number };

export function MovingBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let colors: string[] = [];
    let alpha = 0.5;
    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      colors = ["--color-brand-text", "--color-amber", "--color-sage", "--color-line-strong"].map((v) => cs.getPropertyValue(v).trim());
      alpha = document.documentElement.dataset.theme === "light" ? 0.6 : 0.7;
    };
    readTheme();
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(130, (w * h) / 11000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        s: 2 + Math.random() * 3,
        v: 6 + Math.random() * 14,
        drift: (Math.random() - 0.5) * 6,
        c: Math.floor(Math.random() * 4),
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    let scrollY = window.scrollY;
    let raf = 0;
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // A little parallax: scrolling nudges the dots so the background moves with the page
      const dy = (window.scrollY - scrollY) * 0.15;
      scrollY = window.scrollY;
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = alpha;
      for (const d of dots) {
        d.y -= d.v * dt + dy;
        d.x += d.drift * dt;
        if (d.y < -6) d.y = h + 6;
        if (d.y > h + 6) d.y = -6;
        if (d.x < -6) d.x = w + 6;
        if (d.x > w + 6) d.x = -6;
        ctx.fillStyle = colors[d.c];
        ctx.fillRect(d.x, d.y, d.s, d.s);
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10 h-full w-full" aria-hidden />;
}
