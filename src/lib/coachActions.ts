"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// Coach Attendance Actions
// =====================================================

export async function getSessionStudents(sessionId: string) {
    const supabase = await createClient();

    // Get students enrolled for this session
    const { data: attendance, error } = await supabase
        .from("attendance")
        .select(`
            id,
            status,
            check_in_time,
            student_id,
            students (
                id,
                full_name,
                nickname,
                current_level
            )
        `)
        .eq("session_id", sessionId);

    if (error) {
        console.error("Error fetching attendance:", error);
        return [];
    }

    return attendance?.map(a => ({
        id: a.id,
        studentId: a.student_id,
        status: a.status,
        checkInTime: a.check_in_time,
        studentName: (a.students as any)?.full_name || "ไม่ระบุ",
        studentNickname: (a.students as any)?.nickname || "",
        currentLevel: (a.students as any)?.current_level || 1,
    })) || [];
}

export async function markAttendance(attendanceId: string, status: "present" | "absent" | "late") {
    const supabase = await createClient();

    const updateData: { status: string; check_in_time?: string } = {
        status,
    };

    if (status === "present" || status === "late") {
        updateData.check_in_time = new Date().toISOString();
    }

    const { error } = await supabase
        .from("attendance")
        .update(updateData)
        .eq("id", attendanceId);

    if (error) {
        console.error("Error marking attendance:", error);
        return { error: error.message };
    }

    revalidatePath("/coach/schedule");
    return { success: true };
}

export async function markAllPresent(sessionId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("attendance")
        .update({
            status: "present",
            check_in_time: new Date().toISOString(),
        })
        .eq("session_id", sessionId);

    if (error) {
        console.error("Error marking all present:", error);
        return { error: error.message };
    }

    revalidatePath("/coach/schedule");
    return { success: true };
}

export async function addStudentToSession(sessionId: string, studentId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("attendance")
        .insert({
            session_id: sessionId,
            student_id: studentId,
            status: "pending",
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding student to session:", error);
        return { error: error.message };
    }

    revalidatePath("/coach/schedule");
    return { success: true, data };
}

// Get students available for the session (not already added)
export async function getAvailableStudents(sessionId: string, branchId: string) {
    const supabase = await createClient();

    // Get students already in this session
    const { data: existingAttendance } = await supabase
        .from("attendance")
        .select("student_id")
        .eq("session_id", sessionId);

    const existingIds = existingAttendance?.map(a => a.student_id) || [];

    // Get students enrolled in this branch
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select(`
            student_id,
            students (
                id,
                full_name,
                nickname,
                current_level
            )
        `)
        .eq("branch_id", branchId)
        .eq("status", "active");

    const available = enrollments?.filter(e => !existingIds.includes(e.student_id)) || [];

    return available.map(e => ({
        id: (e.students as any)?.id,
        fullName: (e.students as any)?.full_name || "ไม่ระบุ",
        nickname: (e.students as any)?.nickname || "",
        level: (e.students as any)?.current_level || 1,
    }));
}
