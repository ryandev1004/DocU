import { api } from '../util/axios';

export const accountService = {
    // Will ping the api call on the backend that's protected by it's security config and will only return true if user has token.
    attemptAuthenticatedRequest: async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            };
            const response = await api.get('/account/authenticated', config);
            return {
                authenticated: response.data.authenticated
            };
        } catch {
            return undefined;
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
            const response = await api.post('account/login', accountLoginRequestDTO);
            return {
                token: response.data.token
            }
        } catch (error) {
            console.error('Login API error:', error);
            return null; // Return null instead of undefined for failed login
        }
    },
    
    getAccount: async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            };
            const response = await api.get('/account', config);
            return {
                username: response.data.username,
                user: response.data.user
            }
        } catch (e) {
            console.log("Error getting account user: ", e);
            return null;
        }
    },

    getAccountUser: async (token) => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                }
            };
            const response = await api.get('/account/user', config);
            return {
                userId: response.data.userId,
                username: response.data.username,
                documents: response.data.documents
            }
        } catch (e) {
            console.log("Error getting account user: ", e);
            return null;
        }
    }
};