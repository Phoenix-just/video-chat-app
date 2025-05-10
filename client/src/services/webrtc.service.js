class WebRTCService {
    constructor() {
        // Configuration for STUN/TURN servers
        this.configuration = {
            iceServers:[
                {
                  urls: "turn:34.30.179.128:3479",
                  username: "hemanth",
                  credential: "hemanth",
                }
            ],
            // iceServers:[
            //     {
            //       urls: "stun:stun.relay.metered.ca:80",
            //     },
            //     {
            //       urls: "turn:global.relay.metered.ca:80",
            //       username: "00131c62c8d3ae389777ce80",
            //       credential: "qlcDIB47LytN3u7O",
            //     },
            //     {
            //       urls: "turn:global.relay.metered.ca:80?transport=tcp",
            //       username: "00131c62c8d3ae389777ce80",
            //       credential: "qlcDIB47LytN3u7O",
            //     },
            //     {
            //       urls: "turn:global.relay.metered.ca:443",
            //       username: "00131c62c8d3ae389777ce80",
            //       credential: "qlcDIB47LytN3u7O",
            //     },
            //     {
            //       urls: "turns:global.relay.metered.ca:443?transport=tcp",
            //       username: "00131c62c8d3ae389777ce80",
            //       credential: "qlcDIB47LytN3u7O",
            //     },
            // ],
            // iceServers: [
            //     { urls: 'stun:stun.l.google.com:19302' },
            //     { urls: "stun:stun.l.google.com:19302" },
            //     { urls: "stun:stun.l.google.com:5349" },
            //     { urls: "stun:stun1.l.google.com:3478" },
            //     { urls: "stun:stun1.l.google.com:5349" },
            //     { urls: "stun:stun2.l.google.com:19302" },
            //     { urls: "stun:stun2.l.google.com:5349" },
            //     { urls: "stun:stun3.l.google.com:3478" },
            //     { urls: "stun:stun3.l.google.com:5349" },
            //     { urls: "stun:stun4.l.google.com:19302" },
            //     { urls: "stun:stun4.l.google.com:5349" },
            //     {
            //         urls: 'turn:numb.viagenie.ca',
            //         credential: 'muazkh',
            //         username: 'webrtc@live.com'
            //     },
            //     {
            //         urls: 'turn:turn.anyfirewall.com:443?transport=tcp',
            //         credential: 'webrtc',
            //         username: 'webrtc'
            //     }
            // ],
            iceCandidatePoolSize: 10
        };

        // Create RTCPeerConnection instance
        this.peerConnection = null;
        this.localStream = null;
        this.remoteStream = null;
    }

    // Initialize the peer connection
    initializePeerConnection() {
        try {
            // Create new RTCPeerConnection with configuration
            this.peerConnection = new RTCPeerConnection(this.configuration);

            // Handle incoming tracks from remote peer
            if (!this.remoteStream) {
                this.remoteStream = new MediaStream();
            }
            this.peerConnection.ontrack = (event) => {
                console.log('Received remote track:', event.track);
                this.remoteStream.addTrack(event.track);
            };

            // Handle connection state changes
            this.peerConnection.onconnectionstatechange = () => {
                console.log('Connection state:', this.peerConnection.connectionState);
            };

            // Handle ICE connection state changes
            this.peerConnection.oniceconnectionstatechange = () => {
                console.log('ICE connection state:', this.peerConnection.iceConnectionState);
            };

            return true;
        } catch (error) {
            console.error('Error initializing peer connection:', error);
            return false;
        }
    }

    // Add local media stream to the connection
    async addLocalStream(stream) {
        try {
            this.localStream = stream;
            // Add each track from the local stream to the peer connection
            stream.getTracks().forEach(track => {
                this.peerConnection.addTrack(track, stream);
            });
            return true;
        } catch (error) {
            console.error('Error adding local stream:', error);
            return false;
        }
    }

    // Create and set local description (offer)
    async createOffer() {
        try {
            const offer = await this.peerConnection.createOffer();
            await this.peerConnection.setLocalDescription(offer);
            return offer;
        } catch (error) {
            console.error('Error creating offer:', error);
            throw error;
        }
    }

    // Set remote description (answer)
    async setRemoteDescription(description) {
        try {
            await this.peerConnection.setRemoteDescription(description);
        } catch (error) {
            console.error('Error setting remote description:', error);
            throw error;
        }
    }

    // Create and set local description (answer)
    async createAnswer() {
        try {
            const answer = await this.peerConnection.createAnswer();
            await this.peerConnection.setLocalDescription(answer);
            return answer;
        } catch (error) {
            console.error('Error creating answer:', error);
            throw error;
        }
    }

    // Add ICE candidate
    async addIceCandidate(candidate) {
        try {
            await this.peerConnection.addIceCandidate(candidate);
        } catch (error) {
            console.error('Error adding ICE candidate:', error);
            throw error;
        }
    }

    // Close the peer connection
    close() {
        console.log('Closing peer connection');
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        // if (this.localStream) {
        //     this.localStream.getTracks().forEach(track => track.stop());
        //     this.localStream = null;
        // }
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => track.stop());
            this.remoteStream = null;
        }
    }
}

export default WebRTCService; 