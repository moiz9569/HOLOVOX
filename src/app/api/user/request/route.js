import RequestModel from "@/app/models/Request";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await connectDB();
    const { senderId, receiverId } = await req.json();

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
    const requests = await RequestModel.find({
      receiver: userId,
    })
    .lean();
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