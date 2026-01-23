"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// Students Actions
// =====================================================

export async function addStudent(formData: FormData) {
    const supabase = await createClient();

    const fullName = formData.get("full_name") as string;
    const nickname = formData.get("nickname") as string;
    const birthDate = formData.get("birth_date") as string;
    const gender = formData.get("gender") as string;
    const currentLevel = parseInt(formData.get("current_level") as string) || 1;
    const branchId = formData.get("branch_id") as string;
    const sessionsPerMonth = parseInt(formData.get("sessions_per_month") as string) || 8;

    // Create student first
    const { data: student, error: studentError } = await supabase
        .from("students")
        .insert({
            full_name: fullName,
            nickname: nickname,
            birth_date: birthDate || null,
            gender: gender || null,
            current_level: currentLevel,
            is_active: true,
        })
        .select()
        .single();

    if (studentError) {
        console.error("Error creating student:", studentError);
        return { error: studentError.message };
    }

    // Create enrollment if branch is selected
    if (branchId && student) {
        const { error: enrollmentError } = await supabase.from("enrollments").insert({
            student_id: student.id,
            branch_id: branchId,
            sessions_per_month: sessionsPerMonth,
            price_per_month: sessionsPerMonth * 500, // Base price calculation
            status: "active",
            start_date: new Date().toISOString().split("T")[0],
        });

        if (enrollmentError) {
            console.error("Error creating enrollment:", enrollmentError);
        }
    }

    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard");
    return { success: true, data: student };
}

export async function updateStudent(id: string, formData: FormData) {
    const supabase = await createClient();

    const fullName = formData.get("full_name") as string;
    const nickname = formData.get("nickname") as string;
    const birthDate = formData.get("birth_date") as string;
    const gender = formData.get("gender") as string;
    const currentLevel = parseInt(formData.get("current_level") as string) || 1;

    const { error } = await supabase
        .from("students")
        .update({
            full_name: fullName,
            nickname: nickname,
            birth_date: birthDate || null,
            gender: gender || null,
            current_level: currentLevel,
        })
        .eq("id", id);

    if (error) {
        console.error("Error updating student:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard");
    return { success: true };
}

export async function deleteStudent(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("students").delete().eq("id", id);

    if (error) {
        console.error("Error deleting student:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard");
    return { success: true };
}

// =====================================================
// Branches Actions
// =====================================================

export async function addBranch(formData: FormData) {
    const supabase = await createClient();

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;

    const { data, error } = await supabase
        .from("branches")
        .insert({
            name,
            address,
            phone,
            is_active: true,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating branch:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/branches");
    revalidatePath("/dashboard");
    return { success: true, data };
}

// =====================================================
// Sessions/Classes Actions
// =====================================================

export async function addSession(formData: FormData) {
    const supabase = await createClient();

    const branchId = formData.get("branch_id") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("start_time") as string;
    const endTime = formData.get("end_time") as string;
    const maxStudents = parseInt(formData.get("max_students") as string) || 6;

    const { data, error } = await supabase
        .from("sessions")
        .insert({
            branch_id: branchId,
            date,
            start_time: startTime,
            end_time: endTime,
            max_students: maxStudents,
            is_cancelled: false,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating session:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/schedule");
    return { success: true, data };
}

export async function getSessionAttendance(sessionId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("attendance")
        .select(`
            id,
            status,
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
        return { error: error.message };
    }

    return { success: true, data };
}
