"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is TEDxKLH 2026: METAMORPHOSIS?",
    answer: "TEDxKLH is a local, independently organized event operated under official license from TED. Our 2026 theme, METAMORPHOSIS: The Unseen Process of Becoming, explores structural transformations across cognitive computing, synthetic biology, planetary engineering, human consciousness, and design.",
  },
  {
    question: "When and where is the conference taking place?",
    answer: "The conference takes place on NOVEMBER 4, 2026 as an all-day immersive experience at the KLH Auditorium & Pavilion, Bowrampet Campus, Hyderabad. Selected delegates gain full access to keynotes, interactive pavilion installations, breakout networking lounges, and curated dining.",
  },
  {
    question: "How does the delegate curation and pass allocation work?",
    answer: "To ensure intimacy, intellectual depth, and high-value networking, TEDxKLH admits a cohort of 100 curated delegates. Applications are evaluated on candidate background, perspective, and alignment with the spirit of ideas worth spreading.",
  },
  {
    question: "What is the fee and payment verification process?",
    answer: "Once you submit your application and transfer the registration pass fee via UPI / Bank transfer, you submit your 12-digit UTR transaction reference and payment screenshot. Our finance desk verifies your payment within 24 hours and issues your encrypted digital entry pass.",
  },
  {
    question: "Will the talks be recorded and published globally?",
    answer: "Yes, every talk is filmed in 4K multi-angle cinema resolution and published to the official TEDx global YouTube channel (39M+ subscribers) and the official TED platform post-conference.",
  },
  {
    question: "Are there opportunities for corporate partnerships or speaker nominations?",
    answer: "We welcome forward-thinking organizations, labs, and research collectives to partner with us. You can submit partnership inquiries or speaker nominations via our official desk at tedx@klh.edu.in.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section 
      id="faq" 
      className="relative w-full py-28 sm:py-40 px-4 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[1200px] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-[1400px] mx-auto space-y-16 relative z-20">
        
        {/* Section Header */}
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
              CHAPTER 07 // INQUIRIES &amp; PROTOCOLS
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
            FREQUENTLY <br />
            <span className="text-[#EB0028]">ASKED</span>
          </motion.h2>

          <p 
            className="text-sm sm:text-base text-white/70 font-normal max-w-xl leading-relaxed" 
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            Essential guidance regarding attendee curation, pass allocation, venue logistics, and conference protocols.
          </p>
        </div>

        {/* Accordion Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-400 overflow-hidden cursor-pointer ${
                  isOpen
                    ? "border-[#EB0028]/50 bg-black/85 shadow-[0_15px_40px_rgba(235,0,40,0.15)]"
                    : "border-white/[0.08] bg-black/60 hover:border-white/20 hover:bg-black/75"
                } backdrop-blur-xl`}
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <span 
                      className="text-sm text-[#EB0028] font-bold"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      0{index + 1}
                    </span>
                    <h3
                      className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                        isOpen ? "text-white" : "text-white/85"
                      }`}
                      style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                    >
                      {item.question}
                    </h3>
                  </div>

                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen ? "border-[#EB0028] bg-[#EB0028] text-white shadow-[0_0_12px_rgba(235,0,40,0.5)]" : "border-white/10 text-white/50"
                  }`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      {/* Geometric Decorative Line */}
                      <div className="w-12 h-[2px] bg-[#EB0028]/60 mt-5 mb-4" />

                      <p 
                        className="text-sm sm:text-base text-white/70 font-normal leading-relaxed"
                        style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
                      >
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
