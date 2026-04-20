"use client";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Navbar } from "./Navbar";

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-coral/60"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -100],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const Hero = () => {
  return (
    <div>
      {/* Hero Image Section */}
      <section className="relative min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="absolute inset-0">
          <img
            src="/hero-family.png"
            alt="Immersive family connection"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-b from-background/20 via-transparent to-background/20" />
          <div className="absolute inset-0 bg-linear-to-r from-background/0 via-transparent to-background/0" />
          {/* <div className="absolute inset-0 bg-linear-to-b from-background/80 via-transparent to-background/90" />
        <div className="absolute inset-0 bg-linear-to-r from-background/40 via-transparent to-background/40" /> */}
        </div>

        <FloatingParticles />

        {/* Top Content - Logo */}
        <div className="absolute top-[24%] sm:top-[22%] md:top-[20%] lg:top-1/7 left-1/2 -translate-x-1/2 z-10">
          <motion.img
            src="/holovox-logo.png"
            alt="HoloVox"
            className="h-20 lg:h-24"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          />
        </div>
        {/* Buttons Over Hero Image */}
       <div
  id="buttons"
  className="absolute w-full bottom-32 sm:bottom-20 lg:bottom-10 left-1/2 -translate-x-1/2 px-4"
>
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="flex justify-center items-center gap-3 sm:gap-4"
  >
    {/* Button 1 */}
    <Button className="w-27.5 sm:w-37.5 md:w-45 h-10 rounded-full bg-[#E4246E] hover:bg-[#d11f63] border border-white text-white text-xs sm:text-sm md:text-base font-medium shadow-lg backdrop-blur-md">
      Holo At Me
    </Button>

    {/* Button 2 */}
    <Button className="w-27.5 sm:w-37.5 md:w-45 h-10 rounded-full bg-[#4FA6D8] hover:bg-[#3b95c9] border border-white text-white text-xs sm:text-sm md:text-base font-medium shadow-lg backdrop-blur-md">
      Podcast
    </Button>

    {/* Button 3 */}
    <Button className="w-27.5 sm:w-37.5 md:w-45 h-10 rounded-full bg-[#D73C3C] hover:bg-[#ff4f4f] border border-white text-white text-xs sm:text-sm md:text-base font-medium shadow-lg backdrop-blur-md">
      Watch Podcast
    </Button>
  </motion.div>
</div>

        <div className="flex justify-center mt-16 mb-10" />
      </section>
    </div>
  );
};
