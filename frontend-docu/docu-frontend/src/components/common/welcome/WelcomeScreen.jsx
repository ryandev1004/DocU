import { useNavigate } from "react-router";


const WelcomeScreen = () => {
    const navigate = useNavigate();
    

    const navigateSignIn = () => {
        navigate('/login');
    }

    const navigateSignUp = () => {
        navigate('/register');
    }

    return (
            
        <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-4">
            <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col items-center">
                   <h2 className="flex items-center text-white text-2xl font-semibold">
                        DocU📄
                    </h2>
                    <p className="text-white/70">We make college essays a <i>little</i> more enjoyable.</p> 
                </div>
                <div className="flex items-stretch justify-between w-full max-w-2xl gap-6">
                    <div className="bg-white rounded-lg px-12 py-14 hover:shadow-lg transition-shadow flex-1 text-center flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Register</h3>
                            <p className="text-gray-600 text-sm mb-4">I want to start formatting!</p>
                        </div>    
                        <button 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-5 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg cursor-pointer"
                        onClick={navigateSignUp}
                        >
                            Create Account
                        </button>
                    </div>
                    <div className="bg-white rounded-lg px-12 py-14 hover:shadow-lg transition-shadow flex-1 text-center flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sign In</h3>
                            <p className="text-gray-600 text-sm mb-4">I want to get back to formatting!</p>
                        </div>
                        <button 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-5 rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg cursor-pointer"
                        onClick={navigateSignIn}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </div>     
    );
}
 
export default WelcomeScreen;