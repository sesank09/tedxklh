"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  CreditCard,
  FileText,
  Download,
  ExternalLink,
  ZoomIn,
  X,
  History,
  Save,
  AlertCircle,
} from "lucide-react";

interface ApplicationDetail {
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
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PaymentDetail {
  id: string;
  utr_number: string;
  screenshot_path: string;
  verification_status: string;
  verified_at: string | null;
  admin_notes: string | null;
}

interface AuditLog {
  id: string;
  action: string;
  admin_email: string | null;
  old_status: string | null;
  new_status: string | null;
  notes: string | null;
  created_at: string;
}

export default function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;
  const router = useRouter();

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [signedScreenshotUrl, setSignedScreenshotUrl] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [adminNotes, setAdminNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  const fetchDetails = async () => {
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`);
      const data = await res.json();

      if (res.ok && data.application) {
        setApplication(data.application);
        setPayment(data.payment);
        setSignedScreenshotUrl(data.signedScreenshotUrl);
        setAuditLogs(data.auditLogs || []);
        setAdminNotes(data.application.admin_notes || "");
      } else {
        setMessage({ type: "error", text: data.error || "Application not found" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load application details" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [applicationId]);

  // Payment Verification Action
  const handlePaymentAction = async (status: "verified" | "rejected") => {
    setActionLoading(`payment_${status}`);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `Payment marked as ${status}.` });
        fetchDetails();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update payment status." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(null);
    }
  };

  // Application Decision Action
  const handleApplicationAction = async (status: "approved" | "rejected") => {
    setActionLoading(`app_${status}`);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({
          type: "success",
          text: status === "approved"
            ? `Application approved! Delegate ID: ${data.delegate_id}`
            : "Application rejected.",
        });
        fetchDetails();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update application decision." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(null);
    }
  };

  // Save Admin Notes
  const handleSaveNotes = async () => {
    setActionLoading("notes");
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: adminNotes }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Admin notes saved successfully." });
        fetchDetails();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save notes." });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setActionLoading(null);
    }
  };

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteApplication = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/applications");
      } else {
        setMessage({ type: "error", text: "Failed to delete application record." });
        setShowDeleteModal(false);
      }
    } catch (err) {
      console.error("Delete error:", err);
      setMessage({ type: "error", text: "Network error deleting application." });
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };


  if (loading) {
    return (
      <div className="py-24 text-center space-y-3 font-mono text-xs text-white/50">
        <div className="w-8 h-8 border-2 border-[#EB0028] border-t-transparent rounded-full animate-spin mx-auto" />
        <p>Loading application dossier...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-red-400 font-mono text-sm">Application record not found.</p>
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#EB0028] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Applications List</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <Link
            href="/admin/applications"
            className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors font-mono uppercase tracking-wider mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Applications List</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono"
              style={{ fontFamily: "var(--font-sora)" }}
            >
              {application.application_number}
            </h1>

            {/* Status Badges */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                application.application_status === "approved"
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  : application.application_status === "rejected"
                  ? "bg-red-500/20 text-red-400 border-red-500/40"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/40"
              }`}
            >
              {application.application_status}
            </span>

            <span
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase border ${
                application.payment_status === "verified"
                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                  : application.payment_status === "rejected"
                  ? "bg-red-500/15 text-red-400 border-red-500/30"
                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}
            >
              Payment: {application.payment_status}
            </span>
          </div>
        </div>

        {/* Date stamps */}
        <div className="text-right text-[11px] font-mono text-white/40 space-y-0.5">
          <div>Submitted: {new Date(application.created_at).toLocaleString()}</div>
          <div>Updated: {new Date(application.updated_at).toLocaleString()}</div>
        </div>
      </div>

      {/* Notification Message */}
      {message && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/40"
              : "bg-red-500/15 text-red-400 border-red-500/40"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Delegate ID Banner if Approved */}
      {application.delegate_id && (
        <div className="p-6 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              CONFIRMED DELEGATE CREDENTIAL
            </span>
            <div className="text-2xl font-extrabold text-white font-mono tracking-widest">
              {application.delegate_id}
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-300/80">
            Seat accreditation secured for TEDx KLH 2026.
          </div>
        </div>
      )}

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN (7 cols): Personal Info & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Personal Coordinates Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <User className="w-4 h-4 text-[#EB0028]" />
              <h2
                className="text-sm font-bold uppercase tracking-wider text-white"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
              >
                Personal &amp; Contact Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-white/40 block">Full Name</span>
                <span className="text-sm font-semibold text-white">
                  {application.first_name} {application.last_name}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-white/40 block">Email Address</span>
                <a
                  href={`mailto:${application.email}`}
                  className="text-white hover:text-[#EB0028] transition-colors font-medium truncate block"
                >
                  {application.email}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-white/40 block">Phone Number</span>
                <a
                  href={`tel:${application.phone}`}
                  className="font-mono text-white hover:text-[#EB0028] transition-colors"
                >
                  {application.phone}
                </a>
              </div>

              <div>
                <span className="text-[10px] uppercase font-mono text-white/40 block">City</span>
                <span className="text-white">{application.city || "—"}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[10px] uppercase font-mono text-white/40 block">College / Organization</span>
                <span className="text-white font-medium">{application.college_organization || "—"}</span>
              </div>
            </div>
          </div>

          {/* Payment Verification Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#EB0028]" />
                <h2
                  className="text-sm font-bold uppercase tracking-wider text-white"
                  style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
                >
                  Payment Proof &amp; UTR Verification
                </h2>
              </div>
              <span className="text-xs font-mono font-bold text-white">₹499 INR</span>
            </div>

            <div className="space-y-5">
              {/* UTR Number */}
              <div className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-white/40 block">
                    12-DIGIT UTR REFERENCE
                  </span>
                  <div className="text-lg font-mono font-extrabold text-[#EB0028] tracking-widest">
                    {payment?.utr_number || "—"}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (payment?.utr_number) {
                      navigator.clipboard.writeText(payment.utr_number);
                      alert("UTR copied to clipboard");
                    }
                  }}
                  className="text-xs font-mono text-white/50 hover:text-white px-2.5 py-1 rounded border border-white/10 bg-white/5"
                >
                  Copy UTR
                </button>
              </div>

              {/* Payment Screenshot Proof Viewer */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-mono text-white/50 font-bold block">
                  PAYMENT RECEIPT SCREENSHOT (PRIVATE SECURE STORAGE)
                </span>

                {signedScreenshotUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/80 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={signedScreenshotUrl}
                      alt="Payment Proof"
                      className="w-full max-h-96 object-contain cursor-pointer hover:opacity-95 transition-opacity"
                      onClick={() => setIsScreenshotModalOpen(true)}
                    />

                    {/* Overlay Action Bar */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <button
                        onClick={() => setIsScreenshotModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-mono flex items-center gap-1.5 border border-white/20 backdrop-blur-md transition-colors"
                      >
                        <ZoomIn className="w-3.5 h-3.5" />
                        <span>Inspect / Zoom</span>
                      </button>

                      <a
                        href={signedScreenshotUrl}
                        download="payment-proof.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-black/80 hover:bg-black text-white text-xs font-mono border border-white/20 backdrop-blur-md transition-colors"
                        title="Open full size"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] text-center text-xs text-white/40 font-mono">
                    No screenshot found in private storage.
                  </div>
                )}
              </div>

              {/* Payment Verification Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handlePaymentAction("verified")}
                  disabled={actionLoading !== null}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {actionLoading === "payment_verified" ? "VERIFYING..." : "VERIFY PAYMENT"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentAction("rejected")}
                  disabled={actionLoading !== null}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-red-600/80 hover:bg-red-600 text-white flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  <XCircle className="w-4 h-4" />
                  <span>
                    {actionLoading === "payment_rejected" ? "REJECTING..." : "REJECT PAYMENT"}
                  </span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (5 cols): Application Decision, Admin Notes, Audit Log */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Decision Actions Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-5">
            <h2
              className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-3"
              style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
            >
              Curatorial Decision
            </h2>

            <p className="text-xs text-white/50 leading-relaxed" style={{ fontFamily: "var(--font-manrope)" }}>
              Approving this applicant will automatically assign an official unique Delegate ID (e.g. TEDXKLH-2026-XXXX).
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleApplicationAction("approved")}
                disabled={actionLoading !== null || application.application_status === "approved"}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ fontFamily: "var(--font-sora)", fontWeight: 700 }}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {actionLoading === "app_approved"
                    ? "APPROVING..."
                    : application.application_status === "approved"
                    ? "APPLICATION APPROVED"
                    : "APPROVE APPLICATION"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleApplicationAction("rejected")}
                disabled={actionLoading !== null || application.application_status === "rejected"}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-widest text-white/80 hover:text-white border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                <XCircle className="w-4 h-4" />
                <span>
                  {actionLoading === "app_rejected"
                    ? "REJECTING..."
                    : "REJECT APPLICATION"}
                </span>
              </button>
            </div>
          </div>

          {/* Admin Notes Box */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#EB0028]" />
                <h3
                  className="text-xs font-bold uppercase tracking-wider text-white"
                  style={{ fontFamily: "var(--font-sora)" }}
                >
                  Internal Organizer Notes
                </h3>
              </div>
            </div>

            <textarea
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal remarks, delegate background, or verification notes..."
              className="w-full p-3.5 rounded-xl border border-white/15 bg-white/[0.03] text-xs text-white placeholder-white/25 focus:outline-none focus:border-[#EB0028] transition-all resize-none"
              style={{ fontFamily: "var(--font-manrope)" }}
            />

            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={actionLoading !== null}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{actionLoading === "notes" ? "SAVING..." : "SAVE NOTES"}</span>
            </button>
          </div>

          {/* Audit History Timeline */}
          <div className="p-6 rounded-3xl border border-white/10 bg-black/70 backdrop-blur-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <History className="w-4 h-4 text-white/50" />
              <h3
                className="text-xs font-bold uppercase tracking-wider text-white/80"
                style={{ fontFamily: "var(--font-sora)" }}
              >
                Audit Trail ({auditLogs.length})
              </h3>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-white/30 font-mono">No audit events recorded yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-[#EB0028] uppercase text-[10px]">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">
                        {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    {log.notes && <p className="text-white/70 text-[11px]">{log.notes}</p>}
                    {log.admin_email && (
                      <div className="text-[10px] text-white/40 font-mono truncate">By: {log.admin_email}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Danger Zone: Delete Application */}
          <div className="p-6 rounded-3xl border border-red-500/20 bg-red-950/10 backdrop-blur-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-red-400">Danger Zone</h4>
                <p className="text-[11px] text-white/50">Permanently delete this application and remove receipt file.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Confirmation Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-3xl border border-red-500/30 bg-neutral-950 text-white space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold uppercase tracking-tight">Confirm Deletion</h3>
              <p className="text-xs text-white/60">
                Are you sure you want to permanently delete application <span className="text-white font-bold font-mono">{application.application_number}</span> ({application.first_name} {application.last_name})? This cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl border border-white/15 hover:bg-white/5 text-white/70 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteApplication}
                disabled={isDeleting}
                className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)] disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Screenshot Fullscreen Lightbox Modal */}
      {isScreenshotModalOpen && signedScreenshotUrl && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-4xl flex items-center justify-between pb-4">
            <div className="text-xs font-mono text-white/70">
              Payment Screenshot Proof · {application.application_number}
            </div>
            <button
              onClick={() => setIsScreenshotModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="max-w-4xl max-h-[80vh] overflow-auto rounded-2xl border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={signedScreenshotUrl}
              alt="Payment Screenshot Fullscreen"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
