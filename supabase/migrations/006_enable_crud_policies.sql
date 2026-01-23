-- =====================================================
-- RLS Policies for Full CRUD Operations
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STUDENTS - Full CRUD for authenticated users
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_students" ON students;
DROP POLICY IF EXISTS "allow_update_students" ON students;
DROP POLICY IF EXISTS "allow_delete_students" ON students;

CREATE POLICY "allow_insert_students" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_students" ON students FOR UPDATE USING (true);
CREATE POLICY "allow_delete_students" ON students FOR DELETE USING (true);

-- =====================================================
-- BRANCHES - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_branches" ON branches;
DROP POLICY IF EXISTS "allow_update_branches" ON branches;
DROP POLICY IF EXISTS "allow_delete_branches" ON branches;

CREATE POLICY "allow_insert_branches" ON branches FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_branches" ON branches FOR UPDATE USING (true);
CREATE POLICY "allow_delete_branches" ON branches FOR DELETE USING (true);

-- =====================================================
-- SESSIONS - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_sessions" ON sessions;
DROP POLICY IF EXISTS "allow_update_sessions" ON sessions;
DROP POLICY IF EXISTS "allow_delete_sessions" ON sessions;

CREATE POLICY "allow_insert_sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_sessions" ON sessions FOR UPDATE USING (true);
CREATE POLICY "allow_delete_sessions" ON sessions FOR DELETE USING (true);

-- =====================================================
-- PAYMENTS - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_payments" ON payments;
DROP POLICY IF EXISTS "allow_update_payments" ON payments;
DROP POLICY IF EXISTS "allow_delete_payments" ON payments;

CREATE POLICY "allow_insert_payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_payments" ON payments FOR UPDATE USING (true);
CREATE POLICY "allow_delete_payments" ON payments FOR DELETE USING (true);

-- =====================================================
-- ENROLLMENTS - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_enrollments" ON enrollments;
DROP POLICY IF EXISTS "allow_update_enrollments" ON enrollments;
DROP POLICY IF EXISTS "allow_delete_enrollments" ON enrollments;

CREATE POLICY "allow_insert_enrollments" ON enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_enrollments" ON enrollments FOR UPDATE USING (true);
CREATE POLICY "allow_delete_enrollments" ON enrollments FOR DELETE USING (true);

-- =====================================================
-- ATTENDANCE - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_attendance" ON attendance;
DROP POLICY IF EXISTS "allow_update_attendance" ON attendance;
DROP POLICY IF EXISTS "allow_delete_attendance" ON attendance;

CREATE POLICY "allow_insert_attendance" ON attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_attendance" ON attendance FOR UPDATE USING (true);
CREATE POLICY "allow_delete_attendance" ON attendance FOR DELETE USING (true);

-- =====================================================
-- COACHES - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_coaches" ON coaches;
DROP POLICY IF EXISTS "allow_update_coaches" ON coaches;
DROP POLICY IF EXISTS "allow_delete_coaches" ON coaches;

CREATE POLICY "allow_insert_coaches" ON coaches FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_coaches" ON coaches FOR UPDATE USING (true);
CREATE POLICY "allow_delete_coaches" ON coaches FOR DELETE USING (true);

-- =====================================================
-- LEVEL_HISTORY - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_level_history" ON level_history;
DROP POLICY IF EXISTS "allow_update_level_history" ON level_history;
DROP POLICY IF EXISTS "allow_delete_level_history" ON level_history;

CREATE POLICY "allow_insert_level_history" ON level_history FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_level_history" ON level_history FOR UPDATE USING (true);
CREATE POLICY "allow_delete_level_history" ON level_history FOR DELETE USING (true);

-- =====================================================
-- PARENTS - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_parents" ON parents;
DROP POLICY IF EXISTS "allow_update_parents" ON parents;
DROP POLICY IF EXISTS "allow_delete_parents" ON parents;

CREATE POLICY "allow_insert_parents" ON parents FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_parents" ON parents FOR UPDATE USING (true);
CREATE POLICY "allow_delete_parents" ON parents FOR DELETE USING (true);

-- =====================================================
-- BRANCH_COACHES - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_branch_coaches" ON branch_coaches;
DROP POLICY IF EXISTS "allow_update_branch_coaches" ON branch_coaches;
DROP POLICY IF EXISTS "allow_delete_branch_coaches" ON branch_coaches;

CREATE POLICY "allow_insert_branch_coaches" ON branch_coaches FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_branch_coaches" ON branch_coaches FOR UPDATE USING (true);
CREATE POLICY "allow_delete_branch_coaches" ON branch_coaches FOR DELETE USING (true);

-- =====================================================
-- COACH_PAYROLL - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_coach_payroll" ON coach_payroll;
DROP POLICY IF EXISTS "allow_update_coach_payroll" ON coach_payroll;
DROP POLICY IF EXISTS "allow_delete_coach_payroll" ON coach_payroll;

CREATE POLICY "allow_insert_coach_payroll" ON coach_payroll FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_coach_payroll" ON coach_payroll FOR UPDATE USING (true);
CREATE POLICY "allow_delete_coach_payroll" ON coach_payroll FOR DELETE USING (true);

-- =====================================================
-- USERS - Full CRUD
-- =====================================================
DROP POLICY IF EXISTS "allow_insert_users" ON users;
DROP POLICY IF EXISTS "allow_update_users" ON users;
DROP POLICY IF EXISTS "allow_delete_users" ON users;

CREATE POLICY "allow_insert_users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "allow_update_users" ON users FOR UPDATE USING (true);
CREATE POLICY "allow_delete_users" ON users FOR DELETE USING (true);

-- =====================================================
-- Confirm success
-- =====================================================
SELECT 'CRUD Policies Added Successfully!' AS status;
