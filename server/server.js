// -----------------------------
// 🌿 Imports (top of file)
// -----------------------------
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Database client
import client from "./db.js";

// Routes
import uploadRoute from "./routes/upload.js";
import daysRoute from "./routes/days.js";

// -----------------------------
// 🌙 App Setup
// -----------------------------
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();


// -----------------------------
// 🌼 CORS (must come BEFORE routes)
// -----------------------------
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "https://reflections-in-light.onrender.com"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// -----------------------------
// 🌺 Route Mounting
// -----------------------------
app.use("/upload", uploadRoute);
app.use("/days", daysRoute);

// -----------------------------
// 🌺 Start Server
// -----------------------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
