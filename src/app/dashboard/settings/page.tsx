import DashboardLayout from "@/components/DashboardLayout";
import SettingsClient from "./SettingsClient";

export default function SettingsPage() {
    // In a real app, this would come from the authenticated user session
    const userProfile = {
        name: "ดราฟ",
        email: "admin@newathlete.com",
        role: "Super Admin",
        phone: "081-234-5678",
    };

    return (
        <DashboardLayout role="admin" userName={userProfile.name} userRole={userProfile.role}>
            <SettingsClient initialProfile={userProfile} />
        </DashboardLayout>
    );
}
