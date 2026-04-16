// =======================
// 🚀 POST API (UPLOAD)

import { NextResponse } from "next/server";
import connectDB from "../../../../../lib/db";
import RecordingModel from "@/app/models/Recording.model";
import cloudinary from "cloudinary";


// Cloudinary config
cloudinary.v2.config({
  cloud_name: "dfzattnt8",
  api_key: "329133647243299",
  api_secret: "XNz_V8eNvJVF-56u768ExGErlbA",
});
// =======================
// export async function POST(req) {
//   try {
//     await connectDB();

//     const formData = await req.formData();

//     const file = formData.get("file");
//     const meetingId = formData.get("meetingId");
//     const userId = formData.get("userId");
//     console.log("Received upload request:", { meetingId, userId, fileName: file?.name });
//     if (!file) {
//       return NextResponse.json(
//         { success: false, message: "No file uploaded" },
//         { status: 400 }
//       );
//     }

//     // 📁 convert file
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//   // 🔥 Cloudinary upload (video)
//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         {
//           resource_type: "video",
//           folder: "recordings",
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(buffer);
//     });
//       const newRecording = await RecordingModel.create({
//       meetingId,
//       userId,
//       videoUrl: uploadResult.secure_url,
//       publicId: uploadResult.public_id, // 🔥 delete ke liye important
//     });
//     // // 📁 file save
//     // const fileName = `recording-${Date.now()}.webm`;
//     // const filePath = path.join(
//     //   process.cwd(),
//     //   "public/recordings",
//     //   fileName
//     // );

//     // 👉 folder create (agar na ho)
//     // fs.mkdirSync(path.join(process.cwd(), "public/recordings"), {
//     //   recursive: true,
//     // });

//     // fs.writeFileSync(filePath, buffer);

//     // const videoUrl = `/recordings/${fileName}`;

    

//     return NextResponse.json({
//       success: true,
//       data: newRecording,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { meetingId, userId, videoUrl, publicId } = body;

    // ✅ validation
    if (!meetingId || !userId || !videoUrl) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // ✅ save in DB
    const newRecording = await RecordingModel.create({
      meetingId,
      userId,
      videoUrl,
      publicId,
    });

    return NextResponse.json({
      success: true,
      data: newRecording,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    // let recordings;
    // if(userId){
    //      recordings = await RecordingModel.find({userId}).sort({
    //       createdAt: -1,
    //     }).lean();
    // }else{
    //       recordings = await RecordingModel.find({}).sort({
    //       createdAt: -1,
    //     }).lean();
    // }
    const recordings = await RecordingModel.find(
      userId ? { userId } : {}
    )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: recordings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const recordingId = searchParams.get("recordingId");
    if (!recordingId) {
        return NextResponse.json(
            { success: false, message: "recordingId is required" },
            { status: 400 }
        );
    }
    const recording = await RecordingModel.findById(recordingId);
    if (!recording) {
        return NextResponse.json(
            { success: false, message: "Recording not found" },
            { status: 404 }
        );
    }
    // // 🗑️ delete file from storage
    // fs.unlinkSync(path.join(process.cwd(), recording.videoUrl));
    // // 🗑️ delete from DB
    // await RecordingModel.findByIdAndDelete(recordingId);

     // ☁️ delete from cloudinary
    if (recording.publicId) {
      await cloudinary.uploader.destroy(recording.publicId, {
        resource_type: "video",
      });
    }
     // 🗑️ delete from DB
    await RecordingModel.findByIdAndDelete(recordingId);
    return NextResponse.json({
        success: true,
        message: "Recording deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}