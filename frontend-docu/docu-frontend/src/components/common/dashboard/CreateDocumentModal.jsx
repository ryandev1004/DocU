import { useState, useCallback, useMemo, memo } from 'react';
import { Plus, FileText, Calendar, X, User, School, BookOpen, Minus } from 'lucide-react';

const FormInput = memo(({ 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    className = "w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
}) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
    />
));

FormInput.displayName = 'FormInput';

const CitationItem = memo(({ citation, index, onChange, onRemove, canRemove }) => (
    <div className="flex items-center space-x-3">
        <div className="flex-1">
            <FormInput
                value={citation}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder="Enter citation here"
            />
        </div>
        {canRemove && (
            <button
                type="button"
                onClick={() => onRemove(index)}
                className="p-2 text-red-400 hover:text-red-300 rounded-lg"
                title="Remove citation"
            >
                <Minus size={16} />
            </button>
        )}
    </div>
));

CitationItem.displayName = 'CitationItem';

const RadioOption = memo(({ value, checked, onChange, label, icon: Icon }) => (
    <label
        className={`flex items-center p-3 rounded-lg border cursor-pointer ${
            checked
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
        }`}
    >
        <input
            type="radio"
            value={value}
            checked={checked}
            onChange={onChange}
            className="sr-only"
        />
        {Icon && (
            <Icon 
                size={16} 
                className={`mr-3 ${checked ? 'text-blue-400' : 'text-gray-400'}`} 
            />
        )}
        {!Icon && (
            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                checked ? 'border-blue-500' : 'border-gray-400'
            }`}>
                {checked && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
            </div>
        )}
        <span className={`font-medium ${checked ? 'text-white' : 'text-gray-200'}`}>
            {label}
        </span>
    </label>
));

RadioOption.displayName = 'RadioOption';

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

    const handleInputChange = useCallback((field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    const handleCitationChange = useCallback((index, value) => {
        setFormData(prev => ({
            ...prev,
            citations: prev.citations.map((c, i) => i === index ? value : c)
        }));
    }, []);

    const addCitation = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            citations: [...prev.citations, '']
        }));
    }, []);

    const removeCitation = useCallback((index) => {
        setFormData(prev => ({
            ...prev,
            citations: prev.citations.filter((_, i) => i !== index)
        }));
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.format || !formData.fileType) return;

        const newDocument = {
            ...formData,
            date: formData.date || new Date().toISOString().split('T')[0],
            citations: formData.citations.filter(citation => citation.trim())
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
    }, [formData, onCreateDocument, onClose]);

    const handleBackdropClick = useCallback((e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    // Format Static Data
    const formats = useMemo(() => [
        { value: 'MLA', label: 'MLA Format' },
        { value: 'APA', label: 'APA Format' },
    ], []);

    const fileTypes = useMemo(() => [
        { value: 'PDF', label: 'PDF Document', icon: FileText },
    ], []);

    // Submit button
    const isSubmitDisabled = useMemo(() => 
        !formData.title.trim() || !formData.format || !formData.fileType,
        [formData.title, formData.format, formData.fileType]
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/75 z-50 overflow-y-auto">
            <div 
                className="min-h-full flex items-start justify-center p-4"
                onClick={handleBackdropClick}
            >
                <div 
                    className="bg-gray-900 rounded-xl border border-gray-600 w-full max-w-4xl my-8 shadow-2xl transform-gpu will-change-transform"
                    onClick={(e) => e.stopPropagation()}
                    style={{ 
                        transform: 'translateZ(0)',
                        backfaceVisibility: 'hidden' 
                    }}
                >
                    <div className="flex items-center justify-between p-6 border-b border-gray-700">
                        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                            <Plus size={20} />
                            <span>Create New Document</span>
                        </h2>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6" style={{ contain: 'layout style paint' }}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <FileText size={16} className="inline mr-2" />
                                    Document Title *
                                </label>
                                <FormInput
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    placeholder="Enter document title"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <User size={16} className="inline mr-2" />
                                    Student Name
                                </label>
                                <FormInput
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    placeholder="Enter student name"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <User size={16} className="inline mr-2" />
                                    Professor Name
                                </label>
                                <FormInput
                                    value={formData.professorName}
                                    onChange={(e) => handleInputChange('professorName', e.target.value)}
                                    placeholder="Enter professor name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <BookOpen size={16} className="inline mr-2" />
                                    Class Title
                                </label>
                                <FormInput
                                    value={formData.classTitle}
                                    onChange={(e) => handleInputChange('classTitle', e.target.value)}
                                    placeholder="Enter class title"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <School size={16} className="inline mr-2" />
                                    Institute Name
                                </label>
                                <FormInput
                                    value={formData.instituteName}
                                    onChange={(e) => handleInputChange('instituteName', e.target.value)}
                                    placeholder="Enter institute name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    <Calendar size={16} className="inline mr-2" />
                                    Date
                                </label>
                                <FormInput
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => handleInputChange('date', e.target.value)}
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
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-vertical font-mono text-sm leading-relaxed"
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
                                    <CitationItem
                                        key={index}
                                        citation={citation}
                                        index={index}
                                        onChange={handleCitationChange}
                                        onRemove={removeCitation}
                                        canRemove={formData.citations.length > 1}
                                    />
                                ))}
                                <button
                                    type="button"
                                    onClick={addCitation}
                                    className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 px-3 py-2 rounded-lg"
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
                                        <RadioOption
                                            key={format.value}
                                            value={format.value}
                                            checked={formData.format === format.value}
                                            onChange={(e) => handleInputChange('format', e.target.value)}
                                            label={format.label}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    File Type *
                                </label>
                                <div className="space-y-2">
                                    {fileTypes.map((type) => (
                                        <RadioOption
                                            key={type.value}
                                            value={type.value}
                                            checked={formData.fileType === type.value}
                                            onChange={(e) => handleInputChange('fileType', e.target.value)}
                                            label={type.label}
                                            icon={type.icon}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500 rounded-lg font-medium cursor-poiinter"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled}
                                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center space-x-2 cursor-poiinter"
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