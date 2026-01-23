"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// Coach Management Actions (Admin Only)
// =====================================================

export async function addCoach(formData: FormData) {
    const supabase = await createClient();

    const fullName = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const employeeId = formData.get("employee_id") as string;
    const baseSalary = parseFloat(formData.get("base_salary") as string) || 20000;
    const isHeadCoach = formData.get("is_head_coach") === "true";

    if (!fullName) {
        return { error: "กรุณากรอกชื่อโค้ช" };
    }

    // Create coach record directly (without user account)
    const { data, error } = await supabase
        .from("coaches")
        .insert({
            employee_id: employeeId || null,
            base_salary: baseSalary,
            is_head_coach: isHeadCoach,
            hire_date: new Date().toISOString().split("T")[0],
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding coach:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/coaches");
    return { success: true, data: { ...data, full_name: fullName, email, phone } };
}

export async function getAllCoaches() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("coaches")
        .select(`
            id,
            employee_id,
            base_salary,
            is_head_coach,
            hire_date,
            users (
                full_name,
                email,
                phone
            ),
            branch_coaches (
                branches (name)
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching coaches:", error);
        return [];
    }

    return data?.map(coach => ({
        id: coach.id,
        employeeId: coach.employee_id || "-",
        fullName: (coach.users as any)?.full_name || `โค้ช ${coach.employee_id || coach.id.slice(0, 8)}`,
        email: (coach.users as any)?.email || "-",
        phone: (coach.users as any)?.phone || "-",
        baseSalary: coach.base_salary,
        isHeadCoach: coach.is_head_coach,
        hireDate: coach.hire_date,
        branch: (coach.branch_coaches?.[0]?.branches as any)?.name || "-",
    })) || [];
}

export async function deleteCoach(coachId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("coaches")
        .delete()
        .eq("id", coachId);

    if (error) {
        console.error("Error deleting coach:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/coaches");
    return { success: true };
}
