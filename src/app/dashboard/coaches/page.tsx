import DashboardLayout from "@/components/DashboardLayout";
import { getAllCoaches } from "@/lib/coachManagement";
import { getBranches } from "@/lib/data/dashboard";
import CoachManagementClient from "./CoachManagementClient";

export default async function CoachesPage() {
    const [coaches, branches] = await Promise.all([
        getAllCoaches(),
        getBranches(),
    ]);

    return (
        <DashboardLayout role="admin" userName="ดราฟ" userRole="Super Admin">
            <CoachManagementClient initialCoaches={coaches} branches={branches} />
        </DashboardLayout>
    );
}
