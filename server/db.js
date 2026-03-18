import { MongoClient } from "mongodb";
import dotenv from "dotenv";

// Load .env ONLY in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const client = new MongoClient(process.env.MONGODB_URI);

await client.connect();
console.log("MongoDB client connected (from db.js)");

export default client;
