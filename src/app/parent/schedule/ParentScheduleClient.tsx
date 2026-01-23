"use client";

import { useState, useTransition, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, Check, X, CheckCircle, AlertCircle } from "lucide-react";
import {
    getAvailableSessions,
    getParentChildrenForBooking,
    bookSession,
    cancelBooking,
    getBookedSessions
} from "@/lib/parentActions";

interface Session {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    branchId: string;
    branchName: string;
    maxStudents: number;
    currentStudents: number;
    spotsLeft: number;
}

interface Child {
    id: string;
    fullName: string;
    nickname: string;
    level: number;
    enrollmentId: string | null;
    branchId: string | null;
}

interface ParentScheduleClientProps {
    initialSessions: Session[];
    initialChildren: Child[];
}

export default function ParentScheduleClient({ initialSessions, initialChildren }: ParentScheduleClientProps) {
    const [sessions, setSessions] = useState(initialSessions);
    const [children] = useState(initialChildren);
    const [selectedChild, setSelectedChild] = useState<Child | null>(initialChildren[0] || null);
    const [bookedSessionIds, setBookedSessionIds] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (selectedChild) {
            getBookedSessions(selectedChild.id).then(setBookedSessionIds);
        }
    }, [selectedChild]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัส", "ศุกร์", "เสาร์"];
        const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        return {
            day: days[date.getDay()],
            date: date.getDate(),
            month: months[date.getMonth()],
            fullDate: `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`,
        };
    };

    const handleBook = async (sessionId: string) => {
        if (!selectedChild) return;

        startTransition(async () => {
            const result = await bookSession(sessionId, selectedChild.id);
            if (result.success) {
                setBookedSessionIds(prev => [...prev, sessionId]);
                setSessions(prev => prev.map(s =>
                    s.id === sessionId ? { ...s, currentStudents: s.currentStudents + 1, spotsLeft: s.spotsLeft - 1 } : s
                ));
                showSuccess(`จองคลาสให้ ${selectedChild.nickname || selectedChild.fullName} เรียบร้อยแล้ว`);
            } else {
                showError(result.error || "เกิดข้อผิดพลาด");
            }
        });
    };

    const handleCancel = async (sessionId: string) => {
        if (!selectedChild) return;

        startTransition(async () => {
            const result = await cancelBooking(sessionId, selectedChild.id);
            if (result.success) {
                setBookedSessionIds(prev => prev.filter(id => id !== sessionId));
                setSessions(prev => prev.map(s =>
                    s.id === sessionId ? { ...s, currentStudents: s.currentStudents - 1, spotsLeft: s.spotsLeft + 1 } : s
                ));
                showSuccess("ยกเลิกการจองเรียบร้อยแล้ว");
            } else {
                showError(result.error || "เกิดข้อผิดพลาด");
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

    const isBooked = (sessionId: string) => bookedSessionIds.includes(sessionId);

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <h1 style={{ fontSize: 24, fontWeight: 700 }}>จองคลาสเรียน</h1>
            </div>

            {/* Success/Error Toast */}
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
                }}>
                    <CheckCircle size={18} />
                    {successMessage}
                </div>
            )}
            {errorMessage && (
                <div style={{
                    position: "fixed",
                    top: 20,
                    right: 20,
                    padding: "12px 20px",
                    background: "var(--error)",
                    color: "white",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    zIndex: 1001,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}>
                    <AlertCircle size={18} />
                    {errorMessage}
                </div>
            )}

            {/* Child Selector */}
            <div className="card" style={{ padding: 20, marginBottom: 24 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>เลือกลูก:</label>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {children.map((child) => (
                        <button
                            key={child.id}
                            onClick={() => setSelectedChild(child)}
                            style={{
                                padding: "12px 20px",
                                borderRadius: 12,
                                border: selectedChild?.id === child.id
                                    ? "2px solid var(--primary)"
                                    : "1px solid var(--border)",
                                background: selectedChild?.id === child.id
                                    ? "rgba(0,212,255,0.1)"
                                    : "var(--background)",
                                color: "var(--foreground)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <div style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#0A1628",
                                fontWeight: 600,
                            }}>
                                {(child.nickname || child.fullName).charAt(0)}
                            </div>
                            <div style={{ textAlign: "left" }}>
                                <div style={{ fontWeight: 500 }}>{child.nickname || child.fullName}</div>
                                <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>Level {child.level}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Available Sessions */}
            <div className="card" style={{ padding: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>คลาสที่เปิดสอน</h2>

                {sessions.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {sessions.map((session) => {
                            const dateInfo = formatDate(session.date);
                            const booked = isBooked(session.id);
                            const isFull = session.spotsLeft <= 0;

                            return (
                                <div
                                    key={session.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: 20,
                                        background: "var(--background)",
                                        borderRadius: 12,
                                        borderLeft: `4px solid ${booked ? "var(--success)" : isFull ? "var(--error)" : "var(--primary)"}`,
                                        opacity: isFull && !booked ? 0.6 : 1,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: 70,
                                            height: 70,
                                            background: booked ? "rgba(16,185,129,0.1)" : "var(--card-background)",
                                            borderRadius: 12,
                                            border: "1px solid var(--border)",
                                        }}>
                                            <div style={{ fontSize: 12, color: booked ? "var(--success)" : "var(--primary)", fontWeight: 600 }}>
                                                {dateInfo.day}
                                            </div>
                                            <div style={{ fontSize: 24, fontWeight: 700 }}>
                                                {dateInfo.date}
                                            </div>
                                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                {dateInfo.month}
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                                                {session.startTime} - {session.endTime}
                                            </div>
                                            <div style={{ display: "flex", gap: 16, color: "var(--foreground-muted)", fontSize: 14 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <MapPin size={16} />
                                                    {session.branchName}
                                                </div>
                                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                    <Users size={16} />
                                                    {session.currentStudents}/{session.maxStudents} คน
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        {booked ? (
                                            <>
                                                <span style={{
                                                    padding: "6px 12px",
                                                    borderRadius: 20,
                                                    background: "rgba(16,185,129,0.1)",
                                                    color: "var(--success)",
                                                    fontSize: 13,
                                                    fontWeight: 500,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                }}>
                                                    <Check size={14} />
                                                    จองแล้ว
                                                </span>
                                                <button
                                                    onClick={() => handleCancel(session.id)}
                                                    disabled={isPending}
                                                    style={{
                                                        padding: "10px 16px",
                                                        borderRadius: 8,
                                                        border: "1px solid var(--error)",
                                                        background: "transparent",
                                                        color: "var(--error)",
                                                        cursor: "pointer",
                                                        fontSize: 14,
                                                        opacity: isPending ? 0.7 : 1,
                                                    }}
                                                >
                                                    ยกเลิก
                                                </button>
                                            </>
                                        ) : isFull ? (
                                            <span style={{
                                                padding: "6px 12px",
                                                borderRadius: 20,
                                                background: "rgba(239,68,68,0.1)",
                                                color: "var(--error)",
                                                fontSize: 13,
                                                fontWeight: 500,
                                            }}>
                                                เต็ม
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleBook(session.id)}
                                                disabled={isPending || !selectedChild}
                                                className="btn-primary"
                                                style={{
                                                    padding: "10px 20px",
                                                    fontSize: 14,
                                                    opacity: isPending ? 0.7 : 1,
                                                }}
                                            >
                                                จองเรียน
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
                        <div>ไม่มีคลาสเรียนเปิดสอน</div>
                    </div>
                )}
            </div>
        </div>
    );
}
