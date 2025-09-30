import { useRef, useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Link, useNavigate } from "react-router";
import { useAuthenticationStore } from '../../stores/authentication-store';

const LoginScreen = () => {
    const userRef = useRef(null);
    const passwordRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const authenticationStore = useAuthenticationStore();
    const [formValid, setFormValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const checkFormValidity = () => {
        const username = userRef.current?.value.trim();
        const password = passwordRef.current?.value;
        
        const isValid = username && 
                       password && 
                       password.length >= 6 && 
                       !password.includes(' ');
        
        setFormValid(isValid);
    };

    const handleLogin = async () => {
        const username = userRef.current?.value;
        const password = passwordRef.current?.value;

        try {
            setIsLoading(true);
            setError('');
            
            const loginSuccess = await authenticationStore.login(username, password);
            
            if (loginSuccess) {
                console.log('Login Success!');
                navigate('/dashboard');
            } else {
                const authError = authenticationStore.getAuthError();
                if (authError === 401) {
                    setError('Invalid username or password');
                } else {
                    setError('Login failed. Please try again.');
                }
            }
        } catch (e) {
            console.error('Login ERROR!', e);
            if (e.response?.status === 401) {
                setError('Invalid username or password');
            } else {
                setError('An error occurred during login. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return ( 
    <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md backdrop-blur-sm border border-white/20">
            <div className="text-center mb-5">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">DocU📄</h1>
                <p className="text-gray-600">Please sign in to your account</p>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                        Username
                    </label>
                    <input 
                        type="text"
                        id="user"
                        ref={userRef}
                        onChange={checkFormValidity} 
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Enter your username"
                        disabled={isLoading}
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            ref={passwordRef}
                            onChange={checkFormValidity} 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Enter your password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 mt-3 text-gray-400 hover:text-gray-600"
                            disabled={isLoading}
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    disabled={isLoading || !formValid}
                >
                    <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                </button>
            </div>
            <div className="mt-2 text-center">
                <p className="text-gray-600">
                    Don't have an account?{' '}
                    <button className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
                        <Link to='/register'>CREATE ACCOUNT</Link>
                    </button>
                </p>
            </div>
        </div>
    </div>
    );
}
 
export default LoginScreen;