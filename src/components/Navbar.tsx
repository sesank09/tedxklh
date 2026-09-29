"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Magnetic from "./Magnetic";

const NAV_ITEMS = [
  { name: "Home",     href: "#hero",     id: "hero" },
  { name: "About",    href: "#about",    id: "about" },
  { name: "Theme",    href: "#theme",    id: "theme" },
  { name: "Speakers", href: "#speakers", id: "speakers" },
  { name: "Venue",    href: "#venue",    id: "venue" },
  { name: "Team",     href: "#team",     id: "team" },
  { name: "Partners", href: "#partners", id: "partners" },
  { name: "FAQ",      href: "#faq",      id: "faq" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastY = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
    if (y > lastY.current + 8 && y > 120 && !mobileMenuOpen) setVisible(false);
    else if (y < lastY.current - 4) setVisible(true);
    lastY.current = y;
  });

  // Intelligent Scroll-Spy using IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const observerCallback: IntersectionObserverCallback = (entries) => {
      // Find the most visible intersecting section
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
        // Pick the one with highest intersection ratio or top position
        visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        setActive(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "-20% 0px -45% 0px",
      threshold: [0.1, 0.25, 0.5, 0.75],
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (e: React.MouseEvent, href: string, id: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActive(id);
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
            {/* Centered Floating Glass Pill */}
            <div
              className="pointer-events-auto w-full max-w-[1400px] h-[64px] sm:h-[72px] flex items-center justify-between px-4 sm:px-8 rounded-full relative overflow-hidden transition-all duration-300"
              style={{
                background: scrolled ? "rgba(4, 4, 4, 0.94)" : "rgba(6, 6, 6, 0.75)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                boxShadow: scrolled
                  ? "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(235,0,40,0.12)"
                  : "0 10px 30px rgba(0,0,0,0.35)",
              }}
            >
              {/* Top ambient sheen line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/40 to-transparent" />

              {/* Official TEDx KLH Logo */}
              <Magnetic range={40} strength={0.2}>
                <a
                  href="#hero"
                  onClick={(e) => scrollTo(e, "#hero", "hero")}
                  className="flex items-center group cursor-pointer shrink-0 py-1"
                >
                  <Image
                    src="/logo-white.png"
                    alt="TEDx KLH"
                    width={200}
                    height={56}
                    className="h-8 sm:h-10 md:h-11 w-auto object-contain brightness-110 group-hover:opacity-90 transition-all duration-300 drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]"
                    priority
                  />
                </a>
              </Magnetic>

              {/* Desktop Navigation Links with Intelligent Scroll Spy */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = active === item.id;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={(e) => scrollTo(e, item.href, item.id)}
                      className="relative px-3.5 xl:px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap group"
                    >
                      {/* Active Crimson Pill Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeNavPill"
                          className="absolute inset-0 rounded-full bg-[#EB0028]/[0.12] border border-[#EB0028]/40 shadow-[0_0_16px_rgba(235,0,40,0.25)]"
                          transition={{ type: "spring", stiffness: 450, damping: 35 }}
                        />
                      )}

                      <span
                        className="relative z-10 text-[12px] xl:text-[13px] font-semibold uppercase tracking-wider transition-colors duration-250"
                        style={{
                          color: isActive ? "#EB0028" : "rgba(255,255,255,0.72)",
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
                    onClick={(e) => scrollTo(e, "#register", "register")}
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

      {/* Mobile Drawer Navigation with Active Section Highlight */}
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
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollTo(e, item.href, item.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? "bg-[#EB0028]/15 text-[#EB0028] border border-[#EB0028]/30"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                >
                  <span>{item.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#EB0028] shadow-[0_0_8px_#EB0028]" />}
                </a>
              );
            })}
            <a
              href="#register"
              onClick={(e) => scrollTo(e, "#register", "register")}
              className="mt-3 text-center py-3 rounded-xl bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#ff1a3d] transition-colors"
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
