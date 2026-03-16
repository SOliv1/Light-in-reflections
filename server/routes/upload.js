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

    const result = await cloudinary.uploader.upload_stream(
      { folder: "reflections" },
      (error, uploadResult) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({ url: uploadResult.secure_url });
      }
    );

    // Pipe the buffer into Cloudinary
    result.end(file.buffer);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
