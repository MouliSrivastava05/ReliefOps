import mongoose, { Schema, model, models } from "mongoose";

const VolunteerSchema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    skills: [{ type: String }],
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const VolunteerModel =
  models.Volunteer ?? model("Volunteer", VolunteerSchema);
