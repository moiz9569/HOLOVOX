import React from "react";
import { Search, SlidersHorizontal, List } from "lucide-react";

const CardiologistsModal = ({ onClose, onViewProfile }) => {
//   if (!isOpen) return null;

  const doctors = [1, 2];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-gray-100 ml-20 w-[800px] rounded-2xl p-6 relative shadow-xl">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Cardiologists
          </h2>
          <p className="text-sm text-gray-500">
            Available cardiologists for consultation
          </p>
        </div>

        {/* Search + Filters */}
        <div className="flex gap-3 mb-5">
          <div className="flex items-center bg-gray-200 rounded-lg px-3 py-2 flex-1">
            <Search className="text-gray-500 w-4 h-4 mr-2" />
            <input
              type="text"
              placeholder="search doctors..."
              className="bg-transparent outline-none w-full text-sm"
            />
          </div>

          <button className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700">
            <SlidersHorizontal size={16} />
            All Filters
          </button>

          <button className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700">
            <List size={16} />
            Sort by
          </button>
        </div>

        {/* Doctor Cards */}
        <div className="space-y-4">
          {doctors.map((doc, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="doctor"
                  className="w-14 h-14 rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">
                      Dr. Ahmed Khan
                    </h3>
                    <span className="text-green-500 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Online
                    </span>
                  </div>

                  <p className="text-xs text-gray-600">
                    Cardiologist • 12 Years Exp.
                  </p>

                  <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                    <span>⭐ 4.8 (128 reviews)</span>
                    <span>📍 Karachi, Pakistan</span>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="text-right">
                <p className="font-semibold text-gray-800">
                  Rs. 1,500
                </p>
                <p className="text-xs text-gray-500 mb-2">
                  Consultation fee
                </p>

                <button className="bg-red-500 hover:bg-red-600 text-white text-xs px-4 py-1.5 rounded-md" onClick={onViewProfile}>
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CardiologistsModal;