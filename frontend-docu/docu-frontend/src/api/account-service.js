import { api } from '../util/axios';

export const accountService = {
    attemptAuthenticatedRequest: async () => {
        try {
            const response = await api.get('/account/authenticated');
            return {
                authenticated: response.data.authenticated
            };
        } catch (error) {
            // Re-throw to let store handle it
            if (error.response?.status === 401) {
                return { authenticated: false };
            }
            throw error;
        }  
    },

    createAccount: async (username, password) => {
        try {
            const accountCreateDTO = {
                username: username,
                password: password,
                user: {
                    username: username
                }
            };
            const response = await api.post('/account', accountCreateDTO);
            return {
                username: response.data.username,
                user: response.data.user
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to create account');
        }
    },

    login: async (username, password) => {
        try {
            const accountLoginRequestDTO = {
                username: username,
                password: password
            };
            await api.post('account/login', accountLoginRequestDTO);
            return { success: true };
        } catch (error) {
            console.error('Login API error:', error);
            throw error; // Re-throw to let caller handle
        }
    },
    
    getAccount: async () => {
        try {
            const response = await api.get('/account');
            return {
                username: response.data.username,
                user: response.data.user
            }
        } catch (error) {
            console.log("Error getting account:", error);
            throw error; // Re-throw to let store handle it
        }
    },

    getAccountUser: async () => {
        try {
            const response = await api.get('/account/user');
            return {
                userId: response.data.userId,
                username: response.data.username,
                documents: response.data.documents
            }
        } catch (error) {
            console.log("Error getting account user:", error);
            throw error; // Re-throw to let store handle it
        }
    },

    logout: async () => {
        try {
            await api.post('/account/logout');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};