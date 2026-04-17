import mongoose from "mongoose";

const ParticipantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HolovoxUser",
    index: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ["host", "participant"],
    default: "participant",
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

const MeetingSchema = new mongoose.Schema(
  {
    meetingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    hostId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HolovoxUser",
      required: true,
        index: true,
    },
    meetingTitle: {
      type: String,
      default: "Untitled Meeting",
    },
    meetingDate : {
      type: Date,
      default: Date.now,
    },  
    time:{
      type: String,
      default: "00:00",
    },
    upcoming:{
      type: Boolean,
      default: false,
      index: true,
    },

    participants: [ParticipantSchema], // host + clients
  },
  {
    timestamps: true,
  }
);
MeetingSchema.index({ hostId : 1 ,upcoming: -1 });
const MeetingModel =
  mongoose.models.Meeting || mongoose.model("Meeting", MeetingSchema);

export default MeetingModel;