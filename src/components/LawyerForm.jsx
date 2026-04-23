// "use client";
// import React, { useRef, useState } from "react";
// import { ChevronDown, Image as ImageIcon, Scale } from "lucide-react";

// const inputClasses =
//   "w-full h-10 px-3 text-sm rounded-md bg-[#d9d9d9] border border-[#d9d9d9] text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e45b5c]/25 focus:border-[#e45b5c]";
// const labelClasses = "block text-[13px] font-medium text-[#222] mb-2";
// const selectClasses =
//   "w-full h-10 px-3 text-sm rounded-md bg-[#d9d9d9] border border-[#d9d9d9] text-gray-800 appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#e45b5c]/25 focus:border-[#e45b5c]";
// const selectIconClasses =
//   "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-700 pointer-events-none";

// const SpecializationTag = ({ text, active, onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={`inline-flex items-center px-3 py-1.5 text-xs rounded-md font-medium transition-colors border ${
//       active
//         ? "bg-[#e45b5c] text-white border-[#e45b5c]"
//         : "bg-[#d9d9d9] text-[#292929] border-[#d9d9d9] hover:bg-[#cfcfcf]"
//     }`}
//   >
//     {text}
//   </button>
// );

// const DayTag = ({ text, active, onClick }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={`inline-flex min-w-12 justify-center px-3 py-2 rounded-md text-xs font-semibold ${
//       active ? "bg-[#e45b5c] text-white" : "bg-[#d1d1d1] text-[#232323]"
//     }`}
//   >
//     {text}
//   </button>
// );

// export default function LawyerProfileForm({ onClose, userId }) {
//   const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//   const workDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
//   const specializations = [
//     "Criminal Law",
//     "Family Law",
//     "Corporate Law",
//     "Civil Law",
//     "Cyber Crime",
//     "Property Law",
//   ];

//   const fileInputRef = useRef(null);
//   const [profileImage, setProfileImage] = useState("");
//   const [profileImageFile, setProfileImageFile] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   // Form state
//   const [formData, setFormData] = useState({
//     fullName: "",
//     mobileNumber: "",
//     city: "",
//     gender: "",
//     barRegistrationNumber: "",
//     experience: "",
//     lawFirmName: "",
//     degree: "",
//     universityName: "",
//     graduationYear: "",
//     consultationFee: "",
//     about: "",
//   });

//   const [selectedSpecializations, setSelectedSpecializations] = useState([]);
//   const [selectedDays, setSelectedDays] = useState(workDays);
//   const [fromTime, setFromTime] = useState("10:00");
//   const [toTime, setToTime] = useState("18:00");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setSubmitError(""); // Clear error on input change
//   };

//   const toggleSpecialization = (item) => {
//     setSelectedSpecializations((prev) =>
//       prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
//     );
//   };

//   const toggleDay = (day) => {
//     setSelectedDays((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
//     );
//   };

//   const handleImageChange = (event) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
//     const imageUrl = URL.createObjectURL(file);
//     setProfileImage(imageUrl);
//     setProfileImageFile(file);
//   };

//   // Validate all required fields
//   const isFormValid = () => {
//     const requiredFields = [
//       formData.fullName,
//       formData.mobileNumber,
//       formData.city,
//       formData.gender,
//       formData.barRegistrationNumber,
//       formData.experience,
//       formData.degree,
//       formData.universityName,
//       formData.graduationYear,
//       formData.consultationFee,
//       formData.about,
//     ];

//     const allFieldsFilled = requiredFields.every(field => field && field.trim() !== "");
//     const hasSpecializations = selectedSpecializations.length > 0;
//     const hasDays = selectedDays.length > 0;
//     const hasProfileImage = profileImageFile !== null;

//     return allFieldsFilled && hasSpecializations && hasDays && hasProfileImage;
//   };

//   // Convert image to base64
//   const convertImageToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!isFormValid()) {
//       setSubmitError("Please fill all required fields and upload profile picture");
//       return;
//     }

//     setIsSubmitting(true);
//     setSubmitError("");

//     try {
//       // Convert image to base64
//       const base64Image = await convertImageToBase64(profileImageFile);

//       // Prepare the data structure matching the backend schema
//       const payload = {
//         basicInfo: {
//           userId: userId, // Make sure to pass userId as prop
//           role: "lawyer",
//           FullName: formData.fullName,
//           ProfilePicture: base64Image,
//           PhoneNumber: formData.mobileNumber,
//           City: formData.city,
//           Gender: formData.gender,
//         },
//         professionalInfo: {
//           BarRegistrationNumber: formData.barRegistrationNumber,
//           LawFirmName: formData.lawFirmName || "",
//           Specialization: selectedSpecializations[0], // Taking first specialization (can be modified)
//           YearsOfExperience: parseInt(formData.experience),
//         },
//         educationInfo: {
//           LawSchoolAttended: formData.universityName,
//           Degree: [
//             {
//               DegreeObtained: formData.degree,
//               UniversityName: formData.universityName,
//               GraduationYear: parseInt(formData.graduationYear),
//             },
//           ],
//         },
//         availabilityInfo: {
//           AvailableDays: selectedDays.map(day => {
//             const dayMap = {
//               "Mon": "Monday",
//               "Tue": "Tuesday",
//               "Wed": "Wednesday",
//               "Thu": "Thursday",
//               "Fri": "Friday",
//               "Sat": "Saturday",
//               "Sun": "Sunday"
//             };
//             return dayMap[day] || day;
//           }),
//           AvailableTimeSlots: [`${fromTime} - ${toTime}`],
//           ConsultationFee: parseInt(formData.consultationFee),
//           about: formData.about,
//         },
//       };

//       console.log("Submitting Lawyer Profile Data:", payload);

//       // Make API call
//       const response = await fetch("/api/user/info", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await response.json();
//       console.log("API Response:", result);

//       if (result.success) {
//         console.log("Lawyer profile created successfully:", result.data);
//         alert("Profile submitted successfully!");
//         onClose(); // Close modal only on success
//       } else {
//         setSubmitError(result.message || "Failed to submit profile");
//         console.error("Submission error:", result.message);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       setSubmitError("An error occurred while submitting. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleCancel = () => {
//     if (window.confirm("Are you sure you want to cancel? All unsaved data will be lost.")) {
//       setProfileImage("");
//       setProfileImageFile(null);
//       setSelectedSpecializations([]);
//       setSelectedDays(workDays);
//       setFromTime("10:00");
//       setToTime("18:00");
//       setFormData({
//         fullName: "",
//         mobileNumber: "",
//         city: "",
//         gender: "",
//         barRegistrationNumber: "",
//         experience: "",
//         lawFirmName: "",
//         degree: "",
//         universityName: "",
//         graduationYear: "",
//         consultationFee: "",
//         about: "",
//       });
//       if (fileInputRef.current) {
//         fileInputRef.current.value = "";
//       }
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] px-4">
//       <div className="w-full mt-20 max-w-[95vw] md:max-w-[900px] max-h-[80vh] overflow-y-auto bg-[#ececec] rounded-xl border border-[#2f2f2f]/35 relative shadow-2xl my-auto">
//         {/* Close Button - Disabled during submission */}
//         {!isSubmitting && (
//           <button
//             onClick={handleCancel}
//             className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#e45b5c] hover:bg-[#d74f50] text-white transition-colors"
//           >
//             ✕
//           </button>
//         )}
        
//         <div className="px-5 py-4 border-b border-[#2f2f2f]/35 flex items-center gap-4 bg-[#ececec] rounded-t-xl z-20">
//           <div className="h-14 w-14 rounded-2xl bg-[#e7a7a8] flex items-center justify-center">
//             <Scale className="size-7 text-[#e45b5c]" strokeWidth={1.75} />
//           </div>
//           <div>
//             <h1 className="text-[27px] leading-none font-semibold text-[#151515]">
//               Lawyer Profile Form
//             </h1>
//             <p className="text-[21px] leading-none text-[#2f2f2f] mt-1.5">
//               Complete your professional profile
//             </p>
//           </div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <section className="px-5 pt-4 pb-3">
//             <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
//               Basic info
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
//               <div className="space-y-4">
//                 <div>
//                   <label className={labelClasses}>Full Name *</label>
//                   <input
//                     name="fullName"
//                     value={formData.fullName}
//                     onChange={handleInputChange}
//                     className={inputClasses}
//                     placeholder="Enter full name"
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelClasses}>Mobile Number *</label>
//                   <input
//                     name="mobileNumber"
//                     value={formData.mobileNumber}
//                     onChange={handleInputChange}
//                     className={inputClasses}
//                     placeholder="Enter phone number"
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelClasses}>City/Location *</label>
//                   <input
//                     name="city"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     className={inputClasses}
//                     placeholder="Enter city"
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4 md:max-w-[280px]">
//                 <div>
//                   <label className={labelClasses}>Profile Picture *</label>
//                   <button
//                     type="button"
//                     onClick={() => !isSubmitting && fileInputRef.current?.click()}
//                     className="h-20 w-full rounded-xl bg-[#d1d1d1] border border-[#d1d1d1] flex items-center justify-center overflow-hidden hover:bg-[#c8c8c8] transition"
//                     disabled={isSubmitting}
//                   >
//                     {profileImage ? (
//                       <img
//                         src={profileImage}
//                         alt="Profile preview"
//                         className="h-full w-full object-cover"
//                       />
//                     ) : (
//                       <ImageIcon className="size-6 text-[#111]" />
//                     )}
//                   </button>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="hidden"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div className="relative">
//                   <label className={labelClasses}>Gender *</label>
//                   <div className="relative">
//                     <select 
//                       name="gender"
//                       value={formData.gender}
//                       onChange={handleInputChange}
//                       className={selectClasses}
//                       required
//                       disabled={isSubmitting}
//                     >
//                       <option value="" disabled>Select gender</option>
//                       <option value="Male">Male</option>
//                       <option value="Female">Female</option>
//                       <option value="Other">Other</option>
//                     </select>
//                     <ChevronDown className={selectIconClasses} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <div className="border-t border-[#2f2f2f]/35" />

//           <section className="px-5 pt-4 pb-3">
//             <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
//               Professional info
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
//               <div className="space-y-4">
//                 <div>
//                   <label className={labelClasses}>Bar Registration Number *</label>
//                   <input
//                     name="barRegistrationNumber"
//                     value={formData.barRegistrationNumber}
//                     onChange={handleInputChange}
//                     className={inputClasses}
//                     placeholder="Enter bar registration number"
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelClasses}>Experience (Years) *</label>
//                   <input
//                     name="experience"
//                     type="number"
//                     value={formData.experience}
//                     onChange={handleInputChange}
//                     className={inputClasses}
//                     placeholder="Enter year of experience"
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-4 md:max-w-[390px]">
//                 <div>
//                   <label className={labelClasses}>Law Firm Name (Optional)</label>
//                   <input
//                     name="lawFirmName"
//                     value={formData.lawFirmName}
//                     onChange={handleInputChange}
//                     className={inputClasses}
//                     placeholder="Enter law firm name"
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelClasses}>Specialization *</label>
//                   <div className="flex flex-wrap gap-2 mt-1">
//                     {specializations.map((item) => (
//                       <SpecializationTag
//                         key={item}
//                         text={item}
//                         active={selectedSpecializations.includes(item)}
//                         onClick={() => !isSubmitting && toggleSpecialization(item)}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           <div className="border-t border-[#2f2f2f]/35" />

//           <section className="px-5 pt-4 pb-3">
//             <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
//               Education
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr,0.9fr] gap-5">
//               <div className="relative">
//                 <label className={labelClasses}>Law Degree (LLB / LLM) *</label>
//                 <div className="relative">
//                   <select 
//                     name="degree"
//                     value={formData.degree}
//                     onChange={handleInputChange}
//                     className={selectClasses}
//                     required
//                     disabled={isSubmitting}
//                   >
//                     <option value="" disabled>Select degree</option>
//                     <option value="LLB">LLB</option>
//                     <option value="LLM">LLM</option>
//                   </select>
//                   <ChevronDown className={selectIconClasses} />
//                 </div>
//               </div>
//               <div>
//                 <label className={labelClasses}>University Name *</label>
//                 <input
//                   name="universityName"
//                   value={formData.universityName}
//                   onChange={handleInputChange}
//                   className={inputClasses}
//                   placeholder="Enter university name"
//                   required
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div className="relative">
//                 <label className={labelClasses}>Year of Graduation *</label>
//                 <div className="relative">
//                   <select 
//                     name="graduationYear"
//                     value={formData.graduationYear}
//                     onChange={handleInputChange}
//                     className={selectClasses}
//                     required
//                     disabled={isSubmitting}
//                   >
//                     <option value="" disabled>Select year</option>
//                     {Array.from(
//                       { length: 50 },
//                       (_, i) => new Date().getFullYear() - i,
//                     ).map((year) => (
//                       <option key={year} value={year}>
//                         {year}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className={selectIconClasses} />
//                 </div>
//               </div>
//             </div>
//           </section>

//           <div className="border-t border-[#2f2f2f]/35" />

//           <section className="px-5 pt-4 pb-3">
//             <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
//               Availability
//             </h3>
//             <div className="mb-5">
//               <label className={labelClasses}>Available Days *</label>
//               <div className="flex flex-wrap gap-2.5">
//                 {days.map((day) => (
//                   <DayTag
//                     key={day}
//                     text={day}
//                     active={selectedDays.includes(day)}
//                     onClick={() => !isSubmitting && toggleDay(day)}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div>
//               <label className={labelClasses}>Time Slots</label>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="relative">
//                   <label className={labelClasses}>From</label>
//                   <input
//                     type="time"
//                     value={fromTime}
//                     onChange={(e) => setFromTime(e.target.value)}
//                     className={inputClasses}
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div className="relative">
//                   <label className={labelClasses}>To</label>
//                   <input
//                     type="time"
//                     value={toTime}
//                     onChange={(e) => setToTime(e.target.value)}
//                     className={inputClasses}
//                     disabled={isSubmitting}
//                   />
//                 </div>
//                 <div>
//                   <label className={labelClasses}>Consultation Fee (Rs.) *</label>
//                   <input
//                     name="consultationFee"
//                     type="number"
//                     value={formData.consultationFee}
//                     onChange={handleInputChange}
//                     className={inputClasses}
//                     placeholder="Enter consultation fee"
//                     required
//                     disabled={isSubmitting}
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           <div className="border-t border-[#2f2f2f]/35" />

//           <section className="px-5 pt-4 pb-5">
//             <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
//               About
//             </h3>
//             <div>
//               <label className={labelClasses}>Short Bio *</label>
//               <textarea
//                 name="about"
//                 value={formData.about}
//                 onChange={handleInputChange}
//                 rows={4}
//                 placeholder="Write a short Bio about yourself (2-5 lines)..."
//                 className="w-full rounded-md bg-[#d9d9d9] border border-[#d9d9d9] px-3 py-3 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e45b5c]/25 focus:border-[#e45b5c]"
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>
//           </section>

//           {submitError && (
//             <div className="px-5 pb-3">
//               <p className="text-red-600 text-sm">{submitError}</p>
//             </div>
//           )}

//           <div className="px-5 pb-5 flex justify-end gap-6">
//             <button
//               type="button"
//               onClick={handleCancel}
//               className="min-w-28 h-11 px-5 rounded-lg bg-[#d1d1d1] text-[#191919] text-sm font-semibold hover:bg-[#c6c6c6] transition-colors"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={!isFormValid() || isSubmitting}
//               className={`min-w-28 h-11 px-5 rounded-lg text-white text-sm font-semibold shadow-sm transition-colors ${
//                 !isFormValid() || isSubmitting
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-[#e45b5c] hover:bg-[#d74f50]"
//               }`}
//             >
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }




















"use client";
import React, { useRef, useState } from "react";
import { ChevronDown, Image as ImageIcon, Scale } from "lucide-react";
import { showSuccessToast } from "../../lib/toast";

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

export default function LawyerProfileForm({ onClose, userId }) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const workDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];
  const specializations = [
    "Criminal Law",
    "Family Law",
    "Corporate Law",
    "Civil Law",
    "Cyber Crime",
    "Property Law",
  ];

  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    city: "",
    gender: "",
    barRegistrationNumber: "",
    experience: "",
    lawFirmName: "",
    degree: "",
    universityName: "",
    graduationYear: "",
    consultationFee: "",
    about: "",
  });

  const [selectedSpecializations, setSelectedSpecializations] = useState([]);
  const [selectedDays, setSelectedDays] = useState(workDays);
  const [fromTime, setFromTime] = useState("10:00");
  const [toTime, setToTime] = useState("18:00");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSubmitError("");
  };

  const toggleSpecialization = (item) => {
    setSelectedSpecializations((prev) =>
      prev.includes(item) ? prev.filter((s) => s !== item) : [...prev, item]
    );
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    setProfileImageFile(file);
  };

  // Validate current step
  const isStepValid = () => {
    switch(currentStep) {
      case 1: // Basic info
        return formData.fullName && formData.fullName.trim() !== "" &&
               formData.mobileNumber && formData.mobileNumber.trim() !== "" &&
               formData.city && formData.city.trim() !== "" &&
               formData.gender && formData.gender.trim() !== "" &&
               profileImageFile !== null;
      
      case 2: // Professional info
        return formData.barRegistrationNumber && formData.barRegistrationNumber.trim() !== "" &&
               formData.experience && formData.experience.trim() !== "" &&
               selectedSpecializations.length > 0;
      
      case 3: // Education
        return formData.degree && formData.degree.trim() !== "" &&
               formData.universityName && formData.universityName.trim() !== "" &&
               formData.graduationYear && formData.graduationYear.trim() !== "";
      
      case 4: // Availability
        return selectedDays.length > 0 &&
               formData.consultationFee && formData.consultationFee.trim() !== "";
      
      case 5: // About
        return formData.about && formData.about.trim() !== "";
      
      default:
        return false;
    }
  };

  // Validate all fields for final submission
  const isFormValid = () => {
    const requiredFields = [
      formData.fullName,
      formData.mobileNumber,
      formData.city,
      formData.gender,
      formData.barRegistrationNumber,
      formData.experience,
      formData.degree,
      formData.universityName,
      formData.graduationYear,
      formData.consultationFee,
      formData.about,
    ];

    const allFieldsFilled = requiredFields.every(field => field && field.trim() !== "");
    const hasSpecializations = selectedSpecializations.length > 0;
    const hasDays = selectedDays.length > 0;
    const hasProfileImage = profileImageFile !== null;

    return allFieldsFilled && hasSpecializations && hasDays && hasProfileImage;
  };

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep(currentStep + 1);
      setSubmitError("");
    } else {
      setSubmitError("Please fill all required fields in this section");
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
    setSubmitError("");
  };

  // Convert image to base64
  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      setSubmitError("Please fill all required fields and upload profile picture");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Convert image to base64
      const base64Image = await convertImageToBase64(profileImageFile);

      // Prepare the data structure matching the backend schema
      const payload = {
        basicInfo: {
          userId: userId,
          role: "lawyer",
          FullName: formData.fullName,
          ProfilePicture: base64Image,
          PhoneNumber: formData.mobileNumber,
          City: formData.city,
          Gender: formData.gender,
        },
        professionalInfo: {
          BarRegistrationNumber: formData.barRegistrationNumber,
          LawFirmName: formData.lawFirmName || "",
          Specialization: selectedSpecializations,
          YearsOfExperience: parseInt(formData.experience),
        },
        educationInfo: {
          LawSchoolAttended: formData.universityName,
          Degree: [
            {
              DegreeObtained: formData.degree,
              UniversityName: formData.universityName,
              GraduationYear: parseInt(formData.graduationYear),
            },
          ],
        },
        availabilityInfo: {
          AvailableDays: selectedDays.map(day => {
            const dayMap = {
              "Mon": "Monday",
              "Tue": "Tuesday",
              "Wed": "Wednesday",
              "Thu": "Thursday",
              "Fri": "Friday",
              "Sat": "Saturday",
              "Sun": "Sunday"
            };
            return dayMap[day] || day;
          }),
          AvailableTimeSlots: [`${fromTime} - ${toTime}`],
          ConsultationFee: parseInt(formData.consultationFee),
          about: formData.about,
        },
      };

      console.log("Submitting Lawyer Profile Data:", payload);

      // Make API call
      const response = await fetch("/api/user/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("API Response:", result);

      if (result.success) {
        console.log("Lawyer profile created successfully:", result.data);
         const updateStatus = await fetch("/api/auth/Signup",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId,
                status: "filled"
            }),
        })
         console.log("Status update response:", await updateStatus.json());
        alert("Profile submitted successfully!");
        showSuccessToast("Profile submitted successfully!");
        onClose();
      } else {
        setSubmitError(result.message || "Failed to submit profile");
        console.error("Submission error:", result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError("An error occurred while submitting. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All unsaved data will be lost.")) {
      setProfileImage("");
      setProfileImageFile(null);
      setSelectedSpecializations([]);
      setSelectedDays(workDays);
      setFromTime("10:00");
      setToTime("18:00");
      setFormData({
        fullName: "",
        mobileNumber: "",
        city: "",
        gender: "",
        barRegistrationNumber: "",
        experience: "",
        lawFirmName: "",
        degree: "",
        universityName: "",
        graduationYear: "",
        consultationFee: "",
        about: "",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Basic info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Full Name *</label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Enter full name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Mobile Number *</label>
                  <input
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Enter phone number"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className={labelClasses}>City/Location *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Enter city"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-4 md:max-w-[280px]">
                <div>
                  <label className={labelClasses}>Profile Picture *</label>
                  <button
                    type="button"
                    onClick={() => !isSubmitting && fileInputRef.current?.click()}
                    className="h-20 w-full rounded-xl bg-[#d1d1d1] border border-[#d1d1d1] flex items-center justify-center overflow-hidden hover:bg-[#c8c8c8] transition"
                    disabled={isSubmitting}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative">
                  <label className={labelClasses}>Gender *</label>
                  <div className="relative">
                    <select 
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className={selectClasses}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown className={selectIconClasses} />
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      
      case 2:
        return (
          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Professional info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-4">
              <div className="space-y-4">
                <div>
                  <label className={labelClasses}>Bar Registration Number *</label>
                  <input
                    name="barRegistrationNumber"
                    value={formData.barRegistrationNumber}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Enter bar registration number"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Experience (Years) *</label>
                  <input
                    name="experience"
                    type="number"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Enter year of experience"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-4 md:max-w-[390px]">
                <div>
                  <label className={labelClasses}>Law Firm Name (Optional)</label>
                  <input
                    name="lawFirmName"
                    value={formData.lawFirmName}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Enter law firm name"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Specialization *</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {specializations.map((item) => (
                      <SpecializationTag
                        key={item}
                        text={item}
                        active={selectedSpecializations.includes(item)}
                        onClick={() => !isSubmitting && toggleSpecialization(item)}
                      />
                    ))}
                  </div>
                  {selectedSpecializations.length === 0 && !isSubmitting && (
                    <p className="text-red-500 text-xs mt-2">Please select at least one specialization</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      
      case 3:
        return (
          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Education
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-[1.1fr,1fr,0.9fr] gap-5">
              <div className="relative">
                <label className={labelClasses}>Law Degree (LLB / LLM) *</label>
                <div className="relative">
                  <select 
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className={selectClasses}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>Select degree</option>
                    <option value="LLB">LLB</option>
                    <option value="LLM">LLM</option>
                  </select>
                  <ChevronDown className={selectIconClasses} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>University Name *</label>
                <input
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleInputChange}
                  className={inputClasses}
                  placeholder="Enter university name"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="relative">
                <label className={labelClasses}>Year of Graduation *</label>
                <div className="relative">
                  <select 
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleInputChange}
                    className={selectClasses}
                    required
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>Select year</option>
                    {Array.from(
                      { length: 50 },
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
        );
      
      case 4:
        return (
          <section className="px-5 pt-4 pb-3">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              Availability
            </h3>
            <div className="mb-5">
              <label className={labelClasses}>Available Days *</label>
              <div className="flex flex-wrap gap-2.5">
                {days.map((day) => (
                  <DayTag
                    key={day}
                    text={day}
                    active={selectedDays.includes(day)}
                    onClick={() => !isSubmitting && toggleDay(day)}
                  />
                ))}
              </div>
              {selectedDays.length === 0 && !isSubmitting && (
                <p className="text-red-500 text-xs mt-2">Please select at least one available day</p>
              )}
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
                    disabled={isSubmitting}
                  />
                </div>
                <div className="relative">
                  <label className={labelClasses}>To</label>
                  <input
                    type="time"
                    value={toTime}
                    onChange={(e) => setToTime(e.target.value)}
                    className={inputClasses}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Consultation Fee (Rs.) *</label>
                  <input
                    name="consultationFee"
                    type="number"
                    value={formData.consultationFee}
                    onChange={handleInputChange}
                    className={inputClasses}
                    placeholder="Enter consultation fee"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>
          </section>
        );
      
      case 5:
        return (
          <section className="px-5 pt-4 pb-5">
            <h3 className="text-[30px] leading-none font-semibold text-[#161616] mb-5">
              About
            </h3>
            <div>
              <label className={labelClasses}>Short Bio *</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                rows={4}
                placeholder="Write a short Bio about yourself (2-5 lines)..."
                className="w-full rounded-md bg-[#d9d9d9] border border-[#d9d9d9] px-3 py-3 text-sm text-gray-800 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#e45b5c]/25 focus:border-[#e45b5c]"
                required
                disabled={isSubmitting}
              />
            </div>
          </section>
        );
      
      default:
        return null;
    }
  };

  // Get step title for progress indicator
  const getStepTitle = () => {
    switch(currentStep) {
      case 1: return "Basic Information";
      case 2: return "Professional Information";
      case 3: return "Education";
      case 4: return "Availability";
      case 5: return "About You";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000] px-4">
      <div className="w-full mt-20 max-w-[95vw] md:max-w-[900px] max-h-[80vh] overflow-y-auto bg-[#ececec] rounded-xl border border-[#2f2f2f]/35 relative shadow-2xl my-auto">
        {/* Close Button - Disabled during submission */}
        {/* {!isSubmitting && (
          <button
            onClick={handleCancel}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[#e45b5c] hover:bg-[#d74f50] text-white transition-colors"
          >
            ✕
          </button>
        )} */}
        
        <div className="px-5 py-4 border-b border-[#2f2f2f]/35 flex items-center gap-4 bg-[#ececec] rounded-t-xl z-20">
          <div className="h-14 w-14 rounded-2xl bg-[#e7a7a8] flex items-center justify-center">
            <Scale className="size-7 text-[#e45b5c]" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-[27px] leading-none font-semibold text-[#151515]">
              Lawyer Profile Form
            </h1>
            <p className="text-[21px] leading-none text-[#2f2f2f] mt-1.5">
              Complete your professional profile
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="px-5 py-3 border-b border-[#2f2f2f]/35 bg-[#e3e3e3]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#e45b5c]">Step {currentStep} of 5</span>
              <span className="text-xs text-gray-600">- {getStepTitle()}</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`h-1.5 w-8 rounded-full transition-all ${
                    step === currentStep
                      ? "bg-[#e45b5c]"
                      : step < currentStep
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderStepContent()}

          {submitError && (
            <div className="px-5 pb-3">
              <p className="text-red-600 text-sm">{submitError}</p>
            </div>
          )}

          <div className="px-5 pb-5 flex justify-between gap-6">
            <div className="flex gap-3">
              {/* <button
                type="button"
                onClick={handleCancel}
                className="min-w-28 h-11 px-5 rounded-lg bg-[#d1d1d1] text-[#191919] text-sm font-semibold hover:bg-[#c6c6c6] transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button> */}
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="min-w-28 h-11 px-5 rounded-lg bg-gray-600 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
                  disabled={isSubmitting}
                >
                  Previous
                </button>
              )}
            </div>
            
            <div>
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid() || isSubmitting}
                  className={`min-w-28 h-11 px-5 rounded-lg text-white text-sm font-semibold shadow-sm transition-colors ${
                    !isStepValid() || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#e45b5c] hover:bg-[#d74f50]"
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`min-w-28 h-11 px-5 rounded-lg text-white text-sm font-semibold shadow-sm transition-colors ${
                    !isFormValid() || isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#e45b5c] hover:bg-[#d74f50]"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}