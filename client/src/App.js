import React, { useState, useEffect } from 'react';
import './styles/App.css';
import HealthCheck from './components/HealthCheck';
import VideoPlayer from './components/VideoPlayer';
import SocketService from './services/socket.service';
import WebRTCService from "./services/webrtc.service";

function App() {
  const [isVideoChatActive, setIsVideoChatActive] = useState(false);
  const [socketService] = useState(new SocketService());
  const webRTCService = new WebRTCService();

  useEffect(() => {
    // Cleanup on component unmount
    socketService.connect();
    return () => {
      socketService.disconnect();
    };
  }, [socketService]);

  const handleStartVideoChat = () => {
    if (socketService.isConnected) {
      webRTCService.initializePeerConnection();
      socketService.emit('startVideoChat');
      setIsVideoChatActive(true);
    } else {
      console.log('Not connected to server');
    }
  };

  return (
    <div className="App">
      <h1>Video Chat App</h1>
      <button onClick={handleStartVideoChat}>Start Video Chat</button>
      <div className="video-container">
        <VideoPlayer socket={socketService} />
      </div>
      {/* {!isVideoChatActive ? (
      ) : (
      )} */}
    </div>
  );
}

export default App;
