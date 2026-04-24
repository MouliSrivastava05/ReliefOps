import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    passwordHash: { type: String, required: true },
    name: { type: String, default: "" },
    // "active" for all roles by default; "pending" for volunteers awaiting admin approval
    status: { type: String, default: "active", index: true },
  },
  { timestamps: true },
);

export const UserModel = models.User ?? model("User", UserSchema);

