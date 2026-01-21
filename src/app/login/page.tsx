"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const supabase = createClient();

        const { data, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message === "Invalid login credentials"
                ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง"
                : authError.message);
            setLoading(false);
            return;
        }

        // Get user role
        const { data: userData } = await supabase
            .from("users")
            .select("role")
            .eq("id", data.user.id)
            .single();

        const role = userData?.role || "parent";

        // Redirect based on role
        if (role === "super_admin" || role === "admin") {
            router.push("/dashboard");
        } else if (role === "head_coach" || role === "coach") {
            router.push("/coach");
        } else {
            router.push("/parent");
        }
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
            <div style={{ width: "100%", maxWidth: 420 }}>
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

                {/* Login Card */}
                <div className="card" style={{ padding: 32 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>
                        เข้าสู่ระบบ
                    </h1>
                    <p style={{
                        fontSize: 14,
                        color: "var(--foreground-muted)",
                        textAlign: "center",
                        marginBottom: 32
                    }}>
                        ยินดีต้อนรับกลับ! กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
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
                                        outline: "none",
                                        transition: "border-color 0.2s"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: 24 }}>
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
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "14px 44px 14px 44px",
                                        borderRadius: 12,
                                        border: "1px solid var(--border)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                        fontSize: 14,
                                        outline: "none",
                                        transition: "border-color 0.2s"
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: "absolute",
                                        right: 14,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "var(--foreground-muted)"
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div style={{ textAlign: "right", marginBottom: 24 }}>
                            <Link
                                href="/forgot-password"
                                style={{ fontSize: 14, color: "var(--primary)" }}
                            >
                                ลืมรหัสผ่าน?
                            </Link>
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
                                    <Loader2 size={20} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
                                    กำลังเข้าสู่ระบบ...
                                </>
                            ) : (
                                "เข้าสู่ระบบ"
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

                    {/* Register Link */}
                    <p style={{ textAlign: "center", fontSize: 14, color: "var(--foreground-muted)" }}>
                        ยังไม่มีบัญชี?{" "}
                        <Link href="/register" style={{ color: "var(--primary)", fontWeight: 500 }}>
                            สมัครสมาชิก
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
