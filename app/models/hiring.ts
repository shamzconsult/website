import mongoose, { Schema } from "mongoose";

const ALLOWED_TYPE = ["Fulltime", "Part-time", "Contract"];
const ALLOWED_MODE = ["Remote", "Physical", "Hybrid"];

const hiringSchema = new Schema(
  {
    title: { type: String },
    type: { type: String, enum: ALLOWED_TYPE, default: null },
    mode: { type: String, enum: ALLOWED_MODE, default: null },
    location: { type: String },
    closing: {type: String, required: true},
    isActive: { type: Boolean, default: true },
    formId: { type: String, required: true },
    isDeleted:{type: Boolean, default: false},
  },
  {
    timestamps: true,
  }
);

const Hiring = mongoose.models.Hiring || mongoose.model("Hiring", hiringSchema);

export default Hiring;
