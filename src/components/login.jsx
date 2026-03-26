// "use client";
// import { Mail, Lock } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";
// import { showSuccessToast,showErrorToast } from "../../lib/toast";
// import { motion, AnimatePresence } from "framer-motion";
// import { FiMail, FiLock, FiEye, FiEyeOff, FiX } from "react-icons/fi";

// function LoginForm() {
//   const router = useRouter();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Handle input change
//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle Login
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setError("");

//     try {
//       setLoading(true);

//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Login failed");
//       }

//       // Save token
//       localStorage.setItem("token", data.token);

//       // Redirect
//       router.push("/home");
//       // alert("Logged in successfully!");
//       showSuccessToast("Logged in successfully!")

//     } catch (err) {
//       setError(err.message);
//       showErrorToast("Login Failed!")
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.form
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       className="space-y-6"
//       onSubmit={handleSubmit}
//     >
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//         <p className="text-white/60">
//           Login to continue your immersive experience
//         </p>
//       </div>

//       {error && (
//         <p className="text-red-400 text-center text-sm">{error}</p>
//       )}

//       <div className="space-y-4">
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
//               required
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
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
//               required
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Enter your password"
//               className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#E9164B]"
//             />
//           </div>
//         </div>
//       </div>

//       {/* Remember + Forgot */}
//       <div className="flex items-center justify-between text-sm">
//         <label className="flex items-center gap-2 text-white/60">
//           <input
//             type="checkbox"
//             className="rounded bg-white/10 border-white/20"
//           />
//           Remember me
//         </label>

//         <button
//           type="button"
//           className="text-[#E9164B] cursor-pointer hover:text-[#E9164B]/90"
//         >
//           Forgot password?
//         </button>
//       </div>

//       {/* Login Button */}
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full cursor-pointer py-4 bg-linear-to-r from-[#E9164B] to-[#E9164B] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 relative overflow-hidden group"
//       >
//         <span className="relative z-10">
//           {loading ? "Logging in..." : "Login"}
//         </span>

//         <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
//       </button>
//     </motion.form>
//   );
// }

// export default LoginForm;












"use client";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff, FiX } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { showSuccessToast,showErrorToast } from "../../lib/toast";

export default function LoginForm({ isOpen, onClose, openSignup }) {
  if (!isOpen) return null;

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      return showErrorToast("Please fill all fields!");
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      // console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        console.error(data.error);
        showErrorToast(data.error)
        setIsLoading(false);
        return;
      }

      // SUCCESS
      showSuccessToast("Login successful!");
      console.log("Login successful!");
      console.log("TOKEN:", data.token);
      
      // Set redirecting state
      setIsRedirecting(true);
      
      // Save token
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      // Determine redirect path
      const redirectPath = data?.user?.role === "user" ? "/home" : "/admindashboard";
      
      // Add a small delay to show loading state
      setTimeout(() => {
        router.push(redirectPath);
      }, 500);

    } catch (err) {
      console.error("Login error:", err);
      showErrorToast("Unable to Login, Please try again!")
      setIsLoading(false);
      setIsRedirecting(false);
    }
  };

  return (
    <AnimatePresence>
      {/* Full-screen redirect overlay */}
      {isRedirecting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear"
            }}
            className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full mb-6"
          />
          <p className="text-white text-2xl font-bold mb-2">Login Successful!</p>
          <p className="text-gray-300 text-lg">Redirecting to dashboard...</p>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "200px" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-1 bg-linear-to-r from-blue-500 to-cyan-400 rounded-full mt-4"
          />
        </motion.div>
      )}

      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/60 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isRedirecting ? undefined : onClose}
        />

        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-24 -right-24 w-40 h-40 bg-linear-to-r from-yellow-400/20 to-yellow-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.2, 0.4] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-24 -left-24 w-48 h-48 bg-linear-to-r from-gray-300/20 to-gray-100/20 rounded-full blur-3xl"
          />
        </div>

        {/* Main Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md mx-auto my-8"
        >
          <div
            className="relative bg-linear-to-r bg-gray-200 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
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
                disabled={isLoading || isRedirecting}
                className="absolute cursor-pointer top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 text-gray-300 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX className="text-lg" />
              </motion.button>

              <div className="flex justify-center">
                {isRedirecting ? (
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                    transition={{
                      rotate: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      scale: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                    className="w-28 h-28 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-20 h-20 border-4 border-blue-400 border-t-transparent rounded-full"
                    />
                  </motion.div>
                ) : (
                  <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src="/hashfor-Brand-logo.png"
                    className="w-28 h-28 animate-spin-slow hover:scale-110 transition-transform duration-500 object-contain"
                  />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <h2 className="text-2xl font-exo-2 font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-1">
                  {isRedirecting ? "Welcome Back!" : "Welcome Back"}
                </h2>
                <p className="text-gray-700 font-inter text-sm">
                  {isRedirecting ? "Redirecting to your dashboard..." : "Access your Hashfor portfolio securely"}
                </p>
              </motion.div>
            </div>

            {/* Only show form if not redirecting */}
            {!isRedirecting && (
              <div className="px-6 pb-6">
                <form className="space-y-4 font-exo-2" onSubmit={(e) => e.preventDefault()}>
                  {/* Email */}
                  <div className="relative">
                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/40 border border-blue-400 text-black placeholder-gray-700 font-exo-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      disabled={isLoading}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/40 border border-blue-400 text-black placeholder-gray-700 font-exo-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                      className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  {/* Login Button */}
                  <motion.button
                    type="button"
                    onClick={handleLogin}
                    disabled={isLoading || !email || !password}
                    whileHover={!isLoading && email && password ? { scale: 1.02 } : {}}
                    whileTap={!isLoading && email && password ? { scale: 0.98 } : {}}
                    className="w-full cursor-pointer mt-3 py-3 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-400 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                        />
                        <span>Authenticating...</span>
                      </div>
                    ) : (
                      "Login"
                    )}
                  </motion.button>
                </form>

                {/* Signup */}
                <div className="text-center font-exo-2 mt-5 pt-5 border-t border-white/10">
                  <p className="text-gray-700">
                    New to Hashfor?{" "}
                    <button
                      onClick={() => {
                        onClose();
                        openSignup();
                      }}
                      disabled={isLoading}
                      className="cursor-pointer bg-linear-to-r from-blue-500 to-cyan-400 text-transparent bg-clip-text font-semibold hover:text-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Redirecting overlay on modal */}
            {isRedirecting && (
              <div className="px-6 pb-8 text-center">
                <div className="py-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <h3 className="text-xl font-bold text-blue-500 mb-2">Login Successful!</h3>
                  <p className="text-gray-700 mb-4">You are being redirected to your dashboard</p>
                  <div className="w-full h-1 bg-gray-300 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="h-full bg-linear-to-r from-blue-500 to-cyan-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}