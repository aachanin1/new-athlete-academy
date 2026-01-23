import DashboardLayout from "@/components/DashboardLayout";
import { getAdminDashboardStats, getBranchesWithStats, getAllStudents, getAllCoaches } from "@/lib/data/dashboard";
import { Users, MapPin, GraduationCap, Award, TrendingUp, Calendar, Target } from "lucide-react";

export default async function ReportsPage() {
    const [stats, branches, students, coaches] = await Promise.all([
        getAdminDashboardStats(),
        getBranchesWithStats(),
        getAllStudents(),
        getAllCoaches(),
    ]);

    // Calculate level distribution
    const levelDistribution = students.reduce((acc: Record<string, number>, student) => {
        const levelGroup = student.current_level <= 10 ? "1-10"
            : student.current_level <= 20 ? "11-20"
                : student.current_level <= 30 ? "21-30"
                    : student.current_level <= 40 ? "31-40"
                        : "41+";
        acc[levelGroup] = (acc[levelGroup] || 0) + 1;
        return acc;
    }, {});

    // Calculate gender distribution
    const genderDistribution = students.reduce((acc: Record<string, number>, student) => {
        const gender = student.gender === "male" ? "ชาย" : student.gender === "female" ? "หญิง" : "ไม่ระบุ";
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
    }, {});

    // Sort branches by student count
    const topBranches = [...branches].sort((a, b) => b.studentCount - a.studentCount).slice(0, 5);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH').format(amount);
    };

    return (
        <DashboardLayout role="admin" userName="ดราฟ" userRole="Super Admin">
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>รายงานสถิติ</h1>

                {/* Overview Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
                    <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "rgba(0,212,255,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <Users size={24} style={{ color: "var(--primary)" }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalStudents}</div>
                            <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>นักเรียนทั้งหมด</div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "rgba(163,230,53,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <GraduationCap size={24} style={{ color: "var(--secondary)" }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalCoaches}</div>
                            <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>โค้ชทั้งหมด</div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "rgba(16,185,129,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <MapPin size={24} style={{ color: "var(--success)" }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>{stats.totalBranches}</div>
                            <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>สาขาทั้งหมด</div>
                        </div>
                    </div>

                    <div className="card" style={{ padding: 20, display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "rgba(245,158,11,0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <TrendingUp size={24} style={{ color: "var(--warning)" }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 24, fontWeight: 700 }}>฿{formatCurrency(stats.monthlyRevenue)}</div>
                            <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>รายได้เดือนนี้</div>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 20, marginBottom: 32 }}>
                    {/* Level Distribution */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                            <Target size={18} style={{ color: "var(--primary)" }} />
                            การกระจาย Level นักเรียน
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {Object.entries(levelDistribution).map(([level, count]) => (
                                <div key={level}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                        <span style={{ fontSize: 14 }}>Level {level}</span>
                                        <span style={{ fontSize: 14, fontWeight: 500 }}>{count} คน</span>
                                    </div>
                                    <div style={{ height: 8, background: "var(--background)", borderRadius: 4, overflow: "hidden" }}>
                                        <div
                                            style={{
                                                height: "100%",
                                                width: `${(count / students.length) * 100}%`,
                                                background: "linear-gradient(90deg, var(--primary), var(--secondary))",
                                                borderRadius: 4,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gender Distribution */}
                    <div className="card" style={{ padding: 24 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                            <Users size={18} style={{ color: "var(--secondary)" }} />
                            สัดส่วนเพศ
                        </h3>
                        <div style={{ display: "flex", gap: 20, justifyContent: "center", alignItems: "center" }}>
                            {Object.entries(genderDistribution).map(([gender, count]) => (
                                <div key={gender} style={{ textAlign: "center" }}>
                                    <div style={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: "50%",
                                        background: gender === "ชาย"
                                            ? "linear-gradient(135deg, var(--primary), #0066ff)"
                                            : gender === "หญิง"
                                                ? "linear-gradient(135deg, #ff6b9d, #ff8fab)"
                                                : "var(--background)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        marginBottom: 8,
                                        margin: "0 auto 8px",
                                    }}>
                                        <span style={{ fontSize: 24, fontWeight: 700 }}>{count}</span>
                                    </div>
                                    <div style={{ fontSize: 14 }}>{gender}</div>
                                    <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                        {((count / students.length) * 100).toFixed(0)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Branch Ranking */}
                <div className="card" style={{ padding: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                        <Award size={18} style={{ color: "var(--warning)" }} />
                        สาขายอดนิยม (จำนวนนักเรียน)
                    </h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {topBranches.map((branch, index) => (
                            <div
                                key={branch.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    padding: 16,
                                    background: "var(--background)",
                                    borderRadius: 8,
                                }}
                            >
                                <div style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 8,
                                    background: index === 0 ? "linear-gradient(135deg, #FFD700, #FFA500)"
                                        : index === 1 ? "linear-gradient(135deg, #C0C0C0, #A8A8A8)"
                                            : index === 2 ? "linear-gradient(135deg, #CD7F32, #B87333)"
                                                : "var(--card-background)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 700,
                                    fontSize: 14,
                                }}>
                                    {index + 1}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 500 }}>{branch.name}</div>
                                    <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                        {branch.coachCount} โค้ช
                                    </div>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>
                                        {branch.studentCount}
                                    </div>
                                    <div style={{ fontSize: 11, color: "var(--foreground-muted)" }}>นักเรียน</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
