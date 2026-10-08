"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  const isCompletedRef = useRef(false);

  // ─────────────────────────────────────────────────────────────
  // 1. SCROLL-LOCK CONTROLLER (Strict 0-displacement while preloading)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void; scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
    if (lenis) {
      lenis.stop();
      lenis.scrollTo(0, { immediate: true });
    }

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const preventKeys = (e: KeyboardEvent) => {
      const keys = ["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"];
      if (keys.includes(e.key)) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("keydown", preventKeys, { passive: false });

    const unlock = () => {
      document.documentElement.style.overflow = prevHtmlOverflow || "";
      document.body.style.overflow = prevBodyOverflow || "";
      document.body.style.touchAction = prevBodyTouchAction || "";

      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      window.removeEventListener("keydown", preventKeys);

      const lenisAfter = (window as unknown as { __lenis?: { start: () => void; scrollTo: (target: number, opts?: { immediate?: boolean }) => void } }).__lenis;
      if (lenisAfter) {
        lenisAfter.scrollTo(0, { immediate: true });
        lenisAfter.start();
      }
    };

    // ─────────────────────────────────────────────────────────────
    // 2. TIMELINE & ACCESSIBILITY CONTROLLER (~3.2s crisp sequence)
    // ─────────────────────────────────────────────────────────────
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const fastTimer = setTimeout(() => {
        setIsFinishing(true);
        unlock();
        setTimeout(() => {
          setShowPreloader(false);
          if (onComplete) onComplete();
        }, 300);
      }, 500);
      return () => {
        clearTimeout(fastTimer);
        unlock();
      };
    }

    const DURATION = 3200; // 3.2s signature butterfly sequence
    const startTime = performance.now();

    const checkLoop = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed >= DURATION) {
        if (!isCompletedRef.current) {
          isCompletedRef.current = true;
          setIsFinishing(true);
          unlock();
          setTimeout(() => {
            setShowPreloader(false);
            if (onComplete) onComplete();
          }, 450);
        }
      } else {
        requestAnimationFrame(checkLoop);
      }
    };

    const animId = requestAnimationFrame(checkLoop);

    return () => {
      cancelAnimationFrame(animId);
      unlock();
    };
  }, [onComplete]);

  // ─────────────────────────────────────────────────────────────
  // 2. MAIN WEBGL ENGINE (Signature Butterfly Logo Activation)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.04);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.6);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Lighting Setup ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
    keyLight.position.set(2, 4, 6);
    scene.add(keyLight);

    // Dynamic Tracking Rim Lights
    const silverRim = new THREE.PointLight(0xe2e8f0, 3.5, 15);
    silverRim.position.set(-3, 1, 2);
    scene.add(silverRim);

    const crimsonRim = new THREE.PointLight(0xeb0028, 5.5, 15);
    crimsonRim.position.set(3, 1, 2);
    scene.add(crimsonRim);

    // ─────────────────────────────────────────────────────────────
    // 3. OFFICIAL TEDx KLH UNIVERSITY LOGO (Dynamic Canvas Texture)
    // ─────────────────────────────────────────────────────────────
    const createLogoTexture = (): { texture: THREE.CanvasTexture; canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } => {
      const canvas = document.createElement("canvas");
      canvas.width = 2048;
      canvas.height = 512;
      const ctx = canvas.getContext("2d")!;
      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      return { texture, canvas, ctx };
    };

    const { texture: logoTex, canvas: logoCanvas, ctx: logoCtx } = createLogoTexture();

    // Render Logo frame with individual letter activation values (0.0 = dark dim, 1.0 = radiant glow)
    const drawLogoState = (
      sweepU: number, // 0.0 to 1.0 UV sweep of the butterfly
      xPulse: number, // 0.0 to 1.0 ruby X highlight flare
      allLit: boolean
    ) => {
      logoCtx.clearRect(0, 0, 2048, 512);

      const cy = 256;

      // Measure letter widths to center the entire logo horizontally on the 2048px canvas
      logoCtx.font = "800 135px 'Sora', sans-serif";
      const tWidth = logoCtx.measureText("T").width;
      const eWidth = logoCtx.measureText("E").width;
      const dWidth = logoCtx.measureText("D").width;
      const tedTotalWidth = tWidth + eWidth + dWidth + 4;
      const xMarkWidth = logoCtx.measureText("x").width;

      logoCtx.font = "700 92px 'Sora', sans-serif";
      const klhWidth = logoCtx.measureText("KLH").width;

      logoCtx.font = "600 58px 'Sora', sans-serif";
      const uWidth = logoCtx.measureText("University").width;

      const gapDx = 4;
      const gapXK = 24;
      const gapKU = 18;

      const totalLogoWidth = tedTotalWidth + gapDx + xMarkWidth + gapXK + klhWidth + gapKU + uWidth;
      const startX = Math.round((2048 - totalLogoWidth) / 2);

      // Dynamic Letter boundaries in UV coordinates (0.0 to 1.0)
      const secT = { x0: startX / 2048, x1: (startX + tWidth) / 2048 };
      const secE = { x0: (startX + tWidth) / 2048, x1: (startX + tWidth + eWidth) / 2048 };
      const secD = { x0: (startX + tWidth + eWidth) / 2048, x1: (startX + tedTotalWidth) / 2048 };
      const secX = { x0: (startX + tedTotalWidth + gapDx) / 2048, x1: (startX + tedTotalWidth + gapDx + xMarkWidth) / 2048 };
      const secKLH = { x0: (startX + tedTotalWidth + gapDx + xMarkWidth + gapXK) / 2048, x1: (startX + tedTotalWidth + gapDx + xMarkWidth + gapXK + klhWidth) / 2048 };
      const secU = { x0: (startX + tedTotalWidth + gapDx + xMarkWidth + gapXK + klhWidth + gapKU) / 2048, x1: (startX + totalLogoWidth) / 2048 };

      const sections = [secT, secE, secD, secX, secKLH, secU];

      // Calculate letter brightness based on butterfly position
      const getLetterAlpha = (secIdx: number) => {
        if (allLit) return 1.0;
        const sec = sections[secIdx];
        if (sweepU >= sec.x1) return 1.0; // Already passed
        if (sweepU >= sec.x0) {
          return 0.15 + ((sweepU - sec.x0) / (sec.x1 - sec.x0)) * 0.85; // Currently crossing
        }
        return 0.12; // Dim silhouette in darkness
      };

      // 1. Draw "TED" (White, Bold, Exact Proportions)
      logoCtx.font = "800 135px 'Sora', sans-serif";
      logoCtx.textBaseline = "middle";
      logoCtx.textAlign = "left";

      // 'T'
      const tAlpha = getLetterAlpha(0);
      logoCtx.fillStyle = `rgba(255, 255, 255, ${tAlpha})`;
      logoCtx.shadowColor = `rgba(255, 255, 255, ${tAlpha > 0.6 ? 0.7 : 0})`;
      logoCtx.shadowBlur = tAlpha > 0.6 ? 24 : 0;
      logoCtx.fillText("T", startX, cy - 20);

      // 'E'
      const eAlpha = getLetterAlpha(1);
      logoCtx.fillStyle = `rgba(255, 255, 255, ${eAlpha})`;
      logoCtx.shadowColor = `rgba(255, 255, 255, ${eAlpha > 0.6 ? 0.7 : 0})`;
      logoCtx.shadowBlur = eAlpha > 0.6 ? 24 : 0;
      logoCtx.fillText("E", startX + tWidth + 2, cy - 20);

      // 'D'
      const dAlpha = getLetterAlpha(2);
      logoCtx.fillStyle = `rgba(255, 255, 255, ${dAlpha})`;
      logoCtx.shadowColor = `rgba(255, 255, 255, ${dAlpha > 0.6 ? 0.7 : 0})`;
      logoCtx.shadowBlur = dAlpha > 0.6 ? 24 : 0;
      logoCtx.fillText("D", startX + tWidth + eWidth + 4, cy - 20);

      // 2. Draw "x" (Signature Ruby Red TEDx Mark)
      const xAlpha = getLetterAlpha(3);
      const isXPulsing = xPulse > 0.05;
      logoCtx.fillStyle = `rgba(235, 0, 40, ${Math.min(1.0, xAlpha + xPulse * 0.4)})`;
      logoCtx.shadowColor = `rgba(235, 0, 40, ${xAlpha > 0.5 || isXPulsing ? 0.95 : 0})`;
      logoCtx.shadowBlur = isXPulsing ? 45 + xPulse * 30 : (xAlpha > 0.5 ? 28 : 0);
      logoCtx.fillText("x", startX + tedTotalWidth + gapDx, cy - 20);

      // 3. Draw "KLH" (White, Medium/Bold)
      const klhAlpha = getLetterAlpha(4);
      logoCtx.font = "700 92px 'Sora', sans-serif";
      logoCtx.fillStyle = `rgba(255, 255, 255, ${klhAlpha * 0.95})`;
      logoCtx.shadowColor = `rgba(255, 255, 255, ${klhAlpha > 0.6 ? 0.6 : 0})`;
      logoCtx.shadowBlur = klhAlpha > 0.6 ? 20 : 0;
      logoCtx.fillText("KLH", startX + tedTotalWidth + gapDx + xMarkWidth + gapXK, cy - 20);

      // 4. Draw "University" (Refined White Subtext)
      const uAlpha = getLetterAlpha(5);
      logoCtx.font = "600 58px 'Sora', sans-serif";
      logoCtx.fillStyle = `rgba(255, 255, 255, ${uAlpha * 0.85})`;
      logoCtx.shadowColor = `rgba(255, 255, 255, ${uAlpha > 0.6 ? 0.5 : 0})`;
      logoCtx.shadowBlur = uAlpha > 0.6 ? 16 : 0;
      logoCtx.fillText("University", startX + tedTotalWidth + gapDx + xMarkWidth + gapXK + klhWidth + gapKU, cy - 14);

      // 5. Official License Line: "x = independently organized TED event"
      const subAlpha = allLit ? 0.65 : Math.max(0.08, sweepU * 0.5);
      logoCtx.font = "400 24px 'Manrope', sans-serif";
      logoCtx.letterSpacing = "2px";
      logoCtx.shadowBlur = 0;
      logoCtx.fillStyle = `rgba(255, 255, 255, ${subAlpha})`;
      logoCtx.fillText(
        "x = independently organized TED event",
        startX,
        cy + 75
      );

      logoTex.needsUpdate = true;
    };

    // Initialize logo on canvas
    drawLogoState(0, 0, false);

    // Create 3D Plane Mesh for the Logo
    const logoGeom = new THREE.PlaneGeometry(5.2, 1.3);
    const logoMat = new THREE.MeshBasicMaterial({
      map: logoTex,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
    });
    const logoMesh = new THREE.Mesh(logoGeom, logoMat);
    logoMesh.position.set(0, 0, 0);
    scene.add(logoMesh);

    // ─────────────────────────────────────────────────────────────
    // 4. METAMORPHOSIS BUTTERFLY (Left Silver Wireframe | Right Ruby Crystal)
    // ─────────────────────────────────────────────────────────────
    const generateWingTexture = (isLeftSilver: boolean, isForewing: boolean): THREE.CanvasTexture => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.CanvasTexture(canvas);

      ctx.clearRect(0, 0, 1024, 1024);

      // Deep obsidian base
      const bgGrad = ctx.createRadialGradient(250, 350, 40, 512, 512, 650);
      if (isLeftSilver) {
        bgGrad.addColorStop(0, "rgba(28, 32, 40, 0.95)");
        bgGrad.addColorStop(0.4, "rgba(12, 14, 18, 0.9)");
        bgGrad.addColorStop(1, "rgba(2, 3, 5, 0.98)");
      } else {
        bgGrad.addColorStop(0, "rgba(50, 4, 12, 0.95)");
        bgGrad.addColorStop(0.4, "rgba(22, 2, 6, 0.9)");
        bgGrad.addColorStop(1, "rgba(3, 0, 1, 0.98)");
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Luminous Core Flare
      const flareGrad = ctx.createRadialGradient(
        isForewing ? 380 : 420,
        isForewing ? 420 : 460,
        15,
        512,
        512,
        520
      );
      if (isLeftSilver) {
        flareGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        flareGrad.addColorStop(0.2, "rgba(225, 240, 255, 0.8)");
        flareGrad.addColorStop(0.5, "rgba(160, 185, 220, 0.4)");
        flareGrad.addColorStop(0.8, "rgba(80, 100, 130, 0.12)");
        flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        flareGrad.addColorStop(0, "rgba(255, 70, 95, 0.98)");
        flareGrad.addColorStop(0.25, "rgba(235, 0, 40, 0.9)");
        flareGrad.addColorStop(0.55, "rgba(170, 0, 35, 0.5)");
        flareGrad.addColorStop(0.85, "rgba(80, 0, 15, 0.18)");
        flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Crystalline Wireframe & Venation Lines
      ctx.shadowBlur = isLeftSilver ? 18 : 25;
      ctx.shadowColor = isLeftSilver ? "rgba(255, 255, 255, 0.85)" : "rgba(235, 0, 40, 0.95)";
      ctx.strokeStyle = isLeftSilver ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 190, 200, 0.95)";
      ctx.lineWidth = 3.2;

      const rootX = isForewing ? 120 : 160;
      const rootY = isForewing ? 860 : 240;
      const numVeins = isForewing ? 13 : 9;

      for (let i = 0; i < numVeins; i++) {
        const angle = isForewing
          ? -0.12 - (i / numVeins) * 1.38
          : 0.12 + (i / numVeins) * 1.34;
        const len = 420 + Math.sin(i * 1.4) * 200 + (isForewing ? 260 : 190);

        const endX = rootX + Math.cos(angle) * len;
        const endY = rootY + Math.sin(angle) * len;
        const cpX = rootX + Math.cos(angle + 0.16) * (len * 0.52);
        const cpY = rootY + Math.sin(angle + 0.16) * (len * 0.52);

        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.stroke();

        // Crystalline Facets & Cross-struts
        for (let b = 1; b <= 3; b++) {
          const t = 0.32 + b * 0.22;
          const bx = rootX * (1 - t) * (1 - t) + 2 * cpX * (1 - t) * t + endX * t * t;
          const by = rootY * (1 - t) * (1 - t) + 2 * cpY * (1 - t) * t + endY * t * t;

          const branchAngle = angle + (b % 2 === 0 ? 0.38 : -0.38);
          const bLen = 110 + Math.sin(b * 1.5) * 60;

          ctx.lineWidth = 1.6;
          ctx.strokeStyle = isLeftSilver
            ? "rgba(215, 235, 255, 0.65)"
            : "rgba(255, 110, 140, 0.7)";
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(branchAngle) * bLen, by + Math.sin(branchAngle) * bLen);
          ctx.stroke();
        }
      }

      // Luminous Margin Crystallites
      ctx.shadowBlur = 18;
      ctx.shadowColor = isLeftSilver ? "#ffffff" : "#ff1a3d";
      ctx.fillStyle = isLeftSilver ? "#ffffff" : "#ffccd4";
      const edgeCount = isForewing ? 22 : 16;
      for (let j = 0; j < edgeCount; j++) {
        const spotX = isForewing ? 720 + Math.sin(j * 0.7) * 190 : 680 + Math.cos(j * 0.6) * 180;
        const spotY = isForewing ? 210 + j * 34 : 320 + j * 36;
        const radius = 2.5 + (j % 3 === 0 ? 3.0 : 1.2);
        ctx.beginPath();
        ctx.arc(spotX, spotY, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const leftForewingTex = generateWingTexture(true, true);
    const leftHindwingTex = generateWingTexture(true, false);
    const rightForewingTex = generateWingTexture(false, true);
    const rightHindwingTex = generateWingTexture(false, false);

    // Wing Geometries
    const forewingShape = new THREE.Shape();
    forewingShape.moveTo(0, 0);
    forewingShape.bezierCurveTo(0.35, 0.85, 1.2, 1.95, 1.85, 2.55);
    forewingShape.bezierCurveTo(2.4, 2.75, 2.75, 2.55, 2.85, 2.15);
    forewingShape.bezierCurveTo(2.8, 1.45, 2.3, 0.85, 2.05, 0.35);
    forewingShape.bezierCurveTo(1.85, 0.05, 1.35, -0.1, 0.75, -0.05);
    forewingShape.lineTo(0, 0);
    const forewingGeom = new THREE.ShapeGeometry(forewingShape, 32);

    const hindwingShape = new THREE.Shape();
    hindwingShape.moveTo(0, 0);
    hindwingShape.bezierCurveTo(0.55, 0.1, 1.35, 0.0, 1.8, -0.4);
    hindwingShape.bezierCurveTo(2.1, -0.9, 1.95, -1.65, 1.55, -2.15);
    hindwingShape.bezierCurveTo(1.15, -2.45, 0.65, -2.2, 0.4, -1.65);
    hindwingShape.bezierCurveTo(0.18, -1.15, 0.08, -0.55, 0.0, 0.0);
    hindwingShape.lineTo(0, 0);
    const hindwingGeom = new THREE.ShapeGeometry(hindwingShape, 28);

    const createWingMaterial = (map: THREE.Texture, isSilver: boolean) => {
      return new THREE.MeshStandardMaterial({
        map,
        side: THREE.DoubleSide,
        roughness: isSilver ? 0.25 : 0.35,
        metalness: isSilver ? 0.8 : 0.25,
        emissive: new THREE.Color(isSilver ? 0x222a35 : 0x880018),
        emissiveIntensity: isSilver ? 0.45 : 0.7,
        transparent: true,
        opacity: 0.95,
      });
    };

    const leftForewingMat = createWingMaterial(leftForewingTex, true);
    const leftHindwingMat = createWingMaterial(leftHindwingTex, true);
    const rightForewingMat = createWingMaterial(rightForewingTex, false);
    const rightHindwingMat = createWingMaterial(rightHindwingTex, false);

    // ─────────────────────────────────────────────────────────────
    // BUTTERFLY 3D BODY & 4 WING PIVOTS
    // ─────────────────────────────────────────────────────────────
    const butterflyRoot = new THREE.Group();
    // Start with small realistic scale matching the logo height
    butterflyRoot.scale.set(0.38, 0.38, 0.38);
    scene.add(butterflyRoot);

    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x0c0c0e,
      roughness: 0.35,
      metalness: 0.85,
      emissive: new THREE.Color(0x1a0206),
      emissiveIntensity: 0.3,
    });

    // Thorax
    const thoraxGeom = new THREE.SphereGeometry(0.12, 16, 16);
    thoraxGeom.scale(0.85, 1.4, 0.75);
    const thorax = new THREE.Mesh(thoraxGeom, bodyMat);
    thorax.position.set(0, 0.1, 0);
    butterflyRoot.add(thorax);

    // Abdomen
    const abdomenGeom = new THREE.ConeGeometry(0.11, 1.1, 16);
    abdomenGeom.rotateX(Math.PI);
    abdomenGeom.scale(0.75, 1.0, 0.65);
    const abdomen = new THREE.Mesh(abdomenGeom, bodyMat);
    abdomen.position.set(0, -0.65, -0.05);
    butterflyRoot.add(abdomen);

    // Head
    const headGeom = new THREE.SphereGeometry(0.095, 16, 16);
    const head = new THREE.Mesh(headGeom, bodyMat);
    head.position.set(0, 0.35, 0.03);
    butterflyRoot.add(head);

    // Compound Eyes
    const eyeGeom = new THREE.SphereGeometry(0.042, 12, 12);
    const leftEyeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: new THREE.Color(0xddeeff),
      emissiveIntensity: 1.4,
    });
    const rightEyeMat = new THREE.MeshStandardMaterial({
      color: 0xff1133,
      emissive: new THREE.Color(0xeb0028),
      emissiveIntensity: 1.8,
    });
    const leftEye = new THREE.Mesh(eyeGeom, leftEyeMat);
    leftEye.position.set(-0.062, 0.37, 0.07);
    butterflyRoot.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, rightEyeMat);
    rightEye.position.set(0.062, 0.37, 0.07);
    butterflyRoot.add(rightEye);

    // Curved Antennae
    const createAntenna = (isLeft: boolean) => {
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(isLeft ? -0.14 : 0.14, 0.22, 0.1),
        new THREE.Vector3(isLeft ? -0.32 : 0.32, 0.45, 0.18),
        new THREE.Vector3(isLeft ? -0.42 : 0.42, 0.55, 0.14)
      );
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 20, 0.011, 8, false),
        bodyMat
      );
      tube.position.set(isLeft ? -0.03 : 0.03, 0.38, 0.05);

      const tip = new THREE.Mesh(
        new THREE.SphereGeometry(0.024, 8, 8),
        isLeft ? leftEyeMat : rightEyeMat
      );
      tip.position.set(isLeft ? -0.42 : 0.42, 0.55, 0.14);
      tube.add(tip);
      return tube;
    };
    butterflyRoot.add(createAntenna(true));
    butterflyRoot.add(createAntenna(false));

    // Wing Pivots
    const leftForewingPivot = new THREE.Group();
    leftForewingPivot.position.set(-0.055, 0.18, 0.02);
    const leftForewingMesh = new THREE.Mesh(forewingGeom, leftForewingMat);
    leftForewingMesh.scale.set(-1, 1, 1);
    leftForewingPivot.add(leftForewingMesh);
    butterflyRoot.add(leftForewingPivot);

    const leftHindwingPivot = new THREE.Group();
    leftHindwingPivot.position.set(-0.045, 0.02, -0.02);
    const leftHindwingMesh = new THREE.Mesh(hindwingGeom, leftHindwingMat);
    leftHindwingMesh.scale.set(-1, 1, 1);
    leftHindwingPivot.add(leftHindwingMesh);
    butterflyRoot.add(leftHindwingPivot);

    const rightForewingPivot = new THREE.Group();
    rightForewingPivot.position.set(0.055, 0.18, 0.02);
    const rightForewingMesh = new THREE.Mesh(forewingGeom, rightForewingMat);
    rightForewingPivot.add(rightForewingMesh);
    butterflyRoot.add(rightForewingPivot);

    const rightHindwingPivot = new THREE.Group();
    rightHindwingPivot.position.set(0.045, 0.02, -0.02);
    const rightHindwingMesh = new THREE.Mesh(hindwingGeom, rightHindwingMat);
    rightHindwingPivot.add(rightHindwingMesh);
    butterflyRoot.add(rightHindwingPivot);

    // ─────────────────────────────────────────────────────────────
    // 5. SECONDARY PARTICLE TRAILS (Left: Silver | Right: Ruby)
    // ─────────────────────────────────────────────────────────────
    const TRAIL_COUNT = 360;
    const trailPositions = new Float32Array(TRAIL_COUNT * 3);
    const trailColors = new Float32Array(TRAIL_COUNT * 3);
    const trailAlphas = new Float32Array(TRAIL_COUNT);
    const trailVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < TRAIL_COUNT; i++) {
      const i3 = i * 3;
      trailPositions[i3] = 0;
      trailPositions[i3 + 1] = 0;
      trailPositions[i3 + 2] = -999;

      const isLeftSilver = i % 2 === 0;
      if (isLeftSilver) {
        trailColors[i3] = 0.95;
        trailColors[i3 + 1] = 0.98;
        trailColors[i3 + 2] = 1.0;
      } else {
        trailColors[i3] = 1.0;
        trailColors[i3 + 1] = 0.08;
        trailColors[i3 + 2] = 0.18;
      }

      trailAlphas[i] = 0;
      trailVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: -0.01 - Math.random() * 0.015,
        z: (Math.random() - 0.5) * 0.02,
      });
    }

    const trailGeom = new THREE.BufferGeometry();
    trailGeom.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
    trailGeom.setAttribute("color", new THREE.BufferAttribute(trailColors, 3));

    const trailMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const trailPoints = new THREE.Points(trailGeom, trailMat);
    scene.add(trailPoints);

    let trailSpawnIdx = 0;

    // Ambient floating dust
    const DUST_COUNT = 90;
    const dustPositions = new Float32Array(DUST_COUNT * 3);
    const dustColors = new Float32Array(DUST_COUNT * 3);

    for (let d = 0; d < DUST_COUNT; d++) {
      const d3 = d * 3;
      dustPositions[d3] = (Math.random() - 0.5) * 16;
      dustPositions[d3 + 1] = (Math.random() - 0.5) * 10;
      dustPositions[d3 + 2] = (Math.random() - 0.5) * 16;

      const isCrimson = Math.random() < 0.3;
      dustColors[d3] = isCrimson ? 0.9 : 0.75;
      dustColors[d3 + 1] = isCrimson ? 0.05 : 0.8;
      dustColors[d3 + 2] = isCrimson ? 0.15 : 0.9;
    }

    const dustGeom = new THREE.BufferGeometry();
    dustGeom.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    dustGeom.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 0.025,
      vertexColors: true,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    scene.add(new THREE.Points(dustGeom, dustMat));

    // ─────────────────────────────────────────────────────────────
    // 6. EXACT FLIGHT PATH & LOGO CROSSING KINEMATICS
    // ─────────────────────────────────────────────────────────────
    // Dynamic Spline Waypoints (Aligned to centered TEDx KLH University logo across all viewports):
    const createFlightSpline = (s: number) => {
      return new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(-1.35 * s, 0.8, -10.0),
          new THREE.Vector3(-1.45 * s, 0.25, -2.0),
          new THREE.Vector3(-1.25 * s, 0.08, 0.35),
          new THREE.Vector3(-0.80 * s, 0.03, 0.38),
          new THREE.Vector3(-0.42 * s, -0.02, 0.40),
          new THREE.Vector3(0.08 * s, 0.04, 0.38),
          new THREE.Vector3(0.75 * s, 0.06, 0.36),
          new THREE.Vector3(1.30 * s, 0.18, 0.45),
          new THREE.Vector3(0.35 * s, 0.0, 2.5),
          new THREE.Vector3(0.0, 0.25, 8.5),
        ],
        false,
        "centripetal",
        0.5
      );
    };

    let currentScale = 1.0;
    let flightSpline = createFlightSpline(currentScale);

    const startAnimationTime = performance.now();
    const TOTAL_SEQUENCE_MS = 4900;
    let animFrameId: number;

    const pos = new THREE.Vector3();
    const tangent = new THREE.Vector3();

    const render = (now: number) => {
      animFrameId = requestAnimationFrame(render);

      const currentTime = typeof now === "number" ? now : performance.now();
      const elapsed = currentTime - startAnimationTime;
      const progressNorm = Math.min(1.0, Math.max(0.0, elapsed / TOTAL_SEQUENCE_MS));

      // Map progress to spline parameter `tNorm` according to exact timeline:
      // 0.0 - 0.10 (0 - 0.5s): Distant void emergence
      // 0.10 - 0.25 (0.5 - 1.2s): Fly from distant void to left side of logo
      // 0.25 - 0.40 (1.2 - 2.0s): Align to 'T'
      // 0.40 - 0.72 (2.0 - 3.5s): Fly across logo (T -> E -> D -> X -> KLH -> Univ)
      // 0.72 - 0.78 (3.5 - 3.8s): Brief cinematic pause at right of logo
      // 0.78 - 0.94 (3.8 - 4.6s): Fly toward camera (large foreground)
      // 0.94 - 1.00 (4.6 - 4.9s): Fly through camera into website
      let tNorm: number;

      if (progressNorm < 0.25) {
        // Distant entry -> Approach
        const pSub = progressNorm / 0.25;
        tNorm = Math.pow(pSub, 1.4) * 0.22;
      } else if (progressNorm < 0.40) {
        // Approach 'T'
        const pSub = (progressNorm - 0.25) / 0.15;
        tNorm = 0.22 + pSub * 0.08;
      } else if (progressNorm < 0.72) {
        // Steady graceful crossing of the letters (T -> E -> D -> X -> KLH)
        const pSub = (progressNorm - 0.40) / 0.32;
        tNorm = 0.30 + pSub * 0.42;
      } else if (progressNorm < 0.78) {
        // Cinematic pause / hover at logo end
        const pSub = (progressNorm - 0.72) / 0.06;
        tNorm = 0.72 + Math.sin(pSub * Math.PI * 0.5) * 0.03;
      } else if (progressNorm < 0.94) {
        // Turn & approach camera
        const pSub = (progressNorm - 0.78) / 0.16;
        tNorm = 0.75 + Math.pow(pSub, 1.3) * 0.18;
      } else {
        // Accelerate through camera
        const pSub = (progressNorm - 0.94) / 0.06;
        tNorm = 0.93 + Math.pow(pSub, 1.6) * 0.07;
      }

      tNorm = THREE.MathUtils.clamp(tNorm, 0.001, 0.999);

      // Sample 3D position & velocity tangent safely
      flightSpline.getPoint(tNorm, pos);
      flightSpline.getTangent(tNorm, tangent);
      if (tangent.lengthSq() > 0.0001) tangent.normalize();
      else tangent.set(1, 0, 0);

      // Wing Flapping Aerodynamics (Graceful ~5.2 Hz)
      const flapFreq = 32.5;
      const flapPhase = (elapsed * 0.001) * flapFreq;
      const flapBase = Math.sin(flapPhase);

      const forewingFlap = flapBase * 0.75;
      const hindwingFlap = Math.sin(flapPhase - 0.22) * 0.68;

      leftForewingPivot.rotation.y = -forewingFlap;
      leftForewingPivot.rotation.z = -Math.sin(flapPhase) * 0.14;
      leftForewingPivot.rotation.x = -Math.cos(flapPhase) * 0.07;

      leftHindwingPivot.rotation.y = -hindwingFlap;
      leftHindwingPivot.rotation.x = -Math.cos(flapPhase - 0.22) * 0.05;

      rightForewingPivot.rotation.y = forewingFlap;
      rightForewingPivot.rotation.z = Math.sin(flapPhase) * 0.14;
      rightForewingPivot.rotation.x = -Math.cos(flapPhase) * 0.07;

      rightHindwingPivot.rotation.y = hindwingFlap;
      rightHindwingPivot.rotation.x = -Math.cos(flapPhase - 0.22) * 0.05;

      // Body oscillation
      const bodyBob = Math.sin(flapPhase * 2) * 0.035;
      abdomen.rotation.x = Math.sin(flapPhase) * 0.12;

      // Position butterfly
      butterflyRoot.position.set(pos.x, pos.y + bodyBob, pos.z);

      // Responsive Dynamic Scaling (Smaller near logo, large when approaching camera)
      let scaleMult = 0.38 * Math.max(0.7, currentScale);
      if (progressNorm > 0.75) {
        const sT = (progressNorm - 0.75) / 0.25;
        scaleMult = scaleMult + Math.pow(sT, 1.5) * 0.95;
      }
      butterflyRoot.scale.set(scaleMult, scaleMult, scaleMult);

      // Organic Flight Banking (Align with flight curve)
      const rollAngle = -tangent.x * 0.75;
      const yawAngle = Math.atan2(tangent.x, -tangent.z);
      const pitchAngle = Math.asin(THREE.MathUtils.clamp(tangent.y, -1, 1)) + 0.12;

      butterflyRoot.rotation.set(pitchAngle, yawAngle, rollAngle);

      // ─────────────────────────────────────────────────────────────
      // LOGO ILLUMINATION & THE 'X' PULSE MOMENT
      // ─────────────────────────────────────────────────────────────
      // Map butterfly's X coordinate to Logo UV (0.0 to 1.0)
      const sweepUV = THREE.MathUtils.clamp((pos.x / (5.2 * currentScale)) + 0.5, 0.0, 1.0);

      // Calculate Red 'X' Pulse when butterfly is near X (x ≈ -0.42 * currentScale)
      const targetXX = -0.42 * currentScale;
      const distToX = Math.abs(pos.x - targetXX);
      const pulseThreshold = 0.35 * currentScale;
      let xPulse = 0;
      if (progressNorm >= 0.40 && progressNorm <= 0.65 && distToX < pulseThreshold) {
        xPulse = Math.sin((1.0 - distToX / pulseThreshold) * Math.PI);
      }

      const allLettersLit = progressNorm >= 0.72;
      drawLogoState(sweepUV, xPulse, allLettersLit);

      // ─────────────────────────────────────────────────────────────
      // WINGTIP PARTICLE EMISSION
      // ─────────────────────────────────────────────────────────────
      if (progressNorm > 0.12 && progressNorm < 0.98) {
        const rTip = new THREE.Vector3(2.5, 2.0, 0);
        rightForewingPivot.localToWorld(rTip);

        const lTip = new THREE.Vector3(2.5, 2.0, 0);
        leftForewingPivot.localToWorld(lTip);

        // Spawn left (silver) & right (ruby) particles
        for (let s = 0; s < 2; s++) {
          const spawnPos = s === 0 ? lTip : rTip;
          const idx3 = trailSpawnIdx * 3;

          trailPositions[idx3] = spawnPos.x + (Math.random() - 0.5) * 0.04;
          trailPositions[idx3 + 1] = spawnPos.y + (Math.random() - 0.5) * 0.04;
          trailPositions[idx3 + 2] = spawnPos.z + (Math.random() - 0.5) * 0.04;

          // Extra red crystalline sparks when crossing X or foreground
          if (xPulse > 0.2 && s === 1) {
            trailVelocities[trailSpawnIdx].x = (Math.random() - 0.5) * 0.06;
            trailVelocities[trailSpawnIdx].y = -0.02 - Math.random() * 0.03;
            trailVelocities[trailSpawnIdx].z = (Math.random() - 0.5) * 0.06;
          } else if (progressNorm > 0.88) {
            // Expansion burst during fly-through
            trailVelocities[trailSpawnIdx].x = (Math.random() - 0.5) * 0.08;
            trailVelocities[trailSpawnIdx].y = (Math.random() - 0.5) * 0.08;
            trailVelocities[trailSpawnIdx].z = 0.03 + Math.random() * 0.04;
          }

          trailAlphas[trailSpawnIdx] = 1.0;
          trailSpawnIdx = (trailSpawnIdx + 1) % TRAIL_COUNT;
        }
      }

      // Update Particle Physics & Fade
      const posAttr = trailGeom.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const i3 = i * 3;
        if (trailAlphas[i] > 0) {
          trailPositions[i3] += trailVelocities[i].x;
          trailPositions[i3 + 1] += trailVelocities[i].y;
          trailPositions[i3 + 2] += trailVelocities[i].z;
          trailAlphas[i] -= 0.015;

          if (trailAlphas[i] <= 0) {
            trailPositions[i3 + 2] = -999;
          }
        }
      }
      posAttr.needsUpdate = true;

      // Update light positions
      silverRim.position.set(pos.x - 2.0, pos.y + 0.4, pos.z + 1.0);
      crimsonRim.position.set(pos.x + 2.0, pos.y + 0.4, pos.z + 1.0);

      renderer.render(scene, camera);
    };

    animFrameId = requestAnimationFrame(render);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // Perfectly center and fit logo mesh responsively on any viewport (mobile to ultrawide)
      const aspect = w / h;
      const visibleWidthAtZ0 = 2 * Math.tan((40 * Math.PI) / 360) * 7.6 * aspect; // ~5.53 * aspect
      const targetLogoWidth = Math.min(5.2, visibleWidthAtZ0 * 0.86);
      const responsiveScale = Math.max(0.35, Math.min(1.0, targetLogoWidth / 5.2));

      logoMesh.scale.set(responsiveScale, responsiveScale, 1.0);
      currentScale = responsiveScale;
      flightSpline = createFlightSpline(currentScale);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      logoGeom.dispose();
      logoMat.dispose();
      logoTex.dispose();
      forewingGeom.dispose();
      hindwingGeom.dispose();
      leftForewingMat.dispose();
      leftHindwingMat.dispose();
      rightForewingMat.dispose();
      rightHindwingMat.dispose();
      leftForewingTex.dispose();
      leftHindwingTex.dispose();
      rightForewingTex.dispose();
      rightHindwingTex.dispose();
      trailGeom.dispose();
      trailMat.dispose();
      dustGeom.dispose();
      dustMat.dispose();
    };
  }, []);

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={isFinishing ? { opacity: 0 } : { opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.65, 0, 0.35, 1] }}
          className="fixed inset-0 w-screen h-screen z-[99999] select-none overflow-hidden bg-black flex flex-col justify-between items-center p-8 sm:p-12 pointer-events-auto touch-none"
          onWheel={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onTouchMove={(e) => { e.preventDefault(); e.stopPropagation(); }}
        >
          {/* ── 3D CINEMATIC LOGO ACTIVATION WEBGL CANVAS ── */}
          <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full z-10 pointer-events-none"
          />

          {/* Subtle Studio Void Vignette & Atmosphere */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65vw] max-w-[700px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none z-0" />

          {/* Top spacer */}
          <div className="relative z-30 w-full" />

          {/* ── MINIMAL LUXURY MICRO-TEXT ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative z-30 w-full flex justify-center items-center pb-2"
          >
            <span
              className="text-[9px] sm:text-[10px] tracking-[0.45em] text-white/35 uppercase font-medium"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              TEDx KLH 2026
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
