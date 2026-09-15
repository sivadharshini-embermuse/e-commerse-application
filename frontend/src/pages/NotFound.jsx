import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-6">
        {/* 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold text-blue-600">
            404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-800">
            Oops! Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-gray-600 text-center max-w-md">
            The page you are looking for doesn't exist or you don't have permission
            to access it.
        </p>

        {/* Button */}
        <Link
            to="/"
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
        >
            Go Back Home
        </Link>
        </div>
    );
};

export default NotFound;