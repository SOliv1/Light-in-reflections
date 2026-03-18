import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  // 🌟 DEBUG LOGS — these tell us what is happening
  console.log("📸 Upload route hit");
  console.log("File received:", req.file ? "YES" : "NO");

  try {
    const file = req.file;

    if (!file) {
      console.log("❌ Multer did NOT receive a file");
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Wrap Cloudinary upload_stream in a Promise
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "reflections" },
          (error, result) => {
            if (error) {
              console.log("❌ Cloudinary error:", error);
              reject(error);
            } else {
              console.log("✅ Cloudinary upload success");
              resolve(result);
            }
          }
        );

        stream.end(file.buffer);
      });
    };

    const result = await uploadToCloudinary();

    res.json({ url: result.secure_url });

  } catch (err) {
    console.log("❌ Upload route crashed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
