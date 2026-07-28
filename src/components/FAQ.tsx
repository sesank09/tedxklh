"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is TEDxKLH 2026?",
    answer: "TEDxKLH is a local, independently organized event operated under license from TED. Our mission is to build a high-fidelity platform bringing together visionary thinkers, developers, designers, and researchers to share ideas under our annual theme: BOUNDLESS.",
  },
  {
    question: "When and where is the event taking place?",
    answer: "The event is scheduled as a full-day conference experience at the KL University Hyderabad Campus. Attendees receive access to 12 keynote talks, networking mixers, interactive tech installations, and delegate dining lounges.",
  },
  {
    question: "How do I secure a registration ticket pass?",
    answer: "You can apply by filling out the application portal above. Because TEDxKLH maintains a strictly curated cohort of 100 attendees to maximize networking depth, applications are reviewed and approved in batches.",
  },
  {
    question: "Will the talks be recorded and published online?",
    answer: "Yes, all TEDxKLH talks are recorded in 4K resolution and will be uploaded to the official TEDx YouTube channel and the global TED website post-event.",
  },
  {
    question: "Are there sponsorship or speaker nomination openings?",
    answer: "We welcome partners who align with our vision of boundless discovery. You can apply to be an official partner or nominate a speaker by contacting our curation team at tedx@klh.edu.in.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section 
      id="faq" 
      className="relative w-full py-24 px-5 sm:px-8 md:px-12 select-none overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1440px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto space-y-16 relative z-20">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase" style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}>
            Got <span className="text-[#EB0028] text-glow">Questions?</span>
          </h2>
          <p className="text-xs sm:text-sm text-white/60 font-light max-w-xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            Everything you need to know about TEDxKLH 2026, attendee selection, and conference guidelines.
          </p>
        </div>

        {/* Full-Width Accordion Cards Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                  isOpen
                    ? "border-[#EB0028]/40 bg-white/[0.03] shadow-[0_10px_30px_rgba(235,0,40,0.15)]"
                    : "border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex justify-between items-center gap-6">
                  <h3
                    className={`text-base sm:text-lg font-bold tracking-wide uppercase transition-colors ${
                      isOpen ? "text-[#EB0028]" : "text-white"
                    }`}
                    style={{ fontFamily: "'Satoshi', 'Space Grotesk', sans-serif" }}
                  >
                    {item.question}
                  </h3>
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? "border-[#EB0028] bg-[#EB0028]/20 text-[#EB0028]" : "border-white/10 text-white/40"
                  }`}>
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="pt-4 text-xs sm:text-sm text-white/60 font-light leading-relaxed border-t border-white/5 mt-4"
                      style={{ fontFamily: "'Inter', sans-serif" }}
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
