import mongoose, { Schema, model, models } from "mongoose";

const VolunteerSchema = new Schema(
  {
    userId: { type: String, required: true },
    skills: [{ type: String }],
  },
  { timestamps: true },
);

export const VolunteerModel =
  models.Volunteer ?? model("Volunteer", VolunteerSchema);
