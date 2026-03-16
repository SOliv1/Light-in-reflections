import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
//import uploadRoute from "./routes/upload.js";
//app.use("/upload", uploadRoute);


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. MongoDB client
const client = new MongoClient(process.env.MONGODB_URI);

/* 2. Test route (keep for now)
app.get("/test-db", async (req, res) => {
  try {
    const db = client.db("reflections");   // your chosen database name
    const collections = await db.listCollections().toArray();

    res.json({
      connected: true,
      collections
    });
  } catch (err) {
    res.status(500).json({
      connected: false,
      error: err.message
    });
  }
});
*/


// 3. Upload route — place it RIGHT HERE
import uploadRoute from "./routes/upload.js";
app.use("/upload", uploadRoute);
async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

startServer();
