import { io } from 'socket.io-client';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.roomId = null;
    }

    connect() {
        console.log('Environment variables:', process.env);
        console.log('Server URL:', process.env.REACT_APP_SERVER_URL);
        this.socket = io(process.env.REACT_APP_SERVER_URL, {
            transports: ['websocket'],
            headers: {
                'skip_zrok_interstitial': '1',
                'ngrok-skip-browser-warning': '1'
            },
            autoConnect: true
        });

        this.socket.on('connect', () => {
            console.log('Connected to server');
            this.isConnected = true; 
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.isConnected = false;
        });

        this.socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }
}

export default SocketService;
