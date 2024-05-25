import mongoose, { Schema } from "mongoose";

const newsLetterSchema = new Schema(
  {
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

const NewsLetter =
  mongoose.models.NewsLetter || mongoose.model("NewsLetter", newsLetterSchema);

export default NewsLetter;
