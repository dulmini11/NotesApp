import React from "react";
import { Calendar, RotateCcw, Trash2 } from "lucide-react";

const TrashNoteCard = ({ note, onRestore, onPermanentDelete }) => {
  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="group relative bg-gradient-to-br from-red-100 to-orange-50 rounded-2xl shadow-lg border-2 border-red-600 p-5 flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-red-300 overflow-hidden h-full">
      {/* Decorative corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-red-300 opacity-30 rounded-bl-full"></div>
      
      {/* Trash icon watermark */}
      <Trash2 className="absolute top-3 right-3 w-12 h-12 text-red-500 opacity-20 group-hover:opacity-30 transition-opacity" />
      
      <div className="relative z-10 flex flex-col h-full">
        <h2 className="text-xl font-extrabold text-red-600 mb-2 pr-12 leading-tight">
          {capitalizeFirst(note.title)}
        </h2>

        <p className="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed flex-grow">
          {capitalizeFirst(note.desc)}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1.5 rounded-full font-semibold shadow-sm">
            {capitalizeFirst(note.category)}
          </span>
          
          <div className="flex items-center text-xs text-gray-600 bg-white/60 px-2.5 py-1 rounded-full">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {new Date(note.createdAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onRestore(note.idNote)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xs font-bold py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <RotateCcw className="w-4 h-4" />
            Restore
          </button>

          <button
            onClick={() => onPermanentDelete(note.idNote)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs font-bold py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
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