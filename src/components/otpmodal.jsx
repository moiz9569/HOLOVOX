// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import { useState, useRef, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { FiX, FiRotateCw, FiShield } from "react-icons/fi";

// function OtpModal({ email, name, password, onClose }) {
//   const router = useRouter();

//   const [otp, setOtp] = useState(["", "", "", ""]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");
//   const [msgType, setMsgType] = useState("");
//   const [timeLeft, setTimeLeft] = useState(120);
//   const [isVerifyingAndRedirecting, setIsVerifyingAndRedirecting] =
//     useState(false);

//   const inputRefs = useRef([]);

//   const enteredOtp = otp.join("");

//   // countdown timer
//   useEffect(() => {
//     if (timeLeft <= 0) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const formatTime = (seconds) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;

//     return `${m}:${s.toString().padStart(2, "0")}`;
//   };

//   // OTP input change
//   const handleOtpChange = (index, value) => {
//     if (!/^[0-9]?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;

//     setOtp(newOtp);

//     if (value && index < 3) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   // paste OTP
//   const handlePaste = (e) => {
//     const paste = e.clipboardData.getData("text").slice(0, 4);

//     if (!/^\d+$/.test(paste)) return;

//     const newOtp = paste.split("");
//     setOtp(newOtp);

//     newOtp.forEach((digit, index) => {
//       if (inputRefs.current[index]) {
//         inputRefs.current[index].value = digit;
//       }
//     });
//   };

//   // resend OTP
//   const resendOTP = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("/api/auth/emailVerification", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error);
//       }

//       setTimeLeft(120);
//       setMessage("OTP resent successfully");
//       setMsgType("success");
//     } catch (error) {
//       setMessage(error.message);
//       setMsgType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // verify OTP
//   const verifyOTP = async () => {
//     try {
//       setLoading(true);

//       const res = await fetch("/api/auth/emailVerification", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           otp: enteredOtp,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMessage(data.error);
//         setMsgType("error");
//         return;
//       }

//       // OTP verified
//       await createAccount();
//     } catch (error) {
//       setMessage("Verification failed");
//       setMsgType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // create account after OTP verification
//   const createAccount = async () => {
//     try {
//       setIsVerifyingAndRedirecting(true);

//       const res = await fetch("/api/auth/Signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setIsVerifyingAndRedirecting(false);
//         setMessage(data.error);
//         setMsgType("error");
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       console.log("Account created and logged in successfully", data.token);
//       alert("Account created successfully!");

//     //   setTimeout(() => {
//     //     router.push("/connect");
//     //   }, 1500);
//     } catch (error) {
//       setIsVerifyingAndRedirecting(false);
//       setMessage("Account creation failed");
//       setMsgType("error");
//       console.error("Error creating account:", error);
//     }
//   };

//   return (
//     <AnimatePresence>
//       <motion.div
//         className="fixed inset-0 z-60 flex items-center justify-center p-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//       >
//         {/* background */}
//         <motion.div
//           className="absolute inset-0 bg-black/70 backdrop-blur-lg"
//           onClick={onClose}
//         />

//         <motion.div
//           initial={{ scale: 0.9, opacity: 0, y: 20 }}
//           animate={{ scale: 1, opacity: 1, y: 0 }}
//           exit={{ scale: 0.9, opacity: 0, y: 20 }}
//           transition={{ type: "spring", damping: 25, stiffness: 250 }}
//           className="relative w-full max-w-md mx-auto"
//         >
//           <div className="relative bg-[#0C0C2A] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
//             {/* header */}
//             <div className="relative p-6 pb-4">
//               <motion.button
//                 whileHover={{ scale: 1.1, rotate: 90 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={onClose}
//                 className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 text-gray-300 hover:text-white"
//               >
//                 <FiX />
//               </motion.button>

//               <div className="text-center">
//                 <h2 className="text-2xl font-bold mb-2">
//                   {isVerifyingAndRedirecting
//                     ? "Processing..."
//                     : "Verify Your Email"}
//                 </h2>

//                 <p className="text-gray-400 text-sm">
//                   Enter the 4-digit code sent to
//                 </p>

//                 <p className="text-[#E9164B] font-semibold">{email}</p>
//               </div>
//             </div>

//             {!isVerifyingAndRedirecting && (
//               <div className="px-6 pb-6">
//                 {/* OTP boxes */}
//                 <div className="flex justify-center space-x-3 mb-6">
//                   {otp.map((digit, index) => (
//                     <input
//                       key={index}
//                       ref={(el) => (inputRefs.current[index] = el)}
//                       type="text"
//                       maxLength={1}
//                       value={digit}
//                       onChange={(e) =>
//                         handleOtpChange(index, e.target.value)
//                       }
//                       onKeyDown={(e) => handleKeyDown(index, e)}
//                       onPaste={handlePaste}
//                       className="w-14 h-14 text-center text-xl font-bold bg-[#0C0C2A] border border-gray-300 rounded-xl"
//                     />
//                   ))}
//                 </div>

//                 {/* timer */}
//                 <div className="text-center mb-4">
//                   <p className="text-sm text-gray-400">
//                     {timeLeft > 0
//                       ? `Code expires in ${formatTime(timeLeft)}`
//                       : "OTP expired"}
//                   </p>

//                   <button
//                     onClick={resendOTP}
//                     disabled={timeLeft > 0}
//                     className="text-[#E9164B] text-sm mt-2 flex items-center justify-center mx-auto"
//                   >
//                     <FiRotateCw className="mr-2" />
//                     Resend OTP
//                   </button>
//                 </div>

//                 {/* message */}
//                 {message && (
//                   <p
//                     className={`text-center text-sm mb-4 ${
//                       msgType === "error"
//                         ? "text-red-500"
//                         : "text-green-500"
//                     }`}
//                   >
//                     {message}
//                   </p>
//                 )}

//                 {/* verify button */}
//                 <motion.button
//                   onClick={verifyOTP}
//                   disabled={loading || enteredOtp.length !== 4}
//                   className="w-full py-3 rounded-xl bg-[#E9164B] text-white font-semibold"
//                 >
//                   {loading ? "Verifying..." : "Verify OTP"}
//                 </motion.button>

//                 <div className="flex items-center justify-center mt-4 text-xs text-gray-400">
//                   <FiShield className="mr-2 text-[#E9164B]" />
//                   Secure OTP Verification
//                 </div>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// export default OtpModal;































"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { FiShield, FiX, FiRotateCw } from "react-icons/fi";
// import { showSuccessToast,showErrorToast } from "../../../../lib/toast";
import { showSuccessToast,showErrorToast } from "../../lib/toast";

export default function OtpModal({ 
  isOpen, 
  onClose, 
  email, 
  userData, 
  onVerificationSuccess 
}) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [enteredOtp, setEnteredOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("");
  const [isVerifyingAndRedirecting, setIsVerifyingAndRedirecting] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", ""]);
      setEnteredOtp("");
      setTimeLeft(120);
      setMessage("");
      setMsgType("");
      setIsVerifyingAndRedirecting(false);

      const timer = setInterval(() => {
        setTimeLeft(prev => (prev <= 1 ? 0 : prev - 1));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen]);

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMsgType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 2 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    setEnteredOtp(newOtp.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 4);
    if (/^\d+$/.test(pasteData)) {
      const newOtp = pasteData.split("").slice(0, 4);
      setOtp(newOtp);
      setEnteredOtp(newOtp.join(""));
      inputRefs.current[Math.min(newOtp.length - 1, 3)]?.focus();
    }
  };

  const resendOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/emailVerification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setServerOtp(data.otp);
        setTimeLeft(120);
        showMessage("New OTP sent successfully!", "success");
        showSuccessToast("New OTP sent successfully!", "success")
      } else {
        showMessage(data.error || "Failed to resend OTP", "error");
        showErrorToast(data.error || "Failed to resend OTP", "error")
      }
    } catch {
      showMessage("Failed to resend OTP", "error");
      showErrorToast("Failed to resend OTP", "error")
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (enteredOtp.length !== 4) {
      showMessage("Please enter complete OTP", "warning");
      showErrorToast("Please enter complete OTP", "warning")
      return;
    }
    if (!userData?.email) {
      showMessage("Email not found", "error");
      showErrorToast("Email not found", "error")
      return;
    }

    setIsVerifyingAndRedirecting(true);
    setLoading(true);

    try {
      const verifyRes = await fetch("/api/auth/emailVerification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: userData.email,
          otp: enteredOtp 
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok) {
        showMessage(verifyData.error || "Invalid OTP", "error");
        showErrorToast(verifyData.error || "Invalid OTP", "error")
        setIsVerifyingAndRedirecting(false);
        setLoading(false);
        return;
      }
      // console.log("OTP verified successfully. Creating account...",userData);
      const createAccountRes = await fetch("/api/auth/Signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const accountData = await createAccountRes.json();

      if (createAccountRes.ok) {
        showMessage("Account created successfully! Redirecting...", "success");
        showSuccessToast("Account created successfully!")
        
        // Call success callback if provided
        if (onVerificationSuccess) {
          onVerificationSuccess(accountData);
        }
        
      } else {
        showMessage(accountData.error || "Account creation failed", "error");
        showErrorToast(accountData.error || "Account creation failed", "error")
        setIsVerifyingAndRedirecting(false);
        setLoading(false);
      }
    } catch {
      showMessage("Something went wrong during verification", "error");
      showErrorToast("Something went wrong during verification", "error")
      setIsVerifyingAndRedirecting(false);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-60 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Loader overlay for redirect */}
        {isVerifyingAndRedirecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-10 bg-black/80 backdrop-blur-lg flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full mb-4"
            />
            <p className="text-white text-lg font-semibold">Account created successfully!</p>
            <p className="text-gray-300 mt-2">Redirecting to dashboard...</p>
          </motion.div>
        )}

        <motion.div
          className="absolute inset-0 bg-black/70 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 250 }}
          className="relative w-full max-w-md mx-auto"
        >
          <div className="relative bg-linear-to-r bg-gray-200 rounded-3xl border border-white/10 shadow-2xl overflow-hidden">

            <div className="relative p-6 pb-4">
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                disabled={isVerifyingAndRedirecting}
                className="absolute cursor-pointer top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/60 text-gray-300 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiX className="text-lg" />
              </motion.button>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center">
                  {isVerifyingAndRedirecting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
                    />
                  ) : (
                    <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src="/hashfor-pic.png"
                    className="w-28 h-28 animate-spin-slow hover:scale-110 transition-transform duration-500 object-contain"
                  />
                  )}
                </div>
                <h2 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {isVerifyingAndRedirecting ? "Processing..." : "Verify Your Email"}
                </h2>
                <p className="text-gray-700 text-sm mb-1">
                  {isVerifyingAndRedirecting 
                    ? "Your account is being created..." 
                    : "Enter the 4-digit code sent to"}
                </p>
                <p className="text-blue-400 font-semibold text-sm mb-4">
                  {email}
                </p>
              </div>
            </div>

            {!isVerifyingAndRedirecting && (
              <div className="px-6 pb-6">
                <div className="flex justify-center space-x-3 mb-6">
                  {otp.map((digit, index) => (
                    <motion.input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={loading}
                      className="w-16 h-16 text-center text-2xl font-bold bg-white/40 border border-gray-300 rounded-2xl text-black focus:outline-none focus:border-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  ))}
                </div>

                <div className="text-center mb-6">
                  <p className="text-gray-700 text-sm mb-3">
                    {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : <span className="text-black-400">OTP expired</span>}
                  </p>

                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={timeLeft > 540 || loading}
                    className="cursor-pointer text-blue-400 hover:text-blue-300 disabled:text-gray-500 disabled:cursor-not-allowed text-sm font-semibold transition flex items-center justify-center mx-auto"
                  >
                    <FiRotateCw className="mr-2" />
                    Resend OTP
                  </button>
                </div>

                {message && (
                  <div className={`text-center mb-4 p-3 rounded-lg border 
                    ${msgType === "success" ? "text-green-300 border-green-300/40 bg-green-300/10" :
                      msgType === "error" ? "text-red-300 border-red-300/40 bg-red-300/10" :
                      "text-yellow-300 border-yellow-300/40 bg-yellow-300/10"}`}>
                    {message}
                  </div>
                )}

                <motion.button
                  onClick={verifyOTP}
                  disabled={loading || enteredOtp.length !== 4}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full cursor-pointer py-3 rounded-2xl bg-linear-to-r from-blue-500 to-cyan-400 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Verifying...
                    </span>
                  ) : (
                    "Verify OTP"
                  )}
                </motion.button>

                <div className="flex items-center justify-center mt-4 text-xs text-gray-700">
                  <FiShield className="mr-2 text-blue-400" />
                  Secure OTP Verification
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}