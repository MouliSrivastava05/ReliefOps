import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, required: true },
    status: { type: String, default: "active" },
    motivation: { type: String },
  },
  { timestamps: true },
);

export const UserModel = models.User ?? model("User", UserSchema);
