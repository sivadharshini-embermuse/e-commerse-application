import express from 'express';
import Product from "./routes/ProductRoute.js";
import User from "./routes/UserRoutes.js";
import Order from "./routes/OrderRoute.js";
import middlewareHandler from "./middleware/Error.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(fileUpload());
app.use("/api/v1", Product);
app.use("/api/v1", User);
app.use("/api/v1", Order);


app.use(middlewareHandler);

export default app;
