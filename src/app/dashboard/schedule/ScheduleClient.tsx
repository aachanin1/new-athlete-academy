"use client";

import { useState, useTransition, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/components/Modal";
import { addSession } from "@/lib/actions";

interface Session {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    time: string;
    branchId: string;
    branch: string;
    students: number;
    maxStudents: number;
}

interface Branch {
    id: string;
    name: string;
}

interface ScheduleClientProps {
    initialSchedule: Session[];
    branches: Branch[];
    initialDate: string;
}

export default function ScheduleClient({ initialSchedule, branches, initialDate }: ScheduleClientProps) {
    const [selectedDate, setSelectedDate] = useState(new Date(initialDate));
    const [schedule, setSchedule] = useState(initialSchedule);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isLoading, setIsLoading] = useState(false);

    // Fetch schedule when date changes
    const fetchSchedule = async (date: Date) => {
        setIsLoading(true);
        try {
            const dateStr = date.toISOString().split("T")[0];
            const response = await fetch(`/api/schedule?date=${dateStr}`);
            if (response.ok) {
                const data = await response.json();
                setSchedule(data);
            }
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrevDay = () => {
        const newDate = subDays(selectedDate, 1);
        setSelectedDate(newDate);
        fetchSchedule(newDate);
    };

    const handleNextDay = () => {
        const newDate = addDays(selectedDate, 1);
        setSelectedDate(newDate);
        fetchSchedule(newDate);
    };

    const handleToday = () => {
        const today = new Date();
        setSelectedDate(today);
        fetchSchedule(today);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value);
        setSelectedDate(newDate);
        fetchSchedule(newDate);
    };

    const handleAddSession = async (formData: FormData) => {
        formData.set("date", selectedDate.toISOString().split("T")[0]);
        startTransition(async () => {
            const result = await addSession(formData);
            if (result.success && result.data) {
                const branchName = branches.find((b) => b.id === formData.get("branch_id"))?.name || "-";
                setSchedule((prev) => [
                    ...prev,
                    {
                        id: result.data.id,
                        date: result.data.date,
                        startTime: result.data.start_time,
                        endTime: result.data.end_time,
                        time: `${result.data.start_time.slice(0, 5)} - ${result.data.end_time.slice(0, 5)}`,
                        branchId: result.data.branch_id,
                        branch: branchName,
                        students: 0,
                        maxStudents: result.data.max_students,
                    },
                ].sort((a, b) => a.startTime.localeCompare(b.startTime)));
                setIsAddModalOpen(false);
            }
        });
    };

    return (
        <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>ตารางเรียน</h1>
                    <p style={{ color: "var(--foreground-muted)" }}>
                        {format(selectedDate, "EEEE d MMMM yyyy", { locale: th })}
                    </p>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                    {/* Date Navigation */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <button
                            onClick={handlePrevDay}
                            style={{
                                padding: 8,
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                borderRadius: 8,
                                color: "var(--foreground)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={handleToday}
                            style={{
                                padding: "8px 16px",
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                borderRadius: 8,
                                color: "var(--foreground)",
                                cursor: "pointer",
                                fontSize: 14,
                            }}
                        >
                            วันนี้
                        </button>
                        <button
                            onClick={handleNextDay}
                            style={{
                                padding: 8,
                                background: "var(--background)",
                                border: "1px solid var(--border)",
                                borderRadius: 8,
                                color: "var(--foreground)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Date Picker */}
                    <input
                        type="date"
                        value={selectedDate.toISOString().split("T")[0]}
                        onChange={handleDateChange}
                        style={{
                            padding: "8px 16px",
                            background: "var(--background)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            color: "var(--foreground)",
                            cursor: "pointer",
                        }}
                    />

                    <button
                        className="btn-primary"
                        style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 8 }}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        <Plus size={18} />
                        เพิ่มคลาส
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
                {isLoading ? (
                    <div style={{ textAlign: "center", padding: 40 }}>
                        <p style={{ color: "var(--foreground-muted)" }}>กำลังโหลด...</p>
                    </div>
                ) : schedule.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {schedule.map((session) => (
                            <div
                                key={session.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: 20,
                                    background: "var(--background)",
                                    borderRadius: 12,
                                    borderLeft: "4px solid var(--primary)",
                                }}
                            >
                                <div style={{ display: "flex", gap: 24 }}>
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            minWidth: 80,
                                        }}
                                    >
                                        <div style={{ fontSize: 18, fontWeight: 700 }}>{session.time.split(" - ")[0]}</div>
                                        <div style={{ fontSize: 13, color: "var(--foreground-muted)" }}>
                                            ถึง {session.time.split(" - ")[1]}
                                        </div>
                                    </div>

                                    <div style={{ width: 1, background: "var(--border)" }} />

                                    <div>
                                        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                                            แบดมินตันพื้นฐาน (Level 1-15)
                                        </div>
                                        <div
                                            style={{ display: "flex", gap: 16, fontSize: 14, color: "var(--foreground-muted)" }}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <MapPin size={16} />
                                                {session.branch}
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <Users size={16} />
                                                {session.students}/{session.maxStudents} คน
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <Clock size={16} />2 ชั่วโมง
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    style={{
                                        padding: "8px 16px",
                                        borderRadius: 6,
                                        border: "1px solid var(--primary)",
                                        color: "var(--primary)",
                                        background: "rgba(0,212,255,0.1)",
                                        cursor: "pointer",
                                        fontSize: 14,
                                        fontWeight: 500,
                                    }}
                                >
                                    ดูรายชื่อ
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: "center", padding: 40 }}>
                        <CalendarIcon
                            size={48}
                            style={{ color: "var(--foreground-muted)", marginBottom: 16, opacity: 0.5 }}
                        />
                        <h3 style={{ fontSize: 18, marginBottom: 8 }}>ไม่มีตารางเรียนวันนี้</h3>
                        <p style={{ color: "var(--foreground-muted)" }}>ลองเลือกวันที่อื่น หรือเพิ่มคลาสเรียนใหม่</p>
                    </div>
                )}
            </div>

            {/* Add Session Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="เพิ่มคลาสใหม่" size="md">
                <form action={handleAddSession}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                วันที่
                            </label>
                            <input
                                type="text"
                                value={format(selectedDate, "EEEE d MMMM yyyy", { locale: th })}
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
                        </div>
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                สาขา *
                            </label>
                            <select
                                name="branch_id"
                                required
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
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                            <div>
                                <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                    เวลาเริ่ม *
                                </label>
                                <input
                                    type="time"
                                    name="start_time"
                                    required
                                    defaultValue="09:00"
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
                                    เวลาสิ้นสุด *
                                </label>
                                <input
                                    type="time"
                                    name="end_time"
                                    required
                                    defaultValue="11:00"
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
                        <div>
                            <label style={{ display: "block", marginBottom: 6, fontSize: 14, fontWeight: 500 }}>
                                จำนวนนักเรียนสูงสุด
                            </label>
                            <input
                                type="number"
                                name="max_students"
                                min="1"
                                max="20"
                                defaultValue="6"
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
        </div>
    );
}
