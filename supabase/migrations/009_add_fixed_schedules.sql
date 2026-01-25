-- =====================================================
-- Complete Fixed Schedules for All Branches
-- This migration creates all fixed weekly sessions for all 7 branches
-- =====================================================

-- Clear existing data to avoid conflicts
-- Need to delete in correct order due to foreign key constraints
DELETE FROM attendance;
DELETE FROM enrollments;
DELETE FROM sessions;
DELETE FROM branches;

-- Insert all branches first
INSERT INTO branches (id, name, address, phone, is_active) VALUES
('11111111-1111-1111-1111-111111111111', 'แจ้งวัฒนะ', 'ถนนกาญจนาภิเษก แขวงคลองเจ้าคุณสิงห์ เขตหนองจอก กรุงเทพฯ', '02-123-4567', true),
('22222222-2222-2222-2222-222222222222', 'พระราม 2', 'ถนนพระราม 2 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพฯ', '02-234-5678', true),
('33333333-3333-3333-3333-333333333333', 'รามอินทรา', 'ถนนรามอินทรา แขวงวัดพระยาไกร เขตบางคอแหลม กรุงเทพฯ', '02-345-6789', true),
('44444444-4444-4444-4444-444444444444', 'เทพารักษ์', 'ถนนเทพารักษ์ ตำบลเทพารักษ์ อำเภอเมืองสมุทรปราการ สมุทรปราการ', '02-456-7890', true),
('55555555-5555-5555-5555-555555555555', 'ราชพฤษ์-ตลิ่งชัน', 'ถนนราชพฤษฎิง แขวงตลิ่งชัน เขตตลิ่งชัน กรุงเทพฯ', '02-567-8901', true),
('66666666-6666-6666-6666-666666666666', 'รัชดา', 'ถนนรัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ', '02-678-9012', true),
('77777777-7777-7777-7777-777777777777', 'สุวรรณภูมิ', 'ถนนสุวรรณภูมิ แขวงสวนหลวง เขตสวนหลวง กรุงเทพฯ', '02-789-0123', true);

-- Get course type IDs
DO $$
DECLARE
    kids_course_id UUID;
    adult_course_id UUID;
BEGIN
    SELECT id INTO kids_course_id FROM course_types WHERE name = 'kids';
    SELECT id INTO adult_course_id FROM course_types WHERE name = 'adult';
    
    IF kids_course_id IS NULL THEN
        INSERT INTO course_types (name, description, max_students, duration_minutes) 
        VALUES ('kids', 'กลุ่มเด็กๆ 4-6 คน', 6, 120)
        RETURNING id INTO kids_course_id;
    END IF;
    
    IF adult_course_id IS NULL THEN
        INSERT INTO course_types (name, description, max_students, duration_minutes) 
        VALUES ('adult', 'กลุ่มผู้ใหญ่ 1-6 คน', 6, 120)
        RETURNING id INTO adult_course_id;
    END IF;
    
    -- =====================================================
    -- แจ้งวัฒนะ - กลุ่มเด็ก (4-6 คน, 2 ชม.)
    -- =====================================================
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 1)::integer, -- Mondays for 1 year
        '17:00'::time, '19:00'::time, 6, kids_course_id;
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 2)::integer, -- Tuesdays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 3)::integer, -- Wednesdays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 4)::integer, -- Thursdays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 5)::integer, -- Fridays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 6)::integer, -- Saturdays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('09:00', '11:00'), ('13:00', '15:00'), ('16:00', '18:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 0)::integer, -- Sundays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('09:00', '11:00'), ('13:00', '15:00'), ('16:00', '18:00')
    ]) AS s(start_time, end_time);
    
    -- =====================================================
    -- แจ้งวัฒนะ - กลุ่มผู้ใหญ่ (1-6 คน, 2 ชม.)
    -- =====================================================
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 3)::integer, -- Wednesdays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('13:00', '15:00'), ('19:00', '21:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 4)::integer, -- Thursdays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('13:00', '15:00'), ('19:00', '21:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 5)::integer, -- Fridays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('13:00', '15:00'), ('19:00', '21:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 6)::integer, -- Saturdays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('11:00', '13:00'), ('18:00', '20:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '11111111-1111-1111-1111-111111111111',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 0)::integer, -- Sundays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('12:00', '14:00'), ('18:00', '20:00')
    ]) AS s(start_time, end_time);
    
    RAISE NOTICE 'แจ้งวัฒนะ schedules created successfully';
    
END $$;
