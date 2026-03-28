import mongoose, { Schema, model, models } from "mongoose";

const AllocationSchema = new Schema(
  {
    requestId: { type: String, required: true },
    resourceId: { type: String, required: true },
  },
  { timestamps: true },
);

export const AllocationModel =
  models.Allocation ?? model("Allocation", AllocationSchema);
