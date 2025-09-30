import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080/api', 
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Simple response interceptor - just for logging, doesn't redirect
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log errors for debugging
        if (error.response) {
            console.error('API Error:', {
                status: error.response.status,
                url: error.config?.url,
                data: error.response.data
            });
        }
        
        // Just pass the error along, let components handle it
        return Promise.reject(error);
    }
);