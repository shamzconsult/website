import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    image: { type: String },
    gallery: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    title: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const UpcomingEvent =
  mongoose.models.UpcomingEvent || mongoose.model("UpcomingEvent", eventSchema);

export default UpcomingEvent;
