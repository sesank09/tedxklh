"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

function getParticleCount(): number {
  if (typeof window === "undefined") return 2400;
  const w = window.innerWidth;
  if (w < 768) return 700;
  if (w < 1200) return 1300;
  return 2400;
}

// Curl noise: 3D flow field calculation
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

// 7 3D Morph Shapes (All edge-biased for safe text center zones)
function buildMorphPositions(count: number): Float32Array[] {
  const shapes: Float32Array[] = Array.from({ length: 7 }, () => new Float32Array(count * 3));
  for (let i = 0; i < count; i++) {
    const ang = Math.random() * Math.PI * 2;
    const rad = 2.4 + Math.random() * 3.2;

    // 0: Hero — Swirling Edge Nebula
    shapes[0][i*3]   = Math.cos(ang) * rad * (0.85 + Math.random() * 0.35);
    shapes[0][i*3+1] = Math.sin(ang) * rad * (0.75 + Math.random() * 0.3);
    shapes[0][i*3+2] = (Math.random() - 0.5) * 3.5;

    // 1: About — Flowing 3D Sine Wave
    const wx = (Math.random() - 0.5) * 13;
    shapes[1][i*3]   = wx;
    shapes[1][i*3+1] = Math.sin(wx * 0.5) * 2.2 + (Math.random() - 0.5) * 0.5;
    shapes[1][i*3+2] = Math.cos(wx * 0.4) * 1.5;

    // 2: Theme — Rotating Double Helix Ribbon
    const ht = (i / count) * Math.PI * 8;
    const sr = 2.7 + (Math.random() - 0.5) * 0.5;
    shapes[2][i*3]   = Math.cos(ht) * sr;
    shapes[2][i*3+1] = Math.sin(ht) * sr;
    shapes[2][i*3+2] = ht * 0.18 - 2.2;

    // 3: Speakers — Constellation Clusters
    const cluster = Math.floor(Math.random() * 6);
    const ca = (cluster / 6) * Math.PI * 2;
    const cr = 2.9 + Math.random() * 1.4;
    shapes[3][i*3]   = Math.cos(ca) * cr + (Math.random() - 0.5) * 0.7;
    shapes[3][i*3+1] = Math.sin(ca) * cr + (Math.random() - 0.5) * 0.7;
    shapes[3][i*3+2] = (Math.random() - 0.5) * 2.5;

    // 4: Schedule — 3D Quantum Matrix Grid
    const gx = Math.round((Math.random() - 0.5) * 8) * 1.25;
    const gy = Math.round((Math.random() - 0.5) * 4) * 1.25;
    shapes[4][i*3]   = Math.abs(gx) < 2 ? (gx > 0 ? gx + 2.5 : gx - 2.5) : gx;
    shapes[4][i*3+1] = Math.abs(gy) < 1.4 ? (gy > 0 ? gy + 1.8 : gy - 1.8) : gy;
    shapes[4][i*3+2] = (Math.random() - 0.5) * 2;

    // 5: Partners — Concentric Gravitational Rings
    const rn = Math.floor(Math.random() * 4) + 1;
    const ra = Math.random() * Math.PI * 2;
    shapes[5][i*3]   = Math.cos(ra) * rn * 1.25;
    shapes[5][i*3+1] = Math.sin(ra) * rn * 0.85;
    shapes[5][i*3+2] = (Math.random() - 0.5) * 2;

    // 6: Register — Serene Sanctuary Perimeter
    const rs = 3.6 + Math.random() * 2.2;
    const ra2 = Math.random() * Math.PI * 2;
    shapes[6][i*3]   = Math.cos(ra2) * rs;
    shapes[6][i*3+1] = Math.sin(ra2) * rs;
    shapes[6][i*3+2] = (Math.random() - 0.5) * 2.5;
  }
  return shapes;
}

const MAX_LINES = 300;

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
  const ringsRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

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

  const ENERGY = Math.floor(COUNT * 0.035);
  const energyPos = useMemo(() => {
    const arr = new Float32Array(ENERGY * 3);
    for (let i = 0; i < ENERGY; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.2 + Math.random() * 3.2;
      arr[i*3]   = Math.cos(a) * r;
      arr[i*3+1] = Math.sin(a) * r;
      arr[i*3+2] = (Math.random() - 0.5) * 3.5;
    }
    return arr;
  }, [ENERGY]);

  const linePositions = useMemo(() => new Float32Array(MAX_LINES * 6), []);
  const lineOpacity = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    scrollCurrent.current = THREE.MathUtils.lerp(scrollCurrent.current, scrollTarget.current, 0.03);
    const s = scrollCurrent.current;

    // Smooth mouse lerp
    mouse.current.x = THREE.MathUtils.lerp(mouse.current.x, mouse.current.tx, 0.05);
    mouse.current.y = THREE.MathUtils.lerp(mouse.current.y, mouse.current.ty, 0.05);

    // ─────────────────────────────────────────────────────────────
    // SCROLL-CONTROLLED 3D CAMERA TRAVEL & PERSPECTIVE WARP
    // ─────────────────────────────────────────────────────────────
    // Smooth camera Z depth transition based on scroll progress
    const camZ = 8.0 + Math.sin(s * Math.PI * 3) * 0.8 - s * 0.5;
    const camX = Math.sin(s * Math.PI * 2) * 0.6 + mouse.current.x * 0.4;
    const camY = Math.cos(s * Math.PI * 2) * 0.3 + mouse.current.y * 0.3;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, camX, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, camY, 0.04);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, camZ, 0.04);
    camera.lookAt(0, 0, 0);

    // ─────────────────────────────────────────────────────────────
    // SCROLL-CONTROLLED ROTATING QUANTUM ENERGY RINGS
    // ─────────────────────────────────────────────────────────────
    if (ringsRef.current) {
      ringsRef.current.rotation.z = s * Math.PI * 4 + t * 0.05;
      ringsRef.current.rotation.x = Math.sin(s * Math.PI * 2) * 0.5;
      ringsRef.current.rotation.y = Math.cos(s * Math.PI * 2) * 0.5;

      const ringScale = 1 + Math.sin(s * Math.PI * 2) * 0.25;
      ringsRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    // Morph target blend
    const sIdx = s * (morphs.length - 1);
    const sA = Math.min(Math.floor(sIdx), morphs.length - 1);
    const sB = Math.min(sA + 1, morphs.length - 1);
    const tAB = sIdx - sA;

    const cursorX = mouse.current.x * 4.5;
    const cursorY = mouse.current.y * 3.5;

    if (!dustRef.current) return;
    const pos = dustRef.current.geometry.attributes.position as THREE.BufferAttribute;

    for (let i = 0; i < COUNT; i++) {
      const tx = THREE.MathUtils.lerp(morphs[sA][i*3],   morphs[sB][i*3],   tAB);
      const ty = THREE.MathUtils.lerp(morphs[sA][i*3+1], morphs[sB][i*3+1], tAB);
      const tz = THREE.MathUtils.lerp(morphs[sA][i*3+2], morphs[sB][i*3+2], tAB);
      const cx = pos.getX(i), cy = pos.getY(i), cz = pos.getZ(i);

      // Scroll speed dynamically amplifies curl noise intensity
      const scrollSpeedFactor = 0.08 + Math.abs(scrollTarget.current - scrollCurrent.current) * 0.15;
      const { cx: cvx, cy: cvy, cz: cvz } = curl(cx * 0.3, cy * 0.3, cz * 0.3, t * scrollSpeedFactor);

      velocities[i*3]   = velocities[i*3]   * 0.96 + (tx - cx) * 0.008 + cvx * 0.012;
      velocities[i*3+1] = velocities[i*3+1] * 0.96 + (ty - cy) * 0.008 + cvy * 0.012;
      velocities[i*3+2] = velocities[i*3+2] * 0.96 + (tz - cz) * 0.008 + cvz * 0.012;

      let nx = cx + velocities[i*3];
      let ny = cy + velocities[i*3+1];
      let nz = cz + velocities[i*3+2];

      nx += Math.sin(t * 0.18 + offsets[i]) * 0.0025;
      ny += Math.cos(t * 0.14 + offsets[i] * 1.3) * 0.0025;

      // Mouse repulsion
      const mdx = nx - cursorX, mdy = ny - cursorY;
      const distSq = mdx * mdx + mdy * mdy;
      if (distSq < 3.24 && distSq > 0.00001) {
        const mdist = Math.sqrt(distSq);
        const repel = (1.8 - mdist) / 1.8 * 0.025;
        nx += (mdx / mdist) * repel;
        ny += (mdy / mdist) * repel;
      }

      pos.setXYZ(i, nx, ny, nz);
    }
    pos.needsUpdate = true;

    // Dust material opacity scroll modulation
    const mat = dustRef.current.material as THREE.PointsMaterial;
    if (mat) {
      const tgt = s < 0.1 ? 0.10 : s < 0.5 ? 0.08 : s < 0.85 ? 0.06 : 0.03;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, tgt, 0.02);
    }

    // Neural Network Lines
    if (linesRef.current) {
      const lineActive = s > 0.05 && s < 0.90;
      const tlo = lineActive ? 0.15 * Math.min(s * 7, 1) * Math.min((0.92 - s) * 7, 1) : 0;
      lineOpacity.current = THREE.MathUtils.lerp(lineOpacity.current, tlo, 0.04);
      const lmat = linesRef.current.material as THREE.LineBasicMaterial;
      if (lmat) lmat.opacity = lineOpacity.current;

      if (lineActive && lineOpacity.current > 0.005) {
        const lpos = linesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        let li = 0;
        const step = Math.max(1, Math.floor(COUNT / 100));
        for (let i = 0; i < COUNT; i += step) {
          if (li >= MAX_LINES * 6) break;
          const ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i);
          for (let j = i + step; j < i + step * 12; j += step) {
            if (j >= COUNT || li >= MAX_LINES * 6) break;
            const bx = pos.getX(j), by = pos.getY(j), bz = pos.getZ(j);
            const dx = ax - bx, dy = ay - by, dz = az - bz;
            const dSq = dx * dx + dy * dy + dz * dz;
            if (dSq < 1.3225) {
              linePositions[li++] = ax; linePositions[li++] = ay; linePositions[li++] = az;
              linePositions[li++] = bx; linePositions[li++] = by; linePositions[li++] = bz;
            }
          }
        }
        lpos.needsUpdate = true;
      }
    }

    // Energy Particles
    if (energyRef.current) {
      const epos = energyRef.current.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < ENERGY; i++) {
        const ex = epos.getX(i), ey = epos.getY(i), ez = epos.getZ(i);
        const { cx: ecx, cy: ecy } = curl(ex * 0.5, ey * 0.5, ez * 0.3, t * 0.3);
        let nex = ex + ecx * 0.035, ney = ey + ecy * 0.035, nez = ez + 0.005;
        if (Math.abs(nex) > 6.5) nex *= -0.5;
        if (Math.abs(ney) > 4.5) ney *= -0.5;
        if (Math.abs(nez) > 3.5) nez *= -0.5;
        epos.setXYZ(i, nex, ney, nez);
      }
      epos.needsUpdate = true;
      const emat = energyRef.current.material as THREE.PointsMaterial;
      if (emat) emat.opacity = THREE.MathUtils.lerp(emat.opacity, s < 0.88 ? 0.50 : 0.08, 0.02);
    }

    // Scroll-controlled rotation speed
    const rotSpeedY = 0.004 + s * 0.006;
    dustRef.current.rotation.y = t * rotSpeedY + mouse.current.x * 0.03 + s * Math.PI * 0.5;
    dustRef.current.rotation.x = t * 0.002 + mouse.current.y * 0.02;
  });

  return (
    <>
      {/* Scroll-Controlled Quantum Energy Ring Group */}
      <group ref={ringsRef}>
        <mesh position={[0, 0, -2]}>
          <ringGeometry args={[3.2, 3.23, 64]} />
          <meshBasicMaterial color="#EB0028" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0, -2.5]} rotation={[0.4, 0.2, 0]}>
          <ringGeometry args={[4.2, 4.22, 64]} />
          <meshBasicMaterial color="#FF3A5E" transparent opacity={0.04} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      </group>

      {/* Floating Particle Cloud */}
      <points ref={dustRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[initPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          transparent color="#CCCCCC" size={0.025}
          sizeAttenuation depthWrite={false} depthTest={false}
          blending={THREE.AdditiveBlending} opacity={0.08}
        />
      </points>

      {/* Neural Network Line Segments */}
      <lineSegments ref={linesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#EB0028" transparent opacity={0}
          blending={THREE.AdditiveBlending} depthWrite={false} depthTest={false}
        />
      </lineSegments>

      {/* Glowing Energy Flow Nodes */}
      <points ref={energyRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[energyPos, 3]} />
        </bufferGeometry>
        <pointsMaterial
          transparent color="#EB0028" size={0.042}
          sizeAttenuation depthWrite={false} depthTest={false}
          blending={THREE.AdditiveBlending} opacity={0.45}
        />
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
      (a1Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.04 * (1 - s * 1.1));
      a1Ref.current.rotation.z = Math.sin(t * 0.03 + s * 2) * 0.25;
      a1Ref.current.position.y = Math.sin(t * 0.05 + s * 3) * 0.6 + 1.4;
    }
    if (a2Ref.current) {
      (a2Ref.current.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.025 * (1 - s * 0.8));
      a2Ref.current.rotation.z = Math.cos(t * 0.028 + s * 2) * 0.18;
      a2Ref.current.position.y = Math.cos(t * 0.04 + s * 2.5) * 0.5 - 1.4;
    }
  });
  return (
    <>
      <mesh ref={a1Ref} position={[0, 1.4, -3]}>
        <planeGeometry args={[20, 1.2]} />
        <meshBasicMaterial color="#EB0028" transparent opacity={0.04}
          blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={a2Ref} position={[0, -1.4, -3.5]}>
        <planeGeometry args={[18, 0.7]} />
        <meshBasicMaterial color="#CC1133" transparent opacity={0.025}
          blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

function VolumetricFog({ scrollCurrent }: { scrollCurrent: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.x = Math.sin(t * 0.012) * 0.7;
      ref.current.position.y = Math.cos(t * 0.01) * 0.3;
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.03 * (1 - scrollCurrent.current * 0.7);
    }
  });
  return (
    <mesh ref={ref} position={[0, 0, -6]}>
      <planeGeometry args={[26, 20]} />
      <meshBasicMaterial color="#2A0008" transparent opacity={0.03}
        blending={THREE.AdditiveBlending} depthWrite={false} />
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
    <div ref={ref} style={{ position: "absolute", top: 0, left: 0, width: "400px", height: "400px", borderRadius: "50%", pointerEvents: "none", background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.008) 45%, transparent 70%)", willChange: "transform" }} />
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
    <div ref={ref} style={{ position: "absolute", top: 0, left: 0, width: "55%", height: "200%", background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.015) 50%, transparent 100%)", transform: "translateX(-130%) translateY(-130%) rotate(28deg)", opacity: 0, willChange: "transform, opacity", pointerEvents: "none" }} />
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
