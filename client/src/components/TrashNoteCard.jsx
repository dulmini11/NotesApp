import React from "react";
import { Calendar, RotateCcw, Trash2 } from "lucide-react";

const TrashNoteCard = ({ note, onRestore, onPermanentDelete }) => {
  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-red-200 p-4 flex flex-col">
      <h2 className="text-lg font-bold text-gray-800 mb-2">
        {capitalizeFirst(note.title)}
      </h2>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {capitalizeFirst(note.desc)}
      </p>

      <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full w-fit mb-3">
        {capitalizeFirst(note.category)}
      </span>

      <div className="flex items-center text-xs text-gray-500 mb-4">
        <Calendar className="w-3.5 h-3.5 mr-1.5" />
        {new Date(note.createdAt).toLocaleDateString()}
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => onRestore(note.idNote)}
          className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2 rounded-lg"
        >
          <RotateCcw className="w-4 h-4" />
          Restore
        </button>

        <button
          onClick={() => onPermanentDelete(note.idNote)}
          className="flex-1 flex items-center justify-center gap-1 bg-red-700 hover:bg-red-800 text-white text-xs font-bold py-2 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

export default TrashNoteCard;