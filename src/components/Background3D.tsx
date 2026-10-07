"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 2200;

// ─────────────────────────────────────────────────────────────
// 1. CONTINUOUS LIVING BUTTERFLY SHADER (3D Wing Flex & Crystal Shimmer)
// ─────────────────────────────────────────────────────────────
const ButterflyShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uDissolve; // 0.0 = solid, 1.0 = fully dissolved
    varying vec2 vUv;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vec3 pos = position;

      // ── CONTINUOUS ORGANIC WING DEFORMATION ──
      // Distance from central spine (u = 0.5)
      float distFromSpine = abs(uv.x - 0.5) * 2.0; // 0.0 at center, 1.0 at outer wingtip
      float wingSpan = smoothstep(0.04, 0.96, distFromSpine);

      // Non-linear flex curve (small flex near root, medium at mid-wing, largest at tip)
      float flexCurve = pow(wingSpan, 1.75);

      // Slow, elegant 3.2s wing cycle with procedural organic harmonics
      float t = uTime;
      float cycle1 = sin(t * 1.96);
      float cycle2 = sin(t * 2.94 + 0.8) * 0.14;
      float cycle3 = cos(t * 0.98) * 0.10;
      float baseFlap = cycle1 + cycle2 + cycle3;

      // Asymmetrical wing movement (1-3% organic desync between left & right wings)
      bool isLeft = uv.x < 0.5;
      float flap = isLeft 
        ? baseFlap 
        : (sin((t * 0.985 + 0.06) * 1.96) + sin(t * 2.94 + 0.85) * 0.14 + cos(t * 0.98) * 0.10);

      // Aerodynamic camber & chordwise phase lag (trailing edge / apex lag)
      float chordLag = (uv.y - 0.5) * 0.35;
      float dynamicFlap = flap * cos(chordLag) + sin(t * 1.96 - 0.3) * sin(chordLag) * 0.3;

      // Continuous 3D Wing Flex Displacements (Active even at scroll = 0)
      float activeDamp = 1.0 - smoothstep(0.7, 1.0, uDissolve);
      float zDisplace = dynamicFlap * flexCurve * 0.72 * activeDamp;
      float yDisplace = -abs(dynamicFlap) * flexCurve * 0.08 * activeDamp;
      float xDisplace = -sign(uv.x - 0.5) * (1.0 - cos(dynamicFlap * 0.45)) * flexCurve * 0.26 * activeDamp;

      pos.z += zDisplace;
      pos.y += yDisplace;
      pos.x += xDisplace;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform sampler2D uTexture;
    uniform float uDissolve;
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vViewPosition;

    // Fast 2D Voronoi / crystalline shard hash
    float hash21(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Transparent on pure black backdrop
      if (texColor.r < 0.025 && texColor.g < 0.025 && texColor.b < 0.025) {
        discard;
      }

      // Center of butterfly is at UV (0.5, 0.5)
      vec2 center = vec2(0.5, 0.5);
      float distFromCenter = length((vUv - center) * vec2(1.15, 1.0));
      
      // Polygonal shard noise
      vec2 grid = floor(vUv * 52.0);
      float shardNoise = hash21(grid) * 0.16;
      float edgeScore = distFromCenter + shardNoise;

      // Dissolution threshold
      float threshold = 0.60 - uDissolve * 0.68;
      
      if (edgeScore > threshold && uDissolve > 0.02) {
        discard;
      }

      // Edge crystal glow when breaking apart
      float edgeGlow = smoothstep(threshold - 0.04, threshold, edgeScore);
      vec3 glowCol = vUv.x < 0.5 ? vec3(0.95, 0.98, 1.0) : vec3(1.0, 0.15, 0.25);
      vec3 finalCol = mix(texColor.rgb, glowCol * 1.8, edgeGlow * smoothstep(0.02, 0.35, uDissolve) * 0.75);

      // ── VERY SUBTLE CRYSTAL SPECULAR SHIMMER (no visible beams or streaks) ──
      if (uDissolve < 0.5) {
        bool isRightRed = vUv.x >= 0.5;
        if (isRightRed) {
          // Barely visible ruby facet shimmer — only on existing bright crystal pixels
          float crystalWave = sin(vUv.x * 48.0 + vUv.y * 32.0 + uTime * 0.8) * 0.5 + 0.5;
          float crystalHighlight = pow(crystalWave, 16.0) * 0.08 * (1.0 - uDissolve) * texColor.r;
          finalCol += vec3(0.6, 0.1, 0.12) * crystalHighlight;
        } else {
          // Barely visible silver wireframe shimmer — only on existing bright wireframe pixels
          float wireWave = cos(vUv.x * 52.0 - vUv.y * 38.0 + uTime * 0.7) * 0.5 + 0.5;
          float wireHighlight = pow(wireWave, 18.0) * 0.06 * (1.0 - uDissolve) * texColor.g;
          finalCol += vec3(0.4, 0.42, 0.45) * wireHighlight;
        }
      }

      // Smooth fade out of remaining center core past 80% dissolution
      float alpha = texColor.a * (1.0 - smoothstep(0.75, 1.0, uDissolve));

      gl_FragColor = vec4(finalCol, alpha);
    }
  `,
};

// ─────────────────────────────────────────────────────────────
// 2. BUTTERFLY WING PARTICLES & COSMOS AMBIENT PARTICLES
// ─────────────────────────────────────────────────────────────
interface ParticleSystemsData {
  bPositions: Float32Array;
  bColors: Float32Array;
  featherDist: Float32Array;
  driftVectors: Float32Array;
  ambientPositions: Float32Array;
  ambientColors: Float32Array;
  ambientSpeeds: Float32Array;
}

function buildParticleSystemsData(count: number): ParticleSystemsData {
  const bPositions = new Float32Array(count * 3);
  const bColors = new Float32Array(count * 3);
  const featherDist = new Float32Array(count);
  const driftVectors = new Float32Array(count * 3);

  const ambientPositions = new Float32Array(count * 3);
  const ambientColors = new Float32Array(count * 3);
  const ambientSpeeds = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const isLeft = i % 2 === 0;
    const side = isLeft ? -1 : 1;

    const isUpper = Math.random() < 0.65;
    const u = Math.random();
    const v = Math.random();

    let wx = 0;
    let wy = 0;
    let wz = (Math.random() - 0.5) * 0.25;

    if (isUpper) {
      // Upper Wing
      const angle = 0.14 + u * 1.35;
      const radius = Math.pow(v, 0.45) * (2.85 + Math.sin(u * Math.PI * 3) * 0.4 + (1 - u) * 1.6);
      wx = Math.cos(angle) * radius;
      wy = Math.sin(angle) * radius + 0.45;
    } else {
      // Lower Wing
      const angle = -0.14 - u * 1.15;
      const radius = Math.pow(v, 0.5) * (2.05 + Math.cos(u * Math.PI * 2) * 0.35 + (1 - u) * 0.8);
      wx = Math.cos(angle) * radius;
      wy = Math.sin(angle) * radius - 0.05;
    }

    bPositions[i3] = side * wx;
    bPositions[i3 + 1] = wy;
    bPositions[i3 + 2] = wz;

    // Distance from wing root (1 = outer tip, 0 = core)
    const dRoot = Math.sqrt(wx * wx + (wy - 0.2) * (wy - 0.2)) / 4.4;
    featherDist[i] = Math.min(1.0, Math.max(0.05, dRoot + (Math.random() - 0.5) * 0.08));

    if (isLeft) {
      const b = 0.85 + Math.random() * 0.15;
      bColors[i3] = 0.95 * b; bColors[i3 + 1] = 0.98 * b; bColors[i3 + 2] = 1.0 * b;
    } else {
      const isBright = Math.random() < 0.35;
      bColors[i3] = isBright ? 1.0 : 0.92;
      bColors[i3 + 1] = isBright ? 0.22 : 0.02;
      bColors[i3 + 2] = isBright ? 0.32 : 0.16;
    }

    // Outward expanding shard drift trajectory
    const dAngle = Math.atan2(wy - 0.2, side * wx) + (Math.random() - 0.5) * 0.6;
    const dMag = 2.4 + featherDist[i] * 4.8;
    driftVectors[i3] = Math.cos(dAngle) * dMag + (Math.random() - 0.5) * 1.8;
    driftVectors[i3 + 1] = Math.sin(dAngle) * dMag + (Math.random() - 0.5) * 1.5;
    driftVectors[i3 + 2] = (Math.random() - 0.5) * 2.8;

    // Deep ambient cosmos coordinates
    ambientPositions[i3] = (Math.random() - 0.5) * 24.0;
    ambientPositions[i3 + 1] = (Math.random() - 0.5) * 18.0;
    ambientPositions[i3 + 2] = (Math.random() - 0.5) * 10.0 - 1.5;

    const isRedEmber = Math.random() < 0.35;
    if (isRedEmber) {
      ambientColors[i3] = 0.95;
      ambientColors[i3 + 1] = 0.08;
      ambientColors[i3 + 2] = 0.22;
    } else {
      const lum = 0.5 + Math.random() * 0.5;
      ambientColors[i3] = 0.85 * lum;
      ambientColors[i3 + 1] = 0.90 * lum;
      ambientColors[i3 + 2] = 1.0 * lum;
    }
    ambientSpeeds[i] = 0.3 + Math.random() * 0.7;
  }

  return { bPositions, bColors, featherDist, driftVectors, ambientPositions, ambientColors, ambientSpeeds };
}

// ─────────────────────────────────────────────────────────────
// 3. CLEAN, CRISP RED & WHITE BACKSIDE TYPOGRAPHY PLANE
// ─────────────────────────────────────────────────────────────
function drawTypography(canvas: HTMLCanvasElement) {
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = 480;

  // Render "METAMORPHOSIS": META (White) + MORPHOSIS (Red) with Bebas Neue
  ctx.font = "400 260px 'Bebas Neue', 'Impact', sans-serif";
  ctx.textBaseline = "middle";
  ctx.letterSpacing = "6px";

  const fullText = "METAMORPHOSIS";
  const fullWidth = ctx.measureText(fullText).width;
  const startX = cx - fullWidth / 2;

  const leftPart = "META";
  const leftWidth = ctx.measureText(leftPart).width;

  // 1. Draw "META" (White / Silver with clean glow)
  ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
  ctx.shadowBlur = 28;
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.fillText(leftPart, startX, cy);

  // 2. Draw "MORPHOSIS" (Ruby Red with vibrant glow)
  ctx.shadowColor = "rgba(235, 0, 40, 0.95)";
  ctx.shadowBlur = 40;
  ctx.fillStyle = "#EB0028";
  ctx.fillText("MORPHOSIS", startX + leftWidth, cy);

  // Reset shadow
  ctx.shadowBlur = 0;

  // 3. Subtitle: "THE UNSEEN PROCESS OF BECOMING."
  ctx.font = "600 36px 'Manrope', 'Helvetica Neue', sans-serif";
  ctx.letterSpacing = "8px";
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.fillText("THE UNSEEN PROCESS OF BECOMING.", cx, cy + 185);

  // 4. Red horizontal accent line
  ctx.shadowColor = "rgba(235, 0, 40, 0.95)";
  ctx.shadowBlur = 20;
  ctx.fillStyle = "#EB0028";
  ctx.fillRect(cx - 140, cy + 240, 280, 5);
}

function createTypographyTexture(): { texture: THREE.CanvasTexture; canvas: HTMLCanvasElement } {
  const canvas = document.createElement("canvas");
  drawTypography(canvas);
  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return { texture: tex, canvas };
}

// ─────────────────────────────────────────────────────────────
// 4. MAIN CINEMATIC WEBGL SCENE
// ─────────────────────────────────────────────────────────────
interface SceneProps {
  scrollYRef: React.MutableRefObject<number>;
}

function CinematicMetamorphosisScene({ scrollYRef }: SceneProps) {
  const quadRef = useRef<THREE.Mesh>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);
  const textMeshRef = useRef<THREE.Mesh>(null);
  const textMatRef = useRef<THREE.MeshBasicMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pMatRef = useRef<THREE.PointsMaterial>(null);
  const { camera, viewport } = useThree();

  // Load butterfly artwork texture
  const butterflyTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/butterfly-art.jpg");
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  // Crisp Red & White typography texture with dynamic canvas ref
  const { typographyTexture, typographyCanvas } = useMemo(() => {
    if (typeof document === "undefined") {
      return { typographyTexture: new THREE.Texture(), typographyCanvas: null };
    }
    const { texture, canvas } = createTypographyTexture();
    return { typographyTexture: texture, typographyCanvas: canvas };
  }, []);

  // Re-draw typography once custom web fonts are fully loaded to prevent fallback-font layout shifts
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts && typographyCanvas) {
      document.fonts.ready.then(() => {
        drawTypography(typographyCanvas);
        typographyTexture.needsUpdate = true;
      });
    }
  }, [typographyCanvas, typographyTexture]);

  // Clean up GPU textures on unmount (e.g. during page routing)
  useEffect(() => {
    return () => {
      butterflyTexture.dispose();
      typographyTexture.dispose();
    };
  }, [butterflyTexture, typographyTexture]);

  const pData = useMemo(() => buildParticleSystemsData(PARTICLE_COUNT), []);

  const curPositions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);
  const curColors = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame((state) => {
    const scrollY = typeof window !== "undefined" 
      ? (window.scrollY || document.documentElement.scrollTop || scrollYRef.current || 0)
      : scrollYRef.current;
    scrollYRef.current = scrollY;

    const time = state.clock.getElapsedTime();
    const vpW = viewport.width;
    const vpH = viewport.height;
    const vh = typeof window !== "undefined" ? Math.max(window.innerHeight, 500) : 800;

    const isMobile = vpW < 7.6 || (typeof window !== "undefined" && window.innerWidth < 768);

    // Responsive scaling with strict upper and lower safety bounds:
    // Guarantees transformed typography and butterfly never exceed viewport bounds on any device (320px–3840px)
    const maxTextWidth = vpW * (isMobile ? 0.90 : 0.84);
    const textScale = Math.min(1.0, maxTextWidth / 11.6);

    const maxButterflyWidth = vpW * (isMobile ? 0.88 : 0.82);
    const butterflyScale = Math.min(1.0, maxButterflyWidth / 8.6);

    // Dynamic scroll timeline normalized to viewport height:
    const dissolveProgress = THREE.MathUtils.clamp(scrollY / (vh * 0.35), 0, 1);

    // Metamorphosis text visibility window:
    const fadeStart = vh * 0.12;
    const peakStart = vh * 0.35;
    const fadeOutStart = vh * 0.52;
    const fadeOutEnd = vh * 0.72;

    let textOpacity = 0;
    if (scrollY >= fadeStart && scrollY <= fadeOutEnd) {
      const fadeIn = THREE.MathUtils.smoothstep(scrollY, fadeStart, peakStart);
      const fadeOut = 1.0 - THREE.MathUtils.smoothstep(scrollY, fadeOutStart, fadeOutEnd);
      textOpacity = fadeIn * fadeOut;
    }

    // 1:1 Parallax upward scroll translation
    const scrollYOffset = (scrollY / vh) * (vpH * 0.95);

    // ── 1. CONTINUOUS LIVING BUTTERFLY WING FLAP & SHATTER SHADER ──
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uDissolve.value = dissolveProgress;
      shaderMatRef.current.uniforms.uTime.value = time;
    }

    // ── 2. ANCHORED BUTTERFLY — NEAR-ZERO BODY MOVEMENT ──
    // The butterfly stays spatially anchored. Motion comes from vertex shader wing flex only.
    // Micro-body movement is imperceptibly tiny (1-2% of butterfly height max).
    const bodyBobY = Math.sin(time * 1.8) * 0.006 * butterflyScale;

    // Near-zero rotations (sub-1-degree, purely subconscious depth cue)
    const rotPitchX = Math.sin(time * 1.3) * 0.008;  // ~0.5 deg
    const rotYawY = Math.cos(time * 0.55) * 0.012;   // ~0.7 deg
    const rotRollZ = Math.sin(time * 0.7) * 0.006;   // ~0.3 deg

    if (quadRef.current) {
      quadRef.current.scale.set(butterflyScale, butterflyScale, butterflyScale);
      
      // Butterfly is spatially anchored — no X/Z drift, only imperceptible Y bob + scroll parallax
      quadRef.current.position.x = 0;
      quadRef.current.position.y = (0.15 * butterflyScale + bodyBobY) + scrollYOffset * 0.6;
      quadRef.current.position.z = 0;

      // Imperceptible micro-rotations for subtle 3D depth cue
      quadRef.current.rotation.x = rotPitchX;
      quadRef.current.rotation.y = rotYawY;
      quadRef.current.rotation.z = rotRollZ;

      quadRef.current.visible = dissolveProgress < 0.99 && scrollY < vh * 0.55;
    }

    // ── 3. CRISP RED & WHITE BACKSIDE METAMORPHOSIS TYPOGRAPHY ──
    if (textMatRef.current && textMeshRef.current) {
      if (scrollY > fadeOutEnd || textOpacity <= 0.001) {
        textMeshRef.current.visible = false;
        textMatRef.current.opacity = 0;
      } else {
        textMeshRef.current.visible = true;
        textMatRef.current.opacity = textOpacity;
        textMeshRef.current.scale.set(textScale, textScale, textScale);
        textMeshRef.current.position.y = -0.02 * textScale + scrollYOffset * 0.6;
      }
    }

    // ── 4. STATIC CAMERA (no Ken Burns / no drift / no moving-picture effect) ──
    const aspect = state.viewport.aspect;
    const isMobilePortrait = aspect < 1.0;
    const baseZ = isMobilePortrait ? 8.8 : 7.2;

    camera.position.z = baseZ - Math.min(scrollY / (vh * 0.8), 1.0) * 0.3;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // ── 5. GPU PARTICLES: LIVE FLOATING STARDUST & WING SHARDS ──
    if (!pointsRef.current || !pMatRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const colAttr = pointsRef.current.geometry.attributes.color as THREE.BufferAttribute;

    const isDeepSection = scrollY > vh * 0.72;
    if (isDeepSection) {
      pMatRef.current.opacity = 0.28;
      pMatRef.current.size = 0.020;
    } else {
      const tFade = THREE.MathUtils.clamp((scrollY - vh * 0.4) / (vh * 0.32), 0, 1);
      pMatRef.current.opacity = THREE.MathUtils.lerp(0.75, 0.28, tFade);
      pMatRef.current.size = THREE.MathUtils.lerp(0.032, 0.020, tFade);
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const fDist = pData.featherDist[i];

      const bx = pData.bPositions[i3] * butterflyScale;
      const by = (pData.bPositions[i3 + 1] + 0.25) * butterflyScale;
      const bz = pData.bPositions[i3 + 2];

      const dx = pData.driftVectors[i3] * butterflyScale;
      const dy = pData.driftVectors[i3 + 1] * butterflyScale;
      const dz = pData.driftVectors[i3 + 2];

      const ax = pData.ambientPositions[i3];
      const ay = pData.ambientPositions[i3 + 1];
      const az = pData.ambientPositions[i3 + 2];
      const speed = pData.ambientSpeeds[i];

      const dissolveStart = 0.05 + (1.0 - fDist) * 0.40;

      let px = bx;
      let py = by;
      let pz = bz;

      let r = pData.bColors[i3];
      let g = pData.bColors[i3 + 1];
      let b = pData.bColors[i3 + 2];

      if (isDeepSection) {
        // Pure ambient floating stardust in other sections
        px = ax + Math.sin(time * speed * 0.25 + i * 0.4) * 0.6;
        py = ay + Math.cos(time * speed * 0.20 + i * 0.3) * 0.6;
        pz = az;

        r = pData.ambientColors[i3];
        g = pData.ambientColors[i3 + 1];
        b = pData.ambientColors[i3 + 2];
      } else {
        if (dissolveProgress <= dissolveStart) {
          // HIDDEN — particles are invisible in idle hero state (clean black background)
          px = bx;
          py = by + scrollYOffset * 0.6;
          pz = -9999;
        } else if (dissolveProgress <= 0.85) {
          // Shatter outward as scroll progresses
          const tDis = (dissolveProgress - dissolveStart) / (0.85 - dissolveStart);
          const easeDis = tDis * tDis * (3 - 2 * tDis);

          px = bx + dx * easeDis;
          py = by + dy * easeDis + scrollYOffset * 0.4;
          pz = bz + dz * easeDis;
        } else {
          // Transition into ambient cosmos
          const tFlow = (scrollY - vh * 0.3) / (vh * 0.42);
          const easeFlow = THREE.MathUtils.clamp(tFlow * tFlow, 0, 1);

          const cloudX = bx + dx + Math.sin(time * speed + i) * 0.3;
          const cloudY = by + dy + Math.cos(time * speed + i) * 0.3 + scrollYOffset * 0.4;
          const cloudZ = bz + dz;

          const targetX = ax + Math.sin(time * speed * 0.3 + i) * 0.5;
          const targetY = ay + Math.cos(time * speed * 0.25 + i) * 0.5;
          const targetZ = az;

          px = THREE.MathUtils.lerp(cloudX, targetX, easeFlow);
          py = THREE.MathUtils.lerp(cloudY, targetY, easeFlow);
          pz = THREE.MathUtils.lerp(cloudZ, targetZ, easeFlow);

          r = THREE.MathUtils.lerp(pData.bColors[i3], pData.ambientColors[i3], easeFlow);
          g = THREE.MathUtils.lerp(pData.bColors[i3 + 1], pData.ambientColors[i3 + 1], easeFlow);
          b = THREE.MathUtils.lerp(pData.bColors[i3 + 2], pData.ambientColors[i3 + 2], easeFlow);
        }
      }

      posAttr.setXYZ(i, px, py, pz);
      colAttr.setXYZ(i, r, g, b);
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  return (
    <>
      {/* ── 1. LIVING BUTTERFLY ARTWORK SHADER QUAD ── */}
      <mesh ref={quadRef} position={[0, 0.15, 0]}>
        {/* Optimized grid (64x64) for continuous fluid wing flex deformation at 60/120fps */}
        <planeGeometry args={[8.6, 4.8, 64, 64]} />
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={ButterflyShader.vertexShader}
          fragmentShader={ButterflyShader.fragmentShader}
          uniforms={{
            uTexture: { value: butterflyTexture },
            uDissolve: { value: 0.0 },
            uTime: { value: 0.0 },
          }}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* ── 2. GPU PARTICLES: SHARDS & STARDUST ── */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[curPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[curColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pMatRef}
          transparent
          vertexColors
          size={0.032}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.75}
        />
      </points>

      {/* ── 3. CLEAN, CRISP RED & WHITE BACKSIDE METAMORPHOSIS TYPOGRAPHY ── */}
      <mesh ref={textMeshRef} position={[0, -0.02, 0.05]}>
        <planeGeometry args={[11.6, 5.8]} />
        <meshBasicMaterial
          ref={textMatRef}
          map={typographyTexture}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. MAIN FIXED CANVAS EXPORT
// ─────────────────────────────────────────────────────────────
export default function Background3D() {
  const [mounted, setMounted] = useState(false);
  const scrollYRef = useRef(0);

  useEffect(() => {
    setMounted(true);
    const updateScroll = () => {
      scrollYRef.current = window.scrollY || document.documentElement.scrollTop || 0;
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });
    window.addEventListener("orientationchange", updateScroll, { passive: true });
    updateScroll();

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("orientationchange", updateScroll);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100dvh",
        maxHeight: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: -20,
        backgroundColor: "#000000",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 46 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", background: "#000000" }}
      >
        <color attach="background" args={["#000000"]} />
        <CinematicMetamorphosisScene scrollYRef={scrollYRef} />
      </Canvas>
    </div>
  );
}
