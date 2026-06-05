import express from "express";
const router = express.Router();
import { reviewProduct, deleteProduct, updateProduct, addProduct, getAllProduct, getSingleProduct, viewreviewProduct, getAdminAllProduct, admindeleteReviewProduct} from "../controller/ProductController.js";
import { rolebasedAccess, verifyUser } from "../helper/UserAuth.js";

//user side
router.get("/products", getAllProduct);
router.get("/product/:id", getSingleProduct);
router.put("/review", verifyUser, reviewProduct);


//admin side
router.route("/admin/product/create").post(verifyUser ,rolebasedAccess("admin"), addProduct);

router.route("/admin/products").get(verifyUser ,rolebasedAccess("admin"), getAdminAllProduct);
router.route("/admin/product/review").get(verifyUser ,rolebasedAccess("admin"), viewreviewProduct).delete(verifyUser ,rolebasedAccess("admin"), 
admindeleteReviewProduct);

router.route("/admin/product/:id").put(verifyUser ,rolebasedAccess("admin"), updateProduct).delete(verifyUser ,rolebasedAccess("admin"), deleteProduct);

export default router;