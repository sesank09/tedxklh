"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSpeakerCard, setIsSpeakerCard] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast, smooth spring physics
  const springX = useSpring(mouseX, { stiffness: 600, damping: 35, mass: 0.15 });
  const springY = useSpring(mouseY, { stiffness: 600, damping: 35, mass: 0.15 });

  useEffect(() => {
    // Disable completely on touch devices
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target) {
        const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-interactive]");
        const speaker = target.closest(".speaker-card, [data-speaker-card]");
        
        setIsHovered(!!interactive);
        setIsSpeakerCard(!!speaker);
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Subtle Premium Custom Cursor */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] mix-blend-difference"
        animate={{
          width: isSpeakerCard ? 28 : isHovered ? 24 : 8,
          height: isSpeakerCard ? 28 : isHovered ? 24 : 8,
          backgroundColor: isSpeakerCard
            ? "rgba(235, 0, 40, 0.9)"
            : isHovered
            ? "rgba(255, 255, 255, 0.9)"
            : "#ffffff",
          boxShadow: isSpeakerCard
            ? "0 0 20px rgba(235, 0, 40, 0.8), 0 0 10px rgba(235, 0, 40, 0.5)"
            : isHovered
            ? "0 0 12px rgba(255, 255, 255, 0.6)"
            : "none",
        }}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.15 }}
      />
    </>
  );
}
