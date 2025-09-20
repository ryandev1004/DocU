import { Navigate, useLocation } from "react-router";
import { useAuthenticationStore } from '../../stores/authentication-store';

const Authorization = ({children, redirectTo = "/login"}) => {
    const auth = useAuthenticationStore();
    const location = useLocation();

    if(!auth.isLoggedIn()) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />
    }

    return children;
}
 
export default Authorization;