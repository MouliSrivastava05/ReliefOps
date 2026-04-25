import mongoose, { Schema, model, models } from "mongoose";

const VolunteerApplicationSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    name: { type: String, default: "" },
    skills: [{ type: String }],
    message: { type: String, default: "" },
    // "pending" → waiting for admin; "approved" → active; "rejected" → denied
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true },
);

export const VolunteerApplicationModel =
  models.VolunteerApplication ??
  model("VolunteerApplication", VolunteerApplicationSchema);
