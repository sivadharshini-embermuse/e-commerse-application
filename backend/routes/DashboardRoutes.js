import express from "express";
import { rolebasedAccess, verifyUser } from "../helper/UserAuth.js";
import { getDashboardStats } from "../controller/DashboardController.js";

const router = express.Router();

router.get("/admin/dashboard", verifyUser, rolebasedAccess("admin"), getDashboardStats);

export default router;
