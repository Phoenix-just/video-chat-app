import { app, server, io } from './config/server.js';
import { handleSocketConnection } from './controllers/socketController.js';
import config from './config/config.js';

// Socket.IO connection handling
io.on('connection', handleSocketConnection);

// Start the server
const PORT = config.server.port;
server.listen(PORT, () => {
    console.log(`Server is running in ${config.server.env} mode on port ${PORT}`);
}); 