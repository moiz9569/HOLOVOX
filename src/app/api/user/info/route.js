import { NextResponse } from "next/server";
// import connectDB from "../../../../../lib/db";
import MeetingModel from "@/app/models/Meeting.model";
import { connectDB } from "../../../../../lib/db";
import { v4 as uuidv4 } from "uuid"
import InfoModel from "@/app/models/info.model";

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
      !BarRegistrationNumber ||
      !LawFirmName ||
      !Specialization ||
      YearsOfExperience === undefined
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

    if (!LawSchoolAttended || !Degree || !Array.isArray(Degree)) {
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
        ProfilePicture,
        PhoneNumber,
        City,
        Gender,
      },
      professionalInfo: {
        BarRegistrationNumber,
        LawFirmName,
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

    // =========================
    // 🔥 IF EMAIL PROVIDED
    // =========================
    if (userId) {
      const meeting = await MeetingModel.findOne({
        "basicInfo.userId": userId,
      }).lean(); // ⚡ FAST

      if (!meeting) {
        return NextResponse.json(
          {
            success: false,
            message: "Meeting not found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          meeting,
        },
        { status: 200 }
      );
    }
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