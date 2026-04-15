import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Track, RoomEvent } from "livekit-client";
import { ThumbsUp, Smile, Heart, Laugh, Frown } from "lucide-react";

import { useMeetingState } from "@/hooks/useMeetingState";
import { useChat } from "@/hooks/useChat";
import { useWhiteboard } from "@/hooks/useWhiteboard";
import { useRecording } from "@/hooks/useRecording";
import { usePermissions } from "@/hooks/usePermissions";

import Notification from "./Notification";
import TopNavbar from "./TopNavbar";
import VideoArea from "./VideoArea";
import Thumbnails from "./Thumbnails";
import ControlBar from "./ControlBar";
import Sidebar from "./Sidebar";
import WhiteboardComponent from "./Whiteboard";
import SettingsModal from "./Modals/SettingsModal";
import SecurityModal from "./Modals/SecurityModal";

export default function MeetingUI({ isHost, roomId, router }) {
  const audioElementsRef = useRef([]);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const meetingState = useMeetingState(roomId);

  // Subscribe to remote audio tracks
  useEffect(() => {
    if (!meetingState.room) return;

    const onTrackSubscribed = (track, publication, participant) => {
      if (track.kind === "audio") {
        console.log("Remote audio track subscribed from", participant.identity);
        const audioElement = new Audio();
        const stream = new MediaStream([track.mediaStreamTrack]);
        audioElement.srcObject = stream;
        audioElement.style.display = "none";
        document.body.appendChild(audioElement);
        audioElement
          .play()
          .then(() => console.log("Audio element playing successfully"))
          .catch((err) => console.warn("Audio play failed:", err));
        audioElementsRef.current.push(audioElement);
      }
    };

    meetingState.room.on(RoomEvent.TrackSubscribed, onTrackSubscribed);
    return () => {
      meetingState.room.off(RoomEvent.TrackSubscribed, onTrackSubscribed);
      audioElementsRef.current.forEach((el) => {
        el.pause();
        el.srcObject = null;
        if (el.parentNode) el.parentNode.removeChild(el);
      });
      audioElementsRef.current = [];
    };
  }, [meetingState.room]);

  // Global click handler to resume paused audio (bypass autoplay)
  useEffect(() => {
    const handleGlobalClick = () => {
      console.log("Global click: trying to resume paused audio elements");
      audioElementsRef.current.forEach((el, idx) => {
        console.log(`Element ${idx}: paused=${el.paused}`);
        if (el.paused) {
          el.play().catch((e) => console.warn("Play after click failed:", e));
        }
      });
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  const { permissions, updatePermissions } = usePermissions(
    isHost,
    showNotification
  );
  const chat = useChat(meetingState.room, permissions);
  
  const whiteboard = useWhiteboard(
    meetingState.showWhiteboard,
    meetingState.whiteboardColor
  );
  const recording = useRecording();

  // Helper functions
  const copyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/meeting/${roomId}?role=guest`
    );
    showNotification("Invite link copied to clipboard!", "success");
  };

  const toggleAudio = async () => {
    if (meetingState.localParticipant.isMicrophoneEnabled) {
      await meetingState.localParticipant.localParticipant.setMicrophoneEnabled(
        false
      );
      meetingState.setIsMuted(true);
    } else {
      await meetingState.localParticipant.localParticipant.setMicrophoneEnabled(
        true
      );
      meetingState.setIsMuted(false);
    }
    showNotification(
      meetingState.isMuted ? "Microphone unmuted" : "Microphone muted"
    );
  };

  const toggleVideo = async () => {
    if (permissions.startVideo || isHost) {
      if (meetingState.localParticipant.isCameraEnabled) {
        await meetingState.localParticipant.localParticipant.setCameraEnabled(
          false
        );
        meetingState.setIsVideoOff(true);
      } else {
        await meetingState.localParticipant.localParticipant.setCameraEnabled(
          true
        );
        meetingState.setIsVideoOff(false);
      }
      showNotification(
        meetingState.isVideoOff ? "Camera turned on" : "Camera turned off"
      );
    } else {
      showNotification("Video is disabled by host", "error");
    }
  };

  const toggleScreenShare = async () => {
    if (permissions.shareScreen || isHost) {
      if (meetingState.isScreenSharing) {
        const screenPub =
          meetingState.localParticipant.localParticipant.getTrackPublication(
            Track.Source.ScreenShare
          );
        if (screenPub) await screenPub.unpublish();
        meetingState.setIsScreenSharing(false);
        showNotification("Stopped screen sharing");
      } else {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
          });
          const track = stream.getVideoTracks()[0];
          await meetingState.localParticipant.localParticipant.publishTrack(
            track,
            { source: Track.Source.ScreenShare }
          );
          meetingState.setIsScreenSharing(true);
          showNotification("Started screen sharing");
          track.onended = () => meetingState.setIsScreenSharing(false);
        } catch (error) {
          console.error("Screen sharing error:", error);
          showNotification("Failed to start screen sharing", "error");
        }
      }
    } else {
      showNotification("Screen sharing is disabled by host", "error");
    }
  };

  const endMeeting = () => {
    if (isHost) {
      showNotification("Ending meeting for everyone...", "info");
      setTimeout(async () => {
        await meetingState.room.disconnect();
        router.push("/home");
      }, 1000);
    }
  };

  const leaveMeeting = async () => {
    await meetingState.room.disconnect();
    router.push("/home");
  };

  const removeParticipant = (peerId) => {
    if (isHost) {
      showNotification("Participant removed", "success");
    }
  };

  const toggleMeetingLock = () => {
    meetingState.setMeetingLocked(!meetingState.meetingLocked);
    showNotification(
      meetingState.meetingLocked
        ? "Meeting unlocked"
        : "Meeting locked - No new participants can join"
    );
  };

  const toggleHideProfilePictures = () => {
    meetingState.setHideProfilePictures(!meetingState.hideProfilePictures);
    showNotification(
      meetingState.hideProfilePictures
        ? "Profile pictures visible"
        : "Profile pictures hidden"
    );
  };

  const addReactionWithNotification = (type) => {
    meetingState.addReaction(type);
    showNotification(`You sent a ${type} reaction`);
    meetingState.setShowReactions(false);
  };

  const getReactionIcon = (type) => {
    switch (type) {
      case "thumbsup":
        return <ThumbsUp size={24} className="text-yellow-400" />;
      case "smile":
        return <Smile size={24} className="text-yellow-400" />;
      case "heart":
        return <Heart size={24} className="text-red-400" />;
      case "laugh":
        return <Laugh size={24} className="text-yellow-400" />;
      case "frown":
        return <Frown size={24} className="text-yellow-400" />;
      default:
        return <Smile size={24} className="text-yellow-400" />;
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-slate-700 text-white">
      <Notification notification={notification} />

      {/* Floating Reactions */}
      <div className="fixed top-20 right-20 z-50 space-y-2">
        {meetingState.reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/60 backdrop-blur-lg rounded-full p-3"
          >
            {getReactionIcon(reaction.type)}
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col relative">
        <TopNavbar
          showControls={meetingState.showControls}
          isHost={isHost}
          meetingLocked={meetingState.meetingLocked}
          roomId={roomId}
          isFullscreen={meetingState.isFullscreen}
          toggleFullscreen={meetingState.toggleFullscreen}
        />

        <VideoArea
          viewMode={meetingState.viewMode}
          setViewMode={meetingState.setViewMode}
          activeStream={meetingState.activeStream}
          activeStreamId={meetingState.activeStreamId}
          mainVideoRef={meetingState.mainVideoRef}
          showWhiteboard={meetingState.showWhiteboard}
          WhiteboardComponent={
            <WhiteboardComponent
              showWhiteboard={meetingState.showWhiteboard}
              setShowWhiteboard={meetingState.setShowWhiteboard}
              whiteboardMode={whiteboard.whiteboardMode}
              setWhiteboardMode={whiteboard.setWhiteboardMode}
              whiteboardColor={whiteboard.whiteboardColor}
              setWhiteboardColor={whiteboard.setWhiteboardColor}
              canvasRef={whiteboard.canvasRef}
              startDrawing={whiteboard.startDrawing}
              draw={whiteboard.draw}
              stopDrawing={whiteboard.stopDrawing}
              clearWhiteboard={whiteboard.clearWhiteboard}
              downloadWhiteboard={whiteboard.downloadWhiteboard}
              showNotification={showNotification}
            />
          }
        />

        <Thumbnails
          showControls={meetingState.showControls}
          activeStreamId={meetingState.activeStreamId}
          setActiveStreamId={meetingState.setActiveStreamId}
          localStream={meetingState.localStream}
          localVideoRef={meetingState.localVideoRef}
          isMuted={meetingState.isMuted}
          isVideoOff={meetingState.isVideoOff}
          remotePeers={meetingState.remotePeers}
          hoveredParticipant={meetingState.hoveredParticipant}
          setHoveredParticipant={meetingState.setHoveredParticipant}
          hideProfilePictures={meetingState.hideProfilePictures}
          participantNames={meetingState.participantNames}
          isHost={isHost}
          renameParticipant={meetingState.renameParticipant}
          removeParticipant={removeParticipant}
        />

        <ControlBar
          showControls={meetingState.showControls}
          isMuted={meetingState.isMuted}
          toggleAudio={toggleAudio}
          isRecording={recording.isRecording}
          startRecording={recording.startRecording}
          stopRecording={recording.stopRecording}
          isVideoOff={meetingState.isVideoOff}
          toggleVideo={toggleVideo}
          isScreenSharing={meetingState.isScreenSharing}
          toggleScreenShare={toggleScreenShare}
          showReactions={meetingState.showReactions}
          setShowReactions={meetingState.setShowReactions}
          addReaction={addReactionWithNotification}
          showWhiteboard={meetingState.showWhiteboard}
          setShowWhiteboard={meetingState.setShowWhiteboard}
          permissions={permissions}
          isHost={isHost}
          showNotification={showNotification}
          setShowSettings={meetingState.setShowSettings}
          setShowSecurity={meetingState.setShowSecurity}
          endMeeting={endMeeting}
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
        removeParticipant={removeParticipant}
        messages={chat.messages}
        newMessage={chat.newMessage}
        setNewMessage={chat.setNewMessage}
        sendMessage={(e) => chat.sendMessage(e, showNotification)}
        chatContainerRef={chat.chatContainerRef}
        permissions={permissions}
        copyLink={copyLink}
        showNotes={meetingState.showNotes}
        setShowNotes={meetingState.setShowNotes}
        notes={meetingState.notes}
        addNote={meetingState.addNote}
        updateNote={meetingState.updateNote}
        deleteNote={meetingState.deleteNote}
      />

      <SettingsModal
        showSettings={meetingState.showSettings}
        setShowSettings={meetingState.setShowSettings}
      />

      <SecurityModal
        showSecurity={meetingState.showSecurity}
        setShowSecurity={meetingState.setShowSecurity}
        meetingLocked={meetingState.meetingLocked}
        toggleMeetingLock={toggleMeetingLock}
        hideProfilePictures={meetingState.hideProfilePictures}
        toggleHideProfilePictures={toggleHideProfilePictures}
        permissions={permissions}
        updatePermissions={updatePermissions}
      />

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}






// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Track } from "livekit-client";
// import { ThumbsUp, Smile, Heart, Laugh, Frown } from "lucide-react";

// import { useMeetingState } from "@/hooks/useMeetingState";
// import { useChat } from "@/hooks/useChat";
// import { useWhiteboard } from "@/hooks/useWhiteboard";
// import { useRecording } from "@/hooks/useRecording";
// import { usePermissions } from "@/hooks/usePermissions";

// import Notification from "./Notification";
// import TopNavbar from "./TopNavbar";
// import VideoArea from "./VideoArea";
// import Thumbnails from "./Thumbnails";
// import ControlBar from "./ControlBar";
// import Sidebar from "./Sidebar";
// import WhiteboardComponent from "./Whiteboard";
// import SettingsModal from "./Modals/SettingsModal";
// import SecurityModal from "./Modals/SecurityModal";

// export default function MeetingUI({ isHost, roomId, router }) {
//   const [notification, setNotification] = useState(null);

//   // Define showNotification first
//   const showNotification = (message, type = "info") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 3000);
//   };

//   // Hooks - pass showNotification to hooks that need it
//   const meetingState = useMeetingState();
//   const { permissions, updatePermissions } = usePermissions(
//     isHost,
//     showNotification,
//   );
//   const chat = useChat(meetingState.room, permissions);
//   const whiteboard = useWhiteboard(
//     meetingState.showWhiteboard,
//     meetingState.whiteboardColor,
//   );
//   const recording = useRecording();

//   // Helper functions
//   const copyLink = () => {
//     navigator.clipboard.writeText(
//       `${window.location.origin}/meeting/${roomId}?role=guest`,
//     );
//     showNotification("Invite link copied to clipboard!", "success");
//   };

//   // Media controls using LiveKit API
//   const toggleAudio = async () => {
//     if (meetingState.localParticipant.isMicrophoneEnabled) {
//       await meetingState.localParticipant.localParticipant.setMicrophoneEnabled(
//         false,
//       );
//       meetingState.setIsMuted(true);
//     } else {
//       await meetingState.localParticipant.localParticipant.setMicrophoneEnabled(
//         true,
//       );
//       meetingState.setIsMuted(false);
//     }
//     showNotification(
//       meetingState.isMuted ? "Microphone unmuted" : "Microphone muted",
//     );
//   };

//   const toggleVideo = async () => {
//     if (permissions.startVideo || isHost) {
//       if (meetingState.localParticipant.isCameraEnabled) {
//         await meetingState.localParticipant.localParticipant.setCameraEnabled(
//           false,
//         );
//         meetingState.setIsVideoOff(true);
//       } else {
//         await meetingState.localParticipant.localParticipant.setCameraEnabled(
//           true,
//         );
//         meetingState.setIsVideoOff(false);
//       }
//       showNotification(
//         meetingState.isVideoOff ? "Camera turned on" : "Camera turned off",
//       );
//     } else {
//       showNotification("Video is disabled by host", "error");
//     }
//   };

//   const toggleScreenShare = async () => {
//     if (permissions.shareScreen || isHost) {
//       if (meetingState.isScreenSharing) {
//         const screenPub =
//           meetingState.localParticipant.localParticipant.getTrackPublication(
//             Track.Source.ScreenShare,
//           );
//         if (screenPub) await screenPub.unpublish();
//         meetingState.setIsScreenSharing(false);
//         showNotification("Stopped screen sharing");
//       } else {
//         try {
//           const stream = await navigator.mediaDevices.getDisplayMedia({
//             video: true,
//             audio: true,
//           });
//           const track = stream.getVideoTracks()[0];
//           await meetingState.localParticipant.localParticipant.publishTrack(
//             track,
//             {
//               source: Track.Source.ScreenShare,
//             },
//           );
//           meetingState.setIsScreenSharing(true);
//           showNotification("Started screen sharing");
//           track.onended = () => meetingState.setIsScreenSharing(false);
//         } catch (error) {
//           console.error("Screen sharing error:", error);
//           showNotification("Failed to start screen sharing", "error");
//         }
//       }
//     } else {
//       showNotification("Screen sharing is disabled by host", "error");
//     }
//   };

//   const endMeeting = () => {
//     if (isHost) {
//       showNotification("Ending meeting for everyone...", "info");
//       setTimeout(async () => {
//         await meetingState.room.disconnect();
//         router.push("/home");
//       }, 1000);
//     }
//   };

//   const leaveMeeting = async () => {
//     await meetingState.room.disconnect();
//     router.push("/home");
//   };

//   const removeParticipant = (peerId) => {
//     if (isHost) {
//       showNotification("Participant removed", "success");
//       // You can add actual participant removal logic here if needed
//     }
//   };

//   const toggleMeetingLock = () => {
//     meetingState.setMeetingLocked(!meetingState.meetingLocked);
//     showNotification(
//       meetingState.meetingLocked
//         ? "Meeting unlocked"
//         : "Meeting locked - No new participants can join",
//     );
//   };

//   const toggleHideProfilePictures = () => {
//     meetingState.setHideProfilePictures(!meetingState.hideProfilePictures);
//     showNotification(
//       meetingState.hideProfilePictures
//         ? "Profile pictures visible"
//         : "Profile pictures hidden",
//     );
//   };

//   const addReactionWithNotification = (type) => {
//     meetingState.addReaction(type);
//     showNotification(`You sent a ${type} reaction`);
//     meetingState.setShowReactions(false);
//   };

//   const getReactionIcon = (type) => {
//     switch (type) {
//       case "thumbsup":
//         return <ThumbsUp size={24} className="text-yellow-400" />;
//       case "smile":
//         return <Smile size={24} className="text-yellow-400" />;
//       case "heart":
//         return <Heart size={24} className="text-red-400" />;
//       case "laugh":
//         return <Laugh size={24} className="text-yellow-400" />;
//       case "frown":
//         return <Frown size={24} className="text-yellow-400" />;
//       default:
//         return <Smile size={24} className="text-yellow-400" />;
//     }
//   };

//   return (
//     <div className="h-screen w-full flex overflow-hidden bg-slate-700 text-white">
//       <Notification notification={notification} />

//       {/* Floating Reactions */}
//       <div className="fixed top-20 right-20 z-50 space-y-2">
//         {meetingState.reactions.map((reaction) => (
//           <motion.div
//             key={reaction.id}
//             initial={{ opacity: 0, y: 20, scale: 0.5 }}
//             animate={{ opacity: 1, y: 0, scale: 1 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="bg-black/60 backdrop-blur-lg rounded-full p-3"
//           >
//             {getReactionIcon(reaction.type)}
//           </motion.div>
//         ))}
//       </div>

//       {/* Main content */}
//       <div className="flex-1 flex flex-col relative">
//         <TopNavbar
//           showControls={meetingState.showControls}
//           isHost={isHost}
//           meetingLocked={meetingState.meetingLocked}
//           roomId={roomId}
//           isFullscreen={meetingState.isFullscreen}
//           toggleFullscreen={meetingState.toggleFullscreen}
//         />

//         <VideoArea
//           viewMode={meetingState.viewMode}
//           setViewMode={meetingState.setViewMode}
//           activeStream={meetingState.activeStream}
//           activeStreamId={meetingState.activeStreamId}
//           mainVideoRef={meetingState.mainVideoRef}
//           showWhiteboard={meetingState.showWhiteboard}
//           WhiteboardComponent={
//             <WhiteboardComponent
//               showWhiteboard={meetingState.showWhiteboard}
//               setShowWhiteboard={meetingState.setShowWhiteboard}
//               whiteboardMode={whiteboard.whiteboardMode}
//               setWhiteboardMode={whiteboard.setWhiteboardMode}
//               whiteboardColor={whiteboard.whiteboardColor}
//               setWhiteboardColor={whiteboard.setWhiteboardColor}
//               canvasRef={whiteboard.canvasRef}
//               startDrawing={whiteboard.startDrawing}
//               draw={whiteboard.draw}
//               stopDrawing={whiteboard.stopDrawing}
//               clearWhiteboard={whiteboard.clearWhiteboard}
//               downloadWhiteboard={whiteboard.downloadWhiteboard}
//               showNotification={showNotification}
//             />
//           }
//         />

//         <Thumbnails
//           showControls={meetingState.showControls}
//           activeStreamId={meetingState.activeStreamId}
//           setActiveStreamId={meetingState.setActiveStreamId}
//           localStream={meetingState.localStream}
//           localVideoRef={meetingState.localVideoRef}
//           isMuted={meetingState.isMuted}
//           isVideoOff={meetingState.isVideoOff}
//           remotePeers={meetingState.remotePeers}
//           hoveredParticipant={meetingState.hoveredParticipant}
//           setHoveredParticipant={meetingState.setHoveredParticipant}
//           hideProfilePictures={meetingState.hideProfilePictures}
//           participantNames={meetingState.participantNames}
//           isHost={isHost}
//           renameParticipant={meetingState.renameParticipant}
//           removeParticipant={removeParticipant}
//         />

//         <ControlBar
//           showControls={meetingState.showControls}
//           isMuted={meetingState.isMuted}
//           toggleAudio={toggleAudio}
//           isRecording={recording.isRecording}
//           startRecording={recording.startRecording}
//           stopRecording={recording.stopRecording}
//           isVideoOff={meetingState.isVideoOff}
//           toggleVideo={toggleVideo}
//           isScreenSharing={meetingState.isScreenSharing}
//           toggleScreenShare={toggleScreenShare}
//           showReactions={meetingState.showReactions}
//           setShowReactions={meetingState.setShowReactions}
//           addReaction={addReactionWithNotification}
//           showWhiteboard={meetingState.showWhiteboard}
//           setShowWhiteboard={meetingState.setShowWhiteboard}
//           permissions={permissions}
//           isHost={isHost}
//           showNotification={showNotification}
//           setShowSettings={meetingState.setShowSettings}
//           setShowSecurity={meetingState.setShowSecurity}
//           endMeeting={endMeeting}
//           leaveMeeting={leaveMeeting}
//           showParticipants={meetingState.showParticipants}
//           setShowParticipants={meetingState.setShowParticipants}
//           remotePeers={meetingState.remotePeers}
//           showChat={meetingState.showChat}
//           setShowChat={meetingState.setShowChat}
//           messages={chat.messages}
//         />
//       </div>

//       <Sidebar
//         showParticipants={meetingState.showParticipants}
//         showChat={meetingState.showChat}
//         setShowParticipants={meetingState.setShowParticipants}
//         setShowChat={meetingState.setShowChat}
//         remotePeers={meetingState.remotePeers}
//         isHost={isHost}
//         participantNames={meetingState.participantNames}
//         isMuted={meetingState.isMuted}
//         isVideoOff={meetingState.isVideoOff}
//         removeParticipant={removeParticipant}
//         messages={chat.messages}
//         newMessage={chat.newMessage}
//         setNewMessage={chat.setNewMessage}
//         sendMessage={(e) => chat.sendMessage(e, showNotification)}
//         chatContainerRef={chat.chatContainerRef}
//         permissions={permissions}
//         copyLink={copyLink}
//       />

//       <SettingsModal
//         showSettings={meetingState.showSettings}
//         setShowSettings={meetingState.setShowSettings}
//       />

//       <SecurityModal
//         showSecurity={meetingState.showSecurity}
//         setShowSecurity={meetingState.setShowSecurity}
//         meetingLocked={meetingState.meetingLocked}
//         toggleMeetingLock={toggleMeetingLock}
//         hideProfilePictures={meetingState.hideProfilePictures}
//         toggleHideProfilePictures={toggleHideProfilePictures}
//         permissions={permissions}
//         updatePermissions={updatePermissions}
//       />

//       <style jsx>{`
//         @keyframes slide-in-right {
//           from {
//             transform: translateX(100%);
//           }
//           to {
//             transform: translateX(0);
//           }
//         }
//         .animate-slide-in-right {
//           animation: slide-in-right 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }
