import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { accountService } from '../api/account-service';

export const useAuthenticationStore = create(
    persist(
        (set, get) => ({
            currentAccount: undefined,
            currentUser: undefined,
            username: "",
            isAuthenticated: false,
            authError: null, // Track auth errors
            
            getCurrentAccount: () => get().currentAccount,
            getCurrentUser: () => get().currentUser,
            
            // Login with username and password
            login: async (username, password) => {
                try {
                    set({ authError: null });
                    const response = await accountService.login(username, password);
                    
                    if (response?.success) {
                        await get().fetchAccount();
                        set({ 
                            isAuthenticated: true,
                            username: username,
                            authError: null
                        });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Login failed:', error);
                    set({ authError: error.response?.status });
                    return false;
                }
            },
            
            // Fetch account details from backend
            fetchAccount: async () => {
                try {
                    set({ authError: null });
                    const currentAccount = await accountService.getAccount();
                    if (currentAccount) {
                        set({ 
                            currentAccount,
                            currentUser: currentAccount.user,
                            username: currentAccount.username,
                            isAuthenticated: true,
                            authError: null
                        });
                        return true;
                    }
                    return false;
                } catch (error) {
                    console.error('Failed to fetch account:', error);
                    const status = error.response?.status;
                    set({ 
                        authError: status,
                        isAuthenticated: status !== 401 ? get().isAuthenticated : false
                    });
                    
                    // If 401, clear everything
                    if (status === 401) {
                        get().clearStore();
                    }
                    return false;
                }
            },
            
            // Check if user is authenticated (verifies cookie with backend)
            checkAuthentication: async () => {
                try {
                    set({ authError: null });
                    const response = await accountService.attemptAuthenticatedRequest();
                    const authenticated = response?.authenticated || false;
                    
                    if (authenticated) {
                        // If authenticated but don't have user data, fetch it
                        if (!get().currentAccount) {
                            const fetchSuccess = await get().fetchAccount();
                            if (!fetchSuccess) {
                                return false;
                            }
                        }
                        set({ isAuthenticated: true, authError: null });
                        return true;
                    } else {
                        // Not authenticated, clear everything
                        get().clearStore();
                        return false;
                    }
                } catch (error) {
                    console.error('Authentication check failed:', error);
                    const status = error.response?.status;
                    set({ authError: status });
                    
                    // If 401, definitely not authenticated
                    if (status === 401) {
                        get().clearStore();
                        return false;
                    }
                    
                    // For other errors, might still be authenticated
                    return get().isAuthenticated;
                }
            },
            
            // Logout user
            logout: async () => {
                try {
                    await accountService.logout();
                } catch (error) {
                    console.error('Logout failed:', error);
                } finally {
                    get().clearStore();
                }
            },
            
            // Set current user
            setCurrentUser: (user) => set({ currentUser: user }),
            
            // Clear all store data
            clearStore: () => set({
                currentUser: undefined,
                currentAccount: undefined,
                username: "",
                isAuthenticated: false,
                authError: null,
            }),
            
            // Check if user is logged in
            isLoggedIn: () => get().isAuthenticated,
            
            // Get auth error
            getAuthError: () => get().authError,
        }),
        {
            name: 'authentication-store',
            partialize: (state) => ({ 
                username: state.username,
                isAuthenticated: state.isAuthenticated,
                currentAccount: state.currentAccount,
                currentUser: state.currentUser
            }),
        }
    )
);