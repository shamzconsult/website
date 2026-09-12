import mongoose, { Schema } from "mongoose";

const testimonySchema = new Schema(
  {
    image: { type: String },
    testimony: { type: String },
    name: { type: String },
    companyName: { type: String },
    companyTitle: { type: String },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Testimonials =
  mongoose.models.Testimonials ||
  mongoose.model("Testimonials", testimonySchema);

export default Testimonials;
