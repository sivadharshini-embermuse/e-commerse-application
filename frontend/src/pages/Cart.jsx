import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartQuantity, getCart } from '../features/cart/cartSlice';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import PageTitle from '../components/PageTitle';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalPrice, totalQuantity } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.user);

    // Load cart on mount
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getCart());
        }
    }, [isAuthenticated, dispatch]);

    const handleRemoveItem = async (productId) => {
        try {
            await dispatch(removeFromCart(productId)).unwrap();
            toast.success('Item removed from cart', {
                position: "bottom-right",
                autoClose: 2000,
            });
        } catch (error) {
            toast.error(error || 'Failed to remove item', {
                position: "bottom-right",
                autoClose: 2000,
            });
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        if (quantity > 0) {
            try {
                await dispatch(updateCartQuantity({ productId, quantity })).unwrap();
            } catch (error) {
                toast.error(error || 'Failed to update quantity', {
                    position: "bottom-right",
                    autoClose: 2000,
                });
            }
        }
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-100">
                <PageTitle title="Shopping Cart" />
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8">Start shopping by exploring our products</p>
                        <button
                            onClick={() => navigate('/product')}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <PageTitle title="Shopping Cart" />
            
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Cart Items ({totalQuantity})
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className="p-6 flex gap-6 hover:bg-gray-50 transition-colors"
                                    >
                                        {/* Product Image */}
                                        <div className="shrink-0 w-24 h-24">
                                            <img
                                                src={item.images?.[0]?.url || '/default-product.png'}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <h3
                                                onClick={() => navigate(`/product/${item.productId}`)}
                                                className="text-lg font-semibold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors mb-2"
                                            >
                                                {item.name}
                                            </h3>
                                            
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {item.description}
                                            </p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-blue-600 font-bold text-lg">
                                                        ₹{item.price}
                                                    </span>
                                                    {item.originalPrice && (
                                                        <span className="text-gray-400 line-through text-sm">
                                                            ₹{item.originalPrice}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.productId,
                                                                item.quantity - 1
                                                            )
                                                        }
                                                        className="text-gray-600 hover:text-blue-600 transition-colors p-1"
                                                        title="Decrease quantity"
                                                    >
                                                        <FiMinus size={18} />
                                                    </button>
                                                    <span className="w-8 text-center font-semibold text-gray-800">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleQuantityChange(
                                                                item.productId,
                                                                item.quantity + 1
                                                            )
                                                        }
                                                        className="text-gray-600 hover:text-blue-600 transition-colors p-1"
                                                        title="Increase quantity"
                                                    >
                                                        <FiPlus size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Subtotal & Remove */}
                                        <div className="flex flex-col items-end justify-between">
                                            <div className="text-right">
                                                <p className="text-gray-600 text-sm mb-1">Subtotal</p>
                                                <p className="text-xl font-bold text-gray-800">
                                                    ₹{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>

                                            <button
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                                title="Remove from cart"
                                            >
                                                <FiTrash2 size={22} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="h-fit">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h3>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({totalQuantity} items)</span>
                                    <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping</span>
                                    <span className="font-semibold text-green-600">FREE</span>
                                </div>

                                <div className="flex justify-between text-gray-700">
                                    <span>Tax</span>
                                    <span className="font-semibold">
                                        ₹{(totalPrice * 0.18).toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <span className="text-lg font-bold text-gray-800">Total</span>
                                <span className="text-2xl font-bold text-blue-600">
                                    ₹{(totalPrice + totalPrice * 0.18).toFixed(2)}
                                </span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-bold text-lg transition-colors mb-3"
                            >
                                Proceed to Checkout
                            </button>

                            <button
                                onClick={() => navigate('/product')}
                                className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 font-bold transition-colors"
                            >
                                Continue Shopping
                            </button>

                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700">
                                    ✓ Secure checkout<br />
                                    ✓ Free shipping on orders above ₹500<br />
                                    ✓ Easy returns within 7 days
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
