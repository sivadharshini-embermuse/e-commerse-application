import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getOrder, clearError } from '../../features/order/orderSlice';
import PageTitle from '../../components/PageTitle';

const AdminOrderDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentOrder, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getOrder(id));
        return () => {
            dispatch(clearError());
        };
    }, [dispatch, id]);

    if (loading) {
        return <div className="text-center py-10">Loading order details...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    if (!currentOrder) {
        return <div className="text-center py-10">Order not found.</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <PageTitle title="Order Details" />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                <Link to="/admin/orders" className="text-blue-600 hover:underline">
                    &larr; Back to Orders
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Shipping Information</h2>
                        <p className="text-sm text-gray-600"><strong>Name:</strong> {currentOrder.user?.name}</p>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> {currentOrder.user?.email}</p>
                        <p className="text-sm text-gray-600"><strong>Phone:</strong> {currentOrder.shippingInfo?.phoneNo}</p>
                        <p className="text-sm text-gray-600">
                            <strong>Address:</strong> {currentOrder.shippingInfo?.address}, {currentOrder.shippingInfo?.city}, {currentOrder.shippingInfo?.state}, {currentOrder.shippingInfo?.pinCode}, {currentOrder.shippingInfo?.country}
                        </p>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Payment Information</h2>
                        <p className="text-sm text-gray-600"><strong>Payment Status:</strong> <span className={currentOrder.paymentInfo?.status === 'succeeded' || currentOrder.paymentInfo?.status === 'Success' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{currentOrder.paymentInfo?.status || 'Unknown'}</span></p>
                        <p className="text-sm text-gray-600"><strong>Payment ID:</strong> {currentOrder.paymentInfo?.id}</p>
                        <p className="text-sm text-gray-600"><strong>Order Status:</strong> <span className={currentOrder.orderStatus === 'Delivered' ? 'text-green-600 font-semibold' : 'text-blue-600 font-semibold'}>{currentOrder.orderStatus}</span></p>
                        <p className="text-sm text-gray-600"><strong>Order Date:</strong> {new Date(currentOrder.createdAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="border-b pb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {currentOrder.orderItems?.map((item) => (
                            <div key={item.product} className="flex items-center gap-4">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md border" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-600">₹{item.price} x {item.quantity}</p>
                                </div>
                                <p className="text-sm font-semibold text-gray-800">
                                    ₹{item.price * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Subtotal:</span>
                            <span>₹{currentOrder.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>Shipping:</span>
                            <span>₹{currentOrder.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 border-b pb-2">
                            <span>Tax:</span>
                            <span>₹{currentOrder.taxPrice}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-gray-800 pt-2">
                            <span>Total:</span>
                            <span>₹{currentOrder.totalPrice}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrderDetails;
