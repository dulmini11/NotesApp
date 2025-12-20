import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [book, setBook] = useState({
    title: "",
    desc: "",
    cover: "",
    category: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBook(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/note", book);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(book);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-8" style={{background: '#ffffff'}}>
      {/* 3D Ball - Top Right with Animation */}
      <div className="absolute top-20 right-20 w-80 h-80 rounded-full opacity-70" style={{
        background: 'radial-gradient(circle at 30% 30%, #2ef015, #22cb0b, #1ea309, #16850a)',
        boxShadow: 'inset -30px -30px 60px rgba(0, 0, 0, 0.3), inset 20px 20px 40px rgba(255, 255, 255, 0.1), 0 30px 80px rgba(34, 203, 11, 0.4), 0 10px 40px rgba(0, 0, 0, 0.3)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      
      {/* 3D Ball - Bottom Left with Animation */}
      <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full opacity-70" style={{
        background: 'radial-gradient(circle at 30% 30%, #2ef015, #22cb0b, #1ea309, #16850a)',
        boxShadow: 'inset -30px -30px 60px rgba(0, 0, 0, 0.3), inset 20px 20px 40px rgba(255, 255, 255, 0.1), 0 30px 80px rgba(34, 203, 11, 0.4), 0 10px 40px rgba(0, 0, 0, 0.3)',
        animation: 'float 6s ease-in-out infinite 3s'
      }}></div>
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-25px) translateX(5px);
          }
        }
      `}</style>
      
      {/* Container */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="rounded-3xl p-8 shadow-2xl backdrop-blur-xl border border-white border-opacity-40" style={{
          background: 'rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 20px -5px rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.5)'
        }}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Add New Note</h1>
            <p className="text-gray-600 mt-2">Create and organize your content</p>
          </div>

          {/* Cover Image Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Cover Image</label>
            <div className="rounded-2xl p-6 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer" style={{
              background: 'rgba(255, 255, 255, 0.8)'
            }}>
              <div className="flex flex-col items-center justify-center">
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="text-sm font-medium text-gray-700 mb-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mb-3">PNG, JPG, GIF up to 10MB</p>
                <input
                  type="text"
                  placeholder="Or paste image URL here"
                  onChange={handleChange}
                  name="cover"
                  className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 outline-none text-sm text-gray-700 placeholder-gray-400" style={{
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Title and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
              <input
                type="text"
                placeholder="Enter note title"
                onChange={handleChange}
                name="title"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-gray-800 placeholder-gray-400 transition-all" style={{
                  background: 'rgba(255, 255, 255, 0.8)'
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = '0 0 0 3px rgba(34, 203, 11, 0.2)';
                  e.target.style.borderColor = '#22cb0b';
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = 'none';
                  e.target.style.borderColor = '#d1d5db';
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Add category"
                  onChange={handleChange}
                  name="category"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-gray-800 placeholder-gray-400 transition-all" style={{
                    background: 'rgba(255, 255, 255, 0.8)'
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = '0 0 0 3px rgba(34, 203, 11, 0.2)';
                    e.target.style.borderColor = '#22cb0b';
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = 'none';
                    e.target.style.borderColor = '#d1d5db';
                  }}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              rows="8"
              placeholder="Write your note description here..."
              onChange={handleChange}
              name="desc"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none text-gray-800 placeholder-gray-400 resize-none transition-all" style={{
                background: 'rgba(255, 255, 255, 0.8)'
              }}
              onFocus={(e) => {
                e.target.style.boxShadow = '0 0 0 3px rgba(34, 203, 11, 0.2)';
                e.target.style.borderColor = '#22cb0b';
              }}
              onBlur={(e) => {
                e.target.style.boxShadow = 'none';
                e.target.style.borderColor = '#d1d5db';
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl font-semibold text-gray-700 transition-all hover:shadow-lg" style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #d1d5db'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(243, 244, 246, 1)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.8)'}
            >
              Cancel
            </button>
            <button
              onClick={handleClick}
              className="px-8 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 hover:shadow-2xl text-white" style={{
                background: '#22cb0b'
              }}
            >
              Add Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;