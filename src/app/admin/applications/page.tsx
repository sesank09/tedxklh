"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
  Radio,
} from "lucide-react";

interface ApplicationItem {
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
  delegate_id: string | null;
  pass_type?: string;
  ticket_count?: number;
  total_amount?: number;
  created_at: string;
  payment_verifications?: Array<{
    utr_number: string;
    verification_status: string;
  }>;
}

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // Filters
  const [search, setSearch] = useState("");
  const [appStatus, setAppStatus] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<ApplicationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchApplications = useCallback(async (isBackground = false) => {
    if (!isBackground) setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search.trim(),
        appStatus,
        paymentStatus,
        sortBy,
      });

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.applications) {
        setApplications(data.applications);
        setTotalCount(data.pagination.total);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (err) {
      console.error("Fetch applications error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, appStatus, paymentStatus, sortBy]);

  useEffect(() => {
    fetchApplications();
    const interval = setInterval(() => {
      fetchApplications(true);
    }, 8000);

    return () => clearInterval(interval);
  }, [fetchApplications]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/applications/${deleteTarget.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
        setTotalCount((prev) => Math.max(0, prev - 1));
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/40";
      case "under_review":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      default:
        return "bg-white/10 text-white/70 border-white/20";
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
      case "rejected":
        return "bg-red-500/15 text-red-400 border-red-500/30";
      default:
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Stats summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-[#EB0028] uppercase tracking-widest font-bold">
              DELEGATE MANAGEMENT
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-1.5 animate-pulse">
              <Radio className="w-3 h-3 text-emerald-400" />
              LIVE
            </span>
          </div>
          <h1
            className="text-2xl sm:text-3xl font-bold text-white tracking-tight uppercase"
            style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
          >
            All Applications ({totalCount})
          </h1>
        </div>

        <button
          onClick={() => fetchApplications()}
          className="px-4 py-2 rounded-full border border-white/10 hover:border-white/25 text-white/70 hover:text-white text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto bg-white/[0.02]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#EB0028]" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center lg:col-span-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, Name, Email, Phone, UTR..."
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#EB0028] transition-all"
              style={{ fontFamily: "var(--font-manrope)" }}
            />
          </form>

          {/* Application Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-white/40 shrink-0">Status:</span>
            <select
              value={appStatus}
              onChange={(e) => {
                setAppStatus(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 rounded-xl border border-white/10 bg-neutral-900 text-xs text-white focus:outline-none focus:border-[#EB0028]"
            >
              <option value="all">All Statuses</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-white/40 shrink-0">Payment:</span>
            <select
              value={paymentStatus}
              onChange={(e) => {
                setPaymentStatus(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 rounded-xl border border-white/10 bg-neutral-900 text-xs text-white focus:outline-none focus:border-[#EB0028]"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-white/40 shrink-0">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="w-full h-10 px-3 rounded-xl border border-white/10 bg-neutral-900 text-xs text-white focus:outline-none focus:border-[#EB0028]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name (A-Z)</option>
              <option value="app_number">Application #</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="p-4 sm:p-6 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-[10px] font-mono uppercase tracking-wider text-white/40">
                <th className="py-3 px-3">Application #</th>
                <th className="py-3 px-3">Delegate Name</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">College / City</th>
                <th className="py-3 px-3">UTR Reference</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Delegate ID</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && applications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-white/40 font-mono">
                    <div className="w-6 h-6 border-2 border-[#EB0028] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                    Querying delegate records...
                  </td>
                </tr>
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center text-white/40 font-mono space-y-1">
                    <p className="text-sm font-semibold text-white/60">No matching applications found</p>
                    <p className="text-xs text-white/30">When new applications arrive, they will appear here live.</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => {
                  const utr = app.payment_verifications?.[0]?.utr_number || "—";
                  return (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-3.5 px-3 font-mono font-bold text-[#EB0028]">
                        {app.application_number}
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-white">
                        <div>{app.first_name} {app.last_name}</div>
                        <div className="mt-1">
                          {app.pass_type === "group_of_4" ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Squad of 4 · ₹1999
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-white/5 text-white/60 border border-white/10">
                              Individual · ₹549
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="text-white/80">{app.email}</div>
                        <div className="text-[10px] text-white/40 font-mono">{app.phone}</div>
                      </td>
                      <td className="py-3.5 px-3 text-white/70">
                        <div>{app.college_organization}</div>
                        <div className="text-[10px] text-white/40">{app.city}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-white/60">
                        {utr}
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${
                            getPaymentBadge(app.payment_status)
                          }`}
                        >
                          {app.payment_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${
                            getStatusBadge(app.application_status)
                          }`}
                        >
                          {app.application_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[11px] font-semibold text-emerald-400">
                        {app.delegate_id || "—"}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/applications/${app.id}`}
                            className="px-3 py-1.5 rounded-lg border border-white/15 hover:border-[#EB0028] bg-white/[0.03] hover:bg-[#EB0028]/15 text-white hover:text-[#EB0028] transition-all font-mono text-[11px] inline-flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
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

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs font-mono text-white/50">
          <div>
            Showing Page <span className="text-white font-bold">{page}</span> of{" "}
            <span className="text-white font-bold">{totalPages}</span> ({totalCount} total)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
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
