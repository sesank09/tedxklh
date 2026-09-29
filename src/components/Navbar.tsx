"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  const pathname = usePathname();
  const router = useRouter();

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 30);
    if (y > lastY.current + 8 && y > 140 && !mobileMenuOpen) setVisible(false);
    else if (y < lastY.current - 4) setVisible(true);
    lastY.current = y;
  });

  // Intelligent Scroll-Spy using IntersectionObserver (only on homepage)
  useEffect(() => {
    if (pathname !== "/") return;

    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const observerCallback: IntersectionObserverCallback = (entries) => {
      const visibleEntries = entries.filter((e) => e.isIntersecting);
      if (visibleEntries.length > 0) {
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
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, href: string, id: string) => {
    if (pathname === "/") {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActive(id);
        setMobileMenuOpen(false);
      }
    } else {
      setMobileMenuOpen(false);
      router.push(`/${href}`);
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActive("hero");
    }
  };

  const isApplyPage = pathname === "/apply";

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
            className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 sm:px-6 pointer-events-none"
          >
            {/* Centered Floating Glass Pill with True 3-Column Grid */}
            <div
              className="pointer-events-auto w-full max-w-[1440px] h-[76px] sm:h-[84px] lg:h-[102px] grid grid-cols-2 lg:grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-6 lg:px-10 rounded-full relative overflow-hidden transition-all duration-300"
              style={{
                background: scrolled ? "rgba(4, 4, 4, 0.95)" : "rgba(6, 6, 6, 0.85)",
                backdropFilter: "blur(28px)",
                WebkitBackdropFilter: "blur(28px)",
                border: "1px solid rgba(255, 255, 255, 0.09)",
                boxShadow: scrolled
                  ? "0 24px 60px rgba(0,0,0,0.85), 0 0 35px rgba(235,0,40,0.14)"
                  : "0 12px 35px rgba(0,0,0,0.4)",
              }}
            >
              {/* Top ambient sheen line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/50 to-transparent pointer-events-none" />

              {/* COLUMN 1 (LEFT): Official TEDx KLH Logo (180–200px desktop, 125–150px mobile) */}
              <div className="flex items-center justify-start">
                <Magnetic range={40} strength={0.2}>
                  <Link
                    href="/"
                    onClick={handleLogoClick}
                    className="flex items-center group cursor-pointer shrink-0 py-1"
                  >
                    <Image
                      src="/logo-white.png"
                      alt="TEDx KLH"
                      width={220}
                      height={68}
                      className="h-9 sm:h-11 lg:h-[58px] w-auto max-w-[140px] sm:max-w-[170px] lg:max-w-[200px] object-contain brightness-110 group-hover:opacity-90 transition-all duration-300 drop-shadow-[0_2px_14px_rgba(255,255,255,0.12)]"
                      priority
                    />
                  </Link>
                </Magnetic>
              </div>

              {/* COLUMN 2 (CENTER): Mathematically Centered Navigation Links */}
              <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = !isApplyPage && active === item.id;
                  return (
                    <a
                      key={item.name}
                      href={pathname === "/" ? item.href : `/${item.href}`}
                      onClick={(e) => handleNavClick(e, item.href, item.id)}
                      className="relative px-3 xl:px-4 py-2 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap group"
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
                        className="relative z-10 text-[12px] xl:text-[13px] uppercase tracking-wider transition-colors duration-200"
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

              {/* COLUMN 3 (RIGHT): Apply CTA Button + Mobile Menu Toggle */}
              <div className="flex items-center justify-end gap-3">
                <Magnetic range={45} strength={0.25}>
                  <Link
                    href="/apply"
                    className={`relative h-[42px] sm:h-[46px] lg:h-[50px] px-5 sm:px-6 lg:px-7 rounded-full font-bold text-[11px] sm:text-xs lg:text-[13px] tracking-[0.14em] uppercase text-white flex items-center justify-center overflow-hidden group cursor-pointer shrink-0 shadow-[0_4px_24px_rgba(235,0,40,0.4)] hover:shadow-[0_8px_36px_rgba(235,0,40,0.65)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 whitespace-nowrap ${
                      isApplyPage ? "ring-2 ring-white/40 shadow-[0_0_25px_rgba(235,0,40,0.6)]" : ""
                    }`}
                    style={{
                      background: "linear-gradient(135deg, #EB0028 0%, #FF454A 100%)",
                      fontFamily: "var(--font-sora)",
                      fontWeight: 700,
                    }}
                  >
                    {/* Animated Light Sheen on Hover */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                    
                    <span className="relative z-10 hidden xl:inline">APPLY FOR DELEGATE PASS</span>
                    <span className="relative z-10 xl:hidden">APPLY</span>
                  </Link>
                </Magnetic>

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:text-[#EB0028] transition-colors focus:outline-none"
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
            style={{ background: "rgba(8, 8, 8, 0.97)" }}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = !isApplyPage && active === item.id;
              return (
                <a
                  key={item.name}
                  href={pathname === "/" ? item.href : `/${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href, item.id)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-between ${
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
            
            <Link
              href="/apply"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-3 text-center py-3.5 rounded-xl bg-[#EB0028] text-white font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-[#ff1a3d] transition-colors"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              Apply for Delegate Pass
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

