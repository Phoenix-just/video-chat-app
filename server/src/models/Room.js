export class Room {
    constructor(id) {
        this.id = id;
        this.participants = new Set();
        this.createdAt = new Date();
    }

    addParticipant(userId) {
        this.participants.add(userId);
    }

    removeParticipant(userId) {
        this.participants.delete(userId);
    }

    getParticipants() {
        return Array.from(this.participants);
    }
} 