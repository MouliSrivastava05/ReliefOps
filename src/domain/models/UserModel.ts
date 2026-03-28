import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true },
);

export const UserModel = models.User ?? model("User", UserSchema);
