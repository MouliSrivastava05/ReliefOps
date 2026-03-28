import mongoose, { Schema, model, models } from "mongoose";

const ResourceSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ResourceModel =
  models.Resource ?? model("Resource", ResourceSchema);
