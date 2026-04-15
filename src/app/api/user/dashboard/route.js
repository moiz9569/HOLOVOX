import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";


export async function GET(req) {
  try {
    await connectDB();  
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");  
    const meetings = await MeetingModel.find({
      "participants.userId": userId,
    }).sort({ createdAt: -1 });
    return NextResponse.json({ meetings }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  } 
}