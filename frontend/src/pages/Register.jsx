import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  Phone,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PageTitle from "../components/PageTitle";
import {
  register,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";



const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, success } = useSelector(
    (state) => state.user
  );
  const [preview, setPreview] = useState(
    "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
  );

  const [avatar, setAvatar] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const { name, email, phone, password } = user;

  const handleChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setPreview(reader.result);
          setAvatar(reader.result);
        }
      };

      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
      }
    } else {
      setUser((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !password) {
      toast.error("Please fill out all the required fields", {
        position: "top-center",
        duration: 3000,
      });
      return;
    }

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("email", email);
    myForm.set("phone", phone);
    myForm.set("password", password);
    if (avatar) {
    myForm.set("avatar", avatar);
    }

    // console.log(myForm.entries());

    // for (let pair of myForm.entries()) {
    //   console.log(pair[0] + " : " + pair[1]);
    // }
    dispatch(register(myForm));
  };
  useEffect(() => {
    if (error){
      toast.error(error,{position:"top-center",duration:3000});
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if(success){
      toast.success("Registration successful! Please log in.", {
        position: "top-center",
        duration: 3000,
      });
      dispatch(removeSuccess());
      navigate("/login");
    }
  }, [dispatch, success, navigate]);

  return (
    <>
      <PageTitle title="Registration" />

      <div
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1600&q=80')",
      }}
      >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/55"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md md:max-w-lg lg:max-w-xl rounded-3xl bg-white/10 backdrop-blur-2xl shadow-2xl p-10">

        <h1 className="italic text-4xl font-bold text-center text-white">
          Create Account
        </h1>

        <p className="text-center text-gray-200 mt-2 mb-8">
          Join our E-Commerce Platform
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={preview}
                alt="avatar"
                className="w-28 h-28 rounded-full border-4 border-blue-500 object-cover"
              />

              <label
                htmlFor="avatar"
                className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer transition"
              >
                <Camera size={20} className="text-white" />
              </label>

              <input
                hidden
                id="avatar"
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleChange}
              />
              
              
            </div>
            
          </div>

          <p className="text-center">Providing profile picture is Manditory</p>
          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-4 text-gray-400" size={20} />

            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-12 py-4 rounded-2xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />

            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full pl-12 py-4 rounded-2xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute left-4 top-4 text-gray-400" size={20} />

            <input
              type="tel"
              name="phone"
              value={phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full pl-12 py-4 rounded-2xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white/20 border border-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-gray-300"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:scale-105 duration-300 shadow-lg"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-gray-200">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-300 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
