import express from "express";
const router = express.Router();
import { deleteProduct, updateProduct, addProduct, getAllProduct, getSingleProduct} from "../controller/ProductController.js";
import { rolebasedAccess, verifyUser } from "../helper/UserAuth.js";

//user side
router.get("/products", getAllProduct);
router.get("/product/:id", getSingleProduct);

//review and rating


//admin side
router.route("/admin/product/create").post(verifyUser ,rolebasedAccess("admin"), addProduct);
router.route("/admin/product/:id").put(verifyUser ,rolebasedAccess("admin"), updateProduct).delete(verifyUser ,rolebasedAccess("admin"), deleteProduct);
//adminview all products
//adminview  review and rating of a product
//admin delete review and rating of a product

export default router;