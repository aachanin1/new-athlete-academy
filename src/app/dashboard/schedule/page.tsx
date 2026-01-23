import DashboardLayout from "@/components/DashboardLayout";
import { getScheduleByDate, getBranches } from "@/lib/data/dashboard";
import ScheduleClient from "./ScheduleClient";

export default async function SchedulePage() {
    const today = new Date().toISOString().split("T")[0];
    const [schedule, branches] = await Promise.all([
        getScheduleByDate(today),
        getBranches(),
    ]);

    return (
        <DashboardLayout role="admin" userName="ดราฟ" userRole="Super Admin">
            <ScheduleClient
                initialSchedule={schedule}
                branches={branches}
                initialDate={today}
            />
        </DashboardLayout>
    );
}
