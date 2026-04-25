import { Schema, model, models } from "mongoose";

const VolunteerInterestSchema = new Schema(
  {
    volunteerId: { type: String, required: true, index: true },
    volunteerEmail: { type: String, required: true },
    requestId: { type: String, required: true, index: true },
    requestType: { type: String, default: "" },
    requestDescription: { type: String, default: "" },
    requestSeverity: { type: Number, default: 1 },
    // "open" = raised hand; "assigned" = admin assigned; "closed" = done
    status: {
      type: String,
      enum: ["open", "assigned", "closed"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true },
);

// Prevent a volunteer from raising hand twice for the same request
VolunteerInterestSchema.index({ volunteerId: 1, requestId: 1 }, { unique: true });

export const VolunteerInterestModel =
  models.VolunteerInterest ?? model("VolunteerInterest", VolunteerInterestSchema);
