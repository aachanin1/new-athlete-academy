"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CourseTypeSelector, { EnrollmentType } from "@/components/CourseTypeSelector";

interface EnrollClientProps {
    userId: string;
    branches: { id: string; name: string }[];
}

export default function EnrollClient({ userId, branches }: EnrollClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialStep = searchParams.get("type") as EnrollmentType | null;

    const [selectedType, setSelectedType] = useState<EnrollmentType | null>(initialStep);

    const handleSelect = (type: EnrollmentType) => {
        setSelectedType(type);

        switch (type) {
            case "kids":
                // ไปหน้าเพิ่มลูก
                router.push("/parent/children/add?courseType=kids");
                break;
            case "adults":
                // ไปหน้าลงทะเบียนผู้ใหญ่
                router.push("/parent/enroll/adult");
                break;
        }
    };

    return (
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CourseTypeSelector onSelect={handleSelect} />
        </div>
    );
}

