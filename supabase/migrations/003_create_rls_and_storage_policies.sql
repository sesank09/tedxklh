-- ============================================================
-- 003_create_rls_and_storage_policies.sql
-- TEDx KLH 2026 - Row Level Security & Private Storage Setup
-- ============================================================

-- Function to check if the requesting user is an authorized admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------
-- ENABLE ROW LEVEL SECURITY
-- ------------------------------------------------------------
ALTER TABLE delegate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- POLICIES: delegate_applications
-- ------------------------------------------------------------
-- Admins have full read access
DROP POLICY IF EXISTS "Admins can view all delegate applications" ON delegate_applications;
CREATE POLICY "Admins can view all delegate applications"
  ON delegate_applications
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can update applications (status, notes, delegate_id)
DROP POLICY IF EXISTS "Admins can update delegate applications" ON delegate_applications;
CREATE POLICY "Admins can update delegate applications"
  ON delegate_applications
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ------------------------------------------------------------
-- POLICIES: payment_verifications
-- ------------------------------------------------------------
-- Admins can view all payment verifications
DROP POLICY IF EXISTS "Admins can view payment verifications" ON payment_verifications;
CREATE POLICY "Admins can view payment verifications"
  ON payment_verifications
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can update payment verification records
DROP POLICY IF EXISTS "Admins can update payment verifications" ON payment_verifications;
CREATE POLICY "Admins can update payment verifications"
  ON payment_verifications
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- ------------------------------------------------------------
-- POLICIES: admin_users
-- ------------------------------------------------------------
-- Admins can view other admins
DROP POLICY IF EXISTS "Admins can view admin users" ON admin_users;
CREATE POLICY "Admins can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- ------------------------------------------------------------
-- POLICIES: admin_audit_logs
-- ------------------------------------------------------------
-- Admins can view audit logs
DROP POLICY IF EXISTS "Admins can view audit logs" ON admin_audit_logs;
CREATE POLICY "Admins can view audit logs"
  ON admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (is_admin());

-- Admins can insert audit logs
DROP POLICY IF EXISTS "Admins can insert audit logs" ON admin_audit_logs;
CREATE POLICY "Admins can insert audit logs"
  ON admin_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

-- ------------------------------------------------------------
-- PRIVATE STORAGE BUCKET: payment-screenshots
-- ------------------------------------------------------------
-- Note: Insert bucket definition into storage.buckets if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'payment-screenshots',
  'payment-screenshots',
  false,
  5242880, -- 5 MB in bytes
  ARRAY['image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg'];

-- STORAGE POLICIES:
-- Only authenticated Admins can view payment screenshots via storage policies
DROP POLICY IF EXISTS "Admins can view payment screenshots" ON storage.objects;
CREATE POLICY "Admins can view payment screenshots"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'payment-screenshots' AND is_admin());
