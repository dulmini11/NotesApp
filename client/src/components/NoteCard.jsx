import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pin, Calendar, MoreVertical } from "lucide-react";

const NoteCard = ({ note, onPin, onDelete, onLock }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const capitalizeFirst = (text) => {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const toggleMenu = (e) => {
    e.stopPropagation(); // prevent card click
    setShowMenu((prev) => !prev);
  };

  const handleLockClick = (e) => {
    e.stopPropagation();
    setShowMenu(false);
    onLock(note.idNote);
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-2 flex flex-col cursor-pointer"
      onClick={() => navigate(`/view/${note.idNote}`)}
    >
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-2 relative">
          <h2 className="text-lg font-bold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
            {capitalizeFirst(note.title)}
          </h2>

          <div className="flex items-center gap-2">
            {/* Existing PIN button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPin(note.idNote, note.isPinned);
              }}
              className={`flex items-center justify-center p-2 rounded-3xl shadow-md transition-all duration-200 transform hover:scale-105 ${
                note.isPinned
                  ? "bg-yellow-400 text-white hover:bg-yellow-500"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              <Pin
                className={`w-3 h-3 ${
                  note.isPinned ? "text-white" : "text-gray-800"
                }`}
              />
            </button>

            {/* Three-dot menu */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-700" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <button
                    onClick={handleLockClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    🔒 Lock
                  </button>
                  {/* Add more menu options here if needed */}
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-grow">
          {capitalizeFirst(note.desc)}
        </p>
        <span className="inline-block bg-gradient-to-r from-green-100 to-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
          {capitalizeFirst(note.category)}
        </span>
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          {new Date(note.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/update/${note.idNote}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 bg-gradient-to-r from-[#0ad128] to-[#188529] hover:from-[#22cb0b] hover:to-[#1c930c] text-white text-xs font-bold py-2.5 px-3 rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Edit
          </Link>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.idNote);
            }}
            className="flex-1 bg-gradient-to-r from-amber-950 to-red-900 hover:from-amber-950 hover:to-amber-900 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;