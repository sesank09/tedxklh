-- ============================================================
-- 001_create_delegate_tables.sql
-- TEDx KLH 2026 - Delegate Applications & Payment Verifications
-- ============================================================

-- Ensure pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sequence for safe, concurrent application number generation (TEDXKLH-0001, TEDXKLH-0002, ...)
CREATE SEQUENCE IF NOT EXISTS delegate_app_seq START WITH 1 INCREMENT BY 1;

-- Sequence for approved delegate credential IDs (TEDXKLH-2026-0001, ...)
CREATE SEQUENCE IF NOT EXISTS delegate_id_seq START WITH 1 INCREMENT BY 1;

-- Updated at timestamp helper function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- TABLE 1: delegate_applications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS delegate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_number TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college_organization TEXT,
  city TEXT,
  application_status TEXT NOT NULL DEFAULT 'submitted'
    CHECK (application_status IN ('submitted', 'under_review', 'approved', 'rejected', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'verified', 'rejected')),
  delegate_id TEXT UNIQUE,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for delegate_applications updated_at
DROP TRIGGER IF EXISTS trg_delegate_applications_updated_at ON delegate_applications;
CREATE TRIGGER trg_delegate_applications_updated_at
BEFORE UPDATE ON delegate_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for fast querying & duplicate checking
CREATE INDEX IF NOT EXISTS idx_delegate_applications_email ON delegate_applications(email);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_phone ON delegate_applications(phone);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_app_num ON delegate_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_delegate_id ON delegate_applications(delegate_id);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_status ON delegate_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_payment_status ON delegate_applications(payment_status);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_created_at ON delegate_applications(created_at DESC);

-- ------------------------------------------------------------
-- TABLE 2: payment_verifications
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES delegate_applications(id) ON DELETE CASCADE,
  utr_number VARCHAR(12) NOT NULL UNIQUE,
  screenshot_path TEXT NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for payment_verifications updated_at
DROP TRIGGER IF EXISTS trg_payment_verifications_updated_at ON payment_verifications;
CREATE TRIGGER trg_payment_verifications_updated_at
BEFORE UPDATE ON payment_verifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Indexes for payment verification lookup
CREATE INDEX IF NOT EXISTS idx_payment_verifications_app_id ON payment_verifications(application_id);
CREATE INDEX IF NOT EXISTS idx_payment_verifications_utr ON payment_verifications(utr_number);
CREATE INDEX IF NOT EXISTS idx_payment_verifications_status ON payment_verifications(verification_status);
