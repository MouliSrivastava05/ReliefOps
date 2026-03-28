import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

export async function connectMongo(): Promise<void> {
  if (!uri) return;
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(uri);
}
