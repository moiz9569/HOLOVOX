import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import PersonalMessageModel from "@/app/models/RequestMessages.model";
import { connectDB } from "../../../../../../lib/db";


// Cloudinary config
cloudinary.v2.config({
  cloud_name: "dfzattnt8",
  api_key: "329133647243299",
  api_secret: "XNz_V8eNvJVF-56u768ExGErlbA",
});



export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const sender = formData.get("senderId");
    const receiver = formData.get("receiverId");

    let text = formData.get("text"); // ✅ model ke mutabiq
    const file = formData.get("file");

    // ❗ Validation
    if (!sender || !receiver) {
      return NextResponse.json(
        { error: "Sender and Receiver required" },
        { status: 400 }
      );
    }

    if (!text && !file) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    let fileUrl = "";
    let fileType = "";

    // 📎 Upload File to Cloudinary
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "chat_files",
              resource_type: "auto",
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      fileUrl = uploadResult.secure_url;
      fileType = uploadResult.resource_type;

      // agar sirf file hai (text nahi)
      if (!text) text = "";
    }

    // 💾 Save in DB
    const message = await PersonalMessageModel.create({
      sender,
      receiver,
      text,
      fileUrl,
      fileType,
    });

    return NextResponse.json({ message }, { status: 201 });

  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const senderId = searchParams.get("senderId");
    const receiverId = searchParams.get("receiverId");

    // ❗ Validation
    if (!senderId || !receiverId) {
      return NextResponse.json(
        { error: "senderId and receiverId required" },
        { status: 400 }
      );
    }

    // 💬 Fetch messages (both directions)
    const messages = await PersonalMessageModel.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: 1 }); // old → new

    return NextResponse.json({ messages }, { status: 200 });

  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const { messageId, userId } = await req.json();

    // ❗ Validation
    if (!messageId || !userId) {
      return NextResponse.json(
        { error: "messageId and userId required" },
        { status: 400 }
      );
    }

    // 🔍 Find message
    const message = await PersonalMessageModel.findById(messageId);

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // 🔐 Ownership check
    if (message.sender.toString() !== userId) {
      return NextResponse.json(
        { error: "You can only delete your own message" },
        { status: 403 }
      );
    }

    // 🗑️ Delete message
    await PersonalMessageModel.findByIdAndDelete(messageId);

    return NextResponse.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}