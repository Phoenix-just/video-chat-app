const API_BASE_URL = 'https://video-chat-app-3y1a.onrender.com/api';

export const apiService = {
    async getHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/health`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}; 