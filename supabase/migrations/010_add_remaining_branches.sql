-- =====================================================
-- Complete Fixed Schedules for All Branches - Part 2
-- This migration adds the remaining 6 branches
-- =====================================================

-- Continue from previous migration
DO $$
DECLARE
    kids_course_id UUID;
    adult_course_id UUID;
BEGIN
    -- Get course type IDs
    SELECT id INTO kids_course_id FROM course_types WHERE name = 'kids';
    SELECT id INTO adult_course_id FROM course_types WHERE name = 'adult';
    
    -- =====================================================
    -- พระราม 2 - กลุ่มเด็ก (4-6 คน, 2 ชม.)
    -- =====================================================
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 1)::integer, -- Mondays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 2)::integer, -- Tuesdays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 3)::integer, -- Wednesdays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 4)::integer, -- Thursdays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 5)::integer, -- Fridays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('10:00', '12:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 6)::integer, -- Saturdays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('09:00', '11:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 0)::integer, -- Sundays
        s.start_time::time, s.end_time::time, 6, kids_course_id
    FROM unnest(ARRAY[
        ('09:00', '11:00'), ('15:00', '17:00'), ('17:00', '19:00')
    ]) AS s(start_time, end_time);
    
    -- =====================================================
    -- พระราม 2 - กลุ่มผู้ใหญ่ (3-6 คน, 2 ชม.)
    -- =====================================================
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 1)::integer, -- Mondays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('13:00', '15:00'), ('19:00', '21:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 3)::integer, -- Wednesdays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('13:00', '15:00'), ('19:00', '21:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 5)::integer, -- Fridays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('13:00', '15:00'), ('19:00', '21:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 6)::integer, -- Saturdays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('13:00', '15:00'), ('19:00', '21:00')
    ]) AS s(start_time, end_time);
    
    INSERT INTO sessions (branch_id, date, start_time, end_time, max_students, course_type_id)
    SELECT 
        '22222222-2222-2222-2222-222222222222',
        CURRENT_DATE + (generate_series(0, 52) * 7 + 0)::integer, -- Sundays
        s.start_time::time, s.end_time::time, 6, adult_course_id
    FROM unnest(ARRAY[
        ('13:00', '15:00'), ('19:00', '21:00')
    ]) AS s(start_time, end_time);
    
    RAISE NOTICE 'พระราม 2 schedules created successfully';
    
END $$;
