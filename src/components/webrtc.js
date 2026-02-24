export const peers = {};
let localStream = null;
let ws = null;
let userId = null;

export async function stopMeeting() {
  if (ws) { ws.close(); ws = null; }
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  Object.keys(peers).forEach(id => {
    peers[id].close();
    delete peers[id];
  });
}

export async function startMeeting(roomId, isHost, onPeerUpdate) {
  if (!userId) userId = crypto.randomUUID();
  const wsURL = "wss://syedabdulmoizshah-360-connect-signaler.hf.space";

  try {
    // LAG FIX: Optimized resolution and frame rate
    localStream = await navigator.mediaDevices.getUserMedia({ 
      video: { width: 1280, height: 720, frameRate: 24 }, 
      audio: true 
    });
    const localVideo = document.getElementById("localVideo");
    if (localVideo) localVideo.srcObject = localStream;
  } catch (e) { console.error("Media Error:", e); }

  ws = new WebSocket(wsURL);
  ws.onopen = () => ws.send(JSON.stringify({ type: "join", roomId, userId, isHost }));

  ws.onmessage = async (msg) => {
    const data = JSON.parse(msg.data);
    switch(data.type) {
      case "peer-joined": await createPeer(data.userId, true, onPeerUpdate, data.isHost); break;
      case "offer": await createPeer(data.sender, false, onPeerUpdate, data.isHost, data.offer); break;
      case "answer": await peers[data.sender]?.setRemoteDescription(data.answer); break;
      case "candidate": await peers[data.sender]?.addIceCandidate(new RTCIceCandidate(data.candidate)); break;
    }
  };
}

async function createPeer(peerId, isOfferer, onPeerUpdate, peerIsHost, offer = null) {
  if (peers[peerId]) return;

  const pc = new RTCPeerConnection({ 
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "turn:global.relay.metered.ca:80", username: "openrelayproject", credential: "openrelayprojectsecret" }
    ] 
  });
  peers[peerId] = pc;

  pc.onicecandidate = (e) => {
    if (e.candidate) ws.send(JSON.stringify({ type: "candidate", candidate: e.candidate, target: peerId, sender: userId }));
  };

  pc.ontrack = (e) => onPeerUpdate(peerId, e.streams[0], peerIsHost);

  localStream.getTracks().forEach(track => {
    const sender = pc.addTrack(track, localStream);
    // LAG FIX: Hard-limit bitrate to prevent network congestion
    if (track.kind === 'video') {
      const params = sender.getParameters();
      if (!params.encodings) params.encodings = [{}];
      params.encodings[0].maxBitrate = 1500000; // 1.5 Mbps
      sender.setParameters(params);
    }
  });

  if (isOfferer) {
    const desc = await pc.createOffer();
    await pc.setLocalDescription(desc);
    ws.send(JSON.stringify({ type: "offer", offer: desc, target: peerId, sender: userId, isHost: !!userId })); 
  } else {
    await pc.setRemoteDescription(offer);
    const desc = await pc.createAnswer();
    await pc.setLocalDescription(desc);
    ws.send(JSON.stringify({ type: "answer", answer: desc, target: peerId, sender: userId }));
  }
}
//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////
//////////////////////////////////////////////////////WORKING///////////////////////////////////////////////////////////


















// export const peers = {};
// export const candidateQueues = {};
// let localStream = null;
// let ws = null;
// let userId = null;

// function safeSend(data) {
//   if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(data));
//   else setTimeout(() => safeSend(data), 100);
// }

// export async function startMeeting(roomId) {
//   if (!userId) userId = crypto.randomUUID();
//   const hfSpaceUrl = "syedabdulmoizshah-360-connect-signaler.hf.space"; 
//   const wsURL = `wss://${hfSpaceUrl}`;
//   // const wsURL = (location.protocol === "https:" ? "wss://" : "ws://") + location.hostname + ":8080";

//   try {
//     // PERFORMANCE FIX: Use a fixed resolution to prevent CPU spikes
//     localStream = await navigator.mediaDevices.getUserMedia({ 
//         video: { 
//             width: { ideal: 1280 }, 
//             height: { ideal: 720 },
//             frameRate: { ideal: 30 } 
//         }, 
//         audio: true 
//     });
//     const localVideo = document.getElementById("localVideo");
//     if (localVideo) localVideo.srcObject = localStream;
//   } catch (e) {
//     console.error("Camera error", e);
//   }

//   ws = new WebSocket(wsURL);
//   ws.onopen = () => safeSend({ type: "join", roomId, userId });

//   ws.onmessage = async (msg) => {
//     const data = JSON.parse(msg.data);
//     switch(data.type) {
//       case "peer-joined": await createPeerConnection(data.userId, true, roomId); break;
//       case "offer": await createPeerConnection(data.sender, false, roomId, data.offer); break;
//       case "answer": 
//         if (peers[data.sender]) {
//           await peers[data.sender].setRemoteDescription(data.answer);
//           flushCandidateQueue(data.sender);
//         }
//         break;
//       case "candidate": 
//         const candidate = new RTCIceCandidate(data.candidate);
//         if (peers[data.sender]?.remoteDescription) {
//           await peers[data.sender].addIceCandidate(candidate);
//         } else {
//           if (!candidateQueues[data.sender]) candidateQueues[data.sender] = [];
//           candidateQueues[data.sender].push(candidate);
//         }
//         break;
//     }
//   };
// }

// async function createPeerConnection(peerId, isOfferer, roomId, offer = null) {
//   if (peers[peerId]) return;
  
//   const pc = new RTCPeerConnection({ 
//     iceServers: [{ urls: "stun:stun.l.google.com:19302" }] 
//   });
//   peers[peerId] = pc;

//   pc.onicecandidate = (e) => {
//     if (e.candidate) {
//       safeSend({ type: "candidate", candidate: e.candidate, target: peerId, sender: userId });
//     }
//   };

//   pc.ontrack = (e) => {
//     let remoteVid = document.getElementById(`remote-${peerId}`);
    
//     if (!remoteVid) {
//       remoteVid = document.createElement("video");
//       remoteVid.id = `remote-${peerId}`;
//       remoteVid.autoplay = true;
//       remoteVid.playsInline = true;
//       // PERFORMANCE FIX: Mute remote video by default if testing on same machine to prevent feedback loops
//       remoteVid.srcObject = e.streams[0];

//       const assets = document.getElementById("assets-box");
//       if (assets) assets.appendChild(remoteVid);

//       remoteVid.onplay = () => {
//         const mainSphere = document.getElementById("main-360-view");
//         if (mainSphere) {
//           mainSphere.setAttribute("src", `#${remoteVid.id}`);
//           document.getElementById("background-sky")?.setAttribute("visible", "false");
//         }
//       };
//     }
//   };

//   localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

//   if (isOfferer) {
//     const offerDesc = await pc.createOffer();
//     await pc.setLocalDescription(offerDesc);
//     safeSend({ type: "offer", offer: offerDesc, target: peerId, sender: userId });
//   } else if (offer) {
//     await pc.setRemoteDescription(offer);
//     const answerDesc = await pc.createAnswer();
//     await pc.setLocalDescription(answerDesc);
//     safeSend({ type: "answer", answer: answerDesc, target: peerId, sender: userId });
//   }
// }

// function flushCandidateQueue(peerId) {
//   while (candidateQueues[peerId]?.length) {
//     const cand = candidateQueues[peerId].shift();
//     peers[peerId].addIceCandidate(cand);
//   }
// }


























