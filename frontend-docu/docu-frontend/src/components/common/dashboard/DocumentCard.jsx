import { Download, Trash2 } from 'lucide-react';

const DocumentCard = ({ document, onDownload, onDelete }) => {
    return ( 
        <div className="bg-stone-50/85 border-2 border-gray-500 rounded-lg p-4">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold">
                        {document.title}
                    </h3>
                    <p>
                        {document.date}
                    </p> 
                </div>
                <div className="flex flex-col gap-4 items-center">
                   <div className={`${document.format === 'APA' ? 'bg-green-300/50 border-green-300' : 'bg-orange-300/50 border-orange-300'} rounded-2xl px-2 py-1 m-1`}>
                        <p className="text-sm">
                            {document.format}
                        </p> 
                    </div>
                    <div className="flex flex-row gap-3">
                        <button 
                        className="text-gray-500/40 hover:text-black cursor-pointer"
                        onClick={() => onDownload(document.docId)}
                        >
                            <Download size={20}/>
                        </button> 
                        <button 
                        className="text-red-500/50 hover:text-red-500 cursor-pointer"
                        onClick={() => onDelete(document.docId)}
                        >
                            <Trash2 size={20}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default DocumentCard;