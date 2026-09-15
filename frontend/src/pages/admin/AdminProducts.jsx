import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAdminProducts, deleteProduct, resetProductStatus } from '../../features/product/productSlice';
import PageTitle from '../../components/PageTitle';
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { products, loading, error, isDeleted, successMessage } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getAdminProducts());
        if (isDeleted) {
            alert(successMessage || 'Product deleted successfully');
            dispatch(resetProductStatus());
        }
    }, [dispatch, isDeleted, successMessage]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading products...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    return (
        <div className="space-y-6">
            <PageTitle title="Admin Products" />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <Link 
                    to="/admin/products/new" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium"
                >
                    <FiPlus size={20} />
                    Add Product
                </Link>
            </div>

            {products && products.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                                    <th className="p-4 font-semibold">Image</th>
                                    <th className="p-4 font-semibold">Name</th>
                                    <th className="p-4 font-semibold">Category</th>
                                    <th className="p-4 font-semibold">Stock</th>
                                    <th className="p-4 font-semibold">Price</th>
                                    <th className="p-4 font-semibold text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <img 
                                                src={product.images && product.images[0] ? product.images[0].url : '/default-product.png'} 
                                                alt={product.name} 
                                                className="w-12 h-12 object-cover rounded-md border border-gray-200"
                                            />
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-800 max-w-xs truncate">
                                            {product.name}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600 capitalize">
                                            {product.category}
                                        </td>
                                        <td className="p-4 text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-gray-800">
                                            ₹{product.price}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link 
                                                to={`/admin/products/edit/${product._id}`}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                            >
                                                <FiEdit size={16} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(product._id)}
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
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
                    <p className="text-gray-500 mb-4">No products found.</p>
                    <Link 
                        to="/admin/products/new" 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2 font-medium"
                    >
                        <FiPlus size={20} />
                        Add First Product
                    </Link>
                </div>
            )}
        </div>
    );
};

export default AdminProducts;
