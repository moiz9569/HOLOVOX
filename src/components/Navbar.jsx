"use client";
import { useState, useEffect } from "react";
 import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
 import { Menu, X } from "lucide-react";
 
 const navLinks = [
   { label: "Features", href: "#features" },
   { label: "Pricing", href: "#pricing" },
   { label: "Hardware", href: "#hardware" },
   { label: "Enterprise", href: "#enterprise" },
 ];
 
 export const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 
   useEffect(() => {
     const handleScroll = () => {
       setIsScrolled(window.scrollY > 50);
     };
     window.addEventListener("scroll", handleScroll);
     return () => window.removeEventListener("scroll", handleScroll);
   }, []);
 
   return (
     <>
       <motion.nav
         className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
           isScrolled 
             ? "bg-background/80 backdrop-blur-xl border-b border-border/50" 
             : "bg-transparent"
         }`}
         initial={{ y: -100 }}
         animate={{ y: 0 }}
         transition={{ duration: 0.5 }}
       >
         <div className="container px-4">
           <div className="flex items-center justify-between h-16 md:h-20">
             {/* Logo */}
             <a href="/" className="flex items-center gap-2">
               <img src="/holovox-icon.png" alt="HoloVox" className="h-8 md:h-10" />
               <span className="font-creata text-xl font-medium text-foreground hidden sm:block">
                 HOLOVOX
               </span>
             </a>
             
             {/* Desktop Nav */}
             <div className="hidden md:flex items-center gap-8">
               {navLinks.map((link) => (
                 <a
                   key={link.label}
                   href={link.href}
                   className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                 >
                   {link.label}
                 </a>
               ))}
             </div>
             
             {/* CTA */}
             <div className="hidden md:flex items-center gap-4">
               <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                 Sign In
               </Button>
               <Button className="bg-coral hover:bg-coral-glow text-primary-foreground">
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
       
       {/* Mobile Menu */}
       <AnimatePresence>
         {isMobileMenuOpen && (
           <motion.div
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
                 <div className="pt-6 border-t border-border/50 flex flex-col gap-4">
                   <Button variant="ghost" className="justify-start text-lg">
                     Sign In
                   </Button>
                   <Button className="bg-coral hover:bg-coral-glow text-primary-foreground text-lg">
                     Get Started
                   </Button>
                 </div>
               </div>
             </div>
           </motion.div>
         )}
         <AnimatePresence>
        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} />
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes orbitPulse {
          0%, 100% { border-color: rgba(255,255,255,0.1); }
          50% { border-color: rgba(255,255,255,0.3); }
        }
      `}</style>
       </AnimatePresence>
     </>
   );
 };



 function AuthModal({ onClose }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/20 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8">
          <div className="flex gap-2 p-1 bg-white/10 rounded-full">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                isLogin 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-6 rounded-full font-semibold transition-all ${
                !isLogin 
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {isLogin ? <LoginForm /> : <SignUpForm />}
      </motion.div>
    </motion.div>
  );
}





function LoginForm() {
  return (
    <motion.form
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-white/60">Login to continue your immersive experience</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-white/60">
          <input type="checkbox" className="rounded bg-white/10 border-white/20" />
          Remember me
        </label>
        <button className="text-pink-400 hover:text-pink-300 transition-colors">
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 relative overflow-hidden group"
      >
        <span className="relative z-10">Login</span>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </button>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-white/40">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
          <Chrome size={20} />
          Google
        </button>
        <button className="flex items-center justify-center gap-2 py-3 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors">
          <Github size={20} />
          GitHub
        </button>
      </div>
    </motion.form>
  );
}






// Sign Up Form Component
function SignUpForm() {
  return (
    <motion.form
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-white/60">Join the future of video collaboration</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="password"
              placeholder="Create a password"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>
        </div>
      </div>

      <label className="flex items-start gap-2 text-sm text-white/60">
        <input type="checkbox" className="mt-1 rounded bg-white/10 border-white/20" />
        <span>I agree to the Terms of Service and Privacy Policy</span>
      </label>

      <button
        type="submit"
        className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 relative overflow-hidden group"
      >
        <span className="relative z-10">Sign Up</span>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </button>
    </motion.form>
  );
}