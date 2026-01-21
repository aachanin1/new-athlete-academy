"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const fullName = formData.get("fullName") as string;
    const phone = formData.get("phone") as string;

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                phone: phone,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    // Create user profile in users table
    if (data.user) {
        const { error: profileError } = await supabase.from("users").insert({
            id: data.user.id,
            email: email,
            full_name: fullName,
            phone: phone,
            role: "parent", // Default role for new signups
        });

        if (profileError) {
            console.error("Profile creation error:", profileError);
        }

        // Create parent record
        const { error: parentError } = await supabase.from("parents").insert({
            user_id: data.user.id,
        });

        if (parentError) {
            console.error("Parent creation error:", parentError);
        }
    }

    return { success: true, message: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี" };
}

export async function signIn(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    // Get user role to determine redirect
    const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", data.user.id)
        .single();

    const role = userData?.role || "parent";

    // Redirect based on role
    if (role === "super_admin" || role === "admin") {
        redirect("/dashboard");
    } else if (role === "head_coach" || role === "coach") {
        redirect("/coach");
    } else {
        redirect("/parent");
    }
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function getSession() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function getUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user profile with role
    const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

    return profile;
}
