// import { useState, useRef } from "react";

// export const useRecording = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);
//   const recordingStreamRef = useRef(null);

//   const startRecording = async () => {
//     console.log("Starting recording...");
//     try {
//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true,
//         audio: true,
//       });
//       recordingStreamRef.current = stream;
//       const mediaRecorder = new MediaRecorder(stream);
//       mediaRecorderRef.current = mediaRecorder;
//       recordedChunksRef.current = [];
//       mediaRecorder.ondataavailable = (event) => {
//         if (event.data.size > 0) recordedChunksRef.current.push(event.data);
//       };
//       mediaRecorder.start();
//       setIsRecording(true);
//     } catch (error) {
//       console.error("Recording error:", error);
//     }
//   };

//   const stopRecording = () => {
//     const mediaRecorder = mediaRecorderRef.current;
//     if (!mediaRecorder) return;
//     mediaRecorder.stop();
//     mediaRecorder.onstop = () => {
//       const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `holovox-meeting-${Date.now()}.webm`;
//       a.click();
//       recordedChunksRef.current = [];
//       if (recordingStreamRef.current) {
//         recordingStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//     };
//     setIsRecording(false);
//   };

//   return {
//     isRecording,
//     startRecording,
//     stopRecording,
//   };
// };


import { useState, useRef } from "react";

export const useRecording = (roomId, userId) => {
  // console.log("useRecording initialized with:", { roomId, userId });
  const [isRecording, setIsRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null); // 🔥 preview ke liye

  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingStreamRef = useRef(null);

  // =========================
  // 🎥 START RECORDING
  // =========================
  const startRecording = async () => {
    console.log("Starting recording...");
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      recordingStreamRef.current = stream;

      // const mediaRecorder = new MediaRecorder(stream);
      const mediaRecorder = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
    videoBitsPerSecond: 1500000, // 🔥 reduce size
    });
      mediaRecorderRef.current = mediaRecorder;

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  // =========================
  // ⛔ STOP RECORDING
  // =========================
  const stopRecording = async () => {
    console.log("Stopping recording...");
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.stop();

    mediaRecorder.onstop = async () => {
      try {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });

        const url = URL.createObjectURL(blob);

        // ✅ Preview (screen pe show)
        setVideoURL(url);

        // =========================
        // 📥 DOWNLOAD
        // =========================
        const a = document.createElement("a");
        a.href = url;
        a.download = `holovox-meeting-${Date.now()}.webm`;
        a.click();

        // =========================
        // ☁️ UPLOAD TO BACKEND
        // =========================


        // 🚀 DIRECT CLOUDINARY UPLOAD (FAST)
const formData = new FormData();
formData.append("file", blob);
formData.append("upload_preset", "holovox_recording");

const cloudRes = await fetch(
  "https://api.cloudinary.com/v1_1/dfzattnt8/video/upload",
  {
    method: "POST",
    body: formData,
  }
);

const cloudData = await cloudRes.json();

console.log("Cloud URL:", cloudData);
// 💾 SAVE TO DB (LIGHTWEIGHT)
await fetch("/api/user/upload-recording", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    meetingId: roomId,
    userId: userId,
    videoUrl: cloudData.secure_url,
    publicId: cloudData.public_id,
  }),
});

        // =========================
        // 🧹 CLEANUP
        // =========================
        recordedChunksRef.current = [];

        if (recordingStreamRef.current) {
          recordingStreamRef.current
            .getTracks()
            .forEach((track) => track.stop());
        }
      } catch (error) {
        console.error("Stop recording error:", error);
      }
    };

    setIsRecording(false);
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    videoURL, // 🔥 UI me use hoga
  };
};