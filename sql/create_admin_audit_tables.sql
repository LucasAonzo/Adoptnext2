-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_audit_logs table
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  performed_by UUID REFERENCES auth.users(id),
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create admins table to track admin users
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security on both tables
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow service_role to insert logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "Allow admins to view logs" ON admin_audit_logs;
DROP POLICY IF EXISTS "Allow service_role to manage admins" ON admins;
DROP POLICY IF EXISTS "Allow admins to view admins" ON admins;

-- Policies for admin_audit_logs table
-- Only allow service role to insert audit logs
CREATE POLICY "Allow service_role to insert logs" 
  ON admin_audit_logs FOR INSERT 
  TO service_role
  WITH CHECK (true);

-- Only allow admins to view audit logs
CREATE POLICY "Allow admins to view logs" 
  ON admin_audit_logs FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM admins));

-- Policies for admins table
-- Allow service role to fully manage the admins table
CREATE POLICY "Allow service_role to manage admins" 
  ON admins FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow admins to view the admins table
CREATE POLICY "Allow admins to view admins" 
  ON admins FOR SELECT 
  USING (auth.uid() IN (SELECT id FROM admins));

-- Grant necessary permissions
GRANT ALL ON admin_audit_logs TO service_role;
GRANT SELECT ON admin_audit_logs TO authenticated;
GRANT ALL ON admins TO service_role;
GRANT SELECT ON admins TO authenticated; 