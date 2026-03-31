// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDb } from "./db.js";

// Route imports
import galleryRoutes from "./routes/gallery.js";
import backgroundRoutes from "./routes/background.js";
import daysRoutes from "./routes/days.js";
import uploadRoute from "./routes/upload.js";


// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://localhost:3000",
      "https://reflections-in-light.onrender.com",

    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(express.json());

// Routes
app.use("/api/gallery", galleryRoutes);
app.use("/api/background", backgroundRoutes);
app.use("/days", daysRoutes);
app.use("/upload", uploadRoute);


// Start server AFTER DB connects
connectToDb().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
});
