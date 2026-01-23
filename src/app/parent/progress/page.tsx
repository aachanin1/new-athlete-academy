import DashboardLayout from "@/components/DashboardLayout";
import { Trophy } from "lucide-react";

export default function ParentProgressPage() {
    return (
        <DashboardLayout role="parent" userName="คุณสมชาย" userRole="ผู้ปกครอง">
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>พัฒนาการของลูก</h1>
                <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--foreground-muted)" }}>
                    <Trophy size={64} style={{ opacity: 0.2, marginBottom: 20 }} />
                    <h3>กราฟแสดงพัฒนาการ</h3>
                    <p>ติดตามความก้าวหน้าและสถิติการฝึกซ้อมได้ที่นี่</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
