
import mongoose from "mongoose";

const BasicInfoSchema = new mongoose.Schema({
    userId : {
        type: mongoose.Schema.Types.ObjectId,
            ref: "HolovoxUser",
            index: true,
        default: null,
    },
    role : {
        type: String,
        enum : ["doctor","lawyer","other"],
        required: true
    },
    FullName : {
      type: String, // ⚡ IMPORTANT: string rakho (tumhara meetingId string hai)
        required: true,
        trim: true,
    },
    ProfilePicture : {
        type: String, // ⚡ IMPORTANT: string rakho (tumhara meetingId string hai)
       required: true
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
        enum: ["Male", "Female", "Other"],
        default: "Other"
    }
});
const ProfessionalInfoSchema = new mongoose.Schema(
  {
    BarRegistrationNumber : {
      type: String,
      unique: true
    },
    LawFirmName:{
        type: String,
    },
    Specialization : {
        type: String,
        required: true,
      enum: ["Orthopedic","Dentist","Pediatrician","Neurologist","Dermatologist","Cardiologist","General Physician","Criminal Law", "Civil Law", "Corporate Law", "Family Law", "Cyber Crime", "Property Law", "Intellectual Property Law", "Labor and Employment Law", "Tax Law", "Environmental Law", "Human Rights Law", "International Law", "Other"],
        default: "Other"
    },
    YearsOfExperience : {
        type: Number,
        required: true,
        min: 0,
    },
    MedicalLicenseNumber : {
        type : String,
        default : ""
    },
    Hospital_ClinicName  : {
        type : String,
        default : ""
    }
},
  {
    timestamps: true, // createdAt = message time
  }
);

const DegreeSchema = new mongoose.Schema({
  DegreeObtained: {
    type: String,
    required: true,
  },
  UniversityName: {
    type: String,
    required: true,
  },
  GraduationYear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear(),
  },
});
const EducationInfoSchema = new mongoose.Schema({
    LawSchoolAttended : {
        type: String,   
        default: ""
    },  
    Degree: {
    type: [DegreeSchema],   // 👈 ARRAY OF OBJECTS (correct way)
    required: true,
  },   
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
    },
    about : {
        type:String,
        required : true
    }

});


const InfoSchema = new mongoose.Schema(
  {
    basicInfo: BasicInfoSchema,
    professionalInfo: ProfessionalInfoSchema,
    educationInfo: EducationInfoSchema,
    availabilityInfo: AvailabilityInfoSchema,
  },
  {
    timestamps: true,
  }
);

// ⚡ Indexing for speed
InfoSchema.index({ "basicInfo.userId": 1 });
InfoSchema.index({ "basicInfo.role": 1, "professionalInfo.Specialization": 1, createdAt: -1 });


const InfoModel =
  mongoose.models.Info || mongoose.model("Info", InfoSchema);

export default InfoModel;