"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Magnetic from "@/components/Magnetic";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Please provide both email and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An unexpected network error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white flex flex-col justify-between items-center px-4 py-8 select-none overflow-hidden">
      {/* Background Soft Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[90vw] max-w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(235,0,40,0.14),transparent_70%)] blur-3xl" />
      </div>

      {/* Top Brand */}
      <header className="relative z-10 w-full max-w-[1200px] flex items-center justify-between py-4">
        <Link href="/" className="inline-flex items-center hover:opacity-90 transition-opacity">
          <Image
            src="/logo-white.png"
            alt="TEDx KLH"
            width={160}
            height={44}
            className="h-8 sm:h-9 w-auto object-contain brightness-110"
            priority
          />
        </Link>
        <div className="text-[11px] font-mono uppercase tracking-widest text-[#EB0028] font-bold">
          ADMIN PORTAL // 2026
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md my-auto">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-10 rounded-3xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.85)] space-y-8 relative overflow-hidden"
        >
          {/* Ambient Top Line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#EB0028] to-transparent" />

          {/* Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#EB0028]/10 border border-[#EB0028]/30 flex items-center justify-center text-[#EB0028] mx-auto shadow-[0_0_20px_rgba(235,0,40,0.25)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1
              className="text-2xl font-bold text-white tracking-tight uppercase"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              ORGANIZER ACCESS
            </h1>
            <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-manrope)" }}>
              Authenticate with your administrative credentials to manage delegate admissions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label
                className="text-xs uppercase text-white/70 font-medium tracking-wider"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                Organizer Email
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-white/40 absolute left-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@tedxklh.edu.in"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/15 bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#EB0028] transition-all"
                  style={{ fontFamily: "var(--font-manrope)" }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs uppercase text-white/70 font-medium tracking-wider"
                style={{ fontFamily: "var(--font-dm-mono)" }}
              >
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-white/40 absolute left-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border border-white/15 bg-white/[0.03] text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#EB0028] transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Magnetic range={35} strength={0.2}>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full font-bold text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-[0_4px_25px_rgba(235,0,40,0.4)] hover:shadow-[0_6px_35px_rgba(235,0,40,0.65)] hover:-translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #EB0028 0%, #FF454A 100%)",
                  fontFamily: "var(--font-sora)",
                  fontWeight: 700,
                }}
              >
                {loading ? (
                  <span>AUTHENTICATING...</span>
                ) : (
                  <>
                    <span>AUTHENTICATE &amp; ENTER</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </Magnetic>
          </form>
        </motion.div>
      </main>

      {/* Footer info */}
      <footer className="relative z-10 text-[11px] text-white/40 font-mono text-center">
        TEDx KLH 2026 · Confidential Administrative Environment
      </footer>
    </div>
  );
}
