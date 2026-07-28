"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactElement;
  range?: number; // How far the pull radius extends
  strength?: number; // How strongly it pulls (0 to 1)
}

export default function Magnetic({ children, range = 70, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Motion values for x/y position
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for a natural elastic elastic bounce
  const springConfig = { stiffness: 120, damping: 15, mass: 0.6 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const { clientX, clientY } = e;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      
      // Calculate center of element
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Distance from mouse to center
      const distX = clientX - centerX;
      const distY = clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < range) {
        setIsHovered(true);
        // Pull towards mouse
        x.set(distX * strength);
        y.set(distY * strength);
      } else {
        if (isHovered) {
          setIsHovered(false);
          x.set(0);
          y.set(0);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    ref.current?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ref.current?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovered, range, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
