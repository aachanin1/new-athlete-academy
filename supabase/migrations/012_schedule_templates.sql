-- =====================================================
-- CMS NASC - Schedule Templates for All Branches
-- Migration 012: Insert all schedule templates from Requirements
-- Date: 2026-01-25
-- =====================================================

-- Clear existing templates
DELETE FROM schedule_templates;

-- =====================================================
-- Helper: Day of Week
-- 0 = Sunday, 1 = Monday, ..., 6 = Saturday
-- =====================================================

-- =====================================================
-- แจ้งวัฒนะ - Kids Group
-- =====================================================
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'kids_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- จันทร์ (1)
    (1, '17:00', '19:00'),
    -- อังคาร (2)
    (2, '10:00', '12:00'), (2, '15:00', '17:00'), (2, '17:00', '19:00'),
    -- พุธ (3)
    (3, '10:00', '12:00'), (3, '15:00', '17:00'), (3, '17:00', '19:00'),
    -- พฤหัสบดี (4)
    (4, '10:00', '12:00'), (4, '15:00', '17:00'), (4, '17:00', '19:00'),
    -- ศุกร์ (5)
    (5, '10:00', '12:00'), (5, '15:00', '17:00'), (5, '17:00', '19:00'),
    -- เสาร์ (6)
    (6, '09:00', '11:00'), (6, '13:00', '15:00'), (6, '16:00', '18:00'),
    -- อาทิตย์ (0)
    (0, '09:00', '11:00'), (0, '13:00', '15:00'), (0, '16:00', '18:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'แจ้งวัฒนะ';

-- แจ้งวัฒนะ - Adult Group
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'adult_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- พุธ (3)
    (3, '13:00', '15:00'), (3, '19:00', '21:00'),
    -- พฤหัสบดี (4)
    (4, '13:00', '15:00'), (4, '19:00', '21:00'),
    -- ศุกร์ (5)
    (5, '13:00', '15:00'), (5, '19:00', '21:00'),
    -- เสาร์ (6)
    (6, '11:00', '13:00'), (6, '18:00', '20:00'),
    -- อาทิตย์ (0)
    (0, '12:00', '14:00'), (0, '18:00', '20:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'แจ้งวัฒนะ';

-- แจ้งวัฒนะ - Private
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'private', d.day_of_week, d.start_time::time, d.end_time::time, 4
FROM branches b,
(VALUES
    -- จันทร์ (1)
    (1, '09:00', '17:00'), (1, '21:00', '23:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'แจ้งวัฒนะ';

-- =====================================================
-- พระราม 2 - Kids Group
-- =====================================================
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'kids_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- จันทร์ (1)
    (1, '10:00', '12:00'), (1, '17:00', '19:00'),
    -- อังคาร (2)
    (2, '10:00', '12:00'), (2, '15:00', '17:00'), (2, '17:00', '19:00'),
    -- พุธ (3)
    (3, '10:00', '12:00'), (3, '15:00', '17:00'), (3, '17:00', '19:00'),
    -- พฤหัสบดี (4)
    (4, '10:00', '12:00'), (4, '15:00', '17:00'), (4, '17:00', '19:00'),
    -- ศุกร์ (5)
    (5, '10:00', '12:00'), (5, '15:00', '17:00'), (5, '17:00', '19:00'),
    -- เสาร์ (6)
    (6, '09:00', '11:00'), (6, '15:00', '17:00'), (6, '17:00', '19:00'),
    -- อาทิตย์ (0)
    (0, '09:00', '11:00'), (0, '15:00', '17:00'), (0, '17:00', '19:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'พระราม 2';

-- พระราม 2 - Adult Group
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'adult_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- จันทร์ (1)
    (1, '13:00', '15:00'), (1, '19:00', '21:00'),
    -- พุธ (3)
    (3, '13:00', '15:00'), (3, '19:00', '21:00'),
    -- ศุกร์ (5)
    (5, '13:00', '15:00'), (5, '19:00', '21:00'),
    -- เสาร์ (6)
    (6, '13:00', '15:00'), (6, '19:00', '21:00'),
    -- อาทิตย์ (0)
    (0, '13:00', '15:00'), (0, '19:00', '21:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'พระราม 2';

-- =====================================================
-- รามอินทรา - Kids Group
-- =====================================================
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'kids_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- อังคาร (2)
    (2, '10:00', '12:00'), (2, '15:00', '17:00'), (2, '17:00', '19:00'),
    -- พฤหัสบดี (4)
    (4, '10:00', '12:00'), (4, '15:00', '17:00'), (4, '17:00', '19:00'),
    -- ศุกร์ (5)
    (5, '10:00', '12:00'), (5, '15:00', '17:00'), (5, '17:00', '19:00'),
    -- เสาร์ (6)
    (6, '10:00', '12:00'), (6, '13:00', '15:00'), (6, '17:00', '19:00'),
    -- อาทิตย์ (0)
    (0, '10:00', '12:00'), (0, '13:00', '15:00'), (0, '17:00', '19:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'รามอินทรา';

-- รามอินทรา - Adult Group
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'adult_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- อังคาร (2)
    (2, '13:00', '15:00'), (2, '20:00', '22:00'),
    -- พฤหัสบดี (4)
    (4, '13:00', '15:00'), (4, '20:00', '22:00'),
    -- เสาร์ (6)
    (6, '15:00', '17:00'),
    -- อาทิตย์ (0)
    (0, '15:00', '17:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'รามอินทรา';

-- =====================================================
-- เทพารักษ์ - Kids Group
-- =====================================================
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'kids_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- จันทร์ (1)
    (1, '10:00', '12:00'), (1, '15:00', '17:00'), (1, '17:00', '19:00'),
    -- อังคาร (2)
    (2, '10:00', '12:00'), (2, '15:00', '17:00'), (2, '17:00', '19:00'),
    -- พุธ (3)
    (3, '10:00', '12:00'), (3, '15:00', '17:00'), (3, '17:00', '19:00'),
    -- พฤหัสบดี (4)
    (4, '10:00', '12:00'), (4, '15:00', '17:00'), (4, '17:00', '19:00'),
    -- ศุกร์ (5)
    (5, '10:00', '12:00'), (5, '15:00', '17:00'), (5, '17:00', '19:00'),
    -- เสาร์ (6)
    (6, '09:00', '11:00'), (6, '13:00', '15:00'), (6, '16:00', '18:00'),
    -- อาทิตย์ (0)
    (0, '09:00', '11:00'), (0, '13:00', '15:00'), (0, '16:00', '18:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'เทพารักษ์';

-- เทพารักษ์ - Adult Group
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'adult_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- จันทร์ (1)
    (1, '13:00', '15:00'), (1, '20:00', '22:00'),
    -- อังคาร (2)
    (2, '13:00', '15:00'), (2, '20:00', '22:00'),
    -- พฤหัสบดี (4)
    (4, '13:00', '15:00'), (4, '20:00', '22:00'),
    -- ศุกร์ (5)
    (5, '13:00', '15:00'), (5, '20:00', '22:00'),
    -- เสาร์ (6)
    (6, '11:00', '13:00'), (6, '18:00', '20:00'),
    -- อาทิตย์ (0)
    (0, '11:00', '13:00'), (0, '18:00', '20:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'เทพารักษ์';

-- =====================================================
-- ราชพฤกษ์-ตลิ่งชัน - Kids Group
-- =====================================================
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'kids_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- พฤหัสบดี (4)
    (4, '10:00', '12:00'), (4, '15:00', '17:00'), (4, '17:00', '19:00'),
    -- ศุกร์ (5)
    (5, '10:00', '12:00'), (5, '15:00', '17:00'), (5, '17:00', '19:00'),
    -- เสาร์ (6)
    (6, '10:00', '12:00'), (6, '15:00', '17:00'),
    -- อาทิตย์ (0)
    (0, '10:00', '12:00'), (0, '15:00', '17:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'ราชพฤกษ์-ตลิ่งชัน';

-- ราชพฤกษ์-ตลิ่งชัน - Adult Group
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'adult_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- พฤหัสบดี (4)
    (4, '13:00', '15:00'), (4, '20:00', '22:00'),
    -- ศุกร์ (5)
    (5, '13:00', '15:00'), (5, '20:00', '22:00'),
    -- เสาร์ (6)
    (6, '12:00', '14:00'), (6, '20:00', '22:00'),
    -- อาทิตย์ (0)
    (0, '12:00', '14:00'), (0, '20:00', '22:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'ราชพฤกษ์-ตลิ่งชัน';

-- =====================================================
-- รัชดา - Kids Group (พิเศษ: บางรอบ 1.5 ชม.)
-- =====================================================
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'kids_group', d.day_of_week, d.start_time::time, d.end_time::time, d.max_students
FROM branches b,
(VALUES
    -- อังคาร-ศุกร์ (รอบพิเศษ 1.5 ชม. 3-5 คน)
    (2, '16:30', '18:00', 5),
    (3, '16:30', '18:00', 5),
    (4, '16:30', '18:00', 5),
    (5, '16:30', '18:00', 5),
    -- เสาร์ (6)
    (6, '10:00', '12:00', 6),
    -- อาทิตย์ (0)
    (0, '10:00', '12:00', 6),
    (0, '14:00', '16:00', 6),
    (0, '16:00', '18:00', 6)
) AS d(day_of_week, start_time, end_time, max_students)
WHERE b.name = 'รัชดา';

-- =====================================================
-- สุวรรณภูมิ - Kids Group
-- =====================================================
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'kids_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- จันทร์ (1)
    (1, '09:00', '11:00'), (1, '14:00', '16:00'), (1, '17:00', '19:00'),
    -- พุธ (3)
    (3, '09:00', '11:00'), (3, '14:00', '16:00'), (3, '17:00', '19:00'),
    -- พฤหัสบดี (4)
    (4, '09:00', '11:00'), (4, '14:00', '16:00'), (4, '17:00', '19:00'),
    -- ศุกร์ (5)
    (5, '09:00', '11:00'), (5, '14:00', '16:00'), (5, '17:00', '19:00'),
    -- เสาร์ (6)
    (6, '10:00', '12:00'), (6, '14:00', '16:00'), (6, '16:00', '18:00'),
    -- อาทิตย์ (0)
    (0, '09:00', '11:00'), (0, '14:00', '16:00'), (0, '16:00', '18:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'สุวรรณภูมิ';

-- สุวรรณภูมิ - Adult Group
INSERT INTO schedule_templates (branch_id, course_type_code, day_of_week, start_time, end_time, max_students)
SELECT b.id, 'adult_group', d.day_of_week, d.start_time::time, d.end_time::time, 6
FROM branches b,
(VALUES
    -- จันทร์ (1)
    (1, '19:00', '21:00'),
    -- พุธ (3)
    (3, '19:00', '21:00'),
    -- พฤหัสบดี (4)
    (4, '19:00', '21:00'),
    -- ศุกร์ (5)
    (5, '19:00', '21:00'),
    -- เสาร์ (6)
    (6, '11:00', '13:00'),
    -- อาทิตย์ (0)
    (0, '11:00', '13:00')
) AS d(day_of_week, start_time, end_time)
WHERE b.name = 'สุวรรณภูมิ';

-- =====================================================
-- DONE!
-- =====================================================

-- Count templates per branch
DO $$
DECLARE
    branch_record RECORD;
    template_count INTEGER;
BEGIN
    FOR branch_record IN SELECT id, name FROM branches ORDER BY name LOOP
        SELECT COUNT(*) INTO template_count 
        FROM schedule_templates 
        WHERE branch_id = branch_record.id;
        RAISE NOTICE 'Branch: % - Templates: %', branch_record.name, template_count;
    END LOOP;
END $$;
