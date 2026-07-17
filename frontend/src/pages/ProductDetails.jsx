import Navbar from "../components/Navbar";
import Rating from "../components/Rating";
import PageTitle from "../components/PageTitle";
import Loader from "../components/Loader";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";

import { createReview, getProductDetails } from "../features/product/ProductSlice";

const ProductDetails = () => {
    const { loading, error, product } = useSelector(
        (state) => state.products
    );

    const { id } = useParams();
    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(1);

    const [userRating, setUserRating] = useState(0);
    const [comment, setComment] = useState("");
    const imageUrl =
        product?.images?.[0]?.url ||
        product?.image?.[0]?.url ||
        product?.image?.[0] ||
        "https://via.placeholder.com/500";

    useEffect(() => {
        if (id) {
        dispatch(getProductDetails(id));
        }
    }, [dispatch, id]);

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return (
        <div className="text-center text-red-500 text-2xl mt-20">
            {error}
        </div>
        );
    }


    const discountPercentage = product?.price
        ? Math.round(
            ((product?.MRP - product.price) /
            product?.MRP) *
            100
        )
        : 0;

    const increaseQty = () => {
        if (quantity >= product?.stock) return;
        setQuantity(quantity + 1);
    };

    const decreaseQty = () => {
        if (quantity <= 1) return;
        setQuantity(quantity - 1);
    };

    const colors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-orange-500",
        "bg-teal-500",
    ];

    const getAvatarColor = (name) => {
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getRatingColor = (rating) => {
        if (rating >= 4) return "bg-green-600";
        if (rating >= 3) return "bg-yellow-500";
        if (rating >= 2) return "bg-orange-500";
        return "bg-red-500";
    };

    
    const submitReviewHandler = async (e) => {
        e.preventDefault();

        await dispatch(
            createReview({
            rating: userRating,
            comment,
            productId: product._id,
            })
        );

        dispatch(getProductDetails(product._id));

        setComment("");
        setUserRating(0);
    };

    return (
        <>
        <PageTitle
            title={`${product?.name || "Product"} | Details`}
        />

        <Navbar />

        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="bg-white rounded-lg shadow-md max-w-6xl mx-auto p-8">

            <div className="grid md:grid-cols-2 gap-10">

                {/* Product Image */}
                <div>
                <img
                    src={imageUrl}
                    alt={product?.name}
                    className="w-full h-[450px] object-cover rounded-lg"
                />
                </div>

                {/* Product Details */}
                <div>

                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    {product?.name}
                </h1>

                {/* Rating */}
                <div className="flex flex-col items-start mb-6">
                    <div className="flex text-yellow-400">
                    <Rating
                    value={product?.ratings || 0}
                    disabled
                    />
                    </div>

                    <span className="text-gray-600 mt-2">
                    {product?.numOfReviews || 0} Reviews
                    </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                    <div className="flex items-center gap-3">

                    <span className="text-4xl font-bold text-orange-500">
                        ₹{product?.price}
                    </span>

                    <span className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm font-semibold">
                        {discountPercentage}% OFF
                    </span>

                    </div>

                    <span className="text-gray-400 line-through text-xl">
                    ₹{product?.MRP}
                    </span>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-8 mb-8">
                    {product?.description}
                </p>

                {/* Stock */}
                <div
                    className={`flex items-center gap-2 font-medium mb-8 ${
                    product?.stock > 0
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                >
                    <FaCheckCircle />

                    <span>
                    {product?.stock > 0
                        ? `IN STOCK (${product.stock} Available)`
                        : "OUT OF STOCK"}
                    </span>
                </div>

                {/* Quantity */}
                <div className="flex flex-wrap gap-4">

                    <div className="flex items-center border rounded-md overflow-hidden">

                    <button
                        onClick={decreaseQty}
                        className="px-4 py-3 hover:bg-gray-100 text-lg font-bold"
                    >
                        -
                    </button>

                    <span className="px-6 py-3 border-x">
                        {quantity}
                    </span>

                    <button
                        onClick={increaseQty}
                        className="px-4 py-3 hover:bg-gray-100 text-lg font-bold"
                    >
                        +
                    </button>

                    </div>

                    {/* Add To Cart */}
                    <button
                    disabled={product?.stock === 0}
                    className={`flex items-center gap-3 px-8 py-3 rounded-md shadow-lg transition ${
                        product?.stock > 0
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-400 text-white cursor-not-allowed"
                    }`}
                    >
                    <FaShoppingCart />
                    Add To Cart
                    </button>

                </div>
                
                <form
                    onSubmit={submitReviewHandler}
                    className="bg-white rounded-xl shadow-sm p-6 mb-8"
                    >
                    <h3 className="font-bold text-lg mb-4">
                        Share Your Feedback
                    </h3>

                    <Rating
                        value={userRating}
                        onRatingChange={setUserRating}
                    />

                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="How was the product quality and delivery?"
                        className="w-full border rounded-lg p-3 mt-4"
                        rows="4"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-900 text-white py-3 rounded-lg mt-4"
                    >
                        Post Review
                    </button>
                </form>


                </div>
            </div>

            {/* Reviews Section */}
            
            <div className="mt-12 rounded-xl bg-amber-50 p-4">
                <h2 className="text-3xl font-bold border-l-4 mb-8 p-1">
                    Customer Reviews
                    
                </h2>

                {product?.reviews?.length > 0 ? (
                    <div className="grid md:grid-cols-2 gap-6">
                        {product?.reviews?.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition"
                        >
                            {/* User Info */}
                            <div className="flex items-center justify-between mb-4">

                            <div className="flex items-center gap-3">
                                
                                {
                                    review?.avatar &&
                                    review.avatar.startsWith("http") ? (
                                        <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div
                                        className={`w-12 h-12 rounded-full text-white flex items-center justify-center text-xl font-bold ${getAvatarColor(
                                            review?.name
                                        )}`}
                                        >
                                        {review?.name?.charAt(0).toUpperCase()}
                                        </div>
                                    )
                                }

                                <div>
                                <h3 className="text-lg font-semibold text-gray-800">
                                    {review.name}
                                </h3>

                                {/* Rating */}
                                <div className="mt-1">
                                    <div
                                    className={`${getRatingColor(
                                        review.rating
                                    )} text-white px-3 py-1 rounded-full inline-flex items-center gap-1 text-sm font-semibold`}
                                    >
                                    {review.rating}
                                    <span>★</span>
                                    </div>
                                </div>
                                </div>
                            </div>

                            {/* Date */}
                            <span className="text-gray-400 text-sm">
                                {new Date(review.createdAt).toLocaleDateString(
                                "en-GB",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                                )}
                            </span>

                            </div>

                            {/* Comment */}
                            <p className="text-gray-600 italic leading-7">
                            "{review.comment}"
                            </p>

                        </div>
                        ))}
                    </div>
                    ) : (
                    <div className="text-center py-10 text-gray-500">
                        No Reviews Yet
                    </div>
                )}
                </div>

            </div>
        </div>
        </>
    );
};

export default ProductDetails;
