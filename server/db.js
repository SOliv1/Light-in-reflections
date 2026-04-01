import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db;

export async function connectToDb() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || "Sandbox";

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI or MONGO_URI");
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  db = client.db(dbName);
  console.log(`Connected to MongoDB database: ${dbName}`);
}

export function getDb() {
  return db;
}
