-- ============================================================
-- 005_add_group_pass_support.sql
-- TEDx KLH 2026 - Group Pass Support & Updated Pricing
-- ============================================================

-- Add pass_type, ticket_count, total_amount, and group_members to delegate_applications
ALTER TABLE delegate_applications 
  ADD COLUMN IF NOT EXISTS pass_type TEXT NOT NULL DEFAULT 'individual' 
    CHECK (pass_type IN ('individual', 'group_of_4')),
  ADD COLUMN IF NOT EXISTS ticket_count INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC NOT NULL DEFAULT 549,
  ADD COLUMN IF NOT EXISTS group_members JSONB DEFAULT '[]'::jsonb;

-- Create index for pass_type
CREATE INDEX IF NOT EXISTS idx_delegate_applications_pass_type ON delegate_applications(pass_type);

-- Update atomic submission function to support pass_type and group_members
CREATE OR REPLACE FUNCTION submit_delegate_application(
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_organization TEXT,
  p_city TEXT,
  p_utr_number VARCHAR(12),
  p_screenshot_path TEXT,
  p_pass_type TEXT DEFAULT 'individual',
  p_total_amount NUMERIC DEFAULT 549,
  p_ticket_count INTEGER DEFAULT 1,
  p_group_members JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB AS $$
DECLARE
  v_app_id UUID;
  v_seq_val BIGINT;
  v_app_number TEXT;
  v_clean_utr VARCHAR(12);
  v_clean_email TEXT;
  v_valid_pass_type TEXT;
  v_valid_amount NUMERIC;
  v_valid_count INTEGER;
BEGIN
  -- Normalize inputs
  v_clean_utr := regexp_replace(p_utr_number, '\D', '', 'g');
  v_clean_email := lower(trim(p_email));
  v_valid_pass_type := CASE WHEN p_pass_type = 'group_of_4' THEN 'group_of_4' ELSE 'individual' END;
  v_valid_amount := CASE WHEN v_valid_pass_type = 'group_of_4' THEN 1999 ELSE 549 END;
  v_valid_count := CASE WHEN v_valid_pass_type = 'group_of_4' THEN 4 ELSE 1 END;

  -- Validate 12-digit UTR
  IF length(v_clean_utr) != 12 THEN
    RAISE EXCEPTION 'UTR must be exactly 12 numeric digits.' USING ERRCODE = '22000';
  END IF;

  -- Check duplicate UTR
  IF EXISTS (SELECT 1 FROM payment_verifications WHERE utr_number = v_clean_utr) THEN
    RAISE EXCEPTION 'An application with this UTR already exists.' USING ERRCODE = '23505';
  END IF;

  -- Check existing active application for email
  IF EXISTS (
    SELECT 1 FROM delegate_applications 
    WHERE email = v_clean_email 
      AND application_status IN ('submitted', 'under_review', 'approved')
  ) THEN
    RAISE EXCEPTION 'An application already exists for this email address.' USING ERRCODE = '23505';
  END IF;

  -- Generate transaction-safe application number: TEDXKLH-0001, TEDXKLH-0002, ...
  v_seq_val := nextval('delegate_app_seq');
  v_app_number := 'TEDXKLH-' || lpad(v_seq_val::text, 4, '0');

  -- Insert delegate application
  INSERT INTO delegate_applications (
    application_number,
    first_name,
    last_name,
    email,
    phone,
    college_organization,
    city,
    pass_type,
    ticket_count,
    total_amount,
    group_members,
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
    v_valid_pass_type,
    v_valid_count,
    v_valid_amount,
    COALESCE(p_group_members, '[]'::jsonb),
    'submitted',
    'pending'
  ) RETURNING id INTO v_app_id;

  -- Insert payment verification record
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
    'pass_type', v_valid_pass_type,
    'total_amount', v_valid_amount,
    'message', 'Application submitted successfully.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
