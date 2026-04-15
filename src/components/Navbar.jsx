// "use client";
// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "./ui/button";
// import { useRouter } from "next/navigation";
// import { Menu, X, Mail, Lock, User } from "lucide-react";
// import SignUpForm from "./signup";
// import LoginForm from "./login";
// import OtpModal from "./otpmodal";

// const navLinks = [
//   { label: "Features", href: "#features" },
//   { label: "Pricing", href: "#pricing" },
//   { label: "Hardware", href: "#hardware" },
//   { label: "Enterprise", href: "#enterprise" },
// ];

// export const Navbar = () => {
//   const router = useRouter();
//   const [showAuth, setShowAuth] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [signupData, setSignupData] = useState(null);

//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 50);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <>
//       <motion.nav
//         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//           isScrolled
//             // ? "bg-background/80 backdrop-blur-xl border-b border-border/50"
//             // : "bg-transparent"
//             ? "bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10"
// : "bg-transparent"
//         }`}
//         initial={{ y: -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <div className="container px-4">
//           <div className="flex items-center justify-between h-16 md:h-20">
//             {/* Logo */}
//             <a href="/" className="flex items-center gap-2">
//               <img
//                 src="/holovox-icon.png"
//                 alt="HoloVox"
//                 className="h-8 md:h-10"
//               />
//               <span className="font-creata text-xl font-semibold text-white hidden sm:block">
//                 HOLOVOX
//               </span>
//             </a>

//             {/* Desktop Nav */}
//             <div className="hidden md:flex items-center gap-8">
//               {navLinks.map((link) => (
//                 <a
//                   key={link.label}
//                   href={link.href}
//                   className="text-sm text-white font-semibold hover:text-foreground transition-colors"
//                 >
//                   {link.label}
//                 </a>
//               ))}
//             </div>

//             {/* CTA */}
//             <div className="hidden md:flex items-center gap-4">
//               {/* <Button
//                 variant="ghost"
//                 className="text-muted-foreground hover:text-foreground"
//               >
//                 Sign In
//               </Button> */}
//               <Button
//                 onClick={() => setShowAuth(true)}
//                 // onClick={() => router.push("/connect")}
//                 className="bg-[#E9164B] cursor-pointer hover:bg-red-500 text-white"
//               >
//                 Get Started
//               </Button>
//             </div>

//             {/* Mobile Menu Button */}
//             <button
//               className="md:hidden p-2 text-foreground"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//             >
//               {isMobileMenuOpen ? <X /> : <Menu />}
//             </button>
//           </div>
//         </div>
//       </motion.nav>

//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             key="mobile-menu"
//             className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden pt-20"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="container px-4 py-8">
//               <div className="flex flex-col gap-6">
//                 {navLinks.map((link) => (
//                   <a
//                     key={link.label}
//                     href={link.href}
//                     className="text-2xl font-creata text-foreground"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     {link.label}
//                   </a>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         )}

//         {showAuth && (
//           // <AuthModal key="auth-modal" onClose={() => setShowAuth(false)} />
//           <AuthModal
//             key="auth-modal"
//             onClose={() => setShowAuth(false)}
//             openOtpModal={(data) => {
//               setSignupData(data);
//               setShowAuth(false);
//               setShowOtpModal(true);
//             }}
//           />
//         )}
//       </AnimatePresence>
//       {showOtpModal && signupData && (
//         <OtpModal
//           email={signupData.email}
//           name={signupData.name}
//           password={signupData.password}
//           onClose={() => setShowOtpModal(false)}
//         />
//       )}
//     </>
//   );
// };

// function AuthModal({ onClose, openOtpModal }) {
//   const [isLogin, setIsLogin] = useState(true);
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, []);

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       onClick={onClose}
//       className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4"
//     >
//       <motion.div
//         initial={{ scale: 0.8, y: 50 }}
//         animate={{ scale: 1, y: 0 }}
//         exit={{ scale: 0.8, y: 50 }}
//         onClick={(e) => e.stopPropagation()}
//         className="bg-[#0C0C2A] backdrop-blur-xl h-screen overflow-y-auto rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
//       >
//         <button
//           onClick={onClose}
//           className="absolute cursor-pointer top-4 right-4 text-white/70 hover:text-white transition-colors"
//         >
//           <X size={24} />
//         </button>

//         <div className="mb-8">
//           <div className="flex gap-2 p-1 bg-white/10 rounded-full">
//             <button
//               onClick={() => setIsLogin(true)}
//               className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
//                 isLogin
//                   ? "bg-linear-to-r from-[#E9164B] to-[#E9164B] text-white shadow-lg"
//                   : "text-white/70 hover:text-white cursor-pointer"
//               }`}
//             >
//               Login
//             </button>
//             <button
//               onClick={() => setIsLogin(false)}
//               className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
//                 !isLogin
//                   ? "bg-linear-to-r from-[#E9164B] to-[#E9164B] text-white shadow-lg"
//                   : "text-white/70 hover:text-white cursor-pointer"
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>
//         </div>

//        {isLogin ? (
//   <LoginForm />
// ) : (
//   <SignUpForm openOtpModal={openOtpModal} onClose={onClose} />
// )}
//       </motion.div>
//     </motion.div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import SignUpForm from "./signup";
import LoginForm from "./login";
import OtpModal from "./otpmodal";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Hardware", href: "#hardware" },
  { label: "Enterprise", href: "#enterprise" },
];

export const Navbar = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpUserData, setOtpUserData] = useState(null);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setIsScrolled(window.scrollY > 50);
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);
  useEffect(() => {
    const handleScroll = () => {
      const main = document.getElementById("main-scroll");
      if (!main) return;

      if (main.scrollTop > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    const main = document.getElementById("main-scroll");

    if (main) {
      main.addEventListener("scroll", handleScroll);
    }

    // 🔥 ALSO trigger once initially
    handleScroll();

    return () => {
      if (main) {
        main.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      <motion.nav
        className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-white/10"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container px-4">
          <div className="flex items-center space-x-2 justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <img
                src="/holo-new-logo.png"
                alt="HoloVox"
                className="h-8 md:h-14"
              />
              <span className="font-creata -ml-2 text-2xl font-semibold text-white hidden sm:block">
                HOLOVOX
              </span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white font-semibold hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              {/* <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button> */}
              <Button
                onClick={() => {
                  setIsLoginOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                // onClick={() => router.push("/connect")}
                className="bg-[#E51A54] cursor-pointer hover:bg-[#E51A54]/80 text-white"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container px-4 py-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-2xl font-creata text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <LoginForm
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        // openSignup={() => setIsSignupOpen(true)}
        openSignup={() => {
          setIsLoginOpen(false);
          setIsSignupOpen(true);
        }}
      />
      <SignUpForm
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        // openLogin={() => setIsLoginOpen(true)}
        openLogin={() => {
          setIsSignupOpen(false);
          setIsLoginOpen(true);
        }}
        openOTP={(user) => {
          setIsSignupOpen(false);
          setOtpUserData(user);
          setIsOtpOpen(true);
        }}
      />

      <OtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        userData={otpUserData}
        email={otpUserData?.email} // Pass email separately
        onVerificationSuccess={(data) => {
          // Handle successful verification
          // console.log("User created:", data);
          localStorage.setItem("token", data?.token);
          router.push("/home");
        }}
      />
    </>
  );
};
