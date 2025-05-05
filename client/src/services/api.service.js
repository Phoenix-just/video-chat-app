const API_BASE_URL = process.env.SERVER_URL;

export const apiService = {
    async getHealth() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/health`);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
}; 