"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is TEDxKLH 2026: METAMORPHOSIS?",
    answer: "TEDxKLH is a local, independently organized event operated under official license from TED. Our 2026 theme, METAMORPHOSIS: The Unseen Process of Becoming, explores structural transformations across cognitive computing, synthetic biology, planetary engineering, human consciousness, and design.",
  },
  {
    question: "When and where is the conference taking place?",
    answer: "The conference takes place as an all-day immersive experience at the KLH Auditorium & Pavilion, Bowrampet Campus, Hyderabad. Selected delegates gain full access to keynotes, interactive pavilion installations, breakout networking lounges, and curated dining.",
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
      className="relative w-full py-28 px-5 sm:px-8 md:px-12 select-none overflow-hidden border-t border-white/[0.04]"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1200px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container */}
      <div className="w-full max-w-[1400px] mx-auto space-y-16 relative z-20">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span 
                className="text-xs text-[#EB0028] tracking-[0.25em] uppercase font-medium"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                CHAPTER 08 // INQUIRIES &amp; PROTOCOLS
              </span>
              <span className="h-px w-8 bg-[#EB0028]/40" />
            </div>
            <h2 
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight uppercase leading-[1.15]" 
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              FREQUENTLY <span className="text-[#EB0028]">ASKED</span>
            </h2>
          </div>
          <p 
            className="text-sm text-white/60 font-normal max-w-md leading-relaxed" 
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            Key insights regarding attendee curation, pass issuance, event logistics, and conference access protocols.
          </p>
        </div>

        {/* Full-Width Accordion Cards */}
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`p-6 sm:p-7 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isOpen
                    ? "border-[#EB0028]/40 bg-white/[0.03] shadow-[0_10px_30px_rgba(235,0,40,0.12)]"
                    : "border-white/10 bg-black/40 hover:border-white/20 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="flex items-center gap-4">
                    <span 
                      className="text-xs text-[#EB0028]/80 font-medium"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      0{index + 1}
                    </span>
                    <h3
                      className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
                        isOpen ? "text-[#EB0028]" : "text-white"
                      }`}
                      style={{ fontFamily: "var(--font-sora)", fontWeight: 650 }}
                    >
                      {item.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? "border-[#EB0028] bg-[#EB0028]/20 text-[#EB0028]" : "border-white/10 text-white/40"
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
                      transition={{ duration: 0.3 }}
                      className="pt-4 pl-8 text-sm text-white/70 font-normal leading-relaxed border-t border-white/5 mt-4"
                      style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
                    >
                      {item.answer}
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
