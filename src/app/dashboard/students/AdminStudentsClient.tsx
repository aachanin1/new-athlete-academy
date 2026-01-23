"use client";

import { useState } from "react";
import { Search, User, Phone, Mail, Calendar, MapPin, X, Users } from "lucide-react";
import Modal from "@/components/Modal";

interface Student {
    id: string;
    fullName: string;
    nickname: string | null;
    level: number;
    birthDate: string | null;
    gender: string | null;
    createdAt: string;
    parentName: string;
    parentPhone: string;
    parentEmail: string;
    parentLineId: string;
    sessionsPerMonth: number;
    pricePerMonth: number;
    enrollmentStatus: string;
    branchName: string;
}

interface AdminStudentsClientProps {
    students: Student[];
}

export default function AdminStudentsClient({ students }: AdminStudentsClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const filteredStudents = students.filter(
        (s) =>
            s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nickname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.parentName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const calculateAge = (birthDate: string | null) => {
        if (!birthDate) return "-";
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return `${age} ปี`;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return { color: "var(--success)", bg: "rgba(16,185,129,0.1)", text: "Active" };
            case "trial":
                return { color: "var(--warning)", bg: "rgba(245,158,11,0.1)", text: "ทดลองเรียน" };
            default:
                return { color: "var(--foreground-muted)", bg: "rgba(0,0,0,0.2)", text: status };
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>รายชื่อนักเรียน</h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        ทั้งหมด {students.length} คน
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className="card" style={{ padding: 16, marginBottom: 24 }}>
                <div style={{ position: "relative" }}>
                    <Search
                        size={18}
                        style={{
                            position: "absolute",
                            left: 12,
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--foreground-muted)",
                        }}
                    />
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อนักเรียนหรือผู้ปกครอง..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "12px 12px 12px 40px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "var(--background)",
                            color: "var(--foreground)",
                            fontSize: 14,
                        }}
                    />
                </div>
            </div>

            {/* Students Table */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                    <thead>
                        <tr style={{ background: "rgba(0,0,0,0.2)", textAlign: "left" }}>
                            <th style={{ padding: "14px 16px", fontWeight: 600 }}>นักเรียน</th>
                            <th style={{ padding: "14px 16px", fontWeight: 600 }}>Level</th>
                            <th style={{ padding: "14px 16px", fontWeight: 600 }}>ผู้ปกครอง</th>
                            <th style={{ padding: "14px 16px", fontWeight: 600 }}>สาขา</th>
                            <th style={{ padding: "14px 16px", fontWeight: 600 }}>สถานะ</th>
                            <th style={{ padding: "14px 16px", fontWeight: 600 }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.map((student, i) => {
                            const status = getStatusBadge(student.enrollmentStatus);
                            return (
                                <tr
                                    key={student.id}
                                    style={{
                                        borderBottom: i < filteredStudents.length - 1 ? "1px solid var(--border)" : "none",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setSelectedStudent(student)}
                                >
                                    <td style={{ padding: "14px 16px" }}>
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
                                                {(student.nickname || student.fullName).charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{student.nickname || student.fullName}</div>
                                                <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                                    {student.fullName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: 12,
                                            background: "var(--background)",
                                            fontWeight: 500,
                                        }}>
                                            Lv.{student.level}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <div>{student.parentName}</div>
                                        <div style={{ fontSize: 12, color: "var(--foreground-muted)" }}>
                                            {student.parentPhone}
                                        </div>
                                    </td>
                                    <td style={{ padding: "14px 16px" }}>{student.branchName}</td>
                                    <td style={{ padding: "14px 16px" }}>
                                        <span style={{
                                            padding: "4px 10px",
                                            borderRadius: 12,
                                            background: status.bg,
                                            color: status.color,
                                            fontSize: 12,
                                        }}>
                                            {status.text}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedStudent(student);
                                            }}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: 6,
                                                border: "1px solid var(--border)",
                                                background: "transparent",
                                                color: "var(--foreground)",
                                                cursor: "pointer",
                                                fontSize: 12,
                                            }}
                                        >
                                            ดูรายละเอียด
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {filteredStudents.length === 0 && (
                    <div style={{ padding: 40, textAlign: "center", color: "var(--foreground-muted)" }}>
                        <Users size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                        <div>ไม่พบนักเรียน</div>
                    </div>
                )}
            </div>

            {/* Student Detail Modal */}
            <Modal
                isOpen={!!selectedStudent}
                onClose={() => setSelectedStudent(null)}
                title="รายละเอียดนักเรียน"
            >
                {selectedStudent && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        {/* Student Info */}
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 24,
                                color: "#0A1628",
                                fontWeight: 600,
                            }}>
                                {(selectedStudent.nickname || selectedStudent.fullName).charAt(0)}
                            </div>
                            <div>
                                <div style={{ fontSize: 20, fontWeight: 600 }}>
                                    {selectedStudent.nickname || selectedStudent.fullName}
                                </div>
                                <div style={{ color: "var(--foreground-muted)" }}>
                                    {selectedStudent.fullName}
                                </div>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: 16,
                            padding: 16,
                            background: "var(--background)",
                            borderRadius: 12,
                        }}>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 4 }}>Level</div>
                                <div style={{ fontWeight: 500 }}>Level {selectedStudent.level}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 4 }}>อายุ</div>
                                <div style={{ fontWeight: 500 }}>{calculateAge(selectedStudent.birthDate)}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 4 }}>สาขา</div>
                                <div style={{ fontWeight: 500 }}>{selectedStudent.branchName}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 12, color: "var(--foreground-muted)", marginBottom: 4 }}>เรียน/เดือน</div>
                                <div style={{ fontWeight: 500 }}>{selectedStudent.sessionsPerMonth} ครั้ง</div>
                            </div>
                        </div>

                        {/* Parent Info */}
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                                <User size={18} style={{ color: "var(--primary)" }} />
                                ข้อมูลผู้ปกครอง
                            </div>
                            <div style={{
                                padding: 16,
                                background: "var(--background)",
                                borderRadius: 12,
                                display: "flex",
                                flexDirection: "column",
                                gap: 12,
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <User size={16} style={{ color: "var(--foreground-muted)" }} />
                                    <span style={{ fontWeight: 500 }}>{selectedStudent.parentName}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Phone size={16} style={{ color: "var(--foreground-muted)" }} />
                                    <span>{selectedStudent.parentPhone}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                    <Mail size={16} style={{ color: "var(--foreground-muted)" }} />
                                    <span>{selectedStudent.parentEmail}</span>
                                </div>
                                {selectedStudent.parentLineId !== "-" && (
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ color: "var(--foreground-muted)", fontSize: 14 }}>LINE:</span>
                                        <span>{selectedStudent.parentLineId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedStudent(null)}
                            className="btn-secondary"
                            style={{ width: "100%", justifyContent: "center", padding: 12 }}
                        >
                            ปิด
                        </button>
                    </div>
                )}
            </Modal>
        </div>
    );
}
