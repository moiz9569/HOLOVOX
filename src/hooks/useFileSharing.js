import { useState, useEffect, useRef } from 'react';
import { RoomEvent } from 'livekit-client';

export const useFileSharing = (room, showNotification) => {
  const [fileTransfers, setFileTransfers] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const listenerAttachedRef = useRef(false);

  // Send a file
  const sendFile = async (file, targetParticipantId = null) => {
    if (!room) {
      console.error("❌ Room not available");
      showNotification("Meeting not ready", "error");
      return;
    }
    if (room.state !== 'connected') {
      console.error("❌ Room not connected, state:", room.state);
      showNotification("Waiting for connection...", "error");
      return;
    }

    try {
      const options = {
        topic: 'file_transfer',
        attributes: { fileName: file.name, fileSize: file.size },
        onProgress: (progress) => setUploadProgress(Math.ceil(progress * 100)),
      };
      if (targetParticipantId) {
        options.destinationIdentities = [targetParticipantId];
      }

      console.log("📤 Sending file:", file.name);
      const streamInfo = await room.localParticipant.sendFile(file, options);
      console.log("✅ File sent successfully:", streamInfo);

      setFileTransfers(prev => [...prev, {
        id: streamInfo.id,
        name: file.name,
        size: file.size,
        sender: 'You',
        timestamp: new Date(),
      }]);
      showNotification(`Sent "${file.name}"`, 'success');
      setUploadProgress(0);
    } catch (error) {
      console.error("❌ Send file failed:", error);
      showNotification(`Failed to send file: ${error.message}`, 'error');
    }
  };

  // Listen for incoming files – attach only when room is connected
  useEffect(() => {
    if (!room) {
      console.log("⏳ No room yet");
      return;
    }
    if (room.state !== 'connected') {
      console.log(`⏳ Room state: ${room.state}, waiting for 'connected'`);
      const handleConnect = () => {
        console.log("🔌 Room connected, attaching ByteStream listener");
        attachListener();
      };
      room.once(RoomEvent.Connected, handleConnect);
      return () => {
        room.off(RoomEvent.Connected, handleConnect);
      };
    } else {
      attachListener();
    }

    function attachListener() {
      if (listenerAttachedRef.current) {
        console.log("⚠️ Listener already attached, skipping");
        return;
      }
      const handleByteStream = async (stream, info) => {
        if (info.topic !== 'file_transfer') return;
        console.log("📁 File receive event triggered", info);

        const fileName = info.attributes?.fileName || 'file';
        const fileSize = parseInt(info.attributes?.fileSize, 10) || 0;
        console.log(`📄 Receiving: ${fileName} (${fileSize} bytes)`);
        setDownloadingFile({ id: info.id, name: fileName, progress: 0 });

        try {
          const reader = stream.getReader();
          const chunks = [];
          let receivedSize = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            receivedSize += value.length;
            console.log(`📦 Chunk: ${value.length} bytes, total: ${receivedSize}`);
            if (fileSize) {
              const percent = Math.ceil((receivedSize / fileSize) * 100);
              setDownloadingFile(prev => prev ? { ...prev, progress: percent } : null);
            }
          }
          console.log(`✅ File fully received: ${fileName}, chunks: ${chunks.length}`);

          const blob = new Blob(chunks);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();
          URL.revokeObjectURL(url);
          showNotification(`Received "${fileName}"`, 'success');
        } catch (error) {
          console.error("❌ Receive file failed:", error);
          showNotification(`Failed to receive file`, 'error');
        } finally {
          setDownloadingFile(null);
        }
      };

      room.on(RoomEvent.ByteStream, handleByteStream);
      listenerAttachedRef.current = true;
      console.log("🎧 ByteStream listener attached");

      return () => {
        room.off(RoomEvent.ByteStream, handleByteStream);
        listenerAttachedRef.current = false;
        console.log("🔇 ByteStream listener removed");
      };
    }
  }, [room, showNotification]);

  return {
    sendFile,
    uploadProgress,
    downloadingFile,
    fileTransfers,
  };
};



// import { useState, useEffect } from 'react';
// import { RoomEvent } from 'livekit-client';

// export const useFileSharing = (room, showNotification) => {
//   const [fileTransfers, setFileTransfers] = useState([]);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [downloadingFile, setDownloadingFile] = useState(null);

//   // Send a file to everyone (or specific participant)
//   const sendFile = async (file, targetParticipantId = null) => {
//     console.log("🚀 sendFile called with file:", file?.name);
//     console.log("📡 room object:", room);
//     console.log("👤 localParticipant:", room?.localParticipant);
//     if (!room) return;

//     try {
//       const options = {
//         topic: 'file_transfer',
//         attributes: { fileName: file.name, fileSize: file.size },
//         onProgress: (progress) => setUploadProgress(Math.ceil(progress * 100)),
//       };

//       if (targetParticipantId) {
//         options.destinationIdentities = [targetParticipantId];
//       }

//       const streamInfo = await room.localParticipant.sendFile(file, options);
      
//       setFileTransfers(prev => [...prev, {
//         id: streamInfo.id,
//         name: file.name,
//         size: file.size,
//         sender: 'You',
//         timestamp: new Date(),
//       }]);

//       showNotification(`Sent "${file.name}"`, 'success');
//       setUploadProgress(0);
//     } catch (error) {
//       console.error('Send file failed:', error);
//       showNotification(`Failed to send file: ${error.message}`, 'error');
//     }
//   };

//   // Listen for incoming files
//   useEffect(() => {
//     console.log("🔄 useFileSharing effect running, room:", room);
//     if (!room) return;

//     const handleByteStream = async (stream, info) => {
//       if (info.topic !== 'file_transfer') return;
    
//       console.log("📁 File receive event triggered", info);
    
//       const fileName = info.attributes?.fileName || 'file';
//       const fileSize = parseInt(info.attributes?.fileSize, 10) || 0;
      
//       console.log(`📄 Receiving: ${fileName} (${fileSize} bytes)`);
      
//       setDownloadingFile({ id: info.id, name: fileName, progress: 0 });
    
//       try {
//         const reader = stream.getReader();
//         const chunks = [];
//         let receivedSize = 0;
    
//         while (true) {
//           const { done, value } = await reader.read();
//           if (done) break;
//           chunks.push(value);
//           receivedSize += value.length;
//           console.log(`📦 Chunk received: ${value.length} bytes, total: ${receivedSize}`);
          
//           if (fileSize) {
//             const percent = Math.ceil((receivedSize / fileSize) * 100);
//             setDownloadingFile(prev => prev ? { ...prev, progress: percent } : null);
//           }
//         }
    
//         console.log(`✅ File fully received: ${fileName}, chunks: ${chunks.length}`);
        
//         const blob = new Blob(chunks);
//         const url = URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = fileName;
//         a.click();
//         URL.revokeObjectURL(url);
    
//         showNotification(`Received "${fileName}"`, 'success');
//       } catch (error) {
//         console.error("❌ Receive file failed:", error);
//         showNotification(`Failed to receive file: ${error.message}`, 'error');
//       } finally {
//         setDownloadingFile(null);
//       }
//     };

//     room.on(RoomEvent.ByteStream, handleByteStream);
//     return () => room.off(RoomEvent.ByteStream, handleByteStream);
//   }, [room, showNotification]);

//   return {
//     sendFile,
//     uploadProgress,
//     downloadingFile,
//     fileTransfers,
//   };
// };