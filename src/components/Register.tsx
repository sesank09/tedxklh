"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, ArrowRight, Check, ShieldCheck } from "lucide-react";
import Magnetic from "./Magnetic";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  country: string;
  city: string;
  university: string;
  degree: string;
  branch: string;
  year: string;
  linkedin: string;
  portfolio: string;
  motivation: string;
  termsAccepted: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  whatsapp: "",
  country: "India",
  city: "",
  university: "KL University Hyderabad",
  degree: "B.Tech",
  branch: "Computer Science & Engineering",
  year: "3rd Year",
  linkedin: "",
  portfolio: "",
  motivation: "",
  termsAccepted: false,
};

const STATS = [
  { label: "Limited Seats", val: "100 Passes" },
  { label: "Speakers",      val: "12 Keynotes" },
  { label: "Networking",   val: "Exclusive" },
  { label: "Certificate",  val: "Official TEDx" },
];

const TIMELINE = [
  { step: "01", title: "Submit Application", desc: "Fill in personal & academic credentials." },
  { step: "02", title: "Review & Selection", desc: "Curatorial board verifies candidates." },
  { step: "03", title: "Pass Issuance",     desc: "Receive digital ticket with QR pass." },
];

const BENEFITS = [
  "Access to all 12 live keynote sessions",
  "Delegate welcome kit & badge",
  "Exclusive networking lunch & coffee lounge",
  "Official TEDx certificate of attendance",
];

export default function Register() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Autosave to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tedxklh_register_form_debug");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
        setSavedAt("Draft restored");
      } catch (e) { console.error(e); }
    }
  }, []);

  const updateForm = (field: keyof FormData, val: any) => {
    const updated = { ...form, [field]: val };
    setForm(updated);
    localStorage.setItem("tedxklh_register_form_debug", JSON.stringify(updated));
    setSavedAt("Autosaved");
  };

  const handleNext = () => {
    if (step === 1) {
      if (!form.firstName || !form.email || !form.phone) {
        alert("Please complete First Name, Email, and Phone number.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.university || !form.degree) {
        alert("Please enter your University and Degree details.");
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!form.termsAccepted) {
        alert("Please accept the Event Guidelines to complete your application.");
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 140,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#EB0028", "#FFFFFF", "#FF5A5F"],
      });
    }, 1500);
  };

  return (
    <section id="register" className="relative w-full py-[160px] px-6 sm:px-10 lg:px-[64px] select-none overflow-hidden">
      
      {/* Background Radial Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1440px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.08),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container (max-w-[1440px]) */}
      <div className="w-full max-w-[1440px] mx-auto relative z-20 space-y-[64px]">
        
        {/* Application Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/30 bg-[#EB0028]/10 text-[#EB0028] text-xs font-mono tracking-widest uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            TEDxKLH 2026 • APPLICATION PORTAL
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Delegate <span className="text-[#EB0028] text-glow">Pass Application</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-white/60 font-light max-w-xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Join 100 visionaries, thinkers, and innovators for a day of transformative keynotes.
          </motion.p>
        </div>

        {/* 12-Column Grid Layout: 35% Left (col-span-4) / 65% Right (col-span-8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN (35% — col-span-4): Clean Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="space-y-3 border-l-2 border-[#EB0028] pl-5">
              <span className="text-xs font-mono tracking-[0.25em] uppercase text-[#EB0028]">
                APPLICATION PORTAL
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                TEDxKLH 2026
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                Complete your details below to apply for an official delegate seat.
              </p>
            </div>

            {/* 4 Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((st, i) => (
                <div key={i} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] space-y-1">
                  <div className="text-base font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {st.val}
                  </div>
                  <div className="text-[10px] text-white/40 font-light uppercase tracking-wider" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {st.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Timeline */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
              <h4 className="text-xs font-mono tracking-[0.2em] text-white/60 uppercase">
                Application Process
              </h4>
              <div className="space-y-4">
                {TIMELINE.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <span className="w-7 h-7 rounded-full border border-[#EB0028]/40 bg-[#EB0028]/10 text-[#EB0028] font-bold text-xs flex items-center justify-center shrink-0">
                      {t.step}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-white uppercase tracking-wider" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {t.title}
                      </h5>
                      <p className="text-[11px] text-white/50 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] space-y-4">
              <h4 className="text-xs font-mono tracking-[0.2em] text-white/60 uppercase">
                Delegate Benefits
              </h4>
              <ul className="space-y-2.5">
                {BENEFITS.map((b, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-xs text-white/70 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <ShieldCheck className="w-4 h-4 text-[#EB0028] shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (65% — col-span-8): Clean Inputs Without Collision Icons */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 flex justify-center"
          >
            <div
              className="w-full max-w-[800px] p-8 sm:p-12 md:p-[56px] rounded-[28px] relative overflow-hidden transition-all duration-300 shadow-[0_20px_80px_rgba(0,0,0,0.85)] space-y-10"
              style={{
                background: "rgba(10, 10, 10, 0.78)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Top Sheen Line */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

              {!isSubmitted ? (
                <>
                  {/* Step Indicator */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono tracking-widest text-[#EB0028] uppercase flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-ping" />
                        STEP {step} OF 3
                      </span>
                      {savedAt && (
                        <span className="text-[10px] font-mono text-white/40 tracking-wider">
                          ✓ {savedAt}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-center">
                      {[
                        { num: 1, label: "① Personal" },
                        { num: 2, label: "② Academic" },
                        { num: 3, label: "③ Review" },
                      ].map(s => {
                        const isCurrent = step === s.num;
                        const isDone = step > s.num;
                        return (
                          <div
                            key={s.num}
                            onClick={() => isDone && setStep(s.num as any)}
                            className={`py-3.5 px-3 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                              isCurrent
                                ? "border-[#EB0028] bg-[#EB0028]/15 text-[#EB0028] shadow-[0_0_20px_rgba(235,0,40,0.3)] animate-pulse"
                                : isDone
                                ? "border-white/20 bg-white/5 text-white"
                                : "border-white/5 bg-white/[0.01] text-white/30"
                            }`}
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                          >
                            {s.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form Step Content (Strict 28px Field Spacing) */}
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-[28px]"
                      >
                        <div className="space-y-1">
                          <h4 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Personal Credentials
                          </h4>
                          <p className="text-xs text-white/50 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Labels are placed cleanly above inputs without internal icon collisions.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[28px]">
                          {/* First Name */}
                          <div>
                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              FIRST NAME *
                            </label>
                            <input
                              type="text"
                              placeholder="Alex"
                              value={form.firstName}
                              onChange={e => updateForm("firstName", e.target.value)}
                              className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#EB0028] focus:bg-white/[0.06] transition-all"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              LAST NAME *
                            </label>
                            <input
                              type="text"
                              placeholder="Vance"
                              value={form.lastName}
                              onChange={e => updateForm("lastName", e.target.value)}
                              className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#EB0028] focus:bg-white/[0.06] transition-all"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            EMAIL ADDRESS *
                          </label>
                          <input
                            type="email"
                            placeholder="alex.vance@university.edu"
                            value={form.email}
                            onChange={e => updateForm("email", e.target.value)}
                            className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#EB0028] focus:bg-white/[0.06] transition-all"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[28px]">
                          {/* Phone */}
                          <div>
                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              PHONE NUMBER *
                            </label>
                            <input
                              type="tel"
                              placeholder="+91 98765 43210"
                              value={form.phone}
                              onChange={e => updateForm("phone", e.target.value)}
                              className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#EB0028] focus:bg-white/[0.06] transition-all"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                          </div>

                          {/* Country */}
                          <div>
                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              COUNTRY *
                            </label>
                            <select
                              value={form.country}
                              onChange={e => updateForm("country", e.target.value)}
                              className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-black text-white text-sm focus:outline-none focus:border-[#EB0028] transition-all appearance-none cursor-pointer"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              <option value="India">India</option>
                              <option value="United States">United States</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-[28px]"
                      >
                        <div className="space-y-1">
                          <h4 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Academic Credentials
                          </h4>
                          <p className="text-xs text-white/50 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Tell us about your university, organization, or research background.
                          </p>
                        </div>

                        {/* University */}
                        <div>
                          <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            INSTITUTION / ORGANIZATION *
                          </label>
                          <input
                            type="text"
                            placeholder="KL University Hyderabad"
                            value={form.university}
                            onChange={e => updateForm("university", e.target.value)}
                            className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#EB0028] focus:bg-white/[0.06] transition-all"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[28px]">
                          {/* Degree */}
                          <div>
                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              DEGREE / ROLE *
                            </label>
                            <input
                              type="text"
                              placeholder="B.Tech Computer Science"
                              value={form.degree}
                              onChange={e => updateForm("degree", e.target.value)}
                              className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#EB0028] focus:bg-white/[0.06] transition-all"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            />
                          </div>

                          {/* Year */}
                          <div>
                            <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              ACADEMIC YEAR *
                            </label>
                            <select
                              value={form.year}
                              onChange={e => updateForm("year", e.target.value)}
                              className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-black text-white text-sm focus:outline-none focus:border-[#EB0028] transition-all appearance-none cursor-pointer"
                              style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                              <option value="1st Year">1st Year</option>
                              <option value="2nd Year">2nd Year</option>
                              <option value="3rd Year">3rd Year</option>
                              <option value="4th Year">4th Year</option>
                              <option value="Postgraduate / Professional">Postgraduate / Professional</option>
                            </select>
                          </div>
                        </div>

                        {/* Portfolio */}
                        <div>
                          <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            PORTFOLIO / LINKEDIN URL (OPTIONAL)
                          </label>
                          <input
                            type="url"
                            placeholder="https://linkedin.com/in/username"
                            value={form.linkedin}
                            onChange={e => updateForm("linkedin", e.target.value)}
                            className="w-full h-[64px] px-6 rounded-[18px] border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#EB0028] focus:bg-white/[0.06] transition-all"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-[28px]"
                      >
                        <div className="space-y-1">
                          <h4 className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Statement of Purpose
                          </h4>
                          <p className="text-xs text-white/50 font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                            Tell us why you wish to join TEDxKLH 2026.
                          </p>
                        </div>

                        {/* Motivation */}
                        <div>
                          <label className="block text-[14px] font-semibold uppercase tracking-wider text-white/80 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            WHY DO YOU WISH TO ATTEND? *
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Share your ideas, passions, or research interests..."
                            value={form.motivation}
                            onChange={e => updateForm("motivation", e.target.value)}
                            className="w-full p-5 rounded-[18px] border border-white/10 bg-white/[0.03] text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#EB0028] focus:bg-white/[0.06] transition-all resize-none"
                            style={{ fontFamily: "'Inter', sans-serif" }}
                          />
                        </div>

                        {/* Terms Checkbox */}
                        <label className="flex items-start gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.01] cursor-pointer">
                          <input
                            type="checkbox"
                            checked={form.termsAccepted}
                            onChange={e => updateForm("termsAccepted", e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-white/20 text-[#EB0028] focus:ring-0 bg-black cursor-pointer"
                          />
                          <span className="text-xs text-white/70 font-light leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                            I agree to the TEDxKLH Code of Conduct and confirm all details provided are authentic.
                          </span>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Action Row: 240x60px Bottom-Right Aligned Button */}
                  <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4">
                    {step > 1 ? (
                      <button
                        onClick={() => setStep((step - 1) as any)}
                        className="px-6 h-[60px] rounded-full border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        ← Back
                      </button>
                    ) : <div />}

                    {/* Bottom-Right Aligned Button (Width: 240px, Height: 60px) */}
                    <Magnetic range={50} strength={0.25}>
                      <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="w-[240px] h-[60px] rounded-full font-bold text-xs tracking-[0.2em] uppercase text-white flex items-center justify-center gap-2 overflow-hidden group cursor-pointer shadow-[0_4px_30px_rgba(235,0,40,0.5)] hover:shadow-[0_8px_40px_rgba(235,0,40,0.7)] hover:-translate-y-0.5 transition-all duration-300 shrink-0"
                        style={{
                          background: "linear-gradient(135deg, #EB0028 0%, #FF5A5F 100%)",
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>{step === 3 ? "SUBMIT" : "CONTINUE"}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </>
              ) : (
                /* Success Message */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-6"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-[#EB0028] bg-[#EB0028]/20 mx-auto flex items-center justify-center text-[#EB0028] shadow-[0_0_40px_rgba(235,0,40,0.6)]">
                    <Check className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Application Received!
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 font-light max-w-md mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Thank you <span className="text-white font-bold">{form.firstName}</span>. Confirmation sent to <span className="text-[#EB0028] font-bold">{form.email}</span>.
                    </p>
                  </div>

                  <button
                    onClick={() => { setIsSubmitted(false); setStep(1); }}
                    className="px-8 h-[52px] rounded-full border border-white/20 hover:border-white text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
                  >
                    Submit Another Application
                  </button>
                </motion.div>
              )}

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
