"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Magnetic from "./Magnetic";

const NAV_ITEMS = [
  { name: "Home",     href: "#hero" },
  { name: "About",    href: "#about" },
  { name: "Theme",    href: "#theme" },
  { name: "Speakers", href: "#speakers" },
  { name: "Schedule", href: "#schedule" },
  { name: "Venue",    href: "#venue" },
  { name: "Team",     href: "#team" },
  { name: "Partners", href: "#partners" },
  { name: "FAQ",      href: "#faq" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("#hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
    if (y > lastY.current + 8 && y > 120 && !mobileMenuOpen) setVisible(false);
    else if (y < lastY.current - 4) setVisible(true);
    lastY.current = y;
  });

  const scrollTo = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActive(href);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.header
            key="nav"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-4 sm:top-6 left-0 right-0 z-50 flex justify-center px-3 sm:px-8 pointer-events-none"
          >
            {/* Centered Floating Pill */}
            <div
              className="pointer-events-auto w-full max-w-[1400px] h-[64px] sm:h-[72px] flex items-center justify-between px-4 sm:px-8 rounded-full relative overflow-hidden transition-all duration-300"
              style={{
                background: scrolled ? "rgba(4, 4, 4, 0.92)" : "rgba(4, 4, 4, 0.65)",
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

              {/* Official TEDx KLH Logo */}
              <Magnetic range={40} strength={0.2}>
                <a
                  href="#hero"
                  onClick={e => scrollTo(e, "#hero")}
                  className="flex items-center group cursor-pointer shrink-0 py-1"
                >
                  <Image
                    src="/logo-white.png"
                    alt="TEDx KLH"
                    width={130}
                    height={36}
                    className="h-6 sm:h-7 w-auto object-contain brightness-105 group-hover:opacity-90 transition-opacity"
                    priority
                  />
                </a>
              </Magnetic>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
                {NAV_ITEMS.map(item => {
                  const isActive = active === item.href;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={e => scrollTo(e, item.href)}
                      className="relative group px-2.5 xl:px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap"
                      style={{
                        background: isActive ? "rgba(235,0,40,0.08)" : "transparent",
                      }}
                    >
                      <span
                        className="text-[12px] xl:text-[13px] font-semibold uppercase tracking-wider transition-colors"
                        style={{
                          color: isActive ? "#EB0028" : "rgba(255,255,255,0.75)",
                          fontFamily: "var(--font-sora)",
                          fontWeight: 600,
                        }}
                      >
                        {item.name}
                      </span>
                    </a>
                  );
                })}
              </nav>

              {/* Action Buttons: Desktop CTA + Mobile Menu Toggle */}
              <div className="flex items-center gap-3 shrink-0">
                <Magnetic range={45} strength={0.25}>
                  <a
                    href="#register"
                    onClick={e => scrollTo(e, "#register")}
                    className="relative h-[38px] sm:h-[42px] px-5 sm:px-6 rounded-full font-bold text-[11px] sm:text-xs tracking-[0.15em] uppercase text-white flex items-center justify-center overflow-hidden group cursor-pointer shrink-0 shadow-[0_4px_24px_rgba(235,0,40,0.4)] hover:shadow-[0_8px_32px_rgba(235,0,40,0.6)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 whitespace-nowrap"
                    style={{
                      background: "linear-gradient(135deg, #EB0028 0%, #FF5A5F 100%)",
                      fontFamily: "var(--font-sora)",
                      fontWeight: 700,
                    }}
                  >
                    APPLY PASS
                  </a>
                </Magnetic>

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white hover:text-[#EB0028] transition-colors focus:outline-none"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-24 left-4 right-4 z-40 lg:hidden p-6 rounded-3xl backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2"
            style={{ background: "rgba(8, 8, 8, 0.96)" }}
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => scrollTo(e, item.href)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wider text-white/80 hover:text-white hover:bg-[#EB0028]/10 transition-all"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
              >
                {item.name}
              </a>
            ))}
            <a
              href="#register"
              onClick={(e) => scrollTo(e, "#register")}
              className="mt-2 text-center py-3 rounded-xl bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest shadow-lg"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              Apply for Delegate Pass
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
