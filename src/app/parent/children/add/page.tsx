import DashboardLayout from "@/components/DashboardLayout";
import AddChildForm from "./AddChildForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AddChildPage() {
    const supabase = await createClient();

    // Get current user from auth session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get user's parent record
    const { data: parent } = await supabase
        .from("parents")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!parent) {
        // Create parent record if it doesn't exist
        const { data: newParent, error } = await supabase
            .from("parents")
            .insert({ user_id: user.id })
            .select("id")
            .single();

        if (error || !newParent) {
            console.error("Failed to create parent record:", error);
            redirect("/parent");
        }

        var parentId = newParent.id;
    } else {
        var parentId = parent.id;
    }

    // Get user profile for display name
    const { data: profile } = await supabase
        .from("users")
        .select("full_name")
        .eq("id", user.id)
        .single();

    const userName = profile?.full_name || "ผู้ปกครอง";

    // Fetch branches for dropdown
    const { data: branches } = await supabase
        .from("branches")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

    return (
        <DashboardLayout role="parent" userName={userName} userRole="ผู้ปกครอง">
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>เพิ่มข้อมูลลูก</h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        กรุณากรอกข้อมูลลูกของท่านเพื่อลงทะเบียนเรียน
                    </p>
                </div>

                <AddChildForm parentId={parentId} branches={branches || []} />
            </div>
        </DashboardLayout>
    );
}
