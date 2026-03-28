import mongoose, { Schema, model, models } from "mongoose";

const RequestSchema = new Schema(
  {
    citizenId: { type: String, required: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

export const RequestModel = models.Request ?? model("Request", RequestSchema);
