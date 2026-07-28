"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Optimized spring physics for smooth, responsive cursor tracking
  const springX = useSpring(mouseX, { stiffness: 400, damping: 28, mass: 0.2 });
  const springY = useSpring(mouseY, { stiffness: 400, damping: 28, mass: 0.2 });

  const outerX = useSpring(mouseX, { stiffness: 150, damping: 20, mass: 0.6 });
  const outerY = useSpring(mouseY, { stiffness: 150, damping: 20, mass: 0.6 });

  useEffect(() => {
    // Disable custom cursor on touch/mobile devices for lag-free native scrolling
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
      {/* Primary Dot Pointer */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-[#EB0028] rounded-full pointer-events-none z-[99999] shadow-[0_0_10px_#EB0028]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
      />

      {/* Smooth Trailing Glow Dot */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-[#EB0028]/40 rounded-full pointer-events-none z-[99998] blur-[1px]"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform",
        }}
      />

      {/* Outer Magnetic Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99993] border border-[#EB0028]/40 flex items-center justify-center text-[9px] font-bold tracking-widest text-white uppercase mix-blend-screen"
        animate={{
          width: isHovered ? 72 : 36,
          height: isHovered ? 72 : 36,
          backgroundColor: isHovered ? "rgba(235, 0, 40, 0.15)" : "rgba(0, 0, 0, 0)",
          borderColor: isHovered ? "#FF2E54" : "rgba(235, 0, 40, 0.4)",
          boxShadow: isHovered ? "0 0 25px rgba(235, 0, 40, 0.4)" : "0 0 0px transparent",
        }}
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform, width, height",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.4 }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-glow font-mono text-[9px] text-white"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
