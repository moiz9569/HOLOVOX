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

  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState([{ id: Date.now(), text: "" }]);

  // Derive streams from LiveKit tracks
  const localVideoTrack = tracks.find(
    (t) =>
      t.participant.identity === localParticipant.localParticipant?.identity &&
      t.source === Track.Source.Camera,
  );
  // working
  // const localStream = useMemo(() => {
  //   if (!localVideoTrack?.publication?.track?.mediaStream) return null;
  //   return new MediaStream([
  //     localVideoTrack.publication.track.mediaStreamTrack,
  //   ]);
  // }, [localVideoTrack]);
  const localStream = useMemo(() => {
    return localVideoTrack?.publication?.track?.mediaStream || null;
  }, [localVideoTrack]);

  //////////////////////////new///////////////////////////////
  // Find the local screen share track
  const localScreenShareTrack = tracks.find(
    (t) =>
      t.participant.identity === localParticipant.localParticipant?.identity &&
      t.source === Track.Source.ScreenShare,
  );

  // Create a memoized stream from it
  const screenShareStream = useMemo(() => {
    return localScreenShareTrack?.publication?.track?.mediaStream || null;
  }, [localScreenShareTrack]);
  //////////////////////////new///////////////////////////////

  const remoteTracks = tracks.filter(
    (t) =>
      t.participant.identity !== localParticipant.localParticipant?.identity &&
      (t.source === Track.Source.Camera ||
        t.source === Track.Source.ScreenShare),
  );
  // working code
  // const remoteStreams = useMemo(() => {
  //   const map = new Map();
  //   remoteTracks.forEach((track) => {
  //     const stream = new MediaStream([
  //       track.publication.track.mediaStreamTrack,
  //     ]);
  //     map.set(track.participant.identity, stream);
  //   });
  //   return map;
  // }, [remoteTracks]);

  //   const remoteStreams = useMemo(() => {
  //   const map = new Map();

  //   remoteTracks.forEach((track) => {
  //     const existing = map.get(track.participant.identity);

  //     if (existing) return;

  //     const mediaTrack = track.publication?.track?.mediaStreamTrack;
  //     if (mediaTrack) {
  //       map.set(track.participant.identity, new MediaStream([mediaTrack]));
  //     }
  //   });

  //   return map;
  // }, [remoteTracks]);

  const remotePeers = useMemo(() => {
    // console.log("Participants:", localParticipant.localParticipant);
    // console.log("Participants:", participants);
    return participants
      .filter((p) => p.identity !== localParticipant.localParticipant?.identity)
      .map((p) => {
        const videoPub = Array.from(p.videoTrackPublications.values()).find(
          (pub) => pub.track,
        );
        const meta = p.metadata ? JSON.parse(p.metadata) : {};
        // console.log("Host:", meta.isHost);

        // console.log("Participant:", p.name, meta);
        // console.log("Image URL:", meta.image);

        return {
          id: p.identity,
          name: p.name || p.identity,
          image: meta.image,
          isHost: meta.isHost,
          stream: videoPub?.track?.mediaStream || null, // ✅ NO NEW STREAM
          isMuted: p.isMicrophoneEnabled === false,
          isVideoOff: !videoPub?.track,
        };
      });
  }, [participants]);
  // currently working
  // const remotePeers = participants
  // .filter((p) => p.identity !== localParticipant.localParticipant?.identity)
  // .map((p) => {
  //   const videoPub = Array.from(p.videoTrackPublications.values())
  //     .find((pub) => pub.track);

  //   let stream = null;

  //   if (videoPub?.track?.mediaStreamTrack) {
  //     stream = new MediaStream([
  //       videoPub.track.mediaStreamTrack,
  //     ]);
  //   }

  //   return {
  //     id: p.identity,
  //     name: p.name || p.identity,
  //     isHost: p.metadata?.includes("isHost"),
  //     stream: stream, // ✅ FIXED
  //     isMuted: p.isMicrophoneEnabled === false,
  //     isVideoOff: !stream,
  //   };
  // });
  // const activeStream = useMemo(() => {
  //   return activeStreamId === "local"
  //     ? localStream
  //     : remoteStreams.get(activeStreamId);
  // }, [activeStreamId, localStream, remoteStreams]);

  // Find any remote participant who is sharing their screen

  ///////////////////////////new///////////////////////////////
  const remoteScreenSharePeer = useMemo(() => {
    return participants.find((p) => {
      if (p.identity === localParticipant.localParticipant?.identity)
        return false;
      const screenPub = Array.from(p.videoTrackPublications.values()).find(
        (pub) => pub.source === Track.Source.ScreenShare && pub.track,
      );
      return !!screenPub;
    });
  }, [participants, localParticipant]);

  // Get the actual screen share stream from that peer
  const remoteScreenShareStream = useMemo(() => {
    if (!remoteScreenSharePeer) return null;
    const screenPub = Array.from(
      remoteScreenSharePeer.videoTrackPublications.values(),
    ).find((pub) => pub.source === Track.Source.ScreenShare && pub.track);
    return screenPub?.track?.mediaStream || null;
  }, [remoteScreenSharePeer]);
  ///////////////////////////new///////////////////////////////

  const activeStream = useMemo(() => {
    // if (activeStreamId === "local") return localStream;

    // const peer = remotePeers.find((p) => p.id === activeStreamId);
    // return peer?.stream || null;

    // 1. Local screen sharing has top priority
  if (isScreenSharing) {
    return screenShareStream || localStream;
  }
  // 2. Remote screen share has second priority (auto-switch)
  if (remoteScreenShareStream) {
    return remoteScreenShareStream;
  }
  // 3. Otherwise, show the selected camera stream
  if (activeStreamId === "local") return localStream;
  const peer = remotePeers.find((p) => p.id === activeStreamId);
  return peer?.stream || null;

  }, [
    isScreenSharing,
    screenShareStream,
    remoteScreenShareStream,
    activeStreamId,
    localStream,
    remotePeers,
  ]);

  // const remotePeers = participants
  //   .filter((p) => p.identity !== localParticipant.localParticipant?.identity)
  //   .map((p) => ({
  //     id: p.identity,
  //     stream: remoteStreams.get(p.identity),
  //     isHost: p.metadata ? JSON.parse(p.metadata)?.isHost : false,
  //     isMuted: false,
  //     isVideoOff: false,
  //     name: participantNames[p.identity] || `Guest ${p.identity.slice(0, 6)}`,
  //   }));

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
      const mic = localParticipant.localParticipant?.getTrackPublication(
        Track.Source.Microphone,
      );
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

  const addNote = () => {
    setNotes([...notes, { id: Date.now(), text: "" }]);
  };

  const updateNote = (id, newText) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note)),
    );
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
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
    showNotes,
    setShowNotes,
    notes,
    addNote,
    updateNote,
    deleteNote,

    // Refs
    videoRefs,
    localVideoRef,
    mainVideoRef,

    // Streams
    localStream,
    // remoteStreams,
    activeStream,
    remotePeers,
    participantCount,
    localParticipant,
    room,
    screenShareStream,
    remoteScreenSharePeer,
    remoteScreenShareStream,

    // Functions
    toggleFullscreen,
    addReaction,
    removeReaction,
    renameParticipant,
  };
};
