
import React, { useState, useEffect, useRef } from 'react';
import { ConversationItem, ImageModel } from '../types';

interface GenerationViewProps {
    imageUrl: string | null;
    conversation: ConversationItem[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    error: string | null;
    imageModel: ImageModel;
    onBackToSettings: () => void;
    onRefineWithImagen: () => void;
    isRefining: boolean;
    onImageSelectFromHistory: (imageUrl: string) => void; // New prop
}

const GenerationView: React.FC<GenerationViewProps> = ({ imageUrl, conversation, onSendMessage, isLoading, error, imageModel, onBackToSettings, onRefineWithImagen, isRefining }) => {
    const [message, setMessage] = useState('');
    const [photographyPlanInstruction, setPhotographyPlanInstruction] = useState('');
    const conversationEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversation]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleDownloadImage = () => {
        if (imageUrl) {
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'generated_image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    return (
        <div className="container mx-auto p-4 flex flex-col h-[calc(100vh-70px)]">
            <div className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
                {/* Image Display */}
                <div className="md:w-2/3 lg:w-3/4 bg-slate-950/50 rounded-lg flex items-center justify-center p-4 relative border border-slate-800">
                    {imageUrl ? (
                        <>
                            <img src={imageUrl} alt="Generated Art" className="max-w-full max-h-full object-contain rounded-md" />
                            <button
                                onClick={handleDownloadImage}
                                className="absolute top-4 right-4 p-2 bg-slate-700/70 rounded-full text-white hover:bg-slate-600/70 transition-colors duration-200"
                                title="下載圖片"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        </>
                    ) : (
                        <div className="text-slate-500">正在等待第一張圖像生成...</div>
                    )}
                    {(isLoading && conversation.length > 1 || isRefining) && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center rounded-lg">
                            <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-white">
                                {isRefining ? '正在用 Imagen 4.0 精修...' : '正在生成新圖像...'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Conversation Panel */}
                <div className="md:w-1/3 lg:w-1/4 bg-slate-800/60 rounded-lg flex flex-col p-4 border border-slate-700/60">
                     <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
                        <h3 className="text-lg font-semibold text-cyan-400">現場溝通</h3>
                        <button
                            onClick={onBackToSettings}
                            className="text-sm text-slate-300 hover:text-cyan-400 hover:bg-slate-700/50 px-3 py-1 rounded-md transition-colors duration-200 flex items-center space-x-1.5"
                            aria-label="返回攝影企劃"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                            </svg>
                            <span>返回企劃</span>
                        </button>
                    </div>
                    {/* Photography Plan Instruction Input */}
                    <div className="mb-4">
                        <h4 className="text-md font-semibold text-slate-300 mb-2">攝影計畫書指令</h4>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={photographyPlanInstruction}
                                onChange={(e) => setPhotographyPlanInstruction(e.target.value)}
                                placeholder="新增攝影計畫書指令..."
                                className="flex-grow bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-150"
                                disabled={isLoading || isRefining}
                            />
                            <button
                                onClick={() => {
                                    if (photographyPlanInstruction.trim()) {
                                        onSendMessage(`[攝影計畫書] ${photographyPlanInstruction}`);
                                        setPhotographyPlanInstruction('');
                                    }
                                }}
                                disabled={isLoading || isRefining || !photographyPlanInstruction.trim()}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                新增指令
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">此欄位用於新增對 AI 模型更宏觀、更具策略性的攝影計畫指令。</p>
                        <p className="text-xs text-slate-400">例如：「請確保所有生成圖像都帶有復古電影感」或「模特兒的眼神需始終保持憂鬱」。</p>
                    </div>
                    <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                        {conversation.map((item, index) => (
                            <div key={index} className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {item.role === 'user' && item.text && (
                                    <div className="bg-cyan-600 text-white rounded-lg py-2 px-4 max-w-xs break-words">
                                        {item.text}
                                    </div>
                                )}
                                {item.role === 'model' && (
                                     <div className="bg-slate-700 rounded-lg p-2 max-w-xs space-y-2 flex flex-col">
                                        {item.text && (
                                            <p className="text-white px-2 py-1 break-words">{item.text}</p>
                                        )}
                                        {item.imageUrl && (
                                            <img
                                                src={item.imageUrl}
                                                alt={`Generated image ${index}`}
                                                className="rounded cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => onImageSelectFromHistory(item.imageUrl!)}
                                            />
                                        )}
                                     </div>
                                )}
                            </div>
                        ))}
                        <div ref={conversationEndRef} />
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-slate-700">
                        <form onSubmit={handleFormSubmit}>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="向模特兒下指令..."
                                    className="flex-grow bg-slate-700/50 border border-slate-600 rounded-md px-3 py-2 text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition duration-150"
                                    disabled={isLoading || isRefining}
                                />
                                <button type="submit" disabled={isLoading || isRefining || !message.trim()} className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    發送
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={onRefineWithImagen}
                            disabled={isLoading || isRefining || !imageUrl}
                            className="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isRefining ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    精修中...
                                </>
                            ) : (
                                <>
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    用 Imagen 4.0 精修
                                </>
                            )}
                        </button>
                        {imageModel === 'imagen-4.0-generate-001' && (
                            <div className="text-center text-xs text-slate-400 p-2 mt-3 bg-slate-700/50 rounded-md">
                               提示：您正使用 Gemini Flash 微調由 Imagen 4.0 生成的圖像，風格可能略有不同。
                            </div>
                        )}
                         {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerationView;