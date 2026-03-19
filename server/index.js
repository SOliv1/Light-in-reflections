import express from "express";
import cors from "cors";
import uploadRoutes from "./routes/upload.js";
import dayRoutes from "./routes/days.js"
//import { v2 as cloudinary } from 'cloudinary';
//import dotenv from "dotenv";

 const app =express();

 app.use(cors());
 app.use(express.json());

 app.use("/upload", uploadRoutes);
 app.use("/days", dayRoutes);

 app.get("/", (req, res) => {
    res.send("API running");
 });

 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
 });
