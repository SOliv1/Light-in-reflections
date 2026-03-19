import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  console.log("Upload route hit");
  console.log("req.file exists:", !!req.file);
  console.log("req.body:", req.body);

  try {
    const file = req.file;

    if (!file) {
      console.log("No file received by multer");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File mimetype:", file.mimetype);
    console.log("File size:", file.size);

    const result = await new Promise((resolve, reject) => {
      console.log("Starting Cloudinary upload");

      const stream = cloudinary.uploader.upload_stream(
        { folder: "reflections" },
        (error, result) => {
          if (error) {
            console.log("Cloudinary error:", error);
            return reject(error);
          }

          console.log("Cloudinary upload success:", result.secure_url);
          resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    res.json({ photoUrl: result.secure_url });
  } catch (err) {
    console.log("Upload route error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;