-- ============================================================
-- 006_add_roll_number_and_ticket_fields.sql
-- TEDx KLH 2026 — Roll Number & Structured Ticket Architecture
-- ============================================================

-- 1. Add roll_number, ticket_type, and ticket_price safely to delegate_applications
ALTER TABLE delegate_applications 
  ADD COLUMN IF NOT EXISTS roll_number TEXT,
  ADD COLUMN IF NOT EXISTS ticket_type TEXT NOT NULL DEFAULT '₹549 Ticket',
  ADD COLUMN IF NOT EXISTS ticket_price NUMERIC NOT NULL DEFAULT 549;

-- 2. Backfill existing records safely without fabricating missing data
UPDATE delegate_applications 
SET 
  ticket_type = '₹1999 Ticket',
  ticket_price = 1999
WHERE pass_type = 'group_of_4' AND (ticket_type IS NULL OR ticket_price = 549);

UPDATE delegate_applications 
SET 
  ticket_type = '₹549 Ticket',
  ticket_price = 549
WHERE (pass_type = 'individual' OR pass_type IS NULL) AND ticket_type IS NULL;

-- 3. Create indexes for high-speed search and admin queries
CREATE INDEX IF NOT EXISTS idx_delegate_applications_roll_number ON delegate_applications(roll_number);
CREATE INDEX IF NOT EXISTS idx_delegate_applications_ticket_type ON delegate_applications(ticket_type);

-- 4. Update atomic submission RPC function
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
  p_group_members JSONB DEFAULT '[]'::jsonb,
  p_roll_number TEXT DEFAULT NULL,
  p_ticket_type TEXT DEFAULT '₹549 Ticket',
  p_ticket_price NUMERIC DEFAULT 549
)
RETURNS JSONB AS $$
DECLARE
  v_app_id UUID;
  v_seq_val BIGINT;
  v_app_number TEXT;
  v_clean_utr VARCHAR(12);
  v_clean_email TEXT;
  v_clean_roll TEXT;
  v_valid_pass_type TEXT;
  v_valid_ticket_type TEXT;
  v_valid_ticket_price NUMERIC;
  v_valid_count INTEGER;
BEGIN
  -- Normalize inputs
  v_clean_utr := regexp_replace(p_utr_number, '\D', '', 'g');
  v_clean_email := lower(trim(p_email));
  v_clean_roll := trim(p_roll_number);
  
  -- Server authoritative pricing control
  IF p_pass_type = 'group_of_4' OR p_ticket_type ILIKE '%1999%' THEN
    v_valid_pass_type := 'group_of_4';
    v_valid_ticket_type := '₹1999 Ticket';
    v_valid_ticket_price := 1999;
    v_valid_count := 4;
  ELSE
    v_valid_pass_type := 'individual';
    v_valid_ticket_type := '₹549 Ticket';
    v_valid_ticket_price := 549;
    v_valid_count := 1;
  END IF;

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
    roll_number,
    pass_type,
    ticket_type,
    ticket_price,
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
    v_clean_roll,
    v_valid_pass_type,
    v_valid_ticket_type,
    v_valid_ticket_price,
    v_valid_count,
    v_valid_ticket_price,
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
    'roll_number', v_clean_roll,
    'ticket_type', v_valid_ticket_type,
    'ticket_price', v_valid_ticket_price,
    'pass_type', v_valid_pass_type,
    'total_amount', v_valid_ticket_price,
    'message', 'Application submitted successfully.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
