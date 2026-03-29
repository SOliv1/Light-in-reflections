import express from "express";
const router = express.Router();

router.get("/photos", async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({ error: "Missing lat or lon" });
    }

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`
    );

    const weatherData = await weatherResponse.json();

    const condition = weatherData.weather?.[0]?.main?.toLowerCase() || "clear";

    const photoSets = {
      clear: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1501973801540-537f08ccae7b"
      ],
      clouds: [
        "https://images.unsplash.com/photo-1499346030926-9a72daac6c63",
        "https://images.unsplash.com/photo-1501630834273-4b5604d2ee31"
      ],
      rain: [
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29",
        "https://images.unsplash.com/photo-1499084732479-de2c02d45fc4"
      ],
      snow: [
        "https://images.unsplash.com/photo-1486915309851-b0cc1f8a0083",
        "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66"
      ],
      mist: [
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
        "https://images.unsplash.com/photo-1500048993959-dc1e4a1b8a1d"
      ]
    };

    const photos = photoSets[condition] || photoSets.clear;

    res.json({ condition, photos });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
