import React, { forwardRef } from 'react';

interface InputGroupProps {
  title: string;
  children: React.ReactNode;
  isLocked?: boolean;
  onToggleLock?: (title: string) => void;
}

const InputGroup = forwardRef<HTMLDivElement, InputGroupProps>(({ title, children, isLocked, onToggleLock }, ref) => (
  <div ref={ref} className="bg-slate-800/50 rounded-lg p-4 md:p-6 mb-6 shadow-lg border border-slate-700/50 transition-shadow duration-300">
    <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-2">
      <h3 className="text-xl font-semibold text-cyan-400">{title}</h3>
      {onToggleLock && (
        <button 
          onClick={() => onToggleLock(title)} 
          className={`p-1.5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 ${isLocked ? 'text-cyan-400 hover:bg-cyan-400/10 focus:ring-cyan-500' : 'text-slate-400 hover:bg-slate-700 focus:ring-slate-500'}`}
          aria-label={isLocked ? `Unlock ${title}` : `Lock ${title}`}
        >
          {isLocked ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
          )}
        </button>
      )}
    </div>
    <div className={`grid grid-cols-1 ${title !== '創作管理' ? 'md:grid-cols-2' : ''} gap-x-6 gap-y-4`}>
      {children}
    </div>
  </div>
));

export default InputGroup;