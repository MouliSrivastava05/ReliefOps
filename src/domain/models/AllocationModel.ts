import mongoose, { Schema, model, models } from "mongoose";

const AllocationSchema = new Schema(
  {
    requestId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true },
    strategy: { type: String, required: true },
    volunteerId: { type: String, default: "" },
  },
  { timestamps: true },
);

AllocationSchema.index({ requestId: 1, resourceId: 1 }, { unique: true });

export const AllocationModel =
  models.Allocation ?? model("Allocation", AllocationSchema);
