import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Pin, Calendar, MoreVertical, Lock, Archive } from "lucide-react"; // Added Archive import
import axios from "axios";

const NoteCard = ({ note, onPin, onDelete, onLock, onArchive }) => { // Added onArchive prop
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

  // Handle Archive function
  const handleArchive = async (e) => {
    e.stopPropagation();
    try {
      await axios.put(`http://localhost:8800/note/${note.idNote}/archive`, {
        isArchived: !note.isArchived,
      });
      if (onArchive) onArchive(note.idNote, !note.isArchived);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to safely render HTML content
  const renderHTMLContent = (html) => {
    if (!html) return { __html: "No description provided." };
    
    // Create a temporary div to parse and style the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Apply styles to lists to ensure they display properly
    const lists = tempDiv.querySelectorAll('ul, ol');
    lists.forEach(list => {
      if (list.tagName === 'UL') {
        list.style.listStyleType = 'disc';
      } else if (list.tagName === 'OL') {
        list.style.listStyleType = 'decimal';
      }
      list.style.marginLeft = '24px';
      list.style.paddingLeft = '8px';
      list.style.marginTop = '8px';
      list.style.marginBottom = '8px';
    });
    
    // Apply styles to list items
    const listItems = tempDiv.querySelectorAll('li');
    listItems.forEach(li => {
      li.style.marginBottom = '4px';
      li.style.display = 'list-item';
    });
    
    // Apply heading styles
    const headings = tempDiv.querySelectorAll('h1, h2, h3, h4');
    headings.forEach(heading => {
      if (heading.tagName === 'H1') {
        heading.style.fontSize = '1rem';
        heading.style.fontWeight = 'bold';
      } else if (heading.tagName === 'H2') {
        heading.style.fontSize = '1rem';
        heading.style.fontWeight = 'bold';
      } else if (heading.tagName === 'H3') {
        heading.style.fontSize = '1rem';
        heading.style.fontWeight = 'bold';
      } else if (heading.tagName === 'H4') {
        heading.style.fontSize = '1rem';
        heading.style.fontWeight = 'bold';
      }
    });
    
    // Apply styles to formatted text
    const boldElements = tempDiv.querySelectorAll('b, strong');
    boldElements.forEach(el => {
      el.style.fontWeight = 'bold';
    });
    
    const italicElements = tempDiv.querySelectorAll('i, em');
    italicElements.forEach(el => {
      el.style.fontStyle = 'italic';
    });
    
    const underlineElements = tempDiv.querySelectorAll('u');
    underlineElements.forEach(el => {
      el.style.textDecoration = 'underline';
    });
    
    return { __html: tempDiv.innerHTML };
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 hover:-translate-y-2 flex flex-col cursor-pointer"
      onClick={() => navigate(`/view/${note.idNote}`)}
    >
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-2 relative">
          <h2 className="text-base md:text-lg font-bold text-gray-800 line-clamp-2 hover:text-green-600 transition-colors pr-2">
            {capitalizeFirst(note.title)}
          </h2>

          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {Boolean(note.isPinned) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPin(note.idNote, note.isPinned);
                }}
                className="flex items-center justify-center p-1.5 md:p-2 rounded-3xl shadow-md transition-all duration-200 transform hover:scale-105 bg-yellow-400 text-white hover:bg-yellow-500"
              >
                <Pin className="w-3 h-3 text-white" />
              </button>
            )}

            {/* Three-dot menu */}
            <div className="relative">
              <button
                onClick={toggleMenu}
                className="p-1.5 md:p-2 rounded-full hover:bg-gray-200 transition-colors"
              >
                <MoreVertical className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-700" />
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-36 md:w-40 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 py-1 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Show PIN inside menu ONLY if NOT pinned */}
                  {!note.isPinned && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPin(note.idNote, note.isPinned);
                        setShowMenu(false);
                      }}
                      className="group w-full text-left px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 flex items-center gap-2.5 md:gap-3.5 relative overflow-hidden"
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 hover:bg-gray-400 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                        <Pin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 hover:scale-110 transition-transform duration-200" />
                      </div>
                      <span className="font-semibold text-amber-900">Pin Note</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-400/0 via-gray-400/5 to-gray-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  )}
                  
                  {/* Archive button in menu */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleArchive(e);
                      setShowMenu(false);
                    }}
                    className="group w-full text-left px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 flex items-center gap-2.5 md:gap-3.5 relative overflow-hidden"
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 hover:bg-gray-400 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                      <Archive className={`w-3 h-3 md:w-4 md:h-4 ${note.isArchived ? 'text-blue-500' : 'text-gray-400'} hover:scale-110 transition-transform duration-200`} />
                    </div>
                    <span className="font-semibold text-amber-900">
                      {note.isArchived ? "Unarchive Note" : "Archive Note"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-400/0 via-gray-400/5 to-gray-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onLock(note.idNote);
                      setShowMenu(false);
                    }}
                    className="group w-full text-left px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200 flex items-center gap-2.5 md:gap-3.5 relative overflow-hidden"
                  >
                    <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-200 hover:bg-gray-400 flex items-center justify-center transition-all duration-200 group-hover:scale-110">
                      <Lock className="w-3 h-3 md:w-4 md:h-4 text-gray-400 hover:scale-110 transition-transform duration-200" />
                    </div>
                    <span className="font-semibold text-amber-900">Lock Note</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-400/0 via-gray-400/5 to-gray-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Description - Using dangerouslySetInnerHTML to render HTML */}
        <div 
          className="text-sm text-gray-600 mb-3 line-clamp-1 flex-gown note-description"
          dangerouslySetInnerHTML={renderHTMLContent(note.desc)}
        />
        
        <span className="inline-block bg-gradient-to-r from-green-100 to-green-100 text-green-700 text-xs font-semibold px-2 md:px-3 py-1 rounded-full mb-3 w-fit">
          {capitalizeFirst(note.category)}
        </span>
        
        <div className="flex items-center text-xs text-gray-500 mb-4">
          <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 mr-1 md:mr-1.5 flex-shrink-0" />
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
            className="flex-1 bg-gradient-to-r from-[#0ad128] to-[#188529] hover:from-[#22cb0b] hover:to-[#1c930c] text-white text-xs font-bold py-2 px-2 md:py-2.5 md:px-3 rounded-xl text-center shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Edit
          </Link>

          {/* Archive Button - ADDED BEFORE DELETE */}
          <button
            onClick={handleArchive}
            className={`flex-1 text-xs font-bold py-2 px-2 md:py-2.5 md:px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105
              ${note.isArchived 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' 
                : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 hover:from-gray-300 hover:to-gray-400'}`}
          >
            {note.isArchived ? 'Unarchive' : 'Archive'}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.idNote);
            }}
            className="flex-1 bg-gradient-to-r from-amber-950 to-red-900 hover:from-amber-950 hover:to-amber-900 text-white text-xs font-bold py-2 px-2 md:py-2.5 md:px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;