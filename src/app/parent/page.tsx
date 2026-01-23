import DashboardLayout from "@/components/DashboardLayout";
import {
    Calendar,
    Trophy,
    CreditCard,
    Clock,
    ChevronRight,
    Plus,
    Users
} from "lucide-react";
import Link from "next/link";
import { getParentChildren, getUpcomingClasses, getPaymentStatus } from "@/lib/data/dashboard";
import { createClient } from "@/lib/supabase/server";

export default async function ParentDashboard() {
    const supabase = await createClient();

    // Get current user from session
    const { data: { user } } = await supabase.auth.getUser();

    // Get user profile from database
    let userName = "ผู้ใช้";
    if (user) {
        const { data: profile } = await supabase
            .from("users")
            .select("full_name")
            .eq("id", user.id)
            .single();
        userName = profile?.full_name || user.user_metadata?.full_name || "ผู้ใช้";
    }

    // Fetch real data
    const children = await getParentChildren();
    const upcomingClasses = await getUpcomingClasses();
    const paymentStatus = await getPaymentStatus();

    const hasNoChildren = children.length === 0;

    return (
        <DashboardLayout role="parent" userName={userName} userRole="ผู้ปกครอง">
            <div>
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
                        สวัสดีคุณ{userName}! 👋
                    </h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        ติดตามพัฒนาการของลูกๆ ได้ที่นี่
                    </p>
                </div>

                {/* Enrollment CTA - Show when no children */}
                {hasNoChildren && (
                    <div className="card" style={{
                        padding: 32,
                        marginBottom: 32,
                        background: "linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(124,58,237,0.1) 100%)",
                        border: "1px solid rgba(0,212,255,0.3)"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: 16,
                                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                                <Users size={32} color="#fff" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
                                    เริ่มต้นลงทะเบียนเรียน!
                                </h2>
                                <p style={{ color: "var(--foreground-muted)", marginBottom: 0 }}>
                                    เลือกประเภทคอร์สที่ต้องการ: เด็ก, ผู้ใหญ่ หรือ ครอบครัว
                                </p>
                            </div>
                            <Link
                                href="/parent/enroll"
                                className="btn-primary"
                                style={{
                                    padding: "14px 28px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    fontSize: 16
                                }}
                            >
                                <Plus size={20} />
                                ลงทะเบียน
                            </Link>
                        </div>
                    </div>
                )}

                {/* Children Cards */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 600 }}>ลูกของฉัน</h2>
                        {!hasNoChildren && (
                            <Link
                                href="/parent/enroll"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 6,
                                    color: "var(--primary)",
                                    fontSize: 14
                                }}
                            >
                                <Plus size={16} />
                                เพิ่มการลงทะเบียน
                            </Link>
                        )}
                    </div>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 20
                    }}>
                        {children.length > 0 ? children.map((child, i) => (
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
                                    href={`/parent/children/${child.id}`}
                                    className="btn-secondary"
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        padding: "12px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8
                                    }}
                                >
                                    ดูพัฒนาการ
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        )) : (
                            <div className="card" style={{ padding: 40, textAlign: "center" }}>
                                <p style={{ color: "var(--foreground-muted)", marginBottom: 16 }}>ยังไม่มีข้อมูลลูก</p>
                                <Link
                                    href="/parent/enroll"
                                    className="btn-primary"
                                    style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px" }}
                                >
                                    <Plus size={18} />
                                    ลงทะเบียนเรียน
                                </Link>
                            </div>
                        )}
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
                            {upcomingClasses.length > 0 ? upcomingClasses.map((cls, i) => (
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
                            )) : (
                                <div style={{ textAlign: "center", padding: 20, color: "var(--foreground-muted)" }}>
                                    ไม่มีตารางเรียน
                                </div>
                            )}
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
                            {paymentStatus.status !== "none" && (
                                <Link href="/parent/payments" style={{
                                    fontSize: 14,
                                    color: "var(--primary)"
                                }}>
                                    ประวัติ
                                </Link>
                            )}
                        </div>

                        {paymentStatus.status === "none" ? (
                            <div style={{
                                padding: 32,
                                textAlign: "center",
                                color: "var(--foreground-muted)"
                            }}>
                                <CreditCard size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                                <p style={{ marginBottom: 8 }}>ยังไม่มีการลงทะเบียน</p>
                                <p style={{ fontSize: 13 }}>กรุณาลงทะเบียนเรียนก่อน</p>
                            </div>
                        ) : (
                            <>
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
                                            background: paymentStatus.status === "paid"
                                                ? "rgba(16, 185, 129, 0.1)"
                                                : "rgba(245, 158, 11, 0.1)",
                                            color: paymentStatus.status === "paid"
                                                ? "var(--success)"
                                                : "var(--warning)",
                                            fontWeight: 500,
                                            fontSize: 14
                                        }}>
                                            {paymentStatus.status === "paid" ? "ชำระแล้ว" : "รอชำระ"}
                                        </div>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        fontSize: 14,
                                        color: "var(--foreground-muted)"
                                    }}>
                                        <span>{paymentStatus.sessions} ครั้ง/เดือน</span>
                                        {paymentStatus.paidDate && (
                                            <span>ชำระเมื่อ {paymentStatus.paidDate}</span>
                                        )}
                                    </div>
                                </div>

                                <Link
                                    href="/parent/payments"
                                    className="btn-primary"
                                    style={{
                                        width: "100%",
                                        justifyContent: "center",
                                        padding: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8
                                    }}
                                >
                                    <CreditCard size={18} />
                                    ดูใบแจ้งหนี้
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

