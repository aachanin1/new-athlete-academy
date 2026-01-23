"use client";

import { useState, useTransition } from "react";
import { MapPin, Users, Plus, ArrowUpRight, Phone } from "lucide-react";
import Modal from "@/components/Modal";
import { addBranch } from "@/lib/actions";

interface Branch {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
    studentCount: number;
    coachCount: number;
}

interface BranchesClientProps {
    initialBranches: Branch[];
}

export default function BranchesClient({ initialBranches }: BranchesClientProps) {
    const [branches, setBranches] = useState(initialBranches);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleAddBranch = async (formData: FormData) => {
        startTransition(async () => {
            const result = await addBranch(formData);
            if (result.success && result.data) {
                setBranches((prev) => [
                    {
                        ...result.data,
                        studentCount: 0,
                        coachCount: 0,
                    },
                    ...prev,
                ]);
                setIsAddModalOpen(false);
            }
        });
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>สาขาทั้งหมด</h1>
                    <p style={{ color: "var(--foreground-muted)" }}>{branches.length} สาขาที่เปิดให้บริการ</p>
                </div>
                <button
                    className="btn-primary"
                    style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 8 }}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus size={18} />
                    เพิ่มสาขา
                </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
                {branches.map((branch) => (
                    <div key={branch.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
                        <div
                            style={{
                                height: 120,
                                background: `linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)`,
                                opacity: 0.8,
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: 16,
                                    left: 16,
                                    color: "#0A1628",
                                    fontWeight: 700,
                                    fontSize: 20,
                                }}
                            >
                                {branch.name}
                            </div>
                        </div>
                        <div style={{ padding: 20 }}>
                            <div style={{ display: "flex", alignItems: "start", gap: 12, marginBottom: 16 }}>
                                <MapPin size={20} style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
                                <p style={{ fontSize: 14, color: "var(--foreground-muted)", lineHeight: 1.6 }}>
                                    {branch.address || "ที่อยู่สาขา..."}
                                </p>
                            </div>

                            {branch.phone && (
                                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                    <Phone size={18} style={{ color: "var(--secondary)", flexShrink: 0 }} />
                                    <p style={{ fontSize: 14, color: "var(--foreground-muted)" }}>{branch.phone}</p>
                                </div>
                            )}

                            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                                <div
                                    style={{
                                        flex: 1,
                                        padding: 12,
                                        background: "var(--background)",
                                        borderRadius: 8,
                                        textAlign: "center",
                                    }}
                                >
                                    <Users size={18} style={{ color: "var(--secondary)", marginBottom: 4 }} />
                                    <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>นักเรียน</div>
                                    <div style={{ fontWeight: 600 }}>{branch.studentCount}</div>
                                </div>
                                <div
                                    style={{
                                        flex: 1,
                                        padding: 12,
                                        background: "var(--background)",
                                        borderRadius: 8,
                                        textAlign: "center",
                                    }}
                                >
                                    <Users size={18} style={{ color: "var(--success)", marginBottom: 4 }} />
                                    <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>โค้ช</div>
                                    <div style={{ fontWeight: 600 }}>{branch.coachCount}</div>
                                </div>
                            </div>

                            <button
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    background: "transparent",
                                    border: "1px solid var(--border)",
                                    borderRadius: 8,
                                    color: "var(--foreground)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 8,
                                    fontSize: 14,
                                    fontWeight: 500,
                                }}
                            >
                                ดูรายละเอียด
                                <ArrowUpRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Branch Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="เพิ่มสาขาใหม่" size="md">
                <form action={handleAddBranch}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                ชื่อสาขา *
                            </label>
                            <input
                                name="name"
                                required
                                placeholder="เช่น สาขาสีลม"
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
                                ที่อยู่
                            </label>
                            <input
                                name="address"
                                placeholder="เช่น สนามแบดมินตัน สีลม"
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
                                เบอร์โทร
                            </label>
                            <input
                                name="phone"
                                placeholder="เช่น 02-xxx-xxxx"
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
