import { Navigate, useLocation } from "react-router";
import { useAuthenticationStore } from '../../stores/authentication-store';
import { useEffect, useState } from 'react';

const Authorization = ({children, redirectTo = "/login"}) => {
    const auth = useAuthenticationStore();
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);
    const [shouldRedirect, setShouldRedirect] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const isAuthenticated = await auth.checkAuthentication();
                
                if (!isMounted) return;

                if (!isAuthenticated) {
                    console.log('Not authenticated, redirecting to login');
                    setShouldRedirect(true);
                }
            } catch (error) {
                console.error('Authorization check error:', error);
                
                if (!isMounted) return;

                // Any error during auth check should redirect to login
                setShouldRedirect(true);
            } finally {
                if (isMounted) {
                    setIsChecking(false);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [location.pathname]); // Re-check when route changes

    // Periodic auth check while on protected routes
    useEffect(() => {
        if (!isChecking && auth.isLoggedIn()) {
            const intervalId = setInterval(async () => {
                const isStillAuthenticated = await auth.checkAuthentication();
                if (!isStillAuthenticated) {
                    console.log('Session expired, redirecting to login');
                    setShouldRedirect(true);
                }
            }, 60000); // Check every minute

            return () => clearInterval(intervalId);
        }
    }, [isChecking, auth.isLoggedIn()]);

    if (isChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    if (shouldRedirect || !auth.isLoggedIn()) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    return children;
}
 
export default Authorization;