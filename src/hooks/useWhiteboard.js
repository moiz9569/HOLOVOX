import { useState, useEffect, useRef } from "react";

export const useWhiteboard = (showWhiteboard, whiteboardColor) => {
  const [whiteboardMode, setWhiteboardMode] = useState("draw");
  const [whiteboardColorState, setWhiteboardColorState] = useState("#E62064");
  const [whiteboardData, setWhiteboardData] = useState([]);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    if (whiteboardMode === "erase") {
      ctxRef.current.globalCompositeOperation = "destination-out";
      ctxRef.current.lineWidth = 20;
    } else {
      ctxRef.current.globalCompositeOperation = "source-over";
      ctxRef.current.strokeStyle = whiteboardColorState;
      ctxRef.current.lineWidth = 2;
    }
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    const imageData = canvasRef.current.toDataURL();
    setWhiteboardData([...whiteboardData, imageData]);
  };

  const clearWhiteboard = (showNotification) => {
    if (ctxRef.current) {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      setWhiteboardData([]);
      showNotification("Whiteboard cleared", "success");
    }
  };

  const downloadWhiteboard = (showNotification) => {
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
    showNotification("Whiteboard downloaded", "success");
  };

  // Initialize whiteboard canvas
  useEffect(() => {
    if (showWhiteboard && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = whiteboardColorState;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctxRef.current = ctx;
    }
  }, [showWhiteboard, whiteboardColorState]);

  return {
    whiteboardMode,
    setWhiteboardMode,
    whiteboardColor: whiteboardColorState,
    setWhiteboardColor: setWhiteboardColorState,
    whiteboardData,
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    clearWhiteboard,
    downloadWhiteboard,
  };
};
