import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../contexts/ThemeContext";

const Add = () => {
  const { theme } = useTheme(); // Get current theme
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    category: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("p");

  // Theme-based classes - EXACTLY SAME AS ADD PAGE ORIGINAL
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

  const coverEmptyBgClass = theme === 'dark'
    ? 'bg-gradient-to-br from-gray-700/20 to-gray-900/20'
    : 'bg-gradient-to-br from-[#22cb0b]/10 via-green-50 to-[#0a7e04]/10';

  const categoryIconClass = theme === 'dark'
    ? 'bg-gradient-to-br from-green-500 to-green-700'
    : 'bg-gradient-to-br from-[#22cb0b] to-[#0a7e04]';

  const toolbarBgClass = theme === 'dark'
    ? 'bg-gray-700/50 border-gray-600'
    : 'bg-green-50/50 border-green-100';

  const toolbarButtonClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-600 hover:bg-gray-700 text-gray-200'
    : 'bg-white border-green-200 hover:bg-green-100 text-black';

  const editorBgClass = theme === 'dark'
    ? 'hover:bg-gray-700/50 text-gray-200'
    : 'hover:bg-green-50 text-gray-800';

  const tipBgClass = theme === 'dark'
    ? 'bg-blue-900/30 border-blue-800'
    : 'bg-blue-50 border-blue-100';

  const tipTextClass = theme === 'dark'
    ? 'text-blue-300'
    : 'text-blue-700';

  const backButtonBgClass = theme === 'dark'
    ? 'bg-gray-800 text-green-300 hover:bg-green-900 hover:text-white border-gray-700'
    : 'bg-white text-[#0a7e04] hover:bg-[#22cb0b] hover:text-white border-green-200';

  const addButtonClass = theme === 'dark'
    ? 'bg-gradient-to-r from-green-600 to-green-800 hover:from-green-500 hover:to-green-700'
    : 'bg-gradient-to-r from-[#22cb0b] to-[#0a7e04]';

  const coverIconClass = theme === 'dark'
    ? 'text-green-500/40'
    : 'text-[#22cb0b]/40';

  // Image upload function - FROM UPDATE PAGE
  const uploadImage = async (file) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post("http://localhost:8800/upload", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setBook(prev => ({ ...prev, cover: response.data.url }));
      setImageError(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image. Please try again or use a URL instead.");
    } finally {
      setIsUploading(false);
    }
  };

  // Function to trigger file input click - FROM UPDATE PAGE
  const triggerFileInput = () => {
    document.getElementById('addCoverImageInput').click();
  };

  // Initialize editor when component mounts
  useEffect(() => {
    if (editorRef.current && !isEditorReady) {
      if (book.desc) {
        editorRef.current.innerHTML = book.desc;
        applyListStyles();
      } else {
        editorRef.current.innerHTML = `<p style="color: ${theme === 'dark' ? '#9ca3af' : '#9ca3af'};">Start typing here...</p>`;
      }
      setIsEditorReady(true);
    }
  }, [isEditorReady, book.desc, theme]);

  // Apply styles to lists and headings
  const applyListStyles = () => {
    if (!editorRef.current) return;
    
    const lists = editorRef.current.querySelectorAll('ul, ol');
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
    
    const listItems = editorRef.current.querySelectorAll('li');
    listItems.forEach(li => {
      li.style.marginBottom = '4px';
      li.style.display = 'list-item';
    });
    
    const headings = editorRef.current.querySelectorAll('h1, h2, h3, h4');
    headings.forEach(heading => {
      if (heading.tagName === 'H1') {
        heading.style.fontSize = '1.875rem';
        heading.style.fontWeight = 'bold';
        heading.style.marginBottom = '1rem';
      } else if (heading.tagName === 'H2') {
        heading.style.fontSize = '1.5rem';
        heading.style.fontWeight = 'bold';
        heading.style.marginBottom = '0.75rem';
      } else if (heading.tagName === 'H3') {
        heading.style.fontSize = '1.25rem';
        heading.style.fontWeight = 'bold';
        heading.style.marginBottom = '0.5rem';
      } else if (heading.tagName === 'H4') {
        heading.style.fontSize = '1.125rem';
        heading.style.fontWeight = 'bold';
        heading.style.marginBottom = '0.5rem';
      }
    });
  };

  // Track current text style based on cursor position
  useEffect(() => {
    const updateSelectedStyle = () => {
      if (!editorRef.current) return;
      
      const selection = window.getSelection();
      if (selection.rangeCount === 0) return;
      
      const node = selection.anchorNode;
      if (!node) return;
      
      let element = node.nodeType === 3 ? node.parentElement : node;
      
      while (element && element !== editorRef.current) {
        const tag = element.tagName.toLowerCase();
        if (['h1', 'h2', 'h3', 'h4', 'p', 'div', 'ul', 'ol', 'li'].includes(tag)) {
          if (['ul', 'ol', 'li'].includes(tag)) {
            setSelectedStyle("p");
          } else {
            setSelectedStyle(tag);
          }
          return;
        }
        element = element.parentElement;
      }
      
      setSelectedStyle("p");
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('click', updateSelectedStyle);
      editor.addEventListener('keyup', updateSelectedStyle);
      
      return () => {
        editor.removeEventListener('click', updateSelectedStyle);
        editor.removeEventListener('keyup', updateSelectedStyle);
      };
    }
  }, []);

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (e.target.name === 'cover') {
      setImageError(false);
    }
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      applyListStyles();
      const content = editorRef.current.innerHTML;
      setBook((prev) => ({ ...prev, desc: content }));
    }
  };

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    handleEditorChange();
    editorRef.current.focus();
  };

  const formatBlock = (tagName) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      const wrapper = document.createElement(tagName);
      
      if (tagName === 'h1') {
        wrapper.style.fontSize = '1.875rem';
        wrapper.style.fontWeight = 'bold';
        wrapper.style.marginBottom = '1rem';
      } else if (tagName === 'h2') {
        wrapper.style.fontSize = '1.5rem';
        wrapper.style.fontWeight = 'bold';
        wrapper.style.marginBottom = '0.75rem';
      } else if (tagName === 'h3') {
        wrapper.style.fontSize = '1.25rem';
        wrapper.style.fontWeight = 'bold';
        wrapper.style.marginBottom = '0.5rem';
      } else if (tagName === 'h4') {
        wrapper.style.fontSize = '1.125rem';
        wrapper.style.fontWeight = 'bold';
        wrapper.style.marginBottom = '0.5rem';
      }
      
      wrapper.textContent = selectedText;
      range.deleteContents();
      range.insertNode(wrapper);
    } else {
      document.execCommand('formatBlock', false, `<${tagName}>`);
    }
    
    handleEditorChange();
    editorRef.current.focus();
    setSelectedStyle(tagName);
  };

  const insertList = (type) => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const parentElement = range.commonAncestorContainer.parentElement;
    
    const isInList = parentElement.closest('ul, ol, li');
    
    if (isInList) {
      document.execCommand('outdent');
    } else {
      if (type === 'insertUnorderedList') {
        document.execCommand('insertUnorderedList');
      } else if (type === 'insertOrderedList') {
        document.execCommand('insertOrderedList');
      }
      
      setTimeout(() => {
        applyListStyles();
      }, 10);
    }
    
    handleEditorChange();
    editorRef.current.focus();
  };

  const clearFormatting = () => {
    document.execCommand("removeFormat");
    handleEditorChange();
    editorRef.current.focus();
    setSelectedStyle("p");
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (editorRef.current) {
        const emptyPs = editorRef.current.querySelectorAll('p:empty, p:has(br:only-child)');
        emptyPs.forEach(p => p.remove());
      }
      
      const htmlContent = editorRef.current?.innerHTML || "";
      const noteData = {
        title: book.title,
        category: book.category || "Uncategorized",
        desc: htmlContent,
        cover: book.cover || "", // Empty string if no cover image
      };
      
      await axios.post("http://localhost:8800/note", noteData);
      navigate("/allnotes");
    } catch (err) {
      console.log(err);
      alert("Failed to add note. Please try again.");
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${mainBgClass}`}>
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Back button */}
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

        {/* Main card container */}
        <div className={`relative backdrop-blur-xl rounded-3xl shadow-2xl border overflow-hidden transition-all duration-500 ${cardBgClass} ${cardBorderClass}`}>
          
          {/* Glow Effect */}
          <div className={`absolute inset-0 rounded-3xl blur-2xl opacity-20 ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-gray-700 to-green-900/50' 
              : 'bg-gradient-to-r from-green-200 to-emerald-200'
          }`}></div>

          {/* Cover Image Section with hover change button */}
          <div className="relative group">
            {book.cover && !imageError ? (
              <div className={`relative w-full h-64 ${coverBgClass}`}>
                <img
                  src={book.cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
                {/* Dark overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                
                {/* Change Image Button - Appears on hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={triggerFileInput}
                    disabled={isUploading}
                    className={`flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-xl shadow-lg backdrop-blur-sm transition-all transform hover:scale-105 ${
                      theme === 'dark' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-[#22cb0b] hover:bg-[#0a7e04]'
                    } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Change Cover</span>
                      </>
                    )}
                  </button>
                </div>
                
                {/* Remove Image Button - Appears on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={() => {
                      setBook(prev => ({ ...prev, cover: "" }));
                      setImageError(false);
                    }}
                    className="p-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full backdrop-blur-sm transition-all hover:scale-110"
                    title="Remove cover image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className={`relative w-full h-48 flex flex-col items-center justify-center overflow-hidden ${coverEmptyBgClass} cursor-pointer border-2 border-dashed ${
                  theme === 'dark'
                    ? `${isDragging ? 'border-green-500 bg-gray-700/50' : 'border-gray-600 hover:border-green-500'}`
                    : `${isDragging ? 'border-[#22cb0b] bg-green-100/50' : 'border-green-200 hover:border-[#22cb0b]'}`
                } transition-all`}
                onClick={() => !isUploading && triggerFileInput()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!isUploading) setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsDragging(false);
                  
                  if (isUploading) return;
                  
                  const file = e.dataTransfer.files[0];
                  if (file && file.type.startsWith('image/')) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert("Image size too large. Please select an image under 5MB.");
                      return;
                    }
                    await uploadImage(file);
                  }
                }}
              >
                {isUploading ? (
                  <>
                    <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin border-green-500"></div>
                    <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Uploading image...
                    </p>
                  </>
                ) : imageError ? (
                  <>
                    <svg className={`w-16 h-16 ${theme === 'dark' ? 'text-red-500/40' : 'text-red-500/40'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Image failed to load. Click or drag to replace.
                    </p>
                    <button
                      onClick={triggerFileInput}
                      className={`mt-3 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                        theme === 'dark'
                          ? 'bg-gray-700 text-green-300 hover:bg-gray-600'
                          : 'bg-green-100 text-[#0a7e04] hover:bg-green-200'
                      }`}
                    >
                      Select Image
                    </button>
                  </>
                ) : (
                  <>
                    <svg className={`w-16 h-16 ${coverIconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className={`mt-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Drag & drop an image here or click to select
                    </p>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                      Supports: JPG, PNG, GIF, WEBP (Max 5MB)
                    </p>
                  </>
                )}
              </div>
            )}
            
            {/* Hidden file input */}
            <input
              type="file"
              id="addCoverImageInput"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file && !isUploading) {
                  if (file.size > 5 * 1024 * 1024) {
                    alert("Image size too large. Please select an image under 5MB.");
                    return;
                  }
                  await uploadImage(file);
                }
                e.target.value = ''; // Reset input
              }}
            />
          </div>

          {/* Content area */}
          <div className="relative p-8 md:p-12">

            {/* Cover image URL input */}
            <div className="mb-8">
              <div className={`text-xs font-bold mb-2 ${
                theme === 'dark' ? 'text-green-400' : 'text-[#0a7e04]'
              }`}>COVER IMAGE URL</div>
              <input
                type="text"
                name="cover"
                value={book.cover}
                onChange={handleChange}
                placeholder="Paste image URL... (Optional)"
                disabled={isUploading}
                className={`w-full px-0 py-3 text-sm border-0 border-b-2 outline-none bg-transparent transition-colors ${
                  theme === 'dark' 
                    ? 'border-gray-700 focus:border-green-500 text-gray-200 placeholder-gray-500 disabled:opacity-50' 
                    : 'border-green-100 focus:border-[#22cb0b] text-gray-800 disabled:opacity-50'
                }`}
              />
              <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                Leave empty for no cover image
              </p>
            </div>

            {/* Title input */}
            <div className="mb-6">
              <input
                type="text"
                name="title"
                value={book.title}
                onChange={handleChange}
                placeholder="Untitled"
                className={`w-full px-0 py-3 text-4xl md:text-5xl font-black text-transparent bg-clip-text border-0 outline-none bg-transparent ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-green-300 to-green-500' 
                    : 'bg-gradient-to-r from-[#0a7e04] to-[#22cb0b]'
                }`}
                style={{ caretColor: theme === 'dark' ? '#22c55e' : '#22cb0b' }}
              />
            </div>

            {/* Category input */}
            <div className={`mb-8 flex items-center gap-3 p-3 rounded-xl transition-all ${
              theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-green-50'
            }`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${categoryIconClass}`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="category"
                value={book.category}
                onChange={handleChange}
                placeholder="Add a category... (Optional)"
                className={`flex-1 px-0 py-2 text-base font-medium border-0 outline-none bg-transparent ${
                  theme === 'dark' ? 'text-gray-200 placeholder-gray-500' : 'text-gray-800'
                }`}
              />
            </div>

            {/* Rich text editor toolbar */}
            <div className={`mb-4 flex flex-wrap gap-2 p-3 rounded-xl border ${toolbarBgClass}`}>
              {/* Text styles dropdown */}
              <div className="flex items-center gap-1">
                <select
                  className={`px-2 py-1.5 text-xs border rounded-lg transition cursor-pointer outline-none ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
                      : 'bg-white border-green-200 hover:bg-green-100 text-gray-800'
                  }`}
                  onChange={(e) => formatBlock(e.target.value)}
                  value={selectedStyle}
                >
                  <option value="p">Normal Text</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                  <option value="h4">Heading 4</option>
                </select>
              </div>

              {/* Text formatting buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => formatText('bold')}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition ${toolbarButtonClass}`}
                  title="Bold (Ctrl+B)"
                >
                  <span className="font-bold text-sm">B</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => formatText('italic')}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition ${toolbarButtonClass}`}
                  title="Italic (Ctrl+I)"
                >
                  <span className="italic text-sm">I</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => formatText('underline')}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition ${toolbarButtonClass}`}
                  title="Underline (Ctrl+U)"
                >
                  <span className="underline text-sm">U</span>
                </button>
                
                <button
                  type="button"
                  onClick={clearFormatting}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition ${toolbarButtonClass}`}
                  title="Clear Formatting"
                >
                  <span className="text-sm">⎌</span>
                </button>
              </div>

              {/* List buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertList('insertUnorderedList')}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition ${toolbarButtonClass}`}
                  title="Bullet List (Toggle)"
                >
                  <span className="text-lg">•</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => insertList('insertOrderedList')}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition ${toolbarButtonClass}`}
                  title="Numbered List (Toggle)"
                >
                  <span className="text-sm">1.</span>
                </button>
              </div>

              {/* Text alignment */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => formatText('justifyLeft')}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition ${toolbarButtonClass}`}
                  title="Align Left"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => formatText('justifyCenter')}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg transition ${toolbarButtonClass}`}
                  title="Align Center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm3 5a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Rich text editor area */}
            <div className={`mb-8 p-4 rounded-xl transition-all min-h-[300px] ${editorBgClass}`}>
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorChange}
                onBlur={handleEditorChange}
                className={`w-full min-h-[300px] px-0 py-2 border-0 outline-none resize-none bg-transparent focus:outline-none focus:ring-0 cursor-text ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}
                style={{
                  lineHeight: '1.6',
                  fontSize: '16px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
              />
            </div>

            {/* User tip */}
            <div className={`mb-4 p-3 border rounded-lg ${tipBgClass}`}>
              <p className={`text-xs ${tipTextClass}`}>
                <strong>Tip:</strong> Select text and use the toolbar above to format. Your formatting will be saved as HTML and displayed properly when viewing notes.
              </p>
            </div>

            {/* Action buttons */}
            <div className={`flex justify-end gap-3 pt-6 border-t ${
              theme === 'dark' ? 'border-gray-700' : 'border-green-100'
            }`}>
              <button
                onClick={() => navigate("/allnotes")}
                disabled={isUploading}
                className={`px-6 py-3 font-semibold border-2 rounded-xl transition ${
                  theme === 'dark'
                    ? 'text-green-300 border-gray-700 hover:bg-gray-700 disabled:opacity-50 disabled:hover:bg-transparent'
                    : 'text-[#0a7e04] border-green-100 hover:bg-green-50 disabled:opacity-50 disabled:hover:bg-transparent'
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handleClick}
                disabled={isUploading}
                className={`px-8 py-3 font-bold text-white rounded-xl shadow-lg hover:shadow-xl transition ${addButtonClass} ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploading ? 'Uploading...' : 'Add Note'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;