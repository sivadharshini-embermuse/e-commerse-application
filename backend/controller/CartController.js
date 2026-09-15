import Cart from "../model/CartModel.js";
import HandleError from "../helper/HandleError.js";

// Add item to cart
export const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, name, price, quantity, description, images, stock } = req.body;

        if (!productId || !name || !price || !quantity) {
            return next(new HandleError("Please provide all required fields", 400));
        }

        // Find existing cart or create new one
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = await Cart.create({
                userId,
                items: [
                    {
                        productId,
                        name,
                        price,
                        quantity,
                        description,
                        images,
                        stock,
                    },
                ],
            });
        } else {
            // Check if item already exists in cart
            const existingItem = cart.items.find(
                (item) => item.productId.toString() === productId.toString()
            );

            if (existingItem) {
                // Update quantity if item exists
                existingItem.quantity += quantity;
            } else {
                // Add new item to cart
                cart.items.push({
                    productId,
                    name,
                    price,
                    quantity,
                    description,
                    images,
                    stock,
                });
            }

            await cart.save();
        }

        res.status(200).json({
            success: true,
            message: "Item added to cart successfully",
            cart,
        });
    } catch (error) {
        return next(error);
    }
};

// Get user's cart
export const getCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({
                success: true,
                message: "Cart is empty",
                cart: {
                    items: [],
                    totalPrice: 0,
                    totalQuantity: 0,
                },
            });
        }

        res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        return next(error);
    }
};

// Remove item from cart
export const removeFromCart = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId } = req.body;

        if (!productId) {
            return next(new HandleError("Please provide product ID", 400));
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return next(new HandleError("Cart not found", 404));
        }

        // Remove item from cart
        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId.toString()
        );

        // If cart is empty, delete it
        if (cart.items.length === 0) {
            await Cart.findOneAndDelete({ userId });
            return res.status(200).json({
                success: true,
                message: "Item removed and cart is now empty",
                cart: {
                    items: [],
                    totalPrice: 0,
                    totalQuantity: 0,
                },
            });
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart,
        });
    } catch (error) {
        return next(error);
    }
};

// Update item quantity
export const updateCartQuantity = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined) {
            return next(new HandleError("Please provide product ID and quantity", 400));
        }

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return next(new HandleError("Cart not found", 404));
        }

        const item = cart.items.find(
            (item) => item.productId.toString() === productId.toString()
        );

        if (!item) {
            return next(new HandleError("Item not found in cart", 404));
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items = cart.items.filter(
                (item) => item.productId.toString() !== productId.toString()
            );

            // If cart is empty, delete it
            if (cart.items.length === 0) {
                await Cart.findOneAndDelete({ userId });
                return res.status(200).json({
                    success: true,
                    message: "Item removed and cart is now empty",
                    cart: {
                        items: [],
                        totalPrice: 0,
                        totalQuantity: 0,
                    },
                });
            }
        } else {
            item.quantity = quantity;
        }

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart,
        });
    } catch (error) {
        return next(error);
    }
};

// Clear cart
export const clearCart = async (req, res, next) => {
    try {
        const userId = req.user.id;

        await Cart.findOneAndDelete({ userId });

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart: {
                items: [],
                totalPrice: 0,
                totalQuantity: 0,
            },
        });
    } catch (error) {
        return next(error);
    }
};
