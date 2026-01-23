import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { sessionId, studentId } = await request.json();

    if (!sessionId || !studentId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if already booked
    const { data: existing } = await supabase
        .from("attendance")
        .select("id")
        .eq("session_id", sessionId)
        .eq("student_id", studentId)
        .single();

    if (existing) {
        return NextResponse.json({ error: "ลงทะเบียนในคลาสนี้แล้ว" }, { status: 400 });
    }

    // Check if session has available spots
    const { data: session } = await supabase
        .from("sessions")
        .select("max_students, attendance(id)")
        .eq("id", sessionId)
        .single();

    const currentCount = session?.attendance?.length || 0;
    const maxStudents = session?.max_students || 6;

    if (currentCount >= maxStudents) {
        return NextResponse.json({ error: "คลาสนี้เต็มแล้ว" }, { status: 400 });
    }

    // Get student's enrollment to check sessions per month
    const { data: enrollment } = await supabase
        .from("enrollments")
        .select("sessions_per_month")
        .eq("student_id", studentId)
        .eq("status", "active")
        .single();

    const sessionsPerMonth = enrollment?.sessions_per_month || 4;

    // Get session date to check month
    const { data: sessionData } = await supabase
        .from("sessions")
        .select("date")
        .eq("id", sessionId)
        .single();

    const sessionDate = new Date(sessionData?.date);
    const month = sessionDate.getMonth();
    const year = sessionDate.getFullYear();

    // Count existing bookings in this month
    const { data: existingBookings } = await supabase
        .from("attendance")
        .select(`
            id,
            sessions!inner (date)
        `)
        .eq("student_id", studentId);

    const bookingsThisMonth = existingBookings?.filter(b => {
        const d = new Date((b.sessions as any).date);
        return d.getMonth() === month && d.getFullYear() === year;
    }).length || 0;

    if (bookingsThisMonth >= sessionsPerMonth) {
        return NextResponse.json({
            error: `จองครบ ${sessionsPerMonth} ครั้ง/เดือนแล้ว กรุณายกเลิกวันอื่นก่อน`
        }, { status: 400 });
    }

    // Create booking (status will be set by coach when checking attendance)
    const { error } = await supabase
        .from("attendance")
        .insert({
            session_id: sessionId,
            student_id: studentId,
        });

    if (error) {
        console.error("Error booking session:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
