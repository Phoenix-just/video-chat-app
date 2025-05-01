class WebRTCService {
    constructor() {
        // Configuration for STUN/TURN servers
        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                // Add TURN servers here if needed for NAT traversal
            ]
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

            // Set up event handlers for ICE candidates
            this.peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    // Send the ICE candidate to the remote peer
                    console.log('New ICE candidate:', event.candidate);
                    // You'll need to implement sending this to the remote peer
                }
            };

            // Handle incoming tracks from remote peer
            this.peerConnection.ontrack = (event) => {
                console.log('Received remote track:', event.track);
                if (!this.remoteStream) {
                    this.remoteStream = new MediaStream();
                }
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
        if (this.peerConnection) {
            this.peerConnection.close();
            this.peerConnection = null;
        }
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }
        if (this.remoteStream) {
            this.remoteStream.getTracks().forEach(track => track.stop());
            this.remoteStream = null;
        }
    }
}

export default WebRTCService; 