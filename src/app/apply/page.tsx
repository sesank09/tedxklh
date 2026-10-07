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
  Download,
  Home,
  Search,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Magnetic from "@/components/Magnetic";

interface FormData {
  // Phase 1: Personal
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  city: string;

  // Phase 2: Payment
  utrNumber: string;
  screenshotBase64: string | null;
  screenshotName: string | null;
  screenshotSize: string | null;

  // Phase 3: Terms
  termsAccepted: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  organization: "",
  city: "",
  utrNumber: "",
  screenshotBase64: null,
  screenshotName: null,
  screenshotSize: null,
  termsAccepted: false,
};

const STEPS = [
  { id: 1, name: "PERSONAL", title: "Personal Information", desc: "Identity and contact coordinates" },
  { id: 2, name: "PAYMENT", title: "Payment & Verification", desc: "12-digit UTR reference & screenshot" },
  { id: 3, name: "CONFIRM", title: "Review & Dispatch", desc: "Verify application and accept charter" },
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
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [passId, setPassId] = useState("");
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore autosaved draft
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tedxklh_apply_draft_v2");
      if (saved) {
        setForm(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateField = (field: keyof FormData, val: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      try {
        localStorage.setItem("tedxklh_apply_draft_v2", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setSubmitError(null);

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

  // File upload validation & handler with atomic state update
  const processFile = (file: File) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next.screenshot;
      return next;
    });

    const fileExt = file.name.split(".").pop()?.toLowerCase() || "";
    const isImage = file.type.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "heic", "heif"].includes(fileExt);

    if (!isImage) {
      setErrors((prev) => ({ ...prev, screenshot: "Please upload a valid image file (JPG, PNG, or WEBP)." }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, screenshot: "File size exceeds 5MB limit. Please upload a smaller image." }));
      return;
    }

    setScreenshotFile(file);
    const sizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + " MB";

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setForm((prev) => {
        const updated = {
          ...prev,
          screenshotBase64: base64,
          screenshotName: file.name,
          screenshotSize: sizeFormatted,
        };
        try {
          localStorage.setItem("tedxklh_apply_draft_v2", JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
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
    setScreenshotFile(null);
    setForm((prev) => {
      const updated = {
        ...prev,
        screenshotBase64: null,
        screenshotName: null,
        screenshotSize: null,
      };
      try {
        localStorage.setItem("tedxklh_apply_draft_v2", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyUpi = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  // Step Validation for 3 Phases
  const validateStep = (currentStep: number): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.firstName.trim()) errs.firstName = "First name is required";
      if (!form.lastName.trim()) errs.lastName = "Last name is required";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid official email is required";
      const digits = form.phone.replace(/\D/g, "");
      if (!digits || digits.length < 10) errs.phone = "Valid 10-digit phone number is required";
      if (!form.organization.trim()) errs.organization = "College / University or Organization is required";
      if (!form.city.trim()) errs.city = "Current city is required";
    } else if (currentStep === 2) {
      const cleanUtr = form.utrNumber.trim();
      if (!/^\d{12}$/.test(cleanUtr)) {
        errs.utrNumber = "UTR Number must be exactly 12 numeric digits";
      }
      if (!form.screenshotBase64 && !screenshotFile) {
        errs.screenshot = "Payment screenshot upload is required for transaction verification";
      }
    } else if (currentStep === 3) {
      if (!form.termsAccepted) {
        errs.termsAccepted = "You must agree to the TEDx Code of Conduct & Summit Guidelines";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
        window.scrollTo({ top: 320, behavior: "smooth" });
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 320, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("firstName", form.firstName.trim());
      formData.append("lastName", form.lastName.trim());
      formData.append("email", form.email.trim().toLowerCase());
      formData.append("phone", form.phone.replace(/\D/g, ""));
      formData.append("organization", form.organization.trim());
      formData.append("city", form.city.trim());
      formData.append("utrNumber", form.utrNumber.replace(/\D/g, ""));

      // Attach file binary
      if (screenshotFile) {
        formData.append("screenshot", screenshotFile);
      } else if (form.screenshotBase64) {
        // Convert existing base64 to file blob if restoring from draft
        const resBlob = await fetch(form.screenshotBase64);
        const blob = await resBlob.blob();
        const fileFromBlob = new File([blob], form.screenshotName || "payment-proof.jpg", { type: blob.type || "image/jpeg" });
        formData.append("screenshot", fileFromBlob);
      }

      const response = await fetch("/api/apply", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setSubmitError(data.error || "Failed to submit application. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setPassId(data.application_number || "TEDXKLH-RECEIVED");
      setIsSubmitting(false);
      setIsSubmitted(true);

      try {
        localStorage.removeItem("tedxklh_apply_draft_v2");
      } catch (e) {}

      confetti({
        particleCount: 180,
        spread: 100,
        origin: { y: 0.55 },
        colors: ["#EB0028", "#FFFFFF", "#FF454A", "#1a1a1a"],
      });
      window.scrollTo({ top: 140, behavior: "smooth" });
    } catch (err: any) {
      console.error("Submission network error:", err);
      setSubmitError("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
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

      {/* Main Container with generous top spacing to prevent any overlap with floating navbar */}
      <main className="relative z-10 pt-36 sm:pt-44 md:pt-48 pb-28 px-4 sm:px-8 md:px-12 max-w-[1440px] mx-auto space-y-12">
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

              {/* Protocol Flow Card (3 Phases) */}
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
                <a href="mailto:tedxklhbowrampet@klh.edu.in" className="text-[#EB0028] font-semibold hover:underline" style={{ fontFamily: "var(--font-dm-mono)" }}>
                  tedxklhbowrampet@klh.edu.in
                </a>
              </div>
            </motion.div>

            {/* RIGHT COLUMN (8 cols): 3-Phase Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-8 w-full"
            >
              <div className="w-full p-4 xs:p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85)] border border-white/10 bg-black/75 backdrop-blur-2xl">
                {/* Glowing Top Ambient Line */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

                {/* Form Progress Indicator Header */}
                <div className="space-y-4 sm:space-y-5 pb-6 sm:pb-8 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#EB0028] animate-ping" />
                      <span
                        className="text-[11px] sm:text-xs font-bold tracking-[0.16em] sm:tracking-[0.2em] text-[#EB0028] uppercase"
                        style={{ fontFamily: "var(--font-dm-mono)" }}
                      >
                        STEP 0{step} OF 03 · {STEPS[step - 1].name}
                      </span>
                    </div>

                    <span
                      className="text-[10px] sm:text-[11px] text-white/40 tracking-wider uppercase font-mono"
                      style={{ fontFamily: "var(--font-dm-mono)" }}
                    >
                      {Math.round((step / 3) * 100)}% COMPLETE
                    </span>
                  </div>

                  {/* 3 Steps Indicator Tabs */}
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
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
                          className={`py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl border text-[9px] xs:text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 text-center relative overflow-hidden ${
                            isCurrent
                              ? "border-[#EB0028] bg-[#EB0028]/15 text-[#EB0028] shadow-[0_0_18px_rgba(235,0,40,0.25)] font-bold"
                              : isDone
                              ? "border-white/20 bg-white/5 text-white hover:border-white/40 cursor-pointer"
                              : "border-white/5 bg-white/[0.02] text-white/30 cursor-not-allowed"
                          }`}
                          style={{ fontFamily: "var(--font-dm-mono)" }}
                        >
                          <span className="opacity-70">0{s.id}. </span>
                          <span>{s.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Step Form Panes */}
                <div className="pt-6 sm:pt-8">
                  <AnimatePresence mode="wait">
                    {/* PHASE 1: PERSONAL INFORMATION */}
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
                            className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                          >
                            Personal Information
                          </h2>
                          <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                            Enter your legal name and contact details for badge issuing and summit accreditation.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                          {/* First Name */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[11px] sm:text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              First Name *
                            </label>
                            <input
                              type="text"
                              value={form.firstName}
                              onChange={(e) => updateField("firstName", e.target.value)}
                              placeholder="e.g. John"
                              className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border bg-white/[0.03] text-white text-base sm:text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.firstName ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.firstName && <span className="text-[11px] text-[#EB0028] block">{errors.firstName}</span>}
                          </div>

                          {/* Last Name */}
                          {/* Last Name */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[11px] sm:text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Last Name *
                            </label>
                            <input
                              type="text"
                              value={form.lastName}
                              onChange={(e) => updateField("lastName", e.target.value)}
                              placeholder="e.g. Doe"
                              className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border bg-white/[0.03] text-white text-base sm:text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.lastName ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.lastName && <span className="text-[11px] text-[#EB0028] block">{errors.lastName}</span>}
                          </div>

                          {/* Email Address */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[11px] sm:text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Official Email Address *
                            </label>
                            <input
                              type="email"
                              value={form.email}
                              onChange={(e) => updateField("email", e.target.value)}
                              placeholder="e.g. yourname@domain.com"
                              className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border bg-white/[0.03] text-white text-base sm:text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.email ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.email && <span className="text-[11px] text-[#EB0028] block">{errors.email}</span>}
                          </div>

                          {/* Phone Number */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[11px] sm:text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              Phone Number (10 Digits) *
                            </label>
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={form.phone}
                              onChange={(e) => updateField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                              placeholder="e.g. 9876543210"
                              maxLength={10}
                              className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border bg-white/[0.03] text-white text-base sm:text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.phone ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.phone && <span className="text-[11px] text-[#EB0028] block">{errors.phone}</span>}
                          </div>

                          {/* College / Organization */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[11px] sm:text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              College / Organization *
                            </label>
                            <input
                              type="text"
                              value={form.organization}
                              onChange={(e) => updateField("organization", e.target.value)}
                              placeholder="e.g. KL University / Microsoft / Startup"
                              className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border bg-white/[0.03] text-white text-base sm:text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.organization ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.organization && <span className="text-[11px] text-[#EB0028] block">{errors.organization}</span>}
                          </div>

                          {/* City */}
                          <div className="space-y-1.5 sm:space-y-2">
                            <label className="text-[11px] sm:text-xs uppercase text-white/80 font-medium tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
                              City *
                            </label>
                            <input
                              type="text"
                              value={form.city}
                              onChange={(e) => updateField("city", e.target.value)}
                              placeholder="e.g. Hyderabad"
                              className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border bg-white/[0.03] text-white text-base sm:text-sm placeholder-white/25 focus:outline-none transition-all ${
                                errors.city ? "border-[#EB0028] ring-1 ring-[#EB0028]" : "border-white/10 focus:border-[#EB0028] focus:ring-1 focus:ring-[#EB0028]/50"
                              }`}
                              style={{ fontFamily: "var(--font-manrope)" }}
                            />
                            {errors.city && <span className="text-[11px] text-[#EB0028] block">{errors.city}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* PHASE 2: PAYMENT VERIFICATION */}
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
                            Payment &amp; UTR Verification
                          </h2>
                          <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                            Scan the official summit QR code or transfer to the UPI ID, then enter your 12-digit UTR reference.
                          </p>
                        </div>

                        {/* Payment Card with QR & UPI */}
                        <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
                          {/* QR Code Container */}
                          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-white p-2.5 flex items-center justify-center shrink-0 shadow-[0_0_30px_rgba(255,255,255,0.15)] relative group">
                            <div className="w-full h-full border border-black/20 rounded-lg flex flex-col items-center justify-center bg-white text-black p-2 text-center">
                              <QrCode className="w-16 h-16 sm:w-20 sm:h-20 text-black mb-1" />
                              <span className="text-[8px] font-mono font-bold tracking-tighter text-black">SCAN TO PAY</span>
                            </div>
                          </div>

                          {/* UPI & Pass Fee Information */}
                          <div className="space-y-2.5 sm:space-y-3 flex-grow text-center sm:text-left w-full sm:w-auto">
                            <div>
                              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#EB0028] font-bold">
                                OFFICIAL DELEGATE PASS TICKET
                              </span>
                              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}>
                                ₹499 <span className="text-xs font-normal text-white/50">/ Delegate</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                              <div className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-black/60 border border-white/15 text-xs font-mono text-white/90 flex items-center gap-2">
                                <span>UPI: tedxklh@upi</span>
                                <button
                                  type="button"
                                  onClick={() => copyUpi("tedxklh@upi")}
                                  className="text-white/50 hover:text-[#EB0028] transition-colors p-0.5"
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
                        <div className="space-y-1.5 sm:space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] sm:text-xs uppercase text-white/90 font-bold tracking-wider" style={{ fontFamily: "var(--font-dm-mono)" }}>
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
                            placeholder="Enter 12-digit numeric UTR"
                            className={`w-full h-11 sm:h-12 px-3.5 sm:px-4 rounded-xl border bg-white/[0.03] text-white text-base tracking-widest font-mono placeholder-white/25 focus:outline-none transition-all ${
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
                        <div className="space-y-1.5 sm:space-y-2">
                          <label className="text-[11px] sm:text-xs uppercase text-white/90 font-bold tracking-wider flex items-center justify-between" style={{ fontFamily: "var(--font-dm-mono)" }}>
                            <span>Payment Screenshot Upload *</span>
                            {form.screenshotBase64 && (
                              <span className="text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                ATTACHED
                              </span>
                            )}
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
                              className={`w-full p-6 sm:p-8 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
                                isDragging
                                  ? "border-[#EB0028] bg-[#EB0028]/10"
                                  : "border-white/15 bg-white/[0.02] hover:border-[#EB0028]/50 hover:bg-white/[0.04]"
                              }`}
                            >
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#EB0028]/10 border border-[#EB0028]/30 flex items-center justify-center text-[#EB0028]">
                                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                              </div>
                              <div className="text-center space-y-1">
                                <div className="text-xs sm:text-sm font-semibold text-white">
                                  Drag &amp; drop screenshot, or <span className="text-[#EB0028]">Browse</span>
                                </div>
                                <div className="text-[10px] sm:text-[11px] text-white/40 font-mono">
                                  PNG, JPG, JPEG, or WEBP · Max 5 MB
                                </div>
                              </div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileInput}
                                className="hidden"
                              />
                            </div>
                          ) : (
                            /* Uploaded Preview Card with Unmistakable Success Indication */
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500/40 bg-emerald-950/20 backdrop-blur-xl space-y-3 relative overflow-hidden shadow-[0_0_25px_rgba(16,185,129,0.12)]"
                            >
                              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2.5">
                                <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] sm:text-xs font-bold font-mono uppercase tracking-wider">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>RECEIPT ATTACHED</span>
                                </div>
                                <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                                  READY TO SUBMIT
                                </span>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-emerald-500/30 shrink-0 relative bg-black/40 shadow-inner group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={form.screenshotBase64}
                                      alt="Screenshot Preview"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                  </div>
                                  <div className="space-y-0.5 overflow-hidden min-w-0">
                                    <div className="text-xs font-bold text-white truncate max-w-[180px] sm:max-w-xs">
                                      {form.screenshotName}
                                    </div>
                                    <div className="text-[10px] sm:text-[11px] text-emerald-300/80 font-mono truncate">
                                      {form.screenshotSize} · Valid Format
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                  <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 transition-all font-semibold cursor-pointer"
                                  >
                                    Change
                                  </button>
                                  <button
                                    type="button"
                                    onClick={removeFile}
                                    title="Remove image"
                                    className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileInput}
                                className="hidden"
                              />
                            </motion.div>
                          )}

                          {errors.screenshot && (
                            <span className="text-[11px] text-[#EB0028] block">{errors.screenshot}</span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* PHASE 3: REVIEW & CONFIRMATION */}
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
                            className="text-lg sm:text-xl font-bold text-white uppercase tracking-tight"
                            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                          >
                            Review &amp; Submit Application
                          </h2>
                          <p className="text-xs text-white/50 mt-1" style={{ fontFamily: "var(--font-manrope)" }}>
                            Review your delegate application coordinates before final dispatch.
                          </p>
                        </div>

                        {/* Summary Details Box */}
                        <div className="p-4 sm:p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 text-xs">
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Delegate Name</span>
                              <span className="font-semibold text-white break-words">{form.firstName} {form.lastName}</span>
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Email Address</span>
                              <span className="font-semibold text-white break-all">{form.email}</span>
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Phone Coordinate</span>
                              <span className="font-semibold text-white font-mono">{form.phone}</span>
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-[10px] text-white/40 uppercase font-mono block">Organization &amp; City</span>
                              <span className="font-semibold text-white break-words">{form.organization} · {form.city}</span>
                            </div>
                            <div className="sm:col-span-2 space-y-0.5 min-w-0">
                              <span className="text-[10px] text-white/40 uppercase font-mono block">UTR Number</span>
                              <span className="font-semibold text-[#EB0028] font-mono tracking-wider break-all">{form.utrNumber}</span>
                            </div>
                          </div>
                        </div>

                        {/* Terms & Code of Conduct Checkbox */}
                        <div className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.01] space-y-2">
                          <label className="flex items-start gap-2.5 sm:gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={form.termsAccepted}
                              onChange={(e) => updateField("termsAccepted", e.target.checked)}
                              className="mt-0.5 sm:mt-1 w-4 h-4 rounded border-white/20 bg-black text-[#EB0028] focus:ring-[#EB0028] focus:ring-offset-0 cursor-pointer shrink-0"
                            />
                            <span className="text-xs text-white/80 leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
                              I confirm that all provided details and the 12-digit UTR payment transaction are authentic. I agree to uphold the official TEDx code of conduct and event policies.
                            </span>
                          </label>
                          {errors.termsAccepted && (
                            <span className="text-[11px] text-[#EB0028] block pl-6 sm:pl-7">{errors.termsAccepted}</span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Global Submit Error Banner */}
                  {submitError && (
                    <div className="p-4 rounded-xl border border-red-500/50 bg-red-500/15 text-red-300 text-xs flex items-start gap-2.5 shadow-lg mt-6">
                      <span className="text-base shrink-0 leading-none">⚠️</span>
                      <div className="space-y-1">
                        <div className="font-bold uppercase tracking-wider text-red-200">Submission Notice</div>
                        <div>{submitError}</div>
                      </div>
                    </div>
                  )}

                  {/* Form Action Controls: Back & Next / Submit */}
                  <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-white/10 mt-6 sm:mt-8">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="w-full sm:w-auto h-12 px-6 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
                        style={{ fontFamily: "var(--font-sora)" }}
                      >
                        <ArrowLeft className="w-4 h-4 shrink-0" />
                        <span>Previous Step</span>
                      </button>
                    ) : (
                      <Link
                        href="/"
                        className="w-full sm:w-auto h-12 px-6 rounded-full border border-white/10 text-white/60 hover:text-white text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 whitespace-nowrap active:scale-95"
                        style={{ fontFamily: "var(--font-dm-mono)" }}
                      >
                        <Home className="w-3.5 h-3.5 shrink-0" />
                        <span>Back to Home</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={isSubmitting}
                      className="w-full sm:w-auto relative h-12 sm:h-13 px-6 sm:px-8 rounded-full font-bold text-xs sm:text-[13px] uppercase tracking-[0.12em] sm:tracking-[0.16em] text-white flex items-center justify-center gap-2 shadow-[0_4px_30px_rgba(235,0,40,0.45)] hover:shadow-[0_8px_40px_rgba(235,0,40,0.7)] active:scale-95 transition-all duration-300 cursor-pointer overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #EB0028 0%, #FF454A 100%)",
                        fontFamily: "var(--font-sora)",
                        fontWeight: 700,
                      }}
                    >
                      {/* Hover Light Sweep */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />

                      {isSubmitting ? (
                        <div className="flex items-center gap-2 relative z-10">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>SUBMITTING...</span>
                        </div>
                      ) : step === 3 ? (
                        <div className="flex items-center gap-2 relative z-10">
                          <span>SUBMIT APPLICATION</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ) : step === 2 ? (
                        <div className="flex items-center gap-2 relative z-10">
                          <span>REVIEW APPLICATION</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 relative z-10">
                          <span>CONTINUE TO PAYMENT</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </button>
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
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Magnetic range={40} strength={0.25}>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest text-white shadow-[0_4px_25px_rgba(235,0,40,0.4)] hover:shadow-[0_6px_35px_rgba(235,0,40,0.65)] hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-2"
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

              <Link
                href="/application-status"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                <Search className="w-4 h-4 text-[#EB0028]" />
                <span>TRACK STATUS</span>
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/10 text-white/80 font-semibold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                <Download className="w-4 h-4" />
                <span>SAVE SUMMARY</span>
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
