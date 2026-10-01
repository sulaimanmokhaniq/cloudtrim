"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Calm hero scene: one matte low-poly cloud, a thin orbit ring and three small cubes
// circling slowly. Solid colors, no glow, works on both the light and dark theme.

const BURGUNDY = "#8e2f3c";
const SAND = "#c9a46e";
const SAGE = "#7fb27a";
const ROSE = "#d48a93";

const PUFFS: [number, number, number, number][] = [
  [0, 0, 0, 1.25],
  [-1.25, -0.25, 0.1, 0.9],
  [1.25, -0.2, 0, 0.95],
  [-0.55, 0.65, -0.1, 0.85],
  [0.6, 0.55, 0.15, 0.8],
];

export default function CloudGlow3D({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.6, 15);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const key = new THREE.DirectionalLight(0xfff3e6, 1.8);
    key.position.set(4, 6, 8);
    scene.add(key);

    const root = new THREE.Group();
    scene.add(root);

    // Cloud: a few flat-shaded spheres, matte burgundy
    const cloud = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({ color: BURGUNDY, roughness: 0.95, metalness: 0, flatShading: true });
    const geos: THREE.BufferGeometry[] = [];
    for (const [x, y, z, r] of PUFFS) {
      const g = new THREE.IcosahedronGeometry(r * 0.85, 1);
      geos.push(g);
      const m = new THREE.Mesh(g, cloudMat);
      m.position.set(x, y, z);
      cloud.add(m);
    }
    root.add(cloud);

    // Orbit ring and three cubes riding on it
    const orbit = new THREE.Group();
    orbit.rotation.set(1.2, 0, 0.25);
    const ringGeo = new THREE.TorusGeometry(2.8, 0.018, 8, 160);
    const ringMat = new THREE.MeshBasicMaterial({ color: SAND });
    orbit.add(new THREE.Mesh(ringGeo, ringMat));
    const cubeGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
    const cubeMats = [SAND, SAGE, ROSE].map(
      (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8, flatShading: true }),
    );
    const cubes = cubeMats.map((mat, i) => {
      const m = new THREE.Mesh(cubeGeo, mat);
      m.userData.phase = (i / 3) * Math.PI * 2;
      orbit.add(m);
      return m;
    });
    root.add(orbit);

    let w = 1;
    let h = 1;
    const resize = () => {
      w = el.clientWidth || 1;
      h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const wide = camera.aspect > 1.3;
      root.position.set(wide ? 3.9 : 0, wide ? -0.2 : 0, 0);
      root.scale.setScalar(wide ? 0.9 : 0.8);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const pointer = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const place = (t: number) => {
      cubes.forEach((c) => {
        const a = c.userData.phase + t * 0.18;
        c.position.set(Math.cos(a) * 2.8, Math.sin(a) * 2.8, 0);
        c.rotation.set(t * 0.3, t * 0.4, 0);
      });
    };
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = clock.getElapsedTime();
      cloud.position.y = Math.sin(t * 0.6) * 0.12;
      cloud.rotation.y = Math.sin(t * 0.25) * 0.25;
      place(t);
      root.rotation.y += (pointer.x * 0.15 - root.rotation.y) * 0.03;
      root.rotation.x += (pointer.y * 0.08 - root.rotation.x) * 0.03;
      renderer.render(scene, camera);
    };
    if (reduce) {
      place(0);
      renderer.render(scene, camera);
    } else {
      frame();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      geos.forEach((g) => g.dispose());
      ringGeo.dispose();
      cubeGeo.dispose();
      cloudMat.dispose();
      ringMat.dispose();
      cubeMats.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mount} className={className} aria-hidden />;
}
