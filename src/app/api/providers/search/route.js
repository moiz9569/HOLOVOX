import { NextResponse } from "next/server";
import InfoModel from "@/app/models/info.model";
import { connectDB } from "../../../../../lib/db";

const DEFAULT_LIMIT = 12;

const normalize = (value = "") => value.trim().toLowerCase();

const getAllowedCategories = (role) => {
  if (role === "doctor") {
    return [
      "General Physician",
      "Cardiologist",
      "Dermatologist",
      "Neurologist",
      "Dentist",
      "Orthopedic",
    ];
  }

  if (role === "lawyer") {
    return [
      "Criminal Law",
      "Family Law",
      "Corporate Law",
      "Civil Law",
      "Cyber Crime",
      "Property Law",
    ];
  }

  return [];
};

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const role = normalize(searchParams.get("role"));
    const categoryInput = (searchParams.get("category") || "").trim();
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || `${DEFAULT_LIMIT}`, 10), 1),
      50,
    );

    if (!role || !categoryInput) {
      return NextResponse.json(
        { success: false, message: "role and category are required" },
        { status: 400 },
      );
    }

    if (role !== "doctor" && role !== "lawyer") {
      return NextResponse.json(
        { success: false, message: "Only doctor and lawyer are supported" },
        { status: 400 },
      );
    }

    const allowedCategories = getAllowedCategories(role);
    const selectedCategory = allowedCategories.find(
      (item) => normalize(item) === normalize(categoryInput),
    );

    if (!selectedCategory) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid category for selected role",
          allowedCategories,
        },
        { status: 400 },
      );
    }

    const query = {
      "basicInfo.role": role,
      "professionalInfo.Specialization": selectedCategory,
    };

    const skip = (page - 1) * limit;

    const [providers, total] = await Promise.all([
      InfoModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      InfoModel.countDocuments(query),
    ]);

    const mapped = providers.map((item) => ({
      id: item._id.toString(),
      name: item?.basicInfo?.FullName || "Unknown",
      image: item?.basicInfo?.ProfilePicture || "",
      role: item?.basicInfo?.role || role,
      specialization: item?.professionalInfo?.Specialization || selectedCategory,
      specialties: item?.professionalInfo?.Specialization
        ? [item.professionalInfo.Specialization]
        : [],
      experience: item?.professionalInfo?.YearsOfExperience || 0,
      consultationFee: item?.availabilityInfo?.ConsultationFee || 0,
      about: item?.availabilityInfo?.about || "",
      location: item?.basicInfo?.City || "",
      availableDays: item?.availabilityInfo?.AvailableDays || [],
      availableSlot: item?.availabilityInfo?.AvailableTimeSlots?.[0] || "",
      address: item?.basicInfo?.City || "",
      rating: 4.7,
      reviews: 0,
      satisfaction: "98% Patient Satisfaction",
      patients: "500+",
    }));

    return NextResponse.json({
      success: true,
      data: mapped,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
