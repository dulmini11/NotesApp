import React from "react";
import { Calendar, RotateCcw, Trash2 } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

const TrashNoteCard = ({ note, onRestore, onPermanentDelete }) => {
  const { theme } = useTheme();

  // Theme-based styling
  const cardBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-red-900 to-orange-900/20'
    : 'bg-gradient-to-br from-red-100 to-orange-50';

  const cardBorderClass = theme === 'dark'
    ? 'border-red-700 hover:border-red-500'
    : 'border-red-600 hover:border-red-300';

  const titleTextClass = theme === 'dark'
    ? 'text-red-400'
    : 'text-red-600';

  const descriptionTextClass = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-700';

  const categoryBgClass = theme === 'dark'
    ? 'bg-gradient-to-r from-red-600 to-orange-600'
    : 'bg-gradient-to-r from-red-500 to-orange-500';

  const dateBgClass = theme === 'dark'
    ? 'bg-gray-800/60 text-gray-400'
    : 'bg-white/60 text-gray-600';

  const watermarkIconClass = theme === 'dark'
    ? 'text-red-600/20 group-hover:text-red-600/30'
    : 'text-red-500/20 group-hover:text-red-500/30';

  const accentBgClass = theme === 'dark'
    ? 'bg-red-700/30'
    : 'bg-red-300/30';

  const restoreBtnBgClass = theme === 'dark'
    ? 'from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600'
    : 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700';

  const deleteBtnBgClass = theme === 'dark'
    ? 'from-red-700 to-rose-800 hover:from-red-600 hover:to-rose-700'
    : 'from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800';

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className={`group relative rounded-2xl shadow-lg border-2 p-5 flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden h-full ${cardBgClass} ${cardBorderClass}`}>
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full ${accentBgClass}`}></div>
      
      {/* Trash icon watermark */}
      <Trash2 className={`absolute top-3 right-3 w-12 h-12 transition-opacity ${watermarkIconClass}`} />
      
      <div className="relative z-10 flex flex-col h-full">
        <h2 className={`text-xl font-extrabold mb-2 pr-12 leading-tight ${titleTextClass}`}>
          {capitalizeFirst(note.title)}
        </h2>

        <p className={`text-sm mb-4 line-clamp-3 leading-relaxed flex-grow ${descriptionTextClass}`}>
          {capitalizeFirst(note.desc)}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs text-white px-3 py-1.5 rounded-full font-semibold shadow-sm ${categoryBgClass}`}>
            {capitalizeFirst(note.category)}
          </span>
          
          <div className={`flex items-center text-xs px-2.5 py-1 rounded-full ${dateBgClass}`}>
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onRestore(note.idNote)}
            className={`flex-1 flex items-center justify-center gap-2 bg-gradient-to-r text-white text-xs font-bold py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${restoreBtnBgClass}`}
          >
            <RotateCcw className="w-4 h-4" />
            Restore
          </button>

          <button
            onClick={() => onPermanentDelete(note.idNote)}
            className={`flex-1 flex items-center justify-center gap-2 bg-gradient-to-r text-white text-xs font-bold py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 ${deleteBtnBgClass}`}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrashNoteCard;