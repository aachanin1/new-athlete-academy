import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
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

                    <form>
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
                                    type="email"
                                    placeholder="your@email.com"
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
                                    type="password"
                                    placeholder="••••••••"
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
                                    <Eye size={18} />
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
                            className="btn-primary"
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                padding: "16px",
                                fontSize: 16
                            }}
                        >
                            เข้าสู่ระบบ
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
        </div>
    );
}
