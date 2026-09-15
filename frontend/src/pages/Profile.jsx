import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {Link} from "react-router-dom";
import NotFound from "./NotFound";
const Profile = () => {
    const {isAuthenticated,user} = useSelector((state) => state.user);

    
    return isAuthenticated ? (
        <>
        <Navbar /> 
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-10">
            My Profile
        </h1>

        <div className="bg-white w-full max-w-md shadow-md border rounded-md p-6">
            {/* Avatar */}
            <div className="flex justify-center -mt-2 mb-6">
            <img
                src={user?.avatar?.url || "https://res.cloudinary.com/demo/image/upload/v1690000000/avatar.png"}
                alt={user?.name || "Avatar"}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
            />
            </div>

            {/* Name */}
            <div className="bg-gray-100 rounded-lg p-4 mb-5">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                Full Name
            </p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
                {user?.name}
            </p>
            </div>

            {/* Email */}
            <div className="bg-gray-100 rounded-lg p-4 mb-8">
            <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                Email Address
            </p>
            <p className="text-lg font-semibold text-gray-800 mt-1">
                {user?.email}
            </p>
            </div>

            {/* Button */}
            <div className="flex justify-center gap-2">
                <button
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
                    >
                    <Link
                    to="/profile/update"
                    >Edit Profile</Link>
                </button>
                <a href="/password/updatepassword"
                className="text-center w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition">
                    Change Password
                </a>
            </div>
            
        </div>
        </div>
        </>
        ):(
            <NotFound />
        )
    };

export default Profile;