"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Stethoscope,
  Scale,
  MoreHorizontal,
  UserPlus,
} from "lucide-react";

export default function MarketplaceModal({ onClose, onContinue, onBecomeProvider, isProvider = false }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      title: "Doctor",
      desc: "Consult with verified doctors",
      icon: Stethoscope,
    },
    {
      title: "Lawyer",
      desc: "Get legal advice from expert",
      icon: Scale,
    },
    // {
    //   title: "Teacher",
    //   desc: "Learn from experienced teacher",
    //   icon: GraduationCap,
    // },
    {
      title: "Other",
      desc: "Explore more professional services",
      icon: MoreHorizontal,
    },
  ];

  const handleSubmit = () => {
    if (!selectedCategory) return;

    onContinue?.(selectedCategory.toLowerCase());
  };

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#F5F5F5] rounded-3xl p-5 sm:p-8 w-full max-w-md shadow-xl relative"
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
            Explore Market Place
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Choose a category to find the right expert for you..
          </p>
        </div>

        {/* Become Provider Button - Only show for non-providers */}
        {!isProvider && (
          <>
            <button
              onClick={() => {
                onClose();
                onBecomeProvider?.();
              }}
              className="w-full mb-6 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              Want to become a Doctor/Lawyer?
            </button>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-3 text-sm text-gray-500">or browse</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5 mb-6">
          {categories.map((item, index) => {
            const Icon = item.icon;
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
                <div className="mb-3">
                  <Icon
                    className={`w-7 h-7 ${
                      isSelected ? "text-white" : "text-black"
                    }`}
                  />
                </div>

                <h3 className="text-sm font-medium">
                  {item.title}
                </h3>

                <p
                  className={`text-[10px] mt-1 leading-tight ${
                    isSelected ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCategory}
          className={`
            w-full py-3 rounded-xl font-semibold transition
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
    </>
  );
}