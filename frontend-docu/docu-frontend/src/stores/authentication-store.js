import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { accountService } from '../api/account-service';

export const useAuthenticationStore = create(
    persist(
        (set, get) => ({
            currentAccount: undefined,
            currentUser: undefined,
            token: "",
            username: "",
            password: "",
            
            getCurrentAccount: () => get().currentAccount,
            getCurrentUser: () => get().currentUser,
            getCurrentToken: () => get().token,
            
            login: async () => {
                const { username, password } = get();
                try {
                    const tokenResponse = await accountService.login(username, password);
                    
                    if (tokenResponse?.token && tokenResponse.token !== 'Failed') {
                        set({ token: tokenResponse.token });
                        await get().fetchAccount();
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Login failed:', error);
                    return false;
                }
            },
            
            fetchAccount: async () => {
                try {
                    const { token } = get();
                    const currentAccount = await accountService.getAccount(token);
                    if (currentAccount) {
                        set({ 
                            currentAccount,
                            currentUser: currentAccount.user 
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch account:', error);
                }
            },
            
            isAuthenticated: async () => {
                const { token } = get();
                if (!token) return false;
                
                try {
                    const response = await accountService.attemptAuthenticatedRequest(token);
                    return !!(response?.authenticated);
                } catch {
                    return false;
                }
            },
            
            setToken: (jwt) => set({ token: jwt }),
            setCredentials: (username, password) => set({ username, password }),
            setCurrentUser: (user) => set({ currentUser: user }),
            clearStore: () => set({
                token: "",
                currentUser: undefined,
                currentAccount: undefined,
                username: "",
                password: "",
            }),
            logout: () => get().clearStore(),
            isLoggedIn: () => !!get().token,
        }),
        {
            name: 'authentication-store',
            partialize: (state) => ({ 
                token: state.token,
                currentAccount: state.currentAccount,
                currentUser: state.currentUser 
            }),
        }
    )
);