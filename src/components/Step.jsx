"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight } from "lucide-react";

const Step = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="items-center shadow-[0_10px_25px_rgba(233,22,75,0.3)] justify-center text-center w-full max-w-5xl bg-white rounded-3xl p-8 md:p-12 flex flex-col gap-6">
        <motion.h1
          className="font-creata text-gray-800 text-4xl md:text-6xl lg:text-8xl font-medium tracking-tight"
          initial={{ opacity: 0.5, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Step Into Someone's
          <span className="block text-[#E51A54]">Reality</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl max-w-3xl drop-shadow-lg text-[#8585ad]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Experience immersive, AI-powered video that feels like you're really
          there. Enjoy a wide-angle 360° view using just your phone—no expensive
          hardware required. Step beyond flat calls and into real presence.
        </motion.p>

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <p className="text-sm text-gray-600 mb-3 drop-shadow">
            Coming Soon — Join the waitlist
          </p>

          <form className="flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 bg-card/60 backdrop-blur-sm border-border/50 text-gray-600 placeholder:text-gray-400"
            />
            <Button
              type="submit"
              className="h-12 px-8 bg-[#E51A54] hover:bg-[#E51A54]/90 cursor-pointer text-white font-medium"
            >
              Notify Me
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Step;
