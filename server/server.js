// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDb, getDbStatus } from "./db.js";

// Route imports
import galleryRoutes from "./routes/gallery.js";
import backgroundRoutes from "./routes/background.js";
import daysRoutes from "./routes/days.js";
import uploadRoute from "./routes/upload.js";


// Load environment variables
dotenv.config();

const app = express();
const configuredOrigins = (process.env.CORS_ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const defaultOrigins = [
  "http://localhost",
  "http://localhost:3000",
  "https://reflections-in-light.onrender.com",
];

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (configuredOrigins.includes(origin) || defaultOrigins.includes(origin)) {
    return true;
  }

  if (/^https:\/\/.+\.netlify\.app$/i.test(origin)) {
    return true;
  }

  if (/^https:\/\/.+\.onrender\.com$/i.test(origin)) {
    return true;
  }

  return false;
}

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API running");
});

app.get("/health", async (_req, res) => {
  try {
    await connectToDb();
  } catch (error) {
    const dbStatus = getDbStatus();
    return res.status(503).json({
      app: "ok",
      db: dbStatus.state,
      dbError: dbStatus.error || error.message,
      timestamp: new Date().toISOString(),
    });
  }

  const dbStatus = getDbStatus();
  return res.json({
    app: "ok",
    db: dbStatus.state,
    dbError: dbStatus.error,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use("/api/gallery", galleryRoutes);
app.use("/api/background", backgroundRoutes);
app.use("/days", daysRoutes);
app.use("/upload", uploadRoute);


// Start server AFTER DB connects
const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);

  try {
    await connectToDb();
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
});
