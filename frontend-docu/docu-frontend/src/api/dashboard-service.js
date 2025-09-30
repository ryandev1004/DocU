import { api } from '../util/axios';

export const dashboardService = {
    createDocument: async (userId, documentCreateDTO) => {
        try {
            const response = await api.post(
                `/document/generate/${userId}`, 
                documentCreateDTO, 
                {
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${documentCreateDTO.title || 'document'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (e) {
            console.error('Error creating document:', e);
            throw e;
        }
    },

    loadDocument: async (userId, docId, title) => {
        try {
            const response = await api.get(
                `/document/generate/${userId}/${docId}`, 
                {
                    responseType: 'blob'
                }
            );
            
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${title || 'document'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            return { success: true };
        } catch (e) {
            console.error('Error loading document:', e);
            throw e;
        }
    },

    getDocuments: async (userId) => {
        try {
            const response = await api.get(`/document/user/${userId}`);
            return response.data;
        } catch (e) {
            console.error('Error fetching documents:', e);
            throw e;
        }
    },

    deleteDocument: async (docId) => {
        try {
            const response = await api.delete(`/document/${docId}`);
            return { success: true };
        } catch (e) {
            console.error('Error deleting document:', e);
            throw e;
        }
    }
};