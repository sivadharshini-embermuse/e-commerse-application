import { useEffect, useState } from 'react';
import { FiCheckCircle, FiArrowRight, FiX } from 'react-icons/fi';

const OrderSuccessModal = ({ isOpen, order, onClose, onViewOrder }) => {
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        setIsVisible(isOpen);
    }, [isOpen]);

    if (!isVisible || !order) {
        return null;
    }

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    };

    const handleViewOrder = () => {
        handleClose();
        setTimeout(() => {
            onViewOrder();
        }, 300);
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
            <div className={`bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden transform transition-all duration-300 ${
                isVisible ? 'scale-100' : 'scale-95'
            }`}>
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <FiX size={24} />
                </button>

                {/* Modal Content */}
                <div className="p-8 text-center">
                    {/* Success Icon */}
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                            <FiCheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Order Placed Successfully! 🎉
                    </h2>

                    <p className="text-gray-600 mb-6">
                        Your order has been confirmed and we're processing it.
                    </p>

                    {/* Order ID */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600 mb-2">Order ID</p>
                        <p className="font-mono font-bold text-blue-600 break-all">
                            {order._id}
                        </p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Total Amount</span>
                                <span className="font-bold text-gray-800">
                                    ₹{order.totalPrice?.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Items</span>
                                <span className="font-bold text-gray-800">
                                    {order.orderItems?.length}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Payment Status</span>
                                <span className={`font-bold ${
                                    order.paymentInfo?.status === 'succeeded'
                                        ? 'text-green-600'
                                        : 'text-yellow-600'
                                }`}>
                                    {order.paymentInfo?.status === 'succeeded' ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status</span>
                                <span className="font-bold text-yellow-600">
                                    {order.orderStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="mb-6 text-left">
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                            Shipping To
                        </p>
                        <p className="text-sm text-gray-600">
                            {order.shippingInfo?.address}
                        </p>
                        <p className="text-sm text-gray-600">
                            {order.shippingInfo?.city}, {order.shippingInfo?.state}
                        </p>
                        <p className="text-sm text-gray-600">
                            {order.shippingInfo?.country} - {order.shippingInfo?.pinCode}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleViewOrder}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            View Order Details
                            <FiArrowRight size={20} />
                        </button>

                        <button
                            onClick={handleClose}
                            className="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-bold transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>

                    {/* Additional Info */}
                    <p className="text-xs text-gray-500 mt-6">
                        You will receive an order confirmation email shortly.
                        Your order will be delivered in 5-7 business days.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;
