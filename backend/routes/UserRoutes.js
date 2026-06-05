import express from "express";
import { rolebasedAccess, verifyUser } from "../helper/UserAuth.js";
import {deleteuser, updateuserrole, getsingleuser, getUsers, updateProfile, updatePassword, profile, resetPassword, forgotPassword , loginUser ,logoutUser ,userRegistration } from "../controller/UserController.js";

const router = express.Router();

router.post("/register", userRegistration);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/password/forgot", forgotPassword);
router.post("/reset/:token", resetPassword);
router.get("/profile", verifyUser, profile);
router.put("/password/updatepassword", verifyUser, updatePassword);
router.put("/profile/update", verifyUser, updateProfile);

router.get("/admin/users", verifyUser, rolebasedAccess("admin"), getUsers);
router.get("/admin/user/:id", verifyUser, rolebasedAccess("admin"), getsingleuser);
router.put("/admin/user/:id", verifyUser, rolebasedAccess("admin"), updateuserrole);
router.delete("/admin/user/:id", verifyUser, rolebasedAccess("admin"), deleteuser);




export default router;
