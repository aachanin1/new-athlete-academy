import DashboardLayout from "@/components/DashboardLayout";
import { getBranchesWithStats } from "@/lib/data/dashboard";
import BranchesClient from "./BranchesClient";

export default async function BranchesPage() {
    const branches = await getBranchesWithStats();

    return (
        <DashboardLayout role="admin" userName="ดราฟ" userRole="Super Admin">
            <BranchesClient initialBranches={branches} />
        </DashboardLayout>
    );
}
