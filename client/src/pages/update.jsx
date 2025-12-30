import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Update = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const idNote = location.pathname.split("/")[2];

  // Fetch existing note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await fetch(`http://localhost:8800/note/${idNote}`);
        const data = await res.json();
        setBook({
          title: data.title || "",
          desc: data.desc || "",
          cover: data.cover || "",
          category: data.category || "",
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchNote();
  }, [idNote]);

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await fetch("http://localhost:8800/note/" + idNote, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      navigate("/allnotes");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-lime-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#22cb0b] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-2xl font-semibold text-[#0a7e04]">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* Header with enhanced back button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/allnotes")}
            className="group inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0a7e04] hover:text-white bg-white hover:bg-[#22cb0b] rounded-xl shadow-2xl hover:shadow-2xl transition-all duration-300 border border-green-200">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to notes
          </button>
        </div>

        {/* Enhanced Card with glassmorphism effect */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-100 overflow-hidden hover:shadow-green-200/50 transition-all duration-500">
          
          {/* Cover Image Section with gradient overlay */}
          <div className="relative group">
            {book.cover ? (
              <div className="relative w-full h-64 bg-gradient-to-br from-[#22cb0b]/20 to-[#0a7e04]/20">
                <img 
                  src={book.cover} 
                  alt="Cover" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a7e04]/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white text-sm font-semibold px-6 py-3 bg-[#22cb0b] hover:bg-[#0a7e04] rounded-xl shadow-lg backdrop-blur-sm transition-all">
                    Change cover
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-48 bg-gradient-to-br from-[#22cb0b]/10 via-green-50 to-[#0a7e04]/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 shimmer-effect"></div>
                <svg className="relative z-10 w-16 h-16 text-[#22cb0b]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12">
            
            {/* Cover URL Input */}
            <div className="mb-8 group">
              <div className="flex items-center text-xs font-bold text-[#0a7e04] mb-2 opacity-60 group-hover:opacity-100 transition-all">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                COVER IMAGE URL
              </div>
              <input
                type="text"
                name="cover"
                value={book.cover}
                onChange={handleChange}
                placeholder="Paste the URL of an image..."
                className="w-full px-0 py-3 text-sm text-gray-700 border-0 border-b-2 border-green-100 hover:border-[#22cb0b]/50 focus:border-[#22cb0b] outline-none transition-all bg-transparent placeholder-gray-400"
              />
            </div>

            {/* Title Input - Large with gradient effect on focus */}
            <div className="mb-6 group">
              <input
                type="text"
                name="title"
                value={book.title}
                onChange={handleChange}
                placeholder="Untitled"
                className="w-full px-0 py-3 text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#0a7e04] to-[#22cb0b] border-0 outline-none bg-transparent placeholder-gray-300 transition-all"
                style={{ caretColor: '#22cb0b' }}
              />
            </div>

            {/* Category Input with enhanced icon */}
            <div className="mb-8 flex items-center gap-3 group p-3 rounded-xl hover:bg-gradient-to-r hover:from-[#22cb0b]/5 hover:to-transparent transition-all">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#22cb0b] to-[#0a7e04] shadow-lg shadow-green-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <input
                type="text"
                name="category"
                value={book.category}
                onChange={handleChange}
                placeholder="Add a category..."
                className="flex-1 px-0 py-2 text-base font-medium text-[#0a7e04] border-0 outline-none bg-transparent placeholder-gray-400"
                style={{ caretColor: '#22cb0b' }}
              />
            </div>

            {/* Description - Enhanced textarea */}
            <div className="mb-8 p-4 rounded-xl hover:bg-gradient-to-br hover:from-green-50/50 hover:to-transparent transition-all">
              <textarea
                rows="10"
                name="desc"
                value={book.desc}
                onChange={handleChange}
                placeholder="Start writing your note... ✨"
                className="w-full px-0 py-2 text-base text-gray-700 leading-relaxed border-0 outline-none resize-none bg-transparent placeholder-gray-400"
                style={{ caretColor: '#22cb0b' }}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-gradient-to-r from-green-100 to-transparent">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4 text-[#22cb0b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last edited {new Date().toLocaleDateString()}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/allnotes")}
                  className="px-6 py-3 text-sm font-semibold text-[#0a7e04] hover:text-[#22cb0b] hover:bg-green-50 rounded-xl transition-all duration-300 border-2 border-green-100 hover:border-[#22cb0b]/30">
                  Cancel
                </button>

                <button
                  onClick={handleClick}
                  className="group relative px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#22cb0b] to-[#0a7e04] hover:from-[#0a7e04] hover:to-[#22cb0b] rounded-xl shadow-lg shadow-green-300/50 hover:shadow-xl hover:shadow-green-400/50 transition-all duration-300 overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2">
                    Update Note
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Update;