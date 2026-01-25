// =====================================================
// Database Types for CMS NASC - Complete Schema
// Auto-generated from Migration 011
// Date: 2026-01-25
// =====================================================

// =====================================================
// ENUMS
// =====================================================

export type UserRole = 'super_admin' | 'admin' | 'head_coach' | 'coach' | 'parent';
export type EnrollmentStatus = 'active' | 'paused' | 'cancelled' | 'expired';
export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
export type AttendanceStatus = 'booked' | 'present' | 'absent' | 'late' | 'excused' | 'cancelled';
export type BookingStatus = 'booked' | 'attended' | 'cancelled' | 'makeup' | 'no_show';
export type CourseTypeCode = 'kids_group' | 'adult_group' | 'private';
export type ReviewStatus = 'pending' | 'approved' | 'needs_revision';
export type DiscountType = 'percentage' | 'fixed';
export type NotificationType = 'reminder' | 'payment' | 'schedule' | 'level' | 'system';
export type ActionType = 'login' | 'logout' | 'book_session' | 'cancel_booking' | 
    'check_attendance' | 'update_level' | 'create_payment' | 'verify_payment' | 
    'create_coupon' | 'use_coupon' | 'create_user' | 'update_settings';

// =====================================================
// CORE TABLES
// =====================================================

// Branch (สาขา)
export interface Branch {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Course Type (ประเภทคอร์ส)
export interface CourseType {
    id: string;
    code: CourseTypeCode;
    name: string;
    description: string | null;
    max_students: number;
    duration_minutes: number;
    is_active: boolean;
    created_at: string;
}

// Pricing Tier (แพ็คเกจราคา)
export interface PricingTier {
    id: string;
    course_type_code: CourseTypeCode;
    name: string;
    min_sessions: number;
    max_sessions: number | null;
    total_price: number;
    price_per_session: number;
    validity_months: number;
    description: string | null;
    is_active: boolean;
    created_at: string;
}

// User (ผู้ใช้งาน)
export interface User {
    id: string;
    email: string;
    full_name: string;
    phone: string | null;
    role: UserRole;
    avatar_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Coach (โค้ช)
export interface Coach {
    id: string;
    user_id: string;
    employee_id: string | null;
    nickname: string | null;
    bio: string | null;
    base_salary: number;
    base_hours_per_week: number;
    hourly_rate_group: number;
    hourly_rate_private: number;
    head_coach_branch_id: string | null;
    hire_date: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Relations
    user?: User;
    head_coach_branch?: Branch;
}

// Branch Coach (โค้ชประจำสาขา)
export interface BranchCoach {
    id: string;
    branch_id: string;
    coach_id: string;
    is_primary: boolean;
    created_at: string;
    // Relations
    branch?: Branch;
    coach?: Coach;
}

// Parent (ผู้ปกครอง)
export interface Parent {
    id: string;
    user_id: string;
    line_id: string | null;
    address: string | null;
    emergency_contact: string | null;
    emergency_phone: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    user?: User;
    students?: Student[];
}

// Student (นักเรียน)
export interface Student {
    id: string;
    parent_id: string | null;
    user_id: string | null;
    full_name: string;
    nickname: string | null;
    birth_date: string | null;
    gender: string | null;
    current_level: number;
    total_training_hours: number;
    is_adult_student: boolean;
    profile_image_url: string | null;
    notes: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Relations
    parent?: Parent;
    user?: User;
}

// Schedule Template (รอบเรียนประจำ)
export interface ScheduleTemplate {
    id: string;
    branch_id: string;
    course_type_code: CourseTypeCode;
    day_of_week: number;
    start_time: string;
    end_time: string;
    max_students: number;
    is_active: boolean;
    created_at: string;
    // Relations
    branch?: Branch;
}

// Session (รอบสอนจริง)
export interface Session {
    id: string;
    branch_id: string;
    course_type_code: CourseTypeCode;
    template_id: string | null;
    date: string;
    start_time: string;
    end_time: string;
    max_students: number;
    current_students: number;
    is_cancelled: boolean;
    cancellation_reason: string | null;
    created_at: string;
    // Relations
    branch?: Branch;
    template?: ScheduleTemplate;
}

// Enrollment (การลงทะเบียนแพ็คเกจ)
export interface Enrollment {
    id: string;
    student_id: string;
    parent_id: string | null;
    course_type_code: CourseTypeCode;
    pricing_tier_id: string | null;
    sessions_purchased: number;
    sessions_remaining: number;
    total_price: number;
    status: EnrollmentStatus;
    purchase_date: string;
    valid_until: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    student?: Student;
    parent?: Parent;
    pricing_tier?: PricingTier;
}

// Booking (การจองรายครั้ง)
export interface Booking {
    id: string;
    student_id: string;
    session_id: string;
    enrollment_id: string | null;
    booking_date: string;
    status: BookingStatus;
    is_makeup: boolean;
    created_by: string | null;
    checked_in_at: string | null;
    notes: string | null;
    created_at: string;
    // Relations
    student?: Student;
    session?: Session;
    enrollment?: Enrollment;
    created_by_user?: User;
}

// Monthly Usage (การใช้งานรายเดือน)
export interface MonthlyUsage {
    id: string;
    student_id: string;
    month: string;
    sessions_booked: number;
    sessions_attended: number;
    pricing_tier_id: string | null;
    calculated_price: number;
    is_paid: boolean;
    created_at: string;
    updated_at: string;
    // Relations
    student?: Student;
    pricing_tier?: PricingTier;
}

// Learning History (ประวัติการเรียน)
export interface LearningHistory {
    id: string;
    student_id: string;
    coach_id: string | null;
    session_id: string | null;
    booking_id: string | null;
    branch_id: string | null;
    session_date: string;
    start_time: string | null;
    end_time: string | null;
    duration_minutes: number | null;
    notes: string | null;
    created_at: string;
    // Relations
    student?: Student;
    coach?: Coach;
    session?: Session;
    booking?: Booking;
    branch?: Branch;
}

// Level History (ประวัติ Level)
export interface LevelHistory {
    id: string;
    student_id: string;
    coach_id: string | null;
    previous_level: number;
    new_level: number;
    change_date: string;
    notes: string | null;
    created_at: string;
    // Relations
    student?: Student;
    coach?: Coach;
}

// Payment (การชำระเงิน)
export interface Payment {
    id: string;
    parent_id: string | null;
    enrollment_id: string | null;
    monthly_usage_id: string | null;
    amount: number;
    discount_amount: number;
    final_amount: number;
    coupon_id: string | null;
    status: PaymentStatus;
    payment_date: string | null;
    payment_method: string | null;
    slip_image_url: string | null;
    verified_by: string | null;
    verified_at: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    parent?: Parent;
    enrollment?: Enrollment;
    monthly_usage?: MonthlyUsage;
    coupon?: Coupon;
    verified_by_user?: User;
}

// Coupon (คูปองส่วนลด)
export interface Coupon {
    id: string;
    code: string;
    description: string | null;
    discount_type: DiscountType;
    discount_value: number;
    min_purchase: number;
    max_discount: number | null;
    max_uses: number | null;
    current_uses: number;
    valid_from: string;
    valid_until: string;
    is_active: boolean;
    created_by: string | null;
    created_at: string;
    // Relations
    created_by_user?: User;
}

// Coupon Usage (การใช้คูปอง)
export interface CouponUsage {
    id: string;
    coupon_id: string;
    payment_id: string;
    user_id: string | null;
    discount_applied: number;
    used_at: string;
    // Relations
    coupon?: Coupon;
    payment?: Payment;
    user?: User;
}

// Coach Payroll (เงินเดือนโค้ช)
export interface CoachPayroll {
    id: string;
    coach_id: string;
    period_start: string;
    period_end: string;
    base_salary: number;
    regular_hours: number;
    overtime_hours_group: number;
    overtime_hours_private: number;
    overtime_pay: number;
    bonus: number;
    total_pay: number;
    is_paid: boolean;
    paid_date: string | null;
    approved_by: string | null;
    notes: string | null;
    created_at: string;
    // Relations
    coach?: Coach;
    approved_by_user?: User;
}

// Teaching Program (โปรแกรมสอน)
export interface TeachingProgram {
    id: string;
    coach_id: string;
    session_id: string | null;
    session_date: string;
    program_content: string;
    level_focus: number | null;
    submitted_at: string;
    reviewed_by: string | null;
    review_status: ReviewStatus;
    review_notes: string | null;
    reviewed_at: string | null;
    created_at: string;
    // Relations
    coach?: Coach;
    session?: Session;
    reviewed_by_user?: User;
}

// Notification (การแจ้งเตือน)
export interface Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: NotificationType;
    is_read: boolean;
    action_url: string | null;
    created_at: string;
    // Relations
    user?: User;
}

// Activity Log (บันทึกการใช้งาน)
export interface ActivityLog {
    id: string;
    user_id: string | null;
    action: string;
    entity_type: string | null;
    entity_id: string | null;
    details: Record<string, unknown> | null;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    // Relations
    user?: User;
}

// Court (สนาม)
export interface Court {
    id: string;
    branch_id: string;
    name: string;
    max_students: number;
    is_active: boolean;
    created_at: string;
    // Relations
    branch?: Branch;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Get level tier info
export function getLevelTier(level: number): {
    tier: string;
    name: string;
    emoji: string;
    color: string;
} {
    if (level >= 1 && level <= 29) {
        return { tier: 'basic', name: 'พื้นฐาน', emoji: '👶', color: '#10B981' };
    } else if (level >= 30 && level <= 39) {
        return { tier: 'athlete1', name: 'นักกีฬา', emoji: '🔨', color: '#3B82F6' };
    } else if (level >= 40 && level <= 43) {
        return { tier: 'athlete2', name: 'นักกีฬา+', emoji: '🧠', color: '#8B5CF6' };
    } else if (level >= 44 && level <= 60) {
        return { tier: 'advanced', name: 'ขั้นสูง', emoji: '💪', color: '#F59E0B' };
    }
    return { tier: 'unknown', name: 'ไม่ทราบ', emoji: '❓', color: '#6B7280' };
}

// Get session tier description with emoji
export function getSessionTierDescription(sessionsPerMonth: number): {
    description: string;
    emoji: string;
    color: string;
} {
    if (sessionsPerMonth < 4) {
        return { 
            description: 'ควรหาวันเรียนเพิ่ม เพื่อความต่อเนื่องของทักษะแบดมินตัน', 
            emoji: '⚠️', 
            color: '#EF4444' 
        };
    } else if (sessionsPerMonth === 4) {
        return { description: 'ขั้นต่ำ', emoji: '🏸', color: '#10B981' };
    } else if (sessionsPerMonth <= 8) {
        return { description: 'ออกกำลังกาย', emoji: '💪', color: '#3B82F6' };
    } else if (sessionsPerMonth <= 12) {
        return { description: 'เริ่มต้นเป็นนักกีฬา', emoji: '⭐', color: '#8B5CF6' };
    } else if (sessionsPerMonth <= 16) {
        return { description: 'นักกีฬา', emoji: '🏆', color: '#F59E0B' };
    } else if (sessionsPerMonth <= 19) {
        return { description: 'นักกีฬา', emoji: '🏆', color: '#F59E0B' };
    } else if (sessionsPerMonth >= 24) {
        return { description: 'นักกีฬาระดับประเทศ', emoji: '🥇', color: '#DC2626' };
    }
    return { description: 'นักกีฬา', emoji: '🏆', color: '#F59E0B' };
}

// Format day of week (Thai)
export function formatDayOfWeek(dayOfWeek: number): string {
    const days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    return days[dayOfWeek] || 'ไม่ทราบ';
}

// Format time (Thai style)
export function formatTime(time: string): string {
    return time.substring(0, 5) + ' น.';
}

// Format price (Thai Baht)
export function formatPrice(amount: number): string {
    return new Intl.NumberFormat('th-TH', { 
        style: 'currency', 
        currency: 'THB',
        minimumFractionDigits: 0 
    }).format(amount);
}

// Calculate age from birth date
export function calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

// Determine if student is adult (18+)
export function isAdult(birthDate: string): boolean {
    return calculateAge(birthDate) >= 18;
}
