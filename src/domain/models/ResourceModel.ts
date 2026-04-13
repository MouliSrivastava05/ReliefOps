import mongoose, { Schema, model, models } from "mongoose";

const ResourceSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    quantityAvailable: { type: Number, default: 1 },
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    shelterTag: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ResourceModel =
  models.Resource ?? model("Resource", ResourceSchema);
