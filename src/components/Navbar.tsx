"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Magnetic from "./Magnetic";

const NAV_ITEMS = [
  { name: "Home",     href: "#hero" },
  { name: "About",    href: "#about" },
  { name: "Theme",    href: "#theme" },
  { name: "Speakers", href: "#speakers" },
  { name: "Schedule", href: "#schedule" },
  { name: "Partners", href: "#partners" },
  { name: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#hero");
  const lastY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
    if (y > lastY.current + 8 && y > 120) setVisible(false);
    else if (y < lastY.current - 4) setVisible(true);
    lastY.current = y;
  });

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActive(href);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          key="nav"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 sm:px-8 pointer-events-none"
        >
          {/* Centered Floating Pill (h-[72px], max-w-[1400px], rounded-full) */}
          <div
            className="pointer-events-auto w-full max-w-[1400px] h-[72px] flex items-center justify-between px-6 sm:px-8 rounded-full relative overflow-hidden transition-all duration-300"
            style={{
              background: scrolled ? "rgba(4, 4, 4, 0.88)" : "rgba(4, 4, 4, 0.55)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: scrolled
                ? "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(235,0,40,0.12)"
                : "0 10px 30px rgba(0,0,0,0.35)",
            }}
          >
            {/* Top sheen line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/50 to-transparent" />

            {/* Logo Section */}
            <Magnetic range={50} strength={0.25}>
              <a
                href="#hero"
                onClick={e => scrollTo(e, "#hero")}
                className="flex items-baseline gap-0.5 group cursor-pointer shrink-0"
              >
                <span
                  className="text-xl font-black text-white group-hover:text-white/80 transition-colors tracking-tight"
                  style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 900 }}
                >
                  TED
                </span>
                <span
                  className="text-xl font-black text-[#EB0028] text-glow transition-all"
                  style={{ fontFamily: "'Satoshi', sans-serif", fontWeight: 900 }}
                >
                  x
                </span>
                <span
                  className="text-xs font-semibold text-white/60 group-hover:text-white transition-colors tracking-widest ml-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  KLH
                </span>
              </a>
            </Magnetic>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {NAV_ITEMS.map(item => {
                const isActive = active === item.href;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={e => scrollTo(e, item.href)}
                    className="relative group px-4 py-2 rounded-full transition-all duration-200 cursor-pointer"
                    style={{
                      background: isActive ? "rgba(235,0,40,0.08)" : "transparent",
                    }}
                  >
                    <span
                      className="text-[15px] font-semibold uppercase transition-colors"
                      style={{
                        color: isActive ? "#EB0028" : "rgba(255,255,255,0.7)",
                        fontFamily: "'Space Grotesk', sans-serif",
                        letterSpacing: "0.12em",
                        fontWeight: 600,
                      }}
                    >
                      {item.name}
                    </span>
                  </a>
                );
              })}
            </nav>

            {/* Primary CTA Button */}
            <Magnetic range={55} strength={0.3}>
              <a
                href="#register"
                onClick={e => scrollTo(e, "#register")}
                className="relative h-[48px] px-7 rounded-full font-bold text-xs tracking-[0.2em] uppercase text-white flex items-center justify-center overflow-hidden group cursor-pointer shrink-0 shadow-[0_4px_24px_rgba(235,0,40,0.45)] hover:shadow-[0_8px_32px_rgba(235,0,40,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #EB0028 0%, #FF5A5F 100%)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  fontSize: "15px",
                  letterSpacing: "0.1em",
                }}
              >
                REGISTER
              </a>
            </Magnetic>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
