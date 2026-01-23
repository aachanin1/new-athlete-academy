"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// Parent Booking Actions
// =====================================================

export async function getAvailableSessions() {
    const supabase = await createClient();
    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
        .from("sessions")
        .select(`
            id,
            date,
            start_time,
            end_time,
            max_students,
            branch_id,
            branches (name),
            attendance (id)
        `)
        .gte("date", today)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true })
        .limit(20);

    return data?.map(session => ({
        id: session.id,
        date: session.date,
        startTime: session.start_time?.slice(0, 5) || "00:00",
        endTime: session.end_time?.slice(0, 5) || "00:00",
        branchId: session.branch_id,
        branchName: (session.branches as any)?.name || "-",
        maxStudents: session.max_students || 10,
        currentStudents: session.attendance?.length || 0,
        spotsLeft: (session.max_students || 10) - (session.attendance?.length || 0),
    })) || [];
}

export async function getParentChildrenForBooking() {
    const supabase = await createClient();

    // Get students that are children of any parent
    const { data } = await supabase
        .from("students")
        .select(`
            id,
            full_name,
            nickname,
            current_level,
            enrollments (
                id,
                branch_id,
                status
            )
        `)
        .limit(10);

    return data?.map(s => ({
        id: s.id,
        fullName: s.full_name || "",
        nickname: s.nickname || "",
        level: s.current_level || 1,
        enrollmentId: s.enrollments?.[0]?.id || null,
        branchId: s.enrollments?.[0]?.branch_id || null,
    })) || [];
}

export async function bookSession(sessionId: string, studentId: string) {
    const supabase = await createClient();

    // Check if already booked
    const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("session_id", sessionId)
        .eq("student_id", studentId)
        .single();

    if (existing) {
        return { error: "ลงทะเบียนในคลาสนี้แล้ว" };
    }

    // Check if session has spots
    const { data: session } = await supabase
        .from("sessions")
        .select("max_students, attendance(id)")
        .eq("id", sessionId)
        .single();

    const currentCount = session?.attendance?.length || 0;
    const maxStudents = session?.max_students || 10;

    if (currentCount >= maxStudents) {
        return { error: "คลาสนี้เต็มแล้ว" };
    }

    // Book the session
    const { error } = await supabase
        .from("attendance")
        .insert({
            session_id: sessionId,
            student_id: studentId,
            status: "pending",
        });

    if (error) {
        console.error("Error booking session:", error);
        return { error: error.message };
    }

    revalidatePath("/parent/schedule");
    return { success: true };
}

export async function cancelBooking(sessionId: string, studentId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("attendance")
        .delete()
        .eq("session_id", sessionId)
        .eq("student_id", studentId);

    if (error) {
        console.error("Error canceling booking:", error);
        return { error: error.message };
    }

    revalidatePath("/parent/schedule");
    return { success: true };
}

export async function getBookedSessions(studentId: string) {
    const supabase = await createClient();

    const { data } = await supabase
        .from("attendance")
        .select("session_id")
        .eq("student_id", studentId);

    return data?.map(a => a.session_id) || [];
}
