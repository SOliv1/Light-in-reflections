import { MongoClient } from "mongodb";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const client = new MongoClient(process.env.MONGODB_URI);

export default client;
