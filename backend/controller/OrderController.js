import Order from "../model/orderModels.js";
import HandleError from "../helper/HandleError.js";
import Product from "../model/ProductModels.js";



export const createNewOrder = async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

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