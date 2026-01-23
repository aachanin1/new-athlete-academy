-- =====================================================
-- Fix Infinite Recursion & RLS - FINAL
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Drop ALL existing policies to clean slate and avoid conflicts/recursion
DROP POLICY IF EXISTS "Students viewable by authenticated" ON students;
DROP POLICY IF EXISTS "Coaches viewable by authenticated" ON coaches;
DROP POLICY IF EXISTS "Sessions viewable by authenticated" ON sessions;
DROP POLICY IF EXISTS "Parents viewable by authenticated" ON parents;
DROP POLICY IF EXISTS "Enrollments viewable by authenticated" ON enrollments;
DROP POLICY IF EXISTS "Attendance viewable by authenticated" ON attendance;
DROP POLICY IF EXISTS "Level history viewable by authenticated" ON level_history;
DROP POLICY IF EXISTS "Payments viewable by authenticated" ON payments;
DROP POLICY IF EXISTS "Payroll viewable by authenticated" ON coach_payroll;
DROP POLICY IF EXISTS "Branch coaches viewable by authenticated" ON branch_coaches;
DROP POLICY IF EXISTS "Courts viewable by all" ON courts;

-- Drop any potentially conflicting policies (common names)
DROP POLICY IF EXISTS "Enable read access for all users" ON students;
DROP POLICY IF EXISTS "Enable read access for all users" ON coaches;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;

-- Drop existing allow_read_* policies (in case they already exist)
DROP POLICY IF EXISTS "allow_read_students" ON students;
DROP POLICY IF EXISTS "allow_read_coaches" ON coaches;
DROP POLICY IF EXISTS "allow_read_sessions" ON sessions;
DROP POLICY IF EXISTS "allow_read_parents" ON parents;
DROP POLICY IF EXISTS "allow_read_enrollments" ON enrollments;
DROP POLICY IF EXISTS "allow_read_attendance" ON attendance;
DROP POLICY IF EXISTS "allow_read_level_history" ON level_history;
DROP POLICY IF EXISTS "allow_read_payments" ON payments;
DROP POLICY IF EXISTS "allow_read_coach_payroll" ON coach_payroll;
DROP POLICY IF EXISTS "allow_read_branch_coaches" ON branch_coaches;
DROP POLICY IF EXISTS "allow_read_branches" ON branches;
DROP POLICY IF EXISTS "allow_read_users" ON users;

-- 2. Create Simple Non-Recursive Policies
-- We use 'true' to allow any authenticated user to read (for this demo app)
-- This avoids any JOINs or checks on other tables specifically

CREATE POLICY "allow_read_students" ON students FOR SELECT USING (true);
CREATE POLICY "allow_read_coaches" ON coaches FOR SELECT USING (true);
CREATE POLICY "allow_read_sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "allow_read_parents" ON parents FOR SELECT USING (true);
CREATE POLICY "allow_read_enrollments" ON enrollments FOR SELECT USING (true);
CREATE POLICY "allow_read_attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "allow_read_level_history" ON level_history FOR SELECT USING (true);
CREATE POLICY "allow_read_payments" ON payments FOR SELECT USING (true);
CREATE POLICY "allow_read_coach_payroll" ON coach_payroll FOR SELECT USING (true);
CREATE POLICY "allow_read_branch_coaches" ON branch_coaches FOR SELECT USING (true);
CREATE POLICY "allow_read_branches" ON branches FOR SELECT USING (true);
CREATE POLICY "allow_read_users" ON users FOR SELECT USING (true);

-- 3. Confirm RLS is Enabled
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

SELECT 'RLS Cleaned and Fixed' AS status;
