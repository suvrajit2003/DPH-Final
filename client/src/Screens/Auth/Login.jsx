// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../assets/Logos/logo.jpg";
// import lgnBg from "../../assets/Logos/LoginBanner.jpg";
// import LeftSection from "../../Components/Login/LeftSection";
// import { useContext } from "react";
// import AuthContext from "../../context/AuthContext";
// import axios from "axios"

// const Login = () => {
//   const { user, login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     captcha:""
//   });

//    const [captchaQuestion, setCaptchaQuestion] = useState("");

//    const fetchCaptcha = async () => {
//     try {
//       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/captcha`, { withCredentials: true });
//       setCaptchaQuestion(response.data.question);
//     } catch (error) {
//       console.error("Failed to fetch CAPTCHA", error);
//     }
//   };

//   useEffect(() => {
//     fetchCaptcha();
//   }, []);


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const status = await login(formData);

//       if (status) {
//         navigate("/admin/dashboard");
//       } else {
//          fetchCaptcha();
//       }
//     } catch (error) {
//         fetchCaptcha();
//       alert("Login failed. Please try again.");
//     }
//   };
//   useEffect(() => {
//     if (user) {
//       console.log("✅ User updated in Login component:", user);
//     }
//   }, [user]);

//   return (
//     <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
//       {/* Left Side */}
//       <LeftSection logo={logo} />

//       {/* Right Side */}
//       <div
//         className="flex justify-center items-center p-10 bg-cover bg-center"
//         style={{ backgroundImage: `url(${lgnBg})` }}
//       >
//         <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
//           <h2 className="text-xl font-semibold mb-1">Welcome to our CRM</h2>
//           <h3 className="text-2xl font-bold mb-4">Log In Now</h3>
//           <p className="text-gray-500 mb-6">
//             Enter your details to proceed further
//           </p>
//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <input
//                 type="email"
//                 placeholder="Email"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//               />
//             </div>
//             <div>
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//               />
//             </div>
//               <div className="flex items-center space-x-4">
//               <label htmlFor="captcha" className="text-sm font-medium text-gray-700 w-full">
//                 {captchaQuestion}
//               </label>
//               <input
//                 type="text"
//                 id="captcha"
//                 name="captcha"
//                 placeholder="Answer"
//                 className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 value={formData.captcha}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <button
//               type="submit"
//               className="w-full bg-blue-500 cursor-pointer text-white py-2 rounded-md hover:bg-btnHover transition duration-200"
//             >
//               Log in
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// Login.js

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure axios is imported
import logo from "../../assets/Logos/logo.jpg";
import lgnBg from "../../assets/Logos/LoginBanner.jpg";
import LeftSection from "../../Components/Admin/Login/LeftSection";
import AuthContext from "../../context/AuthContext";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    captcha: "",
  });

  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false); // <-- 1. Add loading state

  const fetchCaptcha = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/admin/captcha`,
        { withCredentials: true }
      );
      setCaptchaQuestion(data.question);
    } catch (error) {
      console.error("Failed to fetch CAPTCHA", error);
      setCaptchaQuestion("Could not load CAPTCHA.");
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions

    setIsLoading(true); // <-- Disable form

    const status = await login(formData);

    if (status) {
      navigate("/admin/dashboard");
    } else {
      // Login failed, refresh captcha and clear sensitive fields
      fetchCaptcha();
      setFormData((prev) => ({
        ...prev,
        password: "", // <-- 2. Clear password
        captcha: "",  // <-- 2. Clear captcha
      }));
    }

    setIsLoading(false); // <-- Re-enable form
  };

  useEffect(() => {
    if (user) {
      console.log("User updated.", user);
    }
  }, [user]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <LeftSection logo={logo} />
      <div
        className="flex justify-center items-center p-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${lgnBg})` }}
      >
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-1">Welcome to our CRM</h2>
          <h3 className="text-2xl font-bold mb-4">Log In Now</h3>
          <p className="text-gray-500 mb-6">
            Enter your details to proceed further
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* CAPTCHA Section */}
            <div className="flex items-center space-x-4">
              <label htmlFor="captcha" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                {captchaQuestion}
              </label>
              <input
                type="text"
                id="captcha"
                name="captcha"
                placeholder="Answer"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={formData.captcha}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading} // <-- 3. Disable button when loading
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-btnHover transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;