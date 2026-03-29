// routes/background.js
import express from "express";
import weatherToMood from "../utils/weatherToMood.js";
import MoodPhoto from "../models/MoodPhoto.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { weather } = req.query;

  const mood = weatherToMood[weather] || "natural";

  const moodDoc = await MoodPhoto.findOne({ mood });

  if (!moodDoc || moodDoc.photos.length === 0) {
    return res.json({ imageUrl: null });
  }

  const photos = moodDoc.photos;
  const randomIndex = Math.floor(Math.random() * photos.length);
  const imageUrl = photos[randomIndex];

  res.json({ imageUrl });
});


export default router;
