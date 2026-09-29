"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  LogOut,
  Shield,
  Home,
  ExternalLink,
} from "lucide-react";
import Magnetic from "@/components/Magnetic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    async function checkAdmin() {
      try {
        const res = await fetch("/api/admin/auth/me");
        const data = await res.json();

        if (!res.ok || !data.authenticated) {
          router.replace("/admin/login");
        } else {
          setAdminEmail(data.admin.email);
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error(err);
        router.replace("/admin/login");
      }
    }

    checkAdmin();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.replace("/admin/login");
    } catch (err) {
      console.error(err);
      router.replace("/admin/login");
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-[#EB0028] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-white/50 tracking-widest uppercase">
          Verifying administrative authorization...
        </span>
      </div>
    );
  }

  const navLinks = [
    { name: "Overview", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "Applications", href: "/admin/applications", icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col">
      {/* Admin Top Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-2xl px-4 sm:px-8 py-3.5">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          {/* Left: Brand & Title */}
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 group">
              <Image
                src="/logo-white.png"
                alt="TEDx KLH"
                width={130}
                height={36}
                className="h-6 sm:h-7 w-auto object-contain brightness-110"
              />
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EB0028]/20 text-[#EB0028] border border-[#EB0028]/40 uppercase tracking-widest">
                DELEGATE DESK
              </span>
            </Link>

            {/* Nav Tabs */}
            <nav className="hidden sm:flex items-center gap-1 pl-4 border-l border-white/10">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
                      isActive
                        ? "bg-[#EB0028] text-white shadow-[0_0_15px_rgba(235,0,40,0.4)] font-bold"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                    style={{ fontFamily: "var(--font-sora)" }}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: User Email + Live Site + Logout */}
          <div className="flex items-center gap-3">
            {adminEmail && (
              <span
                className="hidden lg:inline-block text-xs font-mono text-white/50 px-3 py-1 rounded-full border border-white/5 bg-white/[0.02]"
                title={adminEmail}
              >
                {adminEmail}
              </span>
            )}

            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              style={{ fontFamily: "var(--font-dm-mono)" }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-[1440px] w-full mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="border-t border-white/10 bg-black/40 py-4 px-4 sm:px-8 text-center text-xs text-white/40 font-mono">
        TEDx KLH 2026 · Confidential Delegate Administration &amp; Verification Protocol
      </footer>
    </div>
  );
}
