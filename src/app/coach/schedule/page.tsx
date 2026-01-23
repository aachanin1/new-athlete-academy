import DashboardLayout from "@/components/DashboardLayout";
import { getCoachTodayClasses } from "@/lib/data/dashboard";
import CoachScheduleClient from "./CoachScheduleClient";

export default async function CoachSchedulePage() {
    const todayClasses = await getCoachTodayClasses();

    return (
        <DashboardLayout role="coach" userName="โค้ชบอล" userRole="หัวหน้าโค้ช">
            <CoachScheduleClient initialClasses={todayClasses} />
        </DashboardLayout>
    );
}
