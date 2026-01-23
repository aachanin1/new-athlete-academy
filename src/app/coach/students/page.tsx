import DashboardLayout from "@/components/DashboardLayout";
import { getCoachStudents } from "@/lib/data/dashboard";
import { Search, Trophy, History } from "lucide-react";

export default async function CoachStudentsPage() {
    const students = await getCoachStudents(20); // Get more students

    return (
        <DashboardLayout role="coach" userName="โค้ชบอล" userRole="หัวหน้าโค้ช">
            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                    <div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>นักเรียนที่ดูแล</h1>
                        <p style={{ color: "var(--foreground-muted)" }}>ทั้งหมด {students.length} คน</p>
                    </div>
                </div>

                <div className="card" style={{ padding: 16, marginBottom: 24 }}>
                    <div style={{ position: "relative" }}>
                        <Search size={18} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--foreground-muted)" }} />
                        <input
                            type="text"
                            placeholder="ค้นหาชื่อนักเรียน..."
                            style={{
                                width: "100%",
                                padding: "12px 12px 12px 40px",
                                borderRadius: 8,
                                border: "1px solid var(--border)",
                                background: "var(--background)",
                                color: "var(--foreground)",
                                outline: "none"
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                    {students.map((student, i) => (
                        <div key={i} className="card" style={{ padding: 24 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                <div style={{
                                    width: 56,
                                    height: 56,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 24,
                                    fontWeight: 700,
                                    color: "#0A1628"
                                }}>
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                                        {student.name}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{
                                            padding: "2px 8px",
                                            borderRadius: 4,
                                            background: "var(--primary)",
                                            color: "#0A1628",
                                            fontSize: 12,
                                            fontWeight: 700
                                        }}>
                                            Level {student.level}
                                        </span>
                                        <span style={{ fontSize: 13, color: "var(--foreground-muted)" }}>
                                            {student.sessions} ครั้ง/เดือน
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                padding: 16,
                                background: "var(--background)",
                                borderRadius: 12,
                                display: "flex",
                                flexDirection: "column",
                                gap: 12
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Trophy size={18} style={{ color: "var(--warning)" }} />
                                    <span style={{ fontSize: 14 }}>
                                        พัฒนาการ: <span style={{ color: "var(--success)" }}>{student.progress}</span>
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <History size={18} style={{ color: "var(--foreground-muted)" }} />
                                    <span style={{ fontSize: 14 }}>
                                        เรียนล่าสุด: เมื่อวานนี้
                                    </span>
                                </div>
                            </div>

                            <button style={{
                                width: "100%",
                                marginTop: 16,
                                padding: "10px",
                                background: "rgba(0,212,255,0.1)",
                                border: "none",
                                borderRadius: 8,
                                color: "var(--primary)",
                                cursor: "pointer",
                                fontWeight: 500
                            }}>
                                ดูประวัติการฝึกซ้อม
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
