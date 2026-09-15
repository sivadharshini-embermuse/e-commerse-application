import Order from "../model/orderModels.js";
import HandleError from "../helper/HandleError.js";
import Product from "../model/ProductModels.js";
import Razorpay from "razorpay";
import crypto from "crypto";

let razorpayInstance = null;

const getRazorpay = () => {
    if (!razorpayInstance && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayInstance;
};

export const createRazorpayOrder = async (req, res, next) => {
    const { amount, currency = "INR", receipt } = req.body;

    const razorpay = getRazorpay();
    if (!razorpay) {
        return next(new HandleError("Razorpay is not configured. Add real RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to backend/config/config.env", 500));
    }

    if (!amount || Number(amount) < 100) {
        return next(new HandleError("Invalid payment amount", 400));
    }

    try {
        const order = await razorpay.orders.create({
            amount: Number(amount),
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            notes: {
                userId: req.user._id.toString(),
            },
        });

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error("Razorpay SDK Error:", error);
        return next(new HandleError(error.message || "Razorpay order creation failed", 500));
    }
};

export const createNewOrder = async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    // Verify Razorpay signature
    if (paymentInfo && paymentInfo.id && paymentInfo.order_id && paymentInfo.signature) {
        const body = paymentInfo.order_id + "|" + paymentInfo.id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature !== paymentInfo.signature) {
            return next(new HandleError("Invalid payment signature. Payment verification failed.", 400));
        }

        // Prevent duplicate orders from the same payment ID
        const existingOrder = await Order.findOne({ "paymentInfo.id": paymentInfo.id });
        if (existingOrder) {
            return next(new HandleError("An order with this payment ID has already been created.", 400));
        }
    } else {
        return next(new HandleError("Missing payment information.", 400));
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(200).json({
        success: true,
        message: "Order created successfully",
        order,
    });
};

export const getSingleOrder = async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) {
        return next(new HandleError("Order not found", 404));
    }
    res.status(200).json({
        success: true,
        order,
    });
}; 

export const getallorderdetails = async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });
    if (!orders) {
        return next(new HandleError("No orders found", 404));
    }
    res.status(200).json({
        success: true,
        orders,
    });
};

export const getallorderdetailsadmin = async (req, res, next) => {
    const orders = await Order.find().populate("user", "name email");
    if (!orders) {
        return next(new HandleError("No orders found", 404));
    }
    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    res.status(200).json({
        success: true,
        orders,
        totalAmount,
    });
};

export const deleteOrderbyadmin = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError("Order not found", 404));
    }
    await order.deleteOne({_id: req.params.id});
    res.status(200).json({
        success: true,
        message: "Order deleted successfully",
    });
};

//admin update order status
export const updateOrderbyadmin = async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        return next(new HandleError("Order not found", 404));
    }
    if (order.orderStatus === "Delivered") {
        return next(new HandleError("Order is already delivered", 400));
    }
    //update stock of products
    await Promise.all(order.orderItems.map(async (item) => {
        await updateStock(item.product, item.quantity);
    }));

    order.orderStatus = req.body.status;
    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
    });
}

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    if (!product) {
        return next(new HandleError("Product not found", 404));
    }
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
}   

// export const  cancelOrderbyuser = async (req, res, next) => {
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//         return next(new HandleError("Order not found", 404));
//     }
//     if(order.orderStatus !== "Delivered") {
//         return next(new HandleError("Order cannot be cancelled", 400));
//     }
//     await order.deleteOne({_id: req.params.id});
//     res.status(200).json({
//         success: true,
//         message: "Order cancelled successfully",
//     });
// };