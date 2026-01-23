"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { User, CheckCircle, AlertCircle, MapPin, Mail, Phone } from "lucide-react";

interface AdultSelfEnrollFormProps {
    userId: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    branches: { id: string; name: string }[];
}

export default function AdultSelfEnrollForm({
    userId,
    userName,
    userEmail,
    userPhone,
    branches
}: AdultSelfEnrollFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        formData.set("user_id", userId);
        formData.set("full_name", userName);
        formData.set("is_adult_student", "true");
        formData.set("course_type", "adults");

        startTransition(async () => {
            try {
                const res = await fetch("/api/parent/enroll-adult", {
                    method: "POST",
                    body: formData,
                });
                const result = await res.json();

                if (result.error) {
                    setError(result.error);
                } else {
                    setSuccess(true);
                    setTimeout(() => {
                        router.push("/parent/schedule?courseType=adults");
                    }, 1500);
                }
            } catch (err) {
                setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            }
        });
    };

    if (success) {
        return (
            <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <CheckCircle size={64} style={{ color: "var(--success)", marginBottom: 20 }} />
                <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>ลงทะเบียนเรียบร้อยแล้ว!</h2>
                <p style={{ color: "var(--foreground-muted)" }}>กำลังไปที่หน้าเลือกวันเรียน...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="card" style={{ padding: 24 }}>
                <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                    <User size={24} style={{ color: "var(--secondary)" }} />
                    ลงทะเบียนคอร์สผู้ใหญ่
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
                    {/* Info Box */}
                    <div style={{
                        padding: 16,
                        borderRadius: 12,
                        background: "rgba(124, 58, 237, 0.1)",
                        border: "1px solid rgba(124, 58, 237, 0.3)",
                    }}>
                        <p style={{ fontSize: 14, color: "var(--foreground)", lineHeight: 1.6, margin: 0 }}>
                            🧑 <strong>คอร์สผู้ใหญ่:</strong> ลงทะเบียนเพื่อเรียนด้วยตัวคุณเอง เลือกสาขาที่สะดวกแล้วกดยืนยัน
                        </p>
                    </div>

                    {/* Display User's Existing Info */}
                    <div style={{
                        padding: 20,
                        borderRadius: 12,
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                    }}>
                        <h3 style={{ fontSize: 14, color: "var(--foreground-muted)", marginBottom: 16, fontWeight: 500 }}>
                            ข้อมูลของคุณ
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <User size={18} style={{ color: "var(--primary)" }} />
                                <span style={{ fontWeight: 500 }}>{userName || "ไม่ระบุชื่อ"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <Mail size={18} style={{ color: "var(--primary)" }} />
                                <span>{userEmail || "-"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <Phone size={18} style={{ color: "var(--primary)" }} />
                                <span>{userPhone || "-"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Branch Selection - Only required input */}
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
                </div>

                <div style={{ marginTop: 32, display: "flex", gap: 12 }}>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        style={{
                            padding: "14px 24px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "transparent",
                            color: "var(--foreground)",
                            fontSize: 16,
                            cursor: "pointer",
                        }}
                    >
                        ย้อนกลับ
                    </button>
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
                        {isPending ? "กำลังบันทึก..." : "ยืนยันลงทะเบียน"}
                    </button>
                </div>
            </div>
        </form>
    );
}

