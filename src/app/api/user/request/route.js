import RequestModel from "@/app/models/Request";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function POST(req) {
  try {
    await connectDB();
    const { senderId, receiverId,role } = await req.json();
    console.log("Received request data:", { senderId, receiverId, role });
    // check if already exists
    const existing = await RequestModel.findOne({
      sender: senderId,
      receiver: receiverId,
      
    }).lean();

    if (existing) {
      return NextResponse.json({ message: "Request already sent" });
    }

    const request = await RequestModel.create({
      sender: senderId,
      receiver: receiverId,
      role : role || "user",
    });

    return NextResponse.json(request);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role") ;
    console.log("Fetching requests for userId:", userId, "with role:", role);
    // const query = sent ? { sender: userId } : { receiver: userId };
    // const requests = await RequestModel.find(query)
    //   .populate('sender', 'name email image')
    //   .populate('receiver', 'name email image')
    //   .sort({ createdAt: -1 })
    //   .lean();
let requests;
    if (role === "doctor" || role === "lawyer") {
      requests = await RequestModel.find({ receiver: userId })
      .sort({ createdAt: -1 })
      .lean();

    }else{
      requests = await RequestModel.find({ sender: userId })
      .sort({ createdAt: -1 })
      .lean();
    }
    console.log("Fetched requests:", requests);
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message
      }
    );
  }
}
export async function PUT(req) {
  try {
    await connectDB();
    const { requestId, status } = await req.json();

    const updated = await RequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}