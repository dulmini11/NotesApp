import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, noteTitle }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  // Theme-based styling
  const overlayClass = theme === 'dark'
    ? 'bg-black/70'
    : 'bg-black/50';

  const modalClass = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl border-gray-700'
    : 'bg-white/95 backdrop-blur-xl border-gray-200';

  const titleClass = theme === 'dark'
    ? 'text-gray-100'
    : 'text-gray-800';

  const textClass = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-600';

  const accentClass = theme === 'dark'
    ? 'text-amber-400'
    : 'text-amber-600';

  const cancelButtonClass = theme === 'dark'
    ? 'bg-gray-700/80 hover:bg-gray-600 text-gray-200 border border-gray-600'
    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300';

  const deleteButtonClass = theme === 'dark'
    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-amber-900/30'
    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/30';

  const iconBgClass = theme === 'dark'
    ? 'bg-amber-900/40'
    : 'bg-amber-100';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 ${overlayClass} backdrop-blur-sm transition-opacity animate-in fade-in duration-200`}
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${modalClass} animate-in zoom-in-95 duration-200 overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-full ${iconBgClass}`}>
              <Trash2 className={`w-5 h-5 ${accentClass}`} />
            </div>
            <h3 className={`text-lg font-bold ${titleClass}`}>
              Move to Trash
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-all duration-200 ${
              theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-2">
          <p className={`text-sm ${textClass}`}>
            Are you sure you want to move <span className={`font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>"{noteTitle || 'Untitled'}"</span> to trash?
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5">
          <button
            onClick={onClose}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 ${cancelButtonClass}`}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl ${deleteButtonClass}`}
          >
            Move to Trash
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;