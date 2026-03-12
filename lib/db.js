import mongoose from "mongoose";

let isConnected = false; // global variable to track connection

const connectDB = async () => {               
  if (isConnected) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(
      "mongodb+srv://SeemalKhan:IedNFYf6gK3ZbthA@emadcluster.nhb8az1.mongodb.net/AguaCoin?retryWrites=true&w=majority"
    );

    isConnected = true;

    console.log(
      `MongoDB connected !! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
