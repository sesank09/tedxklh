"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  MapPin,
  Home,
  User,
  CreditCard,
  Hash,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Magnetic from "@/components/Magnetic";

interface ApplicationData {
  application_number: string;
  first_name: string;
  application_status: string;
  payment_status: string;
  delegate_id: string | null;
  created_at: string;
}

export default function ApplicationStatusPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApplicationData | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (!email.trim() || !cleanPhone) {
      setError("Please provide both your registered Email Address and 10-digit Mobile Number.");
      return;
    }

    if (cleanPhone.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/application-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: cleanPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No matching application found.");
        setLoading(false);
        return;
      }

      setResult(data.application);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again later.");
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "APPROVED & ACCREDITED",
          className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
          icon: <CheckCircle2 className="w-4 h-4" />,
        };
      case "rejected":
        return {
          label: "NOT SELECTED",
          className: "bg-red-500/15 text-red-400 border-red-500/40",
          icon: <XCircle className="w-4 h-4" />,
        };
      case "under_review":
        return {
          label: "UNDER CURATORIAL REVIEW",
          className: "bg-amber-500/15 text-amber-400 border-amber-500/40",
          icon: <Clock className="w-4 h-4" />,
        };
      default:
        return {
          label: "APPLICATION SUBMITTED",
          className: "bg-sky-500/15 text-sky-400 border-sky-500/40",
          icon: <Clock className="w-4 h-4" />,
        };
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "verified":
        return {
          label: "PAYMENT VERIFIED",
          className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        };
      case "rejected":
        return {
          label: "PAYMENT REJECTED",
          className: "text-red-400 bg-red-500/10 border-red-500/30",
        };
      default:
        return {
          label: "VERIFICATION PENDING",
          className: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        };
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-x-clip">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[500px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.12),transparent_70%)] blur-3xl" />
      </div>

      <Navbar />

      <main className="relative z-10 pt-36 sm:pt-44 md:pt-48 pb-28 px-4 sm:px-8 max-w-[1000px] mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#EB0028]/40 bg-[#EB0028]/10 shadow-[0_0_20px_rgba(235,0,40,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-[#EB0028]" />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/90"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              DELEGATE STATUS TRACKER
            </span>
          </div>

          <h1
            className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            TRACK <span className="text-[#EB0028]">YOUR APPLICATION</span>
          </h1>

          <p
            className="text-xs sm:text-sm text-white/60 font-normal leading-relaxed"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Enter your registered Email Address and Mobile Number to instantly check your admission and payment verification status.
          </p>
        </div>

        {/* Lookup Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 sm:p-10 rounded-3xl border border-white/10 bg-black/75 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

          <form onSubmit={handleLookup} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label
                  className="text-xs uppercase text-white/80 font-medium tracking-wider"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  Registered Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. yourname@domain.com"
                  className="w-full h-12 px-4 rounded-xl border border-white/15 bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#EB0028] transition-all"
                  style={{ fontFamily: "var(--font-manrope)" }}
                />
              </div>

              <div className="space-y-2">
                <label
                  className="text-xs uppercase text-white/80 font-medium tracking-wider"
                  style={{ fontFamily: "var(--font-dm-mono)" }}
                >
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full h-12 px-4 rounded-xl border border-white/15 bg-white/[0.03] text-white font-mono text-sm tracking-wider placeholder-white/25 focus:outline-none focus:border-[#EB0028] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end">
              <Magnetic range={40} strength={0.25}>
                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 px-8 rounded-full font-bold text-xs uppercase tracking-widest text-white flex items-center gap-2 shadow-[0_4px_25px_rgba(235,0,40,0.4)] hover:shadow-[0_6px_35px_rgba(235,0,40,0.65)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                  style={{
                    background: "linear-gradient(135deg, #EB0028 0%, #FF454A 100%)",
                    fontFamily: "var(--font-sora)",
                    fontWeight: 700,
                  }}
                >
                  {loading ? (
                    <span>LOOKING UP...</span>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>CHECK STATUS</span>
                    </>
                  )}
                </button>
              </Magnetic>
            </div>
          </form>

          {/* Result Card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-white/10 space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-white/40 block">
                    APPLICATION IDENTIFIER
                  </span>
                  <div
                    className="text-xl font-bold text-white font-mono tracking-wider"
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    {result.application_number}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                      getStatusBadge(result.application_status).className
                    }`}
                    style={{ fontFamily: "var(--font-dm-mono)" }}
                  >
                    {getStatusBadge(result.application_status).icon}
                    <span>{getStatusBadge(result.application_status).label}</span>
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-full border text-xs font-mono uppercase font-semibold ${
                      getPaymentBadge(result.payment_status).className
                    }`}
                  >
                    {getPaymentBadge(result.payment_status).label}
                  </span>
                </div>
              </div>

              {/* Accredited Delegate Pass Badge (If Approved) */}
              {result.delegate_id && (
                <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-emerald-400 font-bold tracking-widest flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      OFFICIAL DELEGATE CREDENTIAL
                    </span>
                    <span className="text-xs font-mono text-emerald-300 font-bold">CONFIRMED SEAT</span>
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono tracking-widest">
                    {result.delegate_id}
                  </div>
                  <p className="text-xs text-emerald-300/80 leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
                    Please bring a digital or printed copy of this Delegate ID along with a valid photo ID to the TEDx KLH registration desk on November 4, 2026.
                  </p>
                </div>
              )}

              {/* Explanation Note */}
              <div className="text-xs text-white/50 leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
                {result.application_status === "submitted" && (
                  <p>
                    Your application has been received and is queued for verification by the curatorial team. You will be notified once payment verification is complete.
                  </p>
                )}
                {result.application_status === "under_review" && (
                  <p>
                    Your profile is currently under review by our curation board. Final admission decisions will be finalized soon.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Back Link */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors"
            style={{ fontFamily: "var(--font-dm-mono)" }}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Homepage</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
