import DashboardLayout from "@/components/DashboardLayout";
import { getParentChildrenForBooking } from "@/lib/data/dashboard";
import ParentBookingClient from "./ParentBookingClient";

// Demo parent ID - in production, get from auth session
const DEMO_PARENT_ID = "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

export default async function ParentSchedulePage() {
    const children = await getParentChildrenForBooking(DEMO_PARENT_ID);

    return (
        <DashboardLayout role="parent" userName="คุณสมชาย" userRole="ผู้ปกครอง">
            <ParentBookingClient
                parentId={DEMO_PARENT_ID}
                children={children}
            />
        </DashboardLayout>
    );
}
