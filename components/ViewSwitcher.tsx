
import React from 'react';

type View = 'manual' | 'image';

interface ViewSwitcherProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, onViewChange }) => {
  const getButtonClasses = (view: View) => {
    const baseClasses = "px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors duration-200 w-full";
    if (currentView === view) {
      return `${baseClasses} bg-cyan-600 text-white focus:ring-cyan-500`;
    }
    return `${baseClasses} bg-slate-700 text-slate-300 hover:bg-slate-600 focus:ring-slate-500`;
  };

  return (
    <div className="flex space-x-2 p-1 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <button onClick={() => onViewChange('manual')} className={getButtonClasses('manual')}>
        攝影企劃
      </button>
      <button onClick={() => onViewChange('image')} className={getButtonClasses('image')}>
        分析參考照
      </button>
    </div>
  );
};

export default ViewSwitcher;