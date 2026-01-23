import DashboardLayout from "@/components/DashboardLayout";
import { getParentChildren } from "@/lib/data/dashboard";
import { Trophy, TrendingUp, Calendar, ChevronRight } from "lucide-react";

export default async function ParentChildrenPage() {
    const children = await getParentChildren();

    return (
        <DashboardLayout role="parent" userName="คุณสมชาย" userRole="ผู้ปกครอง">
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>ลูกของฉัน</h1>

                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                    {children.map((child, i) => (
                        <div key={i} className="card" style={{ padding: 24 }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
                                {/* Child Info */}
                                <div style={{ flex: 1, minWidth: 280 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                                        <div style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: 16,
                                            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 28
                                        }}>
                                            {child.emoji}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
                                                {child.name}
                                            </div>
                                            <div style={{ color: "var(--foreground-muted)" }}>
                                                {child.branch}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                                        <div style={{
                                            padding: "8px 16px",
                                            borderRadius: 8,
                                            background: "var(--background)",
                                            textAlign: "center"
                                        }}>
                                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>Level</div>
                                            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--primary)" }}>{child.level}</div>
                                        </div>
                                        <div style={{
                                            padding: "8px 16px",
                                            borderRadius: 8,
                                            background: "var(--background)",
                                            textAlign: "center"
                                        }}>
                                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>คลาส/เดือน</div>
                                            <div style={{ fontSize: 18, fontWeight: 700 }}>{child.sessionsThisMonth}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Vertical Divider (Desktop) - Only visible on larger screens */}
                                <div style={{
                                    width: 1,
                                    background: "var(--border)",
                                    alignSelf: "stretch",
                                    minHeight: 100
                                }} />

                                {/* Progress & Next Class */}
                                <div style={{ flex: 1.5, minWidth: 300, display: "flex", flexDirection: "column", gap: 16 }}>
                                    <div style={{
                                        padding: 16,
                                        borderRadius: 12,
                                        background: "var(--background)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16
                                    }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            background: "rgba(16, 185, 129, 0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <TrendingUp size={20} style={{ color: "var(--success)" }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>พัฒนาการล่าสุด</div>
                                            <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>{child.progress} ในเดือนนี้</div>
                                        </div>
                                        <ChevronRight size={20} style={{ color: "var(--foreground-muted)" }} />
                                    </div>

                                    <div style={{
                                        padding: 16,
                                        borderRadius: 12,
                                        background: "var(--background)",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16
                                    }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            background: "rgba(0, 212, 255, 0.1)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <Calendar size={20} style={{ color: "var(--primary)" }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>คลาสถัดไป</div>
                                            <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>{child.nextClass}</div>
                                        </div>
                                        <ChevronRight size={20} style={{ color: "var(--foreground-muted)" }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}
