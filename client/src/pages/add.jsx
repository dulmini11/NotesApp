import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    category: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/note", book);
      navigate("/allnotes");
    } catch (err) {
      console.log(err);
    }
  };

  // Formatting handlers
  const applyFormatting = (format) => {
    const textarea = document.querySelector('textarea[name="desc"]');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = book.desc;
    
    let formattedText = "";
    let newCursorPos = 0;

    switch(format) {
      case 'bold':
        formattedText = text.substring(0, start) + "**" + 
                        text.substring(start, end) + "**" + 
                        text.substring(end);
        newCursorPos = end + 4;
        break;
      case 'header1':
        formattedText = text.substring(0, start) + "# " + 
                        text.substring(start, end) + 
                        text.substring(end);
        newCursorPos = end + 2;
        break;
      case 'header2':
        formattedText = text.substring(0, start) + "## " + 
                        text.substring(start, end) + 
                        text.substring(end);
        newCursorPos = end + 3;
        break;
      case 'header3':
        formattedText = text.substring(0, start) + "### " + 
                        text.substring(start, end) + 
                        text.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        formattedText = text.substring(0, start) + "*" + 
                        text.substring(start, end) + "*" + 
                        text.substring(end);
        newCursorPos = end + 2;
        break;
      case 'list':
        formattedText = text.substring(0, start) + "- " + 
                        text.substring(start, end) + 
                        text.substring(end);
        newCursorPos = end + 2;
        break;
      case 'code':
        formattedText = text.substring(0, start) + "`" + 
                        text.substring(start, end) + "`" + 
                        text.substring(end);
        newCursorPos = end + 2;
        break;
      case 'quote':
        formattedText = text.substring(0, start) + "> " + 
                        text.substring(start, end) + 
                        text.substring(end);
        newCursorPos = end + 2;
        break;
      default:
        return;
    }

    setBook(prev => ({ ...prev, desc: formattedText }));
    
    // Focus back on textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
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

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 overflow-hidden transition-all duration-500">

          {/* Cover Preview */}
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

          {/* Content */}
          <div className="p-8 md:p-12">

            {/* Cover URL */}
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

            {/* Title */}
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

            {/* Category */}
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

            {/* Formatting Toolbar */}
            <div className="mb-4 flex flex-wrap gap-2 p-3 bg-green-50/50 rounded-xl">
              <div className="text-xs font-semibold text-[#0a7e04] mr-3 self-center">Formatting:</div>
              
              <button
                type="button"
                onClick={() => applyFormatting('bold')}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                title="Bold (Ctrl+B)"
              >
                <strong>B</strong>
              </button>
              
              <button
                type="button"
                onClick={() => applyFormatting('italic')}
                className="px-3 py-1.5 text-xs italic bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                title="Italic (Ctrl+I)"
              >
                I
              </button>
              
              <button
                type="button"
                onClick={() => applyFormatting('header1')}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                title="Heading 1"
              >
                H1
              </button>
              
              <button
                type="button"
                onClick={() => applyFormatting('header2')}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                title="Heading 2"
              >
                H2
              </button>
              
              <button
                type="button"
                onClick={() => applyFormatting('header3')}
                className="px-3 py-1.5 text-xs font-bold bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                title="Heading 3"
              >
                H3
              </button>
              
              <button
                type="button"
                onClick={() => applyFormatting('list')}
                className="px-3 py-1.5 text-xs bg-white border border-green-200 rounded-lg hover:bg-green-100 transition flex items-center gap-1"
                title="Bullet List"
              >
                <span>•</span> List
              </button>
              
              <button
                type="button"
                onClick={() => applyFormatting('code')}
                className="px-3 py-1.5 text-xs bg-white border border-green-200 rounded-lg hover:bg-green-100 transition font-mono"
                title="Inline Code"
              >
                {`</>`}
              </button>
              
              <button
                type="button"
                onClick={() => applyFormatting('quote')}
                className="px-3 py-1.5 text-xs bg-white border border-green-200 rounded-lg hover:bg-green-100 transition"
                title="Blockquote"
              >
                ❝ Quote
              </button>
            </div>

            {/* Description */}
            <div className="mb-8 p-4 rounded-xl hover:bg-green-50 transition-all">
              <textarea
                rows="10"
                name="desc"
                value={book.desc}
                onChange={handleChange}
                placeholder="Start writing your note... ✨
                
Formatting examples (click buttons above or type manually):
# Header 1
## Header 2
### Header 3
**Bold text**
*Italic text*
- Bullet list item
> Blockquote text
`Inline code snippet`"
                className="w-full px-0 py-2 border-0 outline-none resize-none bg-transparent text-sm"
              />
            </div>

            {/* Actions */}
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