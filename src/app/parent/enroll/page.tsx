import DashboardLayout from "@/components/DashboardLayout";
import EnrollClient from "./EnrollClient";
import { createClient } from "@/lib/supabase/server";

export default async function EnrollPage() {
    const supabase = await createClient();

    // Get branches
    const { data: branches } = await supabase
        .from("branches")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

    // Demo user ID - in production, get from auth
    const userId = "demo-user-id";

    return (
        <DashboardLayout role="parent" userName="คุณสมชาย" userRole="ผู้ปกครอง">
            <EnrollClient
                userId={userId}
                branches={branches || []}
            />
        </DashboardLayout>
    );
}
