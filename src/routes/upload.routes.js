// // import express from "express";
// // import multer from "multer";
// // import cloudinary from "../config/cloudinary.js";
// // import streamifier from "streamifier";
// // import File from "../models/file.model.js";

// // const router = express.Router();
// // const upload = multer(); // memory storage

// // // Upload single file
// // router.post("/upload", upload.single("file"), async (req, res) => {
// //   try {
// //     const file = req.file;
// //     if (!file) return res.status(400).json({ message: "No file uploaded" });

// //     // Determine resource_type: use 'image' or 'raw'
// //     const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";

// //     // Upload to Cloudinary using stream
// //     const streamUpload = (fileBuffer) => {
// //       return new Promise((resolve, reject) => {
// //         const stream = cloudinary.uploader.upload_stream(
// //           { resource_type: resourceType },
// //           (error, result) => {
// //             if (result) resolve(result);
// //             else reject(error);
// //           }
// //         );
// //         streamifier.createReadStream(fileBuffer).pipe(stream);
// //       });
// //     };

// //     const result = await streamUpload(file.buffer);

// //     // Save to MongoDB
// //     const savedFile = await File.create({
// //       url: result.secure_url,
// //       type: result.resource_type,
// //       originalName: file.originalname,
// //     });

// //     res.json(savedFile);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Upload failed", error: err.message });
// //   }
// // });

// // // Fetch all uploaded files
// // router.get("/all", async (req, res) => {
// //   try {
// //     const files = await File.find().sort({ createdAt: -1 });
// //     res.json(files);
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ message: "Failed to fetch files", error: err.message });
// //   }
// // });

// // export default router;

// // import express from "express";
// // import multer from "multer";
// // import cloudinary from "../config/cloudinary.js";
// // import streamifier from "streamifier";
// // import File from "../models/file.model.js";
// // import axios from "axios";

// // const router = express.Router();
// // const upload = multer(); // memory storage

// // // Upload single file
// // router.post("/upload", upload.single("file"), async (req, res) => {
// //   try {
// //     const file = req.file;
// //     if (!file) return res.status(400).json({ message: "No file uploaded" });

// //     // Determine resource_type: image or raw
// //     const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";

// //     // Upload to Cloudinary
// //     const streamUpload = (fileBuffer) =>
// //       new Promise((resolve, reject) => {
// //         const stream = cloudinary.uploader.upload_stream(
// //           { resource_type: resourceType },
// //           (error, result) => {
// //             if (result) resolve(result);
// //             else reject(error);
// //           }
// //         );
// //         streamifier.createReadStream(fileBuffer).pipe(stream);
// //       });

// //     const result = await streamUpload(file.buffer);

// //     // Save to MongoDB
// //     const savedFile = await File.create({
// //       url: result.secure_url,
// //       type: resourceType,
// //       originalName: file.originalname,
// //     });

// //     res.json(savedFile);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Upload failed", error: err.message });
// //   }
// // });

// // // Fetch all uploaded files
// // router.get("/all", async (req, res) => {
// //   try {
// //     const files = await File.find().sort({ createdAt: -1 });
// //     res.json(files);
// //   } catch (err) {
// //     res
// //       .status(500)
// //       .json({ message: "Failed to fetch files", error: err.message });
// //   }
// // });

// // // Serve PDF inline
// // router.get("/pdf/:id", async (req, res) => {
// //   try {
// //     const file = await File.findById(req.params.id);
// //     if (!file) return res.status(404).send("File not found");

// //     if (file.type !== "raw") return res.status(400).send("Not a PDF");

// //     // Fetch the PDF from Cloudinary
// //     const response = await axios.get(file.url, { responseType: "stream" });

// //     // Set headers to display inline
// //     res.setHeader("Content-Type", "application/pdf");
// //     res.setHeader(
// //       "Content-Disposition",
// //       `inline; filename="${file.originalName}"`
// //     );

// //     // Pipe PDF to browser
// //     response.data.pipe(res);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).send("Failed to fetch PDF");
// //   }
// // });

// // export default router;

// import express from "express";
// import multer from "multer";
// import cloudinary from "../config/cloudinary.js";
// import streamifier from "streamifier";
// import File from "../models/file.model.js";
// import axios from "axios";

// const router = express.Router();
// const upload = multer(); // memory storage

// // Upload single file
// router.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) return res.status(400).json({ message: "No file uploaded" });

//     const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";

//     const streamUpload = (buffer) =>
//       new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           { resource_type: resourceType },
//           (error, result) => (result ? resolve(result) : reject(error))
//         );
//         streamifier.createReadStream(buffer).pipe(stream);
//       });

//     const result = await streamUpload(file.buffer);

//     const savedFile = await File.create({
//       url: result.secure_url,
//       type: resourceType,
//       mimetype: file.mimetype,
//       originalName: file.originalname,
//     });

//     res.json(savedFile);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Upload failed", error: err.message });
//   }
// });

// // Fetch all files
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

// // Serve PDF inline
// router.get("/pdf/:id", async (req, res) => {
//   try {
//     const file = await File.findById(req.params.id);
//     if (!file) return res.status(404).send("File not found");

//     if (file.mimetype !== "application/pdf")
//       return res.status(400).send("Not a PDF");

//     const response = await axios.get(file.url, { responseType: "stream" });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `inline; filename="${file.originalName}"`
//     );

//     response.data.pipe(res);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Failed to fetch PDF");
//   }
// });

// export default router;

import express from "express";
import File from "../models/file.model.js";
import axios from "axios";

const router = express.Router();

// Save uploaded file metadata (called from frontend after Cloudinary upload)
router.post("/save", async (req, res) => {
  try {
    const { url, type, mimetype, originalName } = req.body;
    const file = await File.create({ url, type, mimetype, originalName });
    res.json(file);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save file", error: err.message });
  }
});

// Get all files
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

// Serve PDF inline
router.get("/pdf/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send("File not found");
    if (file.type !== "raw") return res.status(400).send("Not a PDF");

    const response = await axios.get(file.url, { responseType: "stream" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.originalName}"`
    );
    response.data.pipe(res);
  } catch (err) {
    res.status(500).send("Failed to fetch PDF");
  }
});

export default router;
