import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import client from "./db.js";   // already connected client

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Upload route
import uploadRoute from "./routes/upload.js";
app.use("/upload", uploadRoute);

// Days route
import daysRoute from "./routes/days.js";
app.use("/days", daysRoute);

// Start server — NO client.connect() here
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
