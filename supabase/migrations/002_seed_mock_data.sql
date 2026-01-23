-- =====================================================
-- New Athlete Academy - Mock Data Seed (Fixed)
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. Update existing user to super_admin
-- =====================================================

UPDATE users SET role = 'super_admin' WHERE email = 'aachanin1@gmail.com';

-- =====================================================
-- 2. Create Demo Data Without Foreign Key Issues
-- We'll create coaches, students directly with UUIDs
-- =====================================================

-- First, temporarily disable RLS for seeding
ALTER TABLE coaches DISABLE ROW LEVEL SECURITY;
ALTER TABLE parents DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments DISABLE ROW LEVEL SECURITY;
ALTER TABLE sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE level_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE coach_payroll DISABLE ROW LEVEL SECURITY;
ALTER TABLE branch_coaches DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. Insert Coaches (without user_id for demo)
-- =====================================================

-- Drop the not-null constraint temporarily if it exists
ALTER TABLE coaches ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE parents ALTER COLUMN user_id DROP NOT NULL;

INSERT INTO coaches (id, employee_id, base_salary, is_head_coach, hire_date, specializations, bio) VALUES
  ('11111111-1111-1111-1111-111111111111', 'COACH-001', 25000, true, '2023-01-15', ARRAY['เทคนิคพื้นฐาน', 'กลยุทธ์'], 'โค้ชบอล - หัวหน้าโค้ช ประสบการณ์ 10 ปี'),
  ('22222222-2222-2222-2222-222222222222', 'COACH-002', 20000, false, '2023-03-01', ARRAY['เทคนิคพื้นฐาน'], 'โค้ชน้ำ - เชี่ยวชาญเทคนิคพื้นฐาน'),
  ('33333333-3333-3333-3333-333333333333', 'COACH-003', 20000, false, '2023-05-15', ARRAY['ฟุตเวิร์ค', 'สแมช'], 'โค้ชมายด์ - ผู้เชี่ยวชาญฟุตเวิร์ค'),
  ('44444444-4444-4444-4444-444444444444', 'COACH-004', 20000, false, '2023-06-01', ARRAY['เทคนิคขั้นสูง'], 'โค้ชท็อป - สอนระดับแข่งขัน'),
  ('55555555-5555-5555-5555-555555555555', 'COACH-005', 20000, false, '2023-07-01', ARRAY['เทคนิคพื้นฐาน'], 'โค้ชป๊อป'),
  ('66666666-6666-6666-6666-666666666666', 'COACH-006', 20000, false, '2023-08-01', ARRAY['ดับเบิลส์'], 'โค้ชไอซ์ - ผู้เชี่ยวชาญดับเบิลส์')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 4. Assign Coaches to Branches
-- =====================================================

INSERT INTO branch_coaches (branch_id, coach_id, is_primary)
SELECT b.id, '11111111-1111-1111-1111-111111111111'::uuid, true
FROM branches b WHERE b.name = 'แจ้งวัฒนะ'
ON CONFLICT DO NOTHING;

INSERT INTO branch_coaches (branch_id, coach_id, is_primary)
SELECT b.id, '22222222-2222-2222-2222-222222222222'::uuid, false
FROM branches b WHERE b.name = 'แจ้งวัฒนะ'
ON CONFLICT DO NOTHING;

INSERT INTO branch_coaches (branch_id, coach_id, is_primary)
SELECT b.id, '33333333-3333-3333-3333-333333333333'::uuid, true
FROM branches b WHERE b.name = 'พระราม 2'
ON CONFLICT DO NOTHING;

INSERT INTO branch_coaches (branch_id, coach_id, is_primary)
SELECT b.id, '44444444-4444-4444-4444-444444444444'::uuid, true
FROM branches b WHERE b.name = 'รามอินทรา'
ON CONFLICT DO NOTHING;

INSERT INTO branch_coaches (branch_id, coach_id, is_primary)
SELECT b.id, '55555555-5555-5555-5555-555555555555'::uuid, true
FROM branches b WHERE b.name = 'สุวรรณภูมิ'
ON CONFLICT DO NOTHING;

INSERT INTO branch_coaches (branch_id, coach_id, is_primary)
SELECT b.id, '66666666-6666-6666-6666-666666666666'::uuid, true
FROM branches b WHERE b.name = 'เทพารักษ์'
ON CONFLICT DO NOTHING;

-- =====================================================
-- 5. Create Parents
-- =====================================================

INSERT INTO parents (id, line_id, address) VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '@somchai', 'กรุงเทพฯ เขตจตุจักร'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '@somying', 'กรุงเทพฯ เขตบางแค'),
  ('aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '@prasert', 'กรุงเทพฯ เขตบางกะปิ'),
  ('aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '@wipa', 'กรุงเทพฯ เขตลาดพร้าว'),
  ('aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '@somsak', 'กรุงเทพฯ เขตสวนหลวง')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 6. Create Students
-- =====================================================

INSERT INTO students (id, parent_id, full_name, nickname, birth_date, gender, current_level) VALUES
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ด.ช.ภูมิพัฒน์ ใจดี', 'น้องบิว', '2015-03-15', 'male', 15),
  ('bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ด.ญ.พิมพ์มาดา ใจดี', 'น้องมิ้นท์', '2017-08-22', 'female', 8),
  ('bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ด.ช.ธนกฤต รักลูก', 'น้องเปา', '2014-11-10', 'male', 22),
  ('bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ด.ญ.ปวริศา มั่งมี', 'น้องมายด์', '2013-05-05', 'female', 32),
  ('bbbbbbb5-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ด.ช.ปัณณธร มั่งมี', 'น้องปลื้ม', '2016-09-18', 'male', 12),
  ('bbbbbbb6-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ด.ช.กิตติพัฒน์ สุขใจ', 'น้องฟิล์ม', '2015-12-25', 'male', 5),
  ('bbbbbbb7-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa4-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ด.ญ.พิชชาภา สุขใจ', 'น้องเจ', '2018-02-14', 'female', 3),
  ('bbbbbbb8-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'aaaaaaa5-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ด.ช.ภาคิน สมใจ', 'น้องเค', '2014-07-30', 'male', 28)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 7. Create Enrollments
-- =====================================================

INSERT INTO enrollments (id, student_id, branch_id, sessions_per_month, price_per_month, status, start_date)
SELECT 
  'ccccccc1-cccc-cccc-cccc-cccccccccccc'::uuid,
  'bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  id, 8, 4000, 'active', CURRENT_DATE - INTERVAL '60 days'
FROM branches WHERE name = 'แจ้งวัฒนะ'
ON CONFLICT (id) DO NOTHING;

INSERT INTO enrollments (id, student_id, branch_id, sessions_per_month, price_per_month, status, start_date)
SELECT 
  'ccccccc2-cccc-cccc-cccc-cccccccccccc'::uuid,
  'bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  id, 4, 2500, 'active', CURRENT_DATE - INTERVAL '30 days'
FROM branches WHERE name = 'แจ้งวัฒนะ'
ON CONFLICT (id) DO NOTHING;

INSERT INTO enrollments (id, student_id, branch_id, sessions_per_month, price_per_month, status, start_date)
SELECT 
  'ccccccc3-cccc-cccc-cccc-cccccccccccc'::uuid,
  'bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  id, 8, 4000, 'active', CURRENT_DATE - INTERVAL '90 days'
FROM branches WHERE name = 'พระราม 2'
ON CONFLICT (id) DO NOTHING;

INSERT INTO enrollments (id, student_id, branch_id, sessions_per_month, price_per_month, status, start_date)
SELECT 
  'ccccccc4-cccc-cccc-cccc-cccccccccccc'::uuid,
  'bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  id, 12, 5200, 'active', CURRENT_DATE - INTERVAL '120 days'
FROM branches WHERE name = 'รามอินทรา'
ON CONFLICT (id) DO NOTHING;

INSERT INTO enrollments (id, student_id, branch_id, sessions_per_month, price_per_month, status, start_date)
SELECT 
  'ccccccc5-cccc-cccc-cccc-cccccccccccc'::uuid,
  'bbbbbbb5-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  id, 8, 4000, 'active', CURRENT_DATE - INTERVAL '45 days'
FROM branches WHERE name = 'รามอินทรา'
ON CONFLICT (id) DO NOTHING;

INSERT INTO enrollments (id, student_id, branch_id, sessions_per_month, price_per_month, status, start_date)
SELECT 
  'ccccccc6-cccc-cccc-cccc-cccccccccccc'::uuid,
  'bbbbbbb6-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  id, 4, 2500, 'trial', CURRENT_DATE - INTERVAL '7 days'
FROM branches WHERE name = 'สุวรรณภูมิ'
ON CONFLICT (id) DO NOTHING;

INSERT INTO enrollments (id, student_id, branch_id, sessions_per_month, price_per_month, status, start_date)
SELECT 
  'ccccccc7-cccc-cccc-cccc-cccccccccccc'::uuid,
  'bbbbbbb7-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  id, 4, 2500, 'trial', CURRENT_DATE - INTERVAL '3 days'
FROM branches WHERE name = 'เทพารักษ์'
ON CONFLICT (id) DO NOTHING;

INSERT INTO enrollments (id, student_id, branch_id, sessions_per_month, price_per_month, status, start_date)
SELECT 
  'ccccccc8-cccc-cccc-cccc-cccccccccccc'::uuid,
  'bbbbbbb8-bbbb-bbbb-bbbb-bbbbbbbbbbbb'::uuid,
  id, 16, 6500, 'active', CURRENT_DATE - INTERVAL '180 days'
FROM branches WHERE name = 'แจ้งวัฒนะ'
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 8. Create Sessions for This Week
-- =====================================================

-- Insert sessions for each branch
INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE, '09:00', '11:00', 6 FROM branches WHERE name = 'แจ้งวัฒนะ';
INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE, '13:00', '15:00', 6 FROM branches WHERE name = 'แจ้งวัฒนะ';
INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE, '16:00', '18:00', 6 FROM branches WHERE name = 'แจ้งวัฒนะ';

INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE, '09:00', '11:00', 6 FROM branches WHERE name = 'พระราม 2';
INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE, '14:00', '16:00', 6 FROM branches WHERE name = 'พระราม 2';

INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE, '16:00', '18:00', 6 FROM branches WHERE name = 'รามอินทรา';
INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE, '18:00', '20:00', 6 FROM branches WHERE name = 'รามอินทรา';

INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE + 1, '09:00', '11:00', 6 FROM branches WHERE name = 'แจ้งวัฒนะ';
INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE + 1, '16:00', '18:00', 6 FROM branches WHERE name = 'แจ้งวัฒนะ';

INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE + 2, '09:00', '11:00', 6 FROM branches WHERE name = 'พระราม 2';
INSERT INTO sessions (branch_id, date, start_time, end_time, max_students)
SELECT id, CURRENT_DATE + 2, '16:00', '18:00', 6 FROM branches WHERE name = 'รามอินทรา';

-- =====================================================
-- 9. Create Level History
-- =====================================================

INSERT INTO level_history (student_id, coach_id, previous_level, new_level, change_date, notes) VALUES
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 12, 13, CURRENT_DATE - INTERVAL '60 days', 'พัฒนาได้ดีมาก'),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 13, 14, CURRENT_DATE - INTERVAL '30 days', 'ฝึกฟุตเวิร์คได้ดีขึ้น'),
  ('bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 14, 15, CURRENT_DATE - INTERVAL '7 days', 'ผ่านการทดสอบ Level 15'),
  ('bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 20, 21, CURRENT_DATE - INTERVAL '45 days', 'พัฒนาสแมชได้ดี'),
  ('bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 21, 22, CURRENT_DATE - INTERVAL '14 days', 'ผ่านการทดสอบ'),
  ('bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 30, 31, CURRENT_DATE - INTERVAL '30 days', 'ระดับแข่งขัน'),
  ('bbbbbbb4-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 31, 32, CURRENT_DATE - INTERVAL '10 days', 'ผ่านการแข่งขันภายใน'),
  ('bbbbbbb8-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 26, 27, CURRENT_DATE - INTERVAL '21 days', 'พัฒนาต่อเนื่อง'),
  ('bbbbbbb8-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 27, 28, CURRENT_DATE - INTERVAL '5 days', 'ผ่านการทดสอบ')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 10. Create Payments
-- =====================================================

INSERT INTO payments (enrollment_id, amount, month, status, payment_date, payment_method) VALUES
  ('ccccccc1-cccc-cccc-cccc-cccccccccccc', 4000, DATE_TRUNC('month', CURRENT_DATE), 'paid', CURRENT_DATE - INTERVAL '5 days', 'โอนเงิน'),
  ('ccccccc1-cccc-cccc-cccc-cccccccccccc', 4000, DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'), 'paid', CURRENT_DATE - INTERVAL '35 days', 'โอนเงิน'),
  ('ccccccc2-cccc-cccc-cccc-cccccccccccc', 2500, DATE_TRUNC('month', CURRENT_DATE), 'paid', CURRENT_DATE - INTERVAL '3 days', 'PromptPay'),
  ('ccccccc3-cccc-cccc-cccc-cccccccccccc', 4000, DATE_TRUNC('month', CURRENT_DATE), 'paid', CURRENT_DATE - INTERVAL '7 days', 'โอนเงิน'),
  ('ccccccc4-cccc-cccc-cccc-cccccccccccc', 5200, DATE_TRUNC('month', CURRENT_DATE), 'paid', CURRENT_DATE - INTERVAL '10 days', 'โอนเงิน'),
  ('ccccccc5-cccc-cccc-cccc-cccccccccccc', 4000, DATE_TRUNC('month', CURRENT_DATE), 'pending', NULL, NULL),
  ('ccccccc8-cccc-cccc-cccc-cccccccccccc', 6500, DATE_TRUNC('month', CURRENT_DATE), 'paid', CURRENT_DATE - INTERVAL '2 days', 'บัตรเครดิต')
ON CONFLICT DO NOTHING;

-- =====================================================
-- 11. Create Coach Payroll
-- =====================================================

INSERT INTO coach_payroll (coach_id, month, base_salary, regular_hours, overtime_hours_group, overtime_pay, total_pay, is_paid) VALUES
  ('11111111-1111-1111-1111-111111111111', DATE_TRUNC('month', CURRENT_DATE), 25000, 100, 15, 3000, 28000, false),
  ('22222222-2222-2222-2222-222222222222', DATE_TRUNC('month', CURRENT_DATE), 20000, 80, 8, 1600, 21600, false),
  ('33333333-3333-3333-3333-333333333333', DATE_TRUNC('month', CURRENT_DATE), 20000, 75, 5, 1000, 21000, false),
  ('44444444-4444-4444-4444-444444444444', DATE_TRUNC('month', CURRENT_DATE), 20000, 70, 10, 2000, 22000, false),
  ('55555555-5555-5555-5555-555555555555', DATE_TRUNC('month', CURRENT_DATE), 20000, 60, 0, 0, 20000, false),
  ('66666666-6666-6666-6666-666666666666', DATE_TRUNC('month', CURRENT_DATE), 20000, 50, 3, 600, 20600, false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. Re-enable RLS
-- =====================================================

ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_coaches ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Summary
-- =====================================================

SELECT 'Mock Data Inserted Successfully!' AS status;
SELECT 'Coaches: ' || COUNT(*) FROM coaches;
SELECT 'Parents: ' || COUNT(*) FROM parents;
SELECT 'Students: ' || COUNT(*) FROM students;
SELECT 'Enrollments: ' || COUNT(*) FROM enrollments;
SELECT 'Sessions: ' || COUNT(*) FROM sessions;
SELECT 'Payments: ' || COUNT(*) FROM payments;
