import toast from "react-hot-toast"
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch } from "react-redux";
import { loadUser, updateProfile } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";



const UpdateProfile = () => {
    // const { user } = useSelector((state) => state.user);
    const {user} = useSelector((state) => state.user);
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar?.url || "https://www.seekpng.com/png/full/514-5147412_default-avatar-png.png"
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
            setAvatarPreview(reader.result);
            setAvatar(reader.result);
            }
        };

        reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const myForm = new FormData();
        myForm.set("name", name);
        myForm.set("email", email);
        if(avatar){
        myForm.append("avatar", avatar);
        }
        const result = await dispatch(updateProfile(myForm));
        

        if (updateProfile.fulfilled.match(result)) {
            toast.success("Profile updated successfully!");
            await dispatch(loadUser());
            setTimeout(() => {
                navigate("/profile");
            }, 1000);
        }
        if (updateProfile.rejected.match(result)) {
            toast.error(result.payload?.message || "Profile update failed!");
        }

    };

    return (
        <>
        <Navbar />

        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Update Profile
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />

                <label className="mt-4 cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Change Photo
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    />
                </label>
                </div>

                {/* Name */}
                <div>
                <label className="block font-semibold mb-2">
                    Full Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                </div>

                {/* Email */}
                <div>
                <label className="block font-semibold mb-2">
                    Email Address
                </label>

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                >
                    Update Changes
                </button>

                <Link
                    to="/profile"
                    className="flex-1 text-center border border-gray-400 py-3 rounded-lg hover:bg-gray-100 font-semibold"
                >
                    Cancel
                </Link>
                </div>
            </form>
            </div>
        </div>
        </>
    );
};

export default UpdateProfile;