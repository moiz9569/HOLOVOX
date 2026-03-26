// "use client";
// import { motion } from "framer-motion";
// import { Mail, Lock, User } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import OtpModal from "./otpmodal";

// function SignUpForm({ openOtpModal,onClose }) {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });
//   // const [showOtpModal, setShowOtpModal] = useState(false);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (formData.password !== formData.confirmPassword) {
//     return setError("Passwords do not match");
//   }

//   try {
//     setLoading(true);

//     const res = await fetch("/api/auth/emailVerification", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: formData.email,
//       }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       throw new Error(data.error);
//     }

//     // close signup modal
//    // open OTP modal + close signup modal
// openOtpModal({
//   email: formData.email,
//   name: formData.name,
//   password: formData.password,
// });

//   } catch (err) {
//     setError(err.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <motion.form
//       initial={{ opacity: 0, x: 20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="space-y-6"
//       onSubmit={handleSubmit}
//     >
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
//         <p className="text-white/60">Join the future of video collaboration</p>
//       </div>

//       {error && <p className="text-red-400 text-sm text-center">{error}</p>}

//       <div className="space-y-4">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">
//             Full Name
//           </label>
//           <div className="relative">
//             <User
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
//               size={20}
//             />
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter your full name"
//               required
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#E9164B]"
//             />
//           </div>
//         </div>

//         {/* Email */}
//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">
//             Email
//           </label>
//           <div className="relative">
//             <Mail
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
//               size={20}
//             />
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               required
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#E9164B]"
//             />
//           </div>
//         </div>

//         {/* Password */}
//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">
//             Password
//           </label>
//           <div className="relative">
//             <Lock
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
//               size={20}
//             />
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Create a password"
//               required
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#E9164B]"
//             />
//           </div>
//         </div>

//         {/* Confirm Password */}
//         <div>
//           <label className="block text-sm font-medium text-white/80 mb-2">
//             Confirm Password
//           </label>
//           <div className="relative">
//             <Lock
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
//               size={20}
//             />
//             <input
//               type="password"
//               name="confirmPassword"
//               value={formData.confirmPassword}
//               onChange={handleChange}
//               placeholder="Confirm your password"
//               required
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#E9164B]"
//             />
//           </div>
//         </div>
//       </div>

//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full cursor-pointer py-4 bg-linear-to-r from-[#E9164B] to-[#E9164B] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
//       >
//         {loading ? "Creating Account..." : "Sign Up"}
//       </button>
//       {/* {showOtpModal && (
//         <OtpModal
//           email={formData.email}
//           name={formData.name}
//           password={formData.password}
//           onClose={() => setShowOtpModal(false)}
//         />
//       )} */}
//     </motion.form>
//   );
// }

// export default SignUpForm;





















"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiX,
  FiUpload,
} from "react-icons/fi";
import { showSuccessToast,showErrorToast } from "../../lib/toast";

export default function SignUpForm({ isOpen, onClose, openLogin, openOTP }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [profilePic, setProfilePic] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  // 🔥 NEW — send OTP before account creation
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      return showErrorToast("Fill all fields");
    }
    // console.log("All fields filled", { name, email, password, confirmPassword ,role, profilePic});

    if (password !== confirmPassword) {
      return showErrorToast("Passwords do not match");
    }

    setIsLoading(true);

    try {
      // Step 1 → send OTP
      const otpRes = await fetch("/api/auth/emailVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const otpData = await otpRes.json();
      // console.log("OTP RESPONSE:", otpData);

      if (!otpRes.ok) {
        setIsLoading(false);
        // return console.log(otpData.error);
        showErrorToast(otpData.error);
      }
      let base64Image = null;
      if (profilePic) {
        const reader = new FileReader();
        base64Image = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(profilePic);
        });
      }

      showSuccessToast("OTP Sent Successfully!");

      // Step 2 → close signup modal & open OTP modal with user data
      onClose();

      openOTP({
        name,
        email,
        password,
        role,
        image : base64Image,
      });
    } catch (err) {
      showErrorToast("Signup Error:", err);
    }

    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="fixed font-exo-2 inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="relative w-full max-w-md mx-auto my-8"
          >
            <div
              className="relative bg-linear-to-r bg-gray-300 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
              style={{
                boxShadow: `
                  0 0 40px rgba(255, 215, 0, 0.08),
                  inset 0 0 1px rgba(255, 255, 255, 0.05)
                `,
              }}
            >
              {/* Header */}
              <div className="relative pb-4">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="absolute cursor-pointer top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 text-gray-700 hover:text-white transition"
                >
                  <FiX className="text-lg" />
                </motion.button>

                <div className="flex justify-center">
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src="/holovox-icon.png"
                    className="w-28 h-28 object-contain animate-spin-slow hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center"
                >
                  <h2 className="text-2xl font-bold bg-[#E62064] bg-clip-text text-transparent mb-1">
                    Create an Account
                  </h2>
                  <p className="text-gray-700 font-inter text-sm">
                    Join the Holovox network securely
                  </p>
                </motion.div>
              </div>

              {/* FORM */}
              <div className="px-6 pb-6">
                <form className="space-y-4">
                  {/* Name + Email */}
                  <div className="flex">
                    <div className="relative w-2/4">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E62064]" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/40 border border-[#E62064] text-black placeholder-gray-700 font-exo-2 focus:outline-none focus:border-[#E62064] focus:ring-1 focus:ring-[#E62064] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>

                    <div className="relative w-2/4 ml-4">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E62064]" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email Address"
                        className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/40 border border-[#E62064] text-black placeholder-gray-700 font-exo-2 focus:outline-none focus:border-[#E62064] focus:ring-1 focus:ring-[#E62064] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Password + Confirm */}
                  <div className="flex">
                    <div className="relative w-2/4">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E62064]" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/40 border border-[#E62064] text-black placeholder-gray-700 font-exo-2 focus:outline-none focus:border-[#E62064] focus:ring-1 focus:ring-[#E62064] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-[#E62064]"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>

                    <div className="relative w-2/4 ml-4">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E62064]" />
                      <input
                        type={showConfirm ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-type Password"
                        className="w-full pl-12 pr-12 py-3 rounded-2xl bg-white/40 border border-[#E62064] text-black placeholder-gray-700 font-exo-2 focus:outline-none focus:border-[#E62064] focus:ring-1 focus:ring-[#E62064] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-[#E62064]"
                      >
                        {showConfirm ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Profile Pic */}
                  <h1 className="font-exo-2 text-black">
                    Upload Profile Picture
                  </h1>
                  <div className="relative">
                    <FiUpload className="absolute left-4 top-1/2 -translate-y-1/2 text-[#E62064]" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProfilePic(e.target.files[0])}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/40 border border-[#E62064] text-black placeholder-gray-700 font-exo-2 focus:outline-none focus:border-[#E62064] focus:ring-1 focus:ring-[#E62064] disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* SIGN UP BUTTON */}
                  <motion.button
                    type="button"
                    onClick={handleSignup}
                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                    className="w-full cursor-pointer mt-3 py-3 rounded-2xl bg-[#E62064] text-white font-semibold text-lg"
                  >
                    {isLoading ? "Sending OTP..." : "Sign Up"}
                  </motion.button>
                </form>

                <div className="text-center mt-5 pt-5 border-t border-white/10">
                  <p className="text-gray-700">
                    Already have an account?{" "}
                    <button
                      onClick={() => {
                        onClose();
                        openLogin();
                      }}
                      className="cursor-pointer bg-[#E62064] text-transparent bg-clip-text font-semibold hover:text-[#E62064]/80 transition"
                    >
                      Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
