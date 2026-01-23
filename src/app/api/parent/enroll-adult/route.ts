import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const formData = await request.formData();

        const userId = formData.get("user_id") as string;
        const fullName = formData.get("full_name") as string;
        const nickname = formData.get("nickname") as string;
        const branchId = formData.get("branch_id") as string;
        const phone = formData.get("phone") as string;
        const birthDate = formData.get("birth_date") as string;

        if (!fullName || !branchId) {
            return NextResponse.json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" }, { status: 400 });
        }

        // 1. Create adult student record (no parent_id required)
        const { data: student, error: studentError } = await supabase
            .from("students")
            .insert({
                full_name: fullName,
                nickname: nickname || null,
                birth_date: birthDate || null,
                is_adult_student: true,
                user_id: userId !== "demo-user-id" ? userId : null,
                current_level: 1,
                is_active: true,
            })
            .select()
            .single();

        if (studentError) {
            console.error("Student insert error:", studentError);
            return NextResponse.json({ error: "ไม่สามารถบันทึกข้อมูลได้" }, { status: 500 });
        }

        // 2. Create enrollment with adult course type
        const today = new Date().toISOString().split("T")[0];

        const { error: enrollmentError } = await supabase
            .from("enrollments")
            .insert({
                student_id: student.id,
                branch_id: branchId,
                sessions_per_month: 4, // Default 4 sessions
                price_per_month: 3000, // Adult placeholder price
                status: "trial",
                start_date: today,
                course_type: "adults",
            });

        if (enrollmentError) {
            console.error("Enrollment insert error:", enrollmentError);
            // Delete the student if enrollment fails
            await supabase.from("students").delete().eq("id", student.id);
            return NextResponse.json({ error: "ไม่สามารถลงทะเบียนได้" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            studentId: student.id,
            message: "ลงทะเบียนเรียบร้อยแล้ว"
        });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "เกิดข้อผิดพลาดในระบบ" }, { status: 500 });
    }
}
