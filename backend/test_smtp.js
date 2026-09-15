import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.error("EXACT SMTP ERROR:", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});
