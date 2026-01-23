"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, User, Users } from "lucide-react";
import Modal from "@/components/Modal";
import { addCoach, deleteCoach } from "@/lib/coachManagement";

interface Coach {
    id: string;
    employeeId: string;
    fullName: string;
    email: string;
    phone: string;
    baseSalary: number;
    isHeadCoach: boolean;
    hireDate: string | null;
    branch: string;
}

interface CoachManagementClientProps {
    initialCoaches: Coach[];
    branches: { id: string; name: string }[];
}

export default function CoachManagementClient({ initialCoaches, branches }: CoachManagementClientProps) {
    const [coaches, setCoaches] = useState(initialCoaches);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleAddCoach = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await addCoach(formData);
            if (result.success && result.data) {
                setCoaches(prev => [{
                    id: result.data.id,
                    employeeId: result.data.employee_id || "-",
                    fullName: formData.get("full_name") as string,
                    email: formData.get("email") as string || "-",
                    phone: formData.get("phone") as string || "-",
                    baseSalary: result.data.base_salary,
                    isHeadCoach: result.data.is_head_coach,
                    hireDate: result.data.hire_date,
                    branch: "-",
                }, ...prev]);
                setIsAddModalOpen(false);
            }
        });
    };

    const handleDeleteCoach = async () => {
        if (!selectedCoach) return;
        startTransition(async () => {
            const result = await deleteCoach(selectedCoach.id);
            if (result.success) {
                setCoaches(prev => prev.filter(c => c.id !== selectedCoach.id));
                setIsDeleteModalOpen(false);
                setSelectedCoach(null);
            }
        });
    };

    const formatSalary = (amount: number) => {
        return new Intl.NumberFormat("th-TH").format(amount);
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>จัดการโค้ช</h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        ทั้งหมด {coaches.length} คน
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="btn-primary"
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                    <Plus size={18} />
                    เพิ่มโค้ช
                </button>
            </div>

            {/* Coaches Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 20,
            }}>
                {coaches.map(coach => (
                    <div key={coach.id} className="card" style={{ padding: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background: coach.isHeadCoach
                                        ? "linear-gradient(135deg, var(--warning), #F97316)"
                                        : "linear-gradient(135deg, var(--primary), var(--secondary))",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#0A1628",
                                    fontWeight: 600,
                                }}>
                                    {coach.fullName.charAt(0)}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 16 }}>{coach.fullName}</div>
                                    <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>
                                        {coach.employeeId}
                                    </div>
                                </div>
                            </div>
                            {coach.isHeadCoach && (
                                <span style={{
                                    padding: "4px 8px",
                                    borderRadius: 12,
                                    background: "rgba(245,158,11,0.2)",
                                    color: "var(--warning)",
                                    fontSize: 11,
                                    fontWeight: 500,
                                }}>
                                    หัวหน้า
                                </span>
                            )}
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, fontSize: 14 }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--foreground-muted)" }}>เงินเดือน</span>
                                <span style={{ fontWeight: 500 }}>฿{formatSalary(coach.baseSalary)}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--foreground-muted)" }}>สาขา</span>
                                <span>{coach.branch}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <span style={{ color: "var(--foreground-muted)" }}>โทร</span>
                                <span>{coach.phone}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSelectedCoach(coach);
                                setIsDeleteModalOpen(true);
                            }}
                            style={{
                                width: "100%",
                                padding: "8px 12px",
                                borderRadius: 6,
                                border: "1px solid var(--error)",
                                background: "transparent",
                                color: "var(--error)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 6,
                                fontSize: 13,
                            }}
                        >
                            <Trash2 size={14} />
                            ลบโค้ช
                        </button>
                    </div>
                ))}

                {coaches.length === 0 && (
                    <div className="card" style={{ padding: 40, textAlign: "center", gridColumn: "1 / -1" }}>
                        <Users size={48} style={{ opacity: 0.3, marginBottom: 16, color: "var(--foreground-muted)" }} />
                        <div style={{ color: "var(--foreground-muted)" }}>ยังไม่มีโค้ชในระบบ</div>
                    </div>
                )}
            </div>

            {/* Add Coach Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="เพิ่มโค้ชใหม่"
            >
                <form onSubmit={handleAddCoach}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
                                ชื่อ-นามสกุล <span style={{ color: "var(--error)" }}>*</span>
                            </label>
                            <input
                                name="full_name"
                                type="text"
                                required
                                placeholder="เช่น โค้ชบอล"
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            <div>
                                <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>รหัสพนักงาน</label>
                                <input
                                    name="employee_id"
                                    type="text"
                                    placeholder="เช่น COACH-001"
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        borderRadius: 8,
                                        border: "1px solid var(--border)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>เงินเดือน</label>
                                <input
                                    name="base_salary"
                                    type="number"
                                    defaultValue={20000}
                                    style={{
                                        width: "100%",
                                        padding: "10px 14px",
                                        borderRadius: 8,
                                        border: "1px solid var(--border)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>เบอร์โทร</label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="08x-xxx-xxxx"
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>Email</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="coach@example.com"
                                style={{
                                    width: "100%",
                                    padding: "10px 14px",
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            />
                        </div>

                        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <input name="is_head_coach" type="checkbox" value="true" />
                            <span>หัวหน้าโค้ช</span>
                        </label>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="btn-secondary"
                            style={{ flex: 1, justifyContent: "center", padding: 12 }}
                        >
                            ยกเลิก
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="btn-primary"
                            style={{ flex: 1, justifyContent: "center", padding: 12, opacity: isPending ? 0.7 : 1 }}
                        >
                            {isPending ? "กำลังบันทึก..." : "เพิ่มโค้ช"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title="ยืนยันการลบ"
            >
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 16, marginBottom: 20 }}>
                        ต้องการลบ <strong>{selectedCoach?.fullName}</strong> ใช่หรือไม่?
                    </div>
                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="btn-secondary"
                            style={{ flex: 1, justifyContent: "center", padding: 12 }}
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleDeleteCoach}
                            disabled={isPending}
                            style={{
                                flex: 1,
                                padding: 12,
                                borderRadius: 8,
                                border: "none",
                                background: "var(--error)",
                                color: "white",
                                cursor: "pointer",
                                opacity: isPending ? 0.7 : 1,
                            }}
                        >
                            {isPending ? "กำลังลบ..." : "ลบ"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
