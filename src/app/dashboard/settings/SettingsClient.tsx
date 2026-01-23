"use client";

import { useState, useTransition } from "react";
import { User, Bell, Lock, Globe, Check } from "lucide-react";
import Modal from "@/components/Modal";

interface UserProfile {
    name: string;
    email: string;
    role: string;
    phone: string;
}

interface SettingsClientProps {
    initialProfile: UserProfile;
}

export default function SettingsClient({ initialProfile }: SettingsClientProps) {
    const [profile, setProfile] = useState(initialProfile);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [language, setLanguage] = useState("th");

    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const [isChangeLanguageOpen, setIsChangeLanguageOpen] = useState(false);

    const [isPending, startTransition] = useTransition();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleUpdateProfile = async (formData: FormData) => {
        startTransition(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setProfile({
                ...profile,
                name: formData.get("name") as string,
                phone: formData.get("phone") as string,
            });
            setIsEditProfileOpen(false);
            showSuccess("บันทึกข้อมูลเรียบร้อยแล้ว");
        });
    };

    const handleChangePassword = async (formData: FormData) => {
        const newPassword = formData.get("new_password") as string;
        const confirmPassword = formData.get("confirm_password") as string;

        if (newPassword !== confirmPassword) {
            alert("รหัสผ่านใหม่ไม่ตรงกัน");
            return;
        }

        startTransition(async () => {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setIsChangePasswordOpen(false);
            showSuccess("เปลี่ยนรหัสผ่านเรียบร้อยแล้ว");
        });
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
        showSuccess(notificationsEnabled ? "ปิดการแจ้งเตือนแล้ว" : "เปิดการแจ้งเตือนแล้ว");
    };

    const handleChangeLanguage = (lang: string) => {
        setLanguage(lang);
        setIsChangeLanguageOpen(false);
        showSuccess(`เปลี่ยนภาษาเป็น ${lang === "th" ? "ไทย" : "English"} แล้ว`);
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    return (
        <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>ตั้งค่าระบบ</h1>

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
                    animation: "slideIn 0.3s ease-out",
                }}>
                    <Check size={18} />
                    {successMessage}
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                {/* Profile Section */}
                <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", gap: 16, alignItems: "center" }}>
                    <User size={24} style={{ color: "var(--primary)" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>ข้อมูลส่วนตัว</div>
                        <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
                            {profile.name} • {profile.email}
                        </div>
                    </div>
                    <button
                        className="btn-secondary"
                        onClick={() => setIsEditProfileOpen(true)}
                    >
                        แก้ไข
                    </button>
                </div>

                {/* Notifications Section */}
                <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", gap: 16, alignItems: "center" }}>
                    <Bell size={24} style={{ color: "var(--secondary)" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>การแจ้งเตือน</div>
                        <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
                            {notificationsEnabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                        </div>
                    </div>
                    <label style={{
                        position: "relative",
                        display: "inline-block",
                        width: 50,
                        height: 26,
                        cursor: "pointer"
                    }}>
                        <input
                            type="checkbox"
                            checked={notificationsEnabled}
                            onChange={handleToggleNotifications}
                            style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                            position: "absolute",
                            cursor: "pointer",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: notificationsEnabled ? "var(--primary)" : "var(--border)",
                            borderRadius: 26,
                            transition: "0.3s",
                        }}>
                            <span style={{
                                position: "absolute",
                                content: '""',
                                height: 20,
                                width: 20,
                                left: notificationsEnabled ? 26 : 4,
                                bottom: 3,
                                background: "white",
                                borderRadius: "50%",
                                transition: "0.3s",
                            }} />
                        </span>
                    </label>
                </div>

                {/* Password Section */}
                <div style={{ padding: 20, borderBottom: "1px solid var(--border)", display: "flex", gap: 16, alignItems: "center" }}>
                    <Lock size={24} style={{ color: "var(--error)" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>รหัสผ่านและความปลอดภัย</div>
                        <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>เปลี่ยนรหัสผ่านของคุณ</div>
                    </div>
                    <button
                        className="btn-secondary"
                        onClick={() => setIsChangePasswordOpen(true)}
                    >
                        เปลี่ยน
                    </button>
                </div>

                {/* Language Section */}
                <div style={{ padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
                    <Globe size={24} style={{ color: "var(--success)" }} />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, marginBottom: 4 }}>ภาษา</div>
                        <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
                            {language === "th" ? "ไทย" : "English"}
                        </div>
                    </div>
                    <button
                        className="btn-secondary"
                        onClick={() => setIsChangeLanguageOpen(true)}
                    >
                        เปลี่ยน
                    </button>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} title="แก้ไขข้อมูลส่วนตัว" size="md">
                <form action={handleUpdateProfile}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                ชื่อ-นามสกุล
                            </label>
                            <input
                                name="name"
                                defaultValue={profile.name}
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
                                อีเมล
                            </label>
                            <input
                                type="email"
                                value={profile.email}
                                disabled
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground-muted)",
                                }}
                            />
                            <p style={{ fontSize: 12, color: "var(--foreground-muted)", marginTop: 4 }}>
                                ไม่สามารถเปลี่ยนอีเมลได้
                            </p>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                เบอร์โทร
                            </label>
                            <input
                                name="phone"
                                defaultValue={profile.phone}
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
                            onClick={() => setIsEditProfileOpen(false)}
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

            {/* Change Password Modal */}
            <Modal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)} title="เปลี่ยนรหัสผ่าน" size="md">
                <form action={handleChangePassword}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                รหัสผ่านปัจจุบัน
                            </label>
                            <input
                                type="password"
                                name="current_password"
                                required
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
                                รหัสผ่านใหม่
                            </label>
                            <input
                                type="password"
                                name="new_password"
                                required
                                minLength={6}
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
                                ยืนยันรหัสผ่านใหม่
                            </label>
                            <input
                                type="password"
                                name="confirm_password"
                                required
                                minLength={6}
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
                            onClick={() => setIsChangePasswordOpen(false)}
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
                            {isPending ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Change Language Modal */}
            <Modal isOpen={isChangeLanguageOpen} onClose={() => setIsChangeLanguageOpen(false)} title="เปลี่ยนภาษา" size="sm">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                        onClick={() => handleChangeLanguage("th")}
                        style={{
                            padding: 16,
                            borderRadius: 8,
                            border: language === "th" ? "2px solid var(--primary)" : "1px solid var(--border)",
                            background: language === "th" ? "rgba(0,212,255,0.1)" : "transparent",
                            color: "var(--foreground)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span>🇹🇭 ไทย</span>
                        {language === "th" && <Check size={18} style={{ color: "var(--primary)" }} />}
                    </button>
                    <button
                        onClick={() => handleChangeLanguage("en")}
                        style={{
                            padding: 16,
                            borderRadius: 8,
                            border: language === "en" ? "2px solid var(--primary)" : "1px solid var(--border)",
                            background: language === "en" ? "rgba(0,212,255,0.1)" : "transparent",
                            color: "var(--foreground)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <span>🇺🇸 English</span>
                        {language === "en" && <Check size={18} style={{ color: "var(--primary)" }} />}
                    </button>
                </div>
            </Modal>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}
