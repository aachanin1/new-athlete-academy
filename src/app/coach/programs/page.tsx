import DashboardLayout from "@/components/DashboardLayout";
import { ClipboardList, Plus } from "lucide-react";

export default function CoachProgramsPage() {
    return (
        <DashboardLayout role="coach" userName="โค้ชบอล" userRole="หัวหน้าโค้ช">
            <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 700 }}>โปรแกรมการสอน</h1>
                    <button className="btn-primary" style={{ padding: "10px 20px" }}>
                        <Plus size={18} />
                        สร้างโปรแกรม
                    </button>
                </div>

                <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--foreground-muted)" }}>
                    <ClipboardList size={64} style={{ opacity: 0.2, marginBottom: 20 }} />
                    <h3>ยังไม่มีโปรแกรมการสอน</h3>
                    <p>สร้างแผนการสอนเพื่อใช้ในคลาสเรียนของคุณ</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
