import express from "express";
import client from "../db.js";

const router = express.Router();

// Add a photo to a specific day
router.post("/add-photo", async (req, res) => {
  try {
    const { date, photoUrl } = req.body;

    if (!date || !photoUrl) {
      return res.status(400).json({ error: "Missing date or photoUrl" });
    }

    const db = client.db("reflections");

    await db.collection("days").updateOne(
      { date },
      { $push: { photos: photoUrl } },
      { upsert: true }
    );

    res.json({ message: "Photo saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save or update mood for a specific day
router.post("/set-mood", async (req, res) => {
  try {
    const { date, mood } = req.body;

    if (!date || !mood) {
      return res.status(400).json({ error: "Missing date or mood" });
    }

    const db = client.db("reflections");

    await db.collection("days").updateOne(
      { date },
      { $set: { mood } },
      { upsert: true }
    );

    res.json({ message: "Mood saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
