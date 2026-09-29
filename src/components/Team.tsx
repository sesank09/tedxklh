"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Sparkles } from "lucide-react";

const DEPARTMENTS = ["All", "Leadership", "Curation", "Production", "Design", "Operations"] as const;

interface TeamMember {
  id: string;
  role: string;
  department: typeof DEPARTMENTS[number];
  code: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  { id: "lead-01", role: "Lead Organizer & Licensee", department: "Leadership", code: "DIR-01" },
  { id: "lead-02", role: "Co-Organizer & Executive Director", department: "Leadership", code: "DIR-02" },
  { id: "curation-01", role: "Head of Speaker Curation", department: "Curation", code: "CUR-01" },
  { id: "design-01", role: "Creative Director & Visual Lead", department: "Design", code: "DSN-01" },
  { id: "prod-01", role: "Technical & Production Director", department: "Production", code: "PRD-01" },
  { id: "ops-01", role: "Head of Marketing & Outreach", department: "Operations", code: "OPS-01" },
  { id: "prod-02", role: "Digital Experience & Systems Lead", department: "Production", code: "PRD-02" },
  { id: "ops-02", role: "Head of Logistics & Partnerships", department: "Operations", code: "OPS-02" },
];

export default function Team() {
  const [activeDept, setActiveDept] = useState<typeof DEPARTMENTS[number]>("All");

  const filteredMembers = activeDept === "All"
    ? TEAM_MEMBERS
    : TEAM_MEMBERS.filter((m) => m.department === activeDept);

  return (
    <section 
      id="team" 
      className="relative w-full py-28 sm:py-40 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1400px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.05),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-[1400px] mx-auto space-y-16 relative z-20">
        
        {/* Chapter Header */}
        <div className="max-w-4xl mx-auto space-y-6 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center sm:justify-start gap-3"
          >
            <span 
              className="text-xs font-medium tracking-[0.25em] text-[#EB0028] uppercase"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              CHAPTER 05 // THE ORGANIZERS
            </span>
            <span className="h-px w-8 bg-[#EB0028]/40" />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            The Minds Behind<br />
            <span className="text-[#EB0028]">Metamorphosis</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm sm:text-base text-white/70 font-normal max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            The dedicated team of student organizers, curators, and technologists bringing TEDxKLH 2026 to life.
          </motion.p>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0 gap-2 scrollbar-none">
          {DEPARTMENTS.map((dept) => {
            const isActive = activeDept === dept;
            return (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 border cursor-pointer ${
                  isActive
                    ? "bg-[#EB0028] border-[#EB0028] text-white shadow-[0_0_20px_rgba(235,0,40,0.4)] font-bold"
                    : "bg-white/[0.02] border-white/[0.08] text-white/50 hover:text-white hover:border-white/20"
                }`}
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                {dept}
              </button>
            );
          })}
        </div>

        {/* Team Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          <AnimatePresence mode="popLayout">
            {filteredMembers.map((member, idx) => (
              <motion.div
                key={member.id}
                layout
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 20 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="group relative rounded-3xl border border-white/[0.08] bg-black/60 backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden hover:border-[#EB0028]/50 hover:bg-black/85 hover:-translate-y-2 transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
              >
                {/* Top Sheen Line */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#EB0028]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[10px] tracking-[0.2em] uppercase text-[#EB0028] font-semibold bg-[#EB0028]/10 px-2.5 py-0.5 rounded border border-[#EB0028]/25"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {member.department}
                    </span>
                    <span 
                      className="text-[10px] tracking-[0.15em] text-white/30 font-mono"
                    >
                      {member.code}
                    </span>
                  </div>

                  {/* Team Portrait Area */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-b from-white/[0.03] to-black/60 border border-white/[0.06] flex items-center justify-center group-hover:border-[#EB0028]/30 transition-colors">
                    <div className="flex flex-col items-center justify-center gap-2.5">
                      <div className="w-14 h-14 rounded-2xl border border-white/10 group-hover:border-[#EB0028]/50 flex items-center justify-center bg-black/50 text-white/30 group-hover:text-[#EB0028] group-hover:scale-105 transition-all duration-400">
                        <Users className="w-6 h-6" />
                      </div>
                      <span 
                        className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium"
                        style={{ fontFamily: "var(--font-dm-mono)" }}
                      >
                        TEAM PHOTO
                      </span>
                    </div>

                    {/* Soft Crimson Edge Highlight on Hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-[inset_0_0_20px_rgba(235,0,40,0.25)]" />
                  </div>

                  {/* Role Info */}
                  <div className="space-y-1">
                    <h3 
                      className="text-base sm:text-lg font-bold text-white/50 group-hover:text-white transition-colors"
                      style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                    >
                      Member Profile
                    </h3>
                    <p 
                      className="text-xs font-semibold text-[#EB0028] uppercase tracking-wider leading-snug"
                      style={{ fontFamily: "var(--font-manrope)", fontWeight: 600 }}
                    >
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Footer Tag */}
                <div className="pt-4 mt-4 border-t border-white/[0.06] flex items-center justify-between text-[9px] text-white/30">
                  <span style={{ fontFamily: "var(--font-dm-mono)" }}>
                    TEDxKLH 2026
                  </span>
                  <span className="text-[#EB0028]/60 font-mono">
                    // CONFIRMED
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
