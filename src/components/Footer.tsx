"use client";

import { useState } from "react";
import { ArrowUp, Mail, MapPin, Send, Check } from "lucide-react";
import Magnetic from "./Magnetic";

const NAV_LINKS = [
  { name: "Home",     href: "#hero" },
  { name: "About",    href: "#about" },
  { name: "Theme",    href: "#theme" },
  { name: "Speakers", href: "#speakers" },
  { name: "Schedule", href: "#schedule" },
  { name: "Team",     href: "#team" },
  { name: "Partners", href: "#partners" },
  { name: "FAQ",      href: "#faq" },
];

const SOCIAL_LINKS = [
  {
    label: "Twitter",
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
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    label: "Youtube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
        <path d="M23.498 6.163c-.272-1.216-1.14-2.197-2.314-2.482-2.043-.48-10.184-.48-10.184-.48s-8.14 0-10.184.48c-1.175.285-2.043 1.266-2.314 2.482-.48 2.07-.48 6.376-.48 6.376s0 4.308.48 6.38c.272 1.214 1.14 2.196 2.314 2.48 2.043.48 10.184.48 10.184.48s8.14 0 10.184-.48c1.175-.283 2.043-1.265 2.314-2.48.48-2.072.48-6.38.48-6.38s0-4.306-.48-6.376zm-14.162 9.534v-7.396l6.634 3.7l-6.634 3.696z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer id="contact" className="relative w-full min-h-[350px] border-t border-white/10 bg-black/90 backdrop-blur-2xl pt-24 pb-16 px-6 sm:px-10 lg:px-[64px] select-none overflow-hidden">
      
      {/* Top glowing accent line matching max-w-[1440px] */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1440px] h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/60 to-transparent" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto space-y-16 relative z-20">
        
        {/* 4 Equally Spaced Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Column 1: Logo & Mission & License */}
          <div className="space-y-4">
            <h2 className="text-2xl font-black tracking-widest text-white" style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}>
              TED<span className="text-[#EB0028] text-glow font-extrabold">X</span>
              <span className="text-white/60 text-sm font-normal ml-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>KLH</span>
            </h2>
            <p className="text-xs text-white/60 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              A local, independently organized TED event committed to sharing breakthrough ideas in technology, science, and design.
            </p>
            <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-relaxed">
              This independent TEDx event is operated under license from TED.
            </p>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.2em] text-white/40 uppercase">
              Navigation
            </h4>
            <ul className="space-y-2">
              {NAV_LINKS.map(item => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-xs font-medium text-white/70 hover:text-[#EB0028] transition-colors duration-200"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact, Venue & Socials */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.2em] text-white/40 uppercase">
              Contact & Venue
            </h4>

            <div className="space-y-2.5 text-xs text-white/70 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#EB0028] shrink-0" />
                <a href="mailto:tedx@klh.edu.in" className="hover:text-white transition-colors">
                  tedx@klh.edu.in
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#EB0028] shrink-0 mt-0.5" />
                <span>KLH University, Bowrampet, Hyderabad 500043</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-1">
              {SOCIAL_LINKS.map((social, idx) => (
                <Magnetic key={idx} range={45} strength={0.28}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] hover:bg-[#EB0028]/15 hover:border-[#EB0028]/50 flex items-center justify-center text-white/60 hover:text-[#EB0028] hover:scale-110 transition-all duration-300 shadow-sm cursor-pointer"
                  >
                    {social.icon}
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono tracking-[0.2em] text-white/40 uppercase">
              Newsletter
            </h4>
            <p className="text-xs text-white/60 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
              Stay updated with speaker reveals, event schedules, and delegate announcements.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full h-[46px] pl-4 pr-12 rounded-xl border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-xs focus:outline-none focus:border-[#EB0028] transition-all"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="submit"
                  className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-[#EB0028] hover:bg-[#FF3D5A] text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  {subscribed ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </div>
              {subscribed && (
                <span className="text-[10px] font-mono text-[#EB0028]">
                  ✓ Subscribed successfully!
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Divider Line */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
          <p>© {new Date().getFullYear()} TEDxKLH. All rights reserved.</p>

          <Magnetic range={45} strength={0.28}>
            <button
              onClick={handleScrollToTop}
              aria-label="Back to top"
              className="w-11 h-11 rounded-full border border-white/10 bg-white/[0.03] hover:bg-[#EB0028]/20 hover:border-[#EB0028]/60 flex items-center justify-center text-white/70 hover:text-[#EB0028] transition-all duration-300 cursor-pointer shadow-md group"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </Magnetic>
        </div>

      </div>
    </footer>
  );
}
