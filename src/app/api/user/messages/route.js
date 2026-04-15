import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import MessageModel from "@/app/models/meetingMessages.model";
import cloudinary from "cloudinary";


// Cloudinary config
cloudinary.v2.config({
  cloud_name: "dfyvwloys",
  api_key: "923835526253933",
  api_secret: "JeNHRhqCYIfpkgu9hVcjwgf3P4A",
});

// export async function POST(req) {
//   try {
//     await connectDB();

//     const { meetingId, senderId, senderName, type, content, file } =
//       await req.json();

//     if (!meetingId || !senderId || !type ) {
//       return NextResponse.json(
//         { error: "Missing fields" },
//         { status: 400 }
//       );
//     }
//     // ⚡ must have either text or file
// if (!content && !file) {
//   return NextResponse.json(
//     { error: "Message cannot be empty" },
//     { status: 400 }
//   );
// }
//     let fileUrl = "";

// if (file) {
//   try {
//     const uploadedResponse = await cloudinary.v2.uploader.upload(file, {
//       folder: "meeting_files",

//       // 🔥 IMPORTANT: auto detect file type
//       resource_type: "auto",

//       // ⚡ optional optimizations (only for images apply hota)
//       transformation: [
//         { quality: "auto", fetch_format: "auto" },
//       ],
//     });

//     content = uploadedResponse.secure_url;
//   } catch (err) {
//     console.error("Cloudinary upload error:", err);

//     return NextResponse.json(
//       {
//         error: "File upload failed (image/pdf/docx supported)",
//       },
//       { status: 400 }
//     );
//   }
// }

//     const message = await MessageModel.create({
//       meetingId,
//       senderId,
//       senderName,
//       type,
//       content : content,
//     });

//     return NextResponse.json({ message }, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Server error" },
//       { status: 500 }
//     );
//   }
// }
export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const meetingId = formData.get("meetingId");
    const senderId = formData.get("senderId");
    const senderName = formData.get("senderName");
    const type = formData.get("type");

    let content = formData.get("content"); // text
    const file = formData.get("file"); // actual file

    if (!meetingId || !senderId || !type) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    // ⚡ must have something
    if (!content && !file) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    let fileUrl = "";

    // 📎 file upload
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      fileUrl = await new Promise((resolve, reject) => {
        cloudinary.v2.uploader
          .upload_stream(
            {
              folder: "meeting_files",
              resource_type: "auto",
              quality: "auto",
            },
            (err, result) => {
              if (err) reject(err);
              else resolve(result.secure_url);
            }
          )
          .end(buffer);
      });

      content = fileUrl; // override
    }

    const message = await MessageModel.create({
      meetingId,
      senderId,
      senderName,
      type,
      content,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error(error);
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

    const meetingId = searchParams.get("meetingId");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = 20;

    if (!meetingId) {
      return NextResponse.json(
        { error: "meetingId required" },
        { status: 400 }
      );
    }

    const messages = await MessageModel.find({ meetingId })
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();

    const { messageId, content } = await req.json();

    if (!messageId || !content) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // optional: only text editable
    if (message.type !== "text") {
      return NextResponse.json(
        { error: "Only text messages can be edited" },
        { status: 400 }
      );
    }

    message.content = content;
    await message.save();

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}



export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { error: "messageId required" },
        { status: 400 }
      );
    }

    const message = await MessageModel.findById(messageId);

    if (!message) {
      return NextResponse.json(
        { error: "Message not found" },
        { status: 404 }
      );
    }

    // 🔥 Soft delete
    // message.content = "This message was deleted";
    message.disable = true;
    await message.save();

    return NextResponse.json(
      { message: "Deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}