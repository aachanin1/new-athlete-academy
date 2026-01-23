import { createClient } from "@/lib/supabase/server";

// =====================================================
// Admin Dashboard Data
// =====================================================

export async function getAdminDashboardStats() {
    const supabase = await createClient();

    const [studentsResult, coachesResult, branchesResult, paymentsResult] = await Promise.all([
        supabase.from("students").select("id", { count: "exact" }).eq("is_active", true),
        supabase.from("coaches").select("id", { count: "exact" }),
        supabase.from("branches").select("id", { count: "exact" }).eq("is_active", true),
        supabase
            .from("payments")
            .select("amount")
            .eq("status", "paid")
            .gte("month", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    ]);

    const totalRevenue = paymentsResult.data?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    return {
        totalStudents: studentsResult.count || 0,
        totalCoaches: coachesResult.count || 0,
        totalBranches: branchesResult.count || 0,
        monthlyRevenue: totalRevenue,
    };
}

export async function getRecentStudents(limit = 5) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("students")
        .select(`
      id,
      full_name,
      nickname,
      current_level,
      enrollments (
        status,
        branches (name)
      )
    `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching students:", error);
        return [];
    }

    return data?.map((student) => ({
        id: student.id,
        name: student.nickname || student.full_name,
        level: student.current_level,
        branch: (student.enrollments?.[0]?.branches as unknown as { name: string } | null)?.name || "-",
        status: student.enrollments?.[0]?.status || "active",
    })) || [];
}

// Get all students with parent information for admin view
export async function getAllStudentsWithParents() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("students")
        .select(`
            id,
            full_name,
            nickname,
            current_level,
            birth_date,
            gender,
            is_active,
            created_at,
            parents (
                id,
                line_id,
                address,
                users (
                    full_name,
                    email,
                    phone
                )
            ),
            enrollments (
                id,
                sessions_per_month,
                price_per_month,
                status,
                branches (name)
            )
        `)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching students with parents:", error);
        return [];
    }

    return data?.map((student) => ({
        id: student.id,
        fullName: student.full_name,
        nickname: student.nickname,
        level: student.current_level,
        birthDate: student.birth_date,
        gender: student.gender,
        createdAt: student.created_at,
        parentId: (student.parents as any)?.id,
        parentName: (student.parents as any)?.users?.full_name || "ไม่ระบุ",
        parentPhone: (student.parents as any)?.users?.phone || "-",
        parentEmail: (student.parents as any)?.users?.email || "-",
        parentLineId: (student.parents as any)?.line_id || "-",
        enrollmentId: student.enrollments?.[0]?.id,
        sessionsPerMonth: student.enrollments?.[0]?.sessions_per_month || 0,
        pricePerMonth: Number(student.enrollments?.[0]?.price_per_month) || 0,
        enrollmentStatus: student.enrollments?.[0]?.status || "active",
        branchName: (student.enrollments?.[0]?.branches as unknown as { name: string } | null)?.name || "-",
    })) || [];
}

export async function getTodaySchedule() {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
        .from("sessions")
        .select(`
      id,
      start_time,
      end_time,
      max_students,
      branches (name),
      attendance (id)
    `)
        .eq("date", today)
        .eq("is_cancelled", false)
        .order("start_time", { ascending: true });

    if (error) {
        console.error("Error fetching schedule:", error);
        return [];
    }

    return data?.map((session) => ({
        id: session.id,
        time: `${session.start_time?.slice(0, 5)} - ${session.end_time?.slice(0, 5)}`,
        branch: (session.branches as unknown as { name: string } | null)?.name || "-",
        students: session.attendance?.length || 0,
        maxStudents: session.max_students,
    })) || [];
}

export async function getScheduleByDate(date: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("sessions")
        .select(`
            id,
            date,
            start_time,
            end_time,
            max_students,
            branch_id,
            branches (id, name),
            attendance (id, student_id)
        `)
        .eq("date", date)
        .eq("is_cancelled", false)
        .order("start_time", { ascending: true });

    if (error) {
        console.error("Error fetching schedule:", error);
        return [];
    }

    return data?.map((session) => ({
        id: session.id,
        date: session.date,
        startTime: session.start_time,
        endTime: session.end_time,
        time: `${session.start_time?.slice(0, 5)} - ${session.end_time?.slice(0, 5)}`,
        branchId: session.branch_id,
        branch: (session.branches as unknown as { name: string } | null)?.name || "-",
        students: session.attendance?.length || 0,
        maxStudents: session.max_students,
    })) || [];
}

// =====================================================
// Coach Dashboard Data
// =====================================================

export async function getCoachDashboardData(coachId?: string) {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    // Get coach payroll for hours info
    const { data: payrollData } = await supabase
        .from("coach_payroll")
        .select("regular_hours, overtime_hours_group, overtime_hours_private")
        .eq("month", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0])
        .limit(1)
        .single();

    // Get students coached
    const { count: studentCount } = await supabase
        .from("attendance")
        .select("student_id", { count: "exact" });

    return {
        teachingHoursThisWeek: payrollData?.regular_hours ? Math.floor(payrollData.regular_hours / 4) : 28,
        studentsManaged: studentCount || 24,
        overtimeHours: (payrollData?.overtime_hours_group || 0) + (payrollData?.overtime_hours_private || 0),
    };
}

export async function getCoachTodayClasses() {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];
    const now = new Date().toTimeString().slice(0, 5);

    const { data, error } = await supabase
        .from("sessions")
        .select(`
      id,
      branch_id,
      start_time,
      end_time,
      branches (name),
      attendance (id)
    `)
        .eq("date", today)
        .order("start_time", { ascending: true })
        .limit(5);

    if (error) return [];

    return data?.map((session) => {
        const startTime = session.start_time?.slice(0, 5) || "00:00";
        const endTime = session.end_time?.slice(0, 5) || "00:00";
        let status: "completed" | "ongoing" | "upcoming" = "upcoming";

        if (now > endTime) status = "completed";
        else if (now >= startTime && now <= endTime) status = "ongoing";

        return {
            id: session.id,
            branchId: session.branch_id,
            time: `${startTime} - ${endTime}`,
            branch: (session.branches as unknown as { name: string } | null)?.name || "-",
            students: session.attendance?.length || 0,
            level: "1-15",
            status,
        };
    }) || [];
}

export async function getCoachStudents(limit = 4) {
    const supabase = await createClient();

    const { data } = await supabase
        .from("students")
        .select(`
      id,
      nickname,
      current_level,
      level_history (new_level, change_date)
    `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(limit);

    return data?.map((student) => {
        const recentLevels = student.level_history || [];
        const progress = recentLevels.length > 0 ? `+${recentLevels.length} levels` : "NEW";

        return {
            id: student.id,
            name: student.nickname,
            level: student.current_level,
            sessions: 8, // Simulated
            progress,
        };
    }) || [];
}

// =====================================================
// Parent Dashboard Data
// =====================================================

export async function getParentChildren(parentId?: string) {
    const supabase = await createClient();

    // Get current user and parent ID from auth session if not provided
    const { data: { user } } = await supabase.auth.getUser();
    let pId = parentId;
    let userId: string | null = null;

    if (user) {
        userId = user.id;
        if (!pId) {
            const { data: parent } = await supabase
                .from("parents")
                .select("id")
                .eq("user_id", user.id)
                .single();
            pId = parent?.id;
        }
    }

    // Fetch children by parent_id
    let childrenData: any[] = [];
    if (pId) {
        const { data } = await supabase
            .from("students")
            .select(`
                id,
                nickname,
                full_name,
                current_level,
                parent_id,
                is_adult_student,
                enrollments (
                    sessions_per_month,
                    branches (name)
                ),
                level_history (new_level, previous_level)
            `)
            .eq("parent_id", pId)
            .eq("is_active", true);
        childrenData = data || [];
    }

    // Also fetch adult students by user_id (not parent_id)
    let adultData: any[] = [];
    if (userId) {
        const { data } = await supabase
            .from("students")
            .select(`
                id,
                nickname,
                full_name,
                current_level,
                parent_id,
                is_adult_student,
                enrollments (
                    sessions_per_month,
                    branches (name)
                ),
                level_history (new_level, previous_level)
            `)
            .eq("user_id", userId)
            .eq("is_adult_student", true)
            .eq("is_active", true);
        adultData = data || [];
    }

    // Combine and deduplicate
    const allStudents = [...childrenData, ...adultData];
    const uniqueStudents = allStudents.filter((student, index, self) =>
        index === self.findIndex((s) => s.id === student.id)
    );

    const tierName = (level: number) => {
        if (level <= 15) return "พื้นฐาน";
        if (level <= 30) return "กลาง";
        if (level <= 45) return "ก้าวหน้า";
        return "นักกีฬา";
    };

    return uniqueStudents.map((child) => {
        const levelChanges = child.level_history?.length || 0;
        return {
            id: child.id,
            name: child.nickname || child.full_name,
            level: child.current_level,
            tier: tierName(child.current_level),
            emoji: child.is_adult_student ? "🧑" : "🏸",
            nextClass: "พุธ 16:00",
            branch: (child.enrollments?.[0]?.branches as unknown as { name: string } | null)?.name || "-",
            sessionsThisMonth: child.enrollments?.[0]?.sessions_per_month || 8,
            progress: levelChanges > 0 ? `+${levelChanges} levels` : "NEW",
            isAdult: child.is_adult_student || false,
        };
    });
}

export async function getParentChildrenForBooking(parentId?: string) {
    const supabase = await createClient();

    // Get parent ID from auth session if not provided
    let pId = parentId;
    if (!pId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: parent } = await supabase
                .from("parents")
                .select("id")
                .eq("user_id", user.id)
                .single();
            pId = parent?.id;
        }
    }

    if (!pId) {
        return [];
    }

    const { data } = await supabase
        .from("students")
        .select(`
            id,
            nickname,
            full_name,
            current_level,
            enrollments (
                id,
                sessions_per_month,
                price_per_month,
                branches (name)
            )
        `)
        .eq("parent_id", pId)
        .eq("is_active", true);

    return data?.map(child => ({
        id: child.id,
        fullName: child.full_name || "",
        nickname: child.nickname || "",
        level: child.current_level || 1,
        enrollmentId: child.enrollments?.[0]?.id || "",
        sessionsPerMonth: child.enrollments?.[0]?.sessions_per_month || 4,
        pricePerMonth: Number(child.enrollments?.[0]?.price_per_month) || 2500,
        branchName: (child.enrollments?.[0]?.branches as unknown as { name: string } | null)?.name || "-",
    })) || [];
}

export async function getUpcomingClasses(studentIds?: string[]) {
    const supabase = await createClient();
    const today = new Date();

    const { data } = await supabase
        .from("sessions")
        .select(`
      id,
      date,
      start_time,
      end_time,
      branches (name)
    `)
        .gte("date", today.toISOString().split("T")[0])
        .order("date", { ascending: true })
        .order("start_time", { ascending: true })
        .limit(5);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
        return `${days[date.getDay()]} ${date.getDate()} ${["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][date.getMonth()]}`;
    };

    return data?.map((session) => ({
        id: session.id,
        date: formatDate(session.date),
        time: `${session.start_time?.slice(0, 5)} - ${session.end_time?.slice(0, 5)}`,
        branch: (session.branches as unknown as { name: string } | null)?.name || "-",
        child: "น้องบิว",
    })) || [];
}

export async function getPaymentStatus(enrollmentId?: string) {
    const supabase = await createClient();
    const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const { data } = await supabase
        .from("payments")
        .select("*")
        .order("month", { ascending: false })
        .limit(1)
        .single();

    // If no payment data, return empty state
    if (!data) {
        return {
            month: null,
            amount: 0,
            sessions: 0,
            status: "none",
            paidDate: null,
            hasEnrollment: false,
        };
    }

    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    const paymentMonth = new Date(data.month);

    return {
        month: `${monthNames[paymentMonth.getMonth()]} ${paymentMonth.getFullYear() + 543}`,
        amount: Number(data.amount),
        sessions: 8,
        status: data.status,
        paidDate: data.payment_date ? new Date(data.payment_date).toLocaleDateString("th-TH") : null,
        hasEnrollment: true,
    };
}

export async function getParentPaymentHistory() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("payments")
        .select(`
            id,
            amount,
            status,
            payment_date,
            month,
            enrollments (
                sessions_per_month,
                students (
                    full_name,
                    nickname
                )
            )
        `)
        .order("month", { ascending: false })
        .limit(12);

    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    return data?.map(p => {
        const paymentMonth = new Date(p.month);
        return {
            id: p.id,
            month: `${monthNames[paymentMonth.getMonth()]} ${paymentMonth.getFullYear() + 543}`,
            monthRaw: p.month,
            description: `ค่าเรียนแบดมินตัน (${(p.enrollments as any)?.sessions_per_month || 8} ครั้ง)`,
            studentName: (p.enrollments as any)?.students?.nickname || (p.enrollments as any)?.students?.full_name || "",
            paidDate: p.payment_date ? new Date(p.payment_date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" }) : null,
            amount: Number(p.amount),
            status: p.status,
        };
    }) || [];
}

// =====================================================
// Shared Data Functions
// =====================================================

export async function getBranches() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("branches")
        .select("id, name, address")
        .eq("is_active", true);
    return data || [];
}

export async function getBranchesWithStats() {
    const supabase = await createClient();

    // Get branches
    const { data: branches } = await supabase
        .from("branches")
        .select("id, name, address, phone")
        .eq("is_active", true);

    if (!branches) return [];

    // Get student counts per branch
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("branch_id, student_id")
        .eq("status", "active");

    // Get coach counts per branch
    const { data: branchCoaches } = await supabase
        .from("branch_coaches")
        .select("branch_id, coach_id");

    // Calculate stats
    return branches.map(branch => {
        const studentCount = enrollments?.filter(e => e.branch_id === branch.id).length || 0;
        const coachCount = branchCoaches?.filter(c => c.branch_id === branch.id).length || 0;

        return {
            ...branch,
            studentCount,
            coachCount,
        };
    });
}

export async function getAllStudents() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("students")
        .select(`
      id,
      full_name,
      nickname,
      current_level,
      birth_date,
      gender,
      is_active,
      parents (id),
      enrollments (
        status,
        sessions_per_month,
        branches (name)
      )
    `)
        .order("created_at", { ascending: false });
    return data || [];
}

export async function getAllCoaches() {
    const supabase = await createClient();
    const { data } = await supabase
        .from("coaches")
        .select(`
      id,
      employee_id,
      base_salary,
      is_head_coach,
      hire_date,
      specializations,
      bio,
      branch_coaches (
        is_primary,
        branches (name)
      )
    `)
        .order("hire_date", { ascending: true });
    return data || [];
}

export async function getFinanceStats() {
    const supabase = await createClient();

    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    // Get current month payments
    const { data: currentMonthPayments } = await supabase
        .from("payments")
        .select("id, amount, status, payment_date, month")
        .gte("month", currentMonth.toISOString().split("T")[0]);

    // Get last month payments for comparison
    const { data: lastMonthPayments } = await supabase
        .from("payments")
        .select("amount")
        .eq("status", "paid")
        .gte("month", lastMonth.toISOString().split("T")[0])
        .lt("month", currentMonth.toISOString().split("T")[0]);

    // Get all recent payments with student details
    const { data: recentPayments } = await supabase
        .from("payments")
        .select(`
            id,
            amount,
            status,
            payment_date,
            month,
            enrollments (
                students (
                    full_name,
                    nickname
                )
            )
        `)
        .order("payment_date", { ascending: false })
        .limit(10);

    const paidThisMonth = currentMonthPayments
        ?.filter(p => p.status === "paid")
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    const pendingThisMonth = currentMonthPayments
        ?.filter(p => p.status === "pending" || p.status === "overdue")
        .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    const paidLastMonth = lastMonthPayments
        ?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;

    const growthPercent = paidLastMonth > 0
        ? ((paidThisMonth - paidLastMonth) / paidLastMonth * 100).toFixed(1)
        : "0";

    return {
        paidThisMonth,
        pendingThisMonth,
        paidLastMonth,
        growthPercent,
        totalPayments: currentMonthPayments?.length || 0,
        recentPayments: recentPayments?.map(p => ({
            id: p.id,
            amount: p.amount,
            status: p.status,
            paymentDate: p.payment_date,
            month: p.month,
            studentName: (p.enrollments as any)?.students?.full_name || "ไม่ระบุ",
            studentNickname: (p.enrollments as any)?.students?.nickname || "",
        })) || [],
    };
}
