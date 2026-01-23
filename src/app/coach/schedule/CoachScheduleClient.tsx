"use client";

import { useState, useTransition, useEffect } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar, List, Clock, MapPin, Users, Check, X, UserPlus, CheckCircle } from "lucide-react";
import Modal from "@/components/Modal";
import {
    getSessionStudents,
    markAttendance,
    markAllPresent,
    addStudentToSession,
    getAvailableStudents
} from "@/lib/coachActions";

interface ClassSession {
    id: string;
    time: string;
    branch: string;
    branchId: string;
    level: string;
    students: number;
    status: "upcoming" | "ongoing" | "completed";
}

interface Student {
    id: string;
    studentId: string;
    status: string;
    checkInTime: string | null;
    studentName: string;
    studentNickname: string;
    currentLevel: number;
}

interface AvailableStudent {
    id: string;
    fullName: string;
    nickname: string;
    level: number;
}

interface CoachScheduleClientProps {
    initialClasses: ClassSession[];
}

export default function CoachScheduleClient({ initialClasses }: CoachScheduleClientProps) {
    const [classes] = useState(initialClasses);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
    const [students, setStudents] = useState<Student[]>([]);
    const [availableStudents, setAvailableStudents] = useState<AvailableStudent[]>([]);
    const [isPending, startTransition] = useTransition();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const today = new Date();

    const openAttendanceModal = async (session: ClassSession) => {
        setSelectedSession(session);
        setIsAttendanceModalOpen(true);

        startTransition(async () => {
            const data = await getSessionStudents(session.id);
            setStudents(data);
        });
    };

    const openAddStudentModal = async () => {
        if (!selectedSession) return;

        startTransition(async () => {
            const data = await getAvailableStudents(selectedSession.id, selectedSession.branchId);
            setAvailableStudents(data);
            setIsAddStudentModalOpen(true);
        });
    };

    const handleMarkAttendance = async (attendanceId: string, status: "present" | "absent" | "late") => {
        startTransition(async () => {
            const result = await markAttendance(attendanceId, status);
            if (result.success) {
                setStudents(prev => prev.map(s =>
                    s.id === attendanceId
                        ? { ...s, status, checkInTime: status !== "absent" ? new Date().toISOString() : null }
                        : s
                ));
                showSuccess(`บันทึกการเช็คชื่อเรียบร้อย`);
            }
        });
    };

    const handleMarkAllPresent = async () => {
        if (!selectedSession) return;

        startTransition(async () => {
            const result = await markAllPresent(selectedSession.id);
            if (result.success) {
                setStudents(prev => prev.map(s => ({
                    ...s,
                    status: "present",
                    checkInTime: new Date().toISOString()
                })));
                showSuccess("เช็คชื่อทุกคนเรียบร้อยแล้ว");
            }
        });
    };

    const handleAddStudent = async (studentId: string) => {
        if (!selectedSession) return;

        startTransition(async () => {
            const result = await addStudentToSession(selectedSession.id, studentId);
            if (result.success) {
                const student = availableStudents.find(s => s.id === studentId);
                if (student) {
                    setStudents(prev => [...prev, {
                        id: result.data.id,
                        studentId: student.id,
                        status: "pending",
                        checkInTime: null,
                        studentName: student.fullName,
                        studentNickname: student.nickname,
                        currentLevel: student.level,
                    }]);
                    setAvailableStudents(prev => prev.filter(s => s.id !== studentId));
                }
                showSuccess("เพิ่มนักเรียนเข้าคลาสเรียบร้อย");
            }
        });
    };

    const showSuccess = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "present":
                return { color: "var(--success)", bg: "rgba(16,185,129,0.1)", text: "มาเรียน" };
            case "absent":
                return { color: "var(--error)", bg: "rgba(239,68,68,0.1)", text: "ขาด" };
            case "late":
                return { color: "var(--warning)", bg: "rgba(245,158,11,0.1)", text: "มาสาย" };
            default:
                return { color: "var(--foreground-muted)", bg: "var(--background)", text: "รอเช็คชื่อ" };
        }
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>ตารางสอน</h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        {format(today, "EEEE d MMMM yyyy", { locale: th })}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    <button style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "var(--background)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}>
                        <Calendar size={18} />
                        ปฏิทินรายเดือน
                    </button>
                    <button style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        background: "rgba(0,212,255,0.1)",
                        border: "1px solid var(--primary)",
                        color: "var(--primary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 8
                    }}>
                        <List size={18} />
                        รายวัน
                    </button>
                </div>
            </div>

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
                }}>
                    <CheckCircle size={18} />
                    {successMessage}
                </div>
            )}

            <div className="card" style={{ padding: 24 }}>
                {classes.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {classes.map((cls) => (
                            <div key={cls.id} style={{
                                padding: 20,
                                background: "var(--background)",
                                borderRadius: 12,
                                borderLeft: `4px solid ${cls.status === "completed" ? "var(--success)" :
                                    cls.status === "ongoing" ? "var(--primary)" : "var(--foreground-muted)"}`
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                                            {cls.time}
                                        </div>
                                        <div style={{ fontSize: 16, fontWeight: 600 }}>
                                            Level {cls.level}
                                        </div>
                                    </div>
                                    <span style={{
                                        padding: "4px 12px",
                                        borderRadius: 20,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        height: "fit-content",
                                        background: cls.status === "ongoing" ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.05)",
                                        color: cls.status === "ongoing" ? "var(--primary)" :
                                            cls.status === "completed" ? "var(--success)" : "var(--foreground-muted)"
                                    }}>
                                        {cls.status === "ongoing" ? "กำลังสอน" : cls.status === "completed" ? "เสร็จสิ้น" : "รอดำเนินการ"}
                                    </span>
                                </div>

                                <div style={{ display: "flex", gap: 20, fontSize: 14, color: "var(--foreground-muted)" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <MapPin size={16} />
                                        {cls.branch}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <Users size={16} />
                                        {cls.students} คน
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <Clock size={16} />
                                        2 ชั่วโมง
                                    </div>
                                </div>

                                <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", gap: 12 }}>
                                    <button
                                        onClick={() => openAttendanceModal(cls)}
                                        className="btn-primary"
                                        style={{ flex: 1, padding: "10px" }}
                                    >
                                        เช็คชื่อ
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        style={{ flex: 1, padding: "10px" }}
                                    >
                                        ประเมินผล
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: 40, color: "var(--foreground-muted)" }}>
                        <Calendar size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <div>ไม่มีตารางสอนวันนี้</div>
                    </div>
                )}
            </div>

            {/* Attendance Modal */}
            <Modal
                isOpen={isAttendanceModalOpen}
                onClose={() => {
                    setIsAttendanceModalOpen(false);
                    setSelectedSession(null);
                }}
                title={`เช็คชื่อ - ${selectedSession?.time || ""}`}
                size="lg"
            >
                <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ color: "var(--foreground-muted)" }}>
                        {selectedSession?.branch} • Level {selectedSession?.level}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={openAddStudentModal}
                            style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                border: "1px solid var(--border)",
                                background: "transparent",
                                color: "var(--foreground)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13,
                            }}
                        >
                            <UserPlus size={16} />
                            เพิ่มนักเรียน
                        </button>
                        <button
                            onClick={handleMarkAllPresent}
                            disabled={isPending}
                            style={{
                                padding: "6px 12px",
                                borderRadius: 6,
                                border: "none",
                                background: "var(--success)",
                                color: "white",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 13,
                                opacity: isPending ? 0.7 : 1,
                            }}
                        >
                            <Check size={16} />
                            เช็คชื่อทั้งหมด
                        </button>
                    </div>
                </div>

                {students.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {students.map((student) => {
                            const status = getStatusBadge(student.status);
                            return (
                                <div
                                    key={student.id}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: 16,
                                        background: "var(--background)",
                                        borderRadius: 8,
                                    }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#0A1628",
                                            fontWeight: 600,
                                        }}>
                                            {student.studentName.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>
                                                {student.studentName}
                                                {student.studentNickname && (
                                                    <span style={{ color: "var(--foreground-muted)", fontWeight: 400 }}>
                                                        {" "}({student.studentNickname})
                                                    </span>
                                                )}
                                            </div>
                                            <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                Level {student.currentLevel}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: 20,
                                            fontSize: 12,
                                            fontWeight: 500,
                                            background: status.bg,
                                            color: status.color,
                                        }}>
                                            {status.text}
                                        </span>

                                        {student.status === "pending" && (
                                            <div style={{ display: "flex", gap: 4 }}>
                                                <button
                                                    onClick={() => handleMarkAttendance(student.id, "present")}
                                                    disabled={isPending}
                                                    style={{
                                                        padding: 8,
                                                        borderRadius: 6,
                                                        border: "none",
                                                        background: "var(--success)",
                                                        color: "white",
                                                        cursor: "pointer",
                                                    }}
                                                    title="มาเรียน"
                                                >
                                                    <Check size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleMarkAttendance(student.id, "late")}
                                                    disabled={isPending}
                                                    style={{
                                                        padding: 8,
                                                        borderRadius: 6,
                                                        border: "none",
                                                        background: "var(--warning)",
                                                        color: "white",
                                                        cursor: "pointer",
                                                    }}
                                                    title="มาสาย"
                                                >
                                                    <Clock size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleMarkAttendance(student.id, "absent")}
                                                    disabled={isPending}
                                                    style={{
                                                        padding: 8,
                                                        borderRadius: 6,
                                                        border: "none",
                                                        background: "var(--error)",
                                                        color: "white",
                                                        cursor: "pointer",
                                                    }}
                                                    title="ขาดเรียน"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: 40, color: "var(--foreground-muted)" }}>
                        {isPending ? "กำลังโหลด..." : "ยังไม่มีนักเรียนในคลาสนี้"}
                    </div>
                )}
            </Modal>

            {/* Add Student Modal */}
            <Modal
                isOpen={isAddStudentModalOpen}
                onClose={() => setIsAddStudentModalOpen(false)}
                title="เพิ่มนักเรียนเข้าคลาส"
                size="md"
            >
                {availableStudents.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {availableStudents.map((student) => (
                            <div
                                key={student.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 12,
                                    background: "var(--background)",
                                    borderRadius: 8,
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 500 }}>
                                        {student.fullName}
                                        {student.nickname && (
                                            <span style={{ color: "var(--foreground-muted)", fontWeight: 400 }}>
                                                {" "}({student.nickname})
                                            </span>
                                        )}
                                    </div>
                                    <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                        Level {student.level}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleAddStudent(student.id)}
                                    disabled={isPending}
                                    style={{
                                        padding: "6px 12px",
                                        borderRadius: 6,
                                        border: "none",
                                        background: "var(--primary)",
                                        color: "#0A1628",
                                        cursor: "pointer",
                                        fontSize: 13,
                                        fontWeight: 500,
                                    }}
                                >
                                    เพิ่ม
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: 40, color: "var(--foreground-muted)" }}>
                        {isPending ? "กำลังโหลด..." : "ไม่มีนักเรียนที่สามารถเพิ่มได้"}
                    </div>
                )}
            </Modal>
        </div>
    );
}
