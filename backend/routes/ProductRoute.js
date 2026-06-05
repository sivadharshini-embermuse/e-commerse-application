import express from "express";
const router = express.Router();
import { reviewProduct, deleteProduct, updateProduct, addProduct, getAllProduct, getSingleProduct, viewreviewProduct} from "../controller/ProductController.js";
import { rolebasedAccess, verifyUser } from "../helper/UserAuth.js";

//user side
router.get("/products", getAllProduct);
router.get("/product/:id", getSingleProduct);
router.put("/review", verifyUser, reviewProduct);


//admin side
router.route("/admin/product/create").post(verifyUser ,rolebasedAccess("admin"), addProduct);
router.route("/admin/product/:id").put(verifyUser ,rolebasedAccess("admin"), updateProduct).delete(verifyUser ,rolebasedAccess("admin"), deleteProduct);
router.route("/admin/products").get(verifyUser ,rolebasedAccess("admin"), getAllProduct);
router.route("/admin/product/review").get(verifyUser ,rolebasedAccess("admin"), viewreviewProduct);

//admin delete review and rating of a product

export default router;