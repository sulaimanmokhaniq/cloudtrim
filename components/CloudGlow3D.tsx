"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Hero scene: one glowing 3D cloud per provider, light ribbons carrying data into a
// laptop running CloudTrim, and a floating crystal above it. Pointer parallax, idle bob,
// flowing pulses. Falls back to the CSS background if WebGL is unavailable.

const GOLD = "#f5b83d";
const COPPER = "#e8684a";
const SAGE = "#9fd59a";

const CLOUDS = [
  { name: "AWS", pos: [-3.9, 3.3, -3.6], color: GOLD },
  { name: "STC Cloud", pos: [-3.7, -0.9, 2.4], color: COPPER },
  { name: "SCCC Alibaba", pos: [-1.9, 4.7, -4.6], color: SAGE },
  { name: "CNTXT", pos: [2.2, 4.8, -4.6], color: GOLD },
  { name: "Azure", pos: [4.5, 2.7, -2.4], color: SAGE },
  { name: "Google Cloud", pos: [3.9, -0.8, 2.2], color: COPPER },
] as const;

const ribbonVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ribbonFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOffset;
  uniform float uStrength;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float p = fract(vUv.x - uTime * 0.28 + uOffset);
    float head = smoothstep(0.0, 0.02, p) * (1.0 - smoothstep(0.02, 0.22, p));
    float p2 = fract(vUv.x - uTime * 0.28 + uOffset + 0.5);
    float head2 = smoothstep(0.0, 0.02, p2) * (1.0 - smoothstep(0.02, 0.16, p2)) * 0.6;
    float fade = smoothstep(0.0, 0.08, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x));
    float a = (0.16 + (head + head2) * 1.4) * fade * uStrength;
    gl_FragColor = vec4(uColor * (0.7 + (head + head2) * 1.8), a);
  }
`;

function glowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.45)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function labelTexture(text: string, color: string) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.font = "600 44px Inter, system-ui, sans-serif";
  const w = g.measureText(text).width + 70;
  const x = (512 - w) / 2;
  g.fillStyle = "rgba(23,17,13,0.85)";
  g.strokeStyle = color + "99";
  g.lineWidth = 3;
  g.beginPath();
  g.roundRect(x, 24, w, 80, 40);
  g.fill();
  g.stroke();
  g.fillStyle = color;
  g.beginPath();
  g.arc(x + 34, 64, 8, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fbf6ee";
  g.textBaseline = "middle";
  g.fillText(text, x + 52, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function screenTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  const g = c.getContext("2d")!;
  g.fillStyle = "#120d0a";
  g.fillRect(0, 0, 1024, 640);
  // header
  g.fillStyle = "#1f1712";
  g.fillRect(0, 0, 1024, 70);
  g.fillStyle = GOLD;
  g.fillRect(32, 24, 10, 24);
  g.fillRect(48, 16, 10, 32);
  g.fillStyle = COPPER;
  g.fillRect(64, 30, 10, 18);
  g.fillStyle = "#fbf6ee";
  g.font = "700 30px Inter, system-ui, sans-serif";
  g.fillText("CloudTrim", 92, 46);
  g.fillStyle = "#9a8d7f";
  g.font = "500 20px Inter, system-ui, sans-serif";
  g.fillText("Read-only  ·  6 clouds connected", 690, 44);
  // KPI tiles
  const tiles = [
    ["Monthly bill", "SAR 85,400", "#fbf6ee"],
    ["Waste found", "SAR 9,202", COPPER],
    ["Savings realized", "SAR 6,000", GOLD],
  ];
  tiles.forEach(([l, v, col], i) => {
    const x = 32 + i * 326;
    g.fillStyle = "#1a130e";
    g.beginPath();
    g.roundRect(x, 96, 306, 120, 18);
    g.fill();
    g.fillStyle = "#9a8d7f";
    g.font = "500 20px Inter, system-ui, sans-serif";
    g.fillText(l, x + 22, 136);
    g.fillStyle = col;
    g.font = "700 40px Inter, system-ui, sans-serif";
    g.fillText(v, x + 22, 190);
  });
  // bars
  g.fillStyle = "#1a130e";
  g.beginPath();
  g.roundRect(32, 236, 600, 372, 18);
  g.fill();
  const vals = [61, 67, 70, 75, 80, 85, 91];
  vals.forEach((v, i) => {
    const h = v * 3.2;
    const x = 70 + i * 78;
    g.fillStyle = i === 6 ? COPPER + "88" : GOLD;
    g.beginPath();
    g.roundRect(x, 580 - h, 46, h, 8);
    g.fill();
  });
  // list
  g.fillStyle = "#1a130e";
  g.beginPath();
  g.roundRect(652, 236, 340, 372, 18);
  g.fill();
  const rows = [
    ["Dev runs 24/7", "3,100"],
    ["Oversized DB", "2,900"],
    ["Idle instance", "1,380"],
    ["Old snapshots", "710"],
    ["gp2 → gp3", "620"],
  ];
  rows.forEach(([a, b], i) => {
    const y = 290 + i * 64;
    g.fillStyle = "#d6cabb";
    g.font = "500 22px Inter, system-ui, sans-serif";
    g.fillText(a, 676, y);
    g.fillStyle = SAGE;
    g.font = "700 22px Inter, system-ui, sans-serif";
    g.fillText(b, 900, y);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export default function CloudGlow3D({ className = "" }: { className?: string }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current;
    if (!el) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 2.2, 17);
    camera.lookAt(0, 1, 0);

    scene.add(new THREE.AmbientLight(0xffe8cc, 0.7));
    const key = new THREE.DirectionalLight(0xfff0dc, 1.4);
    key.position.set(4, 10, 8);
    scene.add(key);
    const crystalLight = new THREE.PointLight(0xf5b83d, 30, 14);
    scene.add(crystalLight);

    const root = new THREE.Group();
    scene.add(root);

    const disposables: { dispose: () => void }[] = [];
    const glowTex = glowTexture();
    disposables.push(glowTex);

    const addGlow = (parent: THREE.Object3D, color: string, scale: number, opacity: number) => {
      const m = new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false });
      const s = new THREE.Sprite(m);
      s.scale.setScalar(scale);
      parent.add(s);
      disposables.push(m);
      return s;
    };

    // Laptop
    const laptop = new THREE.Group();
    laptop.position.set(0, -1.6, 0.6);
    root.add(laptop);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x241a13, roughness: 0.45, metalness: 0.6 });
    const baseGeo = new THREE.BoxGeometry(5.2, 0.16, 3.4);
    const base = new THREE.Mesh(baseGeo, bodyMat);
    laptop.add(base);
    const lid = new THREE.Group();
    lid.position.set(0, 0.08, -1.7);
    lid.rotation.x = -0.22;
    laptop.add(lid);
    const lidGeo = new THREE.BoxGeometry(5.2, 3.3, 0.12);
    const lidMesh = new THREE.Mesh(lidGeo, bodyMat);
    lidMesh.position.set(0, 1.65, -0.06);
    lid.add(lidMesh);
    const scrTex = screenTexture();
    const scrGeo = new THREE.PlaneGeometry(4.9, 3.06);
    const scrMat = new THREE.MeshBasicMaterial({ map: scrTex, toneMapped: false });
    const screen = new THREE.Mesh(scrGeo, scrMat);
    screen.position.set(0, 1.65, 0.005);
    lid.add(screen);
    const screenGlow = addGlow(lid, GOLD, 9, 0.18);
    screenGlow.position.set(0, 1.65, -0.4);
    disposables.push(bodyMat, baseGeo, lidGeo, scrTex, scrGeo, scrMat);
    const target = new THREE.Vector3(0, 0.1, -0.9); // where ribbons land (screen centre, world-ish)

    // Crystal
    const crystalGeo = new THREE.OctahedronGeometry(0.62, 0);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: 0xffd98a,
      emissive: 0xf5b83d,
      emissiveIntensity: 0.9,
      roughness: 0.15,
      metalness: 0.4,
      flatShading: true,
    });
    const crystal = new THREE.Mesh(crystalGeo, crystalMat);
    crystal.scale.set(1, 1.5, 1);
    const crystalGroup = new THREE.Group();
    crystalGroup.position.set(0, 3.3, 0);
    crystalGroup.add(crystal);
    addGlow(crystalGroup, GOLD, 4.5, 0.55);
    addGlow(crystalGroup, COPPER, 8, 0.18);
    root.add(crystalGroup);
    disposables.push(crystalGeo, crystalMat);

    // Clouds
    const puff = new THREE.SphereGeometry(1, 28, 20);
    disposables.push(puff);
    const cloudGroups: THREE.Group[] = [];
    const ribbonMats: THREE.ShaderMaterial[] = [];
    CLOUDS.forEach((c, i) => {
      const g = new THREE.Group();
      g.position.set(c.pos[0], c.pos[1], c.pos[2]);
      const col = new THREE.Color(c.color);
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#fff3e2").lerp(col, 0.25),
        emissive: col,
        emissiveIntensity: 0.35,
        roughness: 0.55,
        metalness: 0.05,
      });
      disposables.push(mat);
      const parts: [number, number, number, number][] = [
        [0, 0, 0, 0.62],
        [-0.62, -0.16, 0.05, 0.45],
        [0.6, -0.14, 0, 0.48],
        [-0.25, 0.3, -0.08, 0.5],
        [0.28, 0.24, 0.1, 0.42],
        [0, -0.25, 0.25, 0.42],
      ];
      parts.forEach(([x, y, z, r]) => {
        const m = new THREE.Mesh(puff, mat);
        m.position.set(x, y, z);
        m.scale.set(r * 1.15, r, r);
        g.add(m);
      });
      addGlow(g, c.color, 4.2, 0.5);
      const lt = labelTexture(c.name, c.color);
      const lm = new THREE.SpriteMaterial({ map: lt, transparent: true, depthWrite: false });
      const label = new THREE.Sprite(lm);
      label.scale.set(2.6, 0.65, 1);
      label.position.set(0, -1.05, 0);
      g.add(label);
      disposables.push(lt, lm);
      root.add(g);
      cloudGroups.push(g);

      // Ribbon from cloud to the laptop
      const start = new THREE.Vector3(c.pos[0], c.pos[1] - 0.2, c.pos[2]);
      const mid = start.clone().lerp(target, 0.5);
      mid.y += 1.6 + (i % 2) * 0.8;
      mid.z += 1.5;
      const curve = new THREE.CatmullRomCurve3([start, mid, target.clone().add(new THREE.Vector3(c.pos[0] * 0.08, 0, 0))]);
      [
        { r: 0.035, s: 1 },
        { r: 0.13, s: 0.35 },
      ].forEach(({ r, s }) => {
        const geo = new THREE.TubeGeometry(curve, 120, r, 8, false);
        const m = new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uOffset: { value: i * 0.17 }, uStrength: { value: s }, uColor: { value: col } },
          vertexShader: ribbonVertex,
          fragmentShader: ribbonFragment,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        root.add(new THREE.Mesh(geo, m));
        ribbonMats.push(m);
        disposables.push(geo, m);
      });
    });

    // Drifting embers
    const count = 220;
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pts[i * 3] = (Math.random() - 0.5) * 26;
      pts[i * 3 + 1] = (Math.random() - 0.3) * 14;
      pts[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xf5b83d, size: 0.06, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false });
    const embers = new THREE.Points(pGeo, pMat);
    root.add(embers);
    disposables.push(pGeo, pMat);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
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
      // Wide screens: scene sits right of the headline. Narrow: centred and smaller, below the text.
      if (camera.aspect > 1.3) {
        root.position.set(4.0, -0.3, 0);
        root.scale.setScalar(0.86);
      } else {
        root.position.set(0, -0.9, 0);
        root.scale.setScalar(0.92);
      }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    resize();

    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const t = reduce ? 0 : clock.getElapsedTime();
      ribbonMats.forEach((m) => (m.uniforms.uTime.value = t));
      cloudGroups.forEach((g, i) => {
        g.position.y = CLOUDS[i].pos[1] + Math.sin(t * 0.7 + i * 1.3) * 0.18;
      });
      crystalGroup.position.y = 3.3 + Math.sin(t * 0.9) * 0.22;
      crystal.rotation.y = t * 0.6;
      crystalLight.position.copy(crystalGroup.position).add(root.position);
      embers.rotation.y = t * 0.02;
      embers.position.y = Math.sin(t * 0.2) * 0.3;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      root.rotation.y = pointer.x * 0.12;
      root.rotation.x = pointer.y * 0.05;
      renderer.render(scene, camera);
    };
    frame();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      io.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mount} className={className} aria-hidden />;
}
