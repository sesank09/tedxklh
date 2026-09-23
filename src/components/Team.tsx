"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, ArrowUpRight } from "lucide-react";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: "Leadership" | "Curation" | "Production" | "Design" | "Operations";
  bio: string;
  image?: string;
  initials: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
  accent: "red" | "white" | "ruby";
}

const DEPARTMENTS = [
  "All",
  "Leadership",
  "Curation",
  "Production",
  "Design",
  "Operations",
] as const;

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "aarav-sharma",
    name: "Aarav Sharma",
    role: "Lead Organizer & Licensee",
    department: "Leadership",
    bio: "Guiding the architectural vision, global TED compliance, and overarching strategic curation for TEDxKLH 2026.",
    initials: "AS",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "aarav@tedxklh.edu.in",
    accent: "ruby",
  },
  {
    id: "ananya-verma",
    name: "Ananya Verma",
    role: "Co-Organizer & Executive Director",
    department: "Leadership",
    bio: "Directing event execution, strategic partnerships, multi-vertical coordination, and administrative leadership.",
    initials: "AV",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "ananya@tedxklh.edu.in",
    accent: "red",
  },
  {
    id: "dr-vikramaditya-rao",
    name: "Dr. Vikramaditya Rao",
    role: "Head of Speaker Curation",
    department: "Curation",
    bio: "Curating breakthrough scientific narratives, quantum pioneers, and interdisciplinary keynote speakers.",
    initials: "VR",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "curation@tedxklh.edu.in",
    accent: "white",
  },
  {
    id: "rhea-sen",
    name: "Rhea Sen",
    role: "Creative Director & Visual Lead",
    department: "Design",
    bio: "Crafting the visual identity, 3D Metamorphosis aesthetics, spatial stage design, and attendee brand journey.",
    initials: "RS",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "creative@tedxklh.edu.in",
    accent: "ruby",
  },
  {
    id: "karthik-nair",
    name: "Karthik Nair",
    role: "Technical & Production Director",
    department: "Production",
    bio: "Orchestrating stage engineering, lighting architecture, multi-camera spatial broadcasting, and live acoustics.",
    initials: "KN",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "tech@tedxklh.edu.in",
    accent: "red",
  },
  {
    id: "meera-iyer",
    name: "Meera Iyer",
    role: "Head of Marketing & Outreach",
    department: "Operations",
    bio: "Managing digital campaigns, community outreach, press relations, and delegate engagement programs.",
    initials: "MI",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "marketing@tedxklh.edu.in",
    accent: "white",
  },
  {
    id: "rohan-deshmukh",
    name: "Rohan Deshmukh",
    role: "Web Systems & Digital Experience Lead",
    department: "Production",
    bio: "Engineering real-time interactive 3D WebGL portals, registration infrastructures, and attendee digital passes.",
    initials: "RD",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "web@tedxklh.edu.in",
    accent: "ruby",
  },
  {
    id: "sneha-kulkarni",
    name: "Sneha Kulkarni",
    role: "Head of Sponsorships & Logistics",
    department: "Operations",
    bio: "Driving institutional sponsorship, brand alignments, VIP delegate hospitality, and ground venue management.",
    initials: "SK",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "sponsorship@tedxklh.edu.in",
    accent: "red",
  },
];

export default function Team() {
  const [activeDept, setActiveDept] = useState<typeof DEPARTMENTS[number]>("All");

  const filteredMembers = activeDept === "All"
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter((m) => m.department === activeDept);

  return (
    <section 
      id="team" 
      className="relative w-full py-28 sm:py-36 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.07),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container */}
      <div className="w-full max-w-[1440px] mx-auto space-y-16 sm:space-y-20 relative z-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase shadow-[0_0_15px_rgba(235,0,40,0.2)]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            ORGANIZING COMMITTEE · TEDxKLH 2026
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight"
            style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
          >
            THE MINDS BEHIND <span className="text-[#EB0028] text-glow">METAMORPHOSIS</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-white/70 font-light max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            A collective of curators, engineers, designers, and orchestrators bridging multidisciplinary sparks to shape an unforgettable transformation.
          </motion.p>
        </div>

        {/* Department Filter Tabs (Mobile Scrollable) */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0 gap-2 sm:gap-3 scrollbar-none">
          {DEPARTMENTS.map((dept) => {
            const isActive = activeDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-[#EB0028] border-[#EB0028] text-white shadow-[0_0_20px_rgba(235,0,40,0.4)]"
                    : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/[0.06]"
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>

        {/* Team Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="group relative rounded-[28px] sm:rounded-[32px] border border-white/10 bg-black/60 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden hover:border-[#EB0028]/50 hover:bg-black/80 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
              >
                {/* Top Subtle Sheen Line */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EB0028]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Upper Content: Image / Avatar + Department Tag */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-widest uppercase text-[#EB0028] px-3 py-1 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10">
                      {member.department}
                    </span>

                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/30 group-hover:text-[#EB0028] group-hover:border-[#EB0028]/40 transition-colors">
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Styled Avatar Portrait Container */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-white/10 to-black/80 border border-white/10 group-hover:border-[#EB0028]/40 transition-all flex items-center justify-center shadow-inner">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center gap-2 p-4 text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/20 group-hover:border-[#EB0028] flex items-center justify-center bg-black/60 shadow-[0_0_25px_rgba(235,0,40,0.15)] group-hover:shadow-[0_0_30px_rgba(235,0,40,0.35)] transition-all">
                          <span 
                            className="text-xl sm:text-2xl font-black text-white group-hover:text-[#EB0028] transition-colors tracking-wider"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                          >
                            {member.initials}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest pt-1">
                          TEAM METAMORPHOSIS
                        </span>
                      </div>
                    )}

                    {/* Gradient bottom overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                  </div>

                  {/* Name and Designation */}
                  <div className="space-y-1.5">
                    <h3 
                      className="text-xl sm:text-2xl font-black text-white group-hover:text-glow transition-all"
                      style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
                    >
                      {member.name}
                    </h3>
                    <p 
                      className="text-xs font-semibold text-[#EB0028] uppercase tracking-wider leading-snug"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {member.role}
                    </p>
                    <p 
                      className="text-xs text-white/60 font-light leading-relaxed pt-1"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {member.bio}
                    </p>
                  </div>
                </div>

                {/* Footer Social Actions */}
                <div className="pt-5 mt-5 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40 tracking-wider">
                    TEDxKLH 2026
                  </span>

                  <div className="flex items-center gap-2">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-[#EB0028]/20 hover:border-[#EB0028]/50 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-7 h-7 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-[#EB0028]/20 hover:border-[#EB0028]/50 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                        aria-label={`${member.name} Twitter`}
                      >
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="w-7 h-7 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-[#EB0028]/20 hover:border-[#EB0028]/50 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                        aria-label={`${member.name} Email`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
