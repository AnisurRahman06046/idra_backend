import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    type: { type: String, required: true }, // 'image' or 'raw'
    mimetype: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
