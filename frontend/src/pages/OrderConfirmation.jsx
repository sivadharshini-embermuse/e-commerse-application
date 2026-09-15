import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiCheckCircle, FiPackage, FiTruck, FiArrowRight } from 'react-icons/fi';
import PageTitle from '../components/PageTitle';
import { getOrder } from '../features/order/orderSlice';

const OrderConfirmation = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { currentOrder: order, loading } = useSelector((state) => state.order);
    const { isAuthenticated } = useSelector((state) => state.user);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        if (id) {
            dispatch(getOrder(id));
        }
    }, [id, isAuthenticated, dispatch, navigate]);

    if (!isAuthenticated) return null;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gray-100">
                <PageTitle title="Order Not Found" />
                <div className="max-w-4xl mx-auto px-6 py-16">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h2>
                        <p className="text-gray-600 mb-8">The order you're looking for doesn't exist.</p>
                        <button
                            onClick={() => navigate('/product')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'shipped':
                return 'bg-blue-100 text-blue-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <PageTitle title="Order Confirmation" />

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Success Banner */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <div className="text-center">
                        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Order Confirmed!
                        </h1>
                        <p className="text-gray-600 mb-4">
                            Thank you for your order. We'll start processing it right away.
                        </p>
                        <p className="text-sm text-gray-500">
                            Order ID: <span className="font-mono font-bold">{order._id}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Timeline */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Delivery Timeline
                            </h2>

                            <div className="space-y-4">
                                {/* Order Placed */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <FiCheckCircle className="w-8 h-8 text-green-500" />
                                        <div className="w-1 h-8 bg-gray-300 mt-2"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Order Placed</h3>
                                        <p className="text-sm text-gray-600">{orderDate}</p>
                                    </div>
                                </div>

                                {/* Processing */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <FiPackage className={`w-8 h-8 ${
                                            order.orderStatus !== 'Processing' ? 'text-green-500' : 'text-gray-400'
                                        }`} />
                                        <div className="w-1 h-8 bg-gray-300 mt-2"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Processing</h3>
                                        <p className="text-sm text-gray-600">Your order is being prepared</p>
                                    </div>
                                </div>

                                {/* Shipped */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <FiTruck className="w-8 h-8 text-gray-400" />
                                        <div className="w-1 h-8 bg-gray-300 mt-2"></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Shipped</h3>
                                        <p className="text-sm text-gray-600">Track your package</p>
                                    </div>
                                </div>

                                {/* Delivered */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <FiCheckCircle className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800">Delivered</h3>
                                        <p className="text-sm text-gray-600">Expected in 5-7 business days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Shipping Address
                            </h2>
                            <div className="text-gray-700 space-y-2">
                                <p className="font-semibold">{order.shippingInfo.address}</p>
                                <p>{order.shippingInfo.city}, {order.shippingInfo.state}</p>
                                <p>{order.shippingInfo.country} - {order.shippingInfo.pinCode}</p>
                                <p className="text-sm text-gray-600">
                                    Phone: {order.shippingInfo.phoneNo}
                                </p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">
                                Order Items ({order.orderItems.length})
                            </h2>

                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 pb-4 border-b last:border-b-0"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 object-cover rounded-lg"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {item.quantity}
                                            </p>
                                            <p className="text-sm font-bold text-blue-600 mt-1">
                                                ₹{item.price.toFixed(2)} each
                                            </p>
                                        </div>
                                        <p className="font-bold text-gray-800 text-right">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="h-fit">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">
                                Order Summary
                            </h3>

                            {/* Order Status */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">Order Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(order.orderStatus)}`}>
                                    {order.orderStatus}
                                </span>
                            </div>

                            {/* Payment Info */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                                <p className={`font-bold ${
                                    order.paymentInfo.status === 'succeeded' 
                                        ? 'text-green-600' 
                                        : order.paymentInfo.status === 'pending'
                                        ? 'text-yellow-600'
                                        : 'text-red-600'
                                }`}>
                                    {order.paymentInfo.status === 'succeeded' ? 'Paid' : 'Pending'}
                                </p>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">₹{order.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span className="font-semibold">₹{order.shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Tax</span>
                                    <span className="font-semibold">₹{order.taxPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    ₹{order.totalPrice.toFixed(2)}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/product')}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-bold transition-colors"
                                >
                                    Continue Shopping
                                    <FiArrowRight size={18} />
                                </button>

                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-bold transition-colors"
                                >
                                    View All Orders
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation;
