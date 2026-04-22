"use client";

import { useRouter } from "next/navigation";
import { Shield, Home, ArrowRight } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        
        {/* Main Card */}
        <div className="bg-gradient-to-br from-[#000B1F] via-gray-700 to-[#000B1F] rounded-2xl shadow-2xl border border-gray-100 p-8">
          
          {/* Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Shield className="w-10 h-10 text-white" />
          </div>

          {/* Content */}
          <h1 className="text-3xl font-bold text-white mb-3">
            Access Denied
          </h1>
          
          <p className="text-gray-400 mb-2 text-lg">
            You need to be logged in to view this page
          </p>

          <p className="text-gray-400 text-sm mb-8">
            This dashboard is protected and requires authentication.
          </p>

          {/* Action Button */}
          <button
            onClick={handleGoHome}
            className="group cursor-pointer w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Return to Homepage
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

        </div>

        {/* Footer */}
        {/* <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Agua DAO Platform
          </p>
        </div> */}
      </div>
    </div>
  );
}