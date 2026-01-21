// Database Types for New Athlete Academy

export type UserRole = 'super_admin' | 'admin' | 'head_coach' | 'coach' | 'parent';
export type StudentType = 'basic' | 'athlete';
export type StudentStatus = 'trial' | 'active' | 'inactive';
export type AttendanceStatus = 'present' | 'absent' | 'rescheduled';
export type PaymentStatus = 'pending' | 'paid' | 'overdue';
export type PayrollStatus = 'draft' | 'approved' | 'paid';
export type ReviewStatus = 'pending' | 'approved' | 'needs_revision';

// Branch (สาขา)
export interface Branch {
    id: string;
    name: string;
    address: string | null;
    contact_phone: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Court (สนาม)
export interface Court {
    id: string;
    branch_id: string;
    name: string;
    max_students: number;
    is_active: boolean;
    created_at: string;
}

// Session (รอบสอน)
export interface Session {
    id: string;
    branch_id: string;
    day_of_week: number; // 0-6 (Sunday-Saturday)
    start_time: string; // HH:mm format
    end_time: string;
    session_number: number; // รอบที่ 1, 2, 3
    is_active: boolean;
    created_at: string;
}

// User Profile
export interface User {
    id: string;
    email: string;
    phone: string | null;
    full_name: string;
    role: UserRole;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

// Coach (โค้ช)
export interface Coach {
    id: string;
    user_id: string;
    nickname: string;
    bio: string | null;
    base_salary: number;
    base_hours_per_week: number;
    overtime_rate_group: number;
    overtime_rate_private: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    // Relations
    user?: User;
}

// Parent (ผู้ปกครอง)
export interface Parent {
    id: string;
    user_id: string;
    address: string | null;
    emergency_contact: string | null;
    created_at: string;
    // Relations
    user?: User;
    students?: Student[];
}

// Student (นักเรียน)
export interface Student {
    id: string;
    parent_id: string;
    nickname: string;
    full_name: string;
    date_of_birth: string;
    current_level: number;
    student_type: StudentType;
    status: StudentStatus;
    joined_date: string;
    profile_image_url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    parent?: Parent;
}

// Enrollment (การลงทะเบียนเรียน)
export interface Enrollment {
    id: string;
    student_id: string;
    session_id: string;
    coach_id: string | null;
    branch_id: string;
    is_fixed: boolean; // วันประจำหรือไม่
    start_date: string;
    end_date: string | null;
    created_at: string;
    // Relations
    student?: Student;
    session?: Session;
    coach?: Coach;
    branch?: Branch;
}

// Attendance (การเข้าเรียน)
export interface Attendance {
    id: string;
    student_id: string;
    session_id: string;
    coach_id: string;
    court_id: string | null;
    date: string;
    status: AttendanceStatus;
    reschedule_from: string | null;
    notes: string | null;
    created_at: string;
    // Relations
    student?: Student;
    session?: Session;
    coach?: Coach;
}

// Level History (ประวัติ Level)
export interface LevelHistory {
    id: string;
    student_id: string;
    coach_id: string;
    from_level: number;
    to_level: number;
    assessed_at: string;
    notes: string | null;
    // Relations
    student?: Student;
    coach?: Coach;
}

// Pricing Tier (แพ็คเกจราคา)
export interface PricingTier {
    id: string;
    name: string;
    min_sessions: number;
    max_sessions: number | null;
    total_price: number;
    price_per_session: number;
    is_drop_in: boolean;
    is_active: boolean;
    created_at: string;
}

// Payment (การชำระเงิน)
export interface Payment {
    id: string;
    parent_id: string;
    student_id: string;
    pricing_tier_id: string | null;
    billing_month: string; // YYYY-MM format
    sessions_count: number;
    total_amount: number;
    status: PaymentStatus;
    paid_at: string | null;
    payment_proof_url: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    // Relations
    parent?: Parent;
    student?: Student;
    pricing_tier?: PricingTier;
}

// Coach Payroll (เงินเดือนโค้ช)
export interface CoachPayroll {
    id: string;
    coach_id: string;
    period_start: string;
    period_end: string;
    base_hours: number;
    overtime_hours_group: number;
    overtime_hours_private: number;
    base_pay: number;
    overtime_pay: number;
    bonus: number;
    total_pay: number;
    status: PayrollStatus;
    created_at: string;
    updated_at: string;
    // Relations
    coach?: Coach;
}

// Teaching Program (โปรแกรมสอน)
export interface TeachingProgram {
    id: string;
    coach_id: string;
    session_date: string;
    session_id: string;
    program_content: string;
    level_focus: number | null;
    submitted_at: string;
    reviewed_by: string | null;
    review_status: ReviewStatus;
    review_notes: string | null;
    // Relations
    coach?: Coach;
    session?: Session;
}

// Branch Coach (โค้ชประจำสาขา)
export interface BranchCoach {
    id: string;
    branch_id: string;
    coach_id: string;
    is_head_coach: boolean;
    created_at: string;
    // Relations
    branch?: Branch;
    coach?: Coach;
}

// Helper function to get level tier info
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

// Helper function to calculate pricing
export function calculatePrice(sessionsPerMonth: number): {
    totalPrice: number;
    pricePerSession: number;
    tierName: string;
} {
    if (sessionsPerMonth === 1) {
        return { totalPrice: 700, pricePerSession: 700, tierName: 'Drop-in' };
    } else if (sessionsPerMonth >= 2 && sessionsPerMonth <= 6) {
        return { totalPrice: 2500, pricePerSession: 625, tierName: 'คอร์ส 4 ครั้ง' };
    } else if (sessionsPerMonth >= 7 && sessionsPerMonth <= 10) {
        return { totalPrice: 4000, pricePerSession: 500, tierName: 'คอร์ส 8 ครั้ง' };
    } else if (sessionsPerMonth >= 11 && sessionsPerMonth <= 14) {
        return { totalPrice: 5200, pricePerSession: 433, tierName: 'คอร์ส 12 ครั้ง' };
    } else if (sessionsPerMonth >= 15 && sessionsPerMonth <= 18) {
        return { totalPrice: 6500, pricePerSession: 406, tierName: 'คอร์ส 16 ครั้ง' };
    } else if (sessionsPerMonth >= 19) {
        return { totalPrice: 7000, pricePerSession: 350, tierName: 'คอร์ส 19+ ครั้ง' };
    }
    return { totalPrice: 0, pricePerSession: 0, tierName: 'ไม่ระบุ' };
}
