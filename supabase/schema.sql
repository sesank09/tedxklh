-- ============================================================
-- TEDx KLH 2026 - COMPLETE SUPABASE DATABASE SCHEMA
-- Execute this entire script in Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sequences
CREATE SEQUENCE IF NOT EXISTS delegate_app_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS delegate_id_seq START WITH 1 INCREMENT BY 1;

-- Updated at timestamp helper
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1. Table: delegate_applications
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

DROP TRIGGER IF EXISTS trg_delegate_applications_updated_at ON delegate_applications;
CREATE TRIGGER trg_delegate_applications_updated_at
BEFORE UPDATE ON delegate_applications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_delegate_applications_email ON delegate_applications(email);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_phone ON delegate_applications(phone);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_app_num ON delegate_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_delegate_id ON delegate_applications(delegate_id);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_status ON delegate_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_payment_status ON delegate_applications(payment_status);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_created_at ON delegate_applications(created_at DESC);

-- 2. Table: payment_verifications
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

DROP TRIGGER IF EXISTS trg_payment_verifications_updated_at ON payment_verifications;
CREATE TRIGGER trg_payment_verifications_updated_at
BEFORE UPDATE ON payment_verifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_payment_verifications_app_id ON payment_verifications(application_id);
CREATE INDEX IF NOT EXISTS idx_payment_verifications_utr ON payment_verifications(utr_number);
CREATE INDEX IF NOT EXISTS idx_payment_verifications_status ON payment_verifications(verification_status);

-- 3. Table: admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin', 'reviewer')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_admin_users_updated_at ON admin_users;
CREATE TRIGGER trg_admin_users_updated_at
BEFORE UPDATE ON admin_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- 4. Table: admin_audit_logs
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT,
  application_id UUID REFERENCES delegate_applications(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_status TEXT,
  new_status TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_app_id ON admin_audit_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_admin_id ON admin_audit_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);

-- Admin verification helper
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS
ALTER TABLE delegate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Admins can view all delegate applications" ON delegate_applications;
CREATE POLICY "Admins can view all delegate applications"
  ON delegate_applications FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update delegate applications" ON delegate_applications;
CREATE POLICY "Admins can update delegate applications"
  ON delegate_applications FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can view payment verifications" ON payment_verifications;
CREATE POLICY "Admins can view payment verifications"
  ON payment_verifications FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can update payment verifications" ON payment_verifications;
CREATE POLICY "Admins can update payment verifications"
  ON payment_verifications FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can view audit logs" ON admin_audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_logs FOR SELECT TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admins can insert audit logs" ON admin_audit_logs;
CREATE POLICY "Admins can insert audit logs"
  ON admin_audit_logs FOR INSERT TO authenticated
  WITH CHECK (is_admin());

-- Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  false,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg'];

DROP POLICY IF EXISTS "Admins can view payment screenshots" ON storage.objects;
CREATE POLICY "Admins can view payment screenshots"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'payment-screenshots' AND is_admin());

-- Stored Procedures
CREATE OR REPLACE FUNCTION submit_delegate_application(
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_organization TEXT,
  p_city TEXT,
  p_utr_number VARCHAR(12),
  p_screenshot_path TEXT
)
RETURNS JSONB AS $$
DECLARE
  v_app_id UUID;
  v_seq_val BIGINT;
  v_app_number TEXT;
  v_clean_utr VARCHAR(12);
  v_clean_email TEXT;
BEGIN
  v_clean_utr := regexp_replace(p_utr_number, '\D', '', 'g');
  v_clean_email := lower(trim(p_email));

  IF length(v_clean_utr) != 12 THEN
    RAISE EXCEPTION 'UTR must be exactly 12 numeric digits.' USING ERRCODE = '22000';
  END IF;

  IF EXISTS (SELECT 1 FROM payment_verifications WHERE utr_number = v_clean_utr) THEN
    RAISE EXCEPTION 'An application with this UTR already exists.' USING ERRCODE = '23505';
  END IF;

  IF EXISTS (
    SELECT 1 FROM delegate_applications 
    WHERE email = v_clean_email 
      AND application_status IN ('submitted', 'under_review', 'approved')
  ) THEN
    RAISE EXCEPTION 'An application already exists for this email address.' USING ERRCODE = '23505';
  END IF;

  v_seq_val := nextval('delegate_app_seq');
  v_app_number := 'TEDXKLH-' || lpad(v_seq_val::text, 4, '0');

  INSERT INTO delegate_applications (
    application_number,
    first_name,
    last_name,
    email,
    phone,
    college_organization,
    city,
    application_status,
    payment_status
  ) VALUES (
    v_app_number,
    trim(p_first_name),
    trim(p_last_name),
    v_clean_email,
    trim(p_phone),
    trim(p_organization),
    trim(p_city),
    'submitted',
    'pending'
  ) RETURNING id INTO v_app_id;

  INSERT INTO payment_verifications (
    application_id,
    utr_number,
    screenshot_path,
    verification_status
  ) VALUES (
    v_app_id,
    v_clean_utr,
    p_screenshot_path,
    'pending'
  );

  RETURN jsonb_build_object(
    'success', true,
    'application_id', v_app_id,
    'application_number', v_app_number,
    'message', 'Application submitted successfully.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION approve_delegate_application(
  p_application_id UUID,
  p_admin_user_id UUID,
  p_admin_email TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_current_status TEXT;
  v_current_delegate_id TEXT;
  v_new_delegate_id TEXT;
  v_seq_val BIGINT;
BEGIN
  SELECT application_status, delegate_id
  INTO v_current_status, v_current_delegate_id
  FROM delegate_applications
  WHERE id = p_application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found.' USING ERRCODE = '02000';
  END IF;

  IF v_current_delegate_id IS NOT NULL AND v_current_delegate_id != '' THEN
    v_new_delegate_id := v_current_delegate_id;
  ELSE
    v_seq_val := nextval('delegate_id_seq');
    v_new_delegate_id := 'TEDXKLH-2026-' || lpad(v_seq_val::text, 4, '0');
  END IF;

  UPDATE delegate_applications
  SET 
    application_status = 'approved',
    delegate_id = v_new_delegate_id,
    updated_at = now()
  WHERE id = p_application_id;

  INSERT INTO admin_audit_logs (
    admin_user_id,
    admin_email,
    application_id,
    action,
    old_status,
    new_status,
    notes
  ) VALUES (
    p_admin_user_id,
    p_admin_email,
    p_application_id,
    'application_approved',
    v_current_status,
    'approved',
    'Delegate ID assigned: ' || v_new_delegate_id
  );

  RETURN jsonb_build_object(
    'success', true,
    'application_status', 'approved',
    'delegate_id', v_new_delegate_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION verify_payment(
  p_application_id UUID,
  p_new_payment_status TEXT,
  p_admin_user_id UUID,
  p_admin_email TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  v_old_status TEXT;
BEGIN
  IF p_new_payment_status NOT IN ('verified', 'rejected') THEN
    RAISE EXCEPTION 'Invalid payment status. Must be verified or rejected.' USING ERRCODE = '22000';
  END IF;

  SELECT payment_status INTO v_old_status
  FROM delegate_applications
  WHERE id = p_application_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found.' USING ERRCODE = '02000';
  END IF;

  UPDATE payment_verifications
  SET
    verification_status = p_new_payment_status,
    verified_by = p_admin_user_id,
    verified_at = now(),
    admin_notes = COALESCE(p_notes, admin_notes),
    updated_at = now()
  WHERE application_id = p_application_id;

  UPDATE delegate_applications
  SET
    payment_status = p_new_payment_status,
    updated_at = now()
  WHERE id = p_application_id;

  INSERT INTO admin_audit_logs (
    admin_user_id,
    admin_email,
    application_id,
    action,
    old_status,
    new_status,
    notes
  ) VALUES (
    p_admin_user_id,
    p_admin_email,
    p_application_id,
    'payment_' || p_new_payment_status,
    v_old_status,
    p_new_payment_status,
    p_notes
  );

  RETURN jsonb_build_object(
    'success', true,
    'payment_status', p_new_payment_status
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
