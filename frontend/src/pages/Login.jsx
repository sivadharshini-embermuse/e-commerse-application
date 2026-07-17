import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
Mail,
Lock,
Eye,
EyeOff,

} from "lucide-react";



const Login = () => {
const navigate = useNavigate();

const [user, setUser] = useState({
email: "",
password: "",
});
const { email, password } = user;
const [showPassword, setShowPassword] = useState(false);

const [loading, setLoading] = useState(false);

const handleChange = (e) => {
setUser({
    ...user,
    [e.target.name]: e.target.value,
});
};

const loginSubmit = async (e) => {
e.preventDefault();

try {
    setLoading(true);

    const config = {
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
    };

    const { data } = await axios.post(
    "http://localhost:5000/api/v1/login",
    user,
    config
    );

    alert(data.message || "Login Successful");

    navigate("/");
} catch (error) {
    alert(
    error.response?.data?.message || "Login Failed"
    );
} finally {
    setLoading(false);
}
};

return (
<div 
className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
style={{
    backgroundImage:
    "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1600&q=80')",
}}
>
    <form
    onSubmit={loginSubmit}
    className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl p-10"
    >
    <h2 className="italic text-3xl font-bold text-center text-white mb-6">
        Login
    </h2>

    <div className="relative">
        <Mail className="absolute left-4 top-4 text-gray-200" size={20} />

        <input
        type="email"
        name="email"
        value={email}
        onChange={handleChange}
        placeholder="Email Address"
        className="w-full mb-5 pl-12 py-4 rounded-2xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
    />
    </div>

    <div className="relative">
        <Lock className="absolute left-4 top-4 text-gray-200" size={20} />

        <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={password}
        onChange={handleChange}
        placeholder="Password"
        className="w-full mb-5 pl-12 pr-12 py-4 rounded-2xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-4 text-gray-300"
    >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
    </div>

    <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:scale-105 duration-300 shadow-lg"
    >
        {loading ? "Logging in..." : "Login"}
    </button>

    <div className="text-center mt-4">
        <Link
        to="/password/forgot"
        className="text-blue-600 text-2xl"
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