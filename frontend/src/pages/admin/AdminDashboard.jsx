import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiUsers, FiBox, FiShoppingCart, FiDollarSign } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import PageTitle from '../../components/PageTitle';
import { getDashboardStats } from '../../features/dashboard/dashboardSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  const statCards = [
    { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue}` : '₹0', icon: FiDollarSign, color: 'bg-green-500' },
    { label: 'Total Orders', value: stats ? stats.totalOrders : '0', icon: FiShoppingCart, color: 'bg-blue-500' },
    { label: 'Total Products', value: stats ? stats.totalProducts : '0', icon: FiBox, color: 'bg-purple-500' },
    { label: 'Total Users', value: stats ? stats.totalUsers : '0', icon: FiUsers, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <PageTitle title="Admin Dashboard" />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Overview</h1>
        <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full border border-green-200">
          Live Data Active
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className={`${stat.color} w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-sm`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
            <Link to="/admin/orders" className="text-blue-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          
          {stats && stats.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Customer</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {stats.recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-800">{order._id}</td>
                      <td className="p-4 text-sm text-gray-600">{order.user?.name || 'Unknown'}</td>
                      <td className="p-4 text-sm text-gray-600">₹{order.totalPrice}</td>
                      <td className="p-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FiShoppingCart size={48} className="mb-4 opacity-50" />
              <p>No orders yet</p>
            </div>
          )}
        </div>

        {/* Store Activity */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Store Activity</h2>
          
          {stats && stats.storeActivity && stats.storeActivity.length > 0 ? (
            <ul className="space-y-4">
              {stats.storeActivity.map((activity, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${activity.type === 'order' ? 'bg-blue-500' : activity.type === 'product' ? 'bg-purple-500' : 'bg-orange-500'}`}></div>
                  <div>
                    <p className="text-sm text-gray-700">{activity.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(activity.date).toLocaleString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <FiBox size={48} className="mb-4 opacity-50" />
              <p>No recent activity available</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
