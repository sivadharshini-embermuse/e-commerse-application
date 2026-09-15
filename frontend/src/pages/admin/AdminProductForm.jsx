import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProductDetails, resetProductStatus } from '../../features/product/productSlice';
import PageTitle from '../../components/PageTitle';

const AdminProductForm = () => {
    const { id } = useParams();
    const isEditMode = !!id;
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const { product, loading, error, isCreated, isUpdated, successMessage } = useSelector((state) => state.products);

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [mrp, setMrp] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(1);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const categories = [
        "Electronics", "Cameras", "Laptops", "Accessories", "Headphones", "Food", "Books", "Clothes/Shoes", "Beauty/Health", "Sports", "Outdoor", "Home"
    ];

    useEffect(() => {
        if (isEditMode) {
            dispatch(getProductDetails(id));
        }
    }, [dispatch, id, isEditMode]);

    useEffect(() => {
        if (isEditMode && product && product._id === id) {
            setName(product.name || '');
            setPrice(product.price || '');
            setMrp(product.MRP || '');
            setDescription(product.description || '');
            setCategory(product.category || '');
            setStock(product.stock || 0);
            
            if (product.images) {
                setImagesPreview(product.images.map(img => img.url));
            }
        }
    }, [product, id, isEditMode]);

    useEffect(() => {
        if (isCreated || isUpdated) {
            alert(successMessage || 'Operation successful!');
            dispatch(resetProductStatus());
            navigate('/admin/products');
        }
        if (error) {
            alert(error);
        }
    }, [dispatch, isCreated, isUpdated, error, navigate, successMessage]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Reset previews for new selection
        setImages(files);
        
        const filePreviews = [];
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    filePreviews.push(reader.result);
                    if (filePreviews.length === files.length) {
                        setImagesPreview(filePreviews);
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.set('name', name);
        formData.set('price', price);
        formData.set('MRP', mrp);
        formData.set('description', description);
        formData.set('category', category);
        formData.set('stock', stock);

        images.forEach((image) => {
            formData.append('images', image);
        });

        if (isEditMode) {
            dispatch(updateProduct({ id, productData: formData }));
        } else {
            if (images.length === 0) {
                alert('Please upload at least one image');
                return;
            }
            dispatch(createProduct(formData));
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <PageTitle title={isEditMode ? 'Edit Product' : 'Add New Product'} />
            
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input 
                            type="text" 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                        <input 
                            type="number" 
                            required 
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">MRP (₹)</label>
                        <input 
                            type="number" 
                            required 
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            value={mrp} 
                            onChange={(e) => setMrp(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                        <input 
                            type="number" 
                            required 
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                            value={stock} 
                            onChange={(e) => setStock(e.target.value)} 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                        required 
                        rows="4" 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Images
                        {isEditMode && <span className="text-gray-400 text-xs ml-2">(Uploading new images replaces the old ones)</span>}
                    </label>
                    <input 
                        type="file" 
                        multiple 
                        accept="image/png, image/jpeg, image/webp" 
                        onChange={handleImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                    />
                    
                    <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
                        {imagesPreview.map((src, idx) => (
                            <img 
                                key={idx} 
                                src={src} 
                                alt="Preview" 
                                className="h-24 w-24 object-cover rounded-lg border border-gray-200 shadow-sm" 
                            />
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isEditMode ? 'Update Product' : 'Create Product')}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/admin/products')}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;
