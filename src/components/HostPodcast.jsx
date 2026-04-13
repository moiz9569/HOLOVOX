"use client";

// // components/HostPodcast.jsx
// import { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
// import { Track, RoomEvent } from 'livekit-client';
// import * as bodyPix from '@tensorflow-models/body-pix';
// import '@tensorflow/tfjs-backend-webgl';

// export default function HostPodcast({ room }) {
//   const containerRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const labelRendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const seatsRef = useRef(new Map());
//   const [participants, setParticipants] = useState([]);
//   const [segmenter, setSegmenter] = useState(null);

//   // Load BodyPix model (lightweight)
//   useEffect(() => {
//     bodyPix.load({
//       architecture: 'MobileNetV1',
//       outputStride: 16,
//       multiplier: 0.75,
//       quantBytes: 2,
//     }).then(setSegmenter).catch(console.error);
//   }, []);

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

//   // Setup 3D scene – full table, large chairs, dark gray theme
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x050510);
//     scene.fog = new THREE.FogExp2(0x050510, 0.005);
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
//     camera.position.set(0, 2.2, 4.5);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
//     controls.enableZoom = true;
//     controls.zoomSpeed = 0.8;
//     controls.enablePan = false;
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
//     scene.add(new THREE.AmbientLight(0x404060, 0.5));
//     const keyLight = new THREE.DirectionalLight(0xffeedd, 1.5);
//     keyLight.position.set(2, 5, 4);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     const d = 10;
//     keyLight.shadow.camera.left = -d;
//     keyLight.shadow.camera.right = d;
//     keyLight.shadow.camera.top = d;
//     keyLight.shadow.camera.bottom = -d;
//     keyLight.shadow.camera.near = 1;
//     keyLight.shadow.camera.far = 30;
//     scene.add(keyLight);
    
//     const fillLight = new THREE.PointLight(0x88aacc, 0.6);
//     fillLight.position.set(-3, 3, 2);
//     scene.add(fillLight);
//     const backLight = new THREE.PointLight(0x446688, 0.4);
//     backLight.position.set(0, 3, -5);
//     scene.add(backLight);

//     // --- Full Round Table (dark gray) ---
//     const tableMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.5, metalness: 0.1 });
//     const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.15, 64), tableMat);
//     tableTop.position.y = 0.9;
//     tableTop.receiveShadow = true;
//     tableTop.castShadow = true;
//     scene.add(tableTop);
    
//     const legMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7 });
//     const legGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.9, 8);
//     [[-2.5, 0.45, -2.5], [2.5, 0.45, -2.5], [-2.5, 0.45, 2.5], [2.5, 0.45, 2.5]].forEach(pos => {
//       const leg = new THREE.Mesh(legGeo, legMat);
//       leg.position.set(pos[0], pos[1], pos[2]);
//       leg.receiveShadow = true;
//       leg.castShadow = true;
//       scene.add(leg);
//     });

//     // Floor
//     const floor = new THREE.Mesh(new THREE.CircleGeometry(15, 32), new THREE.MeshStandardMaterial({ color: 0x12121e, roughness: 0.9, side: THREE.DoubleSide }));
//     floor.rotation.x = -Math.PI / 2;
//     floor.position.y = 0;
//     floor.receiveShadow = true;
//     scene.add(floor);
    
//     const grid = new THREE.GridHelper(20, 40, 0x446688, 0x223344);
//     grid.position.y = 0.02;
//     scene.add(grid);

//     // Particles
//     const particlesGeo = new THREE.BufferGeometry();
//     const posArray = new Float32Array(200 * 3);
//     for (let i = 0; i < 200; i++) {
//       posArray[i*3] = (Math.random() - 0.5) * 20;
//       posArray[i*3+1] = Math.random() * 5;
//       posArray[i*3+2] = (Math.random() - 0.5) * 20;
//     }
//     particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
//     const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.03 }));
//     scene.add(particles);

//     let frameId;
//     const animate = () => {
//       frameId = requestAnimationFrame(animate);
//       controls.update();
//       seatsRef.current.forEach(data => data.mesh.lookAt(camera.position));
//       particles.rotation.y += 0.0005;
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

//   // Participants with optimized BodyPix segmentation
//   useEffect(() => {
//     if (!sceneRef.current || !room || !segmenter) return;

//     const radius = 3.8;        // increased to clear the table
//     const chairY = 0.5;
//     const videoY = 1.9;
//     const angles = [0, 45, 90, 135, 180, 225, 270, 315].map(d => d * Math.PI / 180);

//     // Remove old participants
//     seatsRef.current.forEach((data, id) => {
//       if (!participants.find(p => (p.identity || p.sid) === id)) {
//         sceneRef.current.remove(data.mesh);
//         sceneRef.current.remove(data.chair);
//         sceneRef.current.remove(data.label);
//         if (data.cleanup) data.cleanup();
//         seatsRef.current.delete(id);
//       }
//     });

//     // Optimized segmentation (low res, ~10fps)
//     const startSegmentation = (participantId, track, mesh) => {
//       const stream = new MediaStream([track.mediaStreamTrack]);
//       const video = document.createElement('video');
//       video.srcObject = stream;
//       video.autoplay = true;
//       video.muted = true;
//       video.loop = true;
//       video.playsInline = true;
//       video.style.display = 'none';
//       document.body.appendChild(video);

//       const canvas = document.createElement('canvas');
//       canvas.width = 160;
//       canvas.height = 120;
//       const ctx = canvas.getContext('2d', { willReadFrequently: true });

//       let lastUpdate = 0;
//       const processFrame = async () => {
//         if (video.readyState >= 2) {
//           const now = performance.now();
//           if (now - lastUpdate > 100) { // ~10 fps
//             lastUpdate = now;
//             try {
//               const segmentation = await segmenter.segmentPerson(video, {
//                 internalResolution: 'low',
//                 segmentationThreshold: 0.6,
//                 maxDetections: 1,
//                 scoreThreshold: 0.3,
//               });
              
//               const maskImageData = new ImageData(segmentation.width, segmentation.height);
//               for (let i = 0; i < segmentation.data.length; i++) {
//                 maskImageData.data[i*4+3] = segmentation.data[i] ? 255 : 0;
//               }
              
//               ctx.clearRect(0, 0, canvas.width, canvas.height);
//               ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//               const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              
//               for (let i = 0; i < imageData.data.length; i += 4) {
//                 if (maskImageData.data[i+3] === 0) {
//                   imageData.data[i+3] = 0;
//                 }
//               }
//               ctx.putImageData(imageData, 0, 0);
              
//               if (mesh.material.map) mesh.material.map.dispose();
//               mesh.material.map = new THREE.CanvasTexture(canvas);
//               mesh.material.color.setHex(0xffffff);
//               mesh.material.needsUpdate = true;
//             } catch (e) {
//               // ignore
//             }
//           }
//         }
//         requestAnimationFrame(processFrame);
//       };
//       processFrame();

//       return () => {
//         video.srcObject = null;
//         video.remove();
//         if (mesh.material.map) mesh.material.map.dispose();
//       };
//     };

//     // Add new participants
//     participants.forEach((p, idx) => {
//       const id = p.identity || p.sid;
//       if (!id || seatsRef.current.has(id)) return;

//       const angle = angles[idx % angles.length];
//       const x = Math.cos(angle) * radius;
//       const z = Math.sin(angle) * radius;

//       // --- Large Chair (dark gray) with lookAt ---
//       const chairGroup = new THREE.Group();
//       const chairMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 });
//       const cushionMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.8 });
      
//       const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.0), chairMat);
//       seat.position.y = chairY;
//       seat.castShadow = true;
//       seat.receiveShadow = true;
//       chairGroup.add(seat);
      
//       const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 0.15), chairMat);
//       back.position.set(0, chairY + 1.0, -0.45);
//       back.castShadow = true;
//       back.receiveShadow = true;
//       chairGroup.add(back);
      
//       const headrest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.1), cushionMat);
//       headrest.position.set(0, chairY + 1.9, -0.4);
//       headrest.castShadow = true;
//       headrest.receiveShadow = true;
//       chairGroup.add(headrest);
      
//       const armMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
//       const armGeo = new THREE.BoxGeometry(0.15, 0.1, 0.8);
//       const leftArm = new THREE.Mesh(armGeo, armMat);
//       leftArm.position.set(-0.75, chairY + 0.3, 0);
//       leftArm.castShadow = true;
//       leftArm.receiveShadow = true;
//       chairGroup.add(leftArm);
//       const rightArm = new THREE.Mesh(armGeo, armMat);
//       rightArm.position.set(0.75, chairY + 0.3, 0);
//       rightArm.castShadow = true;
//       rightArm.receiveShadow = true;
//       chairGroup.add(rightArm);

//       chairGroup.position.set(x, 0, z);
//       chairGroup.lookAt(0, chairY, 0); // ✅ Always faces the table center
//       // If the chair's back faces the table, uncomment the next line:
//       // chairGroup.rotateY(Math.PI);
//       sceneRef.current.add(chairGroup);

//       // Video plane
//       const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide });
//       const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.8), material);
//       mesh.position.set(x, videoY, z);
//       sceneRef.current.add(mesh);

//       // Name label
//       const labelDiv = document.createElement('div');
//       labelDiv.textContent = p.identity || 'Guest';
//       labelDiv.style.cssText = 'color:#fff;font-size:18px;font-weight:bold;text-shadow:2px 2px 4px black;background:rgba(20,20,30,0.7);padding:6px 16px;border-radius:24px;border:1px solid #88aaff;pointer-events:none';
//       const label = new CSS2DObject(labelDiv);
//       label.position.set(x, videoY + 1.8, z);
//       sceneRef.current.add(label);

//       const data = { mesh, chair: chairGroup, label, cleanup: null };
//       seatsRef.current.set(id, data);

//       const videoTrack = p.getTrackPublication(Track.Source.Camera)?.videoTrack;
//       if (videoTrack) data.cleanup = startSegmentation(id, videoTrack, mesh);
//     });

//     const handleTrackSubscribed = (track, publication, participant) => {
//       const id = participant.identity || participant.sid;
//       const data = seatsRef.current.get(id);
//       if (data && track.kind === 'video' && !data.cleanup) {
//         data.cleanup = startSegmentation(id, track, data.mesh);
//       }
//     };
//     room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

//     return () => room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
//   }, [participants, room, segmenter]);

//   return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
// }


// components/HostPodcast.jsx
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
  const seatsRef = useRef(new Map());
  const [participants, setParticipants] = useState([]);

  // Track room participants
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

  // Setup 3D scene
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.FogExp2(0x050510, 0.005);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.set(0, 2.2, 4.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
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
    controls.enableZoom = true;
    controls.zoomSpeed = 0.8;
    controls.enablePan = false;
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
    scene.add(new THREE.AmbientLight(0x404060, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffeedd, 1.5);
    keyLight.position.set(2, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    const d = 10;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 30;
    scene.add(keyLight);
    
    const fillLight = new THREE.PointLight(0x88aacc, 0.6);
    fillLight.position.set(-3, 3, 2);
    scene.add(fillLight);
    const backLight = new THREE.PointLight(0x446688, 0.4);
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    // Table (dark gray)
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.5 });
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.15, 64), tableMat);
    tableTop.position.y = 0.9;
    tableTop.receiveShadow = true;
    tableTop.castShadow = true;
    scene.add(tableTop);
    
    const legMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7 });
    const legGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.9, 8);
    [[-2.5, 0.45, -2.5], [2.5, 0.45, -2.5], [-2.5, 0.45, 2.5], [2.5, 0.45, 2.5]].forEach(pos => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.receiveShadow = true;
      leg.castShadow = true;
      scene.add(leg);
    });

    // Floor
    const floor = new THREE.Mesh(new THREE.CircleGeometry(15, 32), new THREE.MeshStandardMaterial({ color: 0x12121e, roughness: 0.9, side: THREE.DoubleSide }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);
    
    const grid = new THREE.GridHelper(20, 40, 0x446688, 0x223344);
    grid.position.y = 0.02;
    scene.add(grid);

    // Particles (reduced)
    const particlesGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(150 * 3);
    for (let i = 0; i < 150; i++) {
      posArray[i*3] = (Math.random() - 0.5) * 20;
      posArray[i*3+1] = Math.random() * 5;
      posArray[i*3+2] = (Math.random() - 0.5) * 20;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.03 }));
    scene.add(particles);

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      seatsRef.current.forEach(data => data.mesh.lookAt(camera.position));
      particles.rotation.y += 0.0005;
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

  // Participants with RAW VIDEO (no segmentation, fast)
  useEffect(() => {
    if (!sceneRef.current || !room) return;

    const radius = 3.8;
    const chairY = 0.5;
    const videoY = 1.9;
    const angles = [0, 45, 90, 135, 180, 225, 270, 315].map(d => d * Math.PI / 180);

    // Remove old
    seatsRef.current.forEach((data, id) => {
      if (!participants.find(p => (p.identity || p.sid) === id)) {
        sceneRef.current.remove(data.mesh);
        sceneRef.current.remove(data.chair);
        sceneRef.current.remove(data.label);
        if (data.videoElement) {
          data.videoElement.pause();
          data.videoElement.srcObject = null;
          data.videoElement.remove();
        }
        seatsRef.current.delete(id);
      }
    });

    // Attach raw video
    const attachVideo = (participantId, track, mesh) => {
      console.log(`🎥 Attaching raw video for ${participantId}`);
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
      mesh.material.map = texture;
      mesh.material.color.setHex(0xffffff);
      mesh.material.needsUpdate = true;

      video.play().catch(e => console.warn('Video play failed:', e));
      return video;
    };

    // Add new participants
    participants.forEach((p, idx) => {
      const id = p.identity || p.sid;
      if (!id || seatsRef.current.has(id)) return;

      const angle = angles[idx % angles.length];
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;

      // Chair (dark gray)
      const chairGroup = new THREE.Group();
      const chairMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.6 });
      const cushionMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a, roughness: 0.8 });
      
      const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.0), chairMat);
      seat.position.y = chairY;
      seat.castShadow = true;
      seat.receiveShadow = true;
      chairGroup.add(seat);
      
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 0.15), chairMat);
      back.position.set(0, chairY + 1.0, -0.45);
      back.castShadow = true;
      back.receiveShadow = true;
      chairGroup.add(back);
      
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.1), cushionMat);
      headrest.position.set(0, chairY + 1.9, -0.4);
      headrest.castShadow = true;
      headrest.receiveShadow = true;
      chairGroup.add(headrest);
      
      const armMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
      const armGeo = new THREE.BoxGeometry(0.15, 0.1, 0.8);
      const leftArm = new THREE.Mesh(armGeo, armMat);
      leftArm.position.set(-0.75, chairY + 0.3, 0);
      leftArm.castShadow = true;
      leftArm.receiveShadow = true;
      chairGroup.add(leftArm);
      const rightArm = new THREE.Mesh(armGeo, armMat);
      rightArm.position.set(0.75, chairY + 0.3, 0);
      rightArm.castShadow = true;
      rightArm.receiveShadow = true;
      chairGroup.add(rightArm);

      chairGroup.position.set(x, 0, z);
      chairGroup.lookAt(0, chairY, 0); // Face center
      sceneRef.current.add(chairGroup);

      // Video plane (raw video)
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: false, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.8), material);
      mesh.position.set(x, videoY, z);
      sceneRef.current.add(mesh);

      // Name label
      const labelDiv = document.createElement('div');
      labelDiv.textContent = p.identity || 'Guest';
      labelDiv.style.cssText = 'color:#fff;font-size:18px;font-weight:bold;text-shadow:2px 2px 4px black;background:rgba(20,20,30,0.7);padding:6px 16px;border-radius:24px;border:1px solid #88aaff;pointer-events:none';
      const label = new CSS2DObject(labelDiv);
      label.position.set(x, videoY + 1.8, z);
      sceneRef.current.add(label);

      const data = { mesh, chair: chairGroup, label, videoElement: null };
      seatsRef.current.set(id, data);

      const videoTrack = p.getTrackPublication(Track.Source.Camera)?.videoTrack;
      if (videoTrack) {
        data.videoElement = attachVideo(id, videoTrack, mesh);
      } else {
        console.warn(`No video track for ${id} yet`);
      }
    });

    const handleTrackSubscribed = (track, publication, participant) => {
      const id = participant.identity || participant.sid;
      const data = seatsRef.current.get(id);
      if (data && track.kind === 'video' && !data.videoElement) {
        console.log(`🔔 Video track arrived for ${id}`);
        data.videoElement = attachVideo(id, track, data.mesh);
      }
    };
    room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

    return () => room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
  }, [participants, room]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}














// // components/HostPodcast.jsx
// import { useEffect, useRef, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
// import { Track, RoomEvent } from 'livekit-client';
// import * as bodyPix from '@tensorflow-models/body-pix';
// import '@tensorflow/tfjs-backend-webgl';

// export default function HostPodcast({ room }) {
//   const containerRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const labelRendererRef = useRef(null);
//   const cameraRef = useRef(null);
//   const controlsRef = useRef(null);
//   const seatsRef = useRef(new Map());
//   const [participants, setParticipants] = useState([]);
//   const [segmenter, setSegmenter] = useState(null);

//   // Load BodyPix model
//   useEffect(() => {
//     bodyPix.load({
//       architecture: 'MobileNetV1',
//       outputStride: 16,
//       multiplier: 0.75,
//       quantBytes: 2,
//     }).then(setSegmenter).catch(console.error);
//   }, []);

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

//   // Setup 3D scene (full table, large chairs)
//   useEffect(() => {
//     if (!containerRef.current) return;

//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x050510);
//     scene.fog = new THREE.FogExp2(0x050510, 0.005);
//     sceneRef.current = scene;

//     const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
//     camera.position.set(0, 2.2, 4.5);
//     cameraRef.current = camera;

//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
//     controls.enableZoom = true;
//     controls.zoomSpeed = 0.8;
//     controls.enablePan = false;
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
//     scene.add(new THREE.AmbientLight(0x404060, 0.5));
//     const keyLight = new THREE.DirectionalLight(0xffeedd, 1.5);
//     keyLight.position.set(2, 5, 4);
//     keyLight.castShadow = true;
//     keyLight.shadow.mapSize.width = 2048;
//     keyLight.shadow.mapSize.height = 2048;
//     const d = 10;
//     keyLight.shadow.camera.left = -d;
//     keyLight.shadow.camera.right = d;
//     keyLight.shadow.camera.top = d;
//     keyLight.shadow.camera.bottom = -d;
//     keyLight.shadow.camera.near = 1;
//     keyLight.shadow.camera.far = 30;
//     scene.add(keyLight);
    
//     const fillLight = new THREE.PointLight(0x88aacc, 0.6);
//     fillLight.position.set(-3, 3, 2);
//     scene.add(fillLight);
//     const backLight = new THREE.PointLight(0x446688, 0.4);
//     backLight.position.set(0, 3, -5);
//     scene.add(backLight);

//     // --- Full Round Table ---
//     const tableMat = new THREE.MeshStandardMaterial({ color: 0x8b6e4b, roughness: 0.6 });
//     const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.2, 0.15, 64), tableMat);
//     tableTop.position.y = 0.9;
//     tableTop.receiveShadow = true;
//     tableTop.castShadow = true;
//     scene.add(tableTop);
    
//     const legMat = new THREE.MeshStandardMaterial({ color: 0x5a3e2a, roughness: 0.8 });
//     const legGeo = new THREE.CylinderGeometry(0.15, 0.18, 0.9, 8);
//     [[-2.5, 0.45, -2.5], [2.5, 0.45, -2.5], [-2.5, 0.45, 2.5], [2.5, 0.45, 2.5]].forEach(pos => {
//       const leg = new THREE.Mesh(legGeo, legMat);
//       leg.position.set(pos[0], pos[1], pos[2]);
//       leg.receiveShadow = true;
//       leg.castShadow = true;
//       scene.add(leg);
//     });

//     // Floor
//     const floor = new THREE.Mesh(new THREE.CircleGeometry(15, 32), new THREE.MeshStandardMaterial({ color: 0x12121e, roughness: 0.9, side: THREE.DoubleSide }));
//     floor.rotation.x = -Math.PI / 2;
//     floor.position.y = 0;
//     floor.receiveShadow = true;
//     scene.add(floor);
    
//     const grid = new THREE.GridHelper(20, 40, 0x446688, 0x223344);
//     grid.position.y = 0.02;
//     scene.add(grid);

//     // Particles
//     const particlesGeo = new THREE.BufferGeometry();
//     const posArray = new Float32Array(200 * 3);
//     for (let i = 0; i < 200; i++) {
//       posArray[i*3] = (Math.random() - 0.5) * 20;
//       posArray[i*3+1] = Math.random() * 5;
//       posArray[i*3+2] = (Math.random() - 0.5) * 20;
//     }
//     particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
//     const particles = new THREE.Points(particlesGeo, new THREE.PointsMaterial({ color: 0xaaccff, size: 0.03 }));
//     scene.add(particles);

//     let frameId;
//     const animate = () => {
//       frameId = requestAnimationFrame(animate);
//       controls.update();
//       seatsRef.current.forEach(data => data.mesh.lookAt(camera.position));
//       particles.rotation.y += 0.0005;
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

//   // Participants with BodyPix segmentation
//   useEffect(() => {
//     if (!sceneRef.current || !room || !segmenter) return;

//     const radius = 3.0;
//     const chairY = 0.5;
//     const videoY = 1.9;
//     const angles = [0, 45, 90, 135, 180, 225, 270, 315].map(d => d * Math.PI / 180);

//     // Remove old
//     seatsRef.current.forEach((data, id) => {
//       if (!participants.find(p => (p.identity || p.sid) === id)) {
//         sceneRef.current.remove(data.mesh);
//         sceneRef.current.remove(data.chair);
//         sceneRef.current.remove(data.label);
//         if (data.cleanup) data.cleanup();
//         seatsRef.current.delete(id);
//       }
//     });

//     // Segmentation using BodyPix
//     const startSegmentation = (participantId, track, mesh) => {
//       const stream = new MediaStream([track.mediaStreamTrack]);
//       const video = document.createElement('video');
//       video.srcObject = stream;
//       video.autoplay = true;
//       video.muted = true;
//       video.loop = true;
//       video.playsInline = true;
//       video.style.display = 'none';
//       document.body.appendChild(video);

//       const canvas = document.createElement('canvas');
//       canvas.width = 240;
//       canvas.height = 180;
//       const ctx = canvas.getContext('2d', { willReadFrequently: true });

//       let lastUpdate = 0;
//       const processFrame = async () => {
//         if (video.readyState >= 2) {
//           const now = performance.now();
//           if (now - lastUpdate > 66) { // ~15fps
//             lastUpdate = now;
//             try {
//               const segmentation = await segmenter.segmentPerson(video, {
//                 internalResolution: 'medium',
//                 segmentationThreshold: 0.7,
//               });
              
//               // Create mask ImageData
//               const maskImageData = new ImageData(segmentation.width, segmentation.height);
//               for (let i = 0; i < segmentation.data.length; i++) {
//                 maskImageData.data[i*4+3] = segmentation.data[i] ? 255 : 0;
//               }
              
//               ctx.clearRect(0, 0, canvas.width, canvas.height);
//               ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
//               const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              
//               // Apply mask
//               for (let i = 0; i < imageData.data.length; i += 4) {
//                 if (maskImageData.data[i+3] === 0) {
//                   imageData.data[i+3] = 0;
//                 }
//               }
//               ctx.putImageData(imageData, 0, 0);
              
//               if (mesh.material.map) mesh.material.map.dispose();
//               mesh.material.map = new THREE.CanvasTexture(canvas);
//               mesh.material.color.setHex(0xffffff);
//               mesh.material.needsUpdate = true;
//             } catch (e) {
//               console.warn('Segmentation error:', e);
//             }
//           }
//         }
//         requestAnimationFrame(processFrame);
//       };
//       processFrame();

//       const cleanup = () => {
//         video.srcObject = null;
//         video.remove();
//         if (mesh.material.map) mesh.material.map.dispose();
//       };
//       return cleanup;
//     };

//     // Add new participants
//     participants.forEach((p, idx) => {
//       const id = p.identity || p.sid;
//       if (!id || seatsRef.current.has(id)) return;

//       const angle = angles[idx % angles.length];
//       const x = Math.cos(angle) * radius;
//       const z = Math.sin(angle) * radius;

//       // --- Large Chair (headrest visible above video) ---
//       const chairGroup = new THREE.Group();
//       const chairMat = new THREE.MeshStandardMaterial({ color: 0x191970, roughness: 0.7 });
//       const cushionMat = new THREE.MeshStandardMaterial({ color: 0x191970, roughness: 0.9 });
      
//       const seat = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 1.0), chairMat);
//       seat.position.y = chairY;
//       seat.castShadow = true;
//       seat.receiveShadow = true;
//       chairGroup.add(seat);
      
//       const back = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.8, 0.15), chairMat);
//       back.position.set(0, chairY + 1.0, -0.45);
//       back.castShadow = true;
//       back.receiveShadow = true;
//       chairGroup.add(back);
      
//       const headrest = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.35, 0.1), cushionMat);
//       headrest.position.set(0, chairY + 1.9, -0.4);
//       headrest.castShadow = true;
//       headrest.receiveShadow = true;
//       chairGroup.add(headrest);
      
//       const armMat = new THREE.MeshStandardMaterial({ color: 0x191970 });
//       const armGeo = new THREE.BoxGeometry(0.15, 0.1, 0.8);
//       const leftArm = new THREE.Mesh(armGeo, armMat);
//       leftArm.position.set(-0.75, chairY + 0.3, 0);
//       leftArm.castShadow = true;
//       leftArm.receiveShadow = true;
//       chairGroup.add(leftArm);
//       const rightArm = new THREE.Mesh(armGeo, armMat);
//       rightArm.position.set(0.75, chairY + 0.3, 0);
//       rightArm.castShadow = true;
//       rightArm.receiveShadow = true;
//       chairGroup.add(rightArm);

//       chairGroup.position.set(x, 0, z);
//       chairGroup.rotation.y = angle - Math.PI / 2; // Faces table center
//       sceneRef.current.add(chairGroup);

//       // Video plane
//       const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, side: THREE.DoubleSide });
//       const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.8), material);
//       mesh.position.set(x, videoY, z);
//       sceneRef.current.add(mesh);

//       // Name label
//       const labelDiv = document.createElement('div');
//       labelDiv.textContent = p.identity || 'Guest';
//       labelDiv.style.cssText = 'color:#fff;font-size:18px;font-weight:bold;text-shadow:2px 2px 4px black;background:rgba(20,20,30,0.7);padding:6px 16px;border-radius:24px;border:1px solid #88aaff;pointer-events:none';
//       const label = new CSS2DObject(labelDiv);
//       label.position.set(x, videoY + 1.8, z);
//       sceneRef.current.add(label);

//       const data = { mesh, chair: chairGroup, label, cleanup: null };
//       seatsRef.current.set(id, data);

//       const videoTrack = p.getTrackPublication(Track.Source.Camera)?.videoTrack;
//       if (videoTrack) data.cleanup = startSegmentation(id, videoTrack, mesh);
//     });

//     const handleTrackSubscribed = (track, publication, participant) => {
//       const id = participant.identity || participant.sid;
//       const data = seatsRef.current.get(id);
//       if (data && track.kind === 'video' && !data.cleanup) {
//         data.cleanup = startSegmentation(id, track, data.mesh);
//       }
//     };
//     room.on(RoomEvent.TrackSubscribed, handleTrackSubscribed);

//     return () => room.off(RoomEvent.TrackSubscribed, handleTrackSubscribed);
//   }, [participants, room, segmenter]);

//   return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
// }
