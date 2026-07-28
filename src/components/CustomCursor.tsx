"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Fast, responsive spring tracking for instantaneous response
  const springX = useSpring(mouseX, { stiffness: 450, damping: 28, mass: 0.2 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 28, mass: 0.2 });

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
        } else if (target.closest("a[href='#register']")) {
          setCursorText("JOIN");
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
      {/* Ultra-Bright Theme Laser Reticle Scope */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99999] border-2 border-[#EB0028] flex items-center justify-center mix-blend-screen overflow-hidden"
        animate={{
          width: isHovered ? 72 : 36,
          height: isHovered ? 72 : 36,
          backgroundColor: isHovered ? "rgba(235, 0, 40, 0.18)" : "rgba(235, 0, 40, 0.04)",
          borderColor: isHovered ? "#FF2E54" : "#EB0028",
          boxShadow: isHovered
            ? "0 0 35px rgba(235, 0, 40, 0.8), inset 0 0 15px rgba(235, 0, 40, 0.4)"
            : "0 0 18px rgba(235, 0, 40, 0.5), inset 0 0 8px rgba(235, 0, 40, 0.2)",
          rotate: isHovered ? 90 : 0,
        }}
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          willChange: "transform, width, height",
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28, mass: 0.2 }}
      >
        {/* 4 Corner Laser Crosshairs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1.5px] h-2 bg-[#EB0028] shadow-[0_0_6px_#EB0028]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] h-2 bg-[#EB0028] shadow-[0_0_6px_#EB0028]" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[1.5px] w-2 bg-[#EB0028] shadow-[0_0_6px_#EB0028]" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[1.5px] w-2 bg-[#EB0028] shadow-[0_0_6px_#EB0028]" />

        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-glow font-mono text-[10px] font-bold text-white tracking-widest uppercase relative z-10 drop-shadow-[0_0_10px_#EB0028]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
