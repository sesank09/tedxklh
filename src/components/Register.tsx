"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Upload, 
  X, 
  QrCode, 
  Copy, 
  CheckCircle2, 
  Download, 
  Share2, 
  Calendar,
  AlertCircle
} from "lucide-react";
import Magnetic from "./Magnetic";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  organization: string;
  role: string;
  field: string;
  year: string;
  linkedin: string;
  portfolio: string;
  motivation: string;
  utrNumber: string;
  screenshotBase64: string | null;
  screenshotName: string | null;
  termsAccepted: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  whatsapp: "",
  city: "",
  organization: "KL University Hyderabad",
  role: "Student",
  field: "Computer Science & Engineering",
  year: "3rd Year",
  linkedin: "",
  portfolio: "",
  motivation: "",
  utrNumber: "",
  screenshotBase64: null,
  screenshotName: null,
  termsAccepted: false,
};

const STATS = [
  { label: "Curated Seats", val: "100 Passes" },
  { label: "Keynote Voices", val: "12 Speakers" },
  { label: "Format", val: "Full-Day Summit" },
  { label: "Credential", val: "Official TEDx" },
];

const TIMELINE = [
  { step: "01", title: "Profile Submission", desc: "Submit personal & academic background." },
  { step: "02", title: "Experience & Curation", desc: "Share your vision & perspective." },
  { step: "03", title: "Payment & Verification", desc: "Provide 12-digit UTR & screenshot." },
  { step: "04", title: "Confirmation & Pass", desc: "Review summary and generate delegate pass." },
];

const BENEFITS = [
  "Admission to all 12 keynote speaker sessions & curated talks",
  "Official TEDxKLH 2026 delegate kit, lanyard & credentials",
  "Exclusive executive lunch & afternoon networking coffee lounge",
  "Volumetric audio-visual experience & interactive pavilion entry",
  "Official TEDx Certificate of Participation (Digital & Physical)",
];

export default function Register() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [passId, setPassId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Autosave to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tedxklh_register_form_v2");
    if (saved) {
      try {
        setForm(JSON.parse(saved));
        setSavedAt("Draft restored");
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const updateForm = (field: keyof FormData, val: any) => {
    const updated = { ...form, [field]: val };
    setForm(updated);
    try {
      localStorage.setItem("tedxklh_register_form_v2", JSON.stringify(updated));
      setSavedAt("Autosaved");
    } catch (e) {
      console.error(e);
    }
    // Clear error for field
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.type)) {
      setErrors(prev => ({ ...prev, screenshot: "Please upload a valid PNG or JPG image." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, screenshot: "File size exceeds 5MB limit." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateForm("screenshotBase64", base64);
      updateForm("screenshotName", file.name);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    updateForm("screenshotBase64", null);
    updateForm("screenshotName", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.firstName.trim()) newErrors.firstName = "First name is required";
      if (!form.lastName.trim()) newErrors.lastName = "Last name is required";
      if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = "Valid email address is required";
      if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) newErrors.phone = "Valid 10-digit phone is required";
      if (!form.city.trim()) newErrors.city = "City is required";
    } else if (currentStep === 2) {
      if (!form.organization.trim()) newErrors.organization = "Organization / University is required";
      if (!form.role.trim()) newErrors.role = "Role / Designation is required";
      if (!form.field.trim()) newErrors.field = "Field of study / Domain is required";
      if (!form.motivation.trim() || form.motivation.trim().length < 20) {
        newErrors.motivation = "Please write at least 20 characters explaining your interest.";
      }
    } else if (currentStep === 3) {
      const cleanUtr = form.utrNumber.replace(/\s+/g, "");
      if (!/^\d{12}$/.test(cleanUtr)) {
        newErrors.utrNumber = "UTR transaction number must be exactly 12 numeric digits";
      }
      if (!form.screenshotBase64) {
        newErrors.screenshot = "Payment screenshot upload is required for verification";
      }
    } else if (currentStep === 4) {
      if (!form.termsAccepted) {
        newErrors.termsAccepted = "You must accept the Delegate Code of Conduct & Guidelines";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep((step + 1) as any);
        window.scrollTo({ top: document.getElementById("register")?.offsetTop ? document.getElementById("register")!.offsetTop + 100 : 0, behavior: "smooth" });
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((step - 1) as any);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const generatedId = `TEDxKLH-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setPassId(generatedId);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      confetti({
        particleCount: 160,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#EB0028", "#FFFFFF", "#FF5A5F", "#888888"],
      });
    }, 1800);
  };

  return (
    <section id="register" className="relative w-full py-28 px-5 sm:px-8 md:px-12 select-none overflow-hidden border-t border-white/[0.04]">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] max-w-[1400px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.06),transparent_70%)] pointer-events-none" />

      {/* Main Aligned Container */}
      <div className="w-full max-w-[1400px] mx-auto relative z-20 space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span 
                className="text-xs text-[#EB0028] tracking-[0.25em] uppercase font-medium"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                ACCESS PORTAL // DELEGATE ADMISSION
              </span>
              <span className="h-px w-8 bg-[#EB0028]/40" />
            </div>
            <h2 
              className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight uppercase leading-[1.15]" 
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              APPLY FOR <span className="text-[#EB0028]">DELEGATE PASS</span>
            </h2>
          </div>
          <p 
            className="text-sm text-white/60 font-normal max-w-md leading-relaxed" 
            style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}
          >
            Cohort limited to 100 curated delegates. Secure your pass for an unforgettable day of metamorphosis.
          </p>
        </div>

        {/* 12-Column Grid Layout: 4 cols Left / 8 cols Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* LEFT COLUMN (col-span-4): Event details & stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 space-y-6"
          >
            {/* 4 Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map((st, i) => (
                <div key={i} className="p-4 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-1">
                  <div 
                    className="text-base font-bold text-white tracking-wide" 
                    style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                  >
                    {st.val}
                  </div>
                  <div 
                    className="text-[10px] text-white/50 uppercase tracking-wider font-medium"
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {st.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Application Stages */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-4">
              <h4 
                className="text-xs tracking-[0.2em] text-[#EB0028] uppercase font-semibold"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                APPLICATION PROTOCOL
              </h4>
              <div className="space-y-4">
                {TIMELINE.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <span 
                      className={`w-6 h-6 rounded-full border font-bold text-[10px] flex items-center justify-center shrink-0 ${
                        step === idx + 1
                          ? "border-[#EB0028] bg-[#EB0028]/20 text-[#EB0028]"
                          : step > idx + 1
                          ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                          : "border-white/10 text-white/40"
                      }`}
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {step > idx + 1 ? "✓" : t.step}
                    </span>
                    <div className="space-y-0.5">
                      <h5 
                        className="text-xs font-bold text-white uppercase tracking-wider" 
                        style={{ fontFamily: "var(--font-sora)", fontWeight: 650 }}
                      >
                        {t.title}
                      </h5>
                      <p 
                        className="text-[11px] text-white/50 font-normal" 
                        style={{ fontFamily: "var(--font-manrope)" }}
                      >
                        {t.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delegate Inclusions */}
            <div className="p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md space-y-3">
              <h4 
                className="text-xs tracking-[0.2em] text-white/60 uppercase font-medium"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                DELEGATE PRIVILEGES
              </h4>
              <ul className="space-y-2.5">
                {BENEFITS.map((b, idx) => (
                  <li 
                    key={idx} 
                    className="flex items-start gap-2.5 text-xs text-white/70 font-normal" 
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    <ShieldCheck className="w-4 h-4 text-[#EB0028] shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* RIGHT COLUMN (col-span-8): Multi-step interactive application form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8"
          >
            <div
              className="w-full p-6 sm:p-10 md:p-12 rounded-3xl relative overflow-hidden transition-all duration-300 shadow-[0_20px_80px_rgba(0,0,0,0.8)] border border-white/10 bg-black/60 backdrop-blur-xl"
            >
              {/* Glowing top line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

              {!isSubmitted ? (
                <div className="space-y-8">
                  {/* Step Progress Bar */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-ping" />
                        <span className="text-xs font-mono tracking-widest text-[#EB0028] uppercase font-bold">
                          PHASE {step} OF 4
                        </span>
                      </div>
                      {savedAt && (
                        <span className="text-[10px] font-mono text-white/40 tracking-wider">
                          {savedAt}
                        </span>
                      )}
                    </div>

                    {/* Step Tabs */}
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { num: 1, label: "Identity" },
                        { num: 2, label: "Background" },
                        { num: 3, label: "Payment" },
                        { num: 4, label: "Review" },
                      ].map((s) => {
                        const isCurrent = step === s.num;
                        const isDone = step > s.num;
                        return (
                          <button
                            key={s.num}
                            type="button"
                            onClick={() => {
                              if (isDone) setStep(s.num as any);
                            }}
                            className={`py-2.5 px-2 rounded-xl border text-[11px] font-mono uppercase tracking-wider transition-all duration-200 text-center ${
                              isCurrent
                                ? "border-[#EB0028] bg-[#EB0028]/15 text-[#EB0028] shadow-[0_0_15px_rgba(235,0,40,0.2)]"
                                : isDone
                                ? "border-white/20 bg-white/5 text-white cursor-pointer hover:border-white/40"
                                : "border-white/5 bg-white/[0.01] text-white/30 cursor-not-allowed"
                            }`}
                          >
                            <span className="hidden sm:inline">{s.num}. </span>
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Form Step Contents */}
                  <AnimatePresence mode="wait">
                    {/* STEP 1: Personal Profile */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-white/5 pb-4">
                          <h3 className="text-lg font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>
                            Delegate Identity &amp; Contact
                          </h3>
                          <p className="text-xs text-white/50 font-normal mt-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
                            Provide your official legal details for delegate badging and communications.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>First Name *</label>
                            <input
                              type="text"
                              value={form.firstName}
                              onChange={(e) => updateForm("firstName", e.target.value)}
                              placeholder="e.g. Sesank"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                                errors.firstName ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {errors.firstName && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.firstName}</span>}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>Last Name *</label>
                            <input
                              type="text"
                              value={form.lastName}
                              onChange={(e) => updateForm("lastName", e.target.value)}
                              placeholder="e.g. Rao"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                                errors.lastName ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {errors.lastName && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.lastName}</span>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>Email Address *</label>
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) => updateForm("email", e.target.value)}
                              placeholder="you@domain.com"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                                errors.email ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {errors.email && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.email}</span>}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>Phone Number *</label>
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => updateForm("phone", e.target.value)}
                              placeholder="+91 98765 43210"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                                errors.phone ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {errors.phone && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.phone}</span>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>WhatsApp Number</label>
                            <input
                              type="tel"
                              value={form.whatsapp}
                              onChange={(e) => updateForm("whatsapp", e.target.value)}
                              placeholder="Optional (if different)"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>City &amp; State *</label>
                            <input
                              type="text"
                              value={form.city}
                              onChange={(e) => updateForm("city", e.target.value)}
                              placeholder="e.g. Hyderabad, Telangana"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                                errors.city ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {errors.city && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.city}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Academic / Professional Background */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-white/5 pb-4">
                          <h3 className="text-lg font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>
                            Academic &amp; Professional Background
                          </h3>
                          <p className="text-xs text-white/50 font-normal mt-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
                            Our curation board reviews candidate background to craft a balanced, multidisciplinary cohort.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>Institution / Organization *</label>
                            <input
                              type="text"
                              value={form.organization}
                              onChange={(e) => updateForm("organization", e.target.value)}
                              placeholder="e.g. KL University / Microsoft"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                                errors.organization ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {errors.organization && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.organization}</span>}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>Role / Designation *</label>
                            <input
                              type="text"
                              value={form.role}
                              onChange={(e) => updateForm("role", e.target.value)}
                              placeholder="e.g. Student / Software Engineer"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                                errors.role ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {errors.role && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.role}</span>}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>Field of Study / Department *</label>
                            <input
                              type="text"
                              value={form.field}
                              onChange={(e) => updateForm("field", e.target.value)}
                              placeholder="e.g. Computer Science, Biotechnology"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                                errors.field ? "border-red-500" : "border-white/10"
                              }`}
                            />
                            {errors.field && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.field}</span>}
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>Year of Study / Experience</label>
                            <input
                              type="text"
                              value={form.year}
                              onChange={(e) => updateForm("year", e.target.value)}
                              placeholder="e.g. 3rd Year / 4 Years Exp"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>LinkedIn Profile URL</label>
                            <input
                              type="url"
                              value={form.linkedin}
                              onChange={(e) => updateForm("linkedin", e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>Portfolio / GitHub / Website</label>
                            <input
                              type="url"
                              value={form.portfolio}
                              onChange={(e) => updateForm("portfolio", e.target.value)}
                              placeholder="https://yourportfolio.com"
                              style={{ fontFamily: "var(--font-manrope)" }}
                              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>
                            Why do you want to attend METAMORPHOSIS? *
                          </label>
                          <textarea
                            rows={3}
                            value={form.motivation}
                            onChange={(e) => updateForm("motivation", e.target.value)}
                            placeholder="Share an idea you are passionate about, or what you hope to experience at TEDxKLH 2026..."
                            style={{ fontFamily: "var(--font-manrope)" }}
                            className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors resize-none ${
                              errors.motivation ? "border-red-500" : "border-white/10"
                            }`}
                          />
                          {errors.motivation && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.motivation}</span>}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Payment Verification & UTR */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-white/5 pb-4">
                          <h3 className="text-lg font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>
                            Delegate Pass Fee &amp; Transaction Verification
                          </h3>
                          <p className="text-xs text-white/50 font-normal mt-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
                            Transfer the delegate pass fee and provide your 12-digit UTR reference with transaction screenshot.
                          </p>
                        </div>

                        {/* Payment Card Info & QR Code */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl border border-white/10 bg-white/[0.02]">
                          {/* Left: UPI details */}
                          <div className="md:col-span-7 space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#EB0028] uppercase font-bold tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                                DELEGATE PASS FEE
                              </span>
                              <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>
                                ₹499 <span className="text-xs font-normal text-white/40" style={{ fontFamily: "var(--font-manrope)" }}>/ Pass</span>
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              <div className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5">
                                <span className="text-white/60" style={{ fontFamily: "var(--font-dm-mono)" }}>UPI ID:</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-bold" style={{ fontFamily: "var(--font-dm-mono)" }}>tedxklh@upi</span>
                                  <button
                                    type="button"
                                    onClick={() => copyToClipboard("tedxklh@upi")}
                                    className="p-1 rounded text-white/40 hover:text-white transition-colors cursor-pointer"
                                    title="Copy UPI ID"
                                  >
                                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 text-[11px] text-white/70" style={{ fontFamily: "var(--font-dm-mono)" }}>
                                <div><span className="text-white/40">Account Name:</span> TEDx KLH Conferences</div>
                                <div><span className="text-white/40">Account No:</span> 921020048192831</div>
                                <div><span className="text-white/40">IFSC Code:</span> UTIB0002194</div>
                                <div><span className="text-white/40">Bank:</span> Axis Bank, Bowrampet</div>
                              </div>
                            </div>
                          </div>

                          {/* Right: Mock QR Code */}
                          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded-xl bg-black/60 border border-white/10 space-y-2 text-center">
                            <div className="w-28 h-28 bg-white p-2 rounded-lg flex items-center justify-center shadow-lg">
                              {/* SVG Stylized QR */}
                              <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                                <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v20 h-10 z M60,10 h10 v10 h-10 z M10,40 h10 v20 h-10 z M30,40 h20 v10 h-20 z M60,40 h30 v10 h-30 z M40,60 h20 v20 h-20 z M70,60 h10 v30 h-10 z M90,70 h10 v20 h-10 z" />
                              </svg>
                            </div>
                            <span className="text-[10px] text-white/50 uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Scan with any UPI App
                            </span>
                          </div>
                        </div>

                        {/* UTR Number Input */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              12-Digit UTR / Transaction Reference ID *
                            </label>
                            <span className="text-[10px] text-white/40" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              {form.utrNumber.replace(/\D/g, "").length} / 12 digits
                            </span>
                          </div>
                          <input
                            type="text"
                            maxLength={12}
                            value={form.utrNumber}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "").slice(0, 12);
                              updateForm("utrNumber", val);
                            }}
                            placeholder="e.g. 429182910294"
                            style={{ fontFamily: "var(--font-dm-mono)" }}
                            className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white tracking-widest placeholder-white/20 focus:outline-none focus:border-[#EB0028] transition-colors ${
                              errors.utrNumber ? "border-red-500" : "border-white/10"
                            }`}
                          />
                          {errors.utrNumber && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.utrNumber}</span>}
                        </div>

                        {/* Screenshot Upload Dropzone */}
                        <div className="space-y-1.5">
                          <label className="text-xs uppercase text-white/70 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>
                            Upload Payment Screenshot * (PNG, JPG, max 5MB)
                          </label>

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            onChange={handleFileUpload}
                            className="hidden"
                          />

                          {!form.screenshotBase64 ? (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className={`w-full p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                                errors.screenshot
                                  ? "border-red-500/50 bg-red-500/5 hover:border-red-500"
                                  : "border-white/15 bg-white/[0.01] hover:border-[#EB0028]/50 hover:bg-[#EB0028]/5"
                              }`}
                            >
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div className="text-xs text-white/70 text-center" style={{ fontFamily: "var(--font-manrope)" }}>
                                Click or drag transaction screenshot to upload
                              </div>
                              <span className="text-[10px] text-white/40" style={{ fontFamily: "var(--font-dm-mono)" }}>
                                Accepts PNG, JPG, WebP up to 5MB
                              </span>
                            </div>
                          ) : (
                            <div className="relative p-4 rounded-2xl border border-white/20 bg-white/[0.03] flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={form.screenshotBase64}
                                  alt="Screenshot Preview"
                                  className="w-14 h-14 object-cover rounded-lg border border-white/10"
                                />
                                <div className="space-y-0.5">
                                  <div className="text-xs text-white font-medium truncate max-w-[200px] sm:max-w-[300px]" style={{ fontFamily: "var(--font-dm-mono)" }}>
                                    {form.screenshotName || "Payment_Screenshot.png"}
                                  </div>
                                  <div className="text-[10px] text-emerald-400 flex items-center gap-1" style={{ fontFamily: "var(--font-dm-mono)" }}>
                                    <CheckCircle2 className="w-3 h-3" /> Ready for verification
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={removeFile}
                                className="p-2 rounded-lg bg-white/10 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors cursor-pointer"
                                title="Remove screenshot"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}

                          {errors.screenshot && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.screenshot}</span>}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: Review & Final Confirmation */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                      >
                        <div className="border-b border-white/5 pb-4">
                          <h3 className="text-lg font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>
                            Review &amp; Submit Application
                          </h3>
                          <p className="text-xs text-white/50 font-normal mt-1" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
                            Verify your registration details before final submission.
                          </p>
                        </div>

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                            <span className="text-[10px] text-[#EB0028] uppercase font-bold" style={{ fontFamily: "var(--font-dm-mono)" }}>01. DELEGATE PROFILE</span>
                            <div className="text-xs space-y-1 text-white/80" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              <div><span className="text-white/40">Name:</span> {form.firstName} {form.lastName}</div>
                              <div><span className="text-white/40">Email:</span> {form.email}</div>
                              <div><span className="text-white/40">Phone:</span> {form.phone}</div>
                              <div><span className="text-white/40">City:</span> {form.city}</div>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                            <span className="text-[10px] text-[#EB0028] uppercase font-bold" style={{ fontFamily: "var(--font-dm-mono)" }}>02. ACADEMIC / ORG</span>
                            <div className="text-xs space-y-1 text-white/80" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              <div><span className="text-white/40">Org:</span> {form.organization}</div>
                              <div><span className="text-white/40">Role:</span> {form.role}</div>
                              <div><span className="text-white/40">Field:</span> {form.field}</div>
                              <div><span className="text-white/40">Year:</span> {form.year}</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] space-y-2">
                          <span className="text-[10px] text-[#EB0028] uppercase font-bold" style={{ fontFamily: "var(--font-dm-mono)" }}>03. PAYMENT VERIFICATION</span>
                          <div className="text-xs space-y-1 text-white/80" style={{ fontFamily: "var(--font-dm-mono)" }}>
                            <div><span className="text-white/40">UTR Number:</span> <span className="tracking-widest font-bold text-white">{form.utrNumber}</span></div>
                            <div><span className="text-white/40">Screenshot:</span> {form.screenshotName || "Attached"}</div>
                          </div>
                        </div>

                        {/* Terms Acceptance */}
                        <div className="space-y-2 pt-2">
                          <label className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/[0.01] cursor-pointer hover:border-white/20 transition-colors">
                            <input
                              type="checkbox"
                              checked={form.termsAccepted}
                              onChange={(e) => updateForm("termsAccepted", e.target.checked)}
                              className="w-4 h-4 mt-0.5 accent-[#EB0028] rounded cursor-pointer"
                            />
                            <span className="text-xs text-white/70 font-normal leading-relaxed" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
                              I acknowledge that admission is subject to curatorial approval and payment verification. I agree to abide by TEDx conference codes of conduct and event regulations.
                            </span>
                          </label>
                          {errors.termsAccepted && <span className="text-[10px] text-red-400 font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{errors.termsAccepted}</span>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Nav Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 text-xs uppercase text-white/70 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
                        style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Previous
                      </button>
                    ) : <div />}

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#EB0028] hover:bg-[#ff1a3c] text-white text-xs uppercase font-bold tracking-wider shadow-[0_0_25px_rgba(235,0,40,0.4)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                      style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : step === 4 ? (
                        <>
                          Confirm &amp; Generate Pass
                          <Check className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Continue to Step {step + 1}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                /* CINEMATIC SUCCESS STATE */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-[#EB0028]/20 border border-[#EB0028] text-[#EB0028] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(235,0,40,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs text-[#EB0028] tracking-[0.25em] uppercase font-bold" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      APPLICATION RECEIVED // STATUS: VERIFICATION PENDING
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>
                      Welcome to the Metamorphosis
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 font-normal max-w-md mx-auto" style={{ fontFamily: "var(--font-manrope)", fontWeight: 400 }}>
                      Your application has been logged into our curation queue. Your official delegate entry pass will be dispatched to <span className="text-white font-medium" style={{ fontFamily: "var(--font-dm-mono)" }}>{form.email}</span> within 24 hours.
                    </p>
                  </div>

                  {/* Futuristic Digital Pass Card */}
                  <div className="max-w-md mx-auto p-6 rounded-2xl border border-[#EB0028]/40 bg-gradient-to-br from-black via-white/[0.02] to-black relative overflow-hidden shadow-[0_15px_40px_rgba(235,0,40,0.15)] space-y-6 text-left">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#EB0028]/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>TEDxKLH 2026</div>
                        <div className="text-[9px] text-[#EB0028] tracking-widest uppercase" style={{ fontFamily: "var(--font-dm-mono)" }}>OFFICIAL DELEGATE PASS</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 text-[9px] uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                        QUEUED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs" style={{ fontFamily: "var(--font-dm-mono)" }}>
                      <div>
                        <div className="text-white/40 text-[10px]">DELEGATE</div>
                        <div className="text-white font-bold">{form.firstName} {form.lastName}</div>
                      </div>
                      <div>
                        <div className="text-white/40 text-[10px]">PASS ID</div>
                        <div className="text-[#EB0028] font-bold tracking-wider">{passId}</div>
                      </div>
                      <div>
                        <div className="text-white/40 text-[10px]">ORGANIZATION</div>
                        <div className="text-white/80 truncate">{form.organization}</div>
                      </div>
                      <div>
                        <div className="text-white/40 text-[10px]">UTR REF</div>
                        <div className="text-white/80">{form.utrNumber}</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-white/40" style={{ fontFamily: "var(--font-dm-mono)" }}>KLH AUDITORIUM · HYDERABAD</span>
                      <span className="text-[10px] text-[#EB0028] font-bold" style={{ fontFamily: "var(--font-bebas-neue)", letterSpacing: "0.08em" }}>METAMORPHOSIS</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => alert("Digital pass download will be activated upon curation verification.")}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 hover:border-white/40 text-xs uppercase text-white transition-colors cursor-pointer"
                      style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                    >
                      <Download className="w-3.5 h-3.5 text-[#EB0028]" />
                      Download Pass
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: "TEDxKLH 2026: METAMORPHOSIS",
                            text: "I just applied for my delegate pass to TEDxKLH 2026: METAMORPHOSIS!",
                            url: window.location.href,
                          }).catch(() => {});
                        } else {
                          copyToClipboard(window.location.href);
                          alert("Link copied to clipboard!");
                        }
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 hover:border-white/40 text-xs uppercase text-white transition-colors cursor-pointer"
                      style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                    >
                      <Share2 className="w-3.5 h-3.5 text-[#EB0028]" />
                      Share Application
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
