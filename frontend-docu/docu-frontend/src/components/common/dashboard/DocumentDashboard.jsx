import { Plus } from 'lucide-react';
import Header from "./Header";
import CreateDocumentModal from './CreateDocumentModal';
import DocumentCard from './DocumentCard';
import { useState, useEffect } from 'react';
import { useAuthenticationStore } from '../../../stores/authentication-store';
import { dashboardService } from '../../../api/dashboard-service';

const DocumentDashboard = () => {
    const currentUser = useAuthenticationStore(state => state.currentUser);
    const isAuthenticated = useAuthenticationStore(state => state.isAuthenticated);
    const fetchAccount = useAuthenticationStore(state => state.fetchAccount);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);

    // Fetch user data if authenticated but there's no user data saved in our store
    useEffect(() => {
        const initUser = async () => {
            if (isAuthenticated && !currentUser) {
                console.log('Authenticated but no user data, fetching account...');
                try {
                    await fetchAccount();
                } catch (error) {
                    console.error('Failed to fetch account:', error);
                }
            }
            setUserLoading(false);
        };
        
        initUser();
    }, [isAuthenticated, currentUser, fetchAccount]);

    // Fetch documents ONLY when the user is fully loaded in.
    useEffect(() => {
        if (!userLoading && currentUser?.userId) {
            fetchDocuments();
        } else if (!userLoading) {
            setLoading(false);
        }
    }, [userLoading, currentUser]);

    const fetchDocuments = async () => {
        try {
            setLoading(true);
            if (!currentUser?.userId) {
                console.log('No user available');
                return;
            }
            
            const fetchedDocuments = await dashboardService.getDocuments(currentUser.userId);
            setDocuments(fetchedDocuments || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateDocument = async (document) => {
        try {
            if (!currentUser?.userId) {
                console.error('User not authenticated');
                return;
            }
            await dashboardService.createDocument(currentUser.userId, document);
            await fetchDocuments(); // Refresh the document list
            console.log('Created document:', document);
        } catch (e) {
            console.error('Error creating document:', e);
        }
    };

    const handleDownload = async (docId) => {
        try {
            if (!currentUser?.userId) {
                console.error('User not authenticated');
                return;
            }
            const document = documents.find(doc => doc.docId === docId);
            await dashboardService.loadDocument(currentUser.userId, docId, document?.title);
        } catch (e) {
            console.error('Error downloading document:', e);
        }
    };

    const handleDelete = async (docId) => {
        try {
            if (window.confirm('Are you sure you want to delete this document?')) {
                await dashboardService.deleteDocument(docId);
                setDocuments(prev => prev.filter(doc => doc.docId !== docId));
                console.log('Deleted document:', docId);
            }
        } catch (e) {
            console.error('Error deleting document:', e);
        }
    };

    if (userLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <p className="text-white text-lg">Loading user data...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <p className="text-white text-lg">Please log in to view your documents.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-700 to-gray-800">
            <Header />
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-600 p-6">
                    <div className="mb-8 flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white">My Documents</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                        >
                            <Plus size={20} />
                            <span>Create New Document</span>
                        </button>
                    </div>
                    <div className="flex flex-col gap-6">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                <p className="text-gray-400 mt-4">Loading documents...</p>
                            </div>
                        ) : documents.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">No documents found.</p>
                                <p className="text-gray-500 mt-2">Create your first document to get started!</p>
                            </div>
                        ) : (
                            documents.map((document) => (
                                <DocumentCard
                                    key={document.docId}
                                    document={document}
                                    onDownload={handleDownload}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <CreateDocumentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreateDocument={handleCreateDocument}
            />
        </div>
    );
}

export default DocumentDashboard;