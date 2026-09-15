import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import {v2 as cloudinary} from "cloudinary";

dotenv.config({ path: "config/config.env" });
const PORT = process.env.PORT || 3000;

cloudinary.config({ 
        cloud_name:process.env.cloudinary_cloud_name, 
        api_key: process.env.cloudinary_api_key, 
        api_secret: process.env.cloudinary_api_secret
    });

connectDB();

const server= app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

const closeServer = (exitCode = 0) => {
    server.close(() => {
        process.exit(exitCode);
    });
};

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use. Stop the other server or change PORT in config/config.env.`);
        process.exit(1);
    }

    throw err;
});

process.once("SIGUSR2", () => {
    server.close(() => {
        process.kill(process.pid, "SIGUSR2");
    });
});

process.on("SIGINT", () => closeServer(0));
process.on("SIGTERM", () => closeServer(0));

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception");
  closeServer(1);
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
