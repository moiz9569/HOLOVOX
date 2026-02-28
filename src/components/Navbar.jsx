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
       </AnimatePresence>
     </>
   );
 };