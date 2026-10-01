"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import * as THREE from "three";
import { playHoverTickSound, playLaunchIgnitionSound } from "@/lib/utils/audio";

// ─────────────────────────────────────────────────────────────
// 1. STANDALONE CINEMATIC METAMORPHOSIS LAUNCH PAGE
// Route: /launch (Completely independent from homepage)
// ─────────────────────────────────────────────────────────────

export default function LaunchPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Experience Timeline States:
  // 0: Darkness / Initial
  // 1: Fragment Convergence
  // 2: Butterfly Crystallization & Wing Flex
  // 3: Energy Pulse
  // 4: Brand & Launch Control Active
  const [phase, setPhase] = useState<number>(0);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [warpProgress, setWarpProgress] = useState<number>(0);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Mouse Parallax Springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  // WebGL references
  const animFrameIdRef = useRef<number | null>(null);
  const threeStateRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    butterflyGroup: THREE.Group;
    leftWingPivot: THREE.Group;
    rightWingPivot: THREE.Group;
    particlesMesh: THREE.Points;
    shatterMesh: THREE.Points;
    pointLightCrimson: THREE.PointLight;
    pointLightSilver: THREE.PointLight;
    ambientLight: THREE.AmbientLight;
  } | null>(null);

  // Check reduced motion
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setIsReducedMotion(motionQuery.matches);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 2. TIMELINE CONTROLLER
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return;

    if (isReducedMotion) {
      setPhase(4);
      return;
    }

    // Phase 1: Fragment Convergence starts at 0.8s
    const t1 = setTimeout(() => setPhase(1), 800);
    // Phase 2: Butterfly Assembly at 2.6s
    const t2 = setTimeout(() => setPhase(2), 2600);
    // Phase 3: Crimson Energy Wave Pulse at 4.6s
    const t3 = setTimeout(() => setPhase(3), 4600);
    // Phase 4: Brand Reveal & Launch Button Activation at 5.4s
    const t4 = setTimeout(() => setPhase(4), 5400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [mounted, isReducedMotion]);

  // ─────────────────────────────────────────────────────────────
  // 3. THREE.JS 3D BUTTERFLY & CRYSTALLINE ENGINE
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // ── Scene, Camera & Renderer ──
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020202);
    scene.fog = new THREE.FogExp2(0x020202, 0.035);

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // ── Lights ──
    const ambientLight = new THREE.AmbientLight(0x111111, 1.2);
    scene.add(ambientLight);

    const pointLightSilver = new THREE.PointLight(0xe8f2ff, 0, 20);
    pointLightSilver.position.set(-3.5, 1.5, 3.5);
    scene.add(pointLightSilver);

    const pointLightCrimson = new THREE.PointLight(0xeb0028, 0, 20);
    pointLightCrimson.position.set(3.5, 1.5, 3.5);
    scene.add(pointLightCrimson);

    // ── Butterfly Group & Wing Texture Generators ──
    const butterflyGroup = new THREE.Group();
    butterflyGroup.position.set(0, 0.45, 0);
    butterflyGroup.scale.set(0.001, 0.001, 0.001); // starts collapsed
    scene.add(butterflyGroup);

    const leftWingPivot = new THREE.Group();
    const rightWingPivot = new THREE.Group();
    butterflyGroup.add(leftWingPivot);
    butterflyGroup.add(rightWingPivot);

    // Procedural Dynamic Crystalline Wing Texture Canvas
    const createWingTexture = (isLeftSilver: boolean, isForewing: boolean): THREE.CanvasTexture => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d")!;
      ctx.clearRect(0, 0, 1024, 1024);

      // Deep obsidian gradient base
      const bgGrad = ctx.createRadialGradient(250, 350, 40, 512, 512, 650);
      if (isLeftSilver) {
        bgGrad.addColorStop(0, "rgba(25, 30, 38, 0.96)");
        bgGrad.addColorStop(0.5, "rgba(10, 12, 16, 0.9)");
        bgGrad.addColorStop(1, "rgba(2, 2, 4, 0.98)");
      } else {
        bgGrad.addColorStop(0, "rgba(55, 3, 12, 0.96)");
        bgGrad.addColorStop(0.5, "rgba(20, 2, 6, 0.9)");
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
        500
      );
      if (isLeftSilver) {
        flareGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        flareGrad.addColorStop(0.25, "rgba(220, 235, 255, 0.75)");
        flareGrad.addColorStop(0.6, "rgba(150, 180, 215, 0.3)");
        flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      } else {
        flareGrad.addColorStop(0, "rgba(255, 60, 90, 0.98)");
        flareGrad.addColorStop(0.25, "rgba(235, 0, 40, 0.85)");
        flareGrad.addColorStop(0.6, "rgba(160, 0, 30, 0.35)");
        flareGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Crystalline Venation & Facet Struts
      ctx.shadowBlur = isLeftSilver ? 16 : 22;
      ctx.shadowColor = isLeftSilver ? "rgba(255, 255, 255, 0.85)" : "rgba(235, 0, 40, 0.95)";
      ctx.strokeStyle = isLeftSilver ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 200, 210, 0.95)";
      ctx.lineWidth = 3.5;

      const rootX = isForewing ? 120 : 160;
      const rootY = isForewing ? 860 : 240;
      const numVeins = isForewing ? 14 : 10;

      for (let i = 0; i < numVeins; i++) {
        const angle = isForewing
          ? -0.12 - (i / numVeins) * 1.38
          : 0.12 + (i / numVeins) * 1.34;
        const len = 430 + Math.sin(i * 1.4) * 200 + (isForewing ? 260 : 190);

        const endX = rootX + Math.cos(angle) * len;
        const endY = rootY + Math.sin(angle) * len;
        const cpX = rootX + Math.cos(angle + 0.16) * (len * 0.52);
        const cpY = rootY + Math.sin(angle + 0.16) * (len * 0.52);

        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.quadraticCurveTo(cpX, cpY, endX, endY);
        ctx.stroke();

        // Facet Struts
        for (let b = 1; b <= 3; b++) {
          const t = 0.32 + b * 0.22;
          const bx = rootX * (1 - t) * (1 - t) + 2 * cpX * (1 - t) * t + endX * t * t;
          const by = rootY * (1 - t) * (1 - t) + 2 * cpY * (1 - t) * t + endY * t * t;

          const branchAngle = angle + (b % 2 === 0 ? 0.4 : -0.4);
          const bLen = 110 + Math.sin(b * 1.5) * 60;

          ctx.lineWidth = 1.8;
          ctx.strokeStyle = isLeftSilver
            ? "rgba(215, 235, 255, 0.7)"
            : "rgba(255, 120, 150, 0.75)";
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + Math.cos(branchAngle) * bLen, by + Math.sin(branchAngle) * bLen);
          ctx.stroke();
        }
      }

      // Margin Crystallites
      ctx.shadowBlur = 14;
      ctx.shadowColor = isLeftSilver ? "#ffffff" : "#eb0028";
      ctx.fillStyle = isLeftSilver ? "#ffffff" : "#ffe6ea";
      const edgeCount = isForewing ? 24 : 16;
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

    const createWingMat = (map: THREE.Texture, isSilver: boolean) =>
      new THREE.MeshStandardMaterial({
        map,
        side: THREE.DoubleSide,
        roughness: isSilver ? 0.25 : 0.32,
        metalness: isSilver ? 0.85 : 0.28,
        emissive: new THREE.Color(isSilver ? 0x222a35 : 0x880018),
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0.98,
      });

    // Left Wings (Silver/White)
    const leftForeMesh = new THREE.Mesh(forewingGeom, createWingMat(createWingTexture(true, true), true));
    const leftHindMesh = new THREE.Mesh(hindwingGeom, createWingMat(createWingTexture(true, false), true));
    leftForeMesh.scale.set(-1, 1, 1);
    leftHindMesh.scale.set(-1, 1, 1);
    leftWingPivot.add(leftForeMesh);
    leftWingPivot.add(leftHindMesh);

    // Right Wings (Crimson/Red)
    const rightForeMesh = new THREE.Mesh(forewingGeom, createWingMat(createWingTexture(false, true), false));
    const rightHindMesh = new THREE.Mesh(hindwingGeom, createWingMat(createWingTexture(false, false), false));
    rightWingPivot.add(rightForeMesh);
    rightWingPivot.add(rightHindMesh);

    // Central Thorax Spine
    const thoraxGeom = new THREE.CylinderGeometry(0.045, 0.025, 1.6, 16);
    const thoraxMat = new THREE.MeshStandardMaterial({
      color: 0x111115,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x220508,
    });
    const thoraxMesh = new THREE.Mesh(thoraxGeom, thoraxMat);
    thoraxMesh.rotation.z = 0;
    butterflyGroup.add(thoraxMesh);

    // ── Environmental & Convergence Crystalline Particles ──
    const PARTICLE_COUNT = 1800;
    const pGeom = new THREE.BufferGeometry();
    const pPos = new Float32Array(PARTICLE_COUNT * 3);
    const pCol = new Float32Array(PARTICLE_COUNT * 3);
    const pTarget = new Float32Array(PARTICLE_COUNT * 3);
    const pSpeed = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const isLeft = i % 2 === 0;

      // Start widely dispersed in 3D sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const rad = 6.0 + Math.random() * 8.0;

      pPos[i3] = Math.sin(phi) * Math.cos(theta) * rad;
      pPos[i3 + 1] = Math.sin(phi) * Math.sin(theta) * rad;
      pPos[i3 + 2] = Math.cos(phi) * rad;

      // Target converging coordinate around butterfly wings
      const wingU = Math.random();
      const wingV = Math.random();
      const side = isLeft ? -1 : 1;
      const wx = side * (0.2 + Math.pow(wingV, 0.5) * (1.8 + wingU * 0.8));
      const wy = (Math.random() - 0.5) * 3.2 + 0.45;
      const wz = (Math.random() - 0.5) * 0.6;

      pTarget[i3] = wx;
      pTarget[i3 + 1] = wy;
      pTarget[i3 + 2] = wz;

      pSpeed[i] = 0.015 + Math.random() * 0.025;

      // Colors
      if (isLeft) {
        // Silver / White
        const b = 0.8 + Math.random() * 0.2;
        pCol[i3] = 0.95 * b;
        pCol[i3 + 1] = 0.98 * b;
        pCol[i3 + 2] = 1.0 * b;
      } else {
        // Crimson / Red
        pCol[i3] = 0.98;
        pCol[i3 + 1] = 0.06 + Math.random() * 0.15;
        pCol[i3 + 2] = 0.20 + Math.random() * 0.15;
      }
    }

    pGeom.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeom.setAttribute("color", new THREE.BufferAttribute(pCol, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particlesMesh = new THREE.Points(pGeom, pMat);
    scene.add(particlesMesh);

    // ── Hyperspace Shatter Explosion Points (Active on Launch Click) ──
    const SHATTER_COUNT = 3200;
    const sGeom = new THREE.BufferGeometry();
    const sPos = new Float32Array(SHATTER_COUNT * 3);
    const sCol = new Float32Array(SHATTER_COUNT * 3);
    const sVel = new Float32Array(SHATTER_COUNT * 3);

    for (let j = 0; j < SHATTER_COUNT; j++) {
      const j3 = j * 3;
      const isLeft = j % 2 === 0;
      sPos[j3] = (isLeft ? -1 : 1) * Math.random() * 2.5;
      sPos[j3 + 1] = (Math.random() - 0.5) * 3.0 + 0.45;
      sPos[j3 + 2] = (Math.random() - 0.5) * 0.5;

      // Explosion velocities forward toward camera & outward
      const angle = Math.atan2(sPos[j3 + 1] - 0.45, sPos[j3]) + (Math.random() - 0.5) * 0.6;
      const speed = 4.0 + Math.random() * 8.5;
      sVel[j3] = Math.cos(angle) * speed;
      sVel[j3 + 1] = Math.sin(angle) * speed;
      sVel[j3 + 2] = 6.0 + Math.random() * 12.0; // Accelerate toward camera

      if (isLeft) {
        sCol[j3] = 1.0;
        sCol[j3 + 1] = 1.0;
        sCol[j3 + 2] = 1.0;
      } else {
        sCol[j3] = 0.98;
        sCol[j3 + 1] = 0.08;
        sCol[j3 + 2] = 0.22;
      }
    }

    sGeom.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
    sGeom.setAttribute("color", new THREE.BufferAttribute(sCol, 3));

    const sMat = new THREE.PointsMaterial({
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const shatterMesh = new THREE.Points(sGeom, sMat);
    scene.add(shatterMesh);

    threeStateRef.current = {
      scene,
      camera,
      renderer,
      butterflyGroup,
      leftWingPivot,
      rightWingPivot,
      particlesMesh,
      shatterMesh,
      pointLightCrimson,
      pointLightSilver,
      ambientLight,
    };

    // ── Animation Loop ──
    let startTime = performance.now();

    const renderLoop = (time: number) => {
      const elapsed = (time - startTime) * 0.001;
      const p = phase;

      // 1. Butterfly Assembly Scaling
      if (p >= 2) {
        butterflyGroup.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.05);
      }

      // 2. Wing Flap Motion (Slow organic breathing crystal flex)
      if (p >= 2) {
        const flapCycle = Math.sin(elapsed * 2.2) * 0.32 + Math.cos(elapsed * 1.1) * 0.12;
        leftWingPivot.rotation.y = flapCycle;
        rightWingPivot.rotation.y = -flapCycle;
        butterflyGroup.position.y = 0.45 + Math.sin(elapsed * 1.5) * 0.08;
      }

      // 3. Dynamic Lighting Activation
      if (p >= 1) {
        pointLightSilver.intensity = THREE.MathUtils.lerp(pointLightSilver.intensity, 4.2, 0.04);
        pointLightCrimson.intensity = THREE.MathUtils.lerp(pointLightCrimson.intensity, 6.8, 0.04);
      }

      // 4. Parallax Response from Mouse
      const targetRotX = -springY.get() * 0.25;
      const targetRotY = springX.get() * 0.35;
      butterflyGroup.rotation.x = THREE.MathUtils.lerp(butterflyGroup.rotation.x, targetRotX, 0.06);
      butterflyGroup.rotation.y = THREE.MathUtils.lerp(butterflyGroup.rotation.y, targetRotY, 0.06);

      // 5. Environmental Particles Convergence
      const posAttr = pGeom.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        if (p === 0) {
          // Subtle drifting
          posArr[i3 + 1] += Math.sin(elapsed + i) * 0.002;
        } else if (p === 1) {
          // Converging toward butterfly
          posArr[i3] += (pTarget[i3] - posArr[i3]) * pSpeed[i];
          posArr[i3 + 1] += (pTarget[i3 + 1] - posArr[i3 + 1]) * pSpeed[i];
          posArr[i3 + 2] += (pTarget[i3 + 2] - posArr[i3 + 2]) * pSpeed[i];
        } else {
          // Orbiting & Shedding from wings
          const orbitAngle = elapsed * 0.6 + i * 0.02;
          posArr[i3] = pTarget[i3] + Math.cos(orbitAngle) * (0.15 + (i % 5) * 0.06);
          posArr[i3 + 1] = pTarget[i3 + 1] + Math.sin(orbitAngle) * (0.15 + (i % 5) * 0.06);
          posArr[i3 + 2] = pTarget[i3 + 2] + Math.sin(elapsed * 2.0 + i) * 0.08;
        }
      }
      posAttr.needsUpdate = true;

      // 6. Launch Shatter Hyperspace Motion
      if (isLaunching) {
        sMat.opacity = Math.min(1.0, sMat.opacity + 0.1);
        butterflyGroup.scale.multiplyScalar(0.92); // butterfly collapses as it shatters
        const sPosAttr = sGeom.attributes.position as THREE.BufferAttribute;
        const sArr = sPosAttr.array as Float32Array;

        for (let j = 0; j < SHATTER_COUNT; j++) {
          const j3 = j * 3;
          sArr[j3] += sVel[j3] * 0.04;
          sArr[j3 + 1] += sVel[j3 + 1] * 0.04;
          sArr[j3 + 2] += sVel[j3 + 2] * 0.04;
        }
        sPosAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    // ── Responsive Resize ──
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mounted, phase, isLaunching, springX, springY]);

  // ─────────────────────────────────────────────────────────────
  // 4. MOUSE MOVEMENT CONTROLLER
  // ─────────────────────────────────────────────────────────────
  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window === "undefined") return;
    const { innerWidth, innerHeight } = window;
    mouseX.set((e.clientX / innerWidth) - 0.5);
    mouseY.set((e.clientY / innerHeight) - 0.5);
  };

  // ─────────────────────────────────────────────────────────────
  // 5. LAUNCH TRIGGER HANDLER
  // Sequence: Compress -> Energy Surge -> Shatter Flash -> Push to /
  // ─────────────────────────────────────────────────────────────
  const handleLaunchClick = useCallback(() => {
    if (isLaunching) return;
    setIsLaunching(true);

    try {
      playLaunchIgnitionSound();
    } catch {
      // Audio autoplay fallback
    }

    // Telemetry Progress & Hyperspace Warp
    let p = 0;
    const progressInterval = setInterval(() => {
      p += 3;
      setWarpProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
          // Client side navigation directly to the existing homepage
          router.push("/");
        }, 400);
      }
    }, 28);
  }, [isLaunching, router]);

  if (!mounted) return null;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-screen h-screen min-h-[100dvh] bg-[#020202] text-white select-none overflow-hidden flex flex-col justify-between"
      style={{
        perspective: "1200px",
      }}
    >
      {/* ─────────────────────────────────────────────────────────
          1. 3D WEBGL BUTTERFLY & CRYSTALLINE CANVAS
          ───────────────────────────────────────────────────────── */}
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* ─────────────────────────────────────────────────────────
          2. ATMOSPHERIC VOLUMETRIC GRADIENTS & SCANLINES
          ───────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 45%, rgba(235, 0, 40, 0.16) 0%, transparent 60%),
            radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(235, 0, 40, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, rgba(2,2,2,0.7) 0%, rgba(2,2,2,0.2) 50%, rgba(2,2,2,0.85) 100%)
          `,
        }}
      />

      {/* Subtle HUD Telemetry Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-15 z-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="launchGrid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="0.5" />
              <circle cx="64" cy="64" r="0.8" fill="rgba(235, 0, 40, 0.8)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#launchGrid)" />
        </svg>
      </div>

      {/* ─────────────────────────────────────────────────────────
          3. CRIMSON ENERGY PULSE WAVE (Phase 3 Trigger)
          ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {phase >= 3 && !isLaunching && (
          <motion.div
            initial={{ scale: 0.1, opacity: 0.9 }}
            animate={{ scale: [0.1, 4.5], opacity: [0.9, 0] }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border-2 border-[#EB0028] shadow-[0_0_120px_#EB0028] pointer-events-none z-15"
          />
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────
          4. TOP MINIMAL METADATA BADGE (NO NAVBAR)
          ───────────────────────────────────────────────────────── */}
      <header className="relative z-30 w-full px-6 sm:px-12 pt-6 sm:pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#EB0028] animate-pulse" />
          <span className="text-[10px] sm:text-xs font-mono tracking-[0.25em] text-white/50 uppercase">
            PORTAL_STATE // READY
          </span>
        </div>

        <div className="text-[10px] sm:text-xs font-mono tracking-widest text-white/40">
          NOV 04, 2026
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────
          5. MAIN CENTER STAGE: BRAND HIERARCHY & LAUNCH CONTROL
          ───────────────────────────────────────────────────────── */}
      <main className="relative z-30 flex flex-col items-center justify-end sm:justify-center px-4 mb-10 sm:my-auto text-center">
        
        {/* BRAND HIERARCHY REVEAL (Phase 4) */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center space-y-2 mb-8 sm:mb-12 mt-auto sm:mt-0"
            >
              {/* TEDx KLH Hierarchy */}
              <div className="flex items-baseline justify-center tracking-tight leading-none drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
                {/* Official TEDx with smaller lowercase 'x' */}
                <span
                  className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
                >
                  TED
                </span>
                <span
                  className="text-3xl sm:text-5xl md:text-6xl font-black text-[#EB0028] ml-0.5"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 900 }}
                >
                  x
                </span>
                <span
                  className="text-4xl sm:text-6xl md:text-7xl font-light text-white/95 ml-3 sm:ml-4"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                >
                  KLH
                </span>
              </div>

              {/* BOWRAMPET Secondary Subtitle */}
              <div
                className="text-[11px] sm:text-sm font-semibold tracking-[0.45em] text-white/70 uppercase pl-1.5"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                BOWRAMPET
              </div>

              {/* METAMORPHOSIS Theme Line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35, duration: 0.8 }}
                className="pt-3 sm:pt-4 flex items-center gap-2 text-xs sm:text-sm text-[#EB0028] font-bold tracking-[0.3em] uppercase font-mono"
              >
                <span>METAMORPHOSIS</span>
                <span className="text-white/30">·</span>
                <span className="text-white/60 font-medium tracking-[0.2em] hidden sm:inline">
                  THE UNSEEN PROCESS OF BECOMING
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── THE FUTURISTIC LAUNCH CONTROL BUTTON ── */}
        <AnimatePresence>
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="relative group flex items-center justify-center"
            >
              {/* Outer Radiant Glow Aura */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-[#EB0028]/25 via-white/10 to-[#EB0028]/25 blur-xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none" />

              {/* Central Capsule Button */}
              <motion.button
                onClick={handleLaunchClick}
                onMouseEnter={() => {
                  try {
                    playHoverTickSound();
                  } catch {}
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.96, y: 1 }}
                disabled={isLaunching}
                className="relative px-10 sm:px-14 py-4 sm:py-5 rounded-full overflow-hidden flex items-center justify-center cursor-pointer border border-[#EB0028]/50 bg-black/60 backdrop-blur-xl shadow-[0_0_35px_rgba(235,0,40,0.45)] group-hover:shadow-[0_0_60px_rgba(235,0,40,0.85)] group-hover:border-[#EB0028] transition-all duration-300"
              >
                {/* Thin Perimeter Traveling Laser Light */}
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(235,0,40,0.8)_20%,transparent_40%,rgba(255,255,255,0.7)_50%,transparent_70%)] opacity-40 group-hover:opacity-80 pointer-events-none"
                />

                {/* Internal Dark Shield */}
                <div className="absolute inset-[1.5px] rounded-full bg-[#070709]/85 backdrop-blur-md pointer-events-none" />

                {/* Button Content */}
                <div className="relative z-10 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#EB0028] group-hover:scale-125 transition-transform" />
                  <span
                    className="text-base sm:text-lg font-bold tracking-[0.3em] uppercase text-white group-hover:text-white"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                  >
                    {isLaunching ? "INITIALIZING..." : "LAUNCH"}
                  </span>
                </div>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ─────────────────────────────────────────────────────────
          6. BOTTOM MINIMAL HUD COORDINATES
          ───────────────────────────────────────────────────────── */}
      <footer className="relative z-30 w-full px-6 sm:px-12 pb-6 sm:pb-8 flex items-center justify-between text-[10px] font-mono text-white/35">
        <div>17.5623° N · 78.3846° E</div>
        <div>COHORT // 100 SEATS</div>
      </footer>

      {/* ─────────────────────────────────────────────────────────
          7. FULLSCREEN HYPERSPACE SHATTER FLASH (On Launch Click)
          ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isLaunching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl"
          >
            {/* Blinding Radial Flash */}
            <motion.div
              initial={{ scale: 0.2, opacity: 1 }}
              animate={{ scale: 8, opacity: [1, 0.8, 0] }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute w-[300px] h-[300px] rounded-full bg-radial from-white via-[#EB0028] to-transparent blur-2xl"
            />

            {/* Expanding Warp Shockwave */}
            <motion.div
              initial={{ scale: 0.1, opacity: 1 }}
              animate={{ scale: 7, opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-[320px] h-[320px] rounded-full border-4 border-[#EB0028] shadow-[0_0_140px_#EB0028]"
            />

            {/* Telemetry Progress */}
            <div className="relative z-20 text-center space-y-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                className="w-14 h-14 rounded-full border-4 border-t-[#EB0028] border-r-transparent border-b-white border-l-transparent mx-auto"
              />
              <div
                className="text-2xl sm:text-3xl font-extrabold text-white tracking-[0.25em] uppercase"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
              >
                ENTERING <span className="text-[#EB0028]">METAMORPHOSIS</span>
              </div>
              <div className="text-xs font-mono text-[#EB0028] tracking-widest font-bold">
                {warpProgress}%
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
