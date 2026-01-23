"use client";

import { useState, useTransition, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, Check, CheckCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

interface Session {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    branchName: string;
    spotsLeft: number;
    isBooked: boolean;
}

interface Child {
    id: string;
    fullName: string;
    nickname: string;
    level: number;
    enrollmentId: string;
    sessionsPerMonth: number;
    pricePerMonth: number;
    branchName: string;
}

interface ParentBookingClientProps {
    parentId: string;
    children: Child[];
}

export default function ParentBookingClient({ parentId, children }: ParentBookingClientProps) {
    const [selectedChild, setSelectedChild] = useState<Child | null>(children[0] || null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [sessions, setSessions] = useState<Session[]>([]);
    const [bookedCount, setBookedCount] = useState(0);
    const [isPending, startTransition] = useTransition();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
        "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

    // Fetch sessions when child or month changes
    useEffect(() => {
        if (selectedChild) {
            fetchSessions();
        }
    }, [selectedChild, currentMonth]);

    const fetchSessions = async () => {
        if (!selectedChild) return;

        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;

        try {
            const res = await fetch(`/api/parent/sessions?childId=${selectedChild.id}&year=${year}&month=${month}`);
            const data = await res.json();
            setSessions(data.sessions || []);
            setBookedCount(data.bookedCount || 0);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        }
    };

    const handleBookSession = async (sessionId: string) => {
        if (!selectedChild) return;

        // Check if already at max bookings
        if (bookedCount >= selectedChild.sessionsPerMonth) {
            showError(`ลงเรียนครบ ${selectedChild.sessionsPerMonth} ครั้ง/เดือนแล้ว`);
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch("/api/parent/book", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        studentId: selectedChild.id,
                    }),
                });
                const result = await res.json();

                if (result.success) {
                    setSessions(prev => prev.map(s =>
                        s.id === sessionId ? { ...s, isBooked: true, spotsLeft: s.spotsLeft - 1 } : s
                    ));
                    setBookedCount(prev => prev + 1);
                    showSuccess("จองคลาสเรียบร้อยแล้ว");
                } else {
                    showError(result.error || "เกิดข้อผิดพลาด");
                }
            } catch (error) {
                showError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            }
        });
    };

    const handleCancelBooking = async (sessionId: string) => {
        if (!selectedChild) return;

        startTransition(async () => {
            try {
                const res = await fetch("/api/parent/cancel", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId,
                        studentId: selectedChild.id,
                    }),
                });
                const result = await res.json();

                if (result.success) {
                    setSessions(prev => prev.map(s =>
                        s.id === sessionId ? { ...s, isBooked: false, spotsLeft: s.spotsLeft + 1 } : s
                    ));
                    setBookedCount(prev => prev - 1);
                    showSuccess("ยกเลิกการจองเรียบร้อยแล้ว");
                } else {
                    showError(result.error || "เกิดข้อผิดพลาด");
                }
            } catch (error) {
                showError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
            }
        });
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setErrorMessage(null);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const showError = (message: string) => {
        setErrorMessage(message);
        setSuccessMessage(null);
        setTimeout(() => setErrorMessage(null), 3000);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const days = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
        return {
            dayName: days[date.getDay()],
            dayNum: date.getDate(),
            isWeekend: date.getDay() === 0 || date.getDay() === 6,
        };
    };

    const changeMonth = (delta: number) => {
        setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };

    const totalPrice = selectedChild ? selectedChild.pricePerMonth : 0;
    const progressPercent = selectedChild ? (bookedCount / selectedChild.sessionsPerMonth) * 100 : 0;

    return (
        <div>
            {/* Header */}
            <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>เลือกวันเรียน</h1>

            {/* Toast Messages */}
            {successMessage && (
                <div style={{
                    position: "fixed", top: 20, right: 20, padding: "12px 20px",
                    background: "var(--success)", color: "white", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 8, zIndex: 1001,
                }}>
                    <CheckCircle size={18} /> {successMessage}
                </div>
            )}
            {errorMessage && (
                <div style={{
                    position: "fixed", top: 20, right: 20, padding: "12px 20px",
                    background: "var(--error)", color: "white", borderRadius: 8,
                    display: "flex", alignItems: "center", gap: 8, zIndex: 1001,
                }}>
                    <AlertCircle size={18} /> {errorMessage}
                </div>
            )}

            {/* Child Selector */}
            {children.length > 1 && (
                <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                    <label style={{ display: "block", marginBottom: 12, fontWeight: 500 }}>เลือกลูก:</label>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {children.map((child) => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedChild(child)}
                                style={{
                                    padding: "12px 20px",
                                    borderRadius: 12,
                                    border: selectedChild?.id === child.id ? "2px solid var(--primary)" : "1px solid var(--border)",
                                    background: selectedChild?.id === child.id ? "rgba(0,212,255,0.1)" : "transparent",
                                    color: "var(--foreground)",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                }}
                            >
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#0A1628", fontWeight: 600,
                                }}>
                                    {(child.nickname || child.fullName).charAt(0)}
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontWeight: 500 }}>{child.nickname || child.fullName}</div>
                                    <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>{child.sessionsPerMonth} ครั้ง/เดือน</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selectedChild && (
                <>
                    {/* Booking Summary */}
                    <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <div>
                                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
                                    {selectedChild.nickname || selectedChild.fullName}
                                </h3>
                                <div style={{ fontSize: 14, color: "var(--foreground-muted)" }}>
                                    Level {selectedChild.level} • {selectedChild.branchName}
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontSize: 24, fontWeight: 700, color: "var(--primary)" }}>
                                    ฿{totalPrice.toLocaleString()}
                                </div>
                                <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>ต่อเดือน</div>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ marginBottom: 8 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6 }}>
                                <span>จองแล้ว</span>
                                <span style={{ fontWeight: 600 }}>
                                    {bookedCount} / {selectedChild.sessionsPerMonth} ครั้ง
                                </span>
                            </div>
                            <div style={{ height: 8, background: "var(--background)", borderRadius: 4, overflow: "hidden" }}>
                                <div style={{
                                    height: "100%",
                                    width: `${Math.min(progressPercent, 100)}%`,
                                    background: progressPercent >= 100
                                        ? "var(--success)"
                                        : "linear-gradient(90deg, var(--primary), var(--secondary))",
                                    borderRadius: 4,
                                    transition: "width 0.3s ease",
                                }} />
                            </div>
                        </div>

                        {bookedCount >= selectedChild.sessionsPerMonth && (
                            <div style={{
                                padding: "8px 12px",
                                background: "rgba(16,185,129,0.1)",
                                borderRadius: 8,
                                color: "var(--success)",
                                fontSize: 14,
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}>
                                <Check size={16} />
                                จองครบแล้ว! สามารถยกเลิกและเลือกวันใหม่ได้
                            </div>
                        )}
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
                        {sessions.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                                {sessions.map((session) => {
                                    const dateInfo = formatDate(session.date);
                                    const isFull = session.spotsLeft <= 0 && !session.isBooked;
                                    const canBook = !session.isBooked && !isFull && bookedCount < selectedChild.sessionsPerMonth;

                                    return (
                                        <div
                                            key={session.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: 16,
                                                background: "var(--background)",
                                                borderRadius: 12,
                                                borderLeft: `4px solid ${session.isBooked ? "var(--success)" : isFull ? "var(--error)" : "var(--primary)"}`,
                                                opacity: isFull ? 0.6 : 1,
                                            }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                                <div style={{
                                                    width: 50, textAlign: "center",
                                                    padding: "8px 0",
                                                    background: session.isBooked ? "rgba(16,185,129,0.1)" : "rgba(0,0,0,0.2)",
                                                    borderRadius: 8,
                                                }}>
                                                    <div style={{
                                                        fontSize: 11,
                                                        color: session.isBooked ? "var(--success)" : dateInfo.isWeekend ? "var(--error)" : "var(--foreground-muted)",
                                                    }}>
                                                        {dateInfo.dayName}
                                                    </div>
                                                    <div style={{ fontSize: 20, fontWeight: 700 }}>{dateInfo.dayNum}</div>
                                                </div>

                                                <div>
                                                    <div style={{ fontWeight: 500, marginBottom: 4 }}>
                                                        {session.startTime} - {session.endTime}
                                                    </div>
                                                    <div style={{ fontSize: 13, color: "var(--foreground-muted)", display: "flex", gap: 12 }}>
                                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                            <MapPin size={14} /> {session.branchName}
                                                        </span>
                                                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                                            <Users size={14} /> เหลือ {session.spotsLeft} ที่
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                {session.isBooked ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                        <span style={{
                                                            padding: "6px 12px", borderRadius: 20,
                                                            background: "rgba(16,185,129,0.1)", color: "var(--success)",
                                                            fontSize: 13, fontWeight: 500,
                                                        }}>
                                                            ✓ จองแล้ว
                                                        </span>
                                                        <button
                                                            onClick={() => handleCancelBooking(session.id)}
                                                            disabled={isPending}
                                                            style={{
                                                                padding: "8px 14px", borderRadius: 8,
                                                                border: "1px solid var(--error)", background: "transparent",
                                                                color: "var(--error)", cursor: "pointer", fontSize: 13,
                                                            }}
                                                        >
                                                            ยกเลิก
                                                        </button>
                                                    </div>
                                                ) : isFull ? (
                                                    <span style={{
                                                        padding: "6px 12px", borderRadius: 20,
                                                        background: "rgba(239,68,68,0.1)", color: "var(--error)",
                                                        fontSize: 13, fontWeight: 500,
                                                    }}>
                                                        เต็ม
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleBookSession(session.id)}
                                                        disabled={isPending || !canBook}
                                                        className="btn-primary"
                                                        style={{
                                                            padding: "8px 16px", fontSize: 14,
                                                            opacity: canBook ? 1 : 0.5,
                                                        }}
                                                    >
                                                        จอง
                                                    </button>
                                                )}
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
                </>
            )}

            {children.length === 0 && (
                <div className="card" style={{ padding: 40, textAlign: "center", color: "var(--foreground-muted)" }}>
                    <AlertCircle size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                    <div>ไม่พบข้อมูลลูกในระบบ</div>
                </div>
            )}
        </div>
    );
}
