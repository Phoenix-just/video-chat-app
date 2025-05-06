# TURN Server for WebRTC

This is a TURN server implementation for WebRTC applications. It helps establish peer-to-peer connections when direct connections are not possible due to NAT/firewall restrictions.

## Prerequisites

- Node.js (v12 or higher)
- npm (Node Package Manager)

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Before running the server, make sure to update the following settings in `server.js`:

- `realm`: Your domain name
- `username`: Your desired username
- `password`: Your desired password

## Running the Server

Start the server with:
```bash
npm start
```

The server will run on port 3478 by default.

## Using with WebRTC

To use this TURN server in your WebRTC application, configure your ICE servers as follows:

```javascript
const iceServers = [
  {
    urls: 'turn:your-server-ip:3478',
    username: 'your-username',
    credential: 'your-password'
  }
];

const peerConnection = new RTCPeerConnection({ iceServers });
```

## Security Considerations

1. Always use strong passwords
2. Consider implementing additional security measures like TLS
3. Monitor server usage and implement rate limiting if necessary

## License

MIT 