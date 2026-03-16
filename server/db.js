import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

await client.connect();
console.log("MongoDB client connected (from db.js)");

export default client;
