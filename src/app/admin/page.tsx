"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  ShieldCheck,
  XCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

interface StatsData {
  total: number;
  pending: number;
  verifiedPayments: number;
  approved: number;
  rejected: number;
}

interface ApplicationSummary {
  id: string;
  application_number: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  college_organization: string;
  city: string;
  application_status: string;
  payment_status: string;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData>({
    total: 0,
    pending: 0,
    verifiedPayments: 0,
    approved: 0,
    rejected: 0,
  });
  const [recentApps, setRecentApps] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, appsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/applications?limit=5&sortBy=newest"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.stats) setStats(statsData.stats);
      }

      if (appsRes.ok) {
        const appsData = await appsRes.json();
        if (appsData.applications) setRecentApps(appsData.applications);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const statCards = [
    {
      title: "TOTAL APPLICATIONS",
      val: stats.total,
      icon: <Users className="w-5 h-5 text-white" />,
      color: "border-white/10 bg-white/[0.02]",
      badge: "Cohort Target: 100",
    },
    {
      title: "PENDING REVIEW",
      val: stats.pending,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      color: "border-amber-500/20 bg-amber-500/[0.02]",
      badge: "Requires Action",
    },
    {
      title: "VERIFIED PAYMENTS",
      val: stats.verifiedPayments,
      icon: <CheckCircle2 className="w-5 h-5 text-sky-400" />,
      color: "border-sky-500/20 bg-sky-500/[0.02]",
      badge: "UTR Confirmed",
    },
    {
      title: "APPROVED DELEGATES",
      val: stats.approved,
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      color: "border-emerald-500/20 bg-emerald-500/[0.02]",
      badge: "Badges Assigned",
    },
    {
      title: "REJECTED",
      val: stats.rejected,
      icon: <XCircle className="w-5 h-5 text-red-400" />,
      color: "border-red-500/20 bg-red-500/[0.02]",
      badge: "Not Selected",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span
            className="text-[11px] font-mono text-[#EB0028] uppercase tracking-widest font-bold block"
          >
            TEDx KLH 2026 // METAMORPHOSIS
          </span>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
          >
            Delegate Management Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-full border border-white/10 hover:border-white/25 text-white/60 hover:text-white transition-colors cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#EB0028]" : ""}`} />
          </button>
          <Link
            href="/admin/applications"
            className="px-5 py-2.5 rounded-full bg-[#EB0028] hover:bg-[#ff1a3c] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(235,0,40,0.35)] transition-all cursor-pointer"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
          >
            <span>Manage All Applications</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border ${card.color} backdrop-blur-xl space-y-3 relative overflow-hidden transition-all hover:border-white/25`}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-[10px] uppercase font-mono text-white/50 tracking-wider font-semibold"
              >
                {card.title}
              </span>
              {card.icon}
            </div>
            <div
              className="text-3xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
            >
              {loading ? "..." : card.val}
            </div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
              {card.badge}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications Section */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2
              className="text-lg font-bold text-white uppercase tracking-tight"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              Recent Submissions
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-manrope)" }}>
              Latest delegate applications received through the portal.
            </p>
          </div>
          <Link
            href="/admin/applications"
            className="text-xs text-[#EB0028] hover:underline font-mono uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All ({stats.total})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/40">
                <th className="py-3 px-3">Application #</th>
                <th className="py-3 px-3">Delegate Name</th>
                <th className="py-3 px-3">Organization / City</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/40 font-mono">
                    Loading applications...
                  </td>
                </tr>
              ) : recentApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-white/40 font-mono space-y-2">
                    <p className="text-sm">0 Applications in Database</p>
                    <p className="text-xs text-white/30">
                      When users submit delegate applications on /apply, they will appear here.
                    </p>
                  </td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-[#EB0028]">
                      {app.application_number}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-white">
                        {app.first_name} {app.last_name}
                      </div>
                      <div className="text-[11px] text-white/40">{app.email}</div>
                    </td>
                    <td className="py-3.5 px-3 text-white/70">
                      {app.college_organization} · {app.city}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold ${
                          app.payment_status === "verified"
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : app.payment_status === "rejected"
                            ? "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                        }`}
                      >
                        {app.payment_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                          app.application_status === "approved"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : app.application_status === "rejected"
                            ? "bg-red-500/20 text-red-400 border border-red-500/40"
                            : "bg-white/10 text-white/70"
                        }`}
                      >
                        {app.application_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="px-3 py-1.5 rounded-lg border border-white/15 hover:border-[#EB0028] bg-white/[0.03] hover:bg-[#EB0028]/10 text-white hover:text-[#EB0028] transition-colors font-mono text-[11px]"
                      >
                        Inspect →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
