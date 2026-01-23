"use client";

import { useState } from "react";
import { Users, User, ChevronRight } from "lucide-react";

export type EnrollmentType = 'kids' | 'adults';

interface CourseTypeSelectorProps {
    onSelect: (type: EnrollmentType) => void;
}

const courseTypes = [
    {
        id: 'kids' as EnrollmentType,
        icon: Users,
        title: 'เด็ก',
        subtitle: 'สมัครเรียนให้ลูก',
        description: 'ลงทะเบียนเรียนสำหรับบุตร',
        gradient: 'linear-gradient(135deg, #00D4FF 0%, #00A3CC 100%)',
        color: '#00D4FF',
    },
    {
        id: 'adults' as EnrollmentType,
        icon: User,
        title: 'ผู้ใหญ่',
        subtitle: 'สมัครเรียนด้วยตัวเอง',
        description: 'ลงทะเบียนเรียนสำหรับตัวคุณเอง',
        gradient: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
        color: '#7C3AED',
    },
];

export default function CourseTypeSelector({ onSelect }: CourseTypeSelectorProps) {
    const [selected, setSelected] = useState<EnrollmentType | null>(null);
    const [isHovering, setIsHovering] = useState<EnrollmentType | null>(null);

    const handleSelect = (type: EnrollmentType) => {
        setSelected(type);
    };

    const handleContinue = () => {
        if (selected) {
            onSelect(selected);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>
                    เลือกประเภทคอร์ส
                </h1>
                <p style={{ color: "var(--foreground-muted)", fontSize: 16 }}>
                    คุณต้องการลงทะเบียนเรียนแบบไหน?
                </p>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 20,
                marginBottom: 32
            }}>
                {courseTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selected === type.id;
                    const isHovered = isHovering === type.id;

                    return (
                        <button
                            key={type.id}
                            onClick={() => handleSelect(type.id)}
                            onMouseEnter={() => setIsHovering(type.id)}
                            onMouseLeave={() => setIsHovering(null)}
                            style={{
                                padding: 24,
                                borderRadius: 16,
                                border: isSelected
                                    ? `3px solid ${type.color}`
                                    : "2px solid var(--border)",
                                background: isSelected
                                    ? `${type.color}10`
                                    : "var(--card)",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all 0.2s ease",
                                transform: isHovered || isSelected ? "translateY(-4px)" : "none",
                                boxShadow: isSelected
                                    ? `0 8px 24px ${type.color}30`
                                    : isHovered
                                        ? "0 4px 12px rgba(0,0,0,0.15)"
                                        : "none",
                            }}
                        >
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: 16,
                                background: type.gradient,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 16px",
                            }}>
                                <Icon size={32} color="#0A1628" />
                            </div>

                            <h3 style={{
                                fontSize: 20,
                                fontWeight: 600,
                                marginBottom: 4,
                                color: "var(--foreground)"
                            }}>
                                {type.title}
                            </h3>

                            <p style={{
                                fontSize: 14,
                                color: type.color,
                                fontWeight: 500,
                                marginBottom: 8
                            }}>
                                {type.subtitle}
                            </p>

                            <p style={{
                                fontSize: 13,
                                color: "var(--foreground-muted)",
                                lineHeight: 1.5
                            }}>
                                {type.description}
                            </p>

                            {isSelected && (
                                <div style={{
                                    marginTop: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 4,
                                    color: type.color,
                                    fontSize: 13,
                                    fontWeight: 500,
                                }}>
                                    ✓ เลือกแล้ว
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={handleContinue}
                disabled={!selected}
                className="btn-primary"
                style={{
                    width: "100%",
                    padding: "16px 24px",
                    fontSize: 16,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    opacity: selected ? 1 : 0.5,
                    cursor: selected ? "pointer" : "not-allowed",
                }}
            >
                ดำเนินการต่อ
                <ChevronRight size={20} />
            </button>

            {/* Info Box */}
            <div style={{
                marginTop: 24,
                padding: 16,
                borderRadius: 12,
                background: "rgba(0,212,255,0.05)",
                border: "1px solid rgba(0,212,255,0.2)",
            }}>
                <p style={{ fontSize: 13, color: "var(--foreground-muted)", lineHeight: 1.6 }}>
                    💡 <strong>ต้องการเรียนหลายคน?</strong> สามารถลงทะเบียนเพิ่มได้ภายหลัง
                    โดยกดปุ่ม "+ ลงทะเบียน" ที่หน้าหลัก
                </p>
            </div>
        </div>
    );
}

