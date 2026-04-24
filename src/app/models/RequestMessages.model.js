import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  text: String,

  fileUrl: String,   // image ya file
  fileType: String,  // image / pdf / doc
  fileName: String,  // original filename
  filePublicId: String,
  fileResourceType: String,
  fileFormat: String,

  seen: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const PersonalMessageModel =
  mongoose.models.PersonalMessage || mongoose.model("PersonalMessage", messageSchema);

export default PersonalMessageModel;