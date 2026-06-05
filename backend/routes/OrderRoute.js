import express from "express";
import { rolebasedAccess, verifyUser } from "../helper/UserAuth.js";
import { createNewOrder, deleteOrderbyadmin, getallorderdetails, getallorderdetailsadmin, getSingleOrder, updateOrderbyadmin } from "../controller/OrderController.js";

const router = express.Router();

router.route("/new/order").post(verifyUser, createNewOrder);
router.route("/order/:id").get(verifyUser, getSingleOrder);
router.route("/orders").get(verifyUser, getallorderdetails);
// router.route("/order/delete/:id").delete(verifyUser, cancelOrderbyuser);

router.route("/admin/orders").get(verifyUser,rolebasedAccess("admin"), getallorderdetailsadmin);
router.route("/admin/order/:id").delete(verifyUser, rolebasedAccess("admin"), deleteOrderbyadmin);
router.route("/admin/order/update/:id").put(verifyUser, rolebasedAccess("admin"), updateOrderbyadmin);




export default router; 