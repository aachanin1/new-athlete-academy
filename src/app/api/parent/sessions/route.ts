import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    const childId = searchParams.get("childId");
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());
    const month = parseInt(searchParams.get("month") || (new Date().getMonth() + 1).toString());
    const courseType = searchParams.get("courseType") || "kids"; // default to kids

    if (!childId) {
        return NextResponse.json({ error: "Missing childId" }, { status: 400 });
    }

    // Get first and last day of month
    const startDate = new Date(year, month - 1, 1).toISOString().split("T")[0];
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    // Get student's enrollment to find their branch
    const { data: enrollment } = await supabase
        .from("enrollments")
        .select("branch_id, course_type")
        .eq("student_id", childId)
        .in("status", ["active", "trial"])
        .single();

    const branchId = enrollment?.branch_id;
    // Use enrollment's course_type if available, otherwise use parameter
    const effectiveCourseType = enrollment?.course_type || courseType;

    // Get all sessions in this month for the student's branch and course type
    let query = supabase
        .from("sessions")
        .select(`
            id,
            date,
            start_time,
            end_time,
            max_students,
            course_type,
            branches (name),
            attendance (
                id,
                student_id
            )
        `)
        .eq("branch_id", branchId)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

    // Filter by course type if the column exists
    // (graceful degradation for databases without the migration)
    if (effectiveCourseType) {
        query = query.eq("course_type", effectiveCourseType);
    }

    const { data: sessions } = await query;

    // Get booked sessions count for this student in this month
    const { data: bookedAttendance } = await supabase
        .from("attendance")
        .select(`
            id,
            sessions!inner (
                date
            )
        `)
        .eq("student_id", childId);

    // Count bookings in this month
    const bookedInMonth = bookedAttendance?.filter(a => {
        const sessionDate = new Date((a.sessions as any).date);
        return sessionDate.getMonth() === month - 1 && sessionDate.getFullYear() === year;
    }).length || 0;

    // Get list of session IDs this student has booked
    const { data: studentBookings } = await supabase
        .from("attendance")
        .select("session_id")
        .eq("student_id", childId);

    const bookedSessionIds = studentBookings?.map(b => b.session_id) || [];

    const formattedSessions = sessions?.map(session => ({
        id: session.id,
        date: session.date,
        startTime: session.start_time?.slice(0, 5) || "00:00",
        endTime: session.end_time?.slice(0, 5) || "00:00",
        branchName: (session.branches as any)?.name || "-",
        spotsLeft: (session.max_students || 6) - (session.attendance?.length || 0),
        isBooked: bookedSessionIds.includes(session.id),
    })) || [];

    return NextResponse.json({
        sessions: formattedSessions,
        bookedCount: bookedInMonth,
    });
}
