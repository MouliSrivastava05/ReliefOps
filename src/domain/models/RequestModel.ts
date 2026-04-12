import mongoose, { Schema, model, models } from "mongoose";

const ResourceSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true, index: true },
    quantityAvailable: { type: Number, required: true, min: 0, default: 1 },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    shelterTag: { type: String, default: "" },
  },
  { timestamps: true },
);

export const ResourceModel =
  models.Resource ?? model("Resource", ResourceSchema);
