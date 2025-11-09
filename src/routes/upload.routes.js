// import express from "express";
// import multer from "multer";
// import cloudinary from "../config/cloudinary.js";
// import streamifier from "streamifier";
// import File from "../models/file.model.js";

// const router = express.Router();
// const upload = multer(); // memory storage

// // Upload single file
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).json({ message: "No file uploaded" });

//     // Upload to Cloudinary using stream
//     const streamUpload = (fileBuffer) => {
//       return new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { resource_type: "auto" },
//           (error, result) => {
//             if (result) resolve(result);
//             else reject(error);
//           }
//         );
//         streamifier.createReadStream(fileBuffer).pipe(stream);
//       });
//     };

//     const result = await streamUpload(file.buffer);

//     // Save to MongoDB
//     const savedFile = await File.create({
//       url: result.secure_url,
//       type: result.resource_type,
//       originalName: file.originalname,
//     });

//     // Respond with saved file
//     res.json(savedFile);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload failed", error: err.message });
//   }
// });

// // Fetch all uploaded files
// router.get("/all", async (req, res) => {
//   try {
//     const files = await File.find().sort({ createdAt: -1 });
//     res.json(files);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to fetch files", error: err.message });
//   }
// });

// export default router;

import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import File from "../models/file.model.js";

const router = express.Router();
const upload = multer(); // memory storage

// Upload single file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Determine resource_type: use 'image' or 'raw'
    const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";

    // Upload to Cloudinary using stream
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: resourceType },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    // Save to MongoDB
    const savedFile = await File.create({
      url: result.secure_url,
      type: result.resource_type,
      originalName: file.originalname,
    });

    res.json(savedFile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// Fetch all uploaded files
router.get("/all", async (req, res) => {
  try {
    const files = await File.find().sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch files", error: err.message });
  }
});

export default router;
