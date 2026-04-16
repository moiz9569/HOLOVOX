import mongoose from "mongoose";

const NotesSchema = new mongoose.Schema(
  {
    // 🔗 kis meeting ka message hai
    meetingId: {
      type: String, // ⚡ IMPORTANT: string rakho (tumhara meetingId string hai)
      required: true,
      index: true,
    },

    // 👤 kis user ne bheja
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HolovoxUser",
      required: true,
    },

    Notes: {
     type: String, // array of strings
    required : true// default to empty array,
},
    disable : {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true, // createdAt = message time
  }
);

// ⚡ FAST loading (chat history)
NotesSchema.index({ meetingId: 1, createdAt: -1 });

const NotesModel =
  mongoose.models.Notes || mongoose.model("Notes", NotesSchema);

export default NotesModel;