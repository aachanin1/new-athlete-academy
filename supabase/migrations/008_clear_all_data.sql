-- =====================================================
-- CLEAR ALL DATA - Fresh Start
-- Run in Supabase SQL Editor
-- =====================================================

-- IMPORTANT: This will DELETE all user data!
-- Keep: branches, pricing_tiers (base configuration)

-- 1. Disable triggers temporarily for faster deletion
SET session_replication_role = 'replica';

-- 2. Clear user data tables (order matters due to foreign keys)
TRUNCATE TABLE teaching_programs CASCADE;
TRUNCATE TABLE coach_payroll CASCADE;
TRUNCATE TABLE level_history CASCADE;
TRUNCATE TABLE attendance CASCADE;
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE enrollments CASCADE;
TRUNCATE TABLE sessions CASCADE;
TRUNCATE TABLE students CASCADE;
TRUNCATE TABLE parents CASCADE;
TRUNCATE TABLE branch_coaches CASCADE;
TRUNCATE TABLE coaches CASCADE;
TRUNCATE TABLE courts CASCADE;

-- 3. Clear users table (must delete from auth.users first in Supabase dashboard)
-- Note: You need to delete users from Authentication > Users in Supabase Dashboard first
-- Then run: TRUNCATE TABLE users CASCADE;
DELETE FROM users;

-- 4. Re-enable triggers
SET session_replication_role = 'origin';

-- 5. Verify branches still exist
SELECT 'Branches:' as info, count(*) as count FROM branches;

-- 6. Verify pricing_tiers still exist (should have Kids + Adults)
SELECT 'Pricing Tiers:' as info, course_type, count(*) as count 
FROM pricing_tiers 
GROUP BY course_type;

-- =====================================================
-- DATA CLEARED! Ready for fresh registration
-- =====================================================

-- Next steps:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Delete all users there first (if any exist)
-- 3. Then run this SQL
-- 4. Ready to test registration!
