import express from "express";
import { verifyUser } from "../helper/UserAuth.js";
import {
    addToCart,
    getCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
} from "../controller/CartController.js";

const router = express.Router();

// Add item to cart
router.post("/cart/add", verifyUser, addToCart);

// Get user's cart
router.get("/cart", verifyUser, getCart);

// Remove item from cart
router.delete("/cart/remove", verifyUser, removeFromCart);

// Update item quantity
router.put("/cart/update", verifyUser, updateCartQuantity);

// Clear entire cart
router.delete("/cart/clear", verifyUser, clearCart);

export default router;
