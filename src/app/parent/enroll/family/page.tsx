import DashboardLayout from "@/components/DashboardLayout";
import FamilyEnrollClient from "./FamilyEnrollClient";
import { createClient } from "@/lib/supabase/server";

// Demo parent ID
const DEMO_PARENT_ID = "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

export default async function FamilyEnrollPage() {
    const supabase = await createClient();

    // Get branches
    const { data: branches } = await supabase
        .from("branches")
        .select("id, name")
        .eq("is_active", true)
        .order("name");

    // Demo IDs - in production, get from auth
    const userId = "demo-user-id";
    const parentId = DEMO_PARENT_ID;

    return (
        <DashboardLayout role="parent" userName="คุณสมชาย" userRole="ผู้ปกครอง">
            <FamilyEnrollClient
                userId={userId}
                parentId={parentId}
                branches={branches || []}
            />
        </DashboardLayout>
    );
}
