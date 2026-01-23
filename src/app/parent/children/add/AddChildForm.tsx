"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { User, Calendar, CheckCircle, AlertCircle, MapPin } from "lucide-react";
import { addChild } from "@/lib/childActions";

interface Branch {
    id: string;
    name: string;
}

interface AddChildFormProps {
    parentId: string;
    branches: Branch[];
}

export default function AddChildForm({ parentId, branches }: AddChildFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set("parent_id", parentId);

        startTransition(async () => {
            const result = await addChild(formData);
            if (result.error) {
                setError(result.error);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    router.push("/parent/schedule");
                }, 1500);
            }
        });
    };

    if (success) {
        return (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <CheckCircle size={64} style={{ color: "var(--success)", marginBottom: 20 }} />
                <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>เพิ่มลูกเรียบร้อยแล้ว!</h2>
                <p style={{ color: "var(--foreground-muted)" }}>กำลังไปที่หน้าเลือกวันเรียน...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="card" style={{ padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                    <User size={24} style={{ color: "var(--primary)" }} />
                    ข้อมูลลูก
                </h2>

                {error && (
                    <div style={{
                        padding: 12,
                        background: "rgba(239,68,68,0.1)",
                        borderRadius: 8,
                        color: "var(--error)",
                        marginBottom: 20,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                            ชื่อ-นามสกุล <span style={{ color: "var(--error)" }}>*</span>
                        </label>
                        <input
                            name="full_name"
                            type="text"
                            required
                            placeholder="เช่น ด.ช.ภูมิพัฒน์ ใจดี"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: 8,
                                border: "1px solid var(--border)",
                                background: "var(--background)",
                                color: "var(--foreground)",
                                fontSize: 14,
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>ชื่อเล่น</label>
                        <input
                            name="nickname"
                            type="text"
                            placeholder="เช่น น้องบิว"
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: 8,
                                border: "1px solid var(--border)",
                                background: "var(--background)",
                                color: "var(--foreground)",
                                fontSize: 14,
                            }}
                        />
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>
                            <MapPin size={16} style={{ display: "inline", marginRight: 6, color: "var(--primary)" }} />
                            สาขาที่ต้องการเรียน <span style={{ color: "var(--error)" }}>*</span>
                        </label>
                        <select
                            name="branch_id"
                            required
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: 8,
                                border: "1px solid var(--border)",
                                background: "var(--background)",
                                color: "var(--foreground)",
                                fontSize: 14,
                            }}
                        >
                            <option value="">เลือกสาขา</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>วันเกิด</label>
                            <input
                                name="birth_date"
                                type="date"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                    fontSize: 14,
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>เพศ</label>
                            <select
                                name="gender"
                                style={{
                                    width: "100%",
                                    padding: "12px 16px",
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                    fontSize: 14,
                                }}
                            >
                                <option value="">เลือก</option>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn-primary"
                        style={{
                            flex: 1,
                            padding: "14px 24px",
                            fontSize: 16,
                            opacity: isPending ? 0.7 : 1,
                        }}
                    >
                        {isPending ? "กำลังบันทึก..." : "บันทึกและเลือกวันเรียน"}
                    </button>
                </div>
            </div>
        </form>
    );
}

