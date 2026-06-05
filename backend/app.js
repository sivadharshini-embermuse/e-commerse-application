import express from 'express';
import Product from "./routes/ProductRoute.js";
import User from "./routes/UserRoutes.js";
import Order from "./routes/OrderRoute.js";
import middlewareHandler from "./middleware/Error.js";
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use("/api/v1", Product);
app.use("/api/v1", User);
app.use("/api/v1", Order);


app.use(middlewareHandler);

export default app;