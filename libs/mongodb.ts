// import { MongoClient } from "mongodb";

// const uri = process.env.MONGODB_URI;
// const options = {};

// let client;
// let clientPromise;

// if (!process.env.MONGODB_URI) {
//   throw new Error("Please add your MongoDB URI to .env.local");
// }

// if (process.env.NODE_ENV === "development") {
//   if (!global._mongoClientPromise) {
//     client = new MongoClient(uri, options);
//     global._mongoClientPromise = client.connect();
//   }
//   clientPromise = global._mongoClientPromise;
// } else {
//   client = new MongoClient(uri, options);
//   clientPromise = client.connect();
// }

// export default clientPromise;

//////////////////////////////////////////////////////////////////////////////////////////////////
// import mongoose from "mongoose";
// declare global {
//   var mongoose: any; // This must be a `var` and not a `let / const`
// }

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error("Please add your MongoDB URI to .env.local");
// }

// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }

// async function connectViaMongoose() {
//   if (cached.conn) {
//     return cached.conn;
//   }
//   if (!cached.promise) {
//     const opts = {
//       bufferCommands: false,
//     };
//     cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
//       console.log("DB connected");
//       return mongoose;
//     });
//   }
//   try {
//     cached.conn = await cached.promise;
//   } catch (e) {
//     cached.promise = null;
//     throw e;
//   }

//   return cached.conn;
// }

// export default connectViaMongoose;

import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("connected to Database");
  } catch (error) {
    console.error(error);
  }
};

export default connectMongoDB;
