"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Phone, ChevronRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const confirmPassword = formData.get("confirmPassword") as string;
        const fullName = formData.get("fullName") as string;
        const phone = formData.get("phone") as string;
        const terms = formData.get("terms");

        // Validation
        if (password !== confirmPassword) {
            setError("รหัสผ่านไม่ตรงกัน");
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
            setLoading(false);
            return;
        }

        if (!terms) {
            setError("กรุณายอมรับข้อกำหนดและเงื่อนไข");
            setLoading(false);
            return;
        }

        const supabase = createClient();

        // Sign up
        const { data, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phone,
                },
            },
        });

        if (authError) {
            if (authError.message.includes("already registered")) {
                setError("อีเมลนี้ถูกใช้งานแล้ว");
            } else {
                setError(authError.message);
            }
            setLoading(false);
            return;
        }

        // Create user profile
        if (data.user) {
            await supabase.from("users").insert({
                id: data.user.id,
                email: email,
                full_name: fullName,
                phone: phone,
                role: "parent",
            });

            await supabase.from("parents").insert({
                user_id: data.user.id,
            });
        }

        setSuccess(true);
        setLoading(false);
    }

    if (success) {
        return (
            <div style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 24,
                background: "linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 50%)"
            }}>
                <div className="card" style={{ padding: 40, textAlign: "center", maxWidth: 400 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
                        สมัครสมาชิกสำเร็จ!
                    </h1>
                    <p style={{ color: "var(--foreground-muted)", marginBottom: 24 }}>
                        กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชีของคุณ
                    </p>
                    <Link href="/login" className="btn-primary" style={{ padding: "14px 32px" }}>
                        ไปหน้าเข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "linear-gradient(180deg, rgba(0,212,255,0.05) 0%, transparent 50%)"
        }}>
            <div style={{ width: "100%", maxWidth: 480 }}>
                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: 32 }}>
                    <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                        <Image
                            src="/logo.jpg"
                            alt="New Athlete Logo"
                            width={56}
                            height={56}
                            style={{ borderRadius: 12 }}
                        />
                        <span style={{ fontSize: 24, fontWeight: 700 }} className="gradient-text">
                            New Athlete
                        </span>
                    </Link>
                </div>

                {/* Register Card */}
                <div className="card" style={{ padding: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
                        สมัครสมาชิก
                    </h1>
                    <p style={{
                        fontSize: 14,
                        color: "var(--foreground-muted)",
                        textAlign: "center",
                        marginBottom: 32
                    }}>
                        เริ่มต้นเส้นทางแบดมินตันของลูกคุณวันนี้!
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            padding: 12,
                            marginBottom: 20,
                            borderRadius: 10,
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid var(--error)",
                            color: "var(--error)",
                            fontSize: 14
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Name Fields Row */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                            {/* Full Name */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    marginBottom: 8,
                                    color: "var(--foreground)"
                                }}>
                                    ชื่อ-นามสกุล
                                </label>
                                <div style={{ position: "relative" }}>
                                    <User
                                        size={18}
                                        style={{
                                            position: "absolute",
                                            left: 14,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "var(--foreground-muted)"
                                        }}
                                    />
                                    <input
                                        name="fullName"
                                        type="text"
                                        placeholder="ชื่อ นามสกุล"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "14px 14px 14px 44px",
                                            borderRadius: 12,
                                            border: "1px solid var(--border)",
                                            background: "var(--background)",
                                            color: "var(--foreground)",
                                            fontSize: 14,
                                            outline: "none"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label style={{
                                    display: "block",
                                    fontSize: 14,
                                    fontWeight: 500,
                                    marginBottom: 8,
                                    color: "var(--foreground)"
                                }}>
                                    เบอร์โทรศัพท์
                                </label>
                                <div style={{ position: "relative" }}>
                                    <Phone
                                        size={18}
                                        style={{
                                            position: "absolute",
                                            left: 14,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "var(--foreground-muted)"
                                        }}
                                    />
                                    <input
                                        name="phone"
                                        type="tel"
                                        placeholder="08X-XXX-XXXX"
                                        required
                                        style={{
                                            width: "100%",
                                            padding: "14px 14px 14px 44px",
                                            borderRadius: 12,
                                            border: "1px solid var(--border)",
                                            background: "var(--background)",
                                            color: "var(--foreground)",
                                            fontSize: 14,
                                            outline: "none"
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 500,
                                marginBottom: 8,
                                color: "var(--foreground)"
                            }}>
                                อีเมล
                            </label>
                            <div style={{ position: "relative" }}>
                                <Mail
                                    size={18}
                                    style={{
                                        position: "absolute",
                                        left: 14,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "var(--foreground-muted)"
                                    }}
                                />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "14px 14px 14px 44px",
                                        borderRadius: 12,
                                        border: "1px solid var(--border)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        fontSize: 14,
                                        outline: "none"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 500,
                                marginBottom: 8,
                                color: "var(--foreground)"
                            }}>
                                รหัสผ่าน
                            </label>
                            <div style={{ position: "relative" }}>
                                <Lock
                                    size={18}
                                    style={{
                                        position: "absolute",
                                        left: 14,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "var(--foreground-muted)"
                                    }}
                                />
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                    style={{
                                        width: "100%",
                                        padding: "14px 14px 14px 44px",
                                        borderRadius: 12,
                                        border: "1px solid var(--border)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        fontSize: 14,
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <p style={{ fontSize: 12, color: "var(--foreground-muted)", marginTop: 6 }}>
                                อย่างน้อย 8 ตัวอักษร
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                display: "block",
                                fontSize: 14,
                                fontWeight: 500,
                                marginBottom: 8,
                                color: "var(--foreground)"
                            }}>
                                ยืนยันรหัสผ่าน
                            </label>
                            <div style={{ position: "relative" }}>
                                <Lock
                                    size={18}
                                    style={{
                                        position: "absolute",
                                        left: 14,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "var(--foreground-muted)"
                                    }}
                                />
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "14px 14px 14px 44px",
                                        borderRadius: 12,
                                        border: "1px solid var(--border)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        fontSize: 14,
                                        outline: "none"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Terms Checkbox */}
                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 12,
                                cursor: "pointer"
                            }}>
                                <input
                                    name="terms"
                                    type="checkbox"
                                    style={{
                                        width: 18,
                                        height: 18,
                                        marginTop: 2,
                                        accentColor: "var(--primary)"
                                    }}
                                />
                                <span style={{ fontSize: 14, color: "var(--foreground-muted)", lineHeight: 1.5 }}>
                                    ฉันยอมรับ{" "}
                                    <Link href="/terms" style={{ color: "var(--primary)" }}>
                                        ข้อกำหนดและเงื่อนไข
                                    </Link>
                                    {" "}และ{" "}
                                    <Link href="/privacy" style={{ color: "var(--primary)" }}>
                                        นโยบายความเป็นส่วนตัว
                                    </Link>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary"
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                padding: "16px",
                                fontSize: 16,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? "not-allowed" : "pointer"
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
                                    กำลังสมัคร...
                                </>
                            ) : (
                                <>
                                    สมัครสมาชิก
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        margin: "24px 0",
                        color: "var(--foreground-muted)"
                    }}>
                        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                        <span style={{ fontSize: 14 }}>หรือ</span>
                        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                    </div>

                    {/* Login Link */}
                    <p style={{ textAlign: "center", fontSize: 14, color: "var(--foreground-muted)" }}>
                        มีบัญชีอยู่แล้ว?{" "}
                        <Link href="/login" style={{ color: "var(--primary)", fontWeight: 500 }}>
                            เข้าสู่ระบบ
                        </Link>
                    </p>
                </div>

                {/* Back to Home */}
                <div style={{ textAlign: "center", marginTop: 24 }}>
                    <Link
                        href="/"
                        style={{ fontSize: 14, color: "var(--foreground-muted)" }}
                    >
                        ← กลับหน้าหลัก
                    </Link>
                </div>
            </div>

            <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
