-- =====================================================
-- Fix RLS Policies for Dashboard Access
-- Run this in Supabase SQL Editor
-- =====================================================

-- Allow public read access to students (for dashboard stats)
CREATE POLICY "Students viewable by authenticated" ON students 
  FOR SELECT USING (true);

-- Allow public read access to coaches (for dashboard stats)
CREATE POLICY "Coaches viewable by authenticated" ON coaches 
  FOR SELECT USING (true);

-- Allow public read access to sessions (for schedule)
CREATE POLICY "Sessions viewable by authenticated" ON sessions 
  FOR SELECT USING (true);

-- Allow public read access to parents
CREATE POLICY "Parents viewable by authenticated" ON parents 
  FOR SELECT USING (true);

-- Allow public read access to enrollments
CREATE POLICY "Enrollments viewable by authenticated" ON enrollments 
  FOR SELECT USING (true);

-- Allow public read access to attendance
CREATE POLICY "Attendance viewable by authenticated" ON attendance 
  FOR SELECT USING (true);

-- Allow public read access to level_history
CREATE POLICY "Level history viewable by authenticated" ON level_history 
  FOR SELECT USING (true);

-- Allow public read access to payments (for dashboard)
CREATE POLICY "Payments viewable by authenticated" ON payments 
  FOR SELECT USING (true);

-- Allow public read access to coach_payroll
CREATE POLICY "Payroll viewable by authenticated" ON coach_payroll 
  FOR SELECT USING (true);

-- Allow public read access to branch_coaches
CREATE POLICY "Branch coaches viewable by authenticated" ON branch_coaches 
  FOR SELECT USING (true);

-- Allow public read access to courts
CREATE POLICY "Courts viewable by all" ON courts 
  FOR SELECT USING (true);

SELECT 'RLS Policies Updated!' AS status;
