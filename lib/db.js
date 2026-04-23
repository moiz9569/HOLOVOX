import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://SeemalKhan:IedNFYf6gK3ZbthA@emadcluster.nhb8az1.mongodb.net/Holovox?retryWrites=true&w=majority";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 50,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

global.mongoose = cached;