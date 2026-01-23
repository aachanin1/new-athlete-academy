import DashboardLayout from "@/components/DashboardLayout";
import { Trophy } from "lucide-react";

export default function CoachLevelsPage() {
    return (
        <DashboardLayout role="coach" userName="โค้ชบอล" userRole="หัวหน้าโค้ช">
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>ประเมิน Level นักเรียน</h1>
                <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--foreground-muted)" }}>
                    <Trophy size={64} style={{ opacity: 0.2, marginBottom: 20 }} />
                    <h3>ระบบประเมินผล</h3>
                    <p>สามารถบันทึกผลการทดสอบและเลื่อนขั้นให้นักเรียนได้ที่นี่</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
