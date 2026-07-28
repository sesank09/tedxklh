"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

// Adaptive quality: particle count based on screen size
function getParticleCount(): number {
  if (typeof window === "undefined") return 3000;
  const w = window.innerWidth;
  if (w < 768) return 900;
  if (w < 1200) return 2000;
  return 4500;
}

// Curl noise: divergence-free 3D flow field
function curl(x: number, y: number, z: number, t: number) {
  const eps = 0.0001;
  const p = (px: number, py: number, pz: number) =>
    Math.sin(px * 0.7 + t * 0.12) * Math.cos(py * 0.5 + t * 0.09) +
    Math.sin(py * 0.6 + pz * 0.4 + t * 0.07) * Math.cos(pz * 0.8 + px * 0.3) +
    Math.cos(pz * 0.5 + px * 0.6 + t * 0.05) * Math.sin(px * 0.4 + py * 0.7);
  const dpdx = (p(x + eps, y, z) - p(x - eps, y, z)) / (2 * eps);
  const dpdy = (p(x, y + eps, z) - p(x, y - eps, z)) / (2 * eps);
  const dpdz = (p(x, y, z + eps) - p(x, y, z - eps)) / (2 * eps);
  return { cx: dpdz - dpdy, cy: dpdx - dpdz, cz: dpdy - dpdx };
}

// 7 morph target shapes (0=Hero, 1=About, 2=Theme, 3=Speakers, 4=Schedule, 5=Partners, 6=Register)
// All shapes are edge-biased: center zone (+-1.5u) kept sparse for readability
function buildMorphPositions(count: number): Float32Array[] {
  const shapes: Float32Array[] = Array.from({ length: 7 }, () => new Float32Array(count * 3));
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 2.5 + Math.random() * 3.5;
    // Hero: sparse cloud at edges
    shapes[0][i*3]   = Math.cos(ang) * rad * (0.8 + Math.random() * 0.4);
    shapes[0][i*3+1] = Math.sin(ang) * rad * (0.7 + Math.random() * 0.3);
    shapes[0][i*3+2] = (Math.random() - 0.5) * 4;
    // About: sine wave field
    const wx = (Math.random() - 0.5) * 14;
    shapes[1][i*3]   = wx;
    shapes[1][i*3+1] = Math.sin(wx * 0.5) * 2.2 + (Math.random() - 0.5) * 0.6;
    shapes[1][i*3+2] = (Math.random() - 0.5) * 3;
    // Theme: double helix ribbon
    const ht = (i / count) * Math.PI * 8;
    const sr = 2.8 + (Math.random() - 0.5) * 0.5;
    shapes[2][i*3]   = Math.cos(ht) * sr;
    shapes[2][i*3+1] = Math.sin(ht) * sr;
    shapes[2][i*3+2] = ht * 0.18 - 2.5;
    // Speakers: constellation clusters
    const cluster = Math.floor(Math.random() * 6);
    const ca = (cluster / 6) * Math.PI * 2;
    const cr = 3.0 + Math.random() * 1.5;
    shapes[3][i*3]   = Math.cos(ca) * cr + (Math.random() - 0.5) * 0.8;
    shapes[3][i*3+1] = Math.sin(ca) * cr + (Math.random() - 0.5) * 0.8;
    shapes[3][i*3+2] = (Math.random() - 0.5) * 3;
    // Schedule: network grid
    const gx = Math.round((Math.random() - 0.5) * 10) * 1.3;
    const gy = Math.round((Math.random() - 0.5) * 5) * 1.3;
    shapes[4][i*3]   = Math.abs(gx) < 2 ? (gx > 0 ? gx + 3 : gx - 3) : gx;
    shapes[4][i*3+1] = Math.abs(gy) < 1.5 ? (gy > 0 ? gy + 2 : gy - 2) : gy;
    shapes[4][i*3+2] = (Math.random() - 0.5) * 2;
    // Partners: concentric rings
    const rn = Math.floor(Math.random() * 4) + 1;
    const ra = Math.random() * Math.PI * 2;
    shapes[5][i*3]   = Math.cos(ra) * rn * 1.3;
    shapes[5][i*3+1] = Math.sin(ra) * rn * 0.9;
    shapes[5][i*3+2] = (Math.random() - 0.5) * 2;
    // Register: sparse calm
    const rs = 3.8 + Math.random() * 2.5;
    const ra2 = Math.random() * Math.PI * 2;
    shapes[6][i*3]   = Math.cos(ra2) * rs;
    shapes[6][i*3+1] = Math.sin(ra2) * rs;
    shapes[6][i*3+2] = (Math.random() - 0.5) * 3;
  }
  return shapes;
}

const MAX_LINES = 400;

interface EngineProps {
  scrollTarget: React.MutableRefObject<number>;
  scrollCurrent: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ tx: number; ty: number; x: number; y: number }>;
}

function ParticleEngine({ scrollTarget, scrollCurrent, mouse }: EngineProps) {
  const COUNT = useMemo(() => getParticleCount(), []);
  const dustRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const energyRef = useRef<THREE.Points>(null);
  const velocities = useMemo(() => new Float32Array(COUNT * 3), [COUNT]);
  const offsets = useMemo(() => {
    const arr = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) arr[i] = Math.random() * Math.PI * 2;
    return arr;
  }, [COUNT]);
  const morphs = useMemo(() => buildMorphPositions(COUNT), [COUNT]);
  const initPos = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT * 3; i++) arr[i] = morphs[0][i];
    return arr;
  }, [COUNT, morphs]);
  const ENERGY = Math.floor(COUNT * 0.04);
  const energyPos = useMemo(() => {
    const arr = new Float32Array(ENERGY * 3);
    for (let i = 0; i < ENERGY; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 3.5;
      arr[i*3]   = Math.cos(a) * r;
      arr[i*3+1] = Math.sin(a) * r;
      arr[i*3+2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, [ENERGY]);
  const linePositions = useMemo(() => new Float32Array(MAX_LINES * 6), []);
  const lineOpacity = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    scrollCurrent.current = THREE.MathUtils.lerp(scrollCurrent.current, scrollTarget.current, 0.025);
    const s = scrollCurrent.current;
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, mouse.current.tx, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, mouse.current.ty, 0.05);
    const sIdx = s * (morphs.length - 1);
    const sA = Math.min(Math.floor(sIdx), morphs.length - 1);
    const sB = Math.min(sA + 1, morphs.length - 1);
    const tAB = sIdx - sA;
    const cursorX = mouse.current.x * 5;
    const cursorY = mouse.current.y * 4;
    if (!dustRef.current) return;
    const pos = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const tx = THREE.MathUtils.lerp(morphs[sA][i*3],   morphs[sB][i*3],   tAB);
      const ty = THREE.MathUtils.lerp(morphs[sA][i*3+1], morphs[sB][i*3+1], tAB);
      const tz = THREE.MathUtils.lerp(morphs[sA][i*3+2], morphs[sB][i*3+2], tAB);
      const cx = pos.getX(i), cy = pos.getY(i), cz = pos.getZ(i);
      const { cx: cvx, cy: cvy, cz: cvz } = curl(cx * 0.3, cy * 0.3, cz * 0.3, t * 0.08);
      velocities[i*3]   = velocities[i*3]   * 0.96 + (tx - cx) * 0.008 + cvx * 0.012;
      velocities[i*3+1] = velocities[i*3+1] * 0.96 + (ty - cy) * 0.008 + cvy * 0.012;
      velocities[i*3+2] = velocities[i*3+2] * 0.96 + (tz - cz) * 0.008 + cvz * 0.012;
      let nx = cx + velocities[i*3];
      let ny = cy + velocities[i*3+1];
      let nz = cz + velocities[i*3+2];
      nx += Math.sin(t * 0.18 + offsets[i]) * 0.003;
      ny += Math.cos(t * 0.14 + offsets[i] * 1.3) * 0.003;
      const mdx = nx - cursorX, mdy = ny - cursorY;
      const mdist = Math.sqrt(mdx*mdx + mdy*mdy);
      if (mdist < 1.8 && mdist > 0.001) {
        const repel = (1.8 - mdist) / 1.8 * 0.025;
        nx += (mdx / mdist) * repel;
        ny += (mdy / mdist) * repel;
      }
      pos.setXYZ(i, nx, ny, nz);
    }
    pos.needsUpdate = true;
    const mat = dustRef.current.material as THREE.PointsMaterial;
    if (mat) {
      const tgt = s < 0.1 ? 0.11 : s < 0.5 ? 0.09 : s < 0.85 ? 0.07 : 0.03;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, tgt, 0.02);
    }
    if (linesRef.current) {
      const lineActive = s > 0.05 && s < 0.90;
      const tlo = lineActive ? 0.16 * Math.min(s * 7, 1) * Math.min((0.92 - s) * 7, 1) : 0;
      lineOpacity.current = THREE.MathUtils.lerp(lineOpacity.current, tlo, 0.04);
      const lmat = linesRef.current.material as THREE.LineBasicMaterial;
      if (lmat) lmat.opacity = lineOpacity.current;
      if (lineActive && lineOpacity.current > 0.005) {
        const lpos = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        let li = 0;
        const step = Math.max(1, Math.floor(COUNT / 120));
        for (let i = 0; i < COUNT; i += step) {
          if (li >= MAX_LINES * 6) break;
          const ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i);
          for (let j = i + step; j < i + step * 14; j += step) {
            if (j >= COUNT || li >= MAX_LINES * 6) break;
            const bx = pos.getX(j), by = pos.getY(j), bz = pos.getZ(j);
            const dx = ax - bx, dy = ay - by, dz = az - bz;
            if (Math.sqrt(dx*dx + dy*dy + dz*dz) < 1.15) {
              linePositions[li++] = ax; linePositions[li++] = ay; linePositions[li++] = az;
              linePositions[li++] = bx; linePositions[li++] = by; linePositions[li++] = bz;
            }
          }
        }
        lpos.needsUpdate = true;
      }
    }
    if (energyRef.current) {
      const epos = energyRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < ENERGY; i++) {
        const ex = epos.getX(i), ey = epos.getY(i), ez = epos.getZ(i);
        const { cx: ecx, cy: ecy } = curl(ex * 0.5, ey * 0.5, ez * 0.3, t * 0.3);
        let nex = ex + ecx * 0.04, ney = ey + ecy * 0.04, nez = ez + 0.005;
        if (Math.abs(nex) > 7) nex *= -0.5;
        if (Math.abs(ney) > 5) ney *= -0.5;
        if (Math.abs(nez) > 4) nez *= -0.5;
        epos.setXYZ(i, nex, ney, nez);
      }
      epos.needsUpdate = true;
      const emat = energyRef.current.material as THREE.PointsMaterial;
      if (emat) emat.opacity = THREE.MathUtils.lerp(emat.opacity, s < 0.88 ? 0.55 : 0.08, 0.02);
    }
    dustRef.current.rotation.y = t * 0.005 + mouse.current.x * 0.04;
    dustRef.current.rotation.x = t * 0.003 + mouse.current.y * 0.02;
  });

  return (
    <>
      <points ref={dustRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initPos, 3]} />
        </bufferGeometry>
        <pointsMaterial transparent color="#CCCCCC" size={0.026} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.09} />
      </points>
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#EB0028" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points ref={energyRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[energyPos, 3]} />
        </bufferGeometry>
        <pointsMaterial transparent color="#EB0028" size={0.045} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.5} />
      </points>
    </>
  );
}

function AuroraLayer({ scrollCurrent }: { scrollCurrent: React.MutableRefObject<number> }) {
  const a1Ref = useRef<THREE.Mesh>(null);
  const a2Ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const s = scrollCurrent.current;
    if (a1Ref.current) {
      (a1Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.045 * (1 - s * 1.1));
      a1Ref.current.rotation.z = Math.sin(t * 0.04) * 0.2;
      a1Ref.current.position.y = Math.sin(t * 0.06) * 0.6 + 1.5;
    }
    if (a2Ref.current) {
      (a2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.028 * (1 - s * 0.8));
      a2Ref.current.rotation.z = Math.cos(t * 0.035) * 0.15;
      a2Ref.current.position.y = Math.cos(t * 0.05) * 0.5 - 1.5;
    }
  });
  return (
    <>
      <mesh ref={a1Ref} position={[0, 1.5, -3]}>
        <planeGeometry args={[20, 1.2]} />
        <meshBasicMaterial color="#EB0028" transparent opacity={0.045} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={a2Ref} position={[0, -1.5, -3.5]}>
        <planeGeometry args={[18, 0.7]} />
        <meshBasicMaterial color="#CC1133" transparent opacity={0.025} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

function VolumetricFog({ scrollCurrent }: { scrollCurrent: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.sin(t * 0.015) * 0.8;
      ref.current.position.y = Math.cos(t * 0.012) * 0.4;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.032 * (1 - scrollCurrent.current * 0.7);
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -6]}>
      <planeGeometry args={[26, 20]} />
      <meshBasicMaterial color="#2A0008" transparent opacity={0.032} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

interface SceneProps {
  scrollTarget: React.MutableRefObject<number>;
  scrollCurrent: React.MutableRefObject<number>;
  mouse: React.MutableRefObject<{ tx: number; ty: number; x: number; y: number }>;
}

function Scene({ scrollTarget, scrollCurrent, mouse }: SceneProps) {
  return (
    <>
      <fogExp2 attach="fog" args={["#040404", 0.025]} />
      <VolumetricFog scrollCurrent={scrollCurrent} />
      <AuroraLayer scrollCurrent={scrollCurrent} />
      <ParticleEngine scrollTarget={scrollTarget} scrollCurrent={scrollCurrent} mouse={mouse} />
    </>
  );
}

function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -1000, y: -1000, tx: -1000, ty: -1000 });
  const raf = useRef<number>(0);
  useEffect(() => {
    const onMove = (e: MouseEvent) => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    window.addEventListener("mousemove", onMove, { passive: true });
    const tick = () => {
      pos.current.x += (pos.current.tx - pos.current.x) * 0.07;
      pos.current.y += (pos.current.ty - pos.current.y) * 0.07;
      if (ref.current) ref.current.style.transform = `translate(${pos.current.x - 200}px,${pos.current.y - 200}px)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);
  return (
    <div ref={ref} style={{ position: "absolute", top: 0, left: 0, width: "400px", height: "400px", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(255,255,255,0.042) 0%, rgba(255,255,255,0.008) 45%, transparent 70%)", willChange: "transform" }} />
  );
}

function LightSweep() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const sweep = () => {
      el.style.transition = "none";
      el.style.transform = "translateX(-130%) translateY(-130%) rotate(28deg)";
      el.style.opacity = "1";
      requestAnimationFrame(() => {
        el.style.transition = "transform 3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        el.style.transform = "translateX(130%) translateY(130%) rotate(28deg)";
        setTimeout(() => { el.style.opacity = "0"; }, 2800);
      });
    };
    const timer = setTimeout(() => { sweep(); setInterval(sweep, 26000); }, 9000);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div ref={ref} style={{ position: "absolute", top: 0, left: 0, width: "55%", height: "200%", background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.016) 50%, transparent 100%)", transform: "translateX(-130%) translateY(-130%) rotate(28deg)", opacity: 0, willChange: "transform, opacity", pointerEvents: "none" }} />
  );
}

export default function Background3D() {
  const [mounted, setMounted] = useState(false);
  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);
  const mouse = useRef({ tx: 0, ty: 0, x: 0, y: 0 });
  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight || 1;
      scrollTarget.current = Math.min(Math.max(window.scrollY / h, 0), 1);
    };
    const onMouse = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("mousemove", onMouse); };
  }, []);
  if (!mounted) return null;
  return (
    <div style={{ position: "fixed", inset: 0, width: "100%", height: "100%", overflow: "hidden", pointerEvents: "none", zIndex: -20 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 85% 70% at 50% 25%, #0c0203 0%, #070103 35%, #040404 65%, #090102 100%)" }} />
      <div className="noise-overlay opacity-[0.035]" />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 50% 38% at 12% 18%, rgba(235,0,40,0.07) 0%, transparent 100%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 35% 28% at 90% 82%, rgba(200,10,30,0.04) 0%, transparent 100%)" }} />
      <Canvas camera={{ position: [0, 0, 8], fov: 50 }} dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }} style={{ position: "absolute", inset: 0 }}>
        <Scene scrollTarget={scrollTarget} scrollCurrent={scrollCurrent} mouse={mouse} />
      </Canvas>
      <MouseSpotlight />
      <LightSweep />
    </div>
  );
}
