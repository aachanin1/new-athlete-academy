"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, User, ChevronRight, Check, Plus } from "lucide-react";
import AddChildForm from "../../children/add/AddChildForm";

interface FamilyEnrollClientProps {
    userId: string;
    parentId: string;
    branches: { id: string; name: string }[];
}

type FamilyStep = "add-child" | "add-adult" | "summary";

interface FamilyMember {
    id: string;
    name: string;
    type: "child" | "adult";
}

export default function FamilyEnrollClient({ userId, parentId, branches }: FamilyEnrollClientProps) {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<FamilyStep>("add-child");
    const [members, setMembers] = useState<FamilyMember[]>([]);
    const [childAdded, setChildAdded] = useState(false);

    const handleChildAdded = () => {
        setChildAdded(true);
        setMembers(prev => [...prev, { id: "child-1", name: "ลูก", type: "child" }]);
        setCurrentStep("add-adult");
    };

    const handleSkipToSchedule = () => {
        router.push("/parent/schedule?mode=family");
    };

    const handleAddAdult = () => {
        router.push("/parent/enroll/adult?family=true");
    };

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
            {/* Progress Steps */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 20,
                    background: currentStep === "add-child"
                        ? "linear-gradient(135deg, #00D4FF, #00A3CC)"
                        : childAdded ? "var(--success)" : "var(--card)",
                    color: currentStep === "add-child" || childAdded ? "#0A1628" : "var(--foreground-muted)",
                }}>
                    {childAdded ? <Check size={16} /> : <Users size={16} />}
                    <span style={{ fontSize: 14, fontWeight: 500 }}>1. เพิ่มลูก</span>
                </div>
                <ChevronRight size={20} style={{ color: "var(--foreground-muted)" }} />
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 16px",
                    borderRadius: 20,
                    background: currentStep === "add-adult"
                        ? "linear-gradient(135deg, #7C3AED, #5B21B6)"
                        : "var(--card)",
                    color: currentStep === "add-adult" ? "#fff" : "var(--foreground-muted)",
                }}>
                    <User size={16} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>2. เพิ่มตัวเอง</span>
                </div>
            </div>

            {currentStep === "add-child" && (
                <div>
                    <div style={{ marginBottom: 24 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                            👨‍👧 ลงทะเบียนแบบครอบครัว
                        </h1>
                        <p style={{ color: "var(--foreground-muted)" }}>
                            เริ่มจากเพิ่มข้อมูลลูกของท่านก่อน
                        </p>
                    </div>

                    {/* Embedded Add Child Form - Override the redirect */}
                    <div className="card" style={{ padding: 24 }}>
                        <p style={{ marginBottom: 20, fontSize: 14, color: "var(--foreground-muted)" }}>
                            กรอกข้อมูลลูกแล้วกด "ถัดไป" เพื่อเพิ่มตัวเอง
                        </p>
                        <AddChildForm parentId={parentId} branches={branches} />
                    </div>
                </div>
            )}

            {currentStep === "add-adult" && (
                <div>
                    <div style={{ marginBottom: 24 }}>
                        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                            🧑 เพิ่มตัวเอง
                        </h1>
                        <p style={{ color: "var(--foreground-muted)" }}>
                            ต้องการลงทะเบียนเรียนด้วยตัวเองหรือไม่?
                        </p>
                    </div>

                    <div className="card" style={{ padding: 24 }}>
                        <div style={{
                            padding: 16,
                            background: "rgba(16,185,129,0.1)",
                            borderRadius: 12,
                            marginBottom: 24,
                            display: "flex",
                            alignItems: "center",
                            gap: 12
                        }}>
                            <Check size={24} style={{ color: "var(--success)" }} />
                            <div>
                                <div style={{ fontWeight: 600 }}>เพิ่มลูกเรียบร้อยแล้ว!</div>
                                <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>
                                    คุณสามารถเพิ่มตัวเองเป็นผู้เรียนได้ด้วย
                                </div>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <button
                                onClick={handleAddAdult}
                                style={{
                                    padding: 20,
                                    borderRadius: 12,
                                    border: "2px solid var(--secondary)",
                                    background: "rgba(124,58,237,0.1)",
                                    color: "var(--foreground)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    textAlign: "left",
                                }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <Plus size={24} color="#fff" />
                                </div>
                                <div>
                                    <div style={{ fontWeight: 600, fontSize: 16 }}>เพิ่มตัวเองเป็นผู้เรียน</div>
                                    <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>
                                        ลงทะเบียนคอร์สผู้ใหญ่สำหรับตัวเอง
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={handleSkipToSchedule}
                                className="btn-primary"
                                style={{
                                    padding: "16px 24px",
                                    fontSize: 16,
                                }}
                            >
                                ข้าม → ไปเลือกวันเรียนเลย
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
