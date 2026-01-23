-- =====================================================
-- Migration: Add Course Types (Kids/Adults)
-- Run in Supabase SQL Editor
-- =====================================================

-- 1. Create course_type enum
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'course_type') THEN
        CREATE TYPE course_type AS ENUM ('kids', 'adults');
    END IF;
END $$;

-- 2. Add course_type to sessions table
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS course_type course_type DEFAULT 'kids';

-- 3. Add course_type to pricing_tiers table  
ALTER TABLE pricing_tiers 
ADD COLUMN IF NOT EXISTS course_type course_type DEFAULT 'kids';

-- 4. Add course_type to enrollments table
ALTER TABLE enrollments
ADD COLUMN IF NOT EXISTS course_type course_type DEFAULT 'kids';

-- 5. Modify students table for adult self-enrollment
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS is_adult_student BOOLEAN DEFAULT FALSE;

-- Make parent_id optional (adults register themselves)
ALTER TABLE students 
ALTER COLUMN parent_id DROP NOT NULL;

-- Add user_id for adult students (link to auth user)
ALTER TABLE students 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);

-- 6. Insert adult pricing tiers (placeholder prices)
INSERT INTO pricing_tiers (name, sessions_per_month, price, price_per_session, course_type) VALUES
  ('ครั้งเดียว (ผู้ใหญ่)', 1, 800, 800, 'adults'),
  ('4 ครั้ง/เดือน (ผู้ใหญ่)', 4, 3000, 750, 'adults'),
  ('8 ครั้ง/เดือน (ผู้ใหญ่)', 8, 5000, 625, 'adults'),
  ('12 ครั้ง/เดือน (ผู้ใหญ่)', 12, 6500, 542, 'adults'),
  ('16 ครั้ง/เดือน (ผู้ใหญ่)', 16, 8000, 500, 'adults'),
  ('19+ ครั้ง/เดือน (ผู้ใหญ่)', 19, 9000, 474, 'adults')
ON CONFLICT DO NOTHING;

-- 7. Create index for course_type queries
CREATE INDEX IF NOT EXISTS idx_sessions_course_type ON sessions(course_type);
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_course_type ON pricing_tiers(course_type);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_type ON enrollments(course_type);
CREATE INDEX IF NOT EXISTS idx_students_is_adult ON students(is_adult_student);

-- 8. Update RLS policies for adult students
-- Drop existing policies if they exist, then create new ones
DO $$ 
BEGIN
    -- Drop if exists
    DROP POLICY IF EXISTS "Adults can view own student record" ON students;
    DROP POLICY IF EXISTS "Adults can update own student record" ON students;
    
    -- Create new policies
    CREATE POLICY "Adults can view own student record" ON students FOR SELECT
        USING (user_id = auth.uid());
    
    CREATE POLICY "Adults can update own student record" ON students FOR UPDATE
        USING (user_id = auth.uid());
END $$;

-- =====================================================
-- DONE: Course Type Schema Added
-- =====================================================
