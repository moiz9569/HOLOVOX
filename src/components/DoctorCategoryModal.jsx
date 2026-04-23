"use client";
import { motion } from "framer-motion";
import { BriefcaseMedical, Scale } from "lucide-react";
import { useState } from "react";

export default function DoctorCategoryModal({
  onClose,
  onContinue,
  title = "Select Category",
  subtitle = "Choose a specialization",
  categories = [],
  role = "doctor",
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getCardIcon = () => {
    if (role === "lawyer") return Scale;
    return BriefcaseMedical;
  };

  const handleSubmit = () => {
    if (!selectedCategory) return;

    onContinue?.(selectedCategory);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#F5F5F5] rounded-3xl p-5 sm:p-8 w-full max-w-2xl shadow-xl relative"
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
            {title}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((item, index) => {
            const Icon = item.icon || getCardIcon();
            const isSelected = selectedCategory === item.title;

            return (
              <div
                key={index}
                onClick={() => setSelectedCategory(item.title)}
                className={`
                  rounded-2xl p-4 sm:p-5 w-full flex flex-col items-center text-center cursor-pointer transition
                  ${
                    isSelected
                      ? "bg-[#E51A54] text-white shadow-lg scale-105"
                      : "bg-[#EDEDED] hover:shadow-md"
                  }
                `}
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full bg-white ${item.color || "text-[#E51A54]"}`}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text */}
                <div>
                  <h3 className={`text-sm font-medium ${isSelected ? "text-white" : "text-gray-800"}`}>
                    {item.title}
                  </h3>
                  <p className={`text-[10px] ${isSelected ? "text-white/80" : "text-gray-500"}`}>
                    {item.desc || "Tap to view available experts"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={handleSubmit}
          disabled={!selectedCategory}
          className={`
            w-full py-3 mt-3 rounded-xl font-semibold transition
            ${
              selectedCategory
                ? "bg-[#E51A54] text-white hover:bg-[#c91548] cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }
          `}
        >
          Continue
        </button>
      </motion.div>
    </div>
  );
}
