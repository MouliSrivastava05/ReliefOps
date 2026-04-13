import mongoose, { Schema, model, models } from "mongoose";

const RequestSchema = new Schema(
  {
    type: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    status: { type: String, default: "pending" },
    citizenId: { type: String },
    priority: { type: Number, default: 0 },
    description: { type: String },
  },
  { timestamps: true }
);

export const RequestModel = models.Request ?? model("Request", RequestSchema);
