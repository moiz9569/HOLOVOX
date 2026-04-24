import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import PersonalMessageModel from "@/app/models/RequestMessages.model";
import RequestModel from "@/app/models/Request";
import { connectDB } from "../../../../../../lib/db";
import { log } from "three";


// Cloudinary config
cloudinary.v2.config({
  cloud_name: "dfzattnt8",
  api_key: "329133647243299",
  api_secret: "XNz_V8eNvJVF-56u768ExGErlbA",
});

// Helper function to check if there's an accepted request between two users
async function hasAcceptedRequest(senderId, receiverId) {
  const request = await RequestModel.findOne({
    $or: [
      { sender: senderId, receiver: receiverId },
      { sender: receiverId, receiver: senderId }
    ],
    status: "accepted"
  }).lean();

  return !!request;
}



export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const sender = formData.get("senderId");
    const receiver = formData.get("receiverId");

    let text = formData.get("text");
    const file = formData.get("file");
    console.log("file:", file);
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

    // Check if there's an accepted request between these users
    const hasAccepted = await hasAcceptedRequest(sender, receiver);
    if (!hasAccepted) {
      return NextResponse.json(
        { error: "Cannot send messages without an accepted request" },
        { status: 403 }
      );
    }

    let fileUrl = "";
    let fileType = "";
    let fileName = "";
    let filePublicId = "";
    let fileResourceType = "";
    let fileFormat = "";

    // 📎 Upload File to Cloudinary
    if (file) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      fileName = file.name || "document";

      // Determine if it's an image, video, or document
      const mimeType = file.type || "";
      let detectedType = "document"; // default
      
      if (mimeType.startsWith("image/")) detectedType = "image";
      else if (mimeType.startsWith("video/")) detectedType = "video";

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "chat_files",
              resource_type: "auto",
              original_filename: fileName,
              access_mode: "public", // Make files publicly accessible
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      fileUrl = uploadResult.secure_url;
      const fileResourceType = uploadResult.resource_type || (detectedType === "image" ? "image" : detectedType === "video" ? "video" : "raw");
      const filePublicId = uploadResult.public_id;
      const fileFormat = uploadResult.format || "";
      const normalizedFileName = fileName.includes('.') ? fileName : `${fileName}${fileFormat ? `.${fileFormat}` : ""}`;
      fileName = normalizedFileName;

      // Use our detected type or fallback to cloudinary's resource_type
      fileType = detectedType || uploadResult.resource_type || "document";

      console.log("File uploaded:", { fileUrl, fileType, fileName, filePublicId, fileResourceType, fileFormat });
      // agar sirf file hai (text nahi)
      if (!text) text = "";
    }

    // 💾 Save in DB
    const messageData = {
      sender,
      receiver,
      text,
      fileUrl,
      fileType,
      fileName,
      filePublicId,
      fileResourceType,
      fileFormat,
    };

    console.log("Saving message to DB:", messageData);

    const message = await PersonalMessageModel.create(messageData);
    
    console.log("Message saved:", { _id: message._id, fileUrl: message.fileUrl, fileType: message.fileType, fileName: message.fileName });

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

    // Check if there's an accepted request between these users
    const hasAccepted = await hasAcceptedRequest(senderId, receiverId);
    if (!hasAccepted) {
      return NextResponse.json(
        { error: "Cannot fetch messages without an accepted request" },
        { status: 403 }
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