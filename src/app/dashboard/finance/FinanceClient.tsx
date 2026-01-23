"use client";

import { useState, useTransition, useEffect } from "react";
import { TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, DollarSign, Plus, Download } from "lucide-react";
import Modal from "@/components/Modal";
import { addPayment, updatePaymentStatus, getEnrollmentsForPayment } from "@/lib/paymentActions";

interface Payment {
    id: string;
    amount: number;
    status: string;
    paymentDate: string | null;
    month: string;
    studentName: string;
    studentNickname: string;
}

interface FinanceStats {
    paidThisMonth: number;
    pendingThisMonth: number;
    paidLastMonth: number;
    growthPercent: string;
    totalPayments: number;
    recentPayments: Payment[];
}

interface Enrollment {
    id: string;
    pricePerMonth: number;
    studentName: string;
    studentNickname: string;
    branchName: string;
}

interface FinanceClientProps {
    initialStats: FinanceStats;
}

export default function FinanceClient({ initialStats }: FinanceClientProps) {
    const [stats, setStats] = useState(initialStats);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);
    const [isPending, startTransition] = useTransition();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isAddModalOpen && enrollments.length === 0) {
            getEnrollmentsForPayment().then(setEnrollments);
        }
    }, [isAddModalOpen, enrollments.length]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('th-TH').format(amount);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "-";
        return new Date(dateStr).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return { color: "var(--success)", bg: "rgba(16,185,129,0.1)", text: "ชำระแล้ว", icon: CheckCircle };
            case "pending":
                return { color: "var(--warning)", bg: "rgba(245,158,11,0.1)", text: "รอชำระ", icon: Clock };
            case "overdue":
                return { color: "var(--error)", bg: "rgba(239,68,68,0.1)", text: "เลยกำหนด", icon: AlertCircle };
            default:
                return { color: "var(--foreground-muted)", bg: "var(--background)", text: status, icon: DollarSign };
        }
    };

    const handleAddPayment = async (formData: FormData) => {
        startTransition(async () => {
            const result = await addPayment(formData);
            if (result.success) {
                setIsAddModalOpen(false);
                showSuccess("บันทึกรายการชำระเงินเรียบร้อยแล้ว");
                // Refresh page to get updated data
                window.location.reload();
            }
        });
    };

    const handleStatusChange = async (paymentId: string, newStatus: string) => {
        startTransition(async () => {
            const result = await updatePaymentStatus(paymentId, newStatus);
            if (result.success) {
                setStats(prev => ({
                    ...prev,
                    recentPayments: prev.recentPayments.map(p =>
                        p.id === paymentId
                            ? { ...p, status: newStatus, paymentDate: newStatus === "paid" ? new Date().toISOString().split("T")[0] : p.paymentDate }
                            : p
                    ),
                }));
                showSuccess(`เปลี่ยนสถานะเป็น "${newStatus === "paid" ? "ชำระแล้ว" : "รอชำระ"}" เรียบร้อยแล้ว`);
            }
        });
    };

    const handleExportCSV = () => {
        const headers = ["นักเรียน", "งวด", "จำนวน", "วันที่ชำระ", "สถานะ"];
        const rows = stats.recentPayments.map(p => [
            p.studentName + (p.studentNickname ? ` (${p.studentNickname})` : ""),
            p.month,
            p.amount,
            p.paymentDate || "-",
            p.status === "paid" ? "ชำระแล้ว" : p.status === "pending" ? "รอชำระ" : "เลยกำหนด"
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
        link.click();

        showSuccess("ส่งออกไฟล์ CSV เรียบร้อยแล้ว");
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleEnrollmentSelect = (enrollmentId: string) => {
        const enrollment = enrollments.find(e => e.id === enrollmentId);
        setSelectedEnrollment(enrollment || null);
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>การเงิน</h1>
                <div style={{ display: "flex", gap: 12 }}>
                    <button
                        onClick={handleExportCSV}
                        style={{
                            padding: "10px 20px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "transparent",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            color: "var(--foreground)",
                            cursor: "pointer",
                        }}
                    >
                        <Download size={18} />
                        Export CSV
                    </button>
                    <button
                        className="btn-primary"
                        style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 8 }}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={18} />
                        เพิ่มรายการ
                    </button>
                </div>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    padding: "12px 20px",
                    background: "var(--success)",
                    color: "white",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    zIndex: 1001,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}>
                    <CheckCircle size={18} />
                    {successMessage}
                </div>
            )}

            {/* Stats Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 20, marginBottom: 32 }}>
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 12 }}>
                        <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>รายรับเดือนนี้</div>
                        <div style={{
                            padding: "4px 8px",
                            borderRadius: 4,
                            background: Number(stats.growthPercent) >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                            color: Number(stats.growthPercent) >= 0 ? "var(--success)" : "var(--error)",
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                        }}>
                            {Number(stats.growthPercent) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {stats.growthPercent}%
                        </div>
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: "var(--success)" }}>
                        ฿{formatCurrency(stats.paidThisMonth)}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--foreground-muted)", marginTop: 8 }}>
                        เดือนก่อน: ฿{formatCurrency(stats.paidLastMonth)}
                    </div>
                </div>

                <div className="card" style={{ padding: 24 }}>
                    <div style={{ fontSize: 14, color: "var(--foreground-muted)", marginBottom: 12 }}>ยอดค้างชำระ</div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: stats.pendingThisMonth > 0 ? "var(--warning)" : "var(--foreground-muted)" }}>
                        ฿{formatCurrency(stats.pendingThisMonth)}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--foreground-muted)", marginTop: 8 }}>
                        รอเก็บเงินจากผู้ปกครอง
                    </div>
                </div>

                <div className="card" style={{ padding: 24 }}>
                    <div style={{ fontSize: 14, color: "var(--foreground-muted)", marginBottom: 12 }}>รายการเดือนนี้</div>
                    <div style={{ fontSize: 32, fontWeight: 700 }}>
                        {stats.totalPayments}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--foreground-muted)", marginTop: 8 }}>
                        รายการชำระเงินทั้งหมด
                    </div>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <div style={{ padding: 20, borderBottom: "1px solid var(--border)" }}>
                    <h2 style={{ fontSize: 18, fontWeight: 600 }}>รายการชำระเงินล่าสุด</h2>
                </div>

                {stats.recentPayments.length > 0 ? (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                            <thead>
                                <tr style={{ background: "rgba(0,0,0,0.2)", textAlign: "left" }}>
                                    <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>นักเรียน</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>งวด</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>จำนวน</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>วันที่ชำระ</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>สถานะ</th>
                                    <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentPayments.map((payment) => {
                                    const status = getStatusBadge(payment.status);
                                    const StatusIcon = status.icon;
                                    return (
                                        <tr key={payment.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                            <td style={{ padding: "16px" }}>
                                                <div style={{ fontWeight: 500 }}>{payment.studentName}</div>
                                                {payment.studentNickname && (
                                                    <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                        ({payment.studentNickname})
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: "16px" }}>{formatDate(payment.month)}</td>
                                            <td style={{ padding: "16px", fontWeight: 500 }}>฿{formatCurrency(Number(payment.amount))}</td>
                                            <td style={{ padding: "16px" }}>{formatDate(payment.paymentDate)}</td>
                                            <td style={{ padding: "16px" }}>
                                                <span style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    padding: "4px 10px",
                                                    borderRadius: 20,
                                                    fontSize: 12,
                                                    fontWeight: 500,
                                                    background: status.bg,
                                                    color: status.color,
                                                }}>
                                                    <StatusIcon size={14} />
                                                    {status.text}
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px" }}>
                                                {payment.status !== "paid" ? (
                                                    <button
                                                        onClick={() => handleStatusChange(payment.id, "paid")}
                                                        disabled={isPending}
                                                        style={{
                                                            padding: "6px 12px",
                                                            borderRadius: 6,
                                                            border: "none",
                                                            background: "var(--success)",
                                                            color: "white",
                                                            cursor: "pointer",
                                                            fontSize: 12,
                                                            opacity: isPending ? 0.7 : 1,
                                                        }}
                                                    >
                                                        ยืนยันชำระ
                                                    </button>
                                                ) : (
                                                    <span style={{ fontSize: 12, color: "var(--foreground-muted)" }}>✓</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: 40, textAlign: "center", color: "var(--foreground-muted)" }}>
                        <DollarSign size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                        <h3>ยังไม่มีรายการชำระเงิน</h3>
                        <p>เมื่อมีการชำระเงินจะแสดงที่นี่</p>
                    </div>
                )}
            </div>

            {/* Add Payment Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="เพิ่มรายการชำระเงิน" size="md">
                <form action={handleAddPayment}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                นักเรียน *
                            </label>
                            <select
                                name="enrollment_id"
                                required
                                onChange={(e) => handleEnrollmentSelect(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            >
                                <option value="">เลือกนักเรียน...</option>
                                {enrollments.map((e) => (
                                    <option key={e.id} value={e.id}>
                                        {e.studentName} {e.studentNickname && `(${e.studentNickname})`} - {e.branchName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                งวดเดือน *
                            </label>
                            <input
                                type="month"
                                name="month"
                                required
                                defaultValue={new Date().toISOString().slice(0, 7)}
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                จำนวนเงิน (บาท) *
                            </label>
                            <input
                                type="number"
                                name="amount"
                                required
                                min="0"
                                defaultValue={selectedEnrollment?.pricePerMonth || 4000}
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                สถานะ
                            </label>
                            <select
                                name="status"
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            >
                                <option value="paid">ชำระแล้ว</option>
                                <option value="pending">รอชำระ</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            style={{
                                padding: "10px 20px",
                                borderRadius: 8,
                                border: "1px solid var(--border)",
                                background: "transparent",
                                color: "var(--foreground)",
                                cursor: "pointer",
                            }}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn-primary"
                            style={{ padding: "10px 24px", opacity: isPending ? 0.7 : 1 }}
                        >
                            {isPending ? "กำลังบันทึก..." : "บันทึก"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
