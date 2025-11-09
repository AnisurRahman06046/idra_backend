// import mongoose from "mongoose";

// const { Schema, model } = mongoose;

// const fileSchema = new Schema(
//   {
//     url: { type: String, required: true },
//     type: { type: String, required: true }, // 'image' or 'raw'
//     mimetype: { type: String, required: true },
//     originalName: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// const File = mongoose.models.File || mongoose.model("File", fileSchema);
// export default File;

import mongoose from "mongoose";

const { Schema, model } = mongoose;

const fileSchema = new Schema(
  {
    url: { type: String, required: true },
    type: { type: String, required: true }, // 'image' or 'raw'
    mimetype: { type: String, required: true },
    originalName: { type: String, required: true },
  },
  { timestamps: true }
);

const File = mongoose.models.File || model("File", fileSchema);
export default File;
