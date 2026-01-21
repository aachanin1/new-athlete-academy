import DashboardLayout from "@/components/DashboardLayout";
import {
    Users,
    GraduationCap,
    MapPin,
    TrendingUp,
    Calendar,
    CreditCard,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

// Mock data for stats
const stats = [
    {
        label: "นักเรียนทั้งหมด",
        value: "127",
        change: "+12%",
        up: true,
        icon: Users,
        color: "var(--primary)"
    },
    {
        label: "โค้ชทั้งหมด",
        value: "18",
        change: "+2",
        up: true,
        icon: GraduationCap,
        color: "var(--secondary)"
    },
    {
        label: "สาขา",
        value: "7",
        change: "0",
        up: true,
        icon: MapPin,
        color: "var(--success)"
    },
    {
        label: "รายได้เดือนนี้",
        value: "฿428,500",
        change: "+8.2%",
        up: true,
        icon: CreditCard,
        color: "var(--warning)"
    },
];

// Mock data for recent students
const recentStudents = [
    { name: "น้องบิว", level: 15, branch: "แจ้งวัฒนะ", status: "active" },
    { name: "น้องเปา", level: 8, branch: "พระราม 2", status: "trial" },
    { name: "น้องมายด์", level: 32, branch: "รามอินทรา", status: "active" },
    { name: "น้องปลื้ม", level: 22, branch: "สุวรรณภูมิ", status: "active" },
    { name: "น้องฟิล์ม", level: 5, branch: "เทพารักษ์", status: "trial" },
];

// Mock data for today's schedule
const todaySchedule = [
    { time: "09:00 - 11:00", branch: "แจ้งวัฒนะ", students: 24, coaches: 4 },
    { time: "13:00 - 15:00", branch: "รามอินทรา", students: 18, coaches: 3 },
    { time: "16:00 - 18:00", branch: "พระราม 2", students: 20, coaches: 3 },
    { time: "18:00 - 20:00", branch: "เทพารักษ์", students: 15, coaches: 2 },
];

export default function AdminDashboard() {
    return (
        <DashboardLayout role="admin" userName="ดราฟ" userRole="Super Admin">
            <div>
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                        แดชบอร์ด
                    </h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        ภาพรวมการดำเนินงานของ New Athlete Academy
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                    gap: 20,
                    marginBottom: 32
                }}>
                    {stats.map((stat, i) => (
                        <div key={i} className="card" style={{ padding: 24 }}>
                            <div style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                marginBottom: 16
                            }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 12,
                                    background: `${stat.color}20`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <stat.icon size={24} style={{ color: stat.color }} />
                                </div>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 4,
                                    fontSize: 14,
                                    fontWeight: 500,
                                    color: stat.up ? "var(--success)" : "var(--error)"
                                }}>
                                    {stat.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                                    {stat.change}
                                </div>
                            </div>
                            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                    gap: 24
                }}>
                    {/* Recent Students */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 20
                        }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600 }}>นักเรียนล่าสุด</h2>
                            <a href="/dashboard/students" style={{
                                fontSize: 14,
                                color: "var(--primary)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                            }}>
                                ดูทั้งหมด
                                <ArrowUpRight size={14} />
                            </a>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {recentStudents.map((student, i) => (
                                <div key={i} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 12,
                                    background: "var(--background)",
                                    borderRadius: 10
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#0A1628",
                                            fontWeight: 600,
                                            fontSize: 14
                                        }}>
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500, fontSize: 14 }}>{student.name}</div>
                                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                {student.branch} • Level {student.level}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: "4px 10px",
                                        borderRadius: 20,
                                        fontSize: 12,
                                        fontWeight: 500,
                                        background: student.status === "active"
                                            ? "rgba(16, 185, 129, 0.1)"
                                            : "rgba(245, 158, 11, 0.1)",
                                        color: student.status === "active"
                                            ? "var(--success)"
                                            : "var(--warning)"
                                    }}>
                                        {student.status === "active" ? "เรียนอยู่" : "ทดลอง"}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Today's Schedule */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 20
                        }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600 }}>ตารางวันนี้</h2>
                            <a href="/dashboard/schedule" style={{
                                fontSize: 14,
                                color: "var(--primary)",
                                display: "flex",
                                alignItems: "center",
                                gap: 4
                            }}>
                                ดูทั้งหมด
                                <ArrowUpRight size={14} />
                            </a>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {todaySchedule.map((item, i) => (
                                <div key={i} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 12,
                                    background: "var(--background)",
                                    borderRadius: 10
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            background: "rgba(0,212,255,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <Calendar size={18} style={{ color: "var(--primary)" }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500, fontSize: 14 }}>{item.branch}</div>
                                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                {item.time}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>{item.students} คน</div>
                                        <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                            {item.coaches} โค้ช
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
