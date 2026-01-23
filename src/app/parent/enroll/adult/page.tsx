import DashboardLayout from "@/components/DashboardLayout";
import AdultSelfEnrollForm from "../AdultSelfEnrollForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdultEnrollPage() {
    const supabase = await createClient();

    // Get current user from auth session
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Get user profile
    const { data: profile } = await supabase
        .from("users")
        .select("full_name, email, phone")
        .eq("id", user.id)
        .single();

    const userName = profile?.full_name || user.user_metadata?.full_name || "ผู้ใช้";
    const userEmail = profile?.email || user.email || "";
    const userPhone = profile?.phone || "";

    // Get branches
    const { data: branches } = await supabase
        .from("branches")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

    return (
        <DashboardLayout role="parent" userName={userName} userRole="ผู้ปกครอง">
            <div style={{ maxWidth: 600, margin: "0 auto" }}>
                <div style={{ marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                        ลงทะเบียนคอร์สผู้ใหญ่
                    </h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        ยืนยันข้อมูลของท่านและเลือกสาขาที่ต้องการเรียน
                    </p>
                </div>

                <AdultSelfEnrollForm
                    userId={user.id}
                    userName={userName}
                    userEmail={userEmail}
                    userPhone={userPhone}
                    branches={branches || []}
                />
            </div>
        </DashboardLayout>
    );
}

