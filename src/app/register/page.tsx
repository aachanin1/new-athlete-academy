import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Phone, ChevronRight } from "lucide-react";

export default function RegisterPage() {
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

                    <form>
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
                                        type="text"
                                        placeholder="ชื่อ นามสกุล"
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
                                        type="tel"
                                        placeholder="08X-XXX-XXXX"
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
                                    type="password"
                                    placeholder="••••••••"
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
                                    type="password"
                                    placeholder="••••••••"
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
                            className="btn-primary"
                            style={{
                                width: "100%",
                                justifyContent: "center",
                                padding: "16px",
                                fontSize: 16
                            }}
                        >
                            สมัครสมาชิก
                            <ChevronRight size={20} />
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
        </div>
    );
}
