import { Room } from '../models/Room.js';

class RoomService {
    constructor() {
        this.rooms = new Map();
    }

    createRoom() {
        const id = Math.random().toString(36).substring(2, 15);
        const room = new Room(id);
        this.rooms.set(id, room);
        return room;
    }

    getRoom(roomId) {
        return this.rooms.get(roomId);
    }

    deleteRoom(roomId) {
        return this.rooms.delete(roomId);
    }

    getAllRooms() {
        return Array.from(this.rooms.values());
    }

    isUserInRoom(userId) {
        const rooms = this.getAllRooms();
        console.log('rooms', rooms);
        return rooms.find(room => room.participants.has(userId));
    }
    
    getRoomWithSingleParticipant() {
        const rooms = this.getAllRooms();
        return rooms.find(room => room.participants.size <= 1);
    }

    addParticipant(userId) {
        const currentRoom = this.isUserInRoom(userId);
        console.log('currentRoom', currentRoom);
        if (currentRoom) {
            this.removeParticipant(userId);
        }
        
        const room = this.getRoomWithSingleParticipant() || this.createRoom();
        room.participants.add(userId);

        return { roomId: room.id, currentRoomId: currentRoom?.id};
    }

    removeParticipant(userId) {
        const rooms = this.getAllRooms();
        rooms.forEach(room => {
            room.participants.delete(userId);
        });
    }
}

export const roomService = new RoomService(); 