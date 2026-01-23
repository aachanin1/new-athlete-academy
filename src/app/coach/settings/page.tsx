import DashboardLayout from "@/components/DashboardLayout";
import { Settings } from "lucide-react";

export default function CoachSettingsPage() {
    return (
        <DashboardLayout role="coach" userName="โค้ชบอล" userRole="หัวหน้าโค้ช">
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>ตั้งค่า</h1>
                <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--foreground-muted)" }}>
                    <Settings size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <p>จัดการข้อมูลส่วนตัวและเวลาว่าง</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
