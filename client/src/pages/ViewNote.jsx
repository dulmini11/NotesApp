import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";

const ViewNote = () => {
  const { theme } = useTheme(); // Get current theme
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const noteId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/note/${noteId}`);
        setNote(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

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
        heading.style.fontSize = '1.875rem';
        heading.style.fontWeight = 'bold';
        heading.style.marginBottom = '1rem';
        heading.style.marginTop = '1.5rem';
      } else if (heading.tagName === 'H2') {
        heading.style.fontSize = '1.5rem';
        heading.style.fontWeight = 'bold';
        heading.style.marginBottom = '0.75rem';
        heading.style.marginTop = '1.25rem';
      } else if (heading.tagName === 'H3') {
        heading.style.fontSize = '1.25rem';
        heading.style.fontWeight = 'bold';
        heading.style.marginBottom = '0.5rem';
        heading.style.marginTop = '1rem';
      } else if (heading.tagName === 'H4') {
        heading.style.fontSize = '1.125rem';
        heading.style.fontWeight = 'bold';
        heading.style.marginBottom = '0.5rem';
        heading.style.marginTop = '0.75rem';
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

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await axios.delete(`http://localhost:8800/note/${noteId}`);
      navigate("/allnotes");
    } catch (err) {
      console.log(err);
    }
  };

  // Theme-based classes
  const mainBgClass = theme === 'dark' 
    ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
    : 'bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50';

  const cardBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-800 to-gray-900'
    : 'bg-white/80';

  const cardBorderClass = theme === 'dark'
    ? 'border-gray-700'
    : 'border-green-100';

  const coverBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-700/20 to-gray-900/20'
    : 'bg-gradient-to-br from-[#22cb0b]/10 via-green-50 to-[#0a7e04]/10';

  const categoryBgClass = theme === 'dark'
    ? 'bg-gray-700 text-green-300'
    : 'bg-green-100 text-[#0a7e04]';

  const titleGradientClass = theme === 'dark'
    ? 'bg-gradient-to-r from-green-300 to-green-500'
    : 'bg-gradient-to-r from-[#0a7e04] to-[#22cb0b]';

  const textColorClass = theme === 'dark'
    ? 'text-gray-300'
    : 'text-gray-700';

  const metaTextClass = theme === 'dark'
    ? 'text-gray-400'
    : 'text-gray-500';

  const backButtonBgClass = theme === 'dark'
    ? 'bg-gray-800 text-green-300 hover:bg-green-900 hover:text-white border-gray-700'
    : 'bg-white text-[#0a7e04] hover:bg-[#22cb0b] hover:text-white border-green-200';

  const editButtonClass = theme === 'dark'
    ? 'text-green-300 border-green-700 hover:bg-gray-700'
    : 'text-[#0a7e04] border-green-100 hover:bg-green-50';

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${mainBgClass} transition-colors duration-300`}>
        <div className={`w-16 h-16 border-4 ${
          theme === 'dark' ? 'border-green-400' : 'border-[#22cb0b]'
        } border-t-transparent rounded-full animate-spin`}></div>
      </div>
    );
  }

  if (!note) return null;

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${mainBgClass}`}>
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/allnotes")}
            className={`group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl shadow transition-all border ${backButtonBgClass}`}
          >
            <svg
              className="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to notes
          </button>
        </div>

        {/* Main Card */}
        <div className={`relative backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden ${cardBgClass} ${cardBorderClass}`}>
          
          {/* Enhanced Glow Effect */}
          <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-20 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-gray-700 to-green-900/50' 
              : 'bg-gradient-to-r from-green-200 to-emerald-200'
          }`}></div>

          {/* Cover Image - FIXED VERSION */}
          {note.cover ? (
            <div className={`w-full h-64 ${coverBgClass}`}>
              {!imageError ? (
                <img
                  src={note.cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <svg className={`w-16 h-16 ${
                    theme === 'dark' ? 'text-red-500/40' : 'text-red-500/40'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className={`mt-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Image failed to load
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className={`w-full h-48 flex items-center justify-center ${coverBgClass}`}>
              <svg className={`w-16 h-16 ${
                theme === 'dark' ? 'text-green-500/40' : 'text-[#22cb0b]/40'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Content */}
          <div className="relative p-8 md:p-12">

            {/* Category Badge */}
            {note.category && (
              <div className={`inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-sm font-semibold ${categoryBgClass}`}>
                {note.category}
              </div>
            )}

            {/* Title */}
            <h1 className={`text-4xl md:text-5xl font-black bg-clip-text text-transparent mb-6 ${titleGradientClass}`}>
              {note.title || "Untitled"}
            </h1>

            {/* Description - Render HTML content */}
            <div 
              className={`leading-relaxed mb-10 prose max-w-none ${textColorClass}`}
              style={{
                lineHeight: '1.6',
                fontSize: '16px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}
              dangerouslySetInnerHTML={renderHTMLContent(note.desc)}
            />

            {/* Footer */}
            <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-green-100'
            }`}>
              <span className={`text-xs ${metaTextClass}`}>
                Created on {new Date(note.createdAt || Date.now()).toLocaleDateString()}
              </span>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/update/${noteId}`)}
                  className={`px-6 py-3 font-semibold rounded-xl transition ${editButtonClass}`}
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="flex-1 bg-gradient-to-r from-amber-950 to-red-900 hover:from-amber-950 hover:to-amber-900 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Delete
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNote;