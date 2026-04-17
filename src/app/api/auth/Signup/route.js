import { NextResponse } from "next/server";
// import connectDB from "../../../../../lib/db";
import AuthModel from "@/app/models/User.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { connectDB } from "../../../../../lib/db";


// Cloudinary config
cloudinary.v2.config({
  cloud_name: "dfzattnt8",
  api_key: "329133647243299",
  api_secret: "XNz_V8eNvJVF-56u768ExGErlbA",
});

export async function POST(request) {
  try {
    const { name, email, password, role,image } =
      await request.json();
      console.log("Payload for create-account:", {
        name,
        email,
        role,
        image
      });

    // Connect to DB
    await connectDB();

    // Check if user already exists
    const existedUser = await AuthModel.findOne({ email: email.toLowerCase() });
    if (existedUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // If profilePicture is base64 and provided, upload it to Cloudinary
     let imageUrl = ""; // Default image if none uploaded
if (image) {
      try {
        const uploadedResponse = await cloudinary.v2.uploader.upload(
          image,
          {
            folder: "intivox_users_profile_pictures",
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
    // Hash password before saving
    const hashPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = await AuthModel.create({
      name,
      email: email.toLowerCase(),
      password: hashPassword,
      role: role || "user",
      verified : true,
      image: imageUrl
    });

    // Remove password field from response manually
    const userData = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      verified: newUser.verified,
      image: newUser.image || ""
    };

    // Generate JWT token
    const token = jwt.sign(
      {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        name: newUser?.name,
        verified : newUser?.verified,
        image: newUser?.image || ""
      },
      process.env.JWT_SECRET || "Holovox",
      { expiresIn: "1d" }
    );

    return NextResponse.json(
      { message: "User created successfully", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await connectDB();
     const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
     let users;
    if (userId) {
      const query = { _id: userId }; // or _id if you're using Mongo ID
       users = await AuthModel.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();
    }else{
       users = await AuthModel.find({}, "-password").sort({ createdAt: -1 }).lean();
    }
    
    return NextResponse.json(
      { users },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
