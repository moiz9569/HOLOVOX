import { useState, useEffect, useRef } from "react";
import { RoomEvent } from "livekit-client";

export const useChat = (room, permissions) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload, participant) => {
      try {
        const message = JSON.parse(new TextDecoder().decode(payload));
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: message.text,
            sender: participant.identity,
            timestamp: new Date(),
          },
        ]);
      } catch (e) {
        console.error("Failed to parse chat message", e);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e, showNotification) => {
    e.preventDefault();
    if (newMessage.trim() && permissions.chat) {
      const messageData = { text: newMessage };
      const encoder = new TextEncoder();
      const payload = encoder.encode(JSON.stringify(messageData));
      await room.localParticipant.publishData(payload);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: newMessage,
          sender: "You",
          timestamp: new Date(),
        },
      ]);
      setNewMessage("");
      showNotification("Message sent", "success");
    } else if (!permissions.chat) {
      showNotification("Chat is disabled by host", "error");
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    chatContainerRef,
    sendMessage,
  };
};
