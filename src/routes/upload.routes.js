import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import File from "../models/file.model.js";
import crypto from "crypto";

const router = express.Router();
const upload = multer(); // memory storage

// --------------------
// Generate signature for frontend (optional, if you need direct uploads)
// --------------------
router.get("/signature", (req, res) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = "uploads";

    // Get resource_type from query params (for endpoint selection only)
    const resource_type = req.query.resource_type || "auto";

    // IMPORTANT: Parameters must be in alphabetical order for signature
    // For RAW files to be publicly accessible, we use 'public' (not 'upload')
    // access_mode is alphabetically before folder
    const signatureString = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    res.json({
      signature,
      timestamp,
      folder,
      resource_type, // sent to frontend for endpoint selection only
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Upload file to Cloudinary via backend (original - kept for compatibility)
// --------------------
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";

    const streamUpload = (fileBuffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: "uploads",
            type: "upload", // ensures file is public
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });

    const result = await streamUpload(file.buffer);

    const savedFile = await File.create({
      url: result.secure_url,
      type: resourceType,
      mimetype: file.mimetype,
      originalName: file.originalname,
    });

    res.json(savedFile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

// --------------------
// Upload with SSE progress tracking (smooth incremental progress)
// --------------------
router.post("/upload-progress", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const resourceType = file.mimetype.startsWith("image/") ? "image" : "raw";
    const fileSize = file.buffer.length;
    let uploadedBytes = 0;
    let lastSentProgress = 30;
    let lastSentTime = Date.now();

    const sendProgress = (percent, message) => {
      const now = Date.now();
      // Throttle: only send if progress increased AND at least 100ms passed
      if (percent > lastSentProgress && now - lastSentTime >= 100) {
        res.write(
          `data: ${JSON.stringify({ progress: percent, message })}\n\n`
        );
        lastSentProgress = percent;
        lastSentTime = now;
      }
    };

    // Send initial progress
    sendProgress(30, "Starting Cloudinary upload...");

    const streamUpload = (fileBuffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: "uploads",
            type: "upload",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        // Track upload progress with throttling
        const readStream = streamifier.createReadStream(fileBuffer, {
          highWaterMark: 16384, // 16KB chunks for more granular progress
        });

        readStream.on("data", (chunk) => {
          uploadedBytes += chunk.length;
          const percent = Math.min(
            30 + Math.round((uploadedBytes / fileSize) * 60),
            90
          );
          sendProgress(percent, "Uploading to Cloudinary...");
        });

        readStream.on("end", () => {
          // Ensure we send 90% when stream ends
          res.write(
            `data: ${JSON.stringify({
              progress: 90,
              message: "Processing...",
            })}\n\n`
          );
          lastSentProgress = 90;
        });

        readStream.pipe(stream);
      });

    const result = await streamUpload(file.buffer);

    // Save to database
    res.write(
      `data: ${JSON.stringify({
        progress: 95,
        message: "Saving to database...",
      })}\n\n`
    );

    const savedFile = await File.create({
      url: result.secure_url,
      type: resourceType,
      mimetype: file.mimetype,
      originalName: file.originalname,
    });

    // Send completion
    res.write(
      `data: ${JSON.stringify({
        progress: 100,
        message: "Upload complete!",
        file: savedFile,
        done: true,
      })}\n\n`
    );
    res.end();
  } catch (err) {
    console.error(err);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

// --------------------
// Save file metadata only (optional)
// --------------------
router.post("/save", async (req, res) => {
  try {
    const { url, type, mimetype, originalName } = req.body;
    if (!url || !type || !mimetype || !originalName)
      return res.status(400).json({ message: "Invalid data" });

    const savedFile = await File.create({ url, type, mimetype, originalName });
    res.json(savedFile);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save file", error: err.message });
  }
});

// --------------------
// Get all uploaded files
// --------------------
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

// --------------------
// Serve PDF inline (stream from Cloudinary with proper headers)
// --------------------
router.get("/pdf/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).send("File not found");
    if (file.type !== "raw") return res.status(400).send("Not a PDF");

    // Import axios dynamically
    const axios = (await import("axios")).default;

    // Fetch PDF from Cloudinary
    const response = await axios.get(file.url, { responseType: "stream" });

    // Set headers to display inline in browser
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${file.originalName}"`
    );
    res.setHeader("Cache-Control", "public, max-age=31536000");

    // Pipe PDF to browser
    response.data.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to fetch PDF");
  }
});

// --------------------
// Delete file (removes from DB and Cloudinary)
// --------------------
router.delete("/:id", async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ message: "File not found" });

    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/cloud_name/resource_type/upload/v123456/folder/public_id.ext
    const urlParts = file.url.split("/");
    const filename = urlParts[urlParts.length - 1];
    const folder = urlParts[urlParts.length - 2];
    const publicId = `${folder}/${filename.split(".")[0]}`;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      resource_type: file.type,
    });

    // Delete from MongoDB
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete file", error: err.message });
  }
});

export default router;
