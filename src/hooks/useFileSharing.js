import { useState, useEffect } from 'react';
import { RoomEvent } from 'livekit-client';

export const useFileSharing = (room, showNotification) => {
  const [fileTransfers, setFileTransfers] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [downloadingFile, setDownloadingFile] = useState(null);

  // Send a file to everyone (or specific participant)
  const sendFile = async (file, targetParticipantId = null) => {
    if (!room) return;

    try {
      const options = {
        topic: 'file_transfer',
        attributes: { fileName: file.name, fileSize: file.size },
        onProgress: (progress) => setUploadProgress(Math.ceil(progress * 100)),
      };

      if (targetParticipantId) {
        options.destinationIdentities = [targetParticipantId];
      }

      const streamInfo = await room.localParticipant.sendFile(file, options);
      
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
      console.error('Send file failed:', error);
      showNotification(`Failed to send file: ${error.message}`, 'error');
    }
  };

  // Listen for incoming files
  useEffect(() => {
    if (!room) return;

    const handleByteStream = async (reader, info) => {
      if (info.topic !== 'file_transfer') return;

      const fileName = info.attributes?.fileName || 'file';
      const fileSize = info.attributes?.fileSize || 0;
      
      setDownloadingFile({ id: info.id, name: fileName, progress: 0 });

      try {
        const chunks = [];
        for await (const chunk of reader) {
          chunks.push(chunk);
        }

        const blob = new Blob(chunks);
        const url = URL.createObjectURL(blob);
        
        // Auto download
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        
        URL.revokeObjectURL(url);
        showNotification(`Received "${fileName}"`, 'success');
        setDownloadingFile(null);
      } catch (error) {
        console.error('Receive file failed:', error);
        showNotification(`Failed to receive file`, 'error');
        setDownloadingFile(null);
      }
    };

    room.on(RoomEvent.ByteStream, handleByteStream);
    return () => room.off(RoomEvent.ByteStream, handleByteStream);
  }, [room, showNotification]);

  return {
    sendFile,
    uploadProgress,
    downloadingFile,
    fileTransfers,
  };
};