
import React, { useState, useEffect } from 'react';
import { PromptSection } from '../types';

interface OutputPanelProps {
  promptText: string;
  promptSections: PromptSection[];
  onSectionClick: (group: string) => void;
  onReset: () => void;
  onRandomize: () => void;
  onSaveRecipe: () => void;
  onGenerateImage: () => void;
  onUpdatePromptText: (newText: string) => void;
  isGenerating: boolean;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ promptText, promptSections, onSectionClick, onReset, onRandomize, onSaveRecipe, onGenerateImage, onUpdatePromptText, isGenerating }) => {
  const [copyButtonText, setCopyButtonText] = useState('複製提示詞');
  const [editablePromptText, setEditablePromptText] = useState(promptText);

  useEffect(() => {
    setEditablePromptText(promptText);
  }, [promptText]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopyButtonText('已複製！');
    setTimeout(() => {
      setCopyButtonText('複製提示詞');
    }, 2000);
  };

  return (
    <div className="bg-slate-800/60 rounded-lg shadow-2xl border border-slate-700/60 p-4 md:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
        <h3 className="text-xl font-semibold text-cyan-400">攝影計畫書</h3>
        <div className="flex space-x-2">
            <button
                onClick={onReset}
                className="px-3 py-1.5 text-sm font-medium text-slate-300 bg-slate-700 rounded-md hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors duration-200"
            >
                重設
            </button>
            <button
                onClick={onRandomize}
                className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600/80 rounded-md hover:bg-indigo-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors duration-200"
            >
                給我靈感
            </button>
             <button
                onClick={onSaveRecipe}
                className="px-3 py-1.5 text-sm font-medium text-white bg-sky-600/80 rounded-md hover:bg-sky-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors duration-200"
            >
                儲存配方
            </button>
        </div>
      </div>
      <textarea
        className="flex-grow bg-slate-900/70 rounded-md p-2 font-mono text-sm text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[300px] focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        value={editablePromptText}
        onChange={(e) => {
          setEditablePromptText(e.target.value);
          onUpdatePromptText(e.target.value);
        }}
        rows={10} // Adjust rows as needed
      ></textarea>
       <div className="mt-4 pt-4 border-t border-slate-700 flex items-center space-x-2">
         <button
            onClick={handleCopy}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-cyan-600/80 rounded-md hover:bg-cyan-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors duration-200 disabled:opacity-50"
            disabled={copyButtonText === '已複製！'}
        >
            {copyButtonText}
        </button>
        <button
            onClick={onGenerateImage}
            disabled={isGenerating}
            className="w-full px-6 py-2 text-base font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-emerald-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
            {isGenerating ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    拍攝中...
                </>
            ) : '開始拍攝'}
        </button>
      </div>
    </div>
  );
};

export default OutputPanel;
