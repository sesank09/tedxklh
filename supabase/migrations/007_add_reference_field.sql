-- ============================================================
-- 007_add_reference_field.sql
-- TEDx KLH 2026 — Add Optional Reference Field to Delegate Applications
-- ============================================================

-- 1. Add optional reference column to delegate_applications
ALTER TABLE delegate_applications 
  ADD COLUMN IF NOT EXISTS reference TEXT;

-- 2. Index for reference search in admin portal
CREATE INDEX IF NOT EXISTS idx_delegate_applications_reference ON delegate_applications(reference);
