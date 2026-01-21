-- =====================================================
-- New Athlete Academy - Database Schema
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ENUMS
-- =====================================================

-- User roles
CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'head_coach', 'coach', 'parent');

-- Enrollment status
CREATE TYPE enrollment_status AS ENUM ('trial', 'active', 'paused', 'cancelled');

-- Payment status
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');

-- Attendance status
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- =====================================================
-- TABLES
-- =====================================================

-- 1. Branches (สาขา)
CREATE TABLE branches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  session_times JSONB DEFAULT '[]'::JSONB, -- เวลาสอนแต่ละรอบ
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Courts (สนาม)
CREATE TABLE courts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  max_students INTEGER DEFAULT 6,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Users (ผู้ใช้งาน - Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  role user_role NOT NULL DEFAULT 'parent',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Coaches (โค้ช)
CREATE TABLE coaches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  employee_id VARCHAR(20) UNIQUE,
  base_salary DECIMAL(10,2) DEFAULT 20000,
  hourly_rate_group DECIMAL(10,2) DEFAULT 200, -- OT กลุ่ม
  hourly_rate_private DECIMAL(10,2) DEFAULT 400, -- OT เดี่ยว
  base_hours_per_week INTEGER DEFAULT 25,
  hire_date DATE,
  specializations TEXT[],
  bio TEXT,
  is_head_coach BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Branch Coaches (โค้ชประจำสาขา)
CREATE TABLE branch_coaches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  is_primary BOOLEAN DEFAULT FALSE, -- สาขาหลัก
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(branch_id, coach_id)
);

-- 6. Parents (ผู้ปกครอง)
CREATE TABLE parents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  line_id VARCHAR(50),
  address TEXT,
  emergency_contact VARCHAR(100),
  emergency_phone VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Students (นักเรียน)
CREATE TABLE students (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
  full_name VARCHAR(100) NOT NULL,
  nickname VARCHAR(50),
  birth_date DATE,
  gender VARCHAR(10),
  current_level INTEGER DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 60),
  profile_image_url TEXT,
  notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Sessions (รอบสอน)
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_students INTEGER DEFAULT 6,
  is_cancelled BOOLEAN DEFAULT FALSE,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Enrollments (การลงทะเบียน)
CREATE TABLE enrollments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id),
  sessions_per_month INTEGER NOT NULL CHECK (sessions_per_month >= 1 AND sessions_per_month <= 20),
  price_per_month DECIMAL(10,2) NOT NULL,
  status enrollment_status DEFAULT 'trial',
  start_date DATE NOT NULL,
  end_date DATE,
  preferred_days JSONB DEFAULT '[]'::JSONB, -- วันที่ต้องการเรียน
  preferred_times JSONB DEFAULT '[]'::JSONB, -- เวลาที่ต้องการ
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Attendance (การเข้าเรียน)
CREATE TABLE attendance (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id),
  status attendance_status DEFAULT 'present',
  check_in_time TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, student_id)
);

-- 11. Level History (ประวัติ Level)
CREATE TABLE level_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  coach_id UUID REFERENCES coaches(id),
  previous_level INTEGER NOT NULL,
  new_level INTEGER NOT NULL,
  change_date DATE DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Pricing Tiers (ราคาแพ็คเกจ)
CREATE TABLE pricing_tiers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  sessions_per_month INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  price_per_session DECIMAL(10,2),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Payments (การชำระเงิน)
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  month DATE NOT NULL, -- เดือนที่ชำระ
  status payment_status DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  payment_method VARCHAR(50),
  slip_image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Coach Payroll (เงินเดือนโค้ช)
CREATE TABLE coach_payroll (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  base_salary DECIMAL(10,2) NOT NULL,
  regular_hours DECIMAL(5,2) DEFAULT 0,
  overtime_hours_group DECIMAL(5,2) DEFAULT 0,
  overtime_hours_private DECIMAL(5,2) DEFAULT 0,
  overtime_pay DECIMAL(10,2) DEFAULT 0,
  retention_bonus DECIMAL(10,2) DEFAULT 0,
  total_pay DECIMAL(10,2) NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coach_id, month)
);

-- 15. Teaching Programs (โปรแกรมสอน)
CREATE TABLE teaching_programs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id),
  program_content TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_students_level ON students(current_level);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_branch ON enrollments(branch_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_attendance_session ON attendance(session_id);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_sessions_branch_date ON sessions(branch_id, date);
CREATE INDEX idx_payments_enrollment ON payments(enrollment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_level_history_student ON level_history(student_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_programs ENABLE ROW LEVEL SECURITY;

-- Public read for branches and pricing
CREATE POLICY "Branches viewable by all" ON branches FOR SELECT USING (true);
CREATE POLICY "Pricing viewable by all" ON pricing_tiers FOR SELECT USING (true);

-- Users can read their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins full access to users" ON users FOR ALL 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

CREATE POLICY "Admins full access to students" ON students FOR ALL 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

CREATE POLICY "Admins full access to coaches" ON coaches FOR ALL 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

CREATE POLICY "Admins full access to enrollments" ON enrollments FOR ALL 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

CREATE POLICY "Admins full access to payments" ON payments FOR ALL 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

CREATE POLICY "Admins full access to attendance" ON attendance FOR ALL 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

CREATE POLICY "Admins full access to sessions" ON sessions FOR ALL 
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- Parents can view their own children
CREATE POLICY "Parents view own children" ON students FOR SELECT 
  USING (parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()));

-- =====================================================
-- SEED DATA
-- =====================================================

-- Insert branches
INSERT INTO branches (name, address, session_times) VALUES
  ('แจ้งวัฒนะ', 'สนามแบดมินตัน แจ้งวัฒนะ', '[{"start": "09:00", "end": "11:00"}, {"start": "13:00", "end": "15:00"}, {"start": "16:00", "end": "18:00"}]'),
  ('พระราม 2', 'สนามแบดมินตัน พระราม 2', '[{"start": "09:00", "end": "11:00"}, {"start": "14:00", "end": "16:00"}, {"start": "17:00", "end": "19:00"}]'),
  ('รามอินทรา', 'สนามแบดมินตัน รามอินทรา', '[{"start": "09:00", "end": "11:00"}, {"start": "13:00", "end": "15:00"}, {"start": "16:00", "end": "18:00"}]'),
  ('สุวรรณภูมิ', 'สนามแบดมินตัน สุวรรณภูมิ', '[{"start": "10:00", "end": "12:00"}, {"start": "14:00", "end": "16:00"}, {"start": "17:00", "end": "19:00"}]'),
  ('เทพารักษ์', 'สนามแบดมินตัน เทพารักษ์', '[{"start": "09:00", "end": "11:00"}, {"start": "13:00", "end": "15:00"}, {"start": "16:00", "end": "18:00"}]'),
  ('รัชดา', 'สนามแบดมินตัน รัชดา', '[{"start": "10:00", "end": "12:00"}, {"start": "15:00", "end": "17:00"}, {"start": "18:00", "end": "20:00"}]'),
  ('ราชพฤกษ์-ตลิ่งชัน', 'สนามแบดมินตัน ราชพฤกษ์', '[{"start": "09:00", "end": "11:00"}, {"start": "14:00", "end": "16:00"}, {"start": "17:00", "end": "19:00"}]');

-- Insert pricing tiers
INSERT INTO pricing_tiers (name, sessions_per_month, price, price_per_session) VALUES
  ('ครั้งเดียว', 1, 700, 700),
  ('4 ครั้ง/เดือน', 4, 2500, 625),
  ('8 ครั้ง/เดือน', 8, 4000, 500),
  ('12 ครั้ง/เดือน', 12, 5200, 433),
  ('16 ครั้ง/เดือน', 16, 6500, 406),
  ('19+ ครั้ง/เดือน', 19, 7000, 368);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate price per session
CREATE OR REPLACE FUNCTION calculate_price_per_session(sessions INTEGER)
RETURNS DECIMAL AS $$
BEGIN
  RETURN (SELECT price / sessions_per_month FROM pricing_tiers WHERE sessions_per_month = sessions LIMIT 1);
END;
$$ language 'plpgsql';

-- =====================================================
-- DONE!
-- =====================================================
