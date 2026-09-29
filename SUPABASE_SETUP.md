# TEDx KLH 2026 — Supabase Backend & Delegate Management Setup Guide

This document outlines the complete setup instructions for the PostgreSQL database, Row Level Security (RLS), private screenshot storage, Supabase authentication, and administrator provisioning.

---

## 1. Supabase Project Setup

1. Go to [https://supabase.com](https://supabase.com) and create a new project (e.g. `tedxklh-2026`).
2. Note your **Project URL**, **Anon Key** (public), and **Service Role Key** (secret) from **Project Settings → API**.

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate `.env.local` with your credentials:

```ini
# Supabase Client-side (Public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key

# Supabase Server-side (Private - NEVER expose to browser)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Security Note:** `SUPABASE_SERVICE_ROLE_KEY` is strictly used by Next.js Server Route Handlers for atomic database operations and storage management. It is never exposed in client bundles.

---

## 3. Database Schema & Migration Execution

Open the **SQL Editor** in your Supabase Dashboard:

1. Copy the contents of [`supabase/schema.sql`](./supabase/schema.sql).
2. Paste into the SQL Editor and click **Run**.

This script will automatically:
- Create sequences for unique application numbers (`TEDXKLH-0001`, `TEDXKLH-0002`, ...) and delegate credentials (`TEDXKLH-2026-0001`, ...).
- Create tables:
  - `delegate_applications`
  - `payment_verifications`
  - `admin_users`
  - `admin_audit_logs`
- Enable **Row Level Security (RLS)** on all tables with strict policies.
- Provision the **private** `payment-screenshots` storage bucket.
- Create stored procedures:
  - `submit_delegate_application` (atomic transaction-safe submission)
  - `verify_payment` (payment verification & audit logging)
  - `approve_delegate_application` (credential generation & audit logging)

---

## 4. Admin User Provisioning

To create your initial organizer/admin account:

1. In Supabase Dashboard, navigate to **Authentication → Users**.
2. Click **Add User** → **Create User**.
3. Enter your organizer email (e.g., `admin@tedxklh.edu.in`) and a secure password. Make sure **Auto-confirm User** is checked.
4. Copy the generated **User UID** (UUID).
5. Open the **SQL Editor** and grant admin permissions by inserting into `admin_users`:

```sql
INSERT INTO admin_users (user_id, email, role)
VALUES (
  'PASTE_USER_UUID_HERE',
  'admin@tedxklh.edu.in',
  'admin'
);
```

---

## 5. System Routes & Endpoints

| Route | Purpose | Access |
|---|---|---|
| `/apply` | 3-Phase Delegate Registration | Public |
| `/application-status` | Dual-key (ID + Email) status lookup | Public |
| `/admin/login` | Organizer authentication | Public |
| `/admin` | Real-time delegate management dashboard | Authenticated Admins |
| `/admin/applications` | Search, filter, and review applications | Authenticated Admins |
| `/admin/applications/:id` | Inspect UTR, view screenshot proof, approve/reject | Authenticated Admins |
| `POST /api/apply` | Multipart secure application submission | Public (Rate-limited) |
| `POST /api/application-status` | Secure application status inquiry | Public |
| `GET /api/admin/stats` | Real-time KPI counts | Authenticated Admins |
| `GET /api/admin/applications` | Paginated search & filter query | Authenticated Admins |
| `POST /api/admin/applications/:id/verify-payment` | Verify / Reject payment | Authenticated Admins |
| `POST /api/admin/applications/:id/approve` | Approve application & assign Delegate ID | Authenticated Admins |

---

## 6. Verification Checklist

- [x] Application submission strictly validates 12-digit numeric UTRs (`^[0-9]{12}$`).
- [x] Duplicate UTRs and duplicate active emails are rejected.
- [x] Payment screenshots are stored in private storage and accessible only via short-lived signed URLs (15-min TTL).
- [x] Public users cannot read other applicants' data or browse storage buckets.
- [x] Admin routes require valid Supabase Auth + membership in `admin_users`.
- [x] All status updates and admin decisions are recorded in `admin_audit_logs`.
- [x] Zero mock or seeded data is displayed on the dashboard.
