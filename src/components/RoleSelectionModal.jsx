"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Stethoscope,
  Scale,
  X,
} from "lucide-react";

export default function RoleSelectionModal({ isOpen, onClose, onSelectRole }) {
  const [selectedRole, setSelectedRole] = useState(null);

  if (!isOpen) return null;

  const roles = [
    {
      title: "Doctor",
      desc: "Provide medical consultations",
      icon: Stethoscope,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Lawyer",
      desc: "Offer legal advice and services",
      icon: Scale,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const handleSubmit = () => {
    if (!selectedRole) return;
    onSelectRole?.(selectedRole.toLowerCase());
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Choose Your Role
            </h2>
            <p className="text-gray-600 text-sm">
              Select the professional role you want to become
            </p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4 mb-8">
            {roles.map((role, index) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.title;

              return (
                <div
                  key={index}
                  onClick={() => setSelectedRole(role.title)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 shadow-lg"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${role.color}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{role.title}</h3>
                      <p className="text-sm text-gray-600">{role.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedRole}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              selectedRole
                ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </motion.div>
      </motion.div>
    </>
  );
}
