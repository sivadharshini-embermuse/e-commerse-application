import { useState } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
const Navbar = () => {
const [isOpen, setIsOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState("");
const navigate = useNavigate();
const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()){
        navigate(`/product?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }else{
        navigate("/product");
    }
    setSearchQuery("");
};
return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600">
            MyLogo
        </div>

        {/* Desktop & Tablet */}
        <div className="hidden md:flex items-center gap-6">

            {/* Menu */}
            <div className="flex space-x-8">
            <a href="/" className="text-gray-700 hover:text-blue-600">
                Home
            </a>
            <a href="/product" className="text-gray-700 hover:text-blue-600">
                Product
            </a>
            <a href="/about" className="text-gray-700 hover:text-blue-600">
                About
            </a>
            <a href="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
            </a>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center border rounded-lg px-3 py-2">
            <button type="submit" className="mr-2">
                <FiSearch className="text-gray-500" />
            </button>
            <input
                type="text"
                placeholder="Search..."
                className="outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            </form>

            {/* Cart */}
            <div className="relative cursor-pointer">
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                3
            </span>
            </div>

            {/* Register Button */}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
            <RxPerson size={20} className="mr-2" />
            Register
            </button>

        </div>

        {/* Mobile Only */}
        <div className="flex md:hidden items-center gap-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex items-center border rounded-lg px-3 py-2">
            <button type="submit" className="mr-2">
                <FiSearch className="text-gray-500" />
            </button>
            <input
                type="text"
                placeholder="Search..."
                className="outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            </form>
            

            {/* Cart */}
            <div className="relative cursor-pointer">
            <FiShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                3
            </span>
            </div>

            {/* Hamburger */}
            <button
            className="text-2xl"
            onClick={() => setIsOpen(!isOpen)}
            >
            ☰
            </button>

        </div>

        </div>

        {/* Mobile Menu */}
        {isOpen && (
        <div className="md:hidden flex flex-col items-center text-center py-4 space-y-4">

            <a href="/" className="text-gray-700 hover:text-blue-600">
            Home
            </a>

            <a href="/product" className="text-gray-700 hover:text-blue-600">
            Product
            </a>

            <a href="/about" className="text-gray-700 hover:text-blue-600">
            About
            </a>

            <a href="/contact" className="text-gray-700 hover:text-blue-600">
            Contact
            </a>

        </div>
        )}
    </div>
    </nav>
);
}
export default Navbar;