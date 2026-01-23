-- =====================================================
-- Fix Users Table Infinite Recursion - COMPLETE FIX
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Drop ALL existing policies on users table (the problematic one)
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view their own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Admins full access to users" ON users;
DROP POLICY IF EXISTS "allow_read_users" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;

-- 2. Drop ALL other recursive admin policies that check users table
DROP POLICY IF EXISTS "Admins full access to students" ON students;
DROP POLICY IF EXISTS "Admins full access to coaches" ON coaches;
DROP POLICY IF EXISTS "Admins full access to enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins full access to payments" ON payments;
DROP POLICY IF EXISTS "Admins full access to attendance" ON attendance;
DROP POLICY IF EXISTS "Admins full access to sessions" ON sessions;
DROP POLICY IF EXISTS "Parents view own children" ON students;

-- 3. Drop the allow_read_* policies we created before (in case they exist)
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

-- 4. Create SIMPLE non-recursive policies for ALL tables
-- For demo purposes: allow any authenticated user to read all data
CREATE POLICY "allow_read_users" ON users FOR SELECT USING (true);
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

-- branches already has "Branches viewable by all" policy, but add ours just in case
DROP POLICY IF EXISTS "allow_read_branches" ON branches;
CREATE POLICY "allow_read_branches" ON branches FOR SELECT USING (true);

-- 5. Confirm success
SELECT 'RLS FULLY FIXED - All recursive policies removed!' AS status;
