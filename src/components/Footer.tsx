"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Mail, MapPin } from "lucide-react";
import Magnetic from "./Magnetic";

const NAV_LINKS = [
  { name: "Home",     href: "/#hero" },
  { name: "Launch",   href: "/launch" },
  { name: "About",    href: "/#about" },
  { name: "Theme",    href: "/#theme" },
  { name: "Speakers", href: "/#speakers" },
  { name: "Venue",    href: "/#venue" },
  { name: "Team",     href: "/#team" },
  { name: "Partners", href: "/#partners" },
  { name: "FAQ",      href: "/#faq" },
  { name: "Apply Pass", href: "/apply" },
  { name: "Track Status", href: "/application-status" },
  { name: "Admin Portal", href: "/admin/login" },
];

const SOCIAL_LINKS = [
  {
    label: "Twitter / X",
    href: "https://twitter.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2] stroke-linecap-round stroke-linejoin-round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M23.498 6.163c-.272-1.216-1.14-2.197-2.314-2.482-2.043-.48-10.184-.48-10.184-.48s-8.14 0-10.184.48c-1.175.285-2.043 1.266-2.314 2.482-.48 2.07-.48 6.376-.48 6.376s0 4.308.48 6.38c.272 1.214 1.14 2.196 2.314 2.48 2.043.48 10.184.48 10.184.48s8.14 0 10.184-.48c1.175-.283 2.043-1.265 2.314-2.48.48-2.072.48-6.38.48-6.38s0-4.306-.48-6.376zm-14.162 9.534v-7.396l6.634 3.7l-6.634 3.696z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative w-full border-t border-white/10 bg-black/95 backdrop-blur-2xl pt-[clamp(3.5rem,6vw,6rem)] pb-[clamp(2.5rem,4vw,4rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden">
      
      {/* Top glowing accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/50 to-transparent" />

      {/* Main Container */}
      <div className="w-full max-w-[1400px] mx-auto space-y-[clamp(2.5rem,4vw,4rem)] relative z-20">
        
        {/* 4 Grid Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[clamp(1.5rem,3vw,2.5rem)]">
          
          {/* Column 1: Logo & Mission & Official License */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Link href="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
                <Image
                  src="/logo-white.png"
                  alt="TEDx KLH"
                  width={150}
                  height={42}
                  className="h-7 sm:h-8 w-auto object-contain brightness-105"
                />
              </Link>
            </div>
            <p 
              className="text-xs text-white/70 font-normal leading-relaxed" 
              style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
            >
              A local, independently organized TED event committed to sharing breakthrough ideas in technology, science, and design.
            </p>
            <p 
              className="text-[11px] text-[#EB0028] font-semibold uppercase tracking-wider leading-relaxed"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              This independent TEDx event is operated under license from TED.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-3 sm:space-y-4">
            <h4 
              className="text-xs tracking-[0.2em] text-[#EB0028] uppercase font-semibold"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              NAVIGATION
            </h4>
            <ul className="grid grid-cols-2 gap-2">
              {NAV_LINKS.map(item => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs font-semibold text-white/70 hover:text-[#EB0028] transition-colors duration-200 block py-0.5"
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Headquarters & Contact */}
          <div className="space-y-3 sm:space-y-4">
            <h4 
              className="text-xs tracking-[0.2em] text-[#EB0028] uppercase font-semibold"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              COORDINATES
            </h4>
            
            <div className="space-y-2.5 text-xs text-white/70" style={{ fontFamily: "var(--font-manrope)" }}>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EB0028] shrink-0 mt-0.5" />
                <span>KLH University, Bowrampet Campus, Hyderabad, Telangana 500043</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#EB0028] shrink-0" />
                <a 
                  href="mailto:tedxklhbowrampet@klh.edu.in" 
                  className="hover:text-white transition-colors"
                >
                  tedxklhbowrampet@klh.edu.in
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 flex items-center gap-3">
              {SOCIAL_LINKS.map((soc) => (
                <a
                  key={soc.label}
                  href={soc.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/60 hover:text-[#EB0028] hover:border-[#EB0028]/40 transition-colors"
                  aria-label={soc.label}
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 4: Return to Top Control */}
          <div className="space-y-4 flex flex-col justify-between sm:items-start lg:items-end">
            <div className="space-y-2 text-left lg:text-right">
              <span 
                className="text-[10px] uppercase tracking-[0.25em] text-white/40 block font-mono"
              >
                EXPERIENCE PROTOCOL
              </span>
              <div className="text-xs text-white/70 font-mono">
                NOV 04, 2026 • HYDERABAD
              </div>
            </div>

            <div className="pt-3">
              <Magnetic range={40} strength={0.3}>
                <button
                  onClick={handleScrollToTop}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:border-[#EB0028] hover:bg-[#EB0028]/10 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white transition-all duration-300 cursor-pointer shadow-lg"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  <span>RETURN TO APEX</span>
                  <ArrowUp className="w-3.5 h-3.5 text-[#EB0028]" />
                </button>
              </Magnetic>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & TED Legal Disclaimer */}
        <div className="pt-6 sm:pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] sm:text-[11px] text-white/40 font-mono text-center sm:text-left">
          <p>© {new Date().getFullYear()} TEDxKLH. All rights reserved. Independently organized under TED license.</p>
          <p className="text-[#EB0028]/70">METAMORPHOSIS • 2026</p>
        </div>

      </div>
    </footer>
  );
}
