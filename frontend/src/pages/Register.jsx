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
    "https://ui-avatars.com/api/?name=User&background=random"
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
    myForm.set("avatar", avatar);

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
        className="relative min-h-screen flex items-center justify-center lg:justify-end px-6 lg:pr-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://static.vecteezy.com/system/resources/thumbnails/037/125/647/small_2x/ai-generated-generative-ai-shopping-cart-on-neon-gradient-background-80s-and-90s-style-minimalistic-shop-online-free-delivery-discounts-and-sale-concept-photo.jpg')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45"></div>

        {/* Register Card */}
        <div className="relative z-10 w-full max-w-md lg:max-w-xl xl:max-w-1xl bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

          <h1 className="text-4xl font-bold text-center text-slate-800">
            Create Account
          </h1>

          <p className="text-center text-gray-700 mt-2 mb-8">
            Join us and start shopping today.
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Avatar */}

            <div className="flex justify-start">

              <div className="relative">

                <img
                  src={preview}
                  alt="Avatar"
                  className="w-16 h-16 rounded-xl object-cover border-4 border-blue-500"
                />

                <label
                  htmlFor="avatar"
                  className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 duration-300"
                >
                  <Camera size={18} />
                </label>

                <input
                  id="avatar"
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={handleChange}
                  hidden
                />

              </div>

            </div>

            {/* Name */}

            <div className="relative">

              <User
                size={20}
                className="absolute left-4 top-4 text-gray-500"
              />

              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Email */}

            <div className="relative">

              <Mail
                size={20}
                className="absolute left-4 top-4 text-gray-500"
              />

              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Phone */}

            <div className="relative">

              <Phone
                size={20}
                className="absolute left-4 top-4 text-gray-500"
              />

              <input
                type="tel"
                name="phone"
                value={phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>

            {/* Password */}

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-4 top-4 text-gray-500"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-500"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>

            </div>

            {/* Register Button */}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:scale-105 duration-300"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>

            {/* Login */}

            <p className="text-center text-gray-700">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
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
