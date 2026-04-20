"use client";
import { motion } from "framer-motion";
import { HeartPulse, Brain, Sparkles } from "lucide-react";

export default function DoctorCategoryModal({ onClose }) {
  const categories = [
    {
      title: "Cardiologist",
      desc: "Heart specialist",
      icon: HeartPulse,
      color: "text-red-500",
    },
    {
      title: "Dentist",
      desc: "Teeth specialist",
      icon: Brain,
      color: "text-blue-400",
    },
    {
      title: "Neurologist",
      desc: "Brain & Nerves",
      icon: Brain,
      color: "text-cyan-500",
    },
    {
      title: "Dermatologist",
      desc: "Skin specialist",
      icon: Sparkles,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#F5F5F5] rounded-3xl p-8 w-full max-w-md shadow-xl relative"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Select Doctor Category
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose a specialization to find the right doctor
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4">
          {categories.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-[#EDEDED] rounded-2xl p-4 flex items-center gap-3 hover:shadow-md transition cursor-pointer"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-white ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-gray-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Empty cards (as shown in design) */}
          <div className="bg-[#EDEDED] rounded-2xl h-20" />
          <div className="bg-[#EDEDED] rounded-2xl h-20" />
        </div>
      </motion.div>
    </div>
  );
}