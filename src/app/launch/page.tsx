"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════
// TEDx KLH 2026 — METAMORPHOSIS
// THE CRIMSON PORTAL — FINAL CINEMATIC LAUNCH EXPERIENCE
// Route: /launch → Navigates to / upon completion
// ═══════════════════════════════════════════════════════════════════════

// ── COLOR PALETTE ──────────────────────────────────────────────────────
const PALETTE = {
  black: "#000000",
  void: "#050506",
  charcoal: "#09090B",
  darkWine: "#12070A",
  burgundyDeep: "#26080E",
  wine: "#5A0715",
  crimsonDeep: "#8F071C",
  crimson: "#EB0028",
  silverMuted: "#D9D9D9",
  silverBright: "#F4F4F4",
  white: "#FFFFFF",
};

const THREE_COLORS = {
  black: new THREE.Color(0x000000),
  void: new THREE.Color(0x050506),
  charcoal: new THREE.Color(0x09090b),
  darkWine: new THREE.Color(0x12070a),
  burgundyDeep: new THREE.Color(0x26080e),
  wine: new THREE.Color(0x5a0715),
  crimsonDeep: new THREE.Color(0x8f071c),
  crimson: new THREE.Color(0xeb0028),
  silver: new THREE.Color(0xd9d9d9),
  white: new THREE.Color(0xffffff),
};

// ── STATE MACHINE ──────────────────────────────────────────────────────
export type LaunchPhase =
  | "INTRO"              // 0.0s - 2.6s: Line drawn -> lattice forms -> portal awakens
  | "IDLE"               // Stable luxury state: breathing, silk light flow, micro parallax
  | "LAUNCH_COMPRESS"    // Click Step 1-2: Button compresses 3%, glow spikes, portal focuses
  | "LAUNCH_STILLNESS"   // Click Step 4-5: Motion halts, profound momentary stillness
  | "PORTAL_IMPLOSION"   // Click Step 6: Portal and crystalline shards implode into center
  | "BUTTERFLY_REVEAL"   // Center cracks open, dual-wing crystalline butterfly emerges
  | "METAMORPHOSIS"      // Butterfly dissolves into lines of light -> hyperspace light tunnel
  | "FLASH"              // Crimson + silver + white blinding cinematic flash
  | "COMPLETE";          // Clean route transition to /

// ── INTRO SEQUENCE TIMELINE CONSTANTS ──────────────────────────────────
const TIMINGS = {
  INTRO_LINE_START: 0.1,
  INTRO_LINE_CROSS: 0.6,
  INTRO_LATTICE: 1.2,
  INTRO_CRIMSON_AWAKEN: 1.8,
  INTRO_PORTAL_FORM: 2.3,
  INTRO_BUTTON_EMERGE: 2.8,
  INTRO_READY: 3.2,
};

// ── SHADER: CRIMSON SILK LIGHT FLOW ────────────────────────────────────
// Procedural fluid light flow moving around the portal ring like silk in water
const CrimsonSilkShader = {
  uniforms: {
    uTime: { value: 0 },
    uHover: { value: 0 },
    uImplosion: { value: 0 },
    uIntensity: { value: 1.0 },
    uColor1: { value: THREE_COLORS.wine },
    uColor2: { value: THREE_COLORS.crimsonDeep },
    uColor3: { value: THREE_COLORS.crimson },
    uColorSilver: { value: THREE_COLORS.white },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uHover;
    uniform float uImplosion;
    uniform float uIntensity;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColorSilver;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vec2 center = vec2(0.5, 0.5);
      vec2 pos = vUv - center;
      float angle = atan(pos.y, pos.x); // -PI to PI
      float dist = length(pos) * 2.0;

      // Soft ring mask
      float ringAlpha = smoothstep(0.7, 0.88, dist) * smoothstep(1.02, 0.88, dist);

      // Traveling waves (flowing like silk)
      float speed = 1.2 + uHover * 2.5 + uImplosion * 8.0;
      float wave1 = sin(angle * 3.0 - uTime * speed) * 0.5 + 0.5;
      float wave2 = sin(angle * 6.0 + uTime * (speed * 0.7) + dist * 4.0) * 0.5 + 0.5;
      float wave3 = cos(angle * 2.0 - uTime * (speed * 1.3)) * 0.5 + 0.5;

      float silkPattern = (wave1 * 0.5 + wave2 * 0.3 + wave3 * 0.2);

      // Color blending
      vec3 col = mix(uColor1, uColor2, silkPattern);
      col = mix(col, uColor3, wave1 * wave2);

      // Silver specular highlights catching the edge
      float silverCrest = smoothstep(0.75, 0.98, wave1 * wave3) * (0.4 + uHover * 0.6);
      col = mix(col, uColorSilver, silverCrest * 0.6);

      // Brightness boost during hover & implosion
      float totalIntensity = (uIntensity + uHover * 0.7 + uImplosion * 4.0);
      col *= totalIntensity;

      float alpha = ringAlpha * (0.65 + uHover * 0.25 + uImplosion * 0.35);
      gl_FragColor = vec4(col, alpha);
    }
  `,
};

// ── LAYER 1: SILVER CRYSTALLINE HAIRLINE RING & TICKS ──────────────────
function SilverHairlineRing({
  phaseRef,
  elapsedRef,
  hoverRef,
  implosionProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  hoverRef: React.MutableRefObject<number>;
  implosionProgressRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const ringLineRef = useRef<THREE.Line | null>(null);
  const ticksRef = useRef<THREE.LineSegments | null>(null);

  const portalRadius = Math.min(viewport.width, viewport.height) * 0.28;

  const ringMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: THREE_COLORS.silver,
        transparent: true,
        opacity: 0,
        linewidth: 1,
      }),
    []
  );

  const tickMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: THREE_COLORS.white,
        transparent: true,
        opacity: 0,
        linewidth: 1,
      }),
    []
  );

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    // 1. Continuous hairline circular line
    const segments = 128;
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(theta) * portalRadius,
          Math.sin(theta) * portalRadius,
          0
        )
      );
    }
    const ringGeo = new THREE.BufferGeometry().setFromPoints(points);
    const ringLine = new THREE.Line(ringGeo, ringMat);
    ringLineRef.current = ringLine;
    group.add(ringLine);

    // 2. Precision ticks around the circumference (64 ticks with 4 cardinal points)
    const tickPoints: THREE.Vector3[] = [];
    const totalTicks = 64;
    for (let i = 0; i < totalTicks; i++) {
      const theta = (i / totalTicks) * Math.PI * 2;
      const isCardinal = i % 16 === 0;
      const isMajor = i % 4 === 0;
      const len = isCardinal
        ? portalRadius * 0.08
        : isMajor
        ? portalRadius * 0.04
        : portalRadius * 0.02;

      const innerR = portalRadius - len * 0.5;
      const outerR = portalRadius + len * 0.5;

      tickPoints.push(
        new THREE.Vector3(Math.cos(theta) * innerR, Math.sin(theta) * innerR, 0)
      );
      tickPoints.push(
        new THREE.Vector3(Math.cos(theta) * outerR, Math.sin(theta) * outerR, 0)
      );
    }
    const ticksGeo = new THREE.BufferGeometry().setFromPoints(tickPoints);
    const ticksObj = new THREE.LineSegments(ticksGeo, tickMat);
    ticksRef.current = ticksObj;
    group.add(ticksObj);

    return () => {
      group.remove(ringLine, ticksObj);
      ringGeo.dispose();
      ticksGeo.dispose();
    };
  }, [portalRadius, ringMat, tickMat]);

  useFrame((_, delta) => {
    const elapsed = elapsedRef.current;
    const phase = phaseRef.current;
    const hover = hoverRef.current;
    const implosion = implosionProgressRef.current;

    let targetRingAlpha = 0;
    let targetTickAlpha = 0;

    if (phase === "INTRO") {
      if (elapsed > TIMINGS.INTRO_PORTAL_FORM) {
        const p = Math.min(1, (elapsed - TIMINGS.INTRO_PORTAL_FORM) / 0.8);
        targetRingAlpha = p * 0.75;
        targetTickAlpha = p * 0.5;
      }
    } else if (
      phase === "IDLE" ||
      phase === "LAUNCH_COMPRESS" ||
      phase === "LAUNCH_STILLNESS"
    ) {
      targetRingAlpha = 0.75 + hover * 0.25;
      targetTickAlpha = 0.45 + hover * 0.4;
    } else if (phase === "PORTAL_IMPLOSION") {
      targetRingAlpha = (1 - implosion) * 0.9;
      targetTickAlpha = (1 - implosion) * 0.8;
    }

    ringMat.opacity += (targetRingAlpha - ringMat.opacity) * delta * 4;
    tickMat.opacity += (targetTickAlpha - tickMat.opacity) * delta * 4;

    if (groupRef.current) {
      // Very slow rotation
      const rotSpeed = 0.04 + hover * 0.1;
      groupRef.current.rotation.z += delta * rotSpeed;

      // Implosion scale
      if (phase === "PORTAL_IMPLOSION") {
        const s = Math.max(0.001, 1 - Math.pow(implosion, 2));
        groupRef.current.scale.set(s, s, s);
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return <group ref={groupRef} position={[0, 0, 0.05]} />;
}

// ── LAYER 2: DARK REFLECTIVE GLASS RING ────────────────────────────────
function DarkReflectiveGlassRing({
  phaseRef,
  elapsedRef,
  hoverRef,
  implosionProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  hoverRef: React.MutableRefObject<number>;
  implosionProgressRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const portalRadius = Math.min(viewport.width, viewport.height) * 0.28;

  const glassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: THREE_COLORS.darkWine,
        metalness: 0.35,
        roughness: 0.1,
        transparent: true,
        opacity: 0,
        transmission: 0.6,
        ior: 1.5,
        reflectivity: 0.9,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((_, delta) => {
    const elapsed = elapsedRef.current;
    const phase = phaseRef.current;
    const hover = hoverRef.current;
    const implosion = implosionProgressRef.current;

    let targetAlpha = 0;
    if (phase === "INTRO") {
      if (elapsed > TIMINGS.INTRO_PORTAL_FORM) {
        targetAlpha = Math.min(0.65, (elapsed - TIMINGS.INTRO_PORTAL_FORM) * 0.8);
      }
    } else if (
      phase === "IDLE" ||
      phase === "LAUNCH_COMPRESS" ||
      phase === "LAUNCH_STILLNESS"
    ) {
      targetAlpha = 0.65 + hover * 0.25;
    } else if (phase === "PORTAL_IMPLOSION") {
      targetAlpha = (1 - implosion) * 0.8;
    }

    glassMat.opacity += (targetAlpha - glassMat.opacity) * delta * 3;

    if (meshRef.current) {
      if (phase === "PORTAL_IMPLOSION") {
        const s = Math.max(0.001, 1 - Math.pow(implosion, 2));
        meshRef.current.scale.set(s, s, s);
      } else {
        const breath = 1.0 + Math.sin(elapsed * 1.3) * 0.008;
        meshRef.current.scale.set(breath, breath, 1);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <ringGeometry
        args={[portalRadius * 0.92, portalRadius * 1.08, 64]}
      />
      <primitive object={glassMat} />
    </mesh>
  );
}

// ── LAYER 3: DEEP CRIMSON ENERGY RING (SILK LIGHT FLOW) ────────────────
function DeepCrimsonEnergyRing({
  phaseRef,
  elapsedRef,
  hoverRef,
  implosionProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  hoverRef: React.MutableRefObject<number>;
  implosionProgressRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const portalRadius = Math.min(viewport.width, viewport.height) * 0.28;

  const shaderMat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(CrimsonSilkShader.uniforms),
      vertexShader: CrimsonSilkShader.vertexShader,
      fragmentShader: CrimsonSilkShader.fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  useFrame((_, delta) => {
    const elapsed = elapsedRef.current;
    const phase = phaseRef.current;
    const hover = hoverRef.current;
    const implosion = implosionProgressRef.current;

    shaderMat.uniforms.uTime.value = elapsed;
    shaderMat.uniforms.uHover.value = hover;
    shaderMat.uniforms.uImplosion.value = implosion;

    let targetIntensity = 0;
    if (phase === "INTRO") {
      if (elapsed > TIMINGS.INTRO_CRIMSON_AWAKEN) {
        targetIntensity = Math.min(
          1.2,
          (elapsed - TIMINGS.INTRO_CRIMSON_AWAKEN) * 1.1
        );
      }
    } else if (phase === "IDLE") {
      targetIntensity = 1.2 + Math.sin(elapsed * 1.8) * 0.2;
    } else if (phase === "LAUNCH_COMPRESS") {
      targetIntensity = 3.0;
    } else if (phase === "LAUNCH_STILLNESS") {
      targetIntensity = 1.0;
    } else if (phase === "PORTAL_IMPLOSION") {
      targetIntensity = 2.0 + implosion * 6.0;
    }

    shaderMat.uniforms.uIntensity.value +=
      (targetIntensity - shaderMat.uniforms.uIntensity.value) * delta * 4;

    if (meshRef.current) {
      if (phase === "PORTAL_IMPLOSION") {
        const s = Math.max(0.001, 1 - Math.pow(implosion, 2));
        meshRef.current.scale.set(s, s, s);
      } else {
        meshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.02]}>
      <planeGeometry args={[portalRadius * 2.6, portalRadius * 2.6]} />
      <primitive object={shaderMat} />
    </mesh>
  );
}

// ── LAYER 4: SEGMENTED METALLIC / CRYSTALLINE ARCS ─────────────────────
function SegmentedCrystallineArcs({
  phaseRef,
  elapsedRef,
  hoverRef,
  implosionProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  hoverRef: React.MutableRefObject<number>;
  implosionProgressRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const portalRadius = Math.min(viewport.width, viewport.height) * 0.28;

  const arcCount = 16;
  const arcSegments = useMemo(() => {
    const items = [];
    const angleStep = (Math.PI * 2) / arcCount;
    const gap = 0.08; // gap between segments in radians

    for (let i = 0; i < arcCount; i++) {
      const startAngle = i * angleStep + gap / 2;
      const endAngle = (i + 1) * angleStep - gap / 2;
      const isCrimson = i % 4 === 1 || i % 4 === 3;

      items.push({
        startAngle,
        endAngle,
        isCrimson,
        zOffset: (Math.sin(i * 1.5) * 0.04) * portalRadius,
      });
    }
    return items;
  }, [arcCount, portalRadius]);

  const silverArcMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: THREE_COLORS.silver,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
      }),
    []
  );

  const crimsonArcMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: THREE_COLORS.crimson,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0,
        emissive: THREE_COLORS.wine,
        emissiveIntensity: 0.4,
        clearcoat: 0.9,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame((_, delta) => {
    const elapsed = elapsedRef.current;
    const phase = phaseRef.current;
    const hover = hoverRef.current;
    const implosion = implosionProgressRef.current;

    let targetAlpha = 0;
    if (phase === "INTRO") {
      if (elapsed > TIMINGS.INTRO_PORTAL_FORM) {
        targetAlpha = Math.min(
          0.85,
          (elapsed - TIMINGS.INTRO_PORTAL_FORM) * 0.9
        );
      }
    } else if (
      phase === "IDLE" ||
      phase === "LAUNCH_COMPRESS" ||
      phase === "LAUNCH_STILLNESS"
    ) {
      targetAlpha = 0.85 + hover * 0.15;
    } else if (phase === "PORTAL_IMPLOSION") {
      targetAlpha = (1 - implosion) * 0.9;
    }

    silverArcMat.opacity += (targetAlpha - silverArcMat.opacity) * delta * 3;
    crimsonArcMat.opacity += (targetAlpha - crimsonArcMat.opacity) * delta * 3;

    if (groupRef.current) {
      // Counter-rotation to inner ring
      const speed = -0.03 - hover * 0.08;
      groupRef.current.rotation.z += delta * speed;

      if (phase === "PORTAL_IMPLOSION") {
        const s = Math.max(0.001, 1 - Math.pow(implosion, 2.2));
        groupRef.current.scale.set(s, s, s);
      } else {
        groupRef.current.scale.set(1, 1, 1);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.03]}>
      {arcSegments.map((arc, i) => (
        <mesh
          key={i}
          position={[0, 0, arc.zOffset]}
          material={arc.isCrimson ? crimsonArcMat : silverArcMat}
        >
          <ringGeometry
            args={[
              portalRadius * 1.12,
              portalRadius * 1.15,
              16,
              1,
              arc.startAngle,
              arc.endAngle - arc.startAngle,
            ]}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── LAYER 5: ATMOSPHERIC HALO & VOLUMETRIC AURA ────────────────────────
function AtmosphericHalo({
  phaseRef,
  elapsedRef,
  hoverRef,
  implosionProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  hoverRef: React.MutableRefObject<number>;
  implosionProgressRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const portalRadius = Math.min(viewport.width, viewport.height) * 0.28;

  const haloMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: THREE_COLORS.burgundyDeep,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    []
  );

  useFrame((_, delta) => {
    const elapsed = elapsedRef.current;
    const phase = phaseRef.current;
    const hover = hoverRef.current;
    const implosion = implosionProgressRef.current;

    let targetAlpha = 0;
    if (phase === "INTRO") {
      if (elapsed > TIMINGS.INTRO_CRIMSON_AWAKEN) {
        targetAlpha = Math.min(0.25, (elapsed - TIMINGS.INTRO_CRIMSON_AWAKEN) * 0.2);
      }
    } else if (phase === "IDLE") {
      targetAlpha = 0.22 + Math.sin(elapsed * 1.2) * 0.05 + hover * 0.15;
    } else if (phase === "LAUNCH_COMPRESS") {
      targetAlpha = 0.45;
    } else if (phase === "PORTAL_IMPLOSION") {
      targetAlpha = (1 - implosion) * 0.35;
    }

    haloMat.opacity += (targetAlpha - haloMat.opacity) * delta * 2;

    if (meshRef.current) {
      if (phase === "PORTAL_IMPLOSION") {
        const s = Math.max(0.001, 1 - Math.pow(implosion, 2));
        meshRef.current.scale.set(s, s, 1);
      } else {
        const breath = 1.0 + Math.sin(elapsed * 0.9) * 0.03 + hover * 0.05;
        meshRef.current.scale.set(breath, breath, 1);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -0.15]}>
      <ringGeometry args={[portalRadius * 0.6, portalRadius * 1.8, 64]} />
      <primitive object={haloMat} />
    </mesh>
  );
}

// ── LAYER 6: HIDDEN METAMORPHOSIS (BUTTERFLY GEOMETRIC SEED) ───────────
// Embedded inside the portal ring: left side silver, right side crimson.
// Initially subtle, catching specular glimmers. Revealed prominently post-implosion!
function HiddenMetamorphosisSeed({
  phaseRef,
  elapsedRef,
  hoverRef,
  implosionProgressRef,
  metamorphosisProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  hoverRef: React.MutableRefObject<number>;
  implosionProgressRef: React.MutableRefObject<number>;
  metamorphosisProgressRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const portalRadius = Math.min(viewport.width, viewport.height) * 0.28;

  // Dual wing materials: Silver Left, Crimson Right
  const silverWingMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: THREE_COLORS.silver,
        metalness: 0.9,
        roughness: 0.12,
        transparent: true,
        opacity: 0,
        emissive: new THREE.Color(0xcccccc),
        emissiveIntensity: 0.2,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
      }),
    []
  );

  const crimsonWingMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: THREE_COLORS.crimson,
        metalness: 0.85,
        roughness: 0.15,
        transparent: true,
        opacity: 0,
        emissive: THREE_COLORS.crimsonDeep,
        emissiveIntensity: 0.35,
        clearcoat: 1.0,
        side: THREE.DoubleSide,
      }),
    []
  );

  // Crystalline faceted wing geometries
  const { leftWingGeo, rightWingGeo } = useMemo(() => {
    // Generate faceted butterfly wing geometry
    const makeWingGeometry = (isLeft: boolean) => {
      const geo = new THREE.BufferGeometry();
      const s = isLeft ? -1 : 1;
      const r = portalRadius * 0.45;

      // Faceted crystal vertices defining upper & lower wing lobes
      const vertices = new Float32Array([
        // Center spine root
        0, 0, 0,
        // Upper outer tip
        s * r * 1.3, r * 0.85, 0.05 * r,
        // Upper middle crest
        s * r * 0.9, r * 1.2, 0.08 * r,
        // Upper inner junction
        s * r * 0.3, r * 0.4, 0.02 * r,
        // Lower outer tip
        s * r * 1.05, -r * 0.65, 0.04 * r,
        // Lower bottom lobe
        s * r * 0.55, -r * 1.0, 0.06 * r,
        // Lower inner root
        0, -r * 0.3, 0,
      ]);

      // Triangular facet indices
      const indices = [
        0, 2, 1,
        0, 3, 2,
        0, 1, 4,
        0, 4, 5,
        0, 5, 6,
      ];

      geo.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    };

    return {
      leftWingGeo: makeWingGeometry(true),
      rightWingGeo: makeWingGeometry(false),
    };
  }, [portalRadius]);

  useFrame((_, delta) => {
    const elapsed = elapsedRef.current;
    const phase = phaseRef.current;
    const hover = hoverRef.current;
    const metaProgress = metamorphosisProgressRef.current;

    let targetAlpha = 0;
    let wingScale = 1.0;
    let wingZ = 0;

    if (phase === "INTRO") {
      targetAlpha = 0;
    } else if (phase === "IDLE") {
      // Very subtle hidden presence — catches specular glimmer periodically
      const glimmer = Math.pow(Math.sin(elapsed * 0.8), 6) * 0.25;
      targetAlpha = 0.12 + glimmer + hover * 0.28;
    } else if (
      phase === "LAUNCH_COMPRESS" ||
      phase === "LAUNCH_STILLNESS"
    ) {
      targetAlpha = 0.45;
    } else if (phase === "PORTAL_IMPLOSION") {
      // Center concentrates
      targetAlpha = 0.8;
    } else if (phase === "BUTTERFLY_REVEAL") {
      // ── GLORIOUS THEME REVELATION ──
      targetAlpha = 1.0;
      wingScale = 1.6;
      wingZ = 0.5;
    } else if (phase === "METAMORPHOSIS") {
      // Transforming into light tunnel
      targetAlpha = Math.max(0, 1 - metaProgress * 1.5);
      wingScale = 1.6 + metaProgress * 3.0;
    }

    silverWingMat.opacity += (targetAlpha - silverWingMat.opacity) * delta * 4;
    crimsonWingMat.opacity += (targetAlpha - crimsonWingMat.opacity) * delta * 4;

    if (groupRef.current) {
      // Subtle wing breathing
      if (phase !== "METAMORPHOSIS" && phase !== "COMPLETE") {
        const wingFlap = Math.sin(elapsed * 1.5) * 0.05;
        groupRef.current.rotation.y = wingFlap;
      }

      // Smooth scaling during reveal
      groupRef.current.scale.lerp(
        new THREE.Vector3(wingScale, wingScale, wingScale),
        delta * 6
      );
      groupRef.current.position.z +=
        (wingZ - groupRef.current.position.z) * delta * 5;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.01]}>
      {/* Left Wing — Silver */}
      <mesh geometry={leftWingGeo} material={silverWingMat} />
      {/* Right Wing — Crimson */}
      <mesh geometry={rightWingGeo} material={crimsonWingMat} />
    </group>
  );
}

// ── FLOATING CRYSTALLINE ENVIRONMENT (CHAMBER SCULPTURE) ───────────────
// Symmetrical floating crystal shards, glass planes, and metallic arcs floating in depth.
function FloatingCrystallineChamber({
  phaseRef,
  elapsedRef,
  mouseRef,
  hoverRef,
  implosionProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  hoverRef: React.MutableRefObject<number>;
  implosionProgressRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const scale = Math.min(viewport.width, viewport.height) * 0.35;

  const shardCount = viewport.width < 5 ? 24 : 48;

  // Symmetrical crystalline shard cluster data
  const shardsData = useMemo(() => {
    const data = [];
    for (let i = 0; i < shardCount; i++) {
      const isLeft = i % 2 === 0;
      const side = isLeft ? -1 : 1;
      const angle = (Math.floor(i / 2) / (shardCount / 2)) * Math.PI * 2;
      const r = (1.4 + (i % 3) * 0.45) * scale;

      const baseX = side * Math.abs(Math.cos(angle) * r);
      const baseY = Math.sin(angle) * r;
      // Varied depth layers: background (-3) to foreground (+1.5)
      const baseZ = ((i % 5) - 2) * 0.8 * scale;

      data.push({
        basePos: new THREE.Vector3(baseX, baseY, baseZ),
        currentPos: new THREE.Vector3(baseX, baseY, baseZ),
        rotSpeed: new THREE.Vector3(
          (Math.sin(i) * 0.4) * 0.5,
          (Math.cos(i) * 0.4) * 0.5,
          (Math.sin(i * 2) * 0.3) * 0.5
        ),
        size: (0.04 + (i % 4) * 0.025) * scale,
        isCrimson: i % 3 === 0,
        depthFactor: 0.2 + (i % 5) * 0.2,
      });
    }
    return data;
  }, [shardCount, scale]);

  // Diamond facet geometry for shards
  const shardGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const verts = new Float32Array([
      0, 1, 0,
      0.6, 0, 0.15,
      0, -1.1, 0,
      -0.6, 0, -0.15,
      0, 0, 0.4,
      0, 0, -0.4,
    ]);
    const indices = [
      0, 1, 4, 0, 4, 3, 0, 3, 5, 0, 5, 1,
      2, 4, 1, 2, 3, 4, 2, 5, 3, 2, 1, 5,
    ];
    geo.setAttribute("position", new THREE.BufferAttribute(verts, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  const silverMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: THREE_COLORS.silver,
        metalness: 0.95,
        roughness: 0.1,
        transparent: true,
        opacity: 0,
        clearcoat: 1.0,
      }),
    []
  );

  const crimsonMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: THREE_COLORS.crimson,
        metalness: 0.8,
        roughness: 0.15,
        transparent: true,
        opacity: 0,
        emissive: THREE_COLORS.crimsonDeep,
        emissiveIntensity: 0.3,
        clearcoat: 1.0,
      }),
    []
  );

  const meshRefs = useRef<THREE.Mesh[]>([]);

  useFrame((_, delta) => {
    const elapsed = elapsedRef.current;
    const phase = phaseRef.current;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const hover = hoverRef.current;
    const implosion = implosionProgressRef.current;

    let targetAlpha = 0;
    if (phase === "INTRO") {
      if (elapsed > TIMINGS.INTRO_LATTICE) {
        targetAlpha = Math.min(
          0.75,
          (elapsed - TIMINGS.INTRO_LATTICE) * 0.8
        );
      }
    } else if (
      phase === "IDLE" ||
      phase === "LAUNCH_COMPRESS" ||
      phase === "LAUNCH_STILLNESS"
    ) {
      targetAlpha = 0.75 + hover * 0.2;
    } else if (phase === "PORTAL_IMPLOSION") {
      targetAlpha = (1 - implosion) * 0.85;
    }

    silverMat.opacity += (targetAlpha - silverMat.opacity) * delta * 3;
    crimsonMat.opacity += (targetAlpha - crimsonMat.opacity) * delta * 3;

    for (let i = 0; i < shardsData.length; i++) {
      const s = shardsData[i];
      const mesh = meshRefs.current[i];
      if (!mesh) continue;

      if (phase === "PORTAL_IMPLOSION") {
        // ── STEP 6: IMPLOSION TOWARD CENTER (0, 0, 0) ──
        const collapseEase = Math.pow(implosion, 2.5);
        mesh.position.x = s.basePos.x * (1 - collapseEase);
        mesh.position.y = s.basePos.y * (1 - collapseEase);
        mesh.position.z = s.basePos.z * (1 - collapseEase);
        mesh.scale.setScalar(s.size * Math.max(0.01, 1 - collapseEase));
        mesh.rotation.x += delta * 6;
        mesh.rotation.y += delta * 6;
      } else {
        // Subtle floating orbit + parallax
        const orbitAngle = elapsed * 0.2 + i;
        const floatX = Math.cos(orbitAngle) * 0.05 * scale;
        const floatY = Math.sin(orbitAngle * 1.3) * 0.05 * scale;

        // Mouse Parallax with spring factor
        const parallaxX = mx * s.depthFactor * 0.25 * scale;
        const parallaxY = -my * s.depthFactor * 0.25 * scale;

        // Hover effect: outer structures subtly tilt toward center
        const hoverPull = hover * 0.08;
        const pullX = (0 - s.basePos.x) * hoverPull;
        const pullY = (0 - s.basePos.y) * hoverPull;

        mesh.position.set(
          s.basePos.x + floatX + parallaxX + pullX,
          s.basePos.y + floatY + parallaxY + pullY,
          s.basePos.z
        );

        mesh.rotation.x += s.rotSpeed.x * delta;
        mesh.rotation.y += s.rotSpeed.y * delta;
        mesh.rotation.z += s.rotSpeed.z * delta;
        mesh.scale.setScalar(s.size);
      }
    }
  });

  return (
    <group ref={groupRef}>
      {shardsData.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          geometry={shardGeo}
          material={s.isCrimson ? crimsonMat : silverMat}
          position={[s.basePos.x, s.basePos.y, s.basePos.z]}
        />
      ))}
    </group>
  );
}

// ── FINAL METAMORPHOSIS LIGHT TUNNEL (HYPERSPACE) ──────────────────────
function LightTunnelStreaks({
  phaseRef,
  metamorphosisProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  metamorphosisProgressRef: React.MutableRefObject<number>;
}) {
  const { viewport } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const count = 36;
  const radius = Math.min(viewport.width, viewport.height) * 0.35;

  const streaks = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      const r = radius * (0.3 + (i % 4) * 0.35);
      const isCrimson = i % 2 === 0;
      list.push({
        x: Math.cos(theta) * r,
        y: Math.sin(theta) * r,
        zStart: -10 + (i % 6) * 3,
        length: 8 + (i % 3) * 4,
        isCrimson,
      });
    }
    return list;
  }, [count, radius]);

  const streakGeo = useMemo(() => {
    return new THREE.CylinderGeometry(0.015, 0.015, 1, 6);
  }, []);

  const silverStreakMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: THREE_COLORS.white,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  const crimsonStreakMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: THREE_COLORS.crimson,
        transparent: true,
        opacity: 0,
      }),
    []
  );

  useFrame((_, delta) => {
    const phase = phaseRef.current;
    const progress = metamorphosisProgressRef.current;

    if (phase === "METAMORPHOSIS") {
      const alpha = Math.min(1, progress * 2.5);
      silverStreakMat.opacity = alpha;
      crimsonStreakMat.opacity = alpha;

      if (groupRef.current) {
        // Accelerate through camera
        groupRef.current.position.z += delta * (15 + progress * 45);
      }
    } else {
      silverStreakMat.opacity = 0;
      crimsonStreakMat.opacity = 0;
      if (groupRef.current) {
        groupRef.current.position.z = 0;
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      {streaks.map((s, i) => (
        <mesh
          key={i}
          geometry={streakGeo}
          material={s.isCrimson ? crimsonStreakMat : silverStreakMat}
          position={[s.x, s.y, s.zStart]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[1, s.length, 1]}
        />
      ))}
    </group>
  );
}

// ── CINEMATIC CAMERA SYSTEM ────────────────────────────────────────────
function CinematicChamberCamera({
  phaseRef,
  elapsedRef,
  mouseRef,
  implosionProgressRef,
  metamorphosisProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  mouseRef: React.MutableRefObject<{ x: number; y: number }>;
  implosionProgressRef: React.MutableRefObject<number>;
  metamorphosisProgressRef: React.MutableRefObject<number>;
}) {
  const { camera } = useThree();
  const targetZ = useRef(7.2);

  useFrame((_, delta) => {
    const phase = phaseRef.current;
    const elapsed = elapsedRef.current;
    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;
    const implosion = implosionProgressRef.current;
    const metaProgress = metamorphosisProgressRef.current;

    // Camera target depth based on state
    if (phase === "INTRO") {
      targetZ.current = 7.8;
    } else if (phase === "IDLE") {
      targetZ.current = 6.8;
    } else if (phase === "LAUNCH_COMPRESS") {
      targetZ.current = 6.6;
    } else if (phase === "LAUNCH_STILLNESS") {
      targetZ.current = 6.6;
    } else if (phase === "PORTAL_IMPLOSION") {
      // Rapid plunge toward center
      targetZ.current = 6.6 - Math.pow(implosion, 2) * 4.2;
    } else if (phase === "BUTTERFLY_REVEAL") {
      targetZ.current = 2.4;
    } else if (phase === "METAMORPHOSIS") {
      // Plunge through light tunnel
      targetZ.current = Math.max(0.1, 2.4 - metaProgress * 6.0);
    }

    // Smooth Z interpolation
    camera.position.z += (targetZ.current - camera.position.z) * delta * 3.5;

    // Cursor Parallax (spring interpolation)
    if (phase !== "METAMORPHOSIS" && phase !== "FLASH") {
      const pStrength = 0.28;
      camera.position.x += (mx * pStrength - camera.position.x) * delta * 2.5;
      camera.position.y += (-my * pStrength * 0.7 - camera.position.y) * delta * 2.5;

      // Micro continuous orbital drift
      camera.position.x += Math.sin(elapsed * 0.25) * 0.002;
      camera.position.y += Math.cos(elapsed * 0.2) * 0.0015;
    }

    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ── LUXURY LIGHTING RIG ────────────────────────────────────────────────
function LuxuryChamberLighting({
  phaseRef,
  elapsedRef,
  hoverRef,
  implosionProgressRef,
}: {
  phaseRef: React.MutableRefObject<LaunchPhase>;
  elapsedRef: React.MutableRefObject<number>;
  hoverRef: React.MutableRefObject<number>;
  implosionProgressRef: React.MutableRefObject<number>;
}) {
  const centralCrimsonLight = useRef<THREE.PointLight>(null);
  const orbitingSilverLight = useRef<THREE.PointLight>(null);
  const backlightRef = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    const phase = phaseRef.current;
    const elapsed = elapsedRef.current;
    const hover = hoverRef.current;
    const implosion = implosionProgressRef.current;

    // 1. Central Crimson Light
    if (centralCrimsonLight.current) {
      let targetIntensity = 0;
      if (phase === "INTRO") {
        if (elapsed > TIMINGS.INTRO_CRIMSON_AWAKEN) {
          targetIntensity = Math.min(
            2.0,
            (elapsed - TIMINGS.INTRO_CRIMSON_AWAKEN) * 1.5
          );
        }
      } else if (phase === "IDLE") {
        targetIntensity = 2.2 + Math.sin(elapsed * 1.6) * 0.4 + hover * 1.5;
      } else if (phase === "LAUNCH_COMPRESS") {
        targetIntensity = 5.0;
      } else if (phase === "LAUNCH_STILLNESS") {
        targetIntensity = 1.5;
      } else if (phase === "PORTAL_IMPLOSION") {
        targetIntensity = 3.0 + implosion * 10.0;
      } else if (phase === "BUTTERFLY_REVEAL") {
        targetIntensity = 8.0;
      } else if (phase === "METAMORPHOSIS") {
        targetIntensity = 15.0;
      }

      centralCrimsonLight.current.intensity +=
        (targetIntensity - centralCrimsonLight.current.intensity) * delta * 4;
    }

    // 2. Orbiting Silver Specular Light (creates luxury highlights)
    if (orbitingSilverLight.current) {
      const orbAngle = elapsed * 0.45;
      orbitingSilverLight.current.position.set(
        Math.cos(orbAngle) * 3.5,
        Math.sin(orbAngle * 0.7) * 2.5,
        2.5
      );
      orbitingSilverLight.current.intensity =
        phase === "INTRO" ? 0.3 : 1.2 + hover * 0.8;
    }

    // 3. Backlight
    if (backlightRef.current) {
      backlightRef.current.intensity = phase === "IDLE" ? 0.8 : 1.5;
    }
  });

  return (
    <>
      <ambientLight intensity={0.06} color={0x09090b} />
      <pointLight
        ref={centralCrimsonLight}
        position={[0, 0, 1.5]}
        color={0xeb0028}
        intensity={0}
        distance={14}
        decay={2}
      />
      <pointLight
        ref={orbitingSilverLight}
        position={[2.5, 2, 2.5]}
        color={0xf4f4f4}
        intensity={0.8}
        distance={12}
        decay={2}
      />
      <pointLight
        ref={backlightRef}
        position={[0, 0, -4]}
        color={0x5a0715}
        intensity={0.8}
        distance={15}
        decay={2}
      />
    </>
  );
}

// ── FLASH OVERLAY (FINAL METAMORPHOSIS TRANSITION) ─────────────────────
function CinematicFlashOverlay({
  flashOpacity,
}: {
  flashOpacity: number;
}) {
  if (flashOpacity < 0.005) return null;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none transition-none"
      style={{
        background: `radial-gradient(
          circle at center,
          rgba(255, 255, 255, ${flashOpacity}) 0%,
          rgba(235, 0, 40, ${flashOpacity * 0.85}) 40%,
          rgba(90, 7, 21, ${flashOpacity * 0.9}) 75%,
          rgba(0, 0, 0, ${flashOpacity}) 100%
        )`,
        opacity: flashOpacity,
      }}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN LAUNCH PAGE
// ═══════════════════════════════════════════════════════════════════════

export default function LaunchPage() {
  const router = useRouter();

  // Animation & state synchronization refs
  const phaseRef = useRef<LaunchPhase>("INTRO");
  const elapsedRef = useRef(0);
  const hoverRef = useRef(0); // 0 to 1 smooth
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });
  const implosionProgressRef = useRef(0); // 0 to 1
  const metamorphosisProgressRef = useRef(0); // 0 to 1
  const startTimeRef = useRef(0);

  // React UI state
  const [uiPhase, setUiPhase] = useState<LaunchPhase>("INTRO");
  const [showButton, setShowButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [flashOpacity, setFlashOpacity] = useState(0);

  // Mouse Tracking
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    targetMouseRef.current = {
      x: (e.clientX / window.innerWidth) * 2 - 1,
      y: (e.clientY / window.innerHeight) * 2 - 1,
    };
  }, []);

  // Launch Trigger Handler
  const handleLaunchClick = useCallback(() => {
    if (phaseRef.current !== "IDLE") return;

    // STEP 1-2: Button compresses 3%, glow spikes, portal focuses
    phaseRef.current = "LAUNCH_COMPRESS";
    setUiPhase("LAUNCH_COMPRESS");

    const launchStartTime = performance.now();

    const launchTimelineTick = () => {
      const now = performance.now();
      const dt = (now - launchStartTime) / 1000;

      // Step 1-2: Compress (0.0s - 0.25s)
      if (dt < 0.25) {
        phaseRef.current = "LAUNCH_COMPRESS";
      }
      // Step 4-5: Profound Stillness (0.25s - 0.45s)
      else if (dt < 0.45) {
        phaseRef.current = "LAUNCH_STILLNESS";
      }
      // Step 6: Portal Implosion (0.45s - 1.15s)
      else if (dt < 1.15) {
        phaseRef.current = "PORTAL_IMPLOSION";
        implosionProgressRef.current = Math.min(1, (dt - 0.45) / 0.7);
      }
      // Butterfly Reveal (1.15s - 1.65s)
      else if (dt < 1.65) {
        phaseRef.current = "BUTTERFLY_REVEAL";
        implosionProgressRef.current = 1.0;
      }
      // Metamorphosis Light Tunnel (1.65s - 2.15s)
      else if (dt < 2.15) {
        phaseRef.current = "METAMORPHOSIS";
        metamorphosisProgressRef.current = Math.min(1, (dt - 1.65) / 0.5);
      }
      // Cinematic Flash (2.15s - 2.45s)
      else if (dt < 2.45) {
        phaseRef.current = "FLASH";
        const flashProgress = (dt - 2.15) / 0.3;
        setFlashOpacity(Math.min(1, flashProgress * 1.5));
      }
      // Final Navigation
      else {
        phaseRef.current = "COMPLETE";
        setFlashOpacity(1);
        router.push("/");
        return;
      }

      requestAnimationFrame(launchTimelineTick);
    };

    requestAnimationFrame(launchTimelineTick);
  }, [router]);

  // Main Loop for State Machine & Progress
  useEffect(() => {
    startTimeRef.current = performance.now();

    // Check prefers-reduced-motion
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      phaseRef.current = "IDLE";
      setUiPhase("IDLE");
      setShowButton(true);
      return;
    }

    let animId: number;

    const tick = () => {
      const now = performance.now();
      const elapsed = (now - startTimeRef.current) / 1000;
      elapsedRef.current = elapsed;

      // Mouse smoothing with spring factor
      mouseRef.current.x +=
        (targetMouseRef.current.x - mouseRef.current.x) * 0.08;
      mouseRef.current.y +=
        (targetMouseRef.current.y - mouseRef.current.y) * 0.08;

      // Smooth hover interpolation
      const targetHover = isHovered ? 1.0 : 0.0;
      hoverRef.current += (targetHover - hoverRef.current) * 0.1;

      // State machine progressions during initial load
      if (
        phaseRef.current === "INTRO" ||
        phaseRef.current === "IDLE"
      ) {
        if (elapsed > TIMINGS.INTRO_BUTTON_EMERGE && !showButton) {
          setShowButton(true);
        }
        if (elapsed > TIMINGS.INTRO_READY && phaseRef.current === "INTRO") {
          phaseRef.current = "IDLE";
          setUiPhase("IDLE");
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isHovered, showButton]);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="fixed inset-0 w-screen h-screen min-h-[100svh] min-h-[100dvh] min-h-[100lvh] bg-[#000000] text-white select-none overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #09090B 0%, #050506 50%, #000000 100%)",
      }}
    >
      {/* ── WEBGL 3D CANVAS LAYER ── */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          camera={{ position: [0, 0, 7.8], fov: 42, near: 0.1, far: 50 }}
          style={{ background: "#000000" }}
          onCreated={({ gl }) => {
            gl.setClearColor(THREE_COLORS.black);
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.25;
          }}
        >
          <CinematicChamberCamera
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            mouseRef={mouseRef}
            implosionProgressRef={implosionProgressRef}
            metamorphosisProgressRef={metamorphosisProgressRef}
          />
          <LuxuryChamberLighting
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            hoverRef={hoverRef}
            implosionProgressRef={implosionProgressRef}
          />

          {/* ── THE CRIMSON PORTAL: 6 CONCENTRIC DEPTH LAYERS ── */}
          <SilverHairlineRing
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            hoverRef={hoverRef}
            implosionProgressRef={implosionProgressRef}
          />
          <DarkReflectiveGlassRing
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            hoverRef={hoverRef}
            implosionProgressRef={implosionProgressRef}
          />
          <DeepCrimsonEnergyRing
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            hoverRef={hoverRef}
            implosionProgressRef={implosionProgressRef}
          />
          <SegmentedCrystallineArcs
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            hoverRef={hoverRef}
            implosionProgressRef={implosionProgressRef}
          />
          <AtmosphericHalo
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            hoverRef={hoverRef}
            implosionProgressRef={implosionProgressRef}
          />
          <HiddenMetamorphosisSeed
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            hoverRef={hoverRef}
            implosionProgressRef={implosionProgressRef}
            metamorphosisProgressRef={metamorphosisProgressRef}
          />

          {/* ── SURROUNDING CHAMBER SCULPTURE & HYPERSPACE TUNNEL ── */}
          <FloatingCrystallineChamber
            phaseRef={phaseRef}
            elapsedRef={elapsedRef}
            mouseRef={mouseRef}
            hoverRef={hoverRef}
            implosionProgressRef={implosionProgressRef}
          />
          <LightTunnelStreaks
            phaseRef={phaseRef}
            metamorphosisProgressRef={metamorphosisProgressRef}
          />

          <fog attach="fog" args={[0x000000, 8, 22]} />
        </Canvas>
      </div>

      {/* ── SECONDARY BRANDING: TOP BAR ── */}
      <header className="absolute top-0 left-0 right-0 z-20 w-full px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between pointer-events-none">
        {/* TEDx KLH 2026 */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-2 h-2 rounded-full bg-[#EB0028]"
            style={{
              boxShadow:
                "0 0 10px #EB0028, 0 0 20px rgba(235, 0, 40, 0.6)",
            }}
          />
          <div className="flex items-baseline tracking-tight">
            <span
              className="text-sm sm:text-base font-extrabold text-white tracking-wider"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              TED
            </span>
            <span
              className="text-xs sm:text-sm font-black text-[#EB0028] ml-0.5"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              x
            </span>
            <span
              className="text-xs sm:text-sm font-semibold text-white/80 ml-2 tracking-widest"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              KLH
            </span>
            <span
              className="text-[10px] sm:text-xs font-mono text-white/40 ml-2.5 tracking-widest"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              2026
            </span>
          </div>
        </div>

        {/* METAMORPHOSIS */}
        <div className="text-right">
          <div
            className="text-[10px] sm:text-xs font-mono tracking-[0.35em] text-[#EB0028]/90 uppercase font-semibold"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            METAMORPHOSIS
          </div>
          <div
            className="text-[8px] sm:text-[9px] font-mono tracking-[0.25em] text-white/30 uppercase mt-0.5"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            THE UNSEEN PROCESS OF BECOMING
          </div>
        </div>
      </header>

      {/* ── THE VISUAL CENTER: MATHEMATICALLY CENTERED LAUNCH BUTTON ── */}
      {/* 50% Horizontal, 50% Vertical Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto flex items-center justify-center">
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{
                opacity: 1,
                scale: isHovered ? 1.025 : [1, 1.012, 1],
              }}
              transition={
                isHovered
                  ? { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
                  : {
                      scale: {
                        repeat: Infinity,
                        duration: 5,
                        ease: "easeInOut",
                      },
                      opacity: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                    }
              }
              className="relative flex items-center justify-center"
            >
              {/* Button Ambient Crimson Glow */}
              <div
                className="absolute -inset-4 rounded-full pointer-events-none transition-opacity duration-700 blur-xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(235,0,40,0.3) 0%, transparent 70%)",
                  opacity: isHovered ? 0.9 : 0.4,
                }}
              />

              {/* The Launch Button */}
              <motion.button
                id="launch-portal-button"
                onClick={handleLaunchClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileTap={{ scale: 0.96 }}
                animate={
                  uiPhase === "LAUNCH_COMPRESS"
                    ? { scale: 0.96, filter: "brightness(1.5)" }
                    : {}
                }
                disabled={uiPhase !== "IDLE"}
                className="group relative min-w-[160px] sm:min-w-[190px] h-[48px] sm:h-[54px] px-8 sm:px-11 rounded-full overflow-hidden flex items-center justify-center transition-all duration-500 cursor-pointer"
                style={{
                  // Dark translucent glass
                  backgroundColor: "rgba(9, 9, 11, 0.88)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  // Silver hairline border transitioning to bright silver on hover
                  border: isHovered
                    ? "1px solid rgba(244, 244, 244, 0.75)"
                    : "1px solid rgba(217, 217, 217, 0.22)",
                  boxShadow: isHovered
                    ? "0 0 35px rgba(235, 0, 40, 0.45), inset 0 0 15px rgba(235, 0, 40, 0.25)"
                    : "0 0 20px rgba(0, 0, 0, 0.8), inset 0 0 12px rgba(235, 0, 40, 0.08)",
                }}
              >
                {/* Slow surface reflection sweep across glass */}
                <motion.div
                  animate={{
                    x: ["-150%", "200%"],
                  }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatDelay: 1.5,
                  }}
                  className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
                />

                {/* Subtle Inner Crimson Core Glow */}
                <div
                  className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(235,0,40,0.22) 0%, transparent 75%)",
                    opacity: isHovered ? 1 : 0.6,
                  }}
                />

                {/* Button Content */}
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {/* Glowing Jewel Indicator */}
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[#EB0028] transition-transform duration-300 group-hover:scale-125"
                    style={{
                      boxShadow:
                        "0 0 8px #EB0028, 0 0 16px rgba(235, 0, 40, 0.6)",
                    }}
                  />

                  {/* LAUNCH Text */}
                  <span
                    className="text-xs sm:text-sm font-bold tracking-[0.38em] uppercase text-[#F4F4F4] group-hover:text-white transition-colors duration-300 pl-1"
                    style={{
                      fontFamily: "var(--font-sora)",
                      fontWeight: 700,
                      letterSpacing: "0.38em",
                    }}
                  >
                    {uiPhase === "LAUNCH_COMPRESS" ||
                    uiPhase === "LAUNCH_STILLNESS" ||
                    uiPhase === "PORTAL_IMPLOSION" ||
                    uiPhase === "BUTTERFLY_REVEAL" ||
                    uiPhase === "METAMORPHOSIS"
                      ? "TRANSCENDING"
                      : "LAUNCH"}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── SECONDARY BRANDING: BOTTOM BAR ── */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 w-full px-6 sm:px-12 pb-6 sm:pt-0 sm:pb-8 flex items-center justify-between pointer-events-none text-white/30 text-[9px] sm:text-[10px] font-mono tracking-widest uppercase">
        <span style={{ fontFamily: "var(--font-dm-mono)" }}>
          17.5623° N · 78.3846° E
        </span>
        <span
          className="text-[#EB0028]/60"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          THE CRIMSON PORTAL
        </span>
      </footer>

      {/* ── FINAL METAMORPHOSIS TRANSITION FLASH ── */}
      <CinematicFlashOverlay flashOpacity={flashOpacity} />
    </div>
  );
}
