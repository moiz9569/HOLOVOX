import RequestModel from "@/app/models/Request";
import AuthModel from "@/app/models/User.model";
import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";

export async function POST(req) {
  try {
    console.log("POST function called");
    await connectDB();
    console.log("Database connected");

    const body = await req.json();
    console.log("Request body:", body);

    const { senderId, receiverId, role } = body;
    console.log("Parsed data:", { senderId, receiverId, role });

    // Validate required fields
    if (!senderId || !receiverId) {
      console.log("Missing required fields");
      return NextResponse.json({ error: "Sender and receiver IDs are required" }, { status: 400 });
    }

    // Prevent self-requests
    if (senderId === receiverId) {
      console.log("Self-request detected");
      return NextResponse.json({ error: "Cannot send request to yourself" }, { status: 400 });
    }

    console.log("Validating users...");
    // Validate sender and receiver exist and have correct roles
    const sender = await AuthModel.findById(senderId).lean();
    const receiver = await AuthModel.findById(receiverId).lean();

    console.log("Sender found:", !!sender, "Receiver found:", !!receiver);

    if (!sender) {
      return NextResponse.json({ error: "Sender not found" }, { status: 404 });
    }

    if (!receiver) {
      return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
    }

    // Anyone can send requests, but only doctors and lawyers can receive requests
    if (!["doctor", "lawyer"].includes(receiver.role)) {
      console.log("Invalid receiver role:", receiver.role);
      return NextResponse.json({ error: "Can only send requests to doctors or lawyers" }, { status: 400 });
    }

    console.log("Checking for existing requests...");
    // Check if request already exists (in any direction)
    const existing = await RequestModel.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId }
      ]
    }).lean();

    console.log("Existing request found:", !!existing);

    if (existing) {
      return NextResponse.json({ message: "Request already exists" }, { status: 409 });
    }

    console.log("Creating request...");
    const request = await RequestModel.create({
      sender: senderId,
      receiver: receiverId,
      role: receiver.role, // Use receiver's role for the request
    });

    console.log("Request created successfully:", request._id);
    return NextResponse.json(request);
  } catch (error) {
    console.error("POST error:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");
    console.log("Fetching requests for userId:", userId, "with role:", role);

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    let requests;
    if (role === "doctor" || role === "lawyer") {
      // Providers see both incoming and outgoing requests
      requests = await RequestModel.find({
        $or: [
          { sender: userId },
          { receiver: userId }
        ]
      })
        .populate('sender', 'name email image role')
        .populate('receiver', 'name email image role')
        .sort({ createdAt: -1 })
        .lean();
    } else {
      // Users see outgoing requests (they are senders)
      requests = await RequestModel.find({ sender: userId })
        .populate('sender', 'name email image role')
        .populate('receiver', 'name email image role')
        .sort({ createdAt: -1 })
        .lean();
    }

    console.log("Fetched requests:", requests.length);
    return NextResponse.json(requests);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(req) {
  try {
    await connectDB();
    const { requestId, status, userId } = await req.json();

    if (!requestId || !status || !userId) {
      return NextResponse.json({ error: "requestId, status, and userId are required" }, { status: 400 });
    }

    // Validate status values
    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be 'accepted' or 'rejected'" }, { status: 400 });
    }

    // Find the request
    const request = await RequestModel.findById(requestId).populate('receiver', 'role');
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Only the receiver (provider) can accept/reject
    if (request.receiver._id.toString() !== userId) {
      return NextResponse.json({ error: "Only the request receiver can update status" }, { status: 403 });
    }

    // Only providers can accept/reject
    if (!["doctor", "lawyer"].includes(request.receiver.role)) {
      return NextResponse.json({ error: "Only doctors and lawyers can accept/reject requests" }, { status: 403 });
    }

    // Can only update pending requests
    if (request.status !== "pending") {
      return NextResponse.json({ error: "Can only update pending requests" }, { status: 400 });
    }

    const updated = await RequestModel.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    ).populate('sender', 'name email image role')
     .populate('receiver', 'name email image role');

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}