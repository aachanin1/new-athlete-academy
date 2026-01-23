import DashboardLayout from "@/components/DashboardLayout";
import { getFinanceStats } from "@/lib/data/dashboard";
import FinanceClient from "./FinanceClient";

export default async function FinancePage() {
    const stats = await getFinanceStats();

    return (
        <DashboardLayout role="admin" userName="ดราฟ" userRole="Super Admin">
            <FinanceClient initialStats={stats} />
        </DashboardLayout>
    );
}
