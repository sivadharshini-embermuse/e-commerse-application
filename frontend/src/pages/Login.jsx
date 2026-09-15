import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

import { login, removeErrors, removeSuccess } from "../features/user/userSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector((state) => state.user);

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const { email, password } = user;
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setUser((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const loginSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill out all the required fields", {
                position: "top-center",
                duration: 3000,
            });
            return;
        }

        dispatch(login({ email, password }));
    };

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center",
                duration: 3000,
            });
            dispatch(removeErrors());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success("Login successful!", {
                position: "top-center",
                duration: 3000,
            });
            dispatch(removeSuccess());
            navigate("/", { replace: true });
        }
    }, [dispatch, navigate, success]);

    return (
        <div 
        className="w-full h-screen flex items-center justify-center bg-cover bg-center "
        style={{
            backgroundImage:
            "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1600&q=80')",
        }}
        >
        <form
        onSubmit={loginSubmit}
        className="w-full max-w-md md:max-w-l lg:max-w-l rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl p-12 m-5"
        >
        <h2 className="italic text-3xl font-bold text-center text-white mb-6">
            Login
        </h2>

        <div className="relative">
            <Mail className="absolute left-2 top-2 text-gray-500" size={20} />

            <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full mb-5 pl-12 py-2 rounded-2xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>

        <div className="relative">
            <Lock className="absolute left-2 top-2 text-gray-500" size={20} />

            <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full mb-5 pl-12 pr-12 py-2 rounded-2xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-gray-500"
        >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        </div>

        <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:scale-105 duration-300 shadow-lg"
        >
            {loading ? "Logging in..." : "Login"}
        </button>

        <div className="text-center mt-4">
            <Link
            to="/password/forgot"
            className="text-blue-600 text-xl"
            >
            Forgot Password?
            </Link>
        </div>

        <div className="text-center mt-3">
            Don't have an account?{" "}
            <Link
            to="/register"
            className="text-green-600 font-semibold text-2xl"
            >
            Register
            </Link>
        </div>
        </form>
    </div>
    );
};

export default Login;
