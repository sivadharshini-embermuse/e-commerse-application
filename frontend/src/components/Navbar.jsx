import { useState, useRef, useEffect } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { RxPerson } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../features/user/userSlice";
import { getCart } from "../features/cart/cartSlice";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const { isAuthenticated, user } = useSelector(
        (state) => state.user
    );

    const { items, totalQuantity } = useSelector(
        (state) => state.cart
    );

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const desktopDropdownRef = useRef(null);
    const mobileDropdownRef = useRef(null);
    const cartDropdownRef = useRef(null);

    // Load cart on mount or when user logs in
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getCart());
        }
    }, [isAuthenticated, dispatch]);

    // =========================
    // SEARCH
    // =========================

    const handleSearch = (e) => {
        e.preventDefault();

        if (searchQuery.trim()) {
            navigate(
                `/product?keyword=${encodeURIComponent(
                    searchQuery.trim()
                )}`
            );
        } else {
            navigate("/product");
        }

        setSearchQuery("");
    };

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = async (e) => {
        e.preventDefault();

        await dispatch(logout());

        setProfileDropdownOpen(false);
        navigate("/login");
    };

    // =========================
    // CART
    // =========================

    const handleCartClick = () => {
        navigate("/cart");
        setCartDropdownOpen(false);
    };

    // =========================
    // CLOSE DROPDOWNS
    // =========================

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                desktopDropdownRef.current &&
                desktopDropdownRef.current.contains(event.target)
            ) {
                return;
            }

            if (
                mobileDropdownRef.current &&
                mobileDropdownRef.current.contains(event.target)
            ) {
                return;
            }

            if (
                cartDropdownRef.current &&
                cartDropdownRef.current.contains(event.target)
            ) {
                return;
            }

            setProfileDropdownOpen(false);
            setCartDropdownOpen(false);
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener(
                "click",
                handleClickOutside
            );
        };
    }, []);

    // =========================
    // JSX
    // =========================

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6">

                <div className="flex justify-between items-center h-16">

                    {/* ================= LOGO ================= */}

                    <div className="text-2xl font-bold text-blue-600">
                        MyLogo
                    </div>

                    {/* ================= DESKTOP / TABLET ================= */}

                    <div className="hidden md:flex items-center gap-6">

                        {/* Navigation Menu */}

                        <div className="flex space-x-8">

                            <Link
                                to="/"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Home
                            </Link>

                            <Link
                                to="/product"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Product
                            </Link>

                            <Link
                                to="/about"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                About
                            </Link>

                            <Link
                                to="/contact"
                                className="text-gray-700 hover:text-blue-600"
                            >
                                Contact
                            </Link>

                        </div>

                        {/* ================= SEARCH ================= */}

                        <form
                            onSubmit={handleSearch}
                            className="flex items-center border rounded-lg px-3 py-2"
                        >

                            <button
                                type="submit"
                                className="mr-2"
                            >
                                <FiSearch className="text-gray-500" />
                            </button>

                            <input
                                type="text"
                                placeholder="Search..."
                                className="outline-none bg-transparent"
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                            />

                        </form>

                        {/* ================= CART ================= */}

                        <div
                            ref={cartDropdownRef}
                            className="relative"
                        >

                            <button
                                onClick={() =>
                                    setCartDropdownOpen(
                                        !cartDropdownOpen
                                    )
                                }
                                className="relative hover:text-blue-600 transition-colors"
                            >

                                <FiShoppingCart size={24} />

                                {totalQuantity > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                        {totalQuantity}
                                    </span>
                                )}

                            </button>

                            {/* ================= CART DROPDOWN ================= */}

                            {cartDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200">

                                    <div className="p-4">

                                        <h3 className="text-lg font-semibold mb-4">
                                            Shopping Cart
                                        </h3>

                                        {items.length > 0 ? (
                                            <>
                                                {/* Cart Items */}

                                                <div className="max-h-64 overflow-y-auto">

                                                    {items
                                                        .slice(0, 3)
                                                        .map((item) => (

                                                            <div
                                                                key={item._id}
                                                                className="flex gap-3 pb-3 mb-3 border-b last:border-b-0"
                                                            >

                                                                {/* Image */}

                                                                <img
                                                                    src={
                                                                        item.images?.[0]
                                                                            ?.url ||
                                                                        "/default-product.png"
                                                                    }
                                                                    alt={item.name}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                />

                                                                {/* Details */}

                                                                <div className="flex-1">

                                                                    <p className="font-semibold text-sm line-clamp-2">
                                                                        {item.name}
                                                                    </p>

                                                                    <p className="text-blue-600 font-bold">
                                                                        ₹
                                                                        {item.price}
                                                                    </p>

                                                                    <p className="text-xs text-gray-500">
                                                                        Qty:{" "}
                                                                        {item.quantity}
                                                                    </p>

                                                                </div>

                                                            </div>

                                                        ))}

                                                </div>

                                                {/* More Items */}

                                                {items.length > 3 && (
                                                    <p className="text-xs text-gray-500 text-center py-2">
                                                        +{" "}
                                                        {items.length -
                                                            3}{" "}
                                                        more items
                                                    </p>
                                                )}

                                                {/* View Cart */}

                                                <button
                                                    onClick={handleCartClick}
                                                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold"
                                                >
                                                    View Cart
                                                </button>

                                            </>
                                        ) : (

                                            <p className="text-center text-gray-500 py-8">
                                                Your cart is empty
                                            </p>

                                        )}

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* ================= AUTH ================= */}

                        {!isAuthenticated ? (

                            <div className="flex flex-col sm:flex-row gap-3">

                                <button
                                    onClick={() =>
                                        navigate("/login")
                                    }
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    Login
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                                >

                                    <RxPerson
                                        size={20}
                                        className="mr-2"
                                    />

                                    Register

                                </button>

                            </div>

                        ) : (

                            /* ================= PROFILE ================= */

                            <div
                                ref={desktopDropdownRef}
                                className="relative"
                            >

                                <button
                                    onClick={() =>
                                        setProfileDropdownOpen(
                                            !profileDropdownOpen
                                        )
                                    }
                                    className="flex items-center gap-2"
                                >

                                    <img
                                        src={
                                            user?.avatar?.url ||
                                            "/default-avatar.png"
                                        }
                                        alt={user?.name || "User"}
                                        title={user?.name || "User"}
                                        className="w-10 h-10 rounded-full object-cover border border-blue-600"
                                    />

                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100">

                                        {/* User Info */}

                                        <div className="px-4 py-3 border-b">

                                            <p className="font-semibold">
                                                {user?.name || "User"}
                                            </p>

                                            <p className="text-xs text-gray-500 break-all">
                                                {user?.email || "Email"}
                                            </p>

                                        </div>

                                        {/* Profile */}

                                        <button
                                            onClick={() => {
                                                setProfileDropdownOpen(
                                                    false
                                                );
                                                navigate("/profile");
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            My Profile
                                        </button>

                                        {/* Admin Panel */}
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin/dashboard"
                                                onClick={() => setProfileDropdownOpen(false)}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600 font-semibold border-t border-gray-100"
                                            >
                                                Admin Panel
                                            </Link>
                                        )}

                                        {/* Wishlist */}

                                        <Link
                                            to="/product"
                                            onClick={() =>
                                                setProfileDropdownOpen(
                                                    false
                                                )
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Wishlist
                                        </Link>

                                        {/* Logout */}

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>

                                    </div>
                                )}

                            </div>

                        )}

                    </div>

                    {/* ================= MOBILE ================= */}

                    <div className="flex md:hidden items-center gap-4">

                        {/* Mobile Search */}

                        <form
                            onSubmit={handleSearch}
                            className="flex items-center border rounded-lg"
                        >

                            <button
                                type="submit"
                                className="mr-2 ml-2"
                            >
                                <FiSearch className="text-gray-500" />
                            </button>

                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-20 outline-none bg-transparent text-sm"
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                            />

                        </form>

                        {/* Mobile Cart */}

                        <button
                            onClick={() =>
                                navigate("/cart")
                            }
                            className="relative hover:text-blue-600 transition-colors"
                        >

                            <FiShoppingCart size={24} />

                            {totalQuantity > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                                    {totalQuantity}
                                </span>
                            )}

                        </button>

                        {/* Mobile Auth */}

                        {!isAuthenticated ? (

                            <button
                                onClick={() =>
                                    navigate("/login")
                                }
                                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs"
                            >
                                Login
                            </button>

                        ) : (

                            <div
                                ref={mobileDropdownRef}
                                className="relative"
                            >

                                <button
                                    onClick={() =>
                                        setProfileDropdownOpen(
                                            !profileDropdownOpen
                                        )
                                    }
                                    className="flex items-center"
                                >

                                    <img
                                        src={
                                            user?.avatar?.url ||
                                            "/default-avatar.png"
                                        }
                                        alt={
                                            user?.name || "User"
                                        }
                                        className="w-9 h-9 rounded-full object-cover border border-blue-600"
                                    />

                                </button>

                                {profileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100">

                                        <div className="px-4 py-3 border-b">

                                            <p className="font-semibold">
                                                {user?.name || "User"}
                                            </p>

                                            <p className="text-xs text-gray-500 break-all">
                                                {user?.email || "Email"}
                                            </p>

                                        </div>

                                        <button
                                            onClick={() => {
                                                setProfileDropdownOpen(
                                                    false
                                                );
                                                navigate("/profile");
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            My Profile
                                        </button>

                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin/dashboard"
                                                onClick={() => setProfileDropdownOpen(false)}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-blue-600 font-semibold border-t border-gray-100"
                                            >
                                                Admin Panel
                                            </Link>
                                        )}

                                        <Link
                                            to="/product"
                                            onClick={() =>
                                                setProfileDropdownOpen(
                                                    false
                                                )
                                            }
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Wishlist
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-red-50"
                                        >
                                            Logout
                                        </button>

                                    </div>
                                )}

                            </div>

                        )}

                        {/* Hamburger */}

                        <button
                            className="text-2xl"
                            onClick={() =>
                                setIsOpen(!isOpen)
                            }
                        >
                            ☰
                        </button>

                    </div>

                </div>

                {/* ================= MOBILE MENU ================= */}

                {isOpen && (
                    <div className="md:hidden flex flex-col items-center text-center py-4 space-y-4 border-t">

                        <Link
                            to="/"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Home
                        </Link>

                        <Link
                            to="/product"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Product
                        </Link>

                        <Link
                            to="/about"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 hover:text-blue-600"
                        >
                            About
                        </Link>

                        <Link
                            to="/contact"
                            onClick={() => setIsOpen(false)}
                            className="text-gray-700 hover:text-blue-600"
                        >
                            Contact
                        </Link>

                    </div>
                )}

            </div>
        </nav>
    );
};

export default Navbar;