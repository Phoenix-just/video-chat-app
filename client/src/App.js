import React, { useState, useEffect, useRef } from 'react';
import './styles/App.css';
import SocketService from './services/socket.service';
import WebRTCService from "./services/webrtc.service";
import SocketContext from './context/socket-context';

function App() {
  const [isVideoChatActive, setIsVideoChatActive] = useState(false);
  const [roomFilled, setRoomFilled] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [socketService] = useState(new SocketService());
  const [webRTCService] = useState(new WebRTCService());
  const localStreamRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  // const webRTCService = new WebRTCService();

  useEffect(() => {
    // Cleanup on component unmount
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, [socketService]);

  const handleRoomJoined = (data) => {
    console.log('Room joined', data);
    socketService.roomId = data.roomData.roomId;
    console.log('Local stream', localStreamRef.current);
    localVideoRef.current.srcObject = localStreamRef.current;
    localVideoRef.current.play();
  }

  const handleRoomFilled = async () => {
    console.log('Room filled');
    setRoomFilled(true);
    const connection = webRTCService.initializePeerConnection();
    if (connection) { 
      webRTCService.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          // You'll need to implement sending this to the remote peer
          socketService.emit('ice-candidate', { candidate: event.candidate, roomId: socketService.roomId });
        }
      };
      webRTCService.addLocalStream(localStreamRef.current);
      remoteVideoRef.current.srcObject = webRTCService.remoteStream;
      remoteVideoRef.current.play();
      const offer = await webRTCService.createOffer();
      socketService.emit('offer', { offer, roomId: socketService.roomId });
    }
  }

  const handleOffer = async (data) => {
    console.log('Offer', data);
    setRoomFilled(true);
    const connection = webRTCService.initializePeerConnection();
    if (connection) {
      webRTCService.peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log('New ICE candidate:', event.candidate);
          // You'll need to implement sending this to the remote peer
          socketService.emit('ice-candidate', { candidate: event.candidate, roomId: socketService.roomId });
        }
      };
      webRTCService.addLocalStream(localStreamRef.current);
      remoteVideoRef.current.srcObject = webRTCService.remoteStream;
      remoteVideoRef.current.play();
      await webRTCService.setRemoteDescription(data.offer);
      const answer = await webRTCService.createAnswer();
      socketService.emit('answer', { answer, roomId: socketService.roomId });
    }
  }

  const handleAnswer = async (data) => {
    console.log('Answer', data);
    await webRTCService.setRemoteDescription(data.answer);
  }

  const handleIceCandidate = (data) => {
    console.log('ICE candidate', data);
    webRTCService.addIceCandidate(data.candidate);
  }

  const getLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      return stream;
    } catch (error) {
      console.error('Error accessing local media:', error);
      return null;
    }
  }

  const setSocketEvents = () => {
    socketService.on('data', (data) => {
      switch (data.type) {
        case 'roomJoined':
          handleRoomJoined(data);
          break;
        case 'roomFilled':
          handleRoomFilled();
          break;
        case 'offer':
          handleOffer(data);
          break;
        case 'answer':
          handleAnswer(data);
          break;
        case 'ice-candidate':
          handleIceCandidate(data);
          break;
        case 'roomVacated':
          handleRoomVacated();
          break;
      }
    });
  }

  const handleStartVideoChat = async () => {
    if (socketService.isConnected) {
      if (!isVideoChatActive) {
        setIsVideoChatActive(true);
      }
      if (!localStreamRef.current) {
        localStreamRef.current = await getLocalStream();
      }
      socketService.emit('startVideoChat');
    } else {
      console.log('Not connected to server');
    }
  };

  const onStartVideoChat = () => {
    setSocketEvents();
    handleStartVideoChat();
  }

  const handleRoomVacated = () => {
    console.log('Room vacated');
    webRTCService.close();
    remoteVideoRef.current.srcObject = null;
    setRoomFilled(false);
    handleStartVideoChat();
  }

  const handleVideoToggle = async () => {
    if (localStreamRef.current) {
      if (isVideoEnabled) {
        // Stop all video tracks
        localStreamRef.current.getVideoTracks().forEach(track => {
          track.stop();
        });
        // Replace video tracks with null in peer connection
        if (webRTCService.peerConnection) {
          webRTCService.peerConnection.getSenders().forEach(sender => {
            if (sender.track && sender.track.kind === 'video') {
              sender.replaceTrack(null);
            }
          });
        }
        setIsVideoEnabled(false);
      } else {
        // Get new video stream
        try {
          const newStream = await getLocalStream();
          const newVideoTrack = newStream.getVideoTracks()[0];
          
          // Replace null track with new video track
          if (webRTCService.peerConnection) {
            webRTCService.peerConnection.getSenders().forEach(sender => {
              if (sender.track === null || sender.track.kind === 'video') {
                sender.replaceTrack(newVideoTrack);
              }
            });
          }

          // Update local stream and video element
          localStreamRef.current = newStream;
          localVideoRef.current.srcObject = localStreamRef.current;
          localVideoRef.current.play();
          
          setIsVideoEnabled(true);
        } catch (error) {
          console.error('Error re-enabling video:', error);
        }
      }
    }
  };

  return (
    <SocketContext.Provider value={socketService}>
      <div className="App">
        <h1>CONVERSO</h1>
        {!isVideoChatActive ? (
          <button onClick={onStartVideoChat}>INITIATE CONNECTION</button>
        ) : (
          <div className="video-container">
            <div className="video-wrapper">
              <video ref={localVideoRef} playsInline muted></video>
              <button className="video-toggle-overlay" onClick={handleVideoToggle}>
                {isVideoEnabled ? (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V8C1 7.46957 1.21071 6.96086 1.58579 6.58579C1.96086 6.21071 2.46957 6 3 6H7L9 3H15L17 6H21C21.5304 6 22.0391 6.21071 22.4142 6.58579C22.7893 6.96086 23 7.46957 23 8V19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                )}
              </button>
            </div>
            <video ref={remoteVideoRef} playsInline></video>
          </div>
        )}
      </div>
    </SocketContext.Provider>
  );
}

export default App;
