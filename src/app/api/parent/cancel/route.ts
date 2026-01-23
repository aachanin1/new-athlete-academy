import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { sessionId, studentId } = await request.json();

    if (!sessionId || !studentId) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Delete the booking
    const { error } = await supabase
        .from("attendance")
        .delete()
        .eq("session_id", sessionId)
        .eq("student_id", studentId);

    if (error) {
        console.error("Error canceling booking:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
