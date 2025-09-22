import { Plus, FileText, Calendar } from 'lucide-react';
import Header from "./Header";

const DocumentDashboard = () => {
    return (  
        <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800"> 
            <Header/>
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-600 p-6">
                    <div className="mb-8 flex justify-end">
                        <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                            <Plus size={20} />
                            <span>Create New Document</span>
                        </button>
                    </div>
                </div>
            </div>
        </div> 
    );
}
 
export default DocumentDashboard;