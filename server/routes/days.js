// -----------------------------
// 🌿 Imports (top of file)
// -----------------------------
import express from "express";
import client from "../db.js";

// -----------------------------
// 🌙 Setup
// -----------------------------
const router = express.Router();

// -----------------------------
// 📸 Add a photo to a specific day
// -----------------------------
router.post("/add-photo", async (req, res) => {
  try {

    const { date, photoUrl } = req.body;

    if (!date || !photoUrl) {
      return res.status(400).json({ error: "Missing date or photoUrl" });
    }

    const db = client.db("reflections");

    const result = await db.collection("days").updateOne(
      { date },
      { $push: { photos: photoUrl } },
      { upsert: true }
    );



    res.json({ message: "Photo saved successfully" });
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// 🌤️ Save or update mood for a specific day
// -----------------------------
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

// -----------------------------
// 🌙 Fetch a day by UI date (16-03-26)
// -----------------------------
router.get("/:date", async (req, res) => {
  try {
    const uiDate = req.params.date;

    const db = client.db("reflections");
    const dayDoc = await db.collection("days").findOne({ date: uiDate });

    if (!dayDoc) {
      return res.json({ date: uiDate, photos: [], mood: null });
    }

    res.json(dayDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// 🌙 Delete a photo from a specific day
// -----------------------------
router.post("/delete-photo", async (req, res) => {
  try {
    const { date, photoUrl } = req.body;

    if (!date || !photoUrl) {
      return res.status(400).json({ error: "Missing date or photoUrl" });
    }

    const db = client.db("reflections");

    const result = await db.collection("days").updateOne(
      { date },
      { $pull: { photos: photoUrl } }
    );

    const updatedDay = await db.collection("days").findOne({ date });

    res.json({
      message: "Photo deleted successfully",
      day: updatedDay || { date, photos: [], mood: null },
    });
  } catch (err) {

    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// 🌺 Export
// -----------------------------
export default router;
