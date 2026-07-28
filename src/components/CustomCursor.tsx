"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");

  // Base raw mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Progressive springs creating natural inertia offset lag
  const s1X = useSpring(mouseX, { stiffness: 450, damping: 30, mass: 0.15 });
  const s1Y = useSpring(mouseY, { stiffness: 450, damping: 30, mass: 0.15 });

  const s2X = useSpring(mouseX, { stiffness: 350, damping: 28, mass: 0.3 });
  const s2Y = useSpring(mouseY, { stiffness: 350, damping: 28, mass: 0.3 });

  const s3X = useSpring(mouseX, { stiffness: 250, damping: 26, mass: 0.5 });
  const s3Y = useSpring(mouseY, { stiffness: 250, damping: 26, mass: 0.5 });

  const s4X = useSpring(mouseX, { stiffness: 180, damping: 24, mass: 0.7 });
  const s4Y = useSpring(mouseY, { stiffness: 180, damping: 24, mass: 0.7 });

  const s5X = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.9 });
  const s5Y = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.9 });

  // The final largest outer ring
  const sOuterX = useSpring(mouseX, { stiffness: 85, damping: 18, mass: 1.1 });
  const sOuterY = useSpring(mouseY, { stiffness: 85, damping: 18, mass: 1.1 });

  useEffect(() => {
    // Check for touch device compatibility
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      if (target) {
        const interactive = target.closest("a, button, [role='button'], input, textarea, [data-cursor-magnetic], .interactive-card");
        setIsHovered(!!interactive);
        
        if (target.closest(".speaker-card")) {
          setCursorText("TILT");
        } else if (target.closest(".faq-card")) {
          setCursorText("OPEN");
        } else {
          setCursorText("");
        }
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
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
      {/* Precision Core Lead Dot */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[99999]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />

      {/* Trailing Node 1 */}
      <motion.div
        className="fixed top-0 left-0 w-3 h-3 bg-primary/70 rounded-full pointer-events-none z-[99998] blur-[1px]"
        style={{
          x: s1X,
          y: s1Y,
          translateX: "-50%",
          translateY: "-50%",
          scale: 0.85
        }}
      />

      {/* Trailing Node 2 */}
      <motion.div
        className="fixed top-0 left-0 w-3.5 h-3.5 bg-primary/50 rounded-full pointer-events-none z-[99997] blur-[1.5px]"
        style={{
          x: s2X,
          y: s2Y,
          translateX: "-50%",
          translateY: "-50%",
          scale: 0.7
        }}
      />

      {/* Trailing Node 3 */}
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-primary/30 rounded-full pointer-events-none z-[99996] blur-[2px]"
        style={{
          x: s3X,
          y: s3Y,
          translateX: "-50%",
          translateY: "-50%",
          scale: 0.55
        }}
      />

      {/* Trailing Node 4 */}
      <motion.div
        className="fixed top-0 left-0 w-4.5 h-4.5 bg-primary/15 rounded-full pointer-events-none z-[99995] blur-[2.5px]"
        style={{
          x: s4X,
          y: s4Y,
          translateX: "-50%",
          translateY: "-50%",
          scale: 0.4
        }}
      />

      {/* Trailing Node 5 */}
      <motion.div
        className="fixed top-0 left-0 w-5 h-5 bg-primary/5 rounded-full pointer-events-none z-[99994] blur-[3px]"
        style={{
          x: s5X,
          y: s5Y,
          translateX: "-50%",
          translateY: "-50%",
          scale: 0.25
        }}
      />

      {/* Outer Glowing Magnetic Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[99993] border border-primary/35 flex items-center justify-center text-[9px] font-bold tracking-widest text-white uppercase mix-blend-screen"
        animate={{
          width: isHovered ? 76 : 36,
          height: isHovered ? 76 : 36,
          backgroundColor: isHovered ? "rgba(235, 0, 40, 0.16)" : "rgba(0, 0, 0, 0)",
          borderColor: isHovered ? "#FF2E54" : "rgba(235, 0, 40, 0.35)",
          boxShadow: isHovered ? "0 0 25px rgba(235, 0, 40, 0.5)" : "0 0 0px rgba(0,0,0,0)",
        }}
        style={{
          x: sOuterX,
          y: sOuterY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.4 }}
      >
        {cursorText && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="text-glow font-syne"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}
