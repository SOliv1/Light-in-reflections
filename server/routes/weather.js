import express from "express";


const router = express.Router();

router.get("/weather", async (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    const lat = req.query.lat || 52.09;   // Evesham latitude (fallback)
    const lon = req.query.lon || -1.95;   // Evesham longitude (fallback)

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    console.error("Weather API error:", err);
    res.status(500).json({ error: "Failed to fetch weather" });
  }
});

export default router;