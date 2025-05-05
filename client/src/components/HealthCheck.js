import { useEffect, useState } from 'react';
import { apiService } from '../services/api.service';

const HealthCheck = () => {
    const [healthStatus, setHealthStatus] = useState('');

    useEffect(() => {
        const checkHealth = async () => {
            try {
                const data = await apiService.getHealth();
                setHealthStatus(data.message || 'API is healthy');
            } catch (error) {
                setHealthStatus('Error connecting to API');
            }
        };

        checkHealth();
    }, []);

    return (
        <div>
            <h2>API Health Status</h2>
            <p>{healthStatus}</p>
        </div>
    );
};

export default HealthCheck; 