import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { resetPassword } from "../features/user/userSlice";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useParams();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(
            resetPassword({
                token,
                passwords: {
                    password: newPassword,
                    confirmpassword: confirmPassword,
                },
            })
        );

        if (resetPassword.fulfilled.match(result)) {
            toast.success(result.payload.message);

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        }

        if (resetPassword.rejected.match(result)) {
            toast.error(result.payload.message);
        }

    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">

                    <h1 className="text-3xl font-bold text-center mb-8">
                        Reset Password
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your new password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                placeholder="Enter your confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                        >
                            Reset Password
                        </button>

                    </form>

                </div>
            </div>
        </>
    );
};

export default ResetPassword;