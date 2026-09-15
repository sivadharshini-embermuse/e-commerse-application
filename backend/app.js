import express from 'express';
import Product from "./routes/ProductRoute.js";
import User from "./routes/UserRoutes.js";
import Order from "./routes/OrderRoute.js";
import Cart from "./routes/CartRoute.js";
import Dashboard from "./routes/DashboardRoutes.js";
import middlewareHandler from "./middleware/Error.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import rateLimit from 'express-rate-limit';

const app = express();

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20, // Limit each IP to 20 requests per `window` for auth/payment
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: "Too many requests from this IP, please try again after 15 minutes" }
});

app.use(cors({
    origin: ["http://localhost:5174", "http://localhost:5173"],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(fileUpload());

// Apply rate limiting
app.use("/api/v1/login", authLimiter);
app.use("/api/v1/register", authLimiter);
app.use("/api/v1/password/forgot", authLimiter);
app.use("/api/v1/password/reset", authLimiter);
app.use("/api/v1/payment", authLimiter);
app.use("/api/v1", generalLimiter);

app.use("/api/v1", Product);
app.use("/api/v1", User);
app.use("/api/v1", Order);
app.use("/api/v1", Cart);
app.use("/api/v1", Dashboard);

app.use(middlewareHandler);

export default app;
