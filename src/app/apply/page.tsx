"use client";

import { useState, useRef, useEffect } from "react";
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
  Calendar,
  MapPin,
  Clock,
  Download,
  Share2,
  Home,
  Info,
  AlertCircle,
  FileText,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Magnetic from "@/components/Magnetic";

interface FormData {
  // Step 1: Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  organization: string;

  // Step 2: Delegate Details
  role: string;
  field: string;
  year: string;
  linkedin: string;
  motivation: string;
  dietary: string;

  // Step 3: Payment
  utrNumber: string;
  screenshotBase64: string | null;
  screenshotName: string | null;
  screenshotSize: string | null;

  // Step 4: Terms
  termsAccepted: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  whatsapp: "",
  city: "",
  organization: "",
  role: "Student Delegate",
  field: "Computer Science & AI",
  year: "3rd Year",
  linkedin: "",
  motivation: "",
  dietary: "None",
  utrNumber: "",
  screenshotBase64: null,
  screenshotName: null,
  screenshotSize: null,
  termsAccepted: false,
};

const STEPS = [
  { id: 1, name: "PERSONAL", title: "Personal Information", desc: "Identity and direct contact coordinates" },
  { id: 2, name: "DETAILS", title: "Delegate Profile", desc: "Academic, professional and motivation background" },
  { id: 3, name: "PAYMENT", title: "Payment & Verification", desc: "12-digit UTR reference & official screenshot" },
  { id: 4, name: "CONFIRM", title: "Summary & Protocols", desc: "Verify application and accept summit charter" },
];

const METRICS = [
  { val: "100", label: "Curated Passes" },
  { val: "12", label: "Keynote Voices" },
  { val: "Full Day", label: "Immersive Summit" },
  { val: "Official", label: "TEDx Credential" },
];

export default function ApplyPage() {
  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passId, setPassId] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore autosaved draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tedxklh_apply_draft_v1");
      if (saved) {
        setForm(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateField = (field: keyof FormData, val: any) => {
    const updated = { ...form, [field]: val };
    setForm(updated);
    try {
      localStorage.setItem("tedxklh_apply_draft_v1", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // UTR specific handler: strict numeric only, max 12 digits
  const handleUtrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clean = e.target.value.replace(/\D/g, "").slice(0, 12);
    updateField("utrNumber", clean);
  };

  // File upload validation & handler
  const processFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, screenshot: "Please upload a valid JPG or PNG image file." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, screenshot: "File size exceeds 5MB limit. Please upload a smaller image." }));
      return;
    }

    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      updateField("screenshotBase64", base64);
      updateField("screenshotName", file.name);
      updateField("screenshotSize", sizeFormatted);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removeFile = () => {
    updateField("screenshotBase64", null);
    updateField("screenshotName", null);
    updateField("screenshotSize", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyUpi = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  // Step Validation
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.firstName.trim()) errs.firstName = "First name is required";
      if (!form.lastName.trim()) errs.lastName = "Last name is required";
      if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Valid official email is required";
      const digits = form.phone.replace(/\D/g, "");
      if (!digits || digits.length < 10) errs.phone = "Valid 10-digit phone number is required";
      if (!form.city.trim()) errs.city = "Current city is required";
      if (!form.organization.trim()) errs.organization = "College / University or Organization is required";
    } else if (currentStep === 2) {
      if (!form.role.trim()) errs.role = "Please select your primary role";
      if (!form.field.trim()) errs.field = "Field of study/interest is required";
      if (!form.motivation.trim() || form.motivation.trim().length < 15) {
        errs.motivation = "Please provide at least 1-2 sentences on your motivation to attend";
      }
    } else if (currentStep === 3) {
      const cleanUtr = form.utrNumber.trim();
      if (!/^\d{12}$/.test(cleanUtr)) {
        errs.utrNumber = "UTR Number must be exactly 12 numeric digits";
      }
      if (!form.screenshotBase64) {
        errs.screenshot = "Payment screenshot upload is required for transaction verification";
      }
    } else if (currentStep === 4) {
      if (!form.termsAccepted) {
        errs.termsAccepted = "You must agree to the TEDx Code of Conduct & Summit Guidelines";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1);
        window.scrollTo({ top: 300, behavior: "smooth" });
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 300, behavior: "smooth" });
    }
  };

  const handleSubmit = () => {
    if (!validateStep(4)) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    const generatedId = `TEDxKLH-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    setPassId(generatedId);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      try {
        localStorage.removeItem("tedxklh_apply_draft_v1");
      } catch (e) {}

      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.55 },
        colors: ["#EB0028", "#FFFFFF", "#FF454A", "#1a1a1a"],
      });
      window.scrollTo({ top: 120, behavior: "smooth" });
    }, 1800);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-x-clip">
      {/* Dynamic Background Atmosphere: Subtle Metamorphosis Crystalline Gradients & Light Sweeps */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Crimson Core Gradients */}
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[90vw] max-w-[1200px] h-[650px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.14),transparent_68%)] blur-3xl" />
        <div className="absolute top-[45%] -left-[10%] w-[55vw] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.07),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[10%] -right-[10%] w-[55vw] h-[550px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.08),transparent_70%)] blur-3xl" />

        {/* Crystalline Metamorphosis Floating Polygons */}
        <motion.div
          animate={{ rotate: 360, y: [0, -25, 0] }}
          transition={{ duration: 42, repeat: Infinity, ease: "linear" }}
          className="absolute top-36 right-[8%] w-64 h-64 border border-white/[0.04] bg-gradient-to-br from-white/[0.02] to-transparent rounded-3xl backdrop-blur-3xl transform rotate-12"
        />
        <motion.div
          animate={{ rotate: -360, y: [0, 30, 0] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute top-[50%] left-[5%] w-80 h-80 border border-[#EB0028]/[0.08] bg-gradient-to-tr from-[#EB0028]/[0.02] to-transparent rounded-full backdrop-blur-3xl"
        />
        
        {/* Soft Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <Navbar />

      <main className="relative z-10 pt-32 sm:pt-40 pb-28 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto space-y-12">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-5 max-w-3xl mx-auto"
        >
          {/* Metadata Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#EB0028]/40 bg-[#EB0028]/10 shadow-[0_0_20px_rgba(235,0,40,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#EB0028]" />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              JOIN TEDx KLH 2026 · METAMORPHOSIS
            </span>
          </div>

          <h1
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight uppercase leading-[1.08]"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            APPLY FOR <span className="text-[#EB0028]">DELEGATE PASS</span>
          </h1>

          <p
            className="text-sm sm:text-base text-white/65 font-normal max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Curated cohort of 100 passionate minds convening for a transformational day of ideas, innovation, and keynotes at KLH University, Bowrampet.
          </p>

          {/* Quick Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2 text-xs text-white/60 font-medium">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#EB0028]" />
              <span style={{ fontFamily: "var(--font-dm-mono)" }}>NOVEMBER 4, 2026</span>
            </div>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#EB0028]" />
              <span style={{ fontFamily: "var(--font-dm-mono)" }}>KLH UNIVERSITY, BOWRAMPET</span>
            </div>
          </div>
        </motion.div>

        {!isSubmitted ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT COLUMN (4 cols): Summit Highlights & Instructions */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-4 space-y-6"
            >
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {METRICS.map((m, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-1 hover:border-[#EB0028]/30 transition-colors"
                  >
                    <div
                      className="text-xl font-bold text-white tracking-tight"
                      style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                    >
                      {m.val}
                    </div>
                    <div
                      className="text-[10px] text-white/50 uppercase tracking-widest font-semibold"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Protocol Flow Card */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-4">
                <h3
                  className="text-xs tracking-[0.2em] text-[#EB0028] uppercase font-bold"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  DELEGATE PASS PROTOCOL
                </h3>
                <div className="space-y-3.5">
                  {STEPS.map((s) => {
                    const isCurrent = step === s.id;
                    const isDone = step > s.id;
                    return (
                      <div key={s.id} className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full border font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isCurrent
                              ? "border-[#EB0028] bg-[#EB0028]/20 text-[#EB0028] shadow-[0_0_12px_rgba(235,0,40,0.35)]"
                              : isDone
                              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                              : "border-white/10 text-white/30"
                          }`}
                          style={{ fontFamily: "var(--font-dm-mono)" }}
                        >
                          {isDone ? <Check className="w-3.5 h-3.5" /> : `0${s.id}`}
                        </div>
                        <div className="space-y-0.5">
                          <div
                            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
                              isCurrent ? "text-white" : isDone ? "text-white/80" : "text-white/40"
                            }`}
                            style={{ fontFamily: "var(--font-sora)", fontWeight: 600 }}
                          >
                            {s.title}
                          </div>
                          <div className="text-[11px] text-white/50 font-normal" style={{ fontFamily: "var(--font-manrope)" }}>
                            {s.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Inclusions Card */}
              <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl space-y-3.5">
                <h3
                  className="text-xs tracking-[0.2em] text-white/60 uppercase font-semibold"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  DELEGATE PRIVILEGES
                </h3>
                <ul className="space-y-2.5 text-xs text-white/70 font-normal" style={{ fontFamily: "var(--font-manrope)" }}>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#EB0028] shrink-0 mt-0.5" />
                    <span>Access to all 12 keynote speaker sessions &amp; discussions</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#EB0028] shrink-0 mt-0.5" />
                    <span>Official TEDxKLH 2026 delegate kit, badge &amp; merchandise</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#EB0028] shrink-0 mt-0.5" />
                    <span>Networking lunch &amp; afternoon coffee lounge</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#EB0028] shrink-0 mt-0.5" />
                    <span>Official TEDx Certificate of Attendance</span>
                  </li>
                </ul>
              </div>

              {/* Need Help link */}
              <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] text-xs text-white/50 flex items-center justify-between">
                <span>Inquiries or bulk pass queries?</span>
                <a href="mailto:tedx@klh.edu.in" className="text-[#EB0028] font-semibold hover:underline" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  tedx@klh.edu.in
                </a>
              </div>
            </motion.div>

            {/* RIGHT COLUMN (8 cols): 4-Step Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-8"
            >
              <div className="w-full p-6 sm:p-10 md:p-12 rounded-3xl relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85)] border border-white/10 bg-black/75 backdrop-blur-2xl">
                {/* Glowing Top Ambient Line */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

                {/* Form Progress Indicator Header */}
                <div className="space-y-5 pb-8 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-ping" />
                      <span
                        className="text-xs font-bold tracking-[0.2em] text-[#EB0028] uppercase"
                        style={{ fontFamily: "var(--font-dm-mono)" }}
                      >
                        STEP 0{step} OF 04 · {STEPS[step - 1].name}
                      </span>
                    </div>

                    <span
                      className="text-[11px] text-white/40 tracking-wider uppercase"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {Math.round((step / 4) * 100)}% COMPLETE
                    </span>
                  </div>

                  {/* 4 Steps Indicator Tabs */}
                  <div className="grid grid-cols-4 gap-2 sm:gap-3">
                    {STEPS.map((s) => {
                      const isCurrent = step === s.id;
                      const isDone = step > s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            if (isDone) setStep(s.id);
                          }}
                          className={`py-3 px-2 rounded-xl border text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 text-center relative overflow-hidden ${
                            isCurrent
                              ? "border-[#EB0028] bg-[#EB0028]/15 text-[#EB0028] shadow-[0_0_18px_rgba(235,0,40,0.25)] font-bold"
                              : isDone
                              ? "border-white/20 bg-white/5 text-white hover:border-white/40 cursor-pointer"
                              : "border-white/5 bg-white/[0.02] text-white/30 cursor-not-allowed"
                          }`}
                          style={{ fontFamily: "var(--font-dm-mono)" }}
                        >
                          <span className="hidden sm:inline">0{s.id}. </span>
                          <span>{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step Form Panes */}
                <div className="pt-8">
                  <AnimatePresence mode="wait">
                    {/* STEP 1: PERSONAL INFORMATION */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2
                            className="text-xl font-bold text-white uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                          >
                            Personal Information
                          </h2>
                          <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                            Enter your legal name and contact details for badge issuing and summit accreditation.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* First Name */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={form.firstName}
                              onChange={(e) => updateField("firstName", e.target.value)}
                              placeholder="e.g. John"
                              className={`w-full h-12 px-4 rounded-xl border bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.firstName ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.firstName && <span className="text-[11px] text-[#EB0028] block">{errors.firstName}</span>}
                          </div>

                          {/* Last Name */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={form.lastName}
                              onChange={(e) => updateField("lastName", e.target.value)}
                              placeholder="e.g. Doe"
                              className={`w-full h-12 px-4 rounded-xl border bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.lastName ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.lastName && <span className="text-[11px] text-[#EB0028] block">{errors.lastName}</span>}
                          </div>

                          {/* Email Address */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Official Email Address *
                            </label>
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) => updateField("email", e.target.value)}
                              placeholder="e.g. yourname@domain.com"
                              className={`w-full h-12 px-4 rounded-xl border bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.email ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.email && <span className="text-[11px] text-[#EB0028] block">{errors.email}</span>}
                          </div>

                          {/* Phone Number */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Phone Number (10 Digits) *
                            </label>
                            <input
                              type="tel"
                              value={form.phone}
                              onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                              placeholder="e.g. 9876543210"
                              maxLength={10}
                              className={`w-full h-12 px-4 rounded-xl border bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.phone ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.phone && <span className="text-[11px] text-[#EB0028] block">{errors.phone}</span>}
                          </div>

                          {/* College / Organization */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              College / Organization *
                            </label>
                            <input
                              type="text"
                              value={form.organization}
                              onChange={(e) => updateField("organization", e.target.value)}
                              placeholder="e.g. KL University / Microsoft / Startup"
                              className={`w-full h-12 px-4 rounded-xl border bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.organization ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.organization && <span className="text-[11px] text-[#EB0028] block">{errors.organization}</span>}
                          </div>

                          {/* City */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              City *
                            </label>
                            <input
                              type="text"
                              value={form.city}
                              onChange={(e) => updateField("city", e.target.value)}
                              placeholder="e.g. Hyderabad"
                              className={`w-full h-12 px-4 rounded-xl border bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.city ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.city && <span className="text-[11px] text-[#EB0028] block">{errors.city}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: DELEGATE DETAILS */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2
                            className="text-xl font-bold text-white uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                          >
                            Delegate Profile &amp; Motivation
                          </h2>
                          <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                            Tell us about your background so we can curate your conference experience.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                          {/* Role Selection */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Delegate Category *
                            </label>
                            <select
                              value={form.role}
                              onChange={(e) => updateField("role", e.target.value)}
                              className="w-full h-12 px-4 rounded-xl border border-white/10 bg-neutral-900 text-white text-sm focus:outline-none focus:border-[#EB0028] transition-all"
                              style={{ fontFamily: "var(--font-manrope)" }}
                            >
                              <option value="Student Delegate">Student Delegate</option>
                              <option value="Faculty / Academician">Faculty / Academician</option>
                              <option value="Industry Professional">Industry Professional</option>
                              <option value="Startup Founder / Innovator">Startup Founder / Innovator</option>
                              <option value="Creative / Designer / Artist">Creative / Designer / Artist</option>
                            </select>
                          </div>

                          {/* Field / Department */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Field / Department *
                            </label>
                            <input
                              type="text"
                              value={form.field}
                              onChange={(e) => updateField("field", e.target.value)}
                              placeholder="e.g. AI & Data Science / Biotechnology"
                              className={`w-full h-12 px-4 rounded-xl border bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.field ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028]"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.field && <span className="text-[11px] text-[#EB0028] block">{errors.field}</span>}
                          </div>

                          {/* Year of Study / Experience */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Year of Study / Seniority
                            </label>
                            <input
                              type="text"
                              value={form.year}
                              onChange={(e) => updateField("year", e.target.value)}
                              placeholder="e.g. 3rd Year / 4 Years Exp."
                              className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#EB0028] transition-all"
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                          </div>

                          {/* LinkedIn / Portfolio Profile (Optional) */}
                          <div className="space-y-2">
                            <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              LinkedIn / Portfolio URL (Optional)
                            </label>
                            <input
                              type="url"
                              value={form.linkedin}
                              onChange={(e) => updateField("linkedin", e.target.value)}
                              placeholder="https://linkedin.com/in/username"
                              className="w-full h-12 px-4 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#EB0028] transition-all"
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                          </div>
                        </div>

                        {/* Motivation Statement */}
                        <div className="space-y-2">
                          <label className="text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                            Why do you want to attend TEDx KLH 2026 (METAMORPHOSIS)? *
                          </label>
                          <textarea
                            rows={3}
                            value={form.motivation}
                            onChange={(e) => updateField("motivation", e.target.value)}
                            placeholder="Share your interest in this year's Metamorphosis theme and what you hope to experience or learn..."
                            className={`w-full p-4 rounded-xl border bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none transition-all resize-none ${
                              errors.motivation ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028]"
                            }`}
                            style={{ fontFamily: "var(--font-manrope)" }}
                          />
                          {errors.motivation && <span className="text-[11px] text-[#EB0028] block">{errors.motivation}</span>}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: PAYMENT VERIFICATION */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2
                            className="text-xl font-bold text-white uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                          >
                            Payment &amp; UTR Verification
                          </h2>
                          <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                            Scan the official summit QR code or transfer to the UPI ID, then enter your 12-digit UTR reference.
                          </p>
                        </div>

                        {/* Payment Card with QR & UPI */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-6">
                          {/* QR Code Container */}
                          <div className="w-36 h-36 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.15)] relative group">
                            <div className="w-full h-full border border-black/20 rounded-lg flex flex-col items-center justify-center bg-white text-black p-2 text-center">
                              <QrCode className="w-20 h-20 text-black mb-1" />
                              <span className="text-[8px] font-mono font-bold tracking-tighter text-black">SCAN TO PAY</span>
                            </div>
                          </div>

                          {/* UPI & Pass Fee Information */}
                          <div className="space-y-3 flex-grow text-center sm:text-left">
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-[#EB0028] font-bold">
                                OFFICIAL DELEGATE PASS TICKET
                              </span>
                              <div className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>
                                ₹499 <span className="text-xs font-normal text-white/50">/ Delegate</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                              <div className="px-3.5 py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white/90 flex items-center gap-2">
                                <span>UPI: tedxklh@upi</span>
                                <button
                                  type="button"
                                  onClick={() => copyUpi("tedxklh@upi")}
                                  className="text-white/50 hover:text-[#EB0028] transition-colors"
                                  title="Copy UPI ID"
                                >
                                  {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                              {copiedUpi && (
                                <span className="text-[11px] text-emerald-400 font-mono">Copied!</span>
                              )}
                            </div>

                            <p className="text-[11px] text-white/50 leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
                              Includes summit admission, kit, delegate luncheon &amp; verified certificate.
                            </p>
                          </div>
                        </div>

                        {/* UTR NUMBER INPUT (Strictly 12 digits numeric) */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-xs uppercase text-white/90 font-bold tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              12-Digit UTR Number *
                            </label>
                            <span className="text-[11px] text-white/40 font-mono">
                              {form.utrNumber.length} / 12 Digits
                            </span>
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            maxLength={12}
                            minLength={12}
                            pattern="[0-9]{12}"
                            value={form.utrNumber}
                            onChange={handleUtrChange}
                            placeholder="Enter 12-digit numeric UTR (e.g. 428901234567)"
                            className={`w-full h-12 px-4 rounded-xl border bg-white/[0.03] text-white text-base tracking-widest font-mono placeholder-white/25 focus:outline-none transition-all ${
                              errors.utrNumber ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/15 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                            }`}
                          />
                          {errors.utrNumber ? (
                            <span className="text-[11px] text-[#EB0028] block">{errors.utrNumber}</span>
                          ) : (
                            <span className="text-[10px] text-white/40 font-mono block">
                              Found on your payment receipt from GPay / PhonePe / Paytm / Bank App.
                            </span>
                          )}
                        </div>

                        {/* PAYMENT SCREENSHOT UPLOAD */}
                        <div className="space-y-2">
                          <label className="text-xs uppercase text-white/90 font-bold tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                            Payment Screenshot Upload *
                          </label>

                          {!form.screenshotBase64 ? (
                            <div
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={handleDrop}
                              onClick={() => fileInputRef.current?.click()}
                              className={`w-full p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                                isDragging
                                  ? "border-[#EB0028] bg-[#EB0028]/10"
                                  : "border-white/15 bg-white/[0.02] hover:border-[#EB0028]/50 hover:bg-white/[0.04]"
                              }`}
                            >
                              <div className="w-12 h-12 rounded-full bg-[#EB0028]/10 border border-[#EB0028]/30 flex items-center justify-center text-[#EB0028]">
                                <Upload className="w-5 h-5" />
                              </div>
                              <div className="text-center space-y-1">
                                <div className="text-sm font-semibold text-white">
                                  Drag &amp; drop payment screenshot, or <span className="text-[#EB0028]">Browse</span>
                                </div>
                                <div className="text-[11px] text-white/40 font-mono">
                                  PNG, JPG, or JPEG · Maximum 5 MB
                                </div>
                              </div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleFileInput}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            /* Uploaded Preview Card */
                            <div className="p-4 rounded-2xl border border-white/15 bg-white/[0.03] flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5 overflow-hidden">
                                {form.screenshotBase64 && (
                                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0 relative">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={form.screenshotBase64}
                                      alt="Screenshot Preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="space-y-0.5 overflow-hidden">
                                  <div className="text-xs font-semibold text-white truncate max-w-[220px] sm:max-w-xs">
                                    {form.screenshotName}
                                  </div>
                                  <div className="text-[10px] text-white/50 font-mono">
                                    {form.screenshotSize} · Verified format
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="text-xs text-white/60 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 transition-colors"
                                >
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={removeFile}
                                  className="p-1.5 rounded-lg border border-white/10 hover:border-red-500/50 text-white/60 hover:text-red-400 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/png, image/jpeg, image/jpg"
                                  onChange={handleFileInput}
                                  className="hidden"
                                />
                              </div>
                            </div>
                          )}

                          {errors.screenshot && (
                            <span className="text-[11px] text-[#EB0028] block">{errors.screenshot}</span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: REVIEW & CONFIRMATION */}
                    {step === 4 && (
                      <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2
                            className="text-xl font-bold text-white uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                          >
                            Review &amp; Submit Application
                          </h2>
                          <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                            Review your delegate application coordinates before final dispatch.
                          </p>
                        </div>

                        {/* Summary Details Box */}
                        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Delegate Name</span>
                              <span className="font-semibold text-white">{form.firstName} {form.lastName}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Email Address</span>
                              <span className="font-semibold text-white truncate">{form.email}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Phone Coordinate</span>
                              <span className="font-semibold text-white font-mono">{form.phone}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Organization &amp; City</span>
                              <span className="font-semibold text-white">{form.organization} · {form.city}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Category &amp; Field</span>
                              <span className="font-semibold text-white">{form.role} ({form.field})</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-white/40 uppercase font-mono block">UTR Number</span>
                              <span className="font-semibold text-[#EB0028] font-mono tracking-wider">{form.utrNumber}</span>
                            </div>
                          </div>
                        </div>

                        {/* Terms & Code of Conduct Checkbox */}
                        <div className="p-4 rounded-xl border border-white/10 bg-white/[0.01] space-y-2">
                          <label className="flex items-start gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={form.termsAccepted}
                              onChange={(e) => updateField("termsAccepted", e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-white/20 bg-black text-[#EB0028] focus:ring-[#EB0028] focus:ring-offset-0 cursor-pointer"
                            />
                            <span className="text-xs text-white/80 leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
                              I confirm that all provided details and the 12-digit UTR payment transaction are authentic. I agree to uphold the official TEDx code of conduct and event policies.
                            </span>
                          </label>
                          {errors.termsAccepted && (
                            <span className="text-[11px] text-[#EB0028] block pl-7">{errors.termsAccepted}</span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Form Action Controls: Back & Next / Submit */}
                  <div className="flex items-center justify-between gap-4 pt-8 border-t border-white/10 mt-8">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="px-6 py-3 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer"
                        style={{ fontFamily: "var(--font-sora)" }}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Previous Step</span>
                      </button>
                    ) : (
                      <Link
                        href="/"
                        className="px-5 py-3 rounded-full border border-white/10 text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors flex items-center gap-2"
                        style={{ fontFamily: "var(--font-dm-mono)" }}
                      >
                        <Home className="w-3.5 h-3.5" />
                        <span>Back to Home</span>
                      </Link>
                    )}

                    <Magnetic range={40} strength={0.25}>
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={isSubmitting}
                        className="relative h-12 sm:h-13 px-8 rounded-full font-bold text-xs uppercase tracking-[0.16em] text-white flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(235,0,40,0.45)] hover:shadow-[0_8px_40px_rgba(235,0,40,0.7)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                          background: "linear-gradient(135deg, #EB0028 0%, #FF454A 100%)",
                          fontFamily: "var(--font-sora)",
                          fontWeight: 700,
                        }}
                      >
                        {/* Hover Light Sweep */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>VERIFYING &amp; SUBMITTING...</span>
                          </div>
                        ) : step === 4 ? (
                          <div className="flex items-center gap-2 relative z-10">
                            <span>SUBMIT APPLICATION</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 relative z-10">
                            <span>CONTINUE TO STEP 0{step + 1}</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        ) : (
          /* SUCCESS SCREEN: APPLICATION RECEIVED */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl border border-white/15 bg-black/85 backdrop-blur-3xl shadow-[0_30px_90px_rgba(235,0,40,0.25)] text-center space-y-8 relative overflow-hidden"
          >
            {/* Top Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

            {/* Success Badge */}
            <div className="w-20 h-20 rounded-full bg-[#EB0028]/15 border border-[#EB0028]/40 flex items-center justify-center text-[#EB0028] mx-auto shadow-[0_0_35px_rgba(235,0,40,0.4)]">
              <CheckCircle2 className="w-10 h-10 text-[#EB0028]" />
            </div>

            <div className="space-y-3">
              <div
                className="text-xs uppercase tracking-[0.3em] text-[#EB0028] font-bold"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                DISPATCH PROTOCOL COMPLETE
              </div>
              <h2
                className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
              >
                APPLICATION RECEIVED
              </h2>
              <p
                className="text-sm text-white/70 max-w-md mx-auto leading-relaxed"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Your delegate pass application has been submitted successfully. Our curation team will verify your UTR credentials and dispatch your official entry badge to <span className="text-white font-semibold">{form.email}</span>.
              </p>
            </div>

            {/* Holographic Delegate Reference Pass */}
            <div className="p-6 rounded-2xl border border-white/15 bg-gradient-to-br from-white/[0.04] to-white/[0.01] backdrop-blur-xl text-left space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] uppercase font-mono text-[#EB0028] font-bold">EVENT SUMMIT</div>
                  <div className="text-sm font-bold text-white tracking-wider" style={{ fontFamily: "var(--font-sora)" }}>
                    TEDx KLH 2026 · METAMORPHOSIS
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-mono text-white/40">APPLICATION ID</div>
                  <div className="text-xs font-mono font-bold text-white">{passId}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">DELEGATE</span>
                  <span className="font-semibold text-white">{form.firstName} {form.lastName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 uppercase font-mono block">DATE &amp; VENUE</span>
                  <span className="font-semibold text-white">NOV 4, 2026 · BOWRAMPET</span>
                </div>
              </div>
            </div>

            {/* Navigation and Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Magnetic range={40} strength={0.25}>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-white shadow-[0_4px_25px_rgba(235,0,40,0.4)] hover:shadow-[0_6px_35px_rgba(235,0,40,0.65)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #EB0028 0%, #FF454A 100%)",
                    fontFamily: "var(--font-sora)",
                    fontWeight: 700,
                  }}
                >
                  <Home className="w-4 h-4" />
                  <span>BACK TO HOME</span>
                </Link>
              </Magnetic>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                <Download className="w-4 h-4" />
                <span>SAVE APPLICATION SUMMARY</span>
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
