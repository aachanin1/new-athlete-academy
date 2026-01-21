import DashboardLayout from "@/components/DashboardLayout";
import {
    Calendar,
    Trophy,
    CreditCard,
    TrendingUp,
    Clock,
    ChevronRight
} from "lucide-react";
import Link from "next/link";

// Mock data
const children = [
    {
        name: "น้องบิว",
        level: 15,
        tier: "พื้นฐาน",
        emoji: "👶",
        nextClass: "พุธ 16:00",
        branch: "แจ้งวัฒนะ",
        sessionsThisMonth: 8,
        progress: "+2 levels"
    },
];

const upcomingClasses = [
    { date: "พุธ 22 ม.ค.", time: "16:00 - 18:00", child: "น้องบิว", branch: "แจ้งวัฒนะ" },
    { date: "ศุกร์ 24 ม.ค.", time: "16:00 - 18:00", child: "น้องบิว", branch: "แจ้งวัฒนะ" },
    { date: "อาทิตย์ 26 ม.ค.", time: "09:00 - 11:00", child: "น้องบิว", branch: "แจ้งวัฒนะ" },
];

const paymentStatus = {
    month: "มกราคม 2569",
    amount: 4000,
    sessions: 8,
    status: "paid",
    paidDate: "5 ม.ค. 2569"
};

export default function ParentDashboard() {
    return (
        <DashboardLayout role="parent" userName="คุณสมชาย" userRole="ผู้ปกครอง">
            <div>
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                        สวัสดีคุณสมชาย! 👋
                    </h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        ติดตามพัฒนาการของลูกๆ ได้ที่นี่
                    </p>
                </div>

                {/* Children Cards */}
                <div style={{ marginBottom: 32 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>ลูกของฉัน</h2>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 20
                    }}>
                        {children.map((child, i) => (
                            <div key={i} className="card" style={{ padding: 24 }}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    justifyContent: "space-between",
                                    marginBottom: 20
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                        <div style={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 16,
                                            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 24
                                        }}>
                                            {child.emoji}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
                                                {child.name}
                                            </div>
                                            <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
                                                Level {child.level} • {child.tier}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: "6px 12px",
                                        borderRadius: 20,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        background: "rgba(16, 185, 129, 0.1)",
                                        color: "var(--success)"
                                    }}>
                                        {child.progress}
                                    </span>
                                </div>

                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "1fr 1fr",
                                    gap: 12,
                                    marginBottom: 16
                                }}>
                                    <div style={{
                                        padding: 12,
                                        background: "var(--background)",
                                        borderRadius: 10
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            marginBottom: 4
                                        }}>
                                            <Clock size={16} style={{ color: "var(--primary)" }} />
                                            <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                คลาสถัดไป
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>{child.nextClass}</div>
                                    </div>
                                    <div style={{
                                        padding: 12,
                                        background: "var(--background)",
                                        borderRadius: 10
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            marginBottom: 4
                                        }}>
                                            <Calendar size={16} style={{ color: "var(--secondary)" }} />
                                            <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                เดือนนี้
                                            </span>
                                        </div>
                                        <div style={{ fontSize: 14, fontWeight: 500 }}>
                                            {child.sessionsThisMonth} ครั้ง
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/parent/children/${i}`}
                                    className="btn-secondary"
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        padding: "12px"
                                    }}
                                >
                                    ดูพัฒนาการ
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                    gap: 24
                }}>
                    {/* Upcoming Classes */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 20
                        }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600 }}>ตารางเรียนที่จะถึง</h2>
                            <Link href="/parent/schedule" style={{
                                fontSize: 14,
                                color: "var(--primary)"
                            }}>
                                ดูทั้งหมด
                            </Link>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {upcomingClasses.map((cls, i) => (
                                <div key={i} style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 14,
                                    background: "var(--background)",
                                    borderRadius: 10
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: "rgba(0,212,255,0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <Calendar size={18} style={{ color: "var(--primary)" }} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500, fontSize: 14 }}>{cls.date}</div>
                                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                {cls.time} • {cls.branch}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: 13, color: "var(--foreground-muted)" }}>
                                        {cls.child}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Status */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 20
                        }}>
                            <h2 style={{ fontSize: 18, fontWeight: 600 }}>สถานะการชำระเงิน</h2>
                            <Link href="/parent/payments" style={{
                                fontSize: 14,
                                color: "var(--primary)"
                            }}>
                                ประวัติ
                            </Link>
                        </div>

                        <div style={{
                            padding: 20,
                            background: "var(--background)",
                            borderRadius: 12,
                            marginBottom: 16
                        }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 16
                            }}>
                                <div>
                                    <div style={{ fontSize: 14, color: "var(--foreground-muted)", marginBottom: 4 }}>
                                        {paymentStatus.month}
                                    </div>
                                    <div style={{ fontSize: 28, fontWeight: 700 }}>
                                        ฿{paymentStatus.amount.toLocaleString()}
                                    </div>
                                </div>
                                <div style={{
                                    padding: "8px 16px",
                                    borderRadius: 20,
                                    background: "rgba(16, 185, 129, 0.1)",
                                    color: "var(--success)",
                                    fontWeight: 500,
                                    fontSize: 14
                                }}>
                                    ชำระแล้ว
                                </div>
                            </div>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                fontSize: 14,
                                color: "var(--foreground-muted)"
                            }}>
                                <span>{paymentStatus.sessions} ครั้ง/เดือน</span>
                                <span>ชำระเมื่อ {paymentStatus.paidDate}</span>
                            </div>
                        </div>

                        <Link
                            href="/parent/payments"
                            className="btn-primary"
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                padding: "14px"
                            }}
                        >
                            <CreditCard size={18} />
                            ดูใบแจ้งหนี้
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
