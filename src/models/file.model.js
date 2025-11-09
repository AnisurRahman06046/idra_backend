import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, required: true },
  originalName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);
