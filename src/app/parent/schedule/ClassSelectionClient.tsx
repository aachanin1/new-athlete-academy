"use client";

import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Info } from "lucide-react";
import { calculatePrice, formatPrice, PRICING_TIERS } from "@/lib/pricingUtils";

interface Session {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    spotsLeft: number;
}

interface Child {
    id: string;
    fullName: string;
    nickname: string;
}

interface ClassSelectionClientProps {
    child: Child;
}

export default function ClassSelectionClient({ child }: ClassSelectionClientProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedSessions, setSelectedSessions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];

    // Fetch sessions when month changes
    useEffect(() => {
        fetchSessions();
    }, [currentMonth]);

    const fetchSessions = async () => {
        setLoading(true);
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;

        try {
            const res = await fetch(`/api/parent/sessions?childId=${child.id}&year=${year}&month=${month}`);
            const data = await res.json();
            setSessions(data.sessions || []);

            // Get already booked sessions
            const booked = (data.sessions || []).filter((s: any) => s.isBooked).map((s: any) => s.id);
            setSelectedSessions(booked);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
        setLoading(false);
    };

    const toggleSession = async (sessionId: string) => {
        const isSelected = selectedSessions.includes(sessionId);

        // Optimistic update
        if (isSelected) {
            setSelectedSessions(prev => prev.filter(id => id !== sessionId));
        } else {
            setSelectedSessions(prev => [...prev, sessionId]);
        }

        try {
            const endpoint = isSelected ? "/api/parent/cancel" : "/api/parent/book";
            const res = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, studentId: child.id }),
            });
            const result = await res.json();

            if (!result.success) {
                // Revert on error
                if (isSelected) {
                    setSelectedSessions(prev => [...prev, sessionId]);
                } else {
                    setSelectedSessions(prev => prev.filter(id => id !== sessionId));
                }
                showError(result.error || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            // Revert on error
            if (isSelected) {
                setSelectedSessions(prev => [...prev, sessionId]);
            } else {
                setSelectedSessions(prev => prev.filter(id => id !== sessionId));
            }
            showError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
        }
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(null), 3000);
    };

    const changeMonth = (delta: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    const formatSessionDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return {
            dayName: dayNames[date.getDay()],
            dayNum: date.getDate(),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
        };
    };

    // Calculate pricing
    const pricing = calculatePrice(selectedSessions.length);

    // Group sessions by date
    const sessionsByDate = sessions.reduce((acc, session) => {
        if (!acc[session.date]) acc[session.date] = [];
        acc[session.date].push(session);
        return acc;
    }, {} as Record<string, Session[]>);

    return (
        <div>
            {/* Toast Messages */}
            {errorMessage && (
                <div style={{
                    position: "fixed", top: 20, right: 20, padding: "12px 20px",
                    background: "var(--error)", color: "white", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 8, zIndex: 1001,
                }}>
                    <AlertCircle size={18} /> {errorMessage}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
                    เลือกวันเรียน - {child.nickname || child.fullName}
                </h1>
                <p style={{ color: "var(--foreground-muted)" }}>
                    เลือกวันเรียนที่ต้องการ ราคาจะคำนวณตามจำนวนครั้งที่เลือก
                </p>
            </div>

            {/* Pricing Summary Card */}
            <div className="card" style={{
                padding: 20,
                marginBottom: 24,
                background: selectedSessions.length > 0
                    ? "linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,255,178,0.1))"
                    : undefined,
                borderColor: selectedSessions.length > 0 ? "var(--primary)" : undefined,
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <div style={{ fontSize: 14, color: "var(--foreground-muted)", marginBottom: 4 }}>
                            เลือกแล้ว {selectedSessions.length} ครั้ง/เดือน
                        </div>
                        <div style={{ fontSize: 28, fontWeight: 700, color: "var(--primary)" }}>
                            ฿{formatPrice(pricing.price)}
                        </div>
                        <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>
                            {pricing.tier} {selectedSessions.length > 0 && `(เฉลี่ย ฿${formatPrice(pricing.perSession)}/ครั้ง)`}
                        </div>
                    </div>
                    <button
                        className="btn-primary"
                        style={{ padding: "12px 24px" }}
                        disabled={selectedSessions.length === 0}
                    >
                        ยืนยันการลงทะเบียน
                    </button>
                </div>
            </div>

            {/* Pricing Tiers Info */}
            <div className="card" style={{ padding: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <Info size={18} style={{ color: "var(--primary)" }} />
                    <span style={{ fontWeight: 500 }}>ราคาคอร์ส</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {PRICING_TIERS.map((tier, i) => (
                        <div
                            key={i}
                            style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                fontSize: 12,
                                background: pricing.tier === tier.tier ? "rgba(0,212,255,0.2)" : "var(--background)",
                                border: pricing.tier === tier.tier ? "1px solid var(--primary)" : "1px solid var(--border)",
                            }}
                        >
                            <span style={{ fontWeight: 500 }}>{tier.tier}</span>
                            <span style={{ color: "var(--foreground-muted)" }}> ฿{formatPrice(tier.price)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Month Navigation */}
            <div className="card" style={{ padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <button
                        onClick={() => changeMonth(-1)}
                        style={{
                            padding: 10, borderRadius: 8, border: "1px solid var(--border)",
                            background: "transparent", color: "var(--foreground)", cursor: "pointer",
                        }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 style={{ fontSize: 18, fontWeight: 600 }}>
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear() + 543}
                    </h2>
                    <button
                        onClick={() => changeMonth(1)}
                        style={{
                            padding: 10, borderRadius: 8, border: "1px solid var(--border)",
                            background: "transparent", color: "var(--foreground)", cursor: "pointer",
                        }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Sessions List */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: 40, color: "var(--foreground-muted)" }}>
                        กำลังโหลด...
                    </div>
                ) : Object.keys(sessionsByDate).length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {Object.entries(sessionsByDate).map(([date, dateSessions]) => {
                            const dateInfo = formatSessionDate(date);
                            return (
                                <div key={date}>
                                    <div style={{
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: dateInfo.isWeekend ? "var(--error)" : "var(--foreground-muted)",
                                        marginBottom: 8,
                                        marginTop: 8,
                                    }}>
                                        {dateInfo.dayName} {dateInfo.dayNum}
                                    </div>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {dateSessions.map(session => {
                                            const isSelected = selectedSessions.includes(session.id);
                                            const isFull = session.spotsLeft <= 0 && !isSelected;
                                            return (
                                                <button
                                                    key={session.id}
                                                    onClick={() => !isFull && toggleSession(session.id)}
                                                    disabled={isFull}
                                                    style={{
                                                        padding: "10px 16px",
                                                        borderRadius: 8,
                                                        border: isSelected
                                                            ? "2px solid var(--success)"
                                                            : "1px solid var(--border)",
                                                        background: isSelected
                                                            ? "rgba(16,185,129,0.1)"
                                                            : isFull
                                                                ? "rgba(0,0,0,0.2)"
                                                                : "var(--background)",
                                                        color: isFull ? "var(--foreground-muted)" : "var(--foreground)",
                                                        cursor: isFull ? "not-allowed" : "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        opacity: isFull ? 0.5 : 1,
                                                    }}
                                                >
                                                    {isSelected && <CheckCircle size={16} style={{ color: "var(--success)" }} />}
                                                    <span>{session.startTime} - {session.endTime}</span>
                                                    {!isSelected && !isFull && (
                                                        <span style={{ fontSize: 11, color: "var(--foreground-muted)" }}>
                                                            ({session.spotsLeft} ที่)
                                                        </span>
                                                    )}
                                                    {isFull && (
                                                        <span style={{ fontSize: 11, color: "var(--error)" }}>เต็ม</span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: 40, color: "var(--foreground-muted)" }}>
                        <Calendar size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <div>ไม่มีคลาสเปิดสอนในเดือนนี้</div>
                    </div>
                )}
            </div>
        </div>
    );
}
