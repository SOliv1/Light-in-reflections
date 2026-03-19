import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), async (req, res) => {
  console.log("Upload route hit");
  console.log("req.file exists:", !!req.file );
  console.log("req.body", req.body);
  
  try {
    const file = req.file;

    if (!file) {

      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "reflections" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        stream.end(file.buffer);
      });

    res.json({ photoUrl: result.secure_url });
  } catch (err) {
    console.log("❌ Upload route crashed:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
