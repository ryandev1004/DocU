import { useState } from 'react';
import { Plus, FileText, Calendar, X, User, School, BookOpen, Minus } from 'lucide-react';

const CreateDocumentModal = ({ isOpen, onClose, onCreateDocument }) => {
    const [formData, setFormData] = useState({
        title: '',
        name: '',
        professorName: '',
        classTitle: '',
        instituteName: '',
        bodyText: '',
        date: '',
        citations: [''],
        format: 'MLA',
        fileType: 'PDF'
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCitationChange = (index, value) => {
        const newCitations = [...formData.citations];
        newCitations[index] = value;
        setFormData(prev => ({
            ...prev,
            citations: newCitations
        }));
    };

    const addCitation = () => {
        setFormData(prev => ({
            ...prev,
            citations: [...prev.citations, '']
        }));
    };

    const removeCitation = (index) => {
        if (formData.citations.length > 1) {
            const newCitations = formData.citations.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                citations: newCitations
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.format || !formData.fileType) return;

        const newDocument = {
            title: formData.title,
            name: formData.name,
            professorName: formData.professorName,
            classTitle: formData.classTitle,
            instituteName: formData.instituteName,
            bodyText: formData.bodyText,
            date: formData.date || new Date().toISOString().split('T')[0],
            citations: formData.citations.filter(citation => citation.trim()),
            format: formData.format,
            fileType: formData.fileType,
        };

        onCreateDocument?.(newDocument);
        
        // Reset form
        setFormData({
            title: '',
            name: '',
            professorName: '',
            classTitle: '',
            instituteName: '',
            bodyText: '',
            date: '',
            citations: [''],
            format: 'MLA',
            fileType: 'PDF'
        });
        
        onClose();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    const formats = [
        { value: 'MLA', label: 'MLA Format' },
        { value: 'APA', label: 'APA Format' },
    ];

    const fileTypes = [
        { value: 'PDF', label: 'PDF Document', icon: FileText },

    ];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
            <div 
                className="min-h-full flex items-start justify-center p-4"
                onClick={handleBackdropClick}
            >
                <div 
                    className="bg-gray-900 rounded-xl border border-gray-600 w-full max-w-4xl my-8 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                        <Plus size={20} />
                        <span>Create New Document</span>
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <FileText size={16} className="inline mr-2" />
                                Document Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                placeholder="Enter document title"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <User size={16} className="inline mr-2" />
                                Student Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter student name"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <User size={16} className="inline mr-2" />
                                Professor Name
                            </label>
                            <input
                                type="text"
                                value={formData.professorName}
                                onChange={(e) => handleInputChange('professorName', e.target.value)}
                                placeholder="Enter professor name"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <BookOpen size={16} className="inline mr-2" />
                                Class Title
                            </label>
                            <input
                                type="text"
                                value={formData.classTitle}
                                onChange={(e) => handleInputChange('classTitle', e.target.value)}
                                placeholder="Enter class title"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <School size={16} className="inline mr-2" />
                                Institute Name
                            </label>
                            <input
                                type="text"
                                value={formData.instituteName}
                                onChange={(e) => handleInputChange('instituteName', e.target.value)}
                                placeholder="Enter institute name"
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                <Calendar size={16} className="inline mr-2" />
                                Date
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => handleInputChange('date', e.target.value)}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Body Text
                        </label>
                        <textarea
                            value={formData.bodyText}
                            onChange={(e) => handleInputChange('bodyText', e.target.value)}
                            placeholder="Enter the main content of your document. Use blank lines to separate paragraphs."
                            rows={10}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors resize-vertical font-mono text-sm leading-relaxed"
                        />
                        <p className="text-xs text-gray-400 mt-2">
                            <strong>Tip:</strong> Use blank lines between paragraphs. Our system will automatically format these as separate paragraphs with proper indentation based on your selected format (MLA/APA get indented, others don't).
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Citations
                        </label>
                        <div className="space-y-3">
                            {formData.citations.map((citation, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={citation}
                                            onChange={(e) => handleCitationChange(index, e.target.value)}
                                            placeholder="Enter citation here"
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                                        />
                                    </div>
                                    {formData.citations.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeCitation(index)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                            title="Remove citation"
                                        >
                                            <Minus size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addCitation}
                                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 hover:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors"
                            >
                                <Plus size={16} />
                                <span>Add Another Citation</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Format *
                            </label>
                            <div className="space-y-2">
                                {formats.map((format) => (
                                    <label
                                        key={format.value}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                            formData.format === format.value
                                                ? 'border-blue-500 bg-blue-500/10'
                                                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="format"
                                            value={format.value}
                                            checked={formData.format === format.value}
                                            onChange={(e) => handleInputChange('format', e.target.value)}
                                            className="sr-only"
                                        />
                                        <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                                            formData.format === format.value
                                                ? 'border-blue-500'
                                                : 'border-gray-400'
                                        }`}>
                                            {formData.format === format.value && (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            )}
                                        </div>
                                        <span className={`font-medium ${
                                            formData.format === format.value ? 'text-white' : 'text-gray-200'
                                        }`}>
                                            {format.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                File Type *
                            </label>
                            <div className="space-y-2">
                                {fileTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    return (
                                        <label
                                            key={type.value}
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                                                formData.fileType === type.value
                                                    ? 'border-blue-500 bg-blue-500/10'
                                                    : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="fileType"
                                                value={type.value}
                                                checked={formData.fileType === type.value}
                                                onChange={(e) => handleInputChange('fileType', e.target.value)}
                                                className="sr-only"
                                            />
                                            <IconComponent 
                                                size={16} 
                                                className={`mr-3 ${
                                                    formData.fileType === type.value ? 'text-blue-400' : 'text-gray-400'
                                                }`} 
                                            />
                                            <span className={`font-medium ${
                                                formData.fileType === type.value ? 'text-white' : 'text-gray-200'
                                            }`}>
                                                {type.label}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleSubmit(e);
                            }}
                            disabled={!formData.title.trim() || !formData.format || !formData.fileType}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                        >
                            <Plus size={16} />
                            <span>Create Document</span>
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateDocumentModal;