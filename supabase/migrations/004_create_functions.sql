-- ============================================================
-- 004_create_functions.sql
-- TEDx KLH 2026 - Transaction-Safe Database Functions
-- ============================================================

-- Function: Atomic Application Submission
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
  -- Normalize inputs
  v_clean_utr := regexp_replace(p_utr_number, '\D', '', 'g');
  v_clean_email := lower(trim(p_email));

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
    'message', 'Application submitted successfully.'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function: Approve Application & Assign Delegate ID
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

  -- Generate or retain delegate ID
  IF v_current_delegate_id IS NOT NULL AND v_current_delegate_id != '' THEN
    v_new_delegate_id := v_current_delegate_id;
  ELSE
    v_seq_val := nextval('delegate_id_seq');
    v_new_delegate_id := 'TEDXKLH-2026-' || lpad(v_seq_val::text, 4, '0');
  END IF;

  -- Update application
  UPDATE delegate_applications
  SET 
    application_status = 'approved',
    delegate_id = v_new_delegate_id,
    updated_at = now()
  WHERE id = p_application_id;

  -- Audit log
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


-- Function: Verify / Reject Payment
CREATE OR REPLACE FUNCTION verify_payment(
  p_application_id UUID,
  p_new_payment_status TEXT, -- 'verified' or 'rejected'
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

  -- Update payment_verifications
  UPDATE payment_verifications
  SET
    verification_status = p_new_payment_status,
    verified_by = p_admin_user_id,
    verified_at = now(),
    admin_notes = COALESCE(p_notes, admin_notes),
    updated_at = now()
  WHERE application_id = p_application_id;

  -- Update delegate_applications
  UPDATE delegate_applications
  SET
    payment_status = p_new_payment_status,
    updated_at = now()
  WHERE id = p_application_id;

  -- Audit log
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
