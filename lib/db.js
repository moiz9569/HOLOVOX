// import mongoose from "mongoose";

// const MONGODB_URI = "mongodb+srv://SeemalKhan:IedNFYf6gK3ZbthA@emadcluster.nhb8az1.mongodb.net/Holovox?retryWrites=true&w=majority";

// if (!MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI");
// }

// // global cache for Next.js hot reload
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };

//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log("MongoDB connected successfully");
//       return mongoose;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectDB;

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
      maxPoolSize: 50, // 🔥 important
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

global.mongoose = cached;