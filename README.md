# TEDx KLH 2026 — METAMORPHOSIS (v2.1 Production)

Official website and production Delegate Management System for **TEDx KLH 2026** at KLH University, Bowrampet, Hyderabad.

---

## 🌟 Features

- **Cinematic Frontend:** 3D WebGL Metamorphosis butterfly, smooth scroll transformations, glassmorphism design, and refined editorial typography.
- **Dedicated Delegate Registration (`/apply`):** Streamlined 3-phase registration flow (Personal, Payment & 12-digit UTR, Review & Submit) with client and server validation.
- **Dual-Key Status Lookup (`/application-status`):** Secure applicant lookup using Application Number + Email Address.
- **Complete Supabase Backend:**
  - PostgreSQL database with sequences and stored procedures for atomic submissions.
  - Private Supabase Storage bucket (`payment-screenshots`) with temporary signed URLs (15-min TTL).
  - Row Level Security (RLS) enforcing zero public read access on applicant data and payment receipts.
  - Complete administrative audit trail (`admin_audit_logs`).
- **Administrative Portal (`/admin`):**
  - Secure organizer authentication with role checks (`/admin/login`).
  - Real-time KPI counts (Total, Pending, Verified Payments, Approved, Rejected).
  - Searchable, filterable, sortable, and paginated delegate applications list (`/admin/applications`).
  - Application dossier (`/admin/applications/[id]`) with UTR verification, fullscreen screenshot proof viewer, approval/rejection actions, and automatic Delegate ID assignment (`TEDXKLH-2026-XXXX`).

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```ini
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Run Supabase Database Migration

Execute [`supabase/schema.sql`](./supabase/schema.sql) in the **Supabase SQL Editor** to initialize the tables, sequences, RLS policies, storage bucket, and stored procedures.

For detailed instructions on provisioning the first admin user, see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md).

### 4. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📂 Project Architecture

```
tedxklh/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Public Homepage
│   │   ├── apply/page.tsx              # Delegate Registration Page
│   │   ├── application-status/page.tsx # Public Status Lookup Page
│   │   ├── admin/
│   │   │   ├── layout.tsx              # Admin Shell with Session Guard
│   │   │   ├── page.tsx                # Dashboard Overview (KPI Metrics)
│   │   │   ├── login/page.tsx          # Organizer Login Page
│   │   │   └── applications/
│   │   │       ├── page.tsx            # Applications Management List
│   │   │       └── [id]/page.tsx       # Application Dossier & Payment Verification
│   │   └── api/
│   │       ├── apply/route.ts          # Multipart Application Submission Endpoint
│   │       ├── application-status/     # Dual-Key Status Inquiry Endpoint
│   │       └── admin/                  # Secure Authenticated Admin Endpoints
│   ├── components/                     # Cinematic UI Components
│   └── lib/
│       ├── auth/admin-guard.ts         # Admin Session Authorization Helper
│       └── supabase/                   # Client, Server, and Admin Supabase singletons
├── supabase/
│   ├── schema.sql                      # Master Database Schema
│   └── migrations/                     # Granular SQL Migration Scripts
├── SUPABASE_SETUP.md                   # Complete Backend Setup Guide
└── .env.example                        # Environment Variable Template
```
