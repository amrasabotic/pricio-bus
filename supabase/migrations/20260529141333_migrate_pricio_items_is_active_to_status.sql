/*
  # Migrate pricio_items: replace is_active boolean with status string

  ## Summary
  The pricio_items table uses `is_active: boolean` but the rest of the app uses
  `status: 'active' | 'inactive'`. This migration standardizes pricio_items to
  match the uniform status pattern used everywhere else.

  ## Changes

  ### pricio_items
  - Drop the RLS policy that depends on is_active
  - Add `status` column (text, constrained to 'active'|'inactive', default 'active')
  - Backfill from existing is_active values: true → 'active', false → 'inactive'
  - Drop `is_active` column
  - Recreate the public read policy using status = 'active'

  ## Security
  - The "Public can read active items" policy is recreated with identical semantics,
    now using status = 'active' instead of is_active = true
  - All other policies are unchanged
*/

-- Drop the policy that references is_active
DROP POLICY IF EXISTS "Public can read active items" ON pricio_items;

-- Add the new status column
ALTER TABLE pricio_items
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'inactive'));

-- Backfill from existing boolean column
UPDATE pricio_items
  SET status = CASE WHEN is_active = true THEN 'active' ELSE 'inactive' END;

-- Drop the old boolean column
ALTER TABLE pricio_items DROP COLUMN IF EXISTS is_active;

-- Recreate the public read policy using status
CREATE POLICY "Public can read active items"
  ON pricio_items
  FOR SELECT
  USING (status = 'active');
