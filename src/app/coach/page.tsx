import DashboardLayout from "@/components/DashboardLayout";
import {
    Calendar,
    Users,
    Clock,
    TrendingUp,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { getCoachDashboardData, getCoachTodayClasses, getCoachStudents } from "@/lib/data/dashboard";

export default async function CoachDashboard() {
    // Fetch real data
    const dashboardData = await getCoachDashboardData();
    const todayClasses = await getCoachTodayClasses();
    const myStudents = await getCoachStudents(4);

    const stats = [
        { label: "ชั่วโมงสอนสัปดาห์นี้", value: dashboardData.teachingHoursThisWeek.toString(), icon: Clock, color: "var(--primary)" },
        { label: "นักเรียนที่ดูแล", value: dashboardData.studentsManaged.toString(), icon: Users, color: "var(--secondary)" },
        { label: "OT สัปดาห์นี้", value: `${dashboardData.overtimeHours} ชม.`, icon: TrendingUp, color: "var(--success)" },
    ];

    return (
        <DashboardLayout role="coach" userName="โค้ชบอล" userRole="หัวหน้าโค้ช">
            <div>
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                        แดชบอร์ด
                    </h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        สวัสดีโค้ชบอล! ตารางสอนวันนี้ของคุณ
                    </p>
                </div>

                {/* Stats */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 16,
                    marginBottom: 32
                }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="card" style={{ padding: 20 }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12
                            }}>
                                <div style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 10,
                                    background: `${stat.color}20`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <stat.icon size={22} style={{ color: stat.color }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
                                    <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>
                                        {stat.label}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Today's Classes */}
                <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                        ตารางสอนวันนี้
                    </h2>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {todayClasses.length > 0 ? todayClasses.map((cls, i) => (
                            <div key={i} style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                padding: 16,
                                background: "var(--background)",
                                borderRadius: 12,
                                borderLeft: `4px solid ${cls.status === "completed" ? "var(--success)" :
                                        cls.status === "ongoing" ? "var(--primary)" :
                                            "var(--foreground-muted)"
                                    }`
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                    <div style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 10,
                                        background: "rgba(0,212,255,0.1)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                        <Calendar size={20} style={{ color: "var(--primary)" }} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, marginBottom: 4 }}>{cls.time}</div>
                                        <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
                                            {cls.branch} • Level {cls.level} • {cls.students} คน
                                        </div>
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    {cls.status === "completed" && (
                                        <>
                                            <CheckCircle size={18} style={{ color: "var(--success)" }} />
                                            <span style={{ fontSize: 14, color: "var(--success)" }}>เสร็จสิ้น</span>
                                        </>
                                    )}
                                    {cls.status === "ongoing" && (
                                        <>
                                            <AlertCircle size={18} style={{ color: "var(--primary)" }} />
                                            <span style={{ fontSize: 14, color: "var(--primary)" }}>กำลังสอน</span>
                                        </>
                                    )}
                                    {cls.status === "upcoming" && (
                                        <span style={{ fontSize: 14, color: "var(--foreground-muted)" }}>รอสอน</span>
                                    )}
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: "center", padding: 20, color: "var(--foreground-muted)" }}>
                                ไม่มีคลาสวันนี้
                            </div>
                        )}
                    </div>
                </div>

                {/* My Students */}
                <div className="card" style={{ padding: 24 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>
                        นักเรียนที่ดูแล
                    </h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 12
                    }}>
                        {myStudents.length > 0 ? myStudents.map((student, i) => (
                            <div key={i} style={{
                                padding: 16,
                                background: "var(--background)",
                                borderRadius: 12
                            }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    marginBottom: 12
                                }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#0A1628",
                                        fontWeight: 600
                                    }}>
                                        {student.name?.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 500 }}>{student.name}</div>
                                        <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                            Level {student.level}
                                        </div>
                                    </div>
                                </div>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: 13
                                }}>
                                    <span style={{ color: "var(--foreground-muted)" }}>
                                        {student.sessions} ครั้ง/เดือน
                                    </span>
                                    <span style={{
                                        color: student.progress === "NEW" ? "var(--warning)" : "var(--success)",
                                        fontWeight: 500
                                    }}>
                                        {student.progress}
                                    </span>
                                </div>
                            </div>
                        )) : (
                            <div style={{ textAlign: "center", padding: 20, color: "var(--foreground-muted)", gridColumn: "1/-1" }}>
                                ยังไม่มีนักเรียน
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
