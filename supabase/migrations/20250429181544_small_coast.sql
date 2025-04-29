/*
  # Fix Admin Policies and Authentication

  1. Changes
    - Add proper admin role policies for all tables
    - Fix authentication checks
    - Add missing indexes
*/

-- Create admin role if not exists
CREATE ROLE admin;

-- Update RLS policies for admin access
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable full access for admin users"
ON properties
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'role' = 'admin'
  OR auth.uid() = created_by
)
WITH CHECK (
  auth.jwt() ->> 'role' = 'admin'
  OR auth.uid() = created_by
);

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_properties_created_by ON properties(created_by);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);

-- Update auth function
CREATE OR REPLACE FUNCTION public.handle_auth_user()
RETURNS trigger AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'role' = 'admin' THEN
    EXECUTE format('GRANT admin TO %I', NEW.email);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_auth_user();