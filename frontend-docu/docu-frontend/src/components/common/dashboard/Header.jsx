import { CircleUser, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

const Header = () => {

    const [toggle, setToggle] = useState(false);

    return ( 
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-600 px-6 py-4 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">
                DocU 📄
                </h1>
            </div>
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <button 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white cursor-pointer"
                    onClick={() => setToggle(!toggle)}
                    >
                    <CircleUser size={32}/>  
                    </button>

                    {toggle && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10">
                            <div className="py-2">
                                <button 
                                className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                                onClick={() => setToggle(false)}
                                >
                                    <LogOut size={16} className="mr-3" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </header> 
);
}
 
export default Header;