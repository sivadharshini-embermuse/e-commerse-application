import { Link } from "react-router-dom";
import Rating from "./Rating";

const Product = ({ product }) => {
    const imageUrl =
        product.images?.[0]?.url ||
        product.image?.[0]?.url ||
        product.image?.[0] ||
        'https://via.placeholder.com/150';

    return (
        <Link to={`/product/${product._id}`}>
            <div
                key={product._id}
                className= "w-full bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition"
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

                    <p className="text-sm text-gray-500 mt-1 min-h-[40px]">
                        {product.description}
                    </p>

                    <div className="flex items-center gap-1 text-orange-400 text-sm mt-3">
                        <Rating value={product.ratings || 0} disabled />
                        <span className= "text-xs text-gray-500">
                            ({product.numOfReviews} reviews)
                        </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                        <span className="text-blue-600 font-bold text-xl">
                            ₹{product.price}
                        </span>

                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
                            Add to Cart
                        </button>
                    </div>

                </div>
            </div>
        </Link>
        
    )
}

export default Product
