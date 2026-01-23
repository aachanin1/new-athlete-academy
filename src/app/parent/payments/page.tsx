import DashboardLayout from "@/components/DashboardLayout";
import { getPaymentStatus, getParentPaymentHistory } from "@/lib/data/dashboard";
import { Download, CreditCard, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default async function ParentPaymentsPage() {
    const [currentStatus, payments] = await Promise.all([
        getPaymentStatus(),
        getParentPaymentHistory(),
    ]);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return { color: "var(--success)", text: "ชำระแล้ว", icon: CheckCircle };
            case "pending":
                return { color: "var(--warning)", text: "รอชำระ", icon: Clock };
            case "overdue":
                return { color: "var(--error)", text: "เลยกำหนด", icon: AlertCircle };
            default:
                return { color: "var(--foreground-muted)", text: status, icon: Clock };
        }
    };

    return (
        <DashboardLayout role="parent" userName="คุณสมชาย" userRole="ผู้ปกครอง">
            <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>การชำระเงิน</h1>

                {/* Current Invoice */}
                <div className="card" style={{ padding: 24, marginBottom: 32 }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>ใบแจ้งหนี้รอบปัจจุบัน</h2>

                    <div style={{
                        padding: 24,
                        background: "var(--background)",
                        borderRadius: 16,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 20
                    }}>
                        <div>
                            <div style={{ fontSize: 14, color: "var(--foreground-muted)", marginBottom: 4 }}>
                                รอบบิล: {currentStatus.month}
                            </div>
                            <div style={{ fontSize: 32, fontWeight: 700, color: "var(--primary)" }}>
                                ฿{currentStatus.amount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: 14, marginTop: 4 }}>
                                ค่าเรียนแบดมินตัน ({currentStatus.sessions} ครั้ง)
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                padding: "8px 16px",
                                borderRadius: 20,
                                background: currentStatus.status === "paid" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                                color: currentStatus.status === "paid" ? "var(--success)" : "var(--warning)",
                                fontWeight: 600
                            }}>
                                {currentStatus.status === "paid" ? <CheckCircle size={18} /> : <Clock size={18} />}
                                {currentStatus.status === "paid" ? "ชำระแล้ว" : "รอชำระเงิน"}
                            </div>

                            {currentStatus.status !== "paid" && (
                                <button className="btn-primary" style={{ padding: "12px 24px" }}>
                                    <CreditCard size={18} style={{ marginRight: 8 }} />
                                    ชำระเงินทันที
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* History */}
                <div>
                    <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>ประวัติการชำระเงิน</h2>
                    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                        {payments.length > 0 ? (
                            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                                <thead>
                                    <tr style={{ background: "rgba(0,0,0,0.2)", textAlign: "left" }}>
                                        <th style={{ padding: "16px", fontWeight: 600, color: "var(--foreground-muted)" }}>รอบบิล</th>
                                        <th style={{ padding: "16px", fontWeight: 600, color: "var(--foreground-muted)" }}>รายการ</th>
                                        <th style={{ padding: "16px", fontWeight: 600, color: "var(--foreground-muted)" }}>วันที่ชำระ</th>
                                        <th style={{ padding: "16px", fontWeight: 600, color: "var(--foreground-muted)" }}>จำนวนเงิน</th>
                                        <th style={{ padding: "16px", fontWeight: 600, color: "var(--foreground-muted)" }}>สถานะ</th>
                                        <th style={{ padding: "16px", fontWeight: 600, color: "var(--foreground-muted)" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payments.map((payment, i) => {
                                        const status = getStatusBadge(payment.status);
                                        const StatusIcon = status.icon;
                                        return (
                                            <tr key={payment.id} style={{ borderBottom: i < payments.length - 1 ? "1px solid var(--border)" : "none" }}>
                                                <td style={{ padding: "16px", fontWeight: 500 }}>{payment.month}</td>
                                                <td style={{ padding: "16px" }}>
                                                    {payment.description}
                                                    {payment.studentName && (
                                                        <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                            {payment.studentName}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={{ padding: "16px" }}>{payment.paidDate || "-"}</td>
                                                <td style={{ padding: "16px", fontWeight: 500 }}>฿{payment.amount.toLocaleString()}</td>
                                                <td style={{ padding: "16px" }}>
                                                    <span style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: 4,
                                                        color: status.color,
                                                        fontWeight: 500
                                                    }}>
                                                        <StatusIcon size={14} />
                                                        {status.text}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "16px", textAlign: "right" }}>
                                                    {payment.status === "paid" ? (
                                                        <button style={{
                                                            background: "transparent",
                                                            border: "none",
                                                            color: "var(--primary)",
                                                            cursor: "pointer",
                                                            padding: 8,
                                                        }}>
                                                            <Download size={18} />
                                                        </button>
                                                    ) : (
                                                        <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }}>
                                                            แจ้งโอน
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: 40, textAlign: "center", color: "var(--foreground-muted)" }}>
                                <CreditCard size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                                <div>ยังไม่มีประวัติการชำระเงิน</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
