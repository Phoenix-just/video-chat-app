import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import healthRoutes from '../routes/healthRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/api', healthRoutes);

// Create HTTP server
const server = http.createServer(app);

// Socket.IO configuration
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

export { app, server, io }; 