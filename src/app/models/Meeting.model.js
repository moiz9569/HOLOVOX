import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HolovoxUser",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: 2,
      maxlength: 100,
    },
    meetingId: {
      type: String,
        required: [true, "Meeting ID is required"],
        trim: true,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Prevent model overwrite during hot reloads (for Next.js)
const UserModel =
  mongoose.models.HolovoxUser || mongoose.model("HolovoxUser", UserSchema);

export default UserModel;
