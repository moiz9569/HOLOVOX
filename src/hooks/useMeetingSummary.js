import { useState, useRef } from "react";

export const useMeetingSummary = (room, showNotification) => {
  const [isRecording, setIsRecording] = useState(false);
  const [summary, setSummary] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    console.log("startRecording called");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((track) => track.stop());
        await generateSummary(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      showNotification("Recording meeting...", "info");
    } catch (error) {
      console.error("Recording failed:", error);
      showNotification("Failed to start recording", "error");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      showNotification("Generating notes...", "info");
    }
  };

  const generateSummary = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "meeting-audio.webm");

      const res = await fetch("/api/user/summary", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
        showNotification("Meeting notes ready!", "success");
      } else {
        showNotification("Failed to generate notes", "error");
      }
    } catch (error) {
      console.error("Summary generation failed:", error);
      showNotification("Failed to generate notes", "error");
    }
  };

  return {
    isRecording,
    summary,
    setSummary,
    startRecording,
    stopRecording,
  };
};