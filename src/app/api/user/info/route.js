import { NextResponse } from "next/server";
// import connectDB from "../../../../../lib/db";
import MeetingModel from "@/app/models/Meeting.model";
import { connectDB } from "../../../../../lib/db";
import { v4 as uuidv4 } from "uuid"
import InfoModel from "@/app/models/info.model";
import cloudinary from "cloudinary";

// Cloudinary config
cloudinary.v2.config({
  cloud_name: "dfzattnt8",
  api_key: "329133647243299",
  api_secret: "XNz_V8eNvJVF-56u768ExGErlbA",
});
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    console.log("Create Info Payload:", body);

    const {
      basicInfo,
      professionalInfo,
      educationInfo,
      availabilityInfo,
    } = body;

    // =========================
    // 🔥 VALIDATION SECTION
    // =========================

    if (!basicInfo) {
      return NextResponse.json(
        { success: false, message: "basicInfo is required" },
        { status: 400 }
      );
    }

    const {
      userId,
      role,
      FullName,
      ProfilePicture,
      PhoneNumber,
      City,
      Gender,
    } = basicInfo;

    if (!role || !FullName || !ProfilePicture || !PhoneNumber || !City) {
      return NextResponse.json(
        { success: false, message: "Missing required fields in basicInfo" },
        { status: 400 }
      );
    }
 let imageUrl = ""; // Default image if none uploaded
if (ProfilePicture) {
      try {
        const uploadedResponse = await cloudinary.v2.uploader.upload(
          ProfilePicture,
          {
            folder: "intivox_profile_pictures",
            transformation: [
              { width: 1024, height: 1024, crop: "limit" }, // Resize to max 1024px
              { quality: "auto", fetch_format: "auto" }, // Compress and auto format
            ],
          }
        );
        imageUrl = uploadedResponse.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload error:", cloudinaryError);
        return NextResponse.json(
          {
            error:
              "Image upload failed. Please use an image smaller than 10MB and in a supported format (JPG, PNG, etc).",
          },
          { status: 400 }
        );
      }
    }
    if (!professionalInfo) {
      return NextResponse.json(
        { success: false, message: "professionalInfo is required" },
        { status: 400 }
      );
    }


    const {
      BarRegistrationNumber,
      LawFirmName,
      Specialization,
      YearsOfExperience,
    } = professionalInfo;

    if (
      
      !Specialization ||
      !YearsOfExperience 
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields in professionalInfo",
        },
        { status: 400 }
      );
    }

    if (!educationInfo) {
      return NextResponse.json(
        { success: false, message: "educationInfo is required" },
        { status: 400 }
      );
    }

    const { LawSchoolAttended, Degree } = educationInfo;

    if ( !Degree || !Array.isArray(Degree)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing or invalid fields in educationInfo (Degree must be array)",
        },
        { status: 400 }
      );
    }

    if (!availabilityInfo) {
      return NextResponse.json(
        { success: false, message: "availabilityInfo is required" },
        { status: 400 }
      );
    }

    const {
      AvailableDays,
      AvailableTimeSlots,
      ConsultationFee,
      about,
    } = availabilityInfo;

    if (
      !AvailableDays ||
      !AvailableTimeSlots ||
      ConsultationFee === undefined ||
      !about
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields in availabilityInfo",
        },
        { status: 400 }
      );
    }

    // =========================
    // 🔥 CREATE DB ENTRY
    // =========================

    const newInfo = await InfoModel.create({
      basicInfo: {
        userId,
        role,
        FullName,
        ProfilePicture : imageUrl,
        PhoneNumber,
        City,
        Gender,
      },
      professionalInfo: {
        Specialization,
        YearsOfExperience,
      },
      educationInfo,
      availabilityInfo,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Info created successfully",
        data: newInfo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "userId is required",
        },
        { status: 400 }
      );
    }

    const profile = await InfoModel.findOne({
      "basicInfo.userId": userId,
    }).lean();

    if (!profile) {
      return NextResponse.json(
        {
          success: false,
          message: "Profile not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: profile,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("GET API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
export async function PUT(req) {
  try {
    await connectDB();

    const body = await req.json();

    const { userId,meetingId, name, email } = body;
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
            userId : userId || uuidv4(),
            name,
            email : email || "",
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