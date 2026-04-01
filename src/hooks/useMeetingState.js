import { useState, useEffect, useRef, useMemo } from "react";
import {
  useRoomContext,
  useLocalParticipant,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import { Track } from "livekit-client";

export const useMeetingState = () => {
  const room = useRoomContext();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();
  const tracks = useTracks();

  const [viewMode, setViewMode] = useState("360");
  const [activeStreamId, setActiveStreamId] = useState("local");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("good");
  const [showControls, setShowControls] = useState(true);
  const [hoveredParticipant, setHoveredParticipant] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [meetingLocked, setMeetingLocked] = useState(false);
  const [hideProfilePictures, setHideProfilePictures] = useState(false);
  const [participantNames, setParticipantNames] = useState({});

  const videoRefs = useRef({});
  const controlsTimeoutRef = useRef(null);
  const localVideoRef = useRef(null);
  const mainVideoRef = useRef(null);

  // Derive streams from LiveKit tracks
  const localVideoTrack = tracks.find(
    (t) =>
      t.participant.identity === localParticipant.localParticipant?.identity &&
      t.source === Track.Source.Camera,
  );

  const localStream = useMemo(() => {
    if (!localVideoTrack?.publication?.track?.mediaStream) return null;
    return new MediaStream([
      localVideoTrack.publication.track.mediaStreamTrack,
    ]);
  }, [localVideoTrack]);

  const remoteTracks = tracks.filter(
    (t) =>
      t.participant.identity !== localParticipant.localParticipant?.identity &&
      (t.source === Track.Source.Camera ||
        t.source === Track.Source.ScreenShare),
  );

  const remoteStreams = useMemo(() => {
    const map = new Map();
    remoteTracks.forEach((track) => {
      const stream = new MediaStream([
        track.publication.track.mediaStreamTrack,
      ]);
      map.set(track.participant.identity, stream);
    });
    return map;
  }, [remoteTracks]);

  const activeStream = useMemo(() => {
    return activeStreamId === "local"
      ? localStream
      : remoteStreams.get(activeStreamId);
  }, [activeStreamId, localStream, remoteStreams]);

  const remotePeers = participants
    .filter((p) => p.identity !== localParticipant.localParticipant?.identity)
    .map((p) => ({
      id: p.identity,
      stream: remoteStreams.get(p.identity),
      isHost: p.metadata ? JSON.parse(p.metadata)?.isHost : false,
      isMuted: false,
      isVideoOff: false,
      name: participantNames[p.identity] || `Guest ${p.identity.slice(0, 6)}`,
    }));

  const participantCount = participants.length + 1;

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(
        () => setShowControls(false),
        3000,
      );
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  // Simulate connection quality
  useEffect(() => {
    const interval = setInterval(() => {
      const qualities = ["good", "average", "poor"];
      setConnectionQuality(
        qualities[Math.floor(Math.random() * qualities.length)],
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Debug audio track
  useEffect(() => {
    const checkAudio = setInterval(() => {
      // const mic = localParticipant.localParticipant?.getTrack(
      //   Track.Source.Microphone,
      // );
      const mic = localParticipant.localParticipant?.getTrackPublication(Track.Source.Microphone);
      console.log(
        "Mic track:",
        mic
          ? `enabled=${mic.isEnabled}, muted=${mic.isMuted}`
          : "not published",
      );
    }, 5000);
    return () => clearInterval(checkAudio);
  }, [localParticipant]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const addReaction = (reactionType) => {
    const reaction = {
      id: Date.now(),
      type: reactionType,
      sender: "You",
      timestamp: new Date(),
    };
    setReactions([...reactions, reaction]);
    setTimeout(
      () => setReactions((prev) => prev.filter((r) => r.id !== reaction.id)),
      3000,
    );
    return reaction;
  };

  const removeReaction = (id) => {
    setReactions((prev) => prev.filter((r) => r.id !== id));
  };

  const renameParticipant = (peerId, newName) => {
    setParticipantNames({ ...participantNames, [peerId]: newName });
  };

  return {
    // States
    viewMode,
    setViewMode,
    activeStreamId,
    setActiveStreamId,
    isMuted,
    setIsMuted,
    isVideoOff,
    setIsVideoOff,
    isScreenSharing,
    setIsScreenSharing,
    showParticipants,
    setShowParticipants,
    showChat,
    setShowChat,
    isFullscreen,
    connectionQuality,
    showControls,
    hoveredParticipant,
    setHoveredParticipant,
    showReactions,
    setShowReactions,
    reactions,
    showWhiteboard,
    setShowWhiteboard,
    showSettings,
    setShowSettings,
    showSecurity,
    setShowSecurity,
    meetingLocked,
    setMeetingLocked,
    hideProfilePictures,
    setHideProfilePictures,
    participantNames,

    // Refs
    videoRefs,
    localVideoRef,
    mainVideoRef,

    // Streams
    localStream,
    remoteStreams,
    activeStream,
    remotePeers,
    participantCount,
    localParticipant,
    room,

    // Functions
    toggleFullscreen,
    addReaction,
    removeReaction,
    renameParticipant,
  };
};
