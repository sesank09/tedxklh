"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 2200;

// Typography plane + canvas constants
const TEXT_PLANE_W = 10.0;
const TEXT_PLANE_H = 4.0;
const TEXT_CANVAS_W = 2560;
const TEXT_CANVAS_H = 1024;
// Max width (px on the 2560 canvas) the title / subtitle may occupy.
const TEXT_MAX_PX = 1850;

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
      float distFromSpine = abs(uv.x - 0.5) * 2.0;
      float wingSpan = smoothstep(0.04, 0.96, distFromSpine);

      float flexCurve = pow(wingSpan, 1.75);

      float t = uTime;
      float cycle1 = sin(t * 1.96);
      float cycle2 = sin(t * 2.94 + 0.8) * 0.14;
      float cycle3 = cos(t * 0.98) * 0.10;
      float baseFlap = cycle1 + cycle2 + cycle3;

      bool isLeft = uv.x < 0.5;
      float flap = isLeft 
        ? baseFlap 
        : (sin((t * 0.985 + 0.06) * 1.96) + sin(t * 2.94 + 0.85) * 0.14 + cos(t * 0.98) * 0.10);

      float chordLag = (uv.y - 0.5) * 0.35;
      float dynamicFlap = flap * cos(chordLag) + sin(t * 1.96 - 0.3) * sin(chordLag) * 0.3;

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

    float hash21(vec2 p) {
      p = fract(p * vec2(234.34, 435.345));
      p += dot(p, p + 34.23);
      return fract(p.x * p.y);
    }

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);
      
      if (texColor.r < 0.025 && texColor.g < 0.025 && texColor.b < 0.025) {
        discard;
      }

      vec2 center = vec2(0.5, 0.5);
      float distFromCenter = length((vUv - center) * vec2(1.15, 1.0));
      
      vec2 grid = floor(vUv * 52.0);
      float shardNoise = hash21(grid) * 0.16;
      float edgeScore = distFromCenter + shardNoise;

      float threshold = 0.60 - uDissolve * 0.68;
      
      if (edgeScore > threshold && uDissolve > 0.02) {
        discard;
      }

      float edgeGlow = smoothstep(threshold - 0.04, threshold, edgeScore);
      vec3 glowCol = vUv.x < 0.5 ? vec3(0.95, 0.98, 1.0) : vec3(1.0, 0.15, 0.25);
      vec3 finalCol = mix(texColor.rgb, glowCol * 1.8, edgeGlow * smoothstep(0.02, 0.35, uDissolve) * 0.75);

      if (uDissolve < 0.5) {
        bool isRightRed = vUv.x >= 0.5;
        if (isRightRed) {
          float crystalWave = sin(vUv.x * 48.0 + vUv.y * 32.0 + uTime * 0.8) * 0.5 + 0.5;
          float crystalHighlight = pow(crystalWave, 16.0) * 0.08 * (1.0 - uDissolve) * texColor.r;
          finalCol += vec3(0.6, 0.1, 0.12) * crystalHighlight;
        } else {
          float wireWave = cos(vUv.x * 52.0 - vUv.y * 38.0 + uTime * 0.7) * 0.5 + 0.5;
          float wireHighlight = pow(wireWave, 18.0) * 0.06 * (1.0 - uDissolve) * texColor.g;
          finalCol += vec3(0.4, 0.42, 0.45) * wireHighlight;
        }
      }

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
    const wz = (Math.random() - 0.5) * 0.25;

    if (isUpper) {
      const angle = 0.14 + u * 1.35;
      const radius = Math.pow(v, 0.45) * (2.85 + Math.sin(u * Math.PI * 3) * 0.4 + (1 - u) * 1.6);
      wx = Math.cos(angle) * radius;
      wy = Math.sin(angle) * radius + 0.45;
    } else {
      const angle = -0.14 - u * 1.15;
      const radius = Math.pow(v, 0.5) * (2.05 + Math.cos(u * Math.PI * 2) * 0.35 + (1 - u) * 0.8);
      wx = Math.cos(angle) * radius;
      wy = Math.sin(angle) * radius - 0.05;
    }

    bPositions[i3] = side * wx;
    bPositions[i3 + 1] = wy;
    bPositions[i3 + 2] = wz;

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

    const dAngle = Math.atan2(wy - 0.2, side * wx) + (Math.random() - 0.5) * 0.6;
    const dMag = 2.4 + featherDist[i] * 4.8;
    driftVectors[i3] = Math.cos(dAngle) * dMag + (Math.random() - 0.5) * 1.8;
    driftVectors[i3 + 1] = Math.sin(dAngle) * dMag + (Math.random() - 0.5) * 1.5;
    driftVectors[i3 + 2] = (Math.random() - 0.5) * 2.8;

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
interface TypographyBounds {
  width: number;
  height: number;
}

/**
 * Draws the title + subtitle onto the canvas at maximum 2.5K resolution.
 * Auto-fits font sizing to utilize ~2200px of the 2560px canvas for crystal-clear
 * vector-like sharpness. Returns the exact measured world-space width & height
 * on the 10x4 3D plane so Three.js can scale it flawlessly to any screen.
 */
function drawTypography(canvas: HTMLCanvasElement): TypographyBounds {
  canvas.width = TEXT_CANVAS_W;
  canvas.height = TEXT_CANVAS_H;
  const ctx = canvas.getContext("2d");
  const fallbackBounds: TypographyBounds = {
    width: (TEXT_MAX_PX / TEXT_CANVAS_W) * TEXT_PLANE_W,
    height: 1.5,
  };
  if (!ctx) return fallbackBounds;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = canvas.width / 2;
  const cy = 440;

  const setLetterSpacing = (v: string) => {
    try {
      (ctx as any).letterSpacing = v;
    } catch (e) {}
  };

  const leftPart = "META";
  const rightPart = "MORPHOSIS";
  const TARGET_CANVAS_WIDTH = 2200;

  // ── 1. Main Title: "METAMORPHOSIS" ──
  let fontSize = 350;
  const fontFam = `'Bebas Neue', 'Impact', 'Arial Black', sans-serif`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.font = `400 ${fontSize}px ${fontFam}`;
  setLetterSpacing("6px");

  let leftWidth = ctx.measureText(leftPart).width;
  let rightWidth = ctx.measureText(rightPart).width;
  let fullWidth = leftWidth + rightWidth;

  if (fullWidth > TARGET_CANVAS_WIDTH) {
    fontSize = Math.floor(fontSize * (TARGET_CANVAS_WIDTH / fullWidth));
    ctx.font = `400 ${fontSize}px ${fontFam}`;
    setLetterSpacing(`${Math.max(2, Math.round(6 * (fontSize / 350)))}px`);
    leftWidth = ctx.measureText(leftPart).width;
    rightWidth = ctx.measureText(rightPart).width;
    fullWidth = leftWidth + rightWidth;
  }

  const startX = cx - fullWidth / 2;

  // "META" (luminous clean white)
  ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
  ctx.shadowBlur = 36;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(leftPart, startX, cy);

  // "MORPHOSIS" (official TEDx ruby red with radiant crimson glow)
  ctx.shadowColor = "rgba(235, 0, 40, 0.98)";
  ctx.shadowBlur = 56;
  ctx.fillStyle = "#EB0028";
  ctx.fillText(rightPart, startX + leftWidth, cy);

  ctx.shadowBlur = 0;

  // ── 2. Subtitle: "THE UNSEEN PROCESS OF BECOMING" ──
  let subSize = Math.max(34, Math.round(fontSize * 0.118));
  const subFontFam = `'Manrope', 'Helvetica Neue', sans-serif`;
  const subText = "THE UNSEEN PROCESS OF BECOMING";
  ctx.font = `700 ${subSize}px ${subFontFam}`;
  setLetterSpacing("8px");
  ctx.textAlign = "center";
  let subWidth = ctx.measureText(subText).width;
  const maxSubWidth = Math.max(fullWidth * 0.94, 800);
  if (subWidth > maxSubWidth) {
    subSize = Math.floor(subSize * (maxSubWidth / subWidth));
    ctx.font = `700 ${subSize}px ${subFontFam}`;
    setLetterSpacing(`${Math.max(3, Math.round(8 * (subSize / 40)))}px`);
    subWidth = ctx.measureText(subText).width;
  }

  const subY = cy + fontSize * 0.52;
  ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
  ctx.shadowBlur = 12;
  ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
  ctx.fillText(subText, cx, subY);
  ctx.shadowBlur = 0;

  // ── 3. Red horizontal accent line ──
  const barW = Math.min(360, Math.round(fullWidth * 0.22));
  const barY = cy + fontSize * 0.72;
  ctx.shadowColor = "rgba(235, 0, 40, 0.95)";
  ctx.shadowBlur = 24;
  ctx.fillStyle = "#EB0028";
  ctx.fillRect(cx - barW / 2, barY, barW, 4);
  ctx.shadowBlur = 0;

  // Calculate exact measured content bounds in world units
  const widestPx = Math.max(fullWidth, subWidth, barW);
  const totalHeightPx = (barY + 6) - (cy - fontSize * 0.46);
  const worldWidth = (widestPx / TEXT_CANVAS_W) * TEXT_PLANE_W;
  const worldHeight = (totalHeightPx / TEXT_CANVAS_H) * TEXT_PLANE_H;

  return { width: worldWidth, height: worldHeight };
}

function createTypographyTexture(): {
  texture: THREE.CanvasTexture;
  canvas: HTMLCanvasElement;
  bounds: TypographyBounds;
} {
  const canvas = document.createElement("canvas");
  const bounds = drawTypography(canvas);
  const tex = new THREE.CanvasTexture(canvas);
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  return { texture: tex, canvas, bounds };
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
  // Real measured bounds of the typography (world units on the plane)
  const textBoundsRef = useRef<TypographyBounds>({
    width: (TEXT_MAX_PX / TEXT_CANVAS_W) * TEXT_PLANE_W,
    height: 1.5,
  });
  const { camera } = useThree();

  // Load butterfly artwork texture
  const butterflyTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/butterfly-art.jpg");
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, []);

  // Typography texture with canvas ref
  const { typographyTexture, typographyCanvas, initialBounds } = useMemo(() => {
    if (typeof document === "undefined") {
      return {
        typographyTexture: new THREE.Texture(),
        typographyCanvas: null as HTMLCanvasElement | null,
        initialBounds: {
          width: (TEXT_MAX_PX / TEXT_CANVAS_W) * TEXT_PLANE_W,
          height: 1.5,
        },
      };
    }
    const { texture, canvas, bounds } = createTypographyTexture();
    return { typographyTexture: texture, typographyCanvas: canvas, initialBounds: bounds };
  }, []);

  useEffect(() => {
    textBoundsRef.current = initialBounds;
  }, [initialBounds]);

  // Re-draw typography once web fonts are loaded (and on resize / rotate)
  useEffect(() => {
    if (typeof document === "undefined" || !typographyCanvas) return;

    const redraw = () => {
      textBoundsRef.current = drawTypography(typographyCanvas);
      typographyTexture.needsUpdate = true;
    };

    redraw();

    if (document.fonts) {
      document.fonts.ready.then(redraw);
      document.fonts.load("400 350px 'Bebas Neue'").then(redraw).catch(() => {});
      document.fonts.load("700 40px 'Manrope'").then(redraw).catch(() => {});
    }

    const t1 = setTimeout(redraw, 150);
    const t2 = setTimeout(redraw, 500);
    const t3 = setTimeout(redraw, 1200);
    const t4 = setTimeout(redraw, 2500);

    window.addEventListener("resize", redraw);
    window.addEventListener("orientationchange", redraw);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      window.removeEventListener("resize", redraw);
      window.removeEventListener("orientationchange", redraw);
    };
  }, [typographyCanvas, typographyTexture]);

  // Clean up GPU textures on unmount
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
    const scrollY =
      typeof window !== "undefined"
        ? window.scrollY || document.documentElement.scrollTop || scrollYRef.current || 0
        : scrollYRef.current;
    scrollYRef.current = scrollY;

    const time = state.clock.getElapsedTime();
    const vh = typeof window !== "undefined" ? Math.max(window.innerHeight, 500) : 800;

    const width = state.size.width;
    const height = state.size.height;
    const aspect = width / height;

    const isMobilePortrait = aspect < 0.92;
    const isSmallPhone = width < 480 || (aspect < 0.58 && width < 600);
    const isLandscapeShort = aspect >= 1.0 && height < 520;
    const isTablet = aspect >= 0.72 && aspect <= 1.35 && width >= 600 && width <= 1368;
    const isUltrawide = aspect >= 1.95;

    const baseZ = isSmallPhone
      ? 10.0
      : isMobilePortrait
        ? 9.2
        : isLandscapeShort
          ? 8.0
          : isTablet
            ? 8.5
            : 7.2;

    camera.position.z = baseZ - Math.min(scrollY / (vh * 0.8), 1.0) * 0.3;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.lookAt(0, 0, 0);

    // Exact visible viewport size in world units at z = 0
    const vFovRad = THREE.MathUtils.degToRad((camera as THREE.PerspectiveCamera).fov || 46);
    const visibleH = 2 * Math.tan(vFovRad / 2) * camera.position.z;
    const visibleW = visibleH * aspect;

    // ── 1. BUTTERFLY CONTAIN SCALING (Grand, screen-fitting presence on desktop) ──
    const targetButterflyWRatio = isSmallPhone
      ? 0.78
      : isMobilePortrait
        ? 0.82
        : isTablet
          ? 0.84
          : isLandscapeShort
            ? 0.68
            : isUltrawide
              ? 0.76
              : 0.88; // 88% width on computer/desktop for majestic screen fit

    const maxButterflyW = visibleW * targetButterflyWRatio;

    const maxButterflyH = visibleH * (
      isLandscapeShort
        ? 0.60
        : isMobilePortrait
          ? 0.38
          : isTablet
            ? 0.58
            : 0.72 // 72% height on computer/desktop
    );

    const scaleByW = maxButterflyW / 8.6;
    const scaleByH = maxButterflyH / 4.8;
    const butterflyScale = Math.min(scaleByW, scaleByH, 1.85);

    // Dynamic vertical anchor for butterfly (positioned in upper-center visual zone)
    const butterflyBaseY = isLandscapeShort
      ? 0.08 * visibleH
      : isMobilePortrait
        ? 0.13 * visibleH
        : 0.08 * visibleH;

    // ── 2. METAMORPHOSIS TYPOGRAPHY RESPONSIVE FITTING (Fits every screen size dynamically) ──
    // - On small mobile: 86% of visible screen width (7% clean margin on both sides, zero clipping)
    // - On mobile portrait: 84% of visible screen width
    // - On tablet: 78% of visible screen width
    // - On desktop / laptop (16:9): 72% of visible screen width (bold, majestic, grand centerpiece)
    // - On ultrawide (21:9 / cropped wide): 60% - 66% width, height-contained
    let textWidthFraction = 0.72;
    if (isSmallPhone) {
      textWidthFraction = 0.86;
    } else if (isMobilePortrait) {
      textWidthFraction = 0.84;
    } else if (isTablet) {
      textWidthFraction = 0.78;
    } else if (isLandscapeShort) {
      textWidthFraction = 0.70;
    } else if (isUltrawide) {
      textWidthFraction = THREE.MathUtils.clamp(0.72 - (aspect - 1.95) * 0.10, 0.58, 0.68);
    }

    const maxTextHeightFraction = isLandscapeShort
      ? 0.40
      : isMobilePortrait
        ? 0.26
        : 0.32;

    const targetTextWorldW = visibleW * textWidthFraction;
    const targetTextWorldH = visibleH * maxTextHeightFraction;

    const measuredW = Math.max(textBoundsRef.current.width, 1.0);
    const measuredH = Math.max(textBoundsRef.current.height, 0.5);

    const textScaleW = targetTextWorldW / measuredW;
    const textScaleH = targetTextWorldH / measuredH;

    // Dual-axis containment: guarantees it perfectly fits width AND height on every screen size
    const textScale = Math.min(textScaleW, textScaleH);

    const textBaseY = (isMobilePortrait ? 0.08 * visibleH : 0.02 * visibleH);

    const dissolveProgress = THREE.MathUtils.clamp(scrollY / (vh * 0.35), 0, 1);

    const fadeStart = vh * 0.10;
    const peakStart = vh * 0.30;
    const fadeOutStart = vh * 0.54;
    const fadeOutEnd = vh * 0.74;

    let textOpacity = 0;
    if (scrollY >= fadeStart && scrollY <= fadeOutEnd) {
      const fadeIn = THREE.MathUtils.smoothstep(scrollY, fadeStart, peakStart);
      const fadeOut = 1.0 - THREE.MathUtils.smoothstep(scrollY, fadeOutStart, fadeOutEnd);
      textOpacity = fadeIn * fadeOut;
    }

    const scrollYOffset = (scrollY / vh) * (visibleH * 0.70);

    // ── 1. BUTTERFLY SHADER UNIFORMS ──
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uDissolve.value = dissolveProgress;
      shaderMatRef.current.uniforms.uTime.value = time;
    }

    // ── 2. ANCHORED BUTTERFLY ──
    const bodyBobY = Math.sin(time * 1.8) * 0.006 * butterflyScale;
    const rotPitchX = Math.sin(time * 1.3) * 0.008;
    const rotYawY = Math.cos(time * 0.55) * 0.012;
    const rotRollZ = Math.sin(time * 0.7) * 0.006;

    if (quadRef.current) {
      quadRef.current.scale.set(butterflyScale, butterflyScale, butterflyScale);
      quadRef.current.position.x = 0;
      quadRef.current.position.y = butterflyBaseY + bodyBobY + scrollYOffset * 0.6;
      quadRef.current.position.z = 0;

      quadRef.current.rotation.x = rotPitchX;
      quadRef.current.rotation.y = rotYawY;
      quadRef.current.rotation.z = rotRollZ;

      quadRef.current.visible = dissolveProgress < 0.99 && scrollY < vh * 0.55;
    }

    // ── 3. TYPOGRAPHY ──
    if (textMatRef.current && textMeshRef.current) {
      if (scrollY > fadeOutEnd || textOpacity <= 0.001) {
        textMeshRef.current.visible = false;
        textMatRef.current.opacity = 0;
      } else {
        textMeshRef.current.visible = true;
        textMatRef.current.opacity = textOpacity;
        textMeshRef.current.scale.set(textScale, textScale, textScale);
        textMeshRef.current.position.x = 0;
        textMeshRef.current.position.y = textBaseY + scrollYOffset * 0.55;
      }
    }

    // ── 4. GPU PARTICLES ──
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
      const by = (pData.bPositions[i3 + 1] + (isMobilePortrait ? 0.52 : 0.25)) * butterflyScale;
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
        px = ax + Math.sin(time * speed * 0.25 + i * 0.4) * 0.6;
        py = ay + Math.cos(time * speed * 0.20 + i * 0.3) * 0.6;
        pz = az;

        r = pData.ambientColors[i3];
        g = pData.ambientColors[i3 + 1];
        b = pData.ambientColors[i3 + 2];
      } else {
        if (dissolveProgress <= dissolveStart) {
          px = bx;
          py = by + scrollYOffset * 0.6;
          pz = -9999;
        } else if (dissolveProgress <= 0.85) {
          const tDis = (dissolveProgress - dissolveStart) / (0.85 - dissolveStart);
          const easeDis = tDis * tDis * (3 - 2 * tDis);

          px = bx + dx * easeDis;
          py = by + dy * easeDis + scrollYOffset * 0.4;
          pz = bz + dz * easeDis;
        } else {
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

      {/* ── 3. RED & WHITE METAMORPHOSIS TYPOGRAPHY ── */}
      <mesh ref={textMeshRef} position={[0, -0.02, 0.05]}>
        <planeGeometry args={[TEXT_PLANE_W, TEXT_PLANE_H]} />
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
  const containerRef = useRef<HTMLDivElement>(null);
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

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateScroll();
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      window.removeEventListener("orientationchange", updateScroll);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-[100dvh] overflow-hidden"
      style={{
        pointerEvents: "none",
        zIndex: -20,
        backgroundColor: "#000000",
      }}
    >
      <Canvas
        camera={{
          position: [0, 0, 7.2],
          fov: 46,
        }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          background: "#000000",
        }}
      >
        <color attach="background" args={["#000000"]} />

        <CinematicMetamorphosisScene scrollYRef={scrollYRef} />
      </Canvas>
    </div>
  );
}