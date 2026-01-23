"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =====================================================
// Child Management Actions
// =====================================================

export async function addChild(formData: FormData) {
    const supabase = await createClient();

    const parentId = formData.get("parent_id") as string;
    const fullName = formData.get("full_name") as string;
    const nickname = formData.get("nickname") as string;
    const birthDate = formData.get("birth_date") as string;
    const gender = formData.get("gender") as string;

    if (!parentId || !fullName) {
        return { error: "กรุณากรอกข้อมูลให้ครบ" };
    }

    const { data, error } = await supabase
        .from("students")
        .insert({
            parent_id: parentId,
            full_name: fullName,
            nickname: nickname || null,
            birth_date: birthDate || null,
            gender: gender || null,
            current_level: 1,
            is_active: true,
        })
        .select()
        .single();

    if (error) {
        console.error("Error adding child:", error);
        return { error: error.message };
    }

    revalidatePath("/parent");
    revalidatePath("/parent/children");
    return { success: true, data };
}

export async function updateChild(childId: string, formData: FormData) {
    const supabase = await createClient();

    const fullName = formData.get("full_name") as string;
    const nickname = formData.get("nickname") as string;
    const birthDate = formData.get("birth_date") as string;
    const gender = formData.get("gender") as string;

    const { error } = await supabase
        .from("students")
        .update({
            full_name: fullName,
            nickname: nickname || null,
            birth_date: birthDate || null,
            gender: gender || null,
        })
        .eq("id", childId);

    if (error) {
        console.error("Error updating child:", error);
        return { error: error.message };
    }

    revalidatePath("/parent");
    revalidatePath("/parent/children");
    return { success: true };
}

export async function getParentIdFromUser() {
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get parent record
    const { data: parent } = await supabase
        .from("parents")
        .select("id")
        .eq("user_id", user.id)
        .single();

    return parent?.id || null;
}

export async function ensureParentExists() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Check if parent already exists
    const { data: existingParent } = await supabase
        .from("parents")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (existingParent) return existingParent.id;

    // Create parent record
    const { data: newParent, error } = await supabase
        .from("parents")
        .insert({
            user_id: user.id,
        })
        .select()
        .single();

    if (error) {
        console.error("Error creating parent:", error);
        return null;
    }

    return newParent.id;
}

export async function getMyChildren(parentId: string) {
    const supabase = await createClient();

    const { data } = await supabase
        .from("students")
        .select("*")
        .eq("parent_id", parentId)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    return data || [];
}
