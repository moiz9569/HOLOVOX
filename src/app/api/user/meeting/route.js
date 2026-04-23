import { NextResponse } from "next/server";
// import connectDB from "../../../../../lib/db";
import MeetingModel from "@/app/models/Meeting.model";
import { connectDB } from "../../../../../lib/db";
import { v4 as uuidv4 } from "uuid"
export async function POST(request){
try {
    const {hostId,name,email,meetingId,meetingTitle,date,time,upcoming}= await request.json();
  console.log("Create Meeting Payload:", {hostId,name,email,meetingId,meetingTitle,time,upcoming});
if(!hostId || !name || !email || !meetingId){
    return NextResponse.json({error : "Missing required fields"}, {status:400});
}
await connectDB();
   const meeting = await MeetingModel.create({
      meetingId,
      hostId,
      meetingTitle : meetingTitle || "Untitled Meeting",
      meetingDate: date ? new Date(date) : new Date(),
      time: time || "00:00",
      upcoming: upcoming !== undefined ? upcoming : false,
      participants: [
        {
          name,
          email,
          role: "host",
        },
      ],
    });
    return NextResponse.json({
      success: true,
      meeting,
    });
} catch (error) {
     return NextResponse.json({
      success: false,
      message: error.message,
    });
}
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // agar email diya hua hai
    if (email) {
      const meeting = await MeetingModel.findOne({
        "participants.email": email,
      });

      if (!meeting) {
        return NextResponse.json({
          success: false,
          message: "Meeting not found",
        });
      }

      return NextResponse.json({
        success: true,
        meeting,
      });
    }

    // agar email nahi hai to sab meetings
    const meetings = await MeetingModel.find();

    return NextResponse.json({
      success: true,
      meetings,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { userId,meetingId, name, email } = body;
    console.log("Join Meeting Payload:", { userId, meetingId, name, email });
    if(!meetingId || !name ){
        return NextResponse.json({
            success: false,
            message: "Missing required fields",
          });
    }

    const meeting = await MeetingModel.findOneAndUpdate(
      { meetingId },
      {
        $push: {
          participants: {
            userId : userId ,
            name,
            email :  email || " ",
            role: userId ? "participant" : "guest",
          },
        },
      },
      { new: true }
    );

    if (!meeting) {
      return NextResponse.json({
        success: false,
        message: "Meeting not found",
      });
    }

    return NextResponse.json({
      success: true,
      meeting,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
    });
  }
}