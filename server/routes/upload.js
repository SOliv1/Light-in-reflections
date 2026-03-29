import express from "express";
import cloudinary from "../cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {


  try {
    const file = req.file;
    if (!file) {

      return res.status(400).json({ error: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "Sandbox" },
        (error, result) => {
          if (error) {

            return reject(error);
          }
          resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    res.json({ photoUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;