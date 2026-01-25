-- =====================================================
-- CMS NASC - Complete Database Schema Redesign
-- Migration 011: Full System with All Requirements
-- Date: 2026-01-25
-- =====================================================

-- WARNING: This migration will DROP and RECREATE tables
-- All existing data will be lost!

-- =====================================================
-- STEP 1: DROP EXISTING TABLES (in correct order)
-- =====================================================

-- Drop tables with foreign key dependencies first
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS learning_history CASCADE;
DROP TABLE IF EXISTS coupon_usage CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS teaching_programs CASCADE;
DROP TABLE IF EXISTS coach_payroll CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS monthly_usage CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS level_history CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS schedule_templates CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS parents CASCADE;
DROP TABLE IF EXISTS branch_coaches CASCADE;
DROP TABLE IF EXISTS coaches CASCADE;
DROP TABLE IF EXISTS courts CASCADE;
DROP TABLE IF EXISTS pricing_tiers CASCADE;
DROP TABLE IF EXISTS course_types CASCADE;
DROP TABLE IF EXISTS branches CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS enrollment_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;
DROP TYPE IF EXISTS course_type_code CASCADE;

-- =====================================================
-- STEP 2: CREATE ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'head_coach', 'coach', 'parent');
CREATE TYPE enrollment_status AS ENUM ('active', 'paused', 'cancelled', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled', 'refunded');
CREATE TYPE attendance_status AS ENUM ('booked', 'present', 'absent', 'late', 'excused', 'cancelled');
CREATE TYPE booking_status AS ENUM ('booked', 'attended', 'cancelled', 'makeup', 'no_show');
CREATE TYPE course_type_code AS ENUM ('kids_group', 'adult_group', 'private');

-- =====================================================
-- STEP 3: CREATE CORE TABLES
-- =====================================================

-- 1. Branches (สาขา - 7 แห่ง)
CREATE TABLE branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Course Types (ประเภทคอร์ส)
CREATE TABLE course_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code course_type_code NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    max_students INTEGER DEFAULT 6,
    duration_minutes INTEGER DEFAULT 120,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Pricing Tiers (ราคาแพ็คเกจ)
CREATE TABLE pricing_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_type_code course_type_code NOT NULL,
    name VARCHAR(100) NOT NULL,
    min_sessions INTEGER NOT NULL,
    max_sessions INTEGER, -- NULL = unlimited
    total_price DECIMAL(10,2) NOT NULL,
    price_per_session DECIMAL(10,2) NOT NULL,
    validity_months INTEGER DEFAULT 1, -- ใช้ได้กี่เดือน (ผู้ใหญ่ 10-16 ครั้ง = 10 เดือน)
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Users (ผู้ใช้งาน - linked to Supabase Auth)
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

-- 5. Coaches (โค้ช)
CREATE TABLE coaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    employee_id VARCHAR(20) UNIQUE,
    nickname VARCHAR(50),
    bio TEXT,
    base_salary DECIMAL(10,2) DEFAULT 20000,
    base_hours_per_week INTEGER DEFAULT 25,
    hourly_rate_group DECIMAL(10,2) DEFAULT 200, -- OT กลุ่ม
    hourly_rate_private DECIMAL(10,2) DEFAULT 400, -- OT Private
    head_coach_branch_id UUID REFERENCES branches(id), -- หัวหน้าโค้ชสาขาเดียว
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Branch Coaches (โค้ชประจำสาขา - สอนได้หลายสาขา)
CREATE TABLE branch_coaches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, coach_id)
);

-- 7. Parents (ผู้ปกครอง)
CREATE TABLE parents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    line_id VARCHAR(50),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Students (นักเรียน)
CREATE TABLE students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES parents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id), -- สำหรับผู้ใหญ่ลงเรียนเอง
    full_name VARCHAR(100) NOT NULL,
    nickname VARCHAR(50),
    birth_date DATE,
    gender VARCHAR(10),
    current_level INTEGER DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 60),
    total_training_hours DECIMAL(10,2) DEFAULT 0,
    is_adult_student BOOLEAN DEFAULT FALSE,
    profile_image_url TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Schedule Templates (รอบเรียนประจำสาขา)
CREATE TABLE schedule_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    course_type_code course_type_code NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INTEGER DEFAULT 6,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, course_type_code, day_of_week, start_time)
);

-- 10. Sessions (รอบสอนจริง - สร้างจาก template)
CREATE TABLE sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    course_type_code course_type_code NOT NULL,
    template_id UUID REFERENCES schedule_templates(id),
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_students INTEGER DEFAULT 6,
    current_students INTEGER DEFAULT 0,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, date, start_time, course_type_code)
);

-- 11. Enrollments (การลงทะเบียนแพ็คเกจ)
CREATE TABLE enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES parents(id),
    course_type_code course_type_code NOT NULL,
    pricing_tier_id UUID REFERENCES pricing_tiers(id),
    sessions_purchased INTEGER NOT NULL,
    sessions_remaining INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status enrollment_status DEFAULT 'active',
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    valid_until DATE NOT NULL, -- คำนวณจาก validity_months
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Bookings (การจองรายครั้ง)
CREATE TABLE bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES enrollments(id),
    booking_date DATE NOT NULL,
    status booking_status DEFAULT 'booked',
    is_makeup BOOLEAN DEFAULT FALSE, -- วันชดเชย (ไม่คิดเงิน)
    created_by UUID REFERENCES users(id),
    checked_in_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, session_id)
);

-- 13. Monthly Usage (การใช้งานรายเดือน - สำหรับเด็ก)
CREATE TABLE monthly_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    month DATE NOT NULL, -- วันแรกของเดือน (YYYY-MM-01)
    sessions_booked INTEGER DEFAULT 0,
    sessions_attended INTEGER DEFAULT 0,
    pricing_tier_id UUID REFERENCES pricing_tiers(id),
    calculated_price DECIMAL(10,2) DEFAULT 0,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, month)
);

-- 14. Learning History (ประวัติการเรียน - ใครเรียนกับใคร)
CREATE TABLE learning_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id) ON DELETE SET NULL,
    session_id UUID REFERENCES sessions(id),
    booking_id UUID REFERENCES bookings(id),
    branch_id UUID REFERENCES branches(id),
    session_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Level History (ประวัติ Level)
CREATE TABLE level_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    coach_id UUID REFERENCES coaches(id),
    previous_level INTEGER NOT NULL,
    new_level INTEGER NOT NULL,
    change_date DATE DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Payments (การชำระเงิน)
CREATE TABLE payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID REFERENCES parents(id),
    enrollment_id UUID REFERENCES enrollments(id),
    monthly_usage_id UUID REFERENCES monthly_usage(id),
    amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    coupon_id UUID, -- จะเพิ่ม FK หลังสร้าง coupons
    status payment_status DEFAULT 'pending',
    payment_date TIMESTAMPTZ,
    payment_method VARCHAR(50),
    slip_image_url TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 17. Coupons (คูปองส่วนลด)
CREATE TABLE coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase DECIMAL(10,2) DEFAULT 0,
    max_discount DECIMAL(10,2), -- สำหรับ percentage
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add FK to payments
ALTER TABLE payments ADD CONSTRAINT fk_payments_coupon 
    FOREIGN KEY (coupon_id) REFERENCES coupons(id);

-- 18. Coupon Usage (การใช้คูปอง)
CREATE TABLE coupon_usage (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    discount_applied DECIMAL(10,2) NOT NULL,
    used_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coupon_id, payment_id)
);

-- 19. Coach Payroll (เงินเดือนโค้ช)
CREATE TABLE coach_payroll (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    base_salary DECIMAL(10,2) NOT NULL,
    regular_hours DECIMAL(5,2) DEFAULT 0,
    overtime_hours_group DECIMAL(5,2) DEFAULT 0,
    overtime_hours_private DECIMAL(5,2) DEFAULT 0,
    overtime_pay DECIMAL(10,2) DEFAULT 0,
    bonus DECIMAL(10,2) DEFAULT 0,
    total_pay DECIMAL(10,2) NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_date TIMESTAMPTZ,
    approved_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coach_id, period_start, period_end)
);

-- 20. Teaching Programs (โปรแกรมสอน)
CREATE TABLE teaching_programs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    coach_id UUID REFERENCES coaches(id) ON DELETE CASCADE,
    session_id UUID REFERENCES sessions(id),
    session_date DATE NOT NULL,
    program_content TEXT NOT NULL,
    level_focus INTEGER,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID REFERENCES users(id),
    review_status VARCHAR(20) DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'needs_revision')),
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. Notifications (การแจ้งเตือน)
CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('reminder', 'payment', 'schedule', 'level', 'system')),
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. Activity Logs (บันทึกการใช้งาน - Super User Only)
CREATE TABLE activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. Courts (สนาม - optional)
CREATE TABLE courts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    max_students INTEGER DEFAULT 6,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- STEP 4: CREATE INDEXES
-- =====================================================

CREATE INDEX idx_students_parent ON students(parent_id);
CREATE INDEX idx_students_level ON students(current_level);
CREATE INDEX idx_students_active ON students(is_active);

CREATE INDEX idx_sessions_branch_date ON sessions(branch_id, date);
CREATE INDEX idx_sessions_course_type ON sessions(course_type_code);
CREATE INDEX idx_sessions_date ON sessions(date);

CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_session ON bookings(session_id);
CREATE INDEX idx_bookings_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);

CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollments_valid ON enrollments(valid_until);

CREATE INDEX idx_learning_history_student ON learning_history(student_id);
CREATE INDEX idx_learning_history_coach ON learning_history(coach_id);
CREATE INDEX idx_learning_history_date ON learning_history(session_date);

CREATE INDEX idx_payments_parent ON payments(parent_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(payment_date);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_date ON activity_logs(created_at);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_valid ON coupons(valid_from, valid_until);

-- =====================================================
-- STEP 5: CREATE TRIGGERS
-- =====================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coaches_updated_at BEFORE UPDATE ON coaches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_parents_updated_at BEFORE UPDATE ON parents 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_monthly_usage_updated_at BEFORE UPDATE ON monthly_usage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-cleanup old logs (1 year retention)
CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL '1 year';
END;
$$ language 'plpgsql';

-- =====================================================
-- STEP 6: SEED DATA
-- =====================================================

-- Insert 7 branches
INSERT INTO branches (name, address, phone) VALUES
    ('แจ้งวัฒนะ', 'ถนนแจ้งวัฒนะ กรุงเทพฯ', '02-123-4567'),
    ('พระราม 2', 'ถนนพระราม 2 กรุงเทพฯ', '02-234-5678'),
    ('รามอินทรา', 'ถนนรามอินทรา กรุงเทพฯ', '02-345-6789'),
    ('สุวรรณภูมิ', 'ถนนสุวรรณภูมิ กรุงเทพฯ', '02-456-7890'),
    ('เทพารักษ์', 'ถนนเทพารักษ์ สมุทรปราการ', '02-567-8901'),
    ('รัชดา', 'ถนนรัชดาภิเษก กรุงเทพฯ', '02-678-9012'),
    ('ราชพฤกษ์-ตลิ่งชัน', 'ถนนราชพฤกษ์ กรุงเทพฯ', '02-789-0123');

-- Insert course types
INSERT INTO course_types (code, name, description, max_students, duration_minutes) VALUES
    ('kids_group', 'กลุ่มเด็ก', 'กลุ่มเด็ก 4-6 คน 2 ชั่วโมง', 6, 120),
    ('adult_group', 'กลุ่มผู้ใหญ่', 'กลุ่มผู้ใหญ่ 1-6 คน 2 ชั่วโมง', 6, 120),
    ('private', 'Private', 'เรียนส่วนตัว/ครอบครัว', 4, 60);

-- Insert Kids pricing tiers
INSERT INTO pricing_tiers (course_type_code, name, min_sessions, max_sessions, total_price, price_per_session, validity_months, description) VALUES
    ('kids_group', 'รายครั้ง', 1, 1, 700, 700, 1, 'ลงรายครั้ง'),
    ('kids_group', 'Course 4', 2, 6, 2500, 625, 1, '2-6 ครั้ง/เดือน'),
    ('kids_group', 'Course 8', 7, 10, 4000, 500, 1, '7-10 ครั้ง/เดือน'),
    ('kids_group', 'Course 12', 11, 14, 5200, 433, 1, '11-14 ครั้ง/เดือน'),
    ('kids_group', 'Course 16', 15, 18, 6500, 406, 1, '15-18 ครั้ง/เดือน'),
    ('kids_group', 'Course 19+', 19, NULL, 7000, 350, 1, '19+ ครั้ง/เดือน');

-- Insert Adult pricing tiers (ใช้ได้นานกว่า)
INSERT INTO pricing_tiers (course_type_code, name, min_sessions, max_sessions, total_price, price_per_session, validity_months, description) VALUES
    ('adult_group', 'รายครั้ง', 1, 1, 600, 600, 1, 'ลงรายครั้ง'),
    ('adult_group', 'Course 10', 10, 10, 5500, 550, 10, '10 ครั้ง ใช้ได้ 10 เดือน'),
    ('adult_group', 'Course 16', 16, 16, 8000, 500, 10, '16 ครั้ง ใช้ได้ 10 เดือน');

-- Insert Private pricing tiers
INSERT INTO pricing_tiers (course_type_code, name, min_sessions, max_sessions, total_price, price_per_session, validity_months, description) VALUES
    ('private', 'รายชั่วโมง', 1, 1, 900, 900, 1, 'ชั่วโมงละ 900 บาท'),
    ('private', 'Package 10 ชม.', 10, 10, 8000, 800, 6, '10 ชั่วโมง ใช้ได้ 6 เดือน');

-- =====================================================
-- STEP 7: ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE branch_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE teaching_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;

-- Public read for branches, course_types, pricing_tiers
CREATE POLICY "Public read branches" ON branches FOR SELECT USING (true);
CREATE POLICY "Public read course_types" ON course_types FOR SELECT USING (true);
CREATE POLICY "Public read pricing_tiers" ON pricing_tiers FOR SELECT USING (true);
CREATE POLICY "Public read sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Public read schedule_templates" ON schedule_templates FOR SELECT USING (true);

-- Users can read their own data
CREATE POLICY "Users read own data" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own data" ON users FOR UPDATE USING (auth.uid() = id);

-- Parents can manage their data
CREATE POLICY "Parents read own" ON parents FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Parents insert" ON parents FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Parents update own" ON parents FOR UPDATE USING (user_id = auth.uid());

-- Parents can manage their children
CREATE POLICY "Parents read own children" ON students FOR SELECT 
    USING (parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()) 
           OR user_id = auth.uid());
CREATE POLICY "Parents insert children" ON students FOR INSERT 
    WITH CHECK (parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()));
CREATE POLICY "Parents update own children" ON students FOR UPDATE 
    USING (parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid()));

-- Coaches can read their assigned data
CREATE POLICY "Coaches read assigned students" ON students FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM coaches c 
        WHERE c.user_id = auth.uid() AND c.is_active = true
    ));

-- Learning history - everyone can read (their own perspective)
CREATE POLICY "Students read own history" ON learning_history FOR SELECT 
    USING (student_id IN (
        SELECT id FROM students WHERE parent_id IN (SELECT id FROM parents WHERE user_id = auth.uid())
        OR user_id = auth.uid()
    ));
CREATE POLICY "Coaches read teaching history" ON learning_history FOR SELECT 
    USING (coach_id IN (SELECT id FROM coaches WHERE user_id = auth.uid()));

-- Activity logs - Super User only
CREATE POLICY "Super admin read logs" ON activity_logs FOR SELECT 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'));
CREATE POLICY "System insert logs" ON activity_logs FOR INSERT WITH CHECK (true);

-- Notifications - users read their own
CREATE POLICY "Users read own notifications" ON notifications FOR SELECT 
    USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE 
    USING (user_id = auth.uid());

-- Admin full access policies
CREATE POLICY "Admins full users" ON users FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full students" ON students FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full coaches" ON coaches FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full enrollments" ON enrollments FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full bookings" ON bookings FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full payments" ON payments FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full coupons" ON coupons FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full learning_history" ON learning_history FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full sessions" ON sessions FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full schedule_templates" ON schedule_templates FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));
CREATE POLICY "Admins full branches" ON branches FOR ALL 
    USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')));

-- =====================================================
-- DONE!
-- =====================================================

-- Summary of tables created:
-- 1. branches (7 rows seeded)
-- 2. course_types (3 rows seeded)
-- 3. pricing_tiers (11 rows seeded)
-- 4. users
-- 5. coaches
-- 6. branch_coaches
-- 7. parents
-- 8. students
-- 9. schedule_templates
-- 10. sessions
-- 11. enrollments
-- 12. bookings
-- 13. monthly_usage
-- 14. learning_history
-- 15. level_history
-- 16. payments
-- 17. coupons
-- 18. coupon_usage
-- 19. coach_payroll
-- 20. teaching_programs
-- 21. notifications
-- 22. activity_logs
-- 23. courts

COMMENT ON TABLE learning_history IS 'ประวัติการเรียน - โค้ชดูว่าสอนใคร, นักเรียนดูว่าเรียนกับใคร';
COMMENT ON TABLE activity_logs IS 'Activity logs for Super User audit - 1 year retention';
