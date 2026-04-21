"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Track, RoomEvent } from "livekit-client";
import { ThumbsUp, Smile, Heart, Laugh, Frown } from "lucide-react";

import { useMeetingState } from "@/hooks/useMeetingState";
import { useChat } from "@/hooks/useChat";
import { usePermissions } from "@/hooks/usePermissions";

import Notification from "@/components/meeting-room/Notification";
import TopNavbar from "@/components/meeting-room/TopNavbar";
import ControlBar from "@/components/meeting-room/ControlBar";
import Sidebar from "@/components/meeting-room/Sidebar";
import HostPodcast from "./HostPodcast";

export default function PodcastMeetingUI({ isHost, roomId }) {
  const router = useRouter();
  const audioElementsRef = useRef([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const meetingState = useMeetingState();

  useEffect(() => {
    if (!meetingState.room) return;
    const onTrackSubscribed = (track, publication, participant) => {
      if (track.kind === "audio") {
        const audioElement = new Audio();
        audioElement.srcObject = new MediaStream([track.mediaStreamTrack]);
        audioElement.style.display = "none";
        document.body.appendChild(audioElement);
        audioElement.play().catch(console.warn);
        audioElementsRef.current.push(audioElement);
      }
    };
    meetingState.room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
    return () => {
      meetingState.room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      audioElementsRef.current.forEach(el => {
        el.pause();
        el.srcObject = null;
        el.remove();
      });
    };
  }, [meetingState.room]);

  const { permissions } = usePermissions(isHost, showNotification);
  const chat = useChat(meetingState.room, permissions);

  const toggleAudio = async () => {
    const enabled = !meetingState.localParticipant.isMicrophoneEnabled;
    await meetingState.localParticipant.localParticipant.setMicrophoneEnabled(enabled);
    meetingState.setIsMuted(!enabled);
  };

  const toggleVideo = async () => {
    const enabled = !meetingState.localParticipant.isCameraEnabled;
    await meetingState.localParticipant.localParticipant.setCameraEnabled(enabled);
    meetingState.setIsVideoOff(!enabled);
  };

  const leaveMeeting = async () => {
    await meetingState.room.disconnect();
    router.push("/home");
  };

  const addReaction = (type) => {
    meetingState.addReaction(type);
    meetingState.setShowReactions(false);
  };

  const getReactionIcon = (type) => {
    switch (type) {
      case "thumbsup": return <ThumbsUp size={24} className="text-yellow-400" />;
      case "smile": return <Smile size={24} className="text-yellow-400" />;
      case "heart": return <Heart size={24} className="text-red-400" />;
      case "laugh": return <Laugh size={24} className="text-yellow-400" />;
      case "frown": return <Frown size={24} className="text-yellow-400" />;
      default: return <Smile size={24} className="text-yellow-400" />;
    }
  };

  const isSidebarOpen =
    meetingState.showParticipants ||
    meetingState.showChat ||
    meetingState.showNotes;

  const toggleSidebarPanel = () => {
    if (isSidebarOpen) {
      meetingState.setShowParticipants(false);
      meetingState.setShowChat(false);
      meetingState.setShowNotes(false);
      return;
    }

    meetingState.setShowParticipants(true);
    meetingState.setShowChat(false);
    meetingState.setShowNotes(false);
  };

  const podcastInviteLink = `${window.location.origin}/podcast/${roomId}?role=guest`;

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-700 text-white">
      <Notification notification={notification} />

      <div className="fixed top-20 right-20 z-50 space-y-2">
        {meetingState.reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-black/60 backdrop-blur-lg rounded-full p-3"
          >
            {getReactionIcon(reaction.type)}
          </motion.div>
        ))}
      </div>

      <div className="flex-1 flex flex-col relative">
        <TopNavbar
          showControls={meetingState.showControls}
          isHost={isHost}
          meetingLocked={meetingState.meetingLocked}
          roomId={roomId}
          isFullscreen={meetingState.isFullscreen}
          toggleFullscreen={meetingState.toggleFullscreen}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebarPanel}
        />

        <div className="flex-1 relative">
          <HostPodcast room={meetingState.room} />
        </div>

        <ControlBar
          showControls={meetingState.showControls}
          isMuted={meetingState.isMuted}
          toggleAudio={toggleAudio}
          isVideoOff={meetingState.isVideoOff}
          toggleVideo={toggleVideo}
          showReactions={meetingState.showReactions}
          setShowReactions={meetingState.setShowReactions}
          addReaction={addReaction}
          permissions={permissions}
          isHost={isHost}
          leaveMeeting={leaveMeeting}
          showParticipants={meetingState.showParticipants}
          setShowParticipants={meetingState.setShowParticipants}
          remotePeers={meetingState.remotePeers}
          showChat={meetingState.showChat}
          setShowChat={meetingState.setShowChat}
          messages={chat.messages}
        />
      </div>

      <Sidebar
        showParticipants={meetingState.showParticipants}
        showChat={meetingState.showChat}
        setShowParticipants={meetingState.setShowParticipants}
        setShowChat={meetingState.setShowChat}
        remotePeers={meetingState.remotePeers}
        isHost={isHost}
        participantNames={meetingState.participantNames}
        isMuted={meetingState.isMuted}
        isVideoOff={meetingState.isVideoOff}
        messages={chat.messages}
        newMessage={chat.newMessage}
        setNewMessage={chat.setNewMessage}
        sendMessage={(e) => chat.sendMessage(e, showNotification)}
        chatContainerRef={chat.chatContainerRef}
        permissions={permissions}
        copyLink={() => {
          navigator.clipboard.writeText(podcastInviteLink);
          showNotification("Podcast invite link copied!", "success");
        }}
      />
    </div>
  );
}