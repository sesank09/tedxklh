"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const outerX = useSpring(mouseX, { stiffness: 220, damping: 24, mass: 0.4 });
  const outerY = useSpring(mouseY, { stiffness: 220, damping: 24, mass: 0.4 });

  useEffect(() => {
    // Disable custom cursor overlay on touch devices for native lag-free performance
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target) {
        const interactive = target.closest("a, button, [role='button'], input, textarea, select, [data-cursor-magnetic]");
        setIsHovered(!!interactive);

        if (target.closest(".speaker-card")) {
          setCursorText("VIEW");
        } else if (target.closest(".faq-card")) {
          setCursorText("OPEN");
        } else if (target.closest(".theme-card")) {
          setCursorText("EXPLORE");
        } else {
          setCursorText("");
        }
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
      {/* Clean Reticle Scope — Red dot removed per request */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99993] border border-[#EB0028]/30 flex items-center justify-center mix-blend-screen overflow-hidden"
        animate={{
          width: isHovered ? 68 : 32,
          height: isHovered ? 68 : 32,
          backgroundColor: isHovered ? "rgba(235, 0, 40, 0.12)" : "rgba(0, 0, 0, 0)",
          borderColor: isHovered ? "#FF2E54" : "rgba(235, 0, 40, 0.3)",
          boxShadow: isHovered ? "0 0 25px rgba(235, 0, 40, 0.35)" : "0 0 0px transparent",
          rotate: isHovered ? 90 : 0,
        }}
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform, width, height",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 26, mass: 0.3 }}
      >
        {/* Subtle corner ticks */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-[#EB0028]/60" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-1 bg-[#EB0028]/60" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1px] w-1 bg-[#EB0028]/60" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px] w-1 bg-[#EB0028]/60" />

        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-glow font-mono text-[9px] font-bold text-white tracking-widest uppercase relative z-10"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
