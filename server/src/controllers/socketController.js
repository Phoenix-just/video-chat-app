import { io } from "../config/server.js";
import {roomService} from "../services/roomService.js";

export const handleSocketConnection = (socket) => {
    console.log('A user connected');

    socket.on('startVideoChat', () => {
        const roomId = roomService.addParticipant(socket.id);
        if (roomId.currentRoomId) {
            socket.leave(roomId.currentRoomId);
        }
        socket.join(roomId.roomId);
        io.to(socket.id).emit('roomJoined', roomId);
        console.log(`User joined room: `, roomId, socket.id);
    });

    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
}; 