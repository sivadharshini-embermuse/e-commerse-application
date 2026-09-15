import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAdminOrders, updateAdminOrder, deleteAdminOrder, resetOrderStatus } from '../../features/order/orderSlice';
import PageTitle from '../../components/PageTitle';
import { FiEye, FiTrash2 } from 'react-icons/fi';

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error, isUpdated, isDeleted, successMessage } = useSelector((state) => state.order);

    const [statusToUpdate, setStatusToUpdate] = useState({});

    useEffect(() => {
        dispatch(getAdminOrders());
        if (isUpdated || isDeleted) {
            alert(successMessage || 'Action completed successfully');
            dispatch(resetOrderStatus());
        }
    }, [dispatch, isUpdated, isDeleted, successMessage]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            dispatch(deleteAdminOrder(id));
        }
    };

    const handleUpdateStatus = (id) => {
        const status = statusToUpdate[id];
        if (!status) return;
        dispatch(updateAdminOrder({ id, status }));
    };

    if (loading) {
        return <div className="text-center py-10">Loading orders...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <PageTitle title="Admin Orders" />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            </div>

            {orders && orders.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                    <th className="p-4 font-semibold">Order ID</th>
                                    <th className="p-4 font-semibold">Customer</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Total Price</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-gray-800">
                                            {order._id}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {order.user?.name || 'Unknown'}<br/>
                                            <span className="text-xs text-gray-400">{order.user?.email}</span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white"
                                                    value={statusToUpdate[order._id] || order.orderStatus}
                                                    onChange={(e) => setStatusToUpdate({ ...statusToUpdate, [order._id]: e.target.value })}
                                                >
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                                {statusToUpdate[order._id] && statusToUpdate[order._id] !== order.orderStatus && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id)}
                                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                                    >
                                                        Save
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-gray-800">
                                            ₹{order.totalPrice}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link 
                                                to={`/admin/orders/${order._id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                                                title="View Details"
                                            >
                                                <FiEye size={16} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(order._id)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                                title="Delete Order"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">No orders found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
