"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// Payment Actions
// =====================================================

export async function addPayment(formData: FormData) {
    const supabase = await createClient();

    const enrollmentId = formData.get("enrollment_id") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const month = formData.get("month") as string;
    const status = formData.get("status") as string || "pending";

    const { data, error } = await supabase
        .from("payments")
        .insert({
            enrollment_id: enrollmentId,
            amount,
            month,
            status,
            payment_date: status === "paid" ? new Date().toISOString().split("T")[0] : null,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating payment:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/finance");
    return { success: true, data };
}

export async function updatePaymentStatus(paymentId: string, newStatus: string) {
    const supabase = await createClient();

    const updateData: { status: string; payment_date?: string | null } = {
        status: newStatus,
    };

    if (newStatus === "paid") {
        updateData.payment_date = new Date().toISOString().split("T")[0];
    }

    const { error } = await supabase
        .from("payments")
        .update(updateData)
        .eq("id", paymentId);

    if (error) {
        console.error("Error updating payment:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/finance");
    return { success: true };
}

export async function getEnrollmentsForPayment() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("enrollments")
        .select(`
            id,
            price_per_month,
            students (
                id,
                full_name,
                nickname
            ),
            branches (
                name
            )
        `)
        .eq("status", "active");

    if (error) {
        console.error("Error fetching enrollments:", error);
        return [];
    }

    return data?.map(e => ({
        id: e.id,
        pricePerMonth: e.price_per_month,
        studentName: (e.students as any)?.full_name || "ไม่ระบุ",
        studentNickname: (e.students as any)?.nickname || "",
        branchName: (e.branches as any)?.name || "",
    })) || [];
}
