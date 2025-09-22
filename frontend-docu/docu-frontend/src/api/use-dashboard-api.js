import { api } from '../util/axios';
import { useApiConfig } from './use-api-config';

export const useDashboardApi = () => {

    const apiConfig = useApiConfig();

    const createDocument = async (userId, documentCreateDTO) => {
        try {
            const response = await api.post(`/document/generate/${userId}`, documentCreateDTO, {
                ...apiConfig,
                responseType: 'blob' 
            });
            
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
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    };


}