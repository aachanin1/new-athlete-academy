import DashboardLayout from "@/components/DashboardLayout";
import { Settings } from "lucide-react";

export default function ParentSettingsPage() {
    return (
        <DashboardLayout role="parent" userName="คุณสมชาย" userRole="ผู้ปกครอง">
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>ตั้งค่า</h1>
                <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--foreground-muted)" }}>
                    <Settings size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <p>แก้ไขข้อมูลส่วนตัวและเพิ่มลูก</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
