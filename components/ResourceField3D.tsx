"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// A 3D "cloud estate": each block is a resource. A scan beam sweeps across,
// flags wasteful (amber) blocks, and trims them down to green. Follows the pointer.

const N = 11;
const GAP = 1.15;
const WASTE_RATE = 0.2;
const SCAN_SECONDS = 5.5;
const PAUSE_SECONDS = 1.6;

const C_ACTIVE = new THREE.Color("#2fd39a");
const C_IDLE = new THREE.Color("#3a3a33");
const C_WASTE = new THREE.Color("#f2a93b");

type Block = {
  x: number;
  z: number;
  h: number;
  base: THREE.Color;
  waste: boolean;
  trimmed: number; // 0..1 progress of trimming animation
  flagged: number; // time the scan beam reached it, -1 if not yet
  value: number; // SAR saved when trimmed
};

export default function ResourceField3D({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);
  const [saved, setSaved] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setFailed(true);
      return;
    }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0c0c0a, 30, 55);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(20, 17, 20);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xfff4e0, 0.55));
    const key = new THREE.DirectionalLight(0xfff1dc, 1.6);
    key.position.set(8, 16, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x2fd39a, 40, 30);
    rim.position.set(-8, 6, -8);
    scene.add(rim);
    const warm = new THREE.PointLight(0xf2a93b, 18, 25);
    warm.position.set(8, 4, -6);
    scene.add(warm);

    const group = new THREE.Group();
    scene.add(group);

    // Floor grid
    const grid = new THREE.GridHelper(N * GAP + 2, N + 2, 0x2a2a24, 0x1c1c18);
    grid.position.y = -0.01;
    group.add(grid);

    // Blocks
    const geo = new THREE.BoxGeometry(0.82, 1, 0.82);
    geo.translate(0, 0.5, 0);
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.25 });
    const mesh = new THREE.InstancedMesh(geo, mat, N * N);
    group.add(mesh);

    const half = ((N - 1) * GAP) / 2;
    const blocks: Block[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const x = i * GAP - half;
        const z = j * GAP - half;
        const d = Math.hypot(x, z) / half;
        const h = 0.35 + Math.max(0, 1.2 - d) * (1.2 + Math.sin(i * 1.7) * 0.5 + Math.cos(j * 1.3) * 0.5) + Math.random() * 0.6;
        blocks.push({ x, z, h, base: Math.random() < 0.75 ? C_ACTIVE : C_IDLE, waste: false, trimmed: 0, flagged: -1, value: 0 });
      }
    }
    function seedWaste() {
      for (const b of blocks) {
        b.waste = Math.random() < WASTE_RATE;
        b.trimmed = 0;
        b.flagged = -1;
        b.value = Math.round(b.h * 120 + Math.random() * 90);
      }
    }
    seedWaste();

    // Scan beam
    const beamGeo = new THREE.PlaneGeometry(N * GAP + 1, 4.5);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x2fd39a,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.y = Math.PI / 2;
    beam.position.y = 2.2;
    group.add(beam);

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer);

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let cycleStart = 0;
    let total = 0;
    let raf = 0;

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      const cycle = SCAN_SECONDS + PAUSE_SECONDS;
      let ct = t - cycleStart;
      if (ct > cycle) {
        cycleStart = t;
        ct = 0;
        seedWaste();
      }
      const scanX = reduceMotion ? half + 1 : -half - 1 + (Math.min(ct, SCAN_SECONDS) / SCAN_SECONDS) * (2 * half + 2);
      beam.position.x = scanX;
      beamMat.opacity = ct < SCAN_SECONDS && !reduceMotion ? 0.08 : 0;

      blocks.forEach((b, idx) => {
        if (b.waste && b.flagged < 0 && b.x <= scanX) {
          b.flagged = t;
          total += b.value;
          setSaved(total);
        }
        if (b.flagged >= 0) b.trimmed = Math.min(1, (t - b.flagged - 0.35) / 0.6);
        const tr = Math.max(0, b.trimmed);
        const wave = reduceMotion ? 0 : Math.sin(t * 1.2 + b.x * 0.5 + b.z * 0.4) * 0.06;
        const height = b.waste ? b.h * (1 - 0.65 * ease(tr)) : b.h;
        dummy.position.set(b.x, 0, b.z);
        dummy.scale.set(1, Math.max(0.05, height + wave), 1);
        dummy.updateMatrix();
        mesh.setMatrixAt(idx, dummy.matrix);

        if (b.waste) {
          const pulse = b.flagged >= 0 && tr <= 0 ? 0.5 + 0.5 * Math.sin((t - b.flagged) * 18) : 1;
          color.copy(C_WASTE).multiplyScalar(0.7 + 0.5 * pulse).lerp(C_ACTIVE, ease(tr));
        } else {
          color.copy(b.base);
        }
        mesh.setColorAt(idx, color);
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      group.rotation.y = (reduceMotion ? 0 : t * 0.04) + pointer.x * 0.35;
      group.rotation.x = pointer.y * 0.06;
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      geo.dispose();
      mat.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div ref={mount} className="absolute inset-0" aria-hidden />
      {!failed && (
        <div className="pointer-events-none absolute bottom-4 left-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-line bg-bg/80 px-3 py-1.5 backdrop-blur">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-amber" />
            Waste detected
          </span>
          <span className="rounded-full border border-line bg-bg/80 px-3 py-1.5 backdrop-blur">
            <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-brand" />
            Trimmed:{" "}
            <span className="num font-semibold text-brand">SAR {saved.toLocaleString("en-US")}</span>
          </span>
        </div>
      )}
    </div>
  );
}

function ease(x: number) {
  return x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3);
}
