import Order from "../model/orderModels.js";
import Product from "../model/ProductModels.js";
import User from "../model/UserModels.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        const [totalOrders, totalProducts, totalUsers] = await Promise.all([
            Order.countDocuments(),
            Product.countDocuments(),
            User.countDocuments(),
        ]);

        // Calculate total revenue from all orders
        const orders = await Order.find();
        let totalRevenue = 0;
        orders.forEach((order) => {
            totalRevenue += order.totalPrice || 0;
        });

        // Get 5 most recent orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate("user", "name email");

        // Generate a store activity feed (recent 2 of each, sorted by date)
        const recentProductsQuery = Product.find().sort({ createdAt: -1 }).limit(2);
        const recentUsersQuery = User.find().sort({ createdAt: -1 }).limit(2);
        
        const [recentProducts, recentUsers] = await Promise.all([
            recentProductsQuery,
            recentUsersQuery
        ]);

        const activity = [
            ...recentOrders.slice(0, 2).map(o => ({ type: 'order', id: o._id, message: `New order placed for ₹${o.totalPrice}`, date: o.createdAt })),
            ...recentProducts.map(p => ({ type: 'product', id: p._id, message: `New product added: ${p.name}`, date: p.createdAt })),
            ...recentUsers.map(u => ({ type: 'user', id: u._id, message: `New user registered: ${u.name}`, date: u.createdAt }))
        ];

        // Sort activity by date descending and take top 5
        activity.sort((a, b) => new Date(b.date) - new Date(a.date));
        const storeActivity = activity.slice(0, 5);

        res.status(200).json({
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                totalProducts,
                totalUsers,
                recentOrders,
                storeActivity
            }
        });
    } catch (error) {
        return next(error);
    }
};
