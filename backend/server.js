import { connect } from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import {v2 as cloudinary} from "cloudinary";

// dotenv.config({ path: ".env" });
dotenv.config({ path: "./config/config.env" });
const PORT = process.env.PORT || 3000;

cloudinary.config({ 
        cloud_name:process.env.cloudinary_cloud_name, 
        api_key: process.env.cloudinary_api_key, 
        api_secret: process.env.cloudinary_api_secret
    });

connectDB();
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  process.exit(1);
}); 

const server= app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

process.on("unhandledRejection", (err) => {
    console.log("ERROR NAME:", err.name);
    console.log("ERROR MESSAGE:", err.message);
    console.log("STACK:", err.stack);

    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});
