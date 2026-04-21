
import mongoose from "mongoose";

const BasicInfoSchema = new mongoose.Schema({
    FullName : {
      type: String, // ⚡ IMPORTANT: string rakho (tumhara meetingId string hai)
        required: true,
        trim: true,
    },
    ProfilePicture : {
        type: String, // ⚡ IMPORTANT: string rakho (tumhara meetingId string hai)
        default: "" // Default to empty string if no image is provided
    },
    PhoneNumber : {
        type: String, // array of strings
        required : true// default to empty array,
    },
    City : {
        type: String,
        required : true,
    },
    Gender :{
        type: String,
        enum
        : ["Male", "        Female", "Other"],
        default: "Other"
    }
});
const ProfessionalInfoSchema = new mongoose.Schema(
  {
    BarRegistrationNumber : {
      type: String,
      required: true,
      unique: true
    },
    LawFirmName:{
        type: String,
        required: true,
    },
    Specialization : {
        type: String,
        required: true,
        enum: ["Criminal Law", "Civil Law", "Corporate Law", "Family Law", "Intellectual Property Law", "Labor and Employment Law", "Tax Law", "Environmental Law", "Human Rights Law", "International Law", "Other"],
        default: "Other"
    },
    YearsOfExperience : {
        type: Number,
        required: true,
        min: 0,
    }},
  {
    timestamps: true, // createdAt = message time
  }
);

const EducationInfoSchema = new mongoose.Schema({
    LawSchoolAttended : {
        type: String,   
        required: true,
    },  
    DegreeObtained : {
        type: String,
        required: true,
    },
    UniversityName : {
        type: String,
        required: true,
    },
    GraduationYear : {
        type: Number,
        required: true,
        min: 1900,
        max: new Date().getFullYear(),
    }
});
const AvailabilityInfoSchema = new mongoose.Schema({
    AvailableDays : {
        type: [String], // Array of strings to represent available days
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    AvailableTimeSlots : {
        type: [String], // Array of strings to represent available time slots
        required: true,
    },
    ConsultationFee :{
        type: Number,
        required: true,
        min: 0,
    }
});

// ⚡ FAST loading (chat history)
// InfoSchema.index({ meetingId: 1, userId : 1 ,createdAt: -1 });

const InfoModel =
  mongoose.models.Info || mongoose.model("Info", InfoSchema);

export default InfoModel;