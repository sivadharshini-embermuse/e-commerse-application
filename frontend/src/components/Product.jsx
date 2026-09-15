import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import Rating from "./Rating";
import { toast } from 'react-toastify';

const Product = ({ product }) => {
    const dispatch = useDispatch();
    const imageUrl =
        product.images?.[0]?.url ||
        product.image?.[0]?.url ||
        product.image?.[0] ||
        'https://via.placeholder.com/150';

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        try {
            const result = await dispatch(addToCart({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: 1,
                description: product.description,
                images: product.images || product.image,
                stock: product.stock,
            })).unwrap();

            toast.success(`${product.name} added to cart!`, {
                position: "bottom-right",
                autoClose: 2000,
            });
        } catch (error) {
            toast.error(error || 'Failed to add to cart', {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
    };

    return (
        <Link to={`/product/${product._id}`}>
            <div
                key={product._id}
                className= "w-full h-full bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
            >
                <img
                    src={imageUrl}
                    alt={product.name || 'Product image'}
                    className="w-full h-45 object-cover"
                />

                <div className="p-4">
                    <h2 className="font-semibold text-gray-800">
                        {product.name}
                    </h2>

                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 max-h-40">
                        {product.description}
                    </p>

                    <div className="flex flex-col items-start mt-3">
                        <div className="flex items-center text-orange-400 text-sm">
                            <Rating value={product.ratings || 0} disabled />
                        </div>
                        <div>
                        <span className = "text-xs text-gray-500 mt-1">
                            ({product.numOfReviews} reviews)
                        </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <span className="text-blue-600 font-bold text-xl">
                            ₹{product.price}
                        </span>

                        <button 
                            onClick={handleAddToCart}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-1.5 py-1.5 rounded transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>

                </div>
            </div>
        </Link>
        
    )
}

export default Product
