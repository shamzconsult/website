import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema(
  {
    name: { type: String },
    email: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
