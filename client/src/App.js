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

  const handleStartVideoChat = async () => {
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
      }
    });
    if (socketService.isConnected) {
      setIsVideoChatActive(true);
      localStreamRef.current = await getLocalStream();
      socketService.emit('startVideoChat');
    } else {
      console.log('Not connected to server');
    }
  };

  const handleVideoToggle = async () => {
    if (localStreamRef.current) {
      if (isVideoEnabled) {
        // Stop all video tracks
        localStreamRef.current.getVideoTracks().forEach(track => {
          track.stop();
        });
        // Replace video tracks with null in peer connection
        webRTCService.peerConnection.getSenders().forEach(sender => {
          if (sender.track && sender.track.kind === 'video') {
            sender.replaceTrack(null);
          }
        });
        setIsVideoEnabled(false);
      } else {
        // Get new video stream
        try {
          const newStream = await getLocalStream();
          const newVideoTrack = newStream.getVideoTracks()[0];
          
          // Replace null track with new video track
          webRTCService.peerConnection.getSenders().forEach(sender => {
            if (sender.track === null || sender.track.kind === 'video') {
              sender.replaceTrack(newVideoTrack);
            }
          });

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
        <h1>Video Chat App</h1>
        {!isVideoChatActive ? (
          <button onClick={handleStartVideoChat}>Start Video Chat</button>
        ) : (
          <div className="video-container">
            <video ref={localVideoRef} playsInline></video>
            <video ref={remoteVideoRef} playsInline></video>
            <button onClick={handleVideoToggle}>
              {isVideoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
            </button>
          </div>
        )}
      </div>
    </SocketContext.Provider>
  );
}

export default App;
