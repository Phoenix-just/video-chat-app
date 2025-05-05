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
        console.log('joined room')
        io.to(socket.id).emit('data', { type: 'roomJoined', roomData: roomId });
  
        if (roomId.roomFilled) {
            console.log('roomFilled');
            socket.to(roomId.roomId).emit('data', { type: 'roomFilled' });
        }
        console.log(`User joined room: `, roomId, socket.id);
    });

    socket.on('offer', (offer) => {
        socket.to(offer.roomId).emit('data', { type: 'offer', offer: offer.offer });
    });
    socket.on('answer', (answer) => {
        socket.to(answer.roomId).emit('data', { type: 'answer', answer: answer.answer });
    });
    socket.on('ice-candidate', (candidate) => {
        socket.to(candidate.roomId).emit('data', { type: 'ice-candidate', candidate: candidate.candidate });
    });

    socket.on('leave-room', (roomId) => {
        socket.leave(roomId);
        console.log(`User left room: ${roomId}`);
    });

    socket.on('disconnect', () => {
        const userRoom = roomService.isUserInRoom(socket.id);
        if (userRoom) {
            roomService.removeParticipantFromRoom(userRoom, socket.id);
            socket.to(userRoom.id).emit('data', { type: 'roomVacated' });
        }
        console.log('User disconnected', userRoom);
    });
}; 