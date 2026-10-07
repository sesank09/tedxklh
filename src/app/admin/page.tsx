"use client";

import { useEffect, useState, useRef } from "react";
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
  Trash2,
  Volume2,
  VolumeX,
  Radio,
  AlertTriangle,
} from "lucide-react";
import { playNotificationChime } from "@/lib/utils/audio";

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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [latestAlert, setLatestAlert] = useState<string | null>(null);

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<ApplicationSummary | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Track previous count to trigger audio notification on new submissions
  const prevCountRef = useRef<number | null>(null);

  const fetchData = async (isBackground = false) => {
    if (!isBackground) setRefreshing(true);
    try {
      const [statsRes, appsRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/applications?limit=6&sortBy=newest"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.stats) {
          const newTotal = statsData.stats.total;

          // Check if new submission arrived
          if (prevCountRef.current !== null && newTotal > prevCountRef.current) {
            if (soundEnabled) {
              playNotificationChime();
            }
            setLatestAlert(`New delegate submission detected! Total: ${newTotal}`);
            setTimeout(() => setLatestAlert(null), 7000);
          }
          prevCountRef.current = newTotal;
          setStats(statsData.stats);
        }
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

  // Initial fetch and auto-polling every 5 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData(true);
    }, 5000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/applications/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRecentApps((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setStats((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
        setDeleteTarget(null);
      } else {
        alert("Failed to delete application record.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Network error deleting application.");
    } finally {
      setIsDeleting(false);
    }
  };

  const statCards = [
    {
      title: "TOTAL APPLICATIONS",
      val: stats.total,
      icon: <Users className="w-5 h-5 text-white" />,
      color: "border-white/10 bg-white/[0.02]",
      badge: "Live Cohort",
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
      {/* Live Audio Alert Toast Banner */}
      {latestAlert && (
        <div className="p-4 rounded-2xl border border-[#EB0028]/60 bg-[#EB0028]/20 backdrop-blur-2xl text-white flex items-center justify-between shadow-[0_0_30px_rgba(235,0,40,0.35)] animate-pulse">
          <div className="flex items-center gap-3">
            <span className="text-xl">🔔</span>
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider font-mono text-[#EB0028]">
                LIVE APPLICATION ALERT
              </span>
              <p className="text-sm font-semibold">{latestAlert}</p>
            </div>
          </div>
          <button
            onClick={() => setLatestAlert(null)}
            className="text-xs font-mono uppercase text-white/70 hover:text-white px-3 py-1 rounded-lg border border-white/20 bg-white/10"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#EB0028] uppercase tracking-widest font-bold">
              TEDx KLH 2026 • METAMORPHOSIS
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <Radio className="w-3 h-3 text-emerald-400" />
              LIVE FEED
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
          >
            Delegate Management Portal
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) playNotificationChime();
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer ${
              soundEnabled
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-white/5 text-white/50"
            }`}
            title={soundEnabled ? "Sound Notification Active" : "Sound Muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? "Chime On" : "Muted"}</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={() => fetchData()}
            disabled={refreshing}
            className="p-2.5 rounded-xl border border-white/10 hover:border-white/25 text-white/70 hover:text-white transition-colors cursor-pointer bg-white/[0.02]"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin text-[#EB0028]" : ""}`} />
          </button>

          <Link
            href="/admin/applications"
            className="px-5 py-2.5 rounded-full bg-[#EB0028] hover:bg-[#ff1a3c] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(235,0,40,0.35)] transition-all cursor-pointer"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
          >
            <span>Manage All ({stats.total})</span>
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
              <span className="text-[10px] uppercase font-mono text-white/50 tracking-wider font-semibold">
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
              Auto-syncs in real time with audio alerts for new registrations.
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
                <th className="py-3 px-3 text-right">Actions</th>
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
                    <p className="text-sm font-semibold text-white/60">0 Applications in Database</p>
                    <p className="text-xs text-white/30">
                      When attendees register on /apply, new submissions will ring and appear here instantly.
                    </p>
                  </td>
                </tr>
              ) : (
                recentApps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
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
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/applications/${app.id}`}
                          className="px-3 py-1.5 rounded-lg border border-white/15 hover:border-[#EB0028] bg-white/[0.03] hover:bg-[#EB0028]/10 text-white hover:text-[#EB0028] transition-colors font-mono text-[11px]"
                        >
                          Review →
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(app)}
                          title="Delete submission"
                          className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl border border-red-500/30 bg-neutral-950 text-white space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-tight">Delete Application Record</h3>
              <p className="text-xs text-white/60">
                Are you sure you want to permanently delete application <span className="text-white font-bold font-mono">{deleteTarget.application_number}</span> ({deleteTarget.first_name} {deleteTarget.last_name})? This will also remove the payment receipt from storage.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 text-white/70 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
