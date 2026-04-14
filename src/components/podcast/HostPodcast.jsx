// components/podcast/HostPodcast.jsx
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Track, RoomEvent } from 'livekit-client';

export default function HostPodcast({ room }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const labelRendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  
  const seatsRef = useRef([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!room) return;
    const update = () => setParticipants(Array.from(room.remoteParticipants.values()));
    update();
    room.on(RoomEvent.ParticipantConnected, update);
    room.on(RoomEvent.ParticipantDisconnected, update);
    return () => {
      room.off(RoomEvent.ParticipantConnected, update);
      room.off(RoomEvent.ParticipantDisconnected, update);
    };
  }, [room]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0b14);
    scene.fog = new THREE.FogExp2(0x0b0b14, 0.006);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(-3.5, 2.2, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.shadowMap.enabled = false;
    renderer.setPixelRatio(1.0);
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '1';
    canvas.style.pointerEvents = 'auto';
    containerRef.current.style.position = 'relative';
    containerRef.current.appendChild(canvas);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0';
    labelRenderer.domElement.style.left = '0';
    labelRenderer.domElement.style.zIndex = '2';
    labelRenderer.domElement.style.pointerEvents = 'none';
    containerRef.current.appendChild(labelRenderer.domElement);
    labelRendererRef.current = labelRenderer;

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.8;
    controls.target.set(0, 1.4, 0);
    controls.update();
    controlsRef.current = controls;

    const resize = () => {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      labelRenderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();

    // Lighting
    scene.add(new THREE.AmbientLight(0x404050, 0.7));
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.2);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x88aacc, 0.5);
    fillLight.position.set(-2, 2, 3);
    scene.add(fillLight);
    const backLight = new THREE.PointLight(0x446688, 0.3);
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    // --- Modern Table (dark wood + metal rim) ---
    const tableGroup = new THREE.Group();
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.4, metalness: 0.1 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });
    
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.12, 48), woodMat);
    tableTop.position.y = 0.9;
    tableGroup.add(tableTop);
    
    const rim = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.03, 16, 64), metalMat);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.96;
    tableGroup.add(rim);
    
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.2, metalness: 0.7 });
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 0.9, 12), pedestalMat);
    pedestal.position.y = 0.45;
    tableGroup.add(pedestal);
    
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.5 });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 8), baseMat);
    base.position.y = 0.04;
    tableGroup.add(base);
    
    scene.add(tableGroup);

    // Floor
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x101018, roughness: 0.7, metalness: 0.05 });
    const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 32), floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    scene.add(floor);
    
    const grid = new THREE.GridHelper(18, 24, 0x557799, 0x223344);
    grid.position.y = 0.02;
    scene.add(grid);

    // --- 8 Chairs with Metal Border (matching table) ---
    const radius = 3.5;
    const chairY = 0.45;
    const videoY = 1.8;
    const angles = [0, 45, 90, 135, 180, 225, 270, 315].map(d => d * Math.PI / 180);

    const seats = [];
    
    angles.forEach((angle, idx) => {
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      const chairGroup = new THREE.Group();
      
      // Materials (same as table)
      const chairWoodMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.5 });
      const chairMetalMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });
      
      // --- Seat ---
      const seatWood = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.18, 1.0), chairWoodMat);
      seatWood.position.y = chairY;
      chairGroup.add(seatWood);
      
      // Seat metal border (4 thin strips around edges)
      const borderThickness = 0.03;
      const borderHeight = 0.18;
      // Front/back borders
      const seatBorderFront = new THREE.Mesh(new THREE.BoxGeometry(1.6 + borderThickness*2, borderHeight, borderThickness), chairMetalMat);
      seatBorderFront.position.set(0, chairY, 0.5 + borderThickness/2);
      chairGroup.add(seatBorderFront);
      const seatBorderBack = new THREE.Mesh(new THREE.BoxGeometry(1.6 + borderThickness*2, borderHeight, borderThickness), chairMetalMat);
      seatBorderBack.position.set(0, chairY, -0.5 - borderThickness/2);
      chairGroup.add(seatBorderBack);
      // Left/right borders
      const seatBorderLeft = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, borderHeight, 1.0), chairMetalMat);
      seatBorderLeft.position.set(-0.8 - borderThickness/2, chairY, 0);
      chairGroup.add(seatBorderLeft);
      const seatBorderRight = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, borderHeight, 1.0), chairMetalMat);
      seatBorderRight.position.set(0.8 + borderThickness/2, chairY, 0);
      chairGroup.add(seatBorderRight);
      
      // --- Backrest (main) ---
      const backMain = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.15), chairWoodMat);
      backMain.position.set(0, chairY + 0.9, -0.45);
      chairGroup.add(backMain);
      
      // Backrest metal border (top edge only, for sleek look)
      const backBorderTop = new THREE.Mesh(new THREE.BoxGeometry(1.6 + borderThickness*2, borderThickness, 0.15 + borderThickness), chairMetalMat);
      backBorderTop.position.set(0, chairY + 1.6, -0.45);
      chairGroup.add(backBorderTop);
      const backBorderSides = new THREE.Mesh(new THREE.BoxGeometry(borderThickness, 1.4, 0.15), chairMetalMat);
      backBorderSides.position.set(-0.8 - borderThickness/2, chairY + 0.9, -0.45);
      chairGroup.add(backBorderSides);
      const backBorderSidesR = backBorderSides.clone();
      backBorderSidesR.position.set(0.8 + borderThickness/2, chairY + 0.9, -0.45);
      chairGroup.add(backBorderSidesR);
      
      // --- Backrest top (narrower) ---
      const backTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 0.12), chairWoodMat);
      backTop.position.set(0, chairY + 1.7, -0.42);
      chairGroup.add(backTop);
      
      // Backrest top metal border (top edge)
      const backTopBorder = new THREE.Mesh(new THREE.BoxGeometry(1.4 + borderThickness*2, borderThickness, 0.12 + borderThickness), chairMetalMat);
      backTopBorder.position.set(0, chairY + 1.875, -0.42);
      chairGroup.add(backTopBorder);
      
      // --- Headrest ---
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.25, 0.1), chairWoodMat);
      headrest.position.set(0, chairY + 2.0, -0.38);
      chairGroup.add(headrest);
      
      // Headrest metal border (top edge)
      const headrestBorder = new THREE.Mesh(new THREE.BoxGeometry(1.0 + borderThickness*2, borderThickness, 0.1 + borderThickness), chairMetalMat);
      headrestBorder.position.set(0, chairY + 2.125, -0.38);
      chairGroup.add(headrestBorder);
      
      // --- Metal legs (slim) ---
      const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.3, 5);
      const legPositions = [[-0.65, 0.15, 0.35], [0.65, 0.15, 0.35], [-0.65, 0.15, -0.45], [0.65, 0.15, -0.45]];
      legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, chairMetalMat);
        leg.position.set(pos[0], pos[1], pos[2]);
        chairGroup.add(leg);
      });

      chairGroup.position.set(x, 0, z);
      chairGroup.lookAt(0, chairY, 0);
      scene.add(chairGroup);

      // Video plane
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.6), material);
      mesh.position.set(x, videoY, z);
      scene.add(mesh);

      // Name label
      const labelDiv = document.createElement('div');
      labelDiv.style.cssText = 'color:#fff;font-size:18px;font-weight:600;text-shadow:2px 2px 6px black;background:rgba(20,30,40,0.8);padding:6px 16px;border-radius:24px;border:1px solid #6a8cbb;pointer-events:none;backdrop-filter:blur(4px);display:none';
      const label = new CSS2DObject(labelDiv);
      label.position.set(x, videoY + 1.7, z);
      scene.add(label);

      seats.push({
        chair: chairGroup,
        mesh,
        label,
        labelDiv,
        videoElement: null,
        occupiedBy: null,
        index: idx,
      });
    });

    seatsRef.current = seats;

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      seatsRef.current.forEach(s => s.mesh.lookAt(camera.position));
      renderer.render(scene, camera);
      labelRenderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      canvas.remove();
      labelRenderer.domElement.remove();
    };
  }, []);

  // Participant assignment (unchanged)
  useEffect(() => {
    if (!sceneRef.current || !room) return;

    seatsRef.current.forEach(seat => {
      if (seat.videoElement) {
        seat.videoElement.pause();
        seat.videoElement.srcObject = null;
        seat.videoElement.remove();
        seat.videoElement = null;
      }
      seat.mesh.material.opacity = 0;
      seat.mesh.material.map = null;
      seat.mesh.material.needsUpdate = true;
      seat.labelDiv.style.display = 'none';
      seat.labelDiv.textContent = '';
      seat.occupiedBy = null;
    });

    const attachVideo = (seat, track, participantId, identity) => {
      const stream = new MediaStream([track.mediaStreamTrack]);
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.style.display = 'none';
      document.body.appendChild(video);

      const texture = new THREE.VideoTexture(video);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      seat.mesh.material.map = texture;
      seat.mesh.material.opacity = 1;
      seat.mesh.material.needsUpdate = true;
      
      seat.labelDiv.textContent = identity || 'Guest';
      seat.labelDiv.style.display = 'block';
      seat.occupiedBy = participantId;
      seat.videoElement = video;
      
      video.play().catch(console.warn);
    };

    participants.slice(0, 8).forEach(p => {
      const id = p.identity || p.sid;
      const availableSeat = seatsRef.current.find(s => s.occupiedBy === null);
      if (!availableSeat) return;

      const videoTrack = p.getTrackPublication(Track.Source.Camera)?.videoTrack;
      if (videoTrack) {
        attachVideo(availableSeat, videoTrack, id, p.identity);
      } else {
        availableSeat.occupiedBy = id;
        availableSeat.labelDiv.textContent = p.identity || 'Guest';
        availableSeat.labelDiv.style.display = 'block';
      }
    });

    const handleTrackSubscribed = (track, publication, participant) => {
      if (track.kind !== 'video') return;
      const id = participant.identity || participant.sid;
      let seat = seatsRef.current.find(s => s.occupiedBy === id);
      if (!seat) {
        seat = seatsRef.current.find(s => s.occupiedBy === null);
        if (!seat) return;
        seat.occupiedBy = id;
        seat.labelDiv.textContent = participant.identity || 'Guest';
        seat.labelDiv.style.display = 'block';
      }
      if (!seat.videoElement) {
        const stream = new MediaStream([track.mediaStreamTrack]);
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.style.display = 'none';
        document.body.appendChild(video);

        const texture = new THREE.VideoTexture(video);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        seat.mesh.material.map = texture;
        seat.mesh.material.opacity = 1;
        seat.mesh.material.needsUpdate = true;
        seat.videoElement = video;
        video.play().catch(console.warn);
      }
    };

    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

    return () => {
      room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
    };
  }, [participants, room]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}











// // components/podcast/HostPodcast.jsx
// import { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
// import { Track, RoomEvent } from 'livekit-client';

// export default function HostPodcast({ room }) {
//   const containerRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const labelRendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
  
//   // seats array: index 0-7 -> { chair, mesh, label, videoElement, occupiedBy }
//   const seatsRef = useRef([]);
//   const [participants, setParticipants] = useState([]);

//   // Track room participants
//   useEffect(() => {
//     if (!room) return;
//     const update = () => setParticipants(Array.from(room.remoteParticipants.values()));
//     update();
//     room.on(RoomEvent.ParticipantConnected, update);
//     room.on(RoomEvent.ParticipantDisconnected, update);
//     return () => {
//       room.off(RoomEvent.ParticipantConnected, update);
//       room.off(RoomEvent.ParticipantDisconnected, update);
//     };
//   }, [room]);

//   // Setup 3D scene with 8 permanent chairs
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x0b0b14);
//     scene.fog = new THREE.FogExp2(0x0b0b14, 0.006);
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
//     camera.position.set(0, 2.2, 4.5);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
//     renderer.shadowMap.enabled = false;
//     renderer.setPixelRatio(1.0);
//     rendererRef.current = renderer;

//     const canvas = renderer.domElement;
//     canvas.style.position = 'absolute';
//     canvas.style.top = '0';
//     canvas.style.left = '0';
//     canvas.style.width = '100%';
//     canvas.style.height = '100%';
//     canvas.style.zIndex = '1';
//     canvas.style.pointerEvents = 'auto';
//     containerRef.current.style.position = 'relative';
//     containerRef.current.appendChild(canvas);

//     const labelRenderer = new CSS2DRenderer();
//     labelRenderer.domElement.style.position = 'absolute';
//     labelRenderer.domElement.style.top = '0';
//     labelRenderer.domElement.style.left = '0';
//     labelRenderer.domElement.style.zIndex = '2';
//     labelRenderer.domElement.style.pointerEvents = 'none';
//     containerRef.current.appendChild(labelRenderer.domElement);
//     labelRendererRef.current = labelRenderer;

//     const controls = new OrbitControls(camera, canvas);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.rotateSpeed = 0.8;
//     controls.target.set(0, 1.4, 0);
//     controls.update();
//     controlsRef.current = controls;

//     const resize = () => {
//       const w = containerRef.current.clientWidth;
//       const h = containerRef.current.clientHeight;
//       renderer.setSize(w, h);
//       labelRenderer.setSize(w, h);
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//     };
//     window.addEventListener('resize', resize);
//     resize();

//     // Lighting
//     scene.add(new THREE.AmbientLight(0x404050, 0.7));
//     const keyLight = new THREE.DirectionalLight(0xffeedd, 1.2);
//     keyLight.position.set(2, 4, 3);
//     scene.add(keyLight);
//     const fillLight = new THREE.PointLight(0x88aacc, 0.5);
//     fillLight.position.set(-2, 2, 3);
//     scene.add(fillLight);
//     const backLight = new THREE.PointLight(0x446688, 0.3);
//     backLight.position.set(0, 3, -5);
//     scene.add(backLight);

//     // --- Modern Table ---
//     const tableGroup = new THREE.Group();
//     const topMat = new THREE.MeshStandardMaterial({ color: 0x3a2a1a, roughness: 0.4, metalness: 0.1 });
//     const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.0, 0.12, 48), topMat);
//     tableTop.position.y = 0.9;
//     tableGroup.add(tableTop);
    
//     const rimMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.3, metalness: 0.8 });
//     const rim = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.03, 16, 64), rimMat);
//     rim.rotation.x = Math.PI / 2;
//     rim.position.y = 0.96;
//     tableGroup.add(rim);
    
//     const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.2, metalness: 0.7 });
//     const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.8, 0.9, 12), pedestalMat);
//     pedestal.position.y = 0.45;
//     tableGroup.add(pedestal);
    
//     const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.5 });
//     const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.0, 0.08, 8), baseMat);
//     base.position.y = 0.04;
//     tableGroup.add(base);
    
//     scene.add(tableGroup);

//     // Floor
//     const floorMat = new THREE.MeshStandardMaterial({ color: 0x101018, roughness: 0.7, metalness: 0.05 });
//     const floor = new THREE.Mesh(new THREE.CircleGeometry(16, 32), floorMat);
//     floor.rotation.x = -Math.PI / 2;
//     floor.position.y = 0;
//     scene.add(floor);
    
//     const grid = new THREE.GridHelper(18, 24, 0x557799, 0x223344);
//     grid.position.y = 0.02;
//     scene.add(grid);

//     // --- Pre-create 8 chairs around the table ---
//     const radius = 3.5;
//     const chairY = 0.45;
//     const videoY = 1.8;
//     const angles = [0, 45, 90, 135, 180, 225, 270, 315].map(d => d * Math.PI / 180);

//     const seats = [];
    
//     angles.forEach((angle, idx) => {
//       const x = Math.cos(angle) * radius;
//       const z = Math.sin(angle) * radius;

//       // Sofa-style chair
//       const chairGroup = new THREE.Group();
//       const fabricMat = new THREE.MeshStandardMaterial({ color: 0x4a6fa5, roughness: 0.8 });
//       const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5e3c, roughness: 0.6 });
      
//       const seat = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.2, 1.0), fabricMat);
//       seat.position.y = chairY;
//       chairGroup.add(seat);
      
//       const backMain = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.4, 0.2), fabricMat);
//       backMain.position.set(0, chairY + 0.9, -0.45);
//       chairGroup.add(backMain);
      
//       const backTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.15), fabricMat);
//       backTop.position.set(0, chairY + 1.7, -0.4);
//       chairGroup.add(backTop);
      
//       const headrest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.3, 0.1), new THREE.MeshStandardMaterial({ color: 0x3a5a8c, roughness: 0.9 }));
//       headrest.position.set(0, chairY + 2.0, -0.35);
//       chairGroup.add(headrest);
      
//       const armGeo = new THREE.BoxGeometry(0.2, 0.15, 0.9);
//       const leftArm = new THREE.Mesh(armGeo, woodMat);
//       leftArm.position.set(-0.9, chairY + 0.35, 0);
//       chairGroup.add(leftArm);
//       const rightArm = new THREE.Mesh(armGeo, woodMat);
//       rightArm.position.set(0.9, chairY + 0.35, 0);
//       chairGroup.add(rightArm);
      
//       const legGeo = new THREE.BoxGeometry(0.15, 0.3, 0.15);
//       const legPositions = [[-0.7, 0.15, 0.4], [0.7, 0.15, 0.4], [-0.7, 0.15, -0.5], [0.7, 0.15, -0.5]];
//       legPositions.forEach(pos => {
//         const leg = new THREE.Mesh(legGeo, woodMat);
//         leg.position.set(pos[0], pos[1], pos[2]);
//         chairGroup.add(leg);
//       });

//       chairGroup.position.set(x, 0, z);
//       chairGroup.lookAt(0, chairY, 0);
//       scene.add(chairGroup);

//       // Video plane (initially invisible)
//       const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
//       const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.6), material);
//       mesh.position.set(x, videoY, z);
//       scene.add(mesh);

//       // Name label (initially empty)
//       const labelDiv = document.createElement('div');
//       labelDiv.style.cssText = 'color:#fff;font-size:18px;font-weight:600;text-shadow:2px 2px 6px black;background:rgba(20,30,40,0.8);padding:6px 16px;border-radius:24px;border:1px solid #6a8cbb;pointer-events:none;backdrop-filter:blur(4px);display:none';
//       const label = new CSS2DObject(labelDiv);
//       label.position.set(x, videoY + 1.7, z);
//       scene.add(label);

//       seats.push({
//         chair: chairGroup,
//         mesh,
//         label,
//         labelDiv,
//         videoElement: null,
//         occupiedBy: null,
//         index: idx,
//       });
//     });

//     seatsRef.current = seats;

//     let frameId;
//     const animate = () => {
//       frameId = requestAnimationFrame(animate);
//       controls.update();
//       seatsRef.current.forEach(s => s.mesh.lookAt(camera.position));
//       renderer.render(scene, camera);
//       labelRenderer.render(scene, camera);
//     };
//     animate();

//     return () => {
//       window.removeEventListener('resize', resize);
//       cancelAnimationFrame(frameId);
//       renderer.dispose();
//       canvas.remove();
//       labelRenderer.domElement.remove();
//     };
//   }, []);

//   // Assign participants to seats (max 8)
//   useEffect(() => {
//     if (!sceneRef.current || !room) return;

//     // Clear all seats first
//     seatsRef.current.forEach(seat => {
//       if (seat.videoElement) {
//         seat.videoElement.pause();
//         seat.videoElement.srcObject = null;
//         seat.videoElement.remove();
//         seat.videoElement = null;
//       }
//       seat.mesh.material.opacity = 0;
//       seat.mesh.material.map = null;
//       seat.mesh.material.needsUpdate = true;
//       seat.labelDiv.style.display = 'none';
//       seat.labelDiv.textContent = '';
//       seat.occupiedBy = null;
//     });

//     // Attach video to a seat
//     const attachVideo = (seat, track, participantId, identity) => {
//       const stream = new MediaStream([track.mediaStreamTrack]);
//       const video = document.createElement('video');
//       video.srcObject = stream;
//       video.autoplay = true;
//       video.muted = true;
//       video.loop = true;
//       video.playsInline = true;
//       video.style.display = 'none';
//       document.body.appendChild(video);

//       const texture = new THREE.VideoTexture(video);
//       texture.minFilter = THREE.LinearFilter;
//       texture.magFilter = THREE.LinearFilter;
//       seat.mesh.material.map = texture;
//       seat.mesh.material.opacity = 1;
//       seat.mesh.material.needsUpdate = true;
      
//       seat.labelDiv.textContent = identity || 'Guest';
//       seat.labelDiv.style.display = 'block';
//       seat.occupiedBy = participantId;
//       seat.videoElement = video;
      
//       video.play().catch(console.warn);
//     };

//     // Assign participants to first available seats
//     participants.slice(0, 8).forEach(p => {
//       const id = p.identity || p.sid;
//       const availableSeat = seatsRef.current.find(s => s.occupiedBy === null);
//       if (!availableSeat) return;

//       const videoTrack = p.getTrackPublication(Track.Source.Camera)?.videoTrack;
//       if (videoTrack) {
//         attachVideo(availableSeat, videoTrack, id, p.identity);
//       } else {
//         // No track yet – mark seat as occupied but wait for track
//         availableSeat.occupiedBy = id;
//         availableSeat.labelDiv.textContent = p.identity || 'Guest';
//         availableSeat.labelDiv.style.display = 'block';
//         // Keep video plane invisible until track arrives
//       }
//     });

//     // Track subscription handler for late video
//     const handleTrackSubscribed = (track, publication, participant) => {
//       if (track.kind !== 'video') return;
//       const id = participant.identity || participant.sid;
//       // Find the seat occupied by this participant (or first available if not yet assigned)
//       let seat = seatsRef.current.find(s => s.occupiedBy === id);
//       if (!seat) {
//         seat = seatsRef.current.find(s => s.occupiedBy === null);
//         if (!seat) return;
//         seat.occupiedBy = id;
//         seat.labelDiv.textContent = participant.identity || 'Guest';
//         seat.labelDiv.style.display = 'block';
//       }
//       if (!seat.videoElement) {
//         const stream = new MediaStream([track.mediaStreamTrack]);
//         const video = document.createElement('video');
//         video.srcObject = stream;
//         video.autoplay = true;
//         video.muted = true;
//         video.loop = true;
//         video.playsInline = true;
//         video.style.display = 'none';
//         document.body.appendChild(video);

//         const texture = new THREE.VideoTexture(video);
//         texture.minFilter = THREE.LinearFilter;
//         texture.magFilter = THREE.LinearFilter;
//         seat.mesh.material.map = texture;
//         seat.mesh.material.opacity = 1;
//         seat.mesh.material.needsUpdate = true;
//         seat.videoElement = video;
//         video.play().catch(console.warn);
//       }
//     };

//     room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

//     return () => {
//       room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
//     };
//   }, [participants, room]);

//   return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
// }