import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin","doctor","lawyer"],
      default: "user",
    },
    verified:{
      type: Boolean,
      default: false
    },
    image:{
      type: String, 
      default: "" // Default to empty string if no image is provided
    },
    status:{
      type: String,
      enum: ["filled", "unfilled","none"], 
      default: "none" // Default to empty string if no image is provided
    }
  },
  
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent model overwrite during hot reloads (for Next.js)
const AuthModel =
  mongoose.models.HolovoxUser || mongoose.model("HolovoxUser", UserSchema);

export default AuthModel;
