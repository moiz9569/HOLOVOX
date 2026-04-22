import React from "react";
import { MapPin, Star, Video } from "lucide-react";
import { showSuccessToast } from "../../lib/toast";

const DoctorProfileModal = ({ onClose }) => {
//   if (!isOpen) return null;

function handleClick() {
  showSuccessToast("Request sent successfully!");
  onClose();
}

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-gray-100 w-[900px] rounded-2xl p-6 relative shadow-xl z-50 ml-40 flex gap-6">

        {/* LEFT IMAGE */}
        <div className="w-[250px] h-[300px] border-4 border-blue-500 rounded-lg overflow-hidden">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="doctor"
            className="w-full h-full object-cover"
          />
        </div>

        {/* MIDDLE CONTENT */}
        <div className="flex-1">
          {/* Name */}
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-gray-800">
              Dr. Ahmed Khan
            </h2>
            <span className="text-blue-500 text-sm">✔</span>
          </div>

          <p className="text-sm text-gray-600 mt-1">
            Cardiologist • 12 Years Exp.
          </p>

          {/* Rating */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <span className="flex items-center gap-1">
              <Star size={14} className="text-yellow-500" />
              4.8 (128 reviews)
            </span>
            <span>98% Patient Satisfaction</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <MapPin size={14} />
            Clifton, Karachi, Pakistan
          </div>

          {/* Specialization */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Specialized in
            </p>
            <div className="flex gap-2 flex-wrap">
              {["Heart Disease", "Heart Failure", "Angioplasty"].map((item, i) => (
                <span
                  key={i}
                  className="bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-md"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">About</p>
            <p className="text-sm text-gray-500">About the doctors</p>
          </div>

          {/* Bottom Stats */}
          <div className="mt-5 bg-gray-300 rounded-lg p-4 grid grid-cols-3 text-center">
            <div>
              <p className="text-xs text-gray-600">Consultation Fee</p>
              <p className="font-semibold">1,500</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Experience</p>
              <p className="font-semibold">12 years</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Patients</p>
              <p className="font-semibold">500+</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[250px] flex flex-col justify-between">
          <div className="bg-gray-300 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Working hours
            </h3>

            <div className="text-xs text-gray-700 space-y-1">
              <div className="flex justify-between">
                <span>Mon–Fri</span>
                <span>09:00 AM - 06:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 02:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>

            <hr className="my-3 border-gray-400" />

            <div className="text-xs text-gray-700">
              <p className="font-medium mb-1">Address</p>
              <p>Cardio care clinic, Clifton Block 5, Karachi, Pakistan</p>
            </div>

            <div className="bg-gray-200 rounded-lg mt-4 h-[80px] flex items-center justify-center text-gray-500">
              Map
            </div>
          </div>

          {/* Button */}
          <button onClick={handleClick} className="mt-4 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
            <Video size={18} />
            Request
          </button>
        </div>

        {/* CLOSE */}
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

export default DoctorProfileModal;