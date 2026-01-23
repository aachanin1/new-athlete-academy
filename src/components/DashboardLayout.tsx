"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth/actions";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    Calendar,
    CreditCard,
    BarChart3,
    Settings,
    LogOut,
    Menu,
    X,
    MapPin,
    ClipboardList,
    Trophy,
    Bell
} from "lucide-react";
import { useState, ReactNode } from "react";

// Menu items for each role
const adminMenuItems = [
    { icon: LayoutDashboard, label: "แดชบอร์ด", href: "/dashboard" },
    { icon: Users, label: "นักเรียน", href: "/dashboard/students" },
    { icon: GraduationCap, label: "โค้ช", href: "/dashboard/coaches" },
    { icon: MapPin, label: "สาขา", href: "/dashboard/branches" },
    { icon: Calendar, label: "ตารางเรียน", href: "/dashboard/schedule" },
    { icon: CreditCard, label: "การเงิน", href: "/dashboard/finance" },
    { icon: BarChart3, label: "รายงาน", href: "/dashboard/reports" },
    { icon: Settings, label: "ตั้งค่า", href: "/dashboard/settings" },
];

const coachMenuItems = [
    { icon: LayoutDashboard, label: "แดชบอร์ด", href: "/coach" },
    { icon: Calendar, label: "ตารางสอน", href: "/coach/schedule" },
    { icon: Users, label: "นักเรียน", href: "/coach/students" },
    { icon: ClipboardList, label: "โปรแกรมสอน", href: "/coach/programs" },
    { icon: Trophy, label: "ลง Level", href: "/coach/levels" },
    { icon: Settings, label: "ตั้งค่า", href: "/coach/settings" },
];

const parentMenuItems = [
    { icon: LayoutDashboard, label: "แดชบอร์ด", href: "/parent" },
    { icon: Users, label: "ลูกของฉัน", href: "/parent/children" },
    { icon: Calendar, label: "ตารางเรียน", href: "/parent/schedule" },
    { icon: Trophy, label: "พัฒนาการ", href: "/parent/progress" },
    { icon: CreditCard, label: "ชำระเงิน", href: "/parent/payments" },
    { icon: Settings, label: "ตั้งค่า", href: "/parent/settings" },
];

interface DashboardLayoutProps {
    children: ReactNode;
    role: "admin" | "coach" | "parent";
    userName?: string;
    userRole?: string;
}

export default function DashboardLayout({
    children,
    role,
    userName = "ผู้ใช้งาน",
    userRole = "ผู้ใช้"
}: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Get menu items based on role
    const menuItems = role === "admin"
        ? adminMenuItems
        : role === "coach"
            ? coachMenuItems
            : parentMenuItems;

    const roleLabel = role === "admin"
        ? "ผู้ดูแลระบบ"
        : role === "coach"
            ? "โค้ช"
            : "ผู้ปกครอง";

    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        zIndex: 40,
                    }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside style={{
                position: "fixed",
                left: sidebarOpen ? 0 : -280,
                top: 0,
                bottom: 0,
                width: 280,
                background: "var(--background-card)",
                borderRight: "1px solid var(--border)",
                zIndex: 50,
                transition: "left 0.3s ease",
                display: "flex",
                flexDirection: "column",
            }}>
                {/* Logo */}
                <div style={{
                    padding: 24,
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Image
                            src="/logo.jpg"
                            alt="New Athlete Logo"
                            width={40}
                            height={40}
                            style={{ borderRadius: 8 }}
                        />
                        <span style={{ fontSize: 18, fontWeight: 700 }} className="gradient-text">
                            New Athlete
                        </span>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--foreground-muted)",
                            display: "block"
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* User Info */}
                <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 12,
                        background: "var(--background)",
                        borderRadius: 12
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0A1628",
                            fontWeight: 700,
                            fontSize: 16
                        }}>
                            {userName.charAt(0)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{userName}</div>
                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>{roleLabel}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: 16, overflowY: "auto" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {menuItems.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={i}
                                    href={item.href}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "12px 16px",
                                        borderRadius: 10,
                                        background: isActive ? "rgba(0,212,255,0.1)" : "transparent",
                                        color: isActive ? "var(--primary)" : "var(--foreground-muted)",
                                        fontWeight: isActive ? 600 : 400,
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout */}
                <div style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
                    <form action={signOut}>
                        <button
                            type="submit"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 16px",
                                borderRadius: 10,
                                background: "transparent",
                                border: "none",
                                color: "var(--error)",
                                cursor: "pointer",
                                width: "100%",
                                fontSize: 14
                            }}
                        >
                            <LogOut size={20} />
                            <span>ออกจากระบบ</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Desktop Sidebar (always visible) */}
            <aside className="desktop-sidebar" style={{
                position: "fixed",
                left: 0,
                top: 0,
                bottom: 0,
                width: 280,
                background: "var(--background-card)",
                borderRight: "1px solid var(--border)",
                display: "none",
                flexDirection: "column",
            }}>
                {/* Logo */}
                <div style={{
                    padding: 24,
                    borderBottom: "1px solid var(--border)",
                }}>
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Image
                            src="/logo.jpg"
                            alt="New Athlete Logo"
                            width={40}
                            height={40}
                            style={{ borderRadius: 8 }}
                        />
                        <span style={{ fontSize: 18, fontWeight: 700 }} className="gradient-text">
                            New Athlete
                        </span>
                    </Link>
                </div>

                {/* User Info */}
                <div style={{ padding: 16, borderBottom: "1px solid var(--border)" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 12,
                        background: "var(--background)",
                        borderRadius: 12
                    }}>
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#0A1628",
                            fontWeight: 700,
                            fontSize: 16
                        }}>
                            {userName.charAt(0)}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>{userName}</div>
                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>{roleLabel}</div>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: 16, overflowY: "auto" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {menuItems.map((item, i) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={i}
                                    href={item.href}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "12px 16px",
                                        borderRadius: 10,
                                        background: isActive ? "rgba(0,212,255,0.1)" : "transparent",
                                        color: isActive ? "var(--primary)" : "var(--foreground-muted)",
                                        fontWeight: isActive ? 600 : 400,
                                        transition: "all 0.2s"
                                    }}
                                >
                                    <item.icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {/* Logout */}
                <div style={{ padding: 16, borderTop: "1px solid var(--border)" }}>
                    <form action={signOut}>
                        <button
                            type="submit"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "12px 16px",
                                borderRadius: 10,
                                background: "transparent",
                                border: "none",
                                color: "var(--error)",
                                cursor: "pointer",
                                width: "100%",
                                fontSize: 14
                            }}
                        >
                            <LogOut size={20} />
                            <span>ออกจากระบบ</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{
                flex: 1,
                marginLeft: 0,
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column"
            }} className="dashboard-main">
                {/* Top Bar */}
                <header style={{
                    height: 70,
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 24px",
                    background: "var(--background-card)"
                }}>
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setSidebarOpen(true)}
                        style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: "var(--foreground)",
                            display: "block"
                        }}
                        className="mobile-menu-btn"
                    >
                        <Menu size={24} />
                    </button>

                    {/* Page Title (placeholder) */}
                    <h1 style={{ fontSize: 20, fontWeight: 600, display: "none" }} className="page-title">
                        แดชบอร์ด
                    </h1>

                    {/* Right Side */}
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                        <button
                            style={{
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                borderRadius: 10,
                                padding: 10,
                                cursor: "pointer",
                                color: "var(--foreground-muted)",
                                position: "relative"
                            }}
                        >
                            <Bell size={20} />
                            <span style={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                width: 8,
                                height: 8,
                                background: "var(--error)",
                                borderRadius: "50%"
                            }} />
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, padding: 24, overflowY: "auto" }}>
                    {children}
                </div>
            </main>

            {/* CSS for responsive */}
            <style jsx global>{`
        @media (min-width: 1024px) {
          .desktop-sidebar {
            display: flex !important;
          }
          .dashboard-main {
            margin-left: 280px !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
          .page-title {
            display: block !important;
          }
        }
      `}</style>
        </div>
    );
}
