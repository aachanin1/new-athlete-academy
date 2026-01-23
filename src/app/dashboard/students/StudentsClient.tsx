/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useTransition } from "react";
import { Search, Filter, MoreHorizontal, Plus, Edit2, Trash2 } from "lucide-react";
import Modal from "@/components/Modal";
import { addStudent, updateStudent, deleteStudent } from "@/lib/actions";

interface Student {
    id: string;
    full_name: string;
    nickname: string | null;
    current_level: number;
    birth_date: string | null;
    gender: string | null;
    is_active: boolean;
    enrollments: any[];
}

interface Branch {
    id: string;
    name: string;
}

interface StudentsClientProps {
    initialStudents: any[];
    branches: Branch[];
}

export default function StudentsClient({ initialStudents, branches }: StudentsClientProps) {
    const [students, setStudents] = useState(initialStudents);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isPending, startTransition] = useTransition();
    const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

    const filteredStudents = students.filter(
        (s) =>
            s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddStudent = async (formData: FormData) => {
        startTransition(async () => {
            const result = await addStudent(formData);
            if (result.success && result.data) {
                // Optimistic update
                setStudents((prev) => [
                    {
                        ...result.data,
                        enrollments: [],
                    } as Student,
                    ...prev,
                ]);
                setIsAddModalOpen(false);
            }
        });
    };

    const handleUpdateStudent = async (formData: FormData) => {
        if (!selectedStudent) return;
        startTransition(async () => {
            const result = await updateStudent(selectedStudent.id, formData);
            if (result.success) {
                setStudents((prev) =>
                    prev.map((s) =>
                        s.id === selectedStudent.id
                            ? {
                                ...s,
                                full_name: formData.get("full_name") as string,
                                nickname: formData.get("nickname") as string,
                                birth_date: formData.get("birth_date") as string,
                                gender: formData.get("gender") as string,
                                current_level: parseInt(formData.get("current_level") as string),
                            }
                            : s
                    )
                );
                setIsEditModalOpen(false);
                setSelectedStudent(null);
            }
        });
    };

    const handleDeleteStudent = async () => {
        if (!selectedStudent) return;
        startTransition(async () => {
            const result = await deleteStudent(selectedStudent.id);
            if (result.success) {
                setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id));
                setIsDeleteModalOpen(false);
                setSelectedStudent(null);
            }
        });
    };

    const calculateAge = (birthDate: string | null) => {
        if (!birthDate) return "-";
        return new Date().getFullYear() - new Date(birthDate).getFullYear();
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>รายชื่อนักเรียน</h1>
                    <p style={{ color: "var(--foreground-muted)" }}>นักเรียนทั้งหมด {students.length} คน</p>
                </div>
                <button
                    className="btn-primary"
                    style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 8 }}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus size={18} />
                    เพิ่มนักเรียน
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
                {/* Toolbar */}
                <div style={{ padding: 16, borderBottom: "1px solid var(--border)", display: "flex", gap: 12 }}>
                    <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
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
                            placeholder="ค้นหาชื่อ, ชื่อเล่น..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 10px 10px 40px",
                                borderRadius: 8,
                                border: "1px solid var(--border)",
                                background: "var(--background)",
                                color: "var(--foreground)",
                                outline: "none",
                            }}
                        />
                    </div>
                    <button
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "0 16px",
                            borderRadius: 8,
                            border: "1px solid var(--border)",
                            background: "transparent",
                            color: "var(--foreground)",
                            cursor: "pointer",
                        }}
                    >
                        <Filter size={18} />
                        ตัวกรอง
                    </button>
                </div>

                {/* Table */}
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                        <thead>
                            <tr style={{ background: "rgba(0,0,0,0.2)", textAlign: "left" }}>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                    ชื่อ-นามสกุล
                                </th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                    ชื่อเล่น
                                </th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                    เพศ
                                </th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                    อายุ
                                </th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                    Level
                                </th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                    สาขา
                                </th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                    สถานะ
                                </th>
                                <th style={{ padding: "12px 16px", fontWeight: 600, color: "var(--foreground-muted)" }}>
                                    <span style={{ visibility: "hidden" }}>Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id} style={{ borderBottom: "1px solid var(--border)" }}>
                                    <td style={{ padding: "16px" }}>
                                        <div style={{ fontWeight: 500 }}>{student.full_name}</div>
                                    </td>
                                    <td style={{ padding: "16px" }}>{student.nickname || "-"}</td>
                                    <td style={{ padding: "16px" }}>
                                        {student.gender === "male" ? "ชาย" : student.gender === "female" ? "หญิง" : "-"}
                                    </td>
                                    <td style={{ padding: "16px" }}>{calculateAge(student.birth_date)} ปี</td>
                                    <td style={{ padding: "16px" }}>
                                        <span
                                            style={{
                                                padding: "4px 8px",
                                                borderRadius: 4,
                                                background: "var(--background)",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {student.current_level}
                                        </span>
                                    </td>
                                    <td style={{ padding: "16px" }}>
                                        {(student.enrollments?.[0]?.branches as unknown as { name: string } | undefined)
                                            ?.name || "-"}
                                    </td>
                                    <td style={{ padding: "16px" }}>
                                        <span
                                            style={{
                                                padding: "4px 10px",
                                                borderRadius: 20,
                                                fontSize: 12,
                                                fontWeight: 500,
                                                background:
                                                    student.enrollments?.[0]?.status === "active"
                                                        ? "rgba(16, 185, 129, 0.1)"
                                                        : "rgba(245, 158, 11, 0.1)",
                                                color:
                                                    student.enrollments?.[0]?.status === "active"
                                                        ? "var(--success)"
                                                        : "var(--warning)",
                                            }}
                                        >
                                            {student.enrollments?.[0]?.status === "active" ? "เรียนอยู่" : "ทดลอง/หยุด"}
                                        </span>
                                    </td>
                                    <td style={{ padding: "16px", textAlign: "right", position: "relative" }}>
                                        <button
                                            onClick={() =>
                                                setActionMenuOpen(actionMenuOpen === student.id ? null : student.id)
                                            }
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                color: "var(--foreground-muted)",
                                                cursor: "pointer",
                                                padding: 8,
                                                borderRadius: 6,
                                            }}
                                        >
                                            <MoreHorizontal size={18} />
                                        </button>

                                        {actionMenuOpen === student.id && (
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    right: 16,
                                                    top: "100%",
                                                    background: "var(--card-background)",
                                                    border: "1px solid var(--border)",
                                                    borderRadius: 8,
                                                    padding: 8,
                                                    zIndex: 100,
                                                    minWidth: 150,
                                                    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setIsEditModalOpen(true);
                                                        setActionMenuOpen(null);
                                                    }}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "var(--foreground)",
                                                        cursor: "pointer",
                                                        borderRadius: 6,
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    <Edit2 size={16} />
                                                    แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedStudent(student);
                                                        setIsDeleteModalOpen(true);
                                                        setActionMenuOpen(null);
                                                    }}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 8,
                                                        width: "100%",
                                                        padding: "8px 12px",
                                                        background: "transparent",
                                                        border: "none",
                                                        color: "var(--error)",
                                                        cursor: "pointer",
                                                        borderRadius: 6,
                                                        fontSize: 14,
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                    ลบ
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Student Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="เพิ่มนักเรียนใหม่" size="lg">
                <form action={handleAddStudent}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                        <div style={{ gridColumn: "span 2" }}>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                ชื่อ-นามสกุล *
                            </label>
                            <input
                                name="full_name"
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
                                ชื่อเล่น
                            </label>
                            <input
                                name="nickname"
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
                                วันเกิด
                            </label>
                            <input
                                type="date"
                                name="birth_date"
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
                                เพศ
                            </label>
                            <select
                                name="gender"
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            >
                                <option value="">เลือก...</option>
                                <option value="male">ชาย</option>
                                <option value="female">หญิง</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                Level เริ่มต้น
                            </label>
                            <input
                                type="number"
                                name="current_level"
                                min="1"
                                max="60"
                                defaultValue="1"
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
                                สาขา
                            </label>
                            <select
                                name="branch_id"
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            >
                                <option value="">เลือกสาขา...</option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                จำนวนคลาส/เดือน
                            </label>
                            <select
                                name="sessions_per_month"
                                style={{
                                    width: "100%",
                                    padding: 12,
                                    borderRadius: 8,
                                    border: "1px solid var(--border)",
                                    background: "var(--background)",
                                    color: "var(--foreground)",
                                }}
                            >
                                <option value="4">4 ครั้ง</option>
                                <option value="8">8 ครั้ง</option>
                                <option value="12">12 ครั้ง</option>
                                <option value="16">16 ครั้ง</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
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

            {/* Edit Student Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedStudent(null);
                }}
                title="แก้ไขข้อมูลนักเรียน"
                size="lg"
            >
                {selectedStudent && (
                    <form action={handleUpdateStudent}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div style={{ gridColumn: "span 2" }}>
                                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                    ชื่อ-นามสกุล *
                                </label>
                                <input
                                    name="full_name"
                                    defaultValue={selectedStudent.full_name}
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
                                    ชื่อเล่น
                                </label>
                                <input
                                    name="nickname"
                                    defaultValue={selectedStudent.nickname || ""}
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
                                    วันเกิด
                                </label>
                                <input
                                    type="date"
                                    name="birth_date"
                                    defaultValue={selectedStudent.birth_date || ""}
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
                                    เพศ
                                </label>
                                <select
                                    name="gender"
                                    defaultValue={selectedStudent.gender || ""}
                                    style={{
                                        width: "100%",
                                        padding: 12,
                                        borderRadius: 8,
                                        border: "1px solid var(--border)",
                                        background: "var(--background)",
                                        color: "var(--foreground)",
                                    }}
                                >
                                    <option value="">เลือก...</option>
                                    <option value="male">ชาย</option>
                                    <option value="female">หญิง</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                    Level
                                </label>
                                <input
                                    type="number"
                                    name="current_level"
                                    min="1"
                                    max="60"
                                    defaultValue={selectedStudent.current_level}
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
                                onClick={() => {
                                    setIsEditModalOpen(false);
                                    setSelectedStudent(null);
                                }}
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
                )}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedStudent(null);
                }}
                title="ยืนยันการลบ"
                size="sm"
            >
                <p style={{ marginBottom: 24, color: "var(--foreground-muted)" }}>
                    คุณต้องการลบ <strong style={{ color: "var(--foreground)" }}>{selectedStudent?.full_name}</strong>{" "}
                    หรือไม่? การดำเนินการนี้ไม่สามารถยกเลิกได้
                </p>
                <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                    <button
                        onClick={() => {
                            setIsDeleteModalOpen(false);
                            setSelectedStudent(null);
                        }}
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
                        onClick={handleDeleteStudent}
                        disabled={isPending}
                        style={{
                            padding: "10px 24px",
                            borderRadius: 8,
                            border: "none",
                            background: "var(--error)",
                            color: "white",
                            cursor: "pointer",
                            opacity: isPending ? 0.7 : 1,
                        }}
                    >
                        {isPending ? "กำลังลบ..." : "ลบ"}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
