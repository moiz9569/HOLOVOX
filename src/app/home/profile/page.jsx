"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, MapPin, Phone, Briefcase, Clock, Banknote, GraduationCap, CalendarClock, UserRound, SquarePen } from "lucide-react";
import { getTokenData } from "@/app/content/data";

const InfoCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border border-[#E51A54]/20 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
      <Icon className="w-4 h-4 text-[#E51A54]" />
      {label}
    </div>
    <p className="mt-2 text-sm sm:text-base font-semibold text-gray-800 break-words">{value || "N/A"}</p>
  </div>
);

export default function ProfilePage() {
  const [tokenUser, setTokenUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const role = tokenUser?.role;
  const isProvider = role === "doctor" || role === "lawyer";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const user = await getTokenData();
        setTokenUser(user || null);

        const userId = user?.id || user?._id || user?.userId;
        if (!userId) {
          throw new Error("User not found. Please login again.");
        }

        if (user?.role !== "doctor" && user?.role !== "lawyer") {
          setLoading(false);
          return;
        }

        const res = await fetch(`/api/user/info?userId=${userId}`);
        const data = await res.json();

        if (!res.ok || !data?.success) {
          throw new Error(data?.message || "Failed to load profile");
        }

        setProfile(data?.data || null);
      } catch (err) {
        setError(err?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const basicInfo = useMemo(() => profile?.basicInfo || {}, [profile]);
  const professionalInfo = useMemo(() => profile?.professionalInfo || {}, [profile]);
  const educationInfo = useMemo(() => profile?.educationInfo || {}, [profile]);
  const availabilityInfo = useMemo(() => profile?.availabilityInfo || {}, [profile]);

  const specializationList = Array.isArray(professionalInfo?.Specialization)
    ? professionalInfo.Specialization
    : professionalInfo?.Specialization
      ? [professionalInfo.Specialization]
      : [];

  const availableDays = Array.isArray(availabilityInfo?.AvailableDays)
    ? availabilityInfo.AvailableDays.join(", ")
    : "N/A";

  const availableSlots = Array.isArray(availabilityInfo?.AvailableTimeSlots)
    ? availabilityInfo.AvailableTimeSlots.join(", ")
    : "N/A";

  const degreeList = Array.isArray(educationInfo?.Degree) ? educationInfo.Degree : [];

  const createdAt = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleString()
    : "N/A";

  const updatedAt = profile?.updatedAt
    ? new Date(profile.updatedAt).toLocaleString()
    : "N/A";

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto rounded-2xl border border-red-200 bg-red-50 text-red-600 p-4 sm:p-6">
          {error}
        </div>
      </div>
    );
  }

  if (!isProvider) {
    return (
      <div className="min-h-[calc(100vh-64px)] p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto rounded-2xl border border-gray-200 bg-white p-5 sm:p-7 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Provider profile is available only for Doctor/Lawyer accounts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] p-3 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="rounded-3xl bg-gradient-to-r from-[#E51A54] via-[#f04478] to-[#E51A54] p-[1px] shadow-lg">
          <div className="rounded-3xl bg-white p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <img
                src={basicInfo?.ProfilePicture || "https://via.placeholder.com/200x200?text=Profile"}
                alt={basicInfo?.FullName || "Profile"}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#E51A54]/40"
              />
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 truncate">
                  {basicInfo?.FullName || tokenUser?.name || "Profile"}
                </h1>
                <p className="mt-1 text-sm sm:text-base text-gray-600 capitalize flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#E51A54]" />
                  {basicInfo?.role || role}
                </p>
                <p className="mt-1 text-sm sm:text-base text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#E51A54]" />
                  {basicInfo?.City || "N/A"}
                </p>
              </div>

              <button
                disabled
                className="sm:ml-auto mt-1 sm:mt-0 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
              >
                <SquarePen className="w-4 h-4" />
                Edit Profile (Soon)
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <InfoCard label="Phone" value={basicInfo?.PhoneNumber} icon={Phone} />
              <InfoCard label="Gender" value={basicInfo?.Gender || "N/A"} icon={UserRound} />
              <InfoCard label="Experience" value={`${professionalInfo?.YearsOfExperience ?? "N/A"} years`} icon={Briefcase} />
              <InfoCard label="Consultation Fee" value={`Rs. ${availabilityInfo?.ConsultationFee ?? "N/A"}`} icon={Banknote} />
              <InfoCard label="Available Days" value={availableDays} icon={CalendarClock} />
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <InfoCard label="Available Slots" value={availableSlots} icon={Clock} />
              <InfoCard label="Law School" value={educationInfo?.LawSchoolAttended || "N/A"} icon={GraduationCap} />
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <InfoCard label="Profile Created" value={createdAt} icon={CalendarClock} />
              <InfoCard label="Last Updated" value={updatedAt} icon={CalendarClock} />
            </div>

            <section className="mt-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {specializationList.length ? (
                  specializationList.map((item, index) => (
                    <span
                      key={`${item}-${index}`}
                      className="inline-flex items-center rounded-full bg-[#E51A54]/10 px-3 py-1 text-xs sm:text-sm font-medium text-[#E51A54]"
                    >
                      {item}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">N/A</p>
                )}
              </div>
            </section>

            <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-gray-700">About</h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600 leading-relaxed">
                {availabilityInfo?.about || "No description available."}
              </p>
            </section>

            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Education</h2>
              {!degreeList.length && (
                <p className="text-sm text-gray-500">N/A</p>
              )}

              {!!degreeList.length && (
                <div className="space-y-3">
                  {degreeList.map((degree, index) => (
                    <div
                      key={degree?._id || `degree-${index}`}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                    >
                      <p className="text-sm font-semibold text-gray-800">
                        {degree?.DegreeObtained || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {degree?.UniversityName || "N/A"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Graduation Year: {degree?.GraduationYear || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-5">
              <h2 className="text-sm font-semibold text-gray-700">System Info</h2>
              <p className="mt-2 text-xs sm:text-sm text-gray-600 break-all">
                Profile ID: {profile?._id || "N/A"}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-gray-600 break-all">
                Linked User ID: {basicInfo?.userId || "N/A"}
              </p>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
