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
    console.log("add-photo error:", err);
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
router.post("/:uiDate", async (req, res) => {
  try {
    const uiDate = req.params.uiDate; // "16-03-26"

    // Convert UI date → ISO date
    const [day, month, year] = uiDate.split("-");
    const isoDate = `20${year}-${month}-${day}`; // "2026-03-16"

    const db = client.db("reflections");
    const dayDoc = await db.collection("days").findOne({ date: isoDate });

    if (!dayDoc) {
      return res.status(404).json({ error: "Day not found" });
    }

    res.json(dayDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------
// 🌺 Export
// -----------------------------
export default router;
