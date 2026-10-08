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
  IndianRupee,
  Ticket,
  Percent,
  Layers,
  Sparkles,
} from "lucide-react";
import { playNotificationChime } from "@/lib/utils/audio";
import { TOTAL_SEATS, formatINR } from "@/lib/constants";

interface TicketStat {
  name: string;
  sold: number;
  revenue: number;
}

interface StatsData {
  total: number;
  pending: number;
  verifiedPayments: number;
  approved: number;
  rejected: number;
  totalSeats: number;
  seatsFilled: number;
  seatsLeft: number;
  overCapacity: number;
  totalRevenue: number;
  ticketBreakdown?: {
    tickets549: TicketStat;
    tickets1999: TicketStat;
  };
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
  roll_number?: string | null;
  pass_type?: string;
  ticket_type?: string;
  ticket_price?: number;
  total_amount?: number;
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
    totalSeats: TOTAL_SEATS,
    seatsFilled: 0,
    seatsLeft: TOTAL_SEATS,
    overCapacity: 0,
    totalRevenue: 0,
    ticketBreakdown: {
      tickets549: { name: "₹549 Ticket", sold: 0, revenue: 0 },
      tickets1999: { name: "₹1999 Ticket", sold: 0, revenue: 0 },
    },
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
        fetch("/api/admin/applications?limit=8&sortBy=newest"),
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
        setDeleteTarget(null);
        // Refresh live stats after deletion
        fetchData(true);
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

  const isOverCapacity = stats.overCapacity > 0 || stats.seatsFilled > (stats.totalSeats || TOTAL_SEATS);
  const totalCapacity = stats.totalSeats || TOTAL_SEATS;
  const capacityPercent = Math.round(((stats.seatsFilled || 0) / totalCapacity) * 100);

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

      {/* OVER CAPACITY CRITICAL WARNING BANNER */}
      {isOverCapacity && (
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-red-500 bg-gradient-to-r from-red-950/80 via-red-900/60 to-black/80 backdrop-blur-2xl text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0_0_50px_rgba(235,0,40,0.45)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-400 flex items-center justify-center shrink-0 shadow-lg text-red-200">
              <AlertTriangle className="w-7 h-7 text-red-300 animate-bounce" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-mono font-extrabold uppercase tracking-widest">
                  CRITICAL CAPACITY ALERT
                </span>
                <span className="text-xs font-mono text-red-200">
                  {stats.seatsFilled} / {totalCapacity} Seats Filled
                </span>
              </div>
              <h3
                className="text-lg sm:text-xl font-extrabold tracking-tight text-white uppercase"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
              >
                OVER CAPACITY BY {stats.overCapacity || (stats.seatsFilled - totalCapacity)} SEATS
              </h3>
              <p className="text-xs text-red-200/90 font-mono">
                Seats Left: <span className="font-bold underline text-white">{stats.seatsLeft}</span> (Negative remaining allocation). Curatorial action required.
              </p>
            </div>
          </div>

          <Link
            href="/admin/applications"
            className="px-5 py-2.5 rounded-full bg-white text-black hover:bg-neutral-200 font-bold text-xs font-mono uppercase tracking-wider shrink-0 self-start sm:self-auto shadow-md transition-all relative z-10"
          >
            Manage Applications →
          </Link>
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
              LIVE METRICS
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
            <span>Manage Applications ({stats.total})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* PRIMARY EXECUTIVE METRIC CARDS (Top Priority) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* CARD 1: TOTAL MONEY RECEIVED */}
        <div className="p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-black/80 to-black/60 backdrop-blur-2xl space-y-3 relative overflow-hidden shadow-[0_10px_35px_rgba(16,185,129,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono text-emerald-400 tracking-wider font-bold">
              TOTAL MONEY RECEIVED
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            {loading ? "..." : formatINR(stats.totalRevenue)}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-emerald-300/80 uppercase tracking-widest pt-1 border-t border-white/5">
            <span>Verified Purchases Only</span>
            <span className="text-white/60">{stats.verifiedPayments} Transactions</span>
          </div>
        </div>

        {/* CARD 2: SEATS FILLED */}
        <div className="p-6 rounded-3xl border border-sky-500/30 bg-gradient-to-br from-sky-950/20 via-black/80 to-black/60 backdrop-blur-2xl space-y-3 relative overflow-hidden shadow-[0_10px_35px_rgba(14,165,233,0.12)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono text-sky-400 tracking-wider font-bold">
              SEATS FILLED
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            {loading ? "..." : `${stats.seatsFilled} / ${totalCapacity}`}
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isOverCapacity ? "bg-red-500" : "bg-sky-400"
              }`}
              style={{ width: `${Math.min(100, capacityPercent)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-sky-300/80 uppercase tracking-widest pt-0.5">
            <span>Capacity Utilized</span>
            <span className={isOverCapacity ? "text-red-400 font-bold" : "text-white/60"}>
              {capacityPercent}%
            </span>
          </div>
        </div>

        {/* CARD 3: SEATS LEFT (Supports Negative Numbers without Clamping!) */}
        <div
          className={`p-6 rounded-3xl border backdrop-blur-2xl space-y-3 relative overflow-hidden transition-all ${
            isOverCapacity
              ? "border-red-500/50 bg-gradient-to-br from-red-950/30 via-black/80 to-black/60 shadow-[0_10px_35px_rgba(235,0,40,0.2)]"
              : "border-white/15 bg-gradient-to-br from-white/[0.04] via-black/80 to-black/60 shadow-[0_10px_35px_rgba(255,255,255,0.05)]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span
              className={`text-[11px] uppercase font-mono tracking-wider font-bold ${
                isOverCapacity ? "text-red-400" : "text-white/70"
              }`}
            >
              SEATS LEFT
            </span>
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
                isOverCapacity
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-white/10 border-white/20 text-white"
              }`}
            >
              <Ticket className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isOverCapacity ? "text-red-400" : "text-white"
            }`}
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            {loading ? "..." : stats.seatsLeft}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest pt-1 border-t border-white/5">
            <span className={isOverCapacity ? "text-red-300 font-bold" : "text-white/50"}>
              {isOverCapacity ? `Over by ${stats.overCapacity} seats` : "Seats Remaining"}
            </span>
            <span className="text-white/40 font-mono">Max {totalCapacity}</span>
          </div>
        </div>

        {/* CARD 4: TOTAL APPLICATIONS */}
        <div className="p-6 rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.03] via-black/80 to-black/60 backdrop-blur-2xl space-y-3 relative overflow-hidden shadow-[0_10px_35px_rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-mono text-white/70 tracking-wider font-bold">
              TOTAL APPLICATIONS
            </span>
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div
            className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 800 }}
          >
            {loading ? "..." : stats.total}
          </div>
          <div className="flex items-center justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest pt-1 border-t border-white/5">
            <span>Overall Submissions</span>
            <span className="text-[#EB0028] font-bold">Live Cohort</span>
          </div>
        </div>

      </div>

      {/* SECONDARY SECTION: Ticket Breakdown & Application Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* TICKET BREAKDOWN (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#EB0028]" />
              <h2
                className="text-sm font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
              >
                Ticket Sales Breakdown
              </h2>
            </div>
            <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-manrope)" }}>
              Revenue generated from verified purchases by tier.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* ₹549 Ticket */}
            <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white uppercase font-mono">
                  ₹549 INDIVIDUAL TICKET
                </div>
                <div className="text-[11px] text-white/50">
                  <span className="text-emerald-400 font-bold">{stats.ticketBreakdown?.tickets549.sold || 0}</span> Sold (1 Seat each)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                  {formatINR(stats.ticketBreakdown?.tickets549.revenue || 0)}
                </div>
                <div className="text-[9px] text-white/40 uppercase font-mono">Verified Revenue</div>
              </div>
            </div>

            {/* ₹1999 Ticket */}
            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white uppercase font-mono flex items-center gap-1.5">
                  <span>₹1999 GROUP TICKET</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] font-mono font-bold">
                    Squad of 4
                  </span>
                </div>
                <div className="text-[11px] text-white/50">
                  <span className="text-emerald-400 font-bold">{stats.ticketBreakdown?.tickets1999.sold || 0}</span> Sold ({((stats.ticketBreakdown?.tickets1999.sold || 0) * 4)} Seats)
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm sm:text-base font-extrabold text-white font-mono">
                  {formatINR(stats.ticketBreakdown?.tickets1999.revenue || 0)}
                </div>
                <div className="text-[9px] text-emerald-400 uppercase font-mono font-semibold">Verified Revenue</div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
            <span>Total Verified Revenue:</span>
            <span className="font-extrabold text-white text-sm">{formatINR(stats.totalRevenue)}</span>
          </div>
        </div>

        {/* STATUS TILES (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-white/60" />
              <h2
                className="text-sm font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
              >
                Application Pipeline &amp; Verification
              </h2>
            </div>
            <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-manrope)" }}>
              Cohort review status &amp; accreditation progress.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Pending Review</span>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{loading ? "..." : stats.pending}</div>
              <div className="text-[9px] text-white/40 uppercase font-mono">Requires Action</div>
            </div>

            <div className="p-4 rounded-2xl border border-sky-500/20 bg-sky-500/[0.03] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-sky-400 font-bold">UTR Verified</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{loading ? "..." : stats.verifiedPayments}</div>
              <div className="text-[9px] text-white/40 uppercase font-mono">Payments Confirmed</div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Approved</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{loading ? "..." : stats.approved}</div>
              <div className="text-[9px] text-white/40 uppercase font-mono">Badges Assigned</div>
            </div>

            <div className="p-4 rounded-2xl border border-red-500/20 bg-red-500/[0.03] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-red-400 font-bold">Rejected</span>
                <XCircle className="w-3.5 h-3.5 text-red-400" />
              </div>
              <div className="text-2xl font-extrabold text-white font-mono">{loading ? "..." : stats.rejected}</div>
              <div className="text-[9px] text-white/40 uppercase font-mono">Not Selected</div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/50">
            <span>Authoritative Seat Capacity:</span>
            <span className="font-bold text-white">{totalCapacity} Total Allocated Seats</span>
          </div>
        </div>

      </div>

      {/* RECENT APPLICATIONS TABLE */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2
              className="text-lg font-bold text-white uppercase tracking-tight"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              Recent Delegate Submissions
            </h2>
            <p className="text-xs text-white/50" style={{ fontFamily: "var(--font-manrope)" }}>
              Real-time feed showing delegate roll number, ticket tier, payment status, and review coordinates.
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

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/40">
                <th className="py-3 px-3">Application #</th>
                <th className="py-3 px-3">Delegate Name</th>
                <th className="py-3 px-3">Roll Number</th>
                <th className="py-3 px-3">Ticket / Amount</th>
                <th className="py-3 px-3">College / Org</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-white/40 font-mono">
                    Loading applications...
                  </td>
                </tr>
              ) : recentApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-white/40 font-mono space-y-2">
                    <p className="text-sm font-semibold text-white/60">0 Applications in Database</p>
                    <p className="text-xs text-white/30">
                      When attendees register on /apply, new submissions will ring and appear here instantly.
                    </p>
                  </td>
                </tr>
              ) : (
                recentApps.map((app) => {
                  const isGroup = app.pass_type === "group_of_4" || (app.ticket_type && app.ticket_type.includes("1999"));
                  const ticketName = app.ticket_type || (isGroup ? "₹1999 Ticket" : "₹549 Ticket");
                  const price = app.ticket_price || app.total_amount || (isGroup ? 1999 : 549);

                  return (
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
                      <td className="py-3.5 px-3 font-mono font-semibold text-white/90">
                        {app.roll_number || "—"}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-white font-mono text-[11px]">
                          {ticketName}
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          {formatINR(price)} {isGroup && "· 4 Seats"}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-white/70 max-w-[160px] truncate">
                        {app.college_organization || "—"}
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
                  );
                })
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
