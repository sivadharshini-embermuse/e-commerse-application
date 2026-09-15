import { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { forgotPassword } from "../features/user/userSlice";

const ForgetPassword = () => {
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(
            forgotPassword({ email })
        );

        if (forgotPassword.fulfilled.match(result)) {
            toast.success(result.payload.message);
        }

        if (forgotPassword.rejected.match(result)) {
            toast.error(result.payload.message);
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

                    <h1 className="text-3xl font-bold text-center mb-8">
                        Forget Password
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-300"
                        >
                            Send Reset Link
                        </button>
                    </form>

                </div>
            </div>
        </>
    );
};

export default ForgetPassword;