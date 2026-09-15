import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
FiArrowLeft,
FiCreditCard,
FiPackage,
FiShoppingBag,
FiTruck,
} from 'react-icons/fi';
import PageTitle from '../components/PageTitle';
import OrderSuccessModal from '../components/OrderSuccessModal';
import { createOrder } from '../features/order/orderSlice';
import { clearCart } from '../features/cart/cartSlice';

const TAX_RATE = 0.18;
const SHIPPING_PRICE = 0;
const API_BASE_URL = '/api/v1';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || 'rzp_test_1DP5mmOlF5G5ag';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { items, totalPrice } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    const { loading: orderLoading } = useSelector((state) => state.order);

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        state: '',
        country: '',
        pinCode: '',
        phoneNo: '',
    });
    const [processing, setProcessing] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdOrder, setCreatedOrder] = useState(null);
    const [orderPlaced, setOrderPlaced] = useState(false);

    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    if (items.length === 0) {
        navigate('/cart');
        return null;
    }

    const itemsPrice = Number(totalPrice || 0);
    const taxPrice = Number((itemsPrice * TAX_RATE).toFixed(2));
    const finalTotal = Number((itemsPrice + taxPrice + SHIPPING_PRICE).toFixed(2));

    const steps = [
        { id: 1, label: 'Shipping', icon: FiTruck },
        { id: 2, label: 'Confirm Order', icon: FiPackage },
        { id: 3, label: 'Payment', icon: FiCreditCard },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        if (!formData.address.trim()) {
        toast.error('Please enter your address', { position: 'bottom-right' });
        return false;
        }
        if (!formData.city.trim()) {
        toast.error('Please enter your city', { position: 'bottom-right' });
        return false;
        }
        if (!formData.state.trim()) {
        toast.error('Please enter your state', { position: 'bottom-right' });
        return false;
        }
        if (!formData.country.trim()) {
        toast.error('Please enter your country', { position: 'bottom-right' });
        return false;
        }
        if (!formData.pinCode.toString().trim()) {
        toast.error('Please enter your pin code', { position: 'bottom-right' });
        return false;
        }
        if (!formData.phoneNo.toString().trim() || formData.phoneNo.toString().length < 10) {
        toast.error('Please enter a valid phone number', { position: 'bottom-right' });
        return false;
        }
        return true;
    };

    const handleContinueToPayment = () => {
        if (!validateForm()) return;
        setStep(2);
    };

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
        const existingScript = document.getElementById('razorpay-checkout-script');
        if (existingScript) {
            if (window.Razorpay) {
            resolve(true);
            return;
            }
            existingScript.onload = () => resolve(true);
            existingScript.onerror = () => resolve(false);
            return;
        }

        const script = document.createElement('script');
        script.id = 'razorpay-checkout-script';
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
        });

    const createOrderAfterPayment = async (paymentResult) => {
        if (orderPlaced) return;
        setOrderPlaced(true);
        setProcessing(true);

        try {
        const orderItems = items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images?.[0]?.url || '/default-product.png',
            product: item.productId,
        }));

        const orderData = {
            shippingInfo: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            pinCode: Number(formData.pinCode),
            phoneNo: Number(formData.phoneNo),
            },
            orderItems,
            paymentInfo: {
            id: paymentResult.razorpay_payment_id,
            order_id: paymentResult.razorpay_order_id,
            signature: paymentResult.razorpay_signature,
            status: 'succeeded',
            },
            itemsPrice,
            taxPrice,
            shippingPrice: SHIPPING_PRICE,
            totalPrice: finalTotal,
        };

        const resultAction = await dispatch(createOrder(orderData));

        if (createOrder.fulfilled.match(resultAction)) {
            await dispatch(clearCart());
            setCreatedOrder(resultAction.payload);
            setShowSuccessModal(true);
        } else {
            throw new Error(resultAction.payload || 'Order creation failed');
        }
        } catch (error) {
        setOrderPlaced(false);
        toast.error(error.message || 'Payment failed. Please try again.', {
            position: 'bottom-right',
            autoClose: 3000,
        });
        } finally {
        setProcessing(false);
        }
    };

    const handlePayment = async () => {
        if (!validateForm()) return;
        if (processing || orderPlaced) return;

        try {
            setProcessing(true);

            const { data } = await axios.post(
                `${API_BASE_URL}/payment/create-order`,
                {
                    amount: Math.round(finalTotal * 100),
                    currency: 'INR',
                    receipt: `receipt_${Date.now()}`,
                },
                {
                    withCredentials: true,
                }
            );

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded || !window.Razorpay) {
                toast.error('Razorpay is not available right now. Please try again.', {
                    position: 'bottom-right',
                    autoClose: 3000,
                });
                setProcessing(false);
                return;
            }

            const options = {
                key: RAZORPAY_KEY,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'E-Commerce App',
                description: 'Order Payment',
                image: 'https://s3.amazonaws.com/rzp-mobile/images/rzp.jpg',
                order_id: data.order.id,
                handler: async function (response) {
                    await createOrderAfterPayment(response);
                },
                prefill: {
                    name: user?.name || '',
                    email: user?.email || '',
                    contact: formData.phoneNo || '',
                },
                notes: {
                    address: formData.address,
                },
                theme: {
                    color: '#2563eb',
                },
                upi: {
                    flow: "intent"
                },
                modal: {
                    ondismiss: function () {
                        setOrderPlaced(false);
                        setProcessing(false);
                    },
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Razorpay order error:', error);
            toast.error(error.response?.data?.message || 'Unable to start Razorpay payment right now.', {
                position: 'bottom-right',
                autoClose: 3000,
            });
            setProcessing(false);
        }
    };

    const renderShippingStep = () => (
        <div className="bg-white rounded-3xl shadow-sm border border-[#e5e7eb] p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 mb-8">
            {steps.map((item) => {
            const isActive = item.id === step;
            const isPast = item.id < step;
            const Icon = item.icon;
            return (
                <div key={item.id} className="flex-1 flex flex-col items-center">
                <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_0_8px_rgba(59,130,246,0.15)]'
                        : isPast
                        ? 'bg-blue-100 border-blue-600 text-blue-600'
                        : 'bg-white border-[#d1d5db] text-gray-400'
                    }`}
                >
                    <Icon size={22} />
                </div>
                <div className="mt-3 text-center text-sm font-medium text-gray-600">{item.label}</div>
                </div>
            );
            })}
        </div>

        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Shipping Information</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
            <label className="block text-gray-700 font-medium mb-2">Address</label>
            <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Cherry Road"
                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            </div>

            <div>
            <label className="block text-gray-700 font-medium mb-2">Country</label>
            <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
                <option value="">Select country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
            </select>
            </div>

            <div>
            <label className="block text-gray-700 font-medium mb-2">Pincode</label>
            <input
                type="number"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleInputChange}
                placeholder="636007"
                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            </div>

            <div>
            <label className="block text-gray-700 font-medium mb-2">State</label>
            <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
                <option value="">Select state</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
            </select>
            </div>

            <div>
            <label className="block text-gray-700 font-medium mb-2">Phone Number</label>
            <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                placeholder="9043017689"
                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            </div>

            <div>
            <label className="block text-gray-700 font-medium mb-2">City</label>
            <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
                <option value="">Select city</option>
                <option value="Salem">Salem</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
            </select>
            </div>
        </div>

        <button
            onClick={handleContinueToPayment}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors"
        >
            Continue to Payment
        </button>
        </div>
    );

    const renderConfirmStep = () => (
        <div className="bg-white rounded-3xl shadow-sm border border-[#e5e7eb] p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 mb-8">
            {steps.map((item) => {
            const isActive = item.id === step;
            const isPast = item.id < step;
            const Icon = item.icon;
            return (
                <div key={item.id} className="flex-1 flex flex-col items-center">
                <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_0_8px_rgba(59,130,246,0.15)]'
                        : isPast
                        ? 'bg-blue-100 border-blue-600 text-blue-600'
                        : 'bg-white border-[#d1d5db] text-gray-400'
                    }`}
                >
                    <Icon size={22} />
                </div>
                <div className="mt-3 text-center text-sm font-medium text-gray-600">{item.label}</div>
                </div>
            );
            })}
        </div>

        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Order Confirmation</h2>
        </div>

        <div className="space-y-6">
            <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                <p className="text-gray-500 mb-1">Name</p>
                <p className="font-semibold">{user?.name || 'Guest User'}</p>
                </div>
                <div>
                <p className="text-gray-500 mb-1">Phone</p>
                <p className="font-semibold">{formData.phoneNo}</p>
                </div>
                <div className="md:col-span-2">
                <p className="text-gray-500 mb-1">Address</p>
                <p className="font-semibold">
                    {formData.address}, {formData.city}, {formData.state}, {formData.country} - {formData.pinCode}
                </p>
                </div>
            </div>
            </div>

            <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Your Cart Items</h3>
            <div className="space-y-3">
                {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-b-0">
                    <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                        {item.images?.[0]?.url ? (
                        <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                        <FiShoppingBag className="text-gray-400" />
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">₹{item.price} each</p>
                    </div>
                    </div>
                    <div className="text-right">
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </div>

        <div className="mt-8 flex justify-between gap-4">
            <button
            type="button"
            onClick={() => setStep(1)}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
            >
            Go Back
            </button>
            <button
            type="button"
            onClick={() => setStep(3)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
            >
            Proceed to Payment
            </button>
        </div>
        </div>
    );

    const renderPaymentStep = () => (
        <div className="bg-white rounded-3xl shadow-sm border border-[#e5e7eb] p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4 mb-8">
            {steps.map((item) => {
            const isActive = item.id === step;
            const isPast = item.id < step;
            const Icon = item.icon;
            return (
                <div key={item.id} className="flex-1 flex flex-col items-center">
                <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive
                        ? 'bg-blue-600 border-blue-600 text-white shadow-[0_0_0_8px_rgba(59,130,246,0.15)]'
                        : isPast
                        ? 'bg-blue-100 border-blue-600 text-blue-600'
                        : 'bg-white border-[#d1d5db] text-gray-400'
                    }`}
                >
                    <Icon size={22} />
                </div>
                <div className="mt-3 text-center text-sm font-medium text-gray-600">{item.label}</div>
                </div>
            );
            })}
        </div>

        <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Payment</h2>
        </div>

        <div className="flex flex-col items-center justify-center min-h-55">
            <button
            onClick={handlePayment}
            disabled={processing || orderLoading}
            className="w-full max-w-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
            {processing || orderLoading ? (
                <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Processing...
                </>
            ) : (
                <>
                <FiCreditCard size={20} />
                Pay (₹{finalTotal.toFixed(2)})
                </>
            )}
            </button>
        </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
        <PageTitle title="Checkout" />

        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-6">
            <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-semibold"
            >
            <FiArrowLeft size={20} />
            Back to Cart
            </button>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.9fr_0.9fr]">
            <div>
                {step === 1 && renderShippingStep()}
                {step === 2 && renderConfirmStep()}
                {step === 3 && renderPaymentStep()}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-[#e5e7eb] p-6 h-fit">
                <h3 className="text-2xl font-bold text-gray-800 mb-5">Order Summary</h3>

                <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{itemsPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span className="font-semibold">₹{taxPrice.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-blue-600">₹{finalTotal.toFixed(2)}</span>
                </div>
                </div>

                <div className="mt-6 space-y-3">
                {items.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-gray-100 overflow-hidden flex items-center justify-center">
                        {item.images?.[0]?.url ? (
                            <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <FiShoppingBag size={14} className="text-gray-400" />
                        )}
                        </div>
                        <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-xs">Qty: {item.quantity}</p>
                        </div>
                    </div>
                    <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>

        <OrderSuccessModal
            isOpen={showSuccessModal}
            order={createdOrder}
            onClose={() => {
            setShowSuccessModal(false);
            navigate('/product');
            }}
            onViewOrder={() => {
            if (createdOrder?._id) {
                navigate(`/order/${createdOrder._id}`);
            }
            }}
        />
        </div>
    );
};

export default Checkout;
