import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminUsers, updateUserRole, deleteAdminUser, resetUserStatus } from '../../features/user/userSlice';
import PageTitle from '../../components/PageTitle';
import { FiTrash2 } from 'react-icons/fi';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const { users, loading, error, isUpdated, isDeleted, successMessage, user: currentUser } = useSelector((state) => state.user);

    const [roleToUpdate, setRoleToUpdate] = useState({});

    useEffect(() => {
        dispatch(getAdminUsers());
        if (isUpdated || isDeleted) {
            alert(successMessage || 'Action completed successfully');
            dispatch(resetUserStatus());
        }
    }, [dispatch, isUpdated, isDeleted, successMessage]);

    const handleDelete = (id) => {
        if (currentUser && currentUser._id === id) {
            alert("You cannot delete your own admin account.");
            return;
        }
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            dispatch(deleteAdminUser(id));
        }
    };

    const handleUpdateRole = (id) => {
        const role = roleToUpdate[id];
        if (!role) return;
        dispatch(updateUserRole({ id, role }));
    };

    if (loading) {
        return <div className="text-center py-10">Loading users...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <PageTitle title="Admin Users" />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Users</h1>
            </div>

            {users && users.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                    <th className="p-4 font-semibold">User ID</th>
                                    <th className="p-4 font-semibold">Name / Email</th>
                                    <th className="p-4 font-semibold">Role</th>
                                    <th className="p-4 font-semibold">Joined At</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm font-medium text-gray-800">
                                            {u._id}
                                            {currentUser && currentUser._id === u._id && (
                                                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">You</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-3">
                                                {u.avatar && u.avatar.url ? (
                                                    <img src={u.avatar.url} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-800">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className={`border border-gray-300 rounded px-2 py-1 text-sm bg-white ${u.role === 'admin' ? 'text-blue-600 font-semibold' : ''}`}
                                                    value={roleToUpdate[u._id] || u.role}
                                                    onChange={(e) => setRoleToUpdate({ ...roleToUpdate, [u._id]: e.target.value })}
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                                {roleToUpdate[u._id] && roleToUpdate[u._id] !== u.role && (
                                                    <button
                                                        onClick={() => handleUpdateRole(u._id)}
                                                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                                                    >
                                                        Save
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(u.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button 
                                                onClick={() => handleDelete(u._id)}
                                                disabled={currentUser && currentUser._id === u._id}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                title={currentUser && currentUser._id === u._id ? "Cannot delete yourself" : "Delete User"}
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
                    <p className="text-gray-500">No users found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
