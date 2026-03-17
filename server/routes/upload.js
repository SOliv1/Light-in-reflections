import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Wrap Cloudinary upload_stream in a Promise
    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "reflections" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(file.buffer);
      });
    };

    const result = await uploadToCloudinary();

    res.json({ url: result.secure_url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
