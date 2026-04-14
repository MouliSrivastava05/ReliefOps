import mongoose, { Schema, model, models } from "mongoose";

const RequestSchema = new Schema(
  {
    citizenId: { type: String, required: true, index: true },
    type: { type: String, required: true },
    status: { type: String, required: true, index: true },
    severity: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, default: "" },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    locationKey: { type: String, default: "", index: true },
    duplicateOf: { type: Schema.Types.ObjectId, ref: "Request", default: null },
    isResourceRequest: { type: Boolean, default: false },
    unitsNeeded: { type: Number, default: 0 },
  },
  { timestamps: true },
);

RequestSchema.index({ citizenId: 1, type: 1, locationKey: 1, createdAt: -1 });

export const RequestModel = models.Request ?? model("Request", RequestSchema);
