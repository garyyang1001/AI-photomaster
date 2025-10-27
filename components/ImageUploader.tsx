
import React, { useCallback, useState } from 'react';

interface ImageUploaderProps {
    onImageSelect: (file: File | null) => void;
    onGenerate: () => void;
    isLoading: boolean;
    error: string | null;
    selectedImage: File | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, onGenerate, isLoading, error, selectedImage }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (file: File | null) => {
        if (file && file.type.startsWith('image/')) {
            onImageSelect(file);
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            onImageSelect(null);
            setPreviewUrl(null);
        }
    };
    
    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleFileChange(e.target.files?.[0] || null);
    };

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files?.[0] || null);
    }, []);


    return (
        <div className="mt-4 p-4 md:p-6 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-200 ${isDragging ? 'border-cyan-400 bg-slate-700/50' : 'border-slate-600'}`}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={onFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="上傳圖片"
                />
                
                {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-h-64 rounded-md object-contain" />
                ) : (
                    <div className="text-center text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm">
                            <span className="font-semibold text-cyan-400">點擊上傳</span> 或拖曳檔案到此處
                        </p>
                        <p className="text-xs">支援 PNG, JPG, GIF，檔案上限 10MB</p>
                    </div>
                )}
            </div>
            
            <div className="mt-6 flex flex-col items-center">
                <button
                    onClick={onGenerate}
                    disabled={!selectedImage || isLoading}
                    className="w-full max-w-xs px-6 py-3 text-base font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isLoading ? (
                        <>
                           <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            分析中...
                        </>
                    ) : '從圖片生成'}
                </button>
                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            </div>
        </div>
    );
};

export default ImageUploader;
