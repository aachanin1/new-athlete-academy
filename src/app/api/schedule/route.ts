import { NextRequest, NextResponse } from "next/server";
import { getScheduleByDate } from "@/lib/data/dashboard";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const date = searchParams.get("date");

    if (!date) {
        return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const schedule = await getScheduleByDate(date);
    return NextResponse.json(schedule);
}
