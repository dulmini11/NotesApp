import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Add = () => {
  // State for note data (title, description, cover image URL, category)
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    category: "",
  });

  // Navigation
  const navigate = useNavigate();
  
  // Ref to access the contentEditable div for rich text editing
  const editorRef = useRef(null);
  
  // Tracks if the rich text editor has been initialized
  const [isEditorReady, setIsEditorReady] = useState(false);
  
  // Tracks current text style (paragraph, heading, etc.) for the dropdown
  const [selectedStyle, setSelectedStyle] = useState("p");

  // Initialize editor when component mounts
  useEffect(() => {
    if (editorRef.current && !isEditorReady) {
      if (book.desc) {
        editorRef.current.innerHTML = book.desc;
        applyListStyles();
      } else {
        editorRef.current.innerHTML = '<p style="color: #9ca3af;">Start typing here...</p>';
      }
      setIsEditorReady(true);
    }
  }, [isEditorReady, book.desc]);

  // Apply styles to lists and headings
  const applyListStyles = () => {
    if (!editorRef.current) return;
    
    // Apply styles to all unordered and ordered lists
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
    
    // Style list items
    const listItems = editorRef.current.querySelectorAll('li');
    listItems.forEach(li => {
      li.style.marginBottom = '4px';
      li.style.display = 'list-item';
    });
    
    // Apply consistent heading styles
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
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      applyListStyles();
      const content = editorRef.current.innerHTML;
      setBook((prev) => ({ ...prev, desc: content }));
    }
  };

  // Basic text formatting (bold, italic, underline)
  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
    handleEditorChange();
    editorRef.current.focus();
  };

  // Block-level formatting (Headings)
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

  // Create bullet or numbered lists
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
        ...book,
        desc: htmlContent,
      };
      
      await axios.post("http://localhost:8800/note", noteData);
      navigate("/allnotes");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/allnotes")}
            className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0a7e04] hover:text-white bg-white hover:bg-[#22cb0b] rounded-xl shadow-2xl transition-all duration-300 border border-green-200"
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
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 overflow-hidden transition-all duration-500">

          {/* Cover image preview */}
          <div className="relative">
            {book.cover ? (
              <div className="w-full h-64 bg-gradient-to-br from-[#22cb0b]/20 to-[#0a7e04]/20">
                <img
                  src={book.cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              </div>
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-[#22cb0b]/10 via-green-50 to-[#0a7e04]/10 flex items-center justify-center">
                <svg className="w-16 h-16 text-[#22cb0b]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Content area */}
          <div className="p-8 md:p-12">

            {/* Cover image URL input */}
            <div className="mb-8">
              <div className="text-xs font-bold text-[#0a7e04] mb-2">COVER IMAGE URL</div>
              <input
                type="text"
                name="cover"
                value={book.cover}
                onChange={handleChange}
                placeholder="Paste image URL..."
                className="w-full px-0 py-3 text-sm border-0 border-b-2 border-green-100 focus:border-[#22cb0b] outline-none bg-transparent"
              />
            </div>

            {/* Title input */}
            <div className="mb-6">
              <input
                type="text"
                name="title"
                value={book.title}
                onChange={handleChange}
                placeholder="Untitled"
                className="w-full px-0 py-3 text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0a7e04] to-[#22cb0b] border-0 outline-none bg-transparent"
                style={{ caretColor: "#22cb0b" }}
              />
            </div>

            {/* Category input */}
            <div className="mb-8 flex items-center gap-3 p-3 rounded-xl hover:bg-green-50 transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#22cb0b] to-[#0a7e04]">
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
                placeholder="Add a category..."
                className="flex-1 px-0 py-2 text-base font-medium border-0 outline-none bg-transparent"
              />
            </div>

            {/* Rich text editor toolbar */}
            <div className="mb-4 flex flex-wrap gap-2 p-3 bg-green-50/50 rounded-xl border border-green-100">
              {/* Text styles dropdown */}
              <div className="flex items-center gap-1">
                <select
                  className="px-2 py-1.5 text-xs bg-white border border-green-200 rounded-lg hover:bg-green-100 transition cursor-pointer outline-none"
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
                  className="w-8 h-8 flex items-center justify-center bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                  title="Bold (Ctrl+B)"
                >
                  <span className="font-bold text-sm text-black">B</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => formatText('italic')}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                  title="Italic (Ctrl+I)"
                >
                  <span className="italic text-sm text-black">I</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => formatText('underline')}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                  title="Underline (Ctrl+U)"
                >
                  <span className="underline text-sm text-black">U</span>
                </button>
                
                <button
                  type="button"
                  onClick={clearFormatting}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                  title="Clear Formatting"
                >
                  <span className="text-sm text-black">⎌</span>
                </button>
              </div>

              {/* List buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertList('insertUnorderedList')}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                  title="Bullet List (Toggle)"
                >
                  <span className="text-lg text-black">•</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => insertList('insertOrderedList')}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                  title="Numbered List (Toggle)"
                >
                  <span className="text-sm text-black">1.</span>
                </button>
              </div>

              {/* Text alignment */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => formatText('justifyLeft')}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                  title="Align Left"
                >
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <button
                  type="button"
                  onClick={() => formatText('justifyCenter')}
                  className="w-8 h-8 flex items-center justify-center bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                  title="Align Center"
                >
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm3 5a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Rich text editor area */}
            <div className="mb-8 p-4 rounded-xl hover:bg-green-50 transition-all min-h-[300px]">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorChange}
                onBlur={handleEditorChange}
                className="w-full min-h-[300px] px-0 py-2 border-0 outline-none resize-none bg-transparent text-gray-800 focus:outline-none focus:ring-0 cursor-text"
                style={{
                  lineHeight: '1.6',
                  fontSize: '16px',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
              />
            </div>

            {/* User tip */}
            <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Tip:</strong> Select text and use the toolbar above to format. Your formatting will be saved as HTML and displayed properly when viewing notes.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-green-100">
              <button
                onClick={() => navigate("/allnotes")}
                className="px-6 py-3 font-semibold text-[#0a7e04] border-2 border-green-100 rounded-xl hover:bg-green-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleClick}
                className="px-8 py-3 font-bold text-white bg-gradient-to-r from-[#22cb0b] to-[#0a7e04] rounded-xl shadow-lg hover:shadow-xl transition"
              >
                Add Note
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;