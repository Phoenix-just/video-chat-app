require('dotenv').config();
const Turn = require('node-turn');

// Create a new TURN server instance
const server = new Turn({
  // Set the listening port
  listeningPort: 3478,
  // Set the relay port range
  relayPorts: [49152, 65535],
  // Set the authentication credentials
  authMech: 'long-term',
  credentials: {
    // Replace these with your desired username and password
    username: process.env.TURN_USERNAME,
    password: process.env.TURN_PASSWORD
  }
});

// Start the server
server.start();

console.log('TURN server is running on port 3478');
console.log('Username: ', process.env.TURN_USERNAME);
console.log('Password: ', process.env.TURN_PASSWORD);

// Handle server errors
server.on('error', (error) => {
  console.error('TURN server error:', error);
});

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('Shutting down TURN server...');
  server.stop();
  process.exit(0);
}); 