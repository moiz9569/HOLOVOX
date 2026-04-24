"use client";
import { motion } from "framer-motion";
import { Stethoscope, Scale, X } from "lucide-react";
import { useState } from "react";

export default function RoleUpgradeModal({
  isOpen,
  roleType,
  onClose,
  onContinueAsBrowser,
  onContinueAsProvider,
  isLoading,
  userId,
}) {
  const [updatingRole, setUpdatingRole] = useState(false);

  const handleBecomeProvider = async () => {
    if (!userId) {
      console.error("No userId provided");
      return;
    }

    setUpdatingRole(true);
    try {
      // Update user role
      const response = await fetch("/api/auth/Signup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          role: roleType,
        }),
      });

      const result = await response.json();

      if (result.token) {
        // Store new token
        localStorage.setItem("token", result.token);
        console.log("Role updated successfully, new token generated");
        
        // Call the original onContinueAsProvider callback
        onContinueAsProvider();
      } else {
        console.error("Failed to update role:", result.error);
        // Still call onContinueAsProvider to show the form, but log the error
        onContinueAsProvider();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      // Still call onContinueAsProvider to show the form, but log the error
      onContinueAsProvider();
    } finally {
      setUpdatingRole(false);
    }
  };

  const roleData = {
    doctor: {
      title: "Become a Doctor",
      description: "Join our network of verified doctors and start consulting patients",
      icon: Stethoscope,
      color: "from-blue-500 to-blue-600",
    },
    lawyer: {
      title: "Become a Lawyer",
      description: "Join our network of verified lawyers and provide legal services",
      icon: Scale,
      color: "from-purple-500 to-purple-600",
    },
  };

  const data = roleData[roleType] || roleData.doctor;
  const Icon = data.icon;

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

          {/* Icon Section */}
          <div className="flex justify-center mb-6">
            <div className={`bg-gradient-to-br ${data.color} p-4 rounded-2xl`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {data.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8">
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Note:</span> You can always switch between browsing and providing services. Your profile will be verified before going live.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleBecomeProvider}
              disabled={isLoading || updatingRole}
              className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 ${
                isLoading || updatingRole
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : `bg-gradient-to-r ${data.color} text-white hover:shadow-lg cursor-pointer`
              }`}
            >
              {isLoading || updatingRole ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {updatingRole ? "Updating Role..." : "Setting up..."}
                </>
              ) : (
                <>
                  <Icon size={18} />
                  Yes, Let Me Become a {roleType === "doctor" ? "Doctor" : "Lawyer"}
                </>
              )}
            </button>

            <button
              onClick={onContinueAsBrowser}
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold transition bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              No, Let Me Browse Providers
            </button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}
