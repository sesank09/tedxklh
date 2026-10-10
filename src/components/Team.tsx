"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";

const DEPARTMENTS = [
  "All",
  "Board Members",
  "Leadership",
  "Technical Team",
  "Production",
  "Curation",
  "Operations & Logistics",
  "Design",
  "Registration",
  "Social Media",
  "Hospitality",
  "Documentation",
] as const;

interface TeamMember {
  id: string;
  name?: string;
  role: string;
  designation?: string;
  department: Exclude<typeof DEPARTMENTS[number], "All">;
  code: string;
  image?: string;
  imagePosition?: string;
  imageScale?: number;
  hideInAll?: boolean;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "lead-president",
    name: "Er. Koneru Satyanarayana",
    role: "President",
    designation: "Koneru Lakshmaiah Education Foundation",
    department: "Board Members",
    code: "DIR-01",
    image: "/team/er-koneru-satyanarayana.jpg",
  },
  {
    id: "lead-vp-havish",
    name: "Er. Koneru Lakshman Havish",
    role: "Vice-President",
    designation: "Koneru Lakshmaiah Education Foundation",
    department: "Board Members",
    code: "DIR-02",
    image: "/team/er-koneru-lakshman-havish.jpg",
  },
  {
    id: "lead-vp-hareen",
    name: "Er. Koneru Raja Hareen",
    role: "Vice-President",
    designation: "Koneru Lakshmaiah Education Foundation",
    department: "Board Members",
    code: "DIR-03",
    image: "/team/er-koneru-raja-hareen.jpg",
  },
  {
    id: "lead-vp-nikhila",
    name: "Ms. Koneru Nikhila",
    role: "Vice President",
    designation: "Koneru Lakshmaiah Education Foundation",
    department: "Board Members",
    code: "DIR-04",
    image: "/team/ms-koneru-nikhila.png",
  },
  {
    id: "lead-sec-kanchanalatha",
    name: "Smt. Koneru Sivakanchanalatha",
    role: "Secretary",
    designation: "Koneru Lakshmaiah Education Foundation",
    department: "Board Members",
    code: "DIR-05",
    image: "/team/smt-koneru-sivakanchanalatha.png",
  },
  {
    id: "lead-pro-chancellor",
    name: "Dr. K.S. Jagannatha Rao",
    role: "Pro Chancellor",
    designation: "Koneru Lakshmaiah Education Foundation",
    department: "Board Members",
    code: "DIR-06",
    image: "/team/dr-ks-jagannatha-rao.png",
  },
  {
    id: "lead-vc",
    name: "Dr. G. Pardha Saradhi Varma",
    role: "Vice Chancellor",
    designation: "KL Deemed to be University",
    department: "Board Members",
    code: "DIR-07",
    image: "/team/dr-g-pardha-saradhi-varma.png",
  },
  {
    id: "lead-pvc-rajasekhara",
    name: "Dr. K. Rajasekhara Rao",
    role: "Pro-Vice Chancellor",
    designation: "Koneru Lakshmaiah Education Foundation",
    department: "Board Members",
    code: "DIR-08",
    image: "/team/dr-k-rajasekhara-rao.png",
  },
  {
    id: "lead-pvc-venkatram",
    name: "Dr. N. Venkatram",
    role: "Pro-Vice Chancellor",
    designation: "Koneru Lakshmaiah Education Foundation",
    department: "Board Members",
    code: "DIR-09",
    image: "/team/dr-n-venkatram.png",
  },
  {
    id: "lead-principal",
    name: "Dr. L Koteswara Rao",
    role: "Principal",
    designation: "KLH University Bowrampet",
    department: "Leadership",
    code: "DIR-10",
    image: "/team/dr-l-koteswara-rao.png",
  },
  {
    id: "lead-curator",
    name: "Dr. V. Muniraju Naidu",
    role: "TEDx Curator",
    designation: "Associate Professor, CSE",
    department: "Leadership",
    code: "DIR-11",
    image: "/team/dr-v-muniraju-naidu.png",
  },
  {
    id: "lead-hod-cse",
    name: "Dr. P Venkateshwara Rao",
    role: "Associate Professor & HOD, CSE",
    designation: "KLH University Bowrampet",
    department: "Leadership",
    code: "DIR-12",
    image: "/team/dr-p-venkateshwara-rao.png",
  },
  {
    id: "lead-licensee-aashish",
    name: "Mr. Bobba Thambi Aashish",
    role: "Licensee & Sponsorships",
    designation: "KLH University Bowrampet",
    department: "Leadership",
    code: "DIR-13",
    image: "/team/mr-bobba-thambi-aashish.png",
  },
  {
    id: "tech-sesank",
    name: "Yennam Sesank Reddy",
    role: "Technical Lead",
    designation: "KLH University Bowrampet",
    department: "Technical Team",
    code: "TEC-01",
    image: "/team/yennam-sesank-reddy.jpg",
    imagePosition: "center 38%",
  },
  {
    id: "tech-nishanth",
    name: "Babbula Nishanth",
    role: "Technical Lead",
    designation: "KLH University Bowrampet",
    department: "Technical Team",
    code: "TEC-02",
    image: "/team/babbula-nishanth.png",
    imagePosition: "center 38%",
  },
  {
    id: "prod-balaji",
    name: "Mr. Ummaneni Balaji",
    role: "Production Head",
    designation: "KLH University Bowrampet",
    department: "Production",
    code: "PRD-01",
    image: "/team/mr-ummaneni-balaji.jpg",
    imagePosition: "center 42%",
    imageScale: 1.1,
  },
  {
    id: "prod-mukesh",
    name: "Mr. Allari Mukesh Kumar",
    role: "Production Co-Head",
    designation: "KLH University Bowrampet",
    department: "Production",
    code: "PRD-02",
    image: "/team/mr-allari-mukesh-kumar.jpg",
    imagePosition: "center 24%",
  },
  {
    id: "curation-sophie",
    name: "Sophie Blessing M",
    role: "Curation & Speakers Lead",
    designation: "KLH University Bowrampet",
    department: "Curation",
    code: "CUR-01",
    image: "/team/sophie-blessing-m.jpg",
  },
  {
    id: "curation-rohan",
    name: "Rohan Joshi",
    role: "Speaker Curation",
    designation: "KLH University Bowrampet",
    department: "Curation",
    code: "CUR-02",
    image: "/team/rohan-joshi.jpg",
    imagePosition: "center 25%",
    hideInAll: true,
  },
  {
    id: "ops-srijaya",
    name: "Srijaya Chakradhar Chilakapati",
    role: "Operations & Logistics Lead",
    designation: "KLH University Bowrampet",
    department: "Operations & Logistics",
    code: "OPS-01",
    image: "/team/srijaya-chakradhar-chilakapati.jpg",
  },
  {
    id: "ops-mahati",
    name: "Naramsetty Mahati",
    role: "Operations & Logistics Lead",
    designation: "KLH University Bowrampet",
    department: "Operations & Logistics",
    code: "OPS-02",
    image: "/team/naramsetty-mahati.jpg",
    imagePosition: "center 28%",
  },
  {
    id: "design-ragu",
    name: "Ragu Nandan",
    role: "Design Head",
    designation: "KLH University Bowrampet",
    department: "Design",
    code: "DSN-01",
    image: "/team/ragu-nandan.jpg",
    imagePosition: "center 28%",
  },
  {
    id: "reg-sameer",
    name: "Sameer Farhad",
    role: "Registration Lead",
    designation: "KLH University Bowrampet",
    department: "Registration",
    code: "REG-01",
    image: "/team/sameer-farhad.jpg",
  },
  {
    id: "hosp-dharani",
    name: "Bhimi Reddy Dharani",
    role: "Hospitality Lead",
    designation: "KLH University Bowrampet",
    department: "Hospitality",
    code: "HOS-01",
    image: "/team/dharani.png",
    imagePosition: "center 42%",
  },
  {
    id: "social-sahasra",
    name: "Sahasra Kuncha",
    role: "Social Media Lead",
    designation: "KLH University Bowrampet",
    department: "Social Media",
    code: "SOC-01",
    image: "/team/sahasra.png",
    imagePosition: "center 32%",
    imageScale: 1.15,
  },
  {
    id: "doc-nyshitha",
    name: "Sai Nyshitha Thammareddy",
    role: "Documentation Lead",
    designation: "KLH University Bowrampet",
    department: "Documentation",
    code: "DOC-01",
    image: "/team/nyshitha.png",
    imagePosition: "center 30%",
    imageScale: 1.15,
  },
  {
    id: "doc-aneesha",
    name: "Aneesha Kandi",
    role: "Documentation",
    designation: "KLH University Bowrampet",
    department: "Documentation",
    code: "DOC-02",
    image: "/team/aneesha-kandi.jpg",
    imagePosition: "center 25%",
    hideInAll: true,
  },
  {
    id: "doc-chaitra",
    name: "Chaitra",
    role: "Documentation",
    designation: "KLH University Bowrampet",
    department: "Documentation",
    code: "DOC-03",
    image: "/team/chaitra.jpg",
    imagePosition: "center 28%",
    hideInAll: true,
  },
  {
    id: "doc-ishitha",
    name: "Ishitha Lankapalli",
    role: "Documentation",
    designation: "KLH University Bowrampet",
    department: "Documentation",
    code: "DOC-04",
    image: "/team/ishitha-lankapalli.jpg",
    imagePosition: "center 30%",
    hideInAll: true,
  },
  {
    id: "doc-raga-padmini",
    name: "V. Raga Padmini",
    role: "Documentation",
    designation: "KLH University Bowrampet",
    department: "Documentation",
    code: "DOC-05",
    image: "/team/v-raga-padmini.jpg",
    imagePosition: "center 20%",
    hideInAll: true,
  },
];

const CRYSTAL_POINTS = "62,6 104,26 122,70 108,114 66,130 22,110 4,66 18,22";

function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const rawX = useMotionValue(0); const rawY = useMotionValue(0);
  const xSpring = useSpring(rawX, { stiffness: 350, damping: 35 });
  const ySpring = useSpring(rawY, { stiffness: 350, damping: 35 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || prefersReducedMotion) return;
    const r = cardRef.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }, [rawX, rawY, prefersReducedMotion]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false); rawX.set(0); rawY.set(0);
  }, [rawX, rawY]);

  const fx = isHovered && !prefersReducedMotion;

  return (
    <motion.div ref={cardRef}
      initial={{ opacity: 0, scale: 0.88, y: 28 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.34, 1.4, 0.64, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={prefersReducedMotion ? {} : { rotateX, rotateY, transformStyle: "preserve-3d", perspective: "800px", zIndex: fx ? 10 : 1 }}
      className="relative cursor-pointer select-none"
    >
      {/* Animated border */}
      <div className="absolute overflow-hidden rounded-[21px] pointer-events-none" style={{ inset: "-1px", zIndex: 0 }}>
        <motion.div className="absolute"
          style={{ width: "200%", height: "200%", top: "-50%", left: "-50%",
            background: fx
              ? "conic-gradient(from 0deg,transparent 0%,transparent 68%,rgba(235,0,40,.1) 76%,rgba(235,0,40,.5) 82%,#EB0028 86%,rgba(235,0,40,.4) 91%,transparent 100%)"
              : "conic-gradient(from 0deg,transparent 0%,transparent 90%,rgba(235,0,40,.18) 95%,transparent 100%)",
            transition: "background .5s ease" }}
          animate={{ rotate: [0, 360] }} transition={{ duration: fx ? 4 : 14, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        />
      </div>

      {/* Background shell */}
      <div className="absolute overflow-hidden pointer-events-none"
        style={{ inset: "1px", borderRadius: "19px",
          background: fx ? "linear-gradient(148deg,rgba(235,0,40,.07) 0%,#060606 40%,#080808 100%)" : "linear-gradient(148deg,rgba(255,255,255,.025) 0%,#070707 50%,#060606 100%)",
          transition: "background .5s ease", zIndex: 1 }}>
        <div style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)", width: "75%", height: "65%",
          background: "radial-gradient(circle,rgba(235,0,40,.2) 0%,transparent 70%)", opacity: fx ? 1 : 0, transition: "opacity .5s ease" }} />
        <svg viewBox="0 0 200 260" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice" style={{ opacity: 0.055, pointerEvents: "none" }}>
          <line x1="0" y1="80" x2="200" y2="80" stroke="white" strokeWidth=".5" />
          <line x1="0" y1="160" x2="200" y2="160" stroke="white" strokeWidth=".5" />
          <line x1="100" y1="0" x2="100" y2="260" stroke="white" strokeWidth=".5" />
          <circle cx="100" cy="80" r="60" stroke="rgba(235,0,40,.6)" fill="none" strokeWidth=".5" />
        </svg>
        <motion.div className="absolute top-0 bottom-0"
          style={{ width: "55%", left: 0, background: "linear-gradient(110deg,transparent 25%,rgba(255,255,255,.04) 50%,transparent 70%)" }}
          initial={{ x: "-100%" }} animate={{ x: fx ? "200%" : "-100%" }} transition={fx ? { duration: 0.75, ease: "easeInOut" } : { duration: 0 }}
        />
      </div>

      {/* Content */}
      <div className="relative flex flex-col justify-between" style={{ minHeight: "clamp(290px,36vw,335px)", zIndex: 10 }}>
        <div className="flex-grow flex items-end justify-center px-4 sm:px-5 pt-4 sm:pt-5" style={{ overflow: "visible" }}>
          <motion.div className="relative" style={{ width: "100%", maxWidth: "140px", zIndex: 20 }}
            animate={{ y: fx ? -8 : 0, scale: fx ? 1.05 : 1 }} transition={{ type: "spring", stiffness: 280, damping: 24 }}>

            {/* Rotating crystalline frame */}
            <motion.svg viewBox="0 0 136 136" className="absolute pointer-events-none"
              style={{ inset: "-14px", width: "calc(100% + 28px)", height: "calc(100% + 28px)", zIndex: 25, opacity: fx ? 1 : 0, transition: "opacity .4s ease" }}>
              <motion.polygon points={CRYSTAL_POINTS} fill="none" stroke="rgba(235,0,40,.75)" strokeWidth="1" strokeDasharray="5 4"
                animate={{ rotate: fx ? [0, 360] : 0 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "68px 68px" }} />
              <motion.polygon points={CRYSTAL_POINTS} fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="0.5"
                animate={{ rotate: fx ? [0, -360] : 0 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "68px 68px" }} />
            </motion.svg>

            {/* Portrait */}
            <div className="relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden"
              style={{ background: fx ? "radial-gradient(circle at center,rgba(235,0,40,.14) 0%,rgba(10,10,10,.96) 70%)" : "linear-gradient(148deg,rgba(255,255,255,.03) 0%,rgba(10,10,10,.96) 100%)",
                border: `1px solid ${fx ? "rgba(235,0,40,.38)" : "rgba(255,255,255,.06)"}`,
                boxShadow: fx ? "0 12px 40px rgba(235,0,40,.28),0 0 0 1px rgba(235,0,40,.1)" : "0 8px 20px rgba(0,0,0,.6)",
                transition: "all .4s ease" }}>
              {member.image ? (
                <>
                  <img
                    src={member.image}
                    alt={member.name || member.role}
                    className="w-full h-full object-cover transition-transform duration-500"
                    style={{
                      objectPosition: member.imagePosition || "center top",
                      transform: member.imageScale ? `scale(${member.imageScale})` : undefined,
                      filter: fx ? "brightness(1.08) contrast(1.05)" : "brightness(0.92) saturate(0.95)",
                      transition: "filter .4s ease, transform .4s ease",
                    }}
                  />
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: fx ? "inset 0 0 24px rgba(235,0,40,.35)" : "inset 0 0 15px rgba(0,0,0,.6)", transition: "box-shadow .4s ease" }} />
                </>
              ) : (
                <>
                  <Users style={{ width: 24, height: 24, color: fx ? "#EB0028" : "rgba(255,255,255,.2)", transition: "color .35s ease" }} />
                  <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase",
                    color: fx ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.2)", transition: "color .35s ease" }}>PHOTO</span>
                  <div className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: fx ? "inset 0 0 28px rgba(235,0,40,.32)" : "none", transition: "box-shadow .4s ease" }} />
                </>
              )}
            </div>
          </motion.div>
        </div>

        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-3 space-y-1.5 text-center">
          <div className="flex items-center justify-center gap-2">
            <span style={{ display: "inline-block", fontFamily: "var(--font-dm-mono)", fontSize: "8px", letterSpacing: "0.22em",
              textTransform: "uppercase", fontWeight: 600, color: "#EB0028", background: "rgba(235,0,40,.1)",
              border: "1px solid rgba(235,0,40,.22)", padding: "2px 7px", borderRadius: 5 }}>{member.department}</span>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "8px", color: "rgba(255,255,255,.25)", letterSpacing: "0.1em" }}>{member.code}</span>
          </div>

          {member.name && (
            <motion.h4
              animate={{ color: fx ? "#FFFFFF" : "rgba(255,255,255,0.95)" }}
              style={{
                fontFamily: "var(--font-sora)",
                fontWeight: 700,
                fontSize: "0.92rem",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              {member.name}
            </motion.h4>
          )}

          <motion.p animate={{ opacity: fx ? 1 : 0.85, y: fx ? 0 : 2 }} transition={{ duration: 0.3 }}
            style={{ fontFamily: "var(--font-sora)", fontWeight: 600, fontSize: "0.78rem", color: fx ? "#EB0028" : "rgba(255,255,255,.85)",
              textTransform: "uppercase", letterSpacing: "-0.01em", lineHeight: 1.3 }}>{member.role}</motion.p>

          {member.designation && (
            <p
              style={{
                fontFamily: "var(--font-manrope)",
                fontWeight: 500,
                fontSize: "0.70rem",
                color: "rgba(255,255,255,0.55)",
                lineHeight: 1.2,
              }}
            >
              {member.designation}
            </p>
          )}
          
          <div className="flex justify-center">
            <motion.div animate={{ width: fx ? 36 : 12, opacity: fx ? 1 : 0.3 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: 1.5, background: "#EB0028", borderRadius: 1 }} />
          </div>
          <div style={{ paddingTop: 6, borderTop: "1px solid rgba(255,255,255,.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-dm-mono)", fontSize: "8px", color: "rgba(255,255,255,.25)", letterSpacing: "0.12em" }}>TEDxKLH 2026</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Team() {
  const [selectedDept, setSelectedDept] = useState<typeof DEPARTMENTS[number]>("All");

  const filtered = selectedDept === "All"
    ? TEAM_MEMBERS.filter(m => !m.hideInAll)
    : TEAM_MEMBERS.filter(m => m.department === selectedDept);

  return (
    <section id="team" className="relative w-full py-[clamp(3.5rem,7vw,8.5rem)] px-[clamp(1rem,4vw,3.5rem)] select-none overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(235,0,40,.25),transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(235,0,40,.15),transparent)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1300px]"
          style={{ height: 600, background: "radial-gradient(ellipse at center,rgba(235,0,40,.06) 0%,transparent 70%)" }} />
      </div>

      <div className="w-full max-w-[1400px] mx-auto space-y-[clamp(2.5rem,5vw,4.5rem)] relative z-20">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-center sm:text-left">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.05 }}
            className="text-[clamp(2.1rem,5.5vw,4.5rem)] font-extrabold text-white tracking-tight uppercase leading-[1.05]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}>
            Organizing<br /><span className="text-[#EB0028]">Committee</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.12 }}
            className="text-sm sm:text-base text-white/70 font-normal max-w-xl leading-relaxed mx-auto sm:mx-0" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
            The dedicated team of student organizers, curators, and technologists bringing TEDxKLH 2026 to life.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer min-h-[36px] flex items-center ${
                selectedDept === dept
                  ? "bg-[#EB0028] text-white shadow-[0_0_15px_rgba(235,0,40,0.4)]"
                  : "bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]"
              }`}
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[clamp(1rem,2vw,1.5rem)]">
          {filtered.map((member, idx) => (
            <TeamCard key={member.id} member={member} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
