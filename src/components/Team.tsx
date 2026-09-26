"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = ["All", "Leadership", "Curation", "Production", "Design", "Operations"] as const;

interface TeamMember {
  id: string;
  role: string;
  department: typeof DEPARTMENTS[number];
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: "lead-01", role: "Lead Organizer & Licensee", department: "Leadership", initials: "01" },
  { id: "lead-02", role: "Co-Organizer & Executive Director", department: "Leadership", initials: "02" },
  { id: "curation-01", role: "Head of Speaker Curation", department: "Curation", initials: "03" },
  { id: "design-01", role: "Creative Director & Visual Lead", department: "Design", initials: "04" },
  { id: "prod-01", role: "Technical & Production Director", department: "Production", initials: "05" },
  { id: "ops-01", role: "Head of Marketing & Outreach", department: "Operations", initials: "06" },
  { id: "prod-02", role: "Web Systems & Digital Experience Lead", department: "Production", initials: "07" },
  { id: "ops-02", role: "Head of Sponsorships & Logistics", department: "Operations", initials: "08" },
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1440px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.05),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1440px] mx-auto space-y-16 relative z-20">
        
        {/* Chapter Header */}
        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <span 
              className="text-xs font-medium tracking-[0.25em] text-[#EB0028] uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              CHAPTER 06 // THE TEAM
            </span>
            <span className="h-px w-8 bg-[#EB0028]/40" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-[1.15]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
          >
            The Minds Behind<br />
            <span className="text-[#EB0028]">Metamorphosis</span>
          </motion.h2>
        </div>

        {/* Department Filter */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0 gap-2 scrollbar-none">
          {DEPARTMENTS.map((dept) => {
            const isActive = activeDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-[#EB0028] border-[#EB0028] text-white shadow-[0_0_15px_rgba(235,0,40,0.3)]"
                    : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:text-white hover:border-white/15"
                }`}
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {dept}
              </button>
            );
          })}
        </div>

        {/* Team Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch"
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
                className="group relative rounded-xl border border-white/[0.06] bg-white/[0.015] p-6 flex flex-col justify-between overflow-hidden hover:border-[#EB0028]/30 hover:bg-white/[0.025] hover:-translate-y-1 transition-all duration-400"
              >
                {/* Top sheen */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[10px] tracking-[0.2em] uppercase text-[#EB0028] font-medium"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      // {member.department}
                    </span>
                  </div>

                  {/* Avatar Placeholder */}
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-b from-white/[0.04] to-black/40 border border-white/[0.04] flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-14 h-14 rounded-full border border-white/10 group-hover:border-[#EB0028]/30 flex items-center justify-center bg-black/40 transition-colors">
                        <span 
                          className="text-lg font-bold text-white/30 group-hover:text-[#EB0028]/80 transition-colors"
                          style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                        >
                          {member.initials}
                        </span>
                      </div>
                      <span 
                        className="text-[9px] text-white/25 uppercase tracking-[0.2em]"
                        style={{ fontFamily: "var(--font-dm-mono)" }}
                      >
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-1">
                    <h3 
                      className="text-base font-bold text-white/40"
                      style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                    >
                      To Be Announced
                    </h3>
                    <p 
                      className="text-[11px] font-semibold text-[#EB0028]/80 uppercase tracking-wider leading-snug"
                      style={{ fontFamily: "var(--font-manrope)", fontWeight: 600 }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 mt-4 border-t border-white/[0.04] flex items-center justify-between">
                  <span 
                    className="text-[9px] text-white/30 tracking-[0.15em] uppercase"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    TEDxKLH 2026
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}
