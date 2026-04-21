"use client";

import React, { useRef, useState } from "react";
import { ChevronDown, Image as ImageIcon, Stethoscope } from "lucide-react";

const inputClasses =
  "w-full h-10 px-3 text-sm rounded-md bg-[#d9d9d9] border border-[#d9d9d9] text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e45b5c]/25 focus:border-[#e45b5c]";
const labelClasses = "block text-[13px] font-medium text-[#222] mb-2";
const selectClasses =
  "w-full h-10 px-3 text-sm rounded-md bg-[#d9d9d9] border border-[#d9d9d9] text-gray-800 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#e45b5c]/25 focus:border-[#e45b5c]";
const selectIconClasses =
  "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-700 pointer-events-none";

const SpecializationTag = ({ text, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center px-3 py-1.5 text-xs rounded-md font-medium transition-colors border ${
      active
        ? "bg-[#e45b5c] text-white border-[#e45b5c]"
        : "bg-[#d9d9d9] text-[#292929] border-[#d9d9d9] hover:bg-[#cfcfcf]"
    }`}
  >
    {text}
  </button>
);

const DayTag = ({ text, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex min-w-12 justify-center px-3 py-2 rounded-md text-xs font-semibold ${
      active ? "bg-[#e45b5c] text-white" : "bg-[#d1d1d1] text-[#232323]"
    }`}
  >
    {text}
  </button>
);

export default function DoctorProfileForm() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const workDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const specializations = [
    "General physician",
    "Cardiologist",
    "Dermatologist",
    "Neurologist",
    "Dentist",
    "Orthopedic",
  ];

  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("");
  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedDays, setSelectedDays] = useState(workDays);
  const [fromTime, setFromTime] = useState("10:00");
  const [toTime, setToTime] = useState("18:00");

  const toggleSpecialization = (item) => {
    setSelectedSpecializations((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item],
    );
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
  };

  const handleCancel = () => {
    setProfileImage("");
    setSelectedSpecializations([]);
    setSelectedDays(workDays);
    setFromTime("10:00");
    setToTime("18:00");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#e3e3e3] py-6 px-4 flex justify-center">
      <div className="w-full max-w-[900px] bg-[#ececec] rounded-xl border border-[#2f2f2f]/35 overflow-hidden">
        <div className="px-5 py-4 border-b border-[#2f2f2f]/35 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-[#e7a7a8] flex items-center justify-center">
            <Stethoscope className="size-7 text-[#e45b5c]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[27px] leading-none font-semibold text-[#151515]">
              Doctor Profile Form
            </h1>
            <p className="text-[21px] leading-none text-[#2f2f2f] mt-1.5">
              Complete your professional profile
            </p>
          </div>
        </div>

        <form className="text-[13px]" onSubmit={(e) => e.preventDefault()}>
          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Basic info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Full Name</label>
                  <input
                    className={inputClasses}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Mobile Number</label>
                  <input
                    className={inputClasses}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label className={labelClasses}>City/Location</label>
                  <input className={inputClasses} placeholder="Enter city" />
                </div>
              </div>

              <div className="space-y-4 md:max-w-[280px]">
                <div>
                  <label className={labelClasses}>Profile Picture</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 w-full rounded-xl bg-[#d1d1d1] border border-[#d1d1d1] flex items-center justify-center overflow-hidden hover:bg-[#c8c8c8] transition"
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-6 text-[#111]" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <div className="relative">
                  <label className={labelClasses}>Gender</label>
                  <div className="relative">
                    <select className={selectClasses} defaultValue="">
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    <ChevronDown className={selectIconClasses} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-[#2f2f2f]/35" />

          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Medical info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>
                  PMDC/Medical License Number
                </label>
                <input
                  className={inputClasses}
                  placeholder="Enter registration number"
                />
              </div>
              <div>
                <label className={labelClasses}>Hospital/Clinic Name</label>
                <input
                  className={inputClasses}
                  placeholder="Enter hospital name"
                />
              </div>
              <div>
                <label className={labelClasses}>Experience (year)</label>
                <input
                  className={inputClasses}
                  placeholder="Enter year of experience"
                />
              </div>
            </div>
          </section>

          <div className="border-t border-[#2f2f2f]/35" />

          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Specialization
            </h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {specializations.map((item) => (
                <SpecializationTag
                  key={item}
                  text={item}
                  active={selectedSpecializations.includes(item)}
                  onClick={() => toggleSpecialization(item)}
                />
              ))}
            </div>
          </section>

          <div className="border-t border-[#2f2f2f]/35" />

          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr,0.9fr] gap-5">
              <div className="relative">
                <label className={labelClasses}>
                  Degree (MBBS/MD/Specialization)
                </label>
                <div className="relative">
                  <select className={selectClasses} defaultValue="">
                    <option value="" disabled>
                      Select degree
                    </option>
                    <option value="mbbs">MBBS</option>
                    <option value="md">MD</option>
                    <option value="specialization">Specialization</option>
                  </select>
                  <ChevronDown className={selectIconClasses} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>
                  University/Medical College
                </label>
                <input
                  className={inputClasses}
                  placeholder="Enter university name"
                />
              </div>
              <div className="relative">
                <label className={labelClasses}>Year of Graduation</label>
                <div className="relative">
                  <select className={selectClasses} defaultValue="">
                    <option value="" disabled>
                      Select year
                    </option>
                    {Array.from(
                      { length: 15 },
                      (_, i) => new Date().getFullYear() - i,
                    ).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className={selectIconClasses} />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-[#2f2f2f]/35" />

          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Availability
            </h3>
            <div className="mb-5">
              <label className={labelClasses}>Available Days</label>
              <div className="flex flex-wrap gap-2.5">
                {days.map((day) => (
                  <DayTag
                    key={day}
                    text={day}
                    active={selectedDays.includes(day)}
                    onClick={() => toggleDay(day)}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className={labelClasses}>Time Slots</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <label className={labelClasses}>From</label>
                  <input
                    type="time"
                    value={fromTime}
                    onChange={(e) => setFromTime(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div className="relative">
                  <label className={labelClasses}>To</label>
                  <input
                    type="time"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Consultation Fee (Rs.)</label>
                  <input
                    className={inputClasses}
                    placeholder="Enter consultation fee"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="border-t border-[#2f2f2f]/35" />

          <section className="px-5 pt-4 pb-5">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              About
            </h3>
            <div>
              <label className={labelClasses}>Short Bio</label>
              <textarea
                rows={4}
                placeholder="Write a short Bio about yourself (2-5 lines)..."
                className="w-full rounded-md bg-[#d9d9d9] border border-[#d9d9d9] px-3 py-3 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e45b5c]/25 focus:border-[#e45b5c]"
              />
            </div>
          </section>

          <div className="px-5 pb-5 flex justify-end gap-6">
            <button
              type="button"
              onClick={handleCancel}
              className="min-w-28 h-11 px-5 rounded-lg bg-[#d1d1d1] text-[#191919] text-sm font-semibold hover:bg-[#c6c6c6] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-w-28 h-11 px-5 rounded-lg bg-[#e45b5c] text-white text-sm font-semibold shadow-sm hover:bg-[#d74f50] transition-colors"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
