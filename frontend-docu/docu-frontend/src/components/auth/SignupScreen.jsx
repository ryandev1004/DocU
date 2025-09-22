import { useRef, useState } from "react";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { accountService } from "../../api/account-service";
import { Link, useNavigate } from "react-router";

const SignupScreen = () => {
    const userRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmPasswordRef = useRef(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [formValid, setFormValid] = useState(false);


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

    const handleCreateAccount = async () => {
        const username = userRef.current?.value.trim();
        const password = passwordRef.current?.value;
        const confirmPassword = confirmPasswordRef.current?.value;

        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            confirmPasswordRef.current.value = '';
            return;
        }

        try {
            setIsLoading(true);
            const result = await accountService.createAccount(username, password);;
            console.log('Account created:', result);
            userRef.current.value = '';
            passwordRef.current.value = '';
            confirmPasswordRef.current.value = '';
            navigate('/login');
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'Failed to create account. Please try again.');
        } finally {
            setIsLoading(false);
            
        }
    };

    return ( 
         <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl shadow-2xl pl-[2rem] pr-[2rem] pt-[2rem] pb-[1rem] w-full max-w-2xl backdrop-blur-sm border border-white/20">
                    <div className="text-center mb-5">
                        <h1 className="text-3xl font-bold text-gray-800 mb-10">Create Account</h1>
                    </div>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl">
                            {error}
                        </div>
                    )}
                    
                    <div className="mb-5 flex flex-col space-y-3">
                        <input 
                            type="text"
                            id="username"
                            ref={userRef}
                            onChange={checkFormValidity}
                            className="w-full px-4 py-2 mb-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Enter your username"
                            disabled={isLoading}
                        />
                        <div className="relative">
                            <input 
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            ref={passwordRef}
                            onChange={checkFormValidity} 
                            className="w-full px-4 py-2 pr-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Enter your password"
                            disabled={isLoading}
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            disabled={isLoading}
                            >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <input 
                            type={showPassword ? 'text' : 'password'}
                            ref={confirmPasswordRef}
                            onChange={checkFormValidity} 
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            placeholder="Confirm your password"
                            disabled={isLoading}
                        />
                        <p className="text-sm text-gray-500 text-left">
                            Use at least 6 characters, do not use empty spaces
                        </p>
                        <div className="flex w-full justify-end mt-5">
                            <button
                            type="button"
                            onClick={handleCreateAccount}
                            disabled={isLoading || !formValid}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
                                {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <button className="text-blue-600 hover:text-blue-800 font-semibold cursor-pointer">
                                    <Link to='/login'>LOGIN</Link>
                                </button>
                            </p>
                        </div>
                    </div>
               </div>
         </div>
     );
}
 
export default SignupScreen;